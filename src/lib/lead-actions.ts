import { createServerFn } from "@tanstack/react-start";
import { classifyCalendlyInvitee, resolvePreviousSlot, formatCalendlySlot } from "./calendly-status";
import {
  saveLead as saveLeadToDb,
  getLeads as getLeadsFromDb,
  countTableRows,
  getOrders as getOrdersForCountsFromDb,
  getCrmSettings as getCrmSettingsFromDb,
  countRecentFailedLogins,
  saveCrmSettings as saveCrmSettingsToDb,
  updateLead as updateLeadInDb,
  updateLeadStatus as updateStatusInDb,
  updateProjectStatus as updateProjectStatusInDb,
  softDeleteLead as softDeleteInDb,
  restoreLead as restoreLeadInDb,
  permanentDeleteLead as permanentDeleteInDb,
  emptyRecycleBin as emptyRecycleBinInDb,
  addActivityLog as addActivityLogInDb,
  getActivityLogs as getActivityLogsFromDb,
  deleteActivityLog as deleteActivityLogInDb,
  deleteActivityLogsBulk as deleteActivityLogsBulkInDb,
  deleteLoginLogs as deleteLoginLogsInDb,
  clearAllActivityLogs as clearAllActivityLogsInDb,
  addLoginLog as addLoginLogInDb,
  getLoginLogs as getLoginLogsFromDb,
  getAdminUsers as getAdminUsersFromDb,
  getAdminUserByEmailWithPassword,
  getAdminAccountState,
  getAccountSetupError,
  saveAdminUser as saveAdminUserInDb,
  updateAdminUserStatus as updateAdminUserStatusInDb,
  deleteAdminUser as deleteAdminUserInDb,
  saveCalendlyMeeting as saveCalendlyMeetingInDb,
  getCalendlyMeetings as getCalendlyMeetingsFromDb,
  updateCalendlyMeetingStatus as updateCalendlyMeetingStatusInDb,
  updateCalendlyMeetingDetails as updateCalendlyMeetingDetailsInDb,
  softDeleteCalendlyMeeting as softDeleteCalendlyMeetingInDb,
  softDeleteCalendlyMeetings as softDeleteCalendlyMeetingsInDb,
  permanentDeleteCalendlyMeeting as permanentDeleteCalendlyMeetingInDb,
  permanentDeleteCalendlyMeetings as permanentDeleteCalendlyMeetingsInDb,
  restoreCalendlyMeeting as restoreCalendlyMeetingInDb,
  rememberDeletedCalendlyMeetings,
  forgetDeletedCalendlyMeeting,
  deleteCalendlyMeeting as deleteCalendlyMeetingInDb,
  deleteCalendlyMeetings as deleteCalendlyMeetingsInDb,
  clearAllCalendlyMeetings as clearAllCalendlyMeetingsInDb,
  removePlaceholderCalendlyMeetings as removePlaceholderCalendlyMeetingsInDb,
  setCalendlyMeetingOutcome as setCalendlyMeetingOutcomeInDb,
  markPastMeetingsNotConducted as markPastMeetingsNotConductedInDb,
  MEETING_OUTCOME_STATUSES,
  type MeetingOutcome,
  saveCRMNotification as saveCRMNotificationInDb,
  getCRMNotifications as getCRMNotificationsFromDb,
  markNotificationRead as markNotificationReadInDb,
  markAllNotificationsRead as markAllNotificationsReadInDb,
  clearNotifications as clearNotificationsInDb,
  type Lead,
  type LeadStatus,
  type ProjectStatus,
  type ActivityLog,
  type LoginLog,
  type AdminUser,
  type CalendlyMeeting,
  type CRMNotification,
} from "./db";
import {
  sendLeadNotificationEmail,
  sendFailedLoginAlertEmail,
  sendAccountActivationRequestEmail,
} from "./email";
import { evaluateLocationAccess, getOfficeGeoConfig, DEFAULT_OFFICE_CONFIG } from "./geo-config";
import { createCrmSessionToken, verifySessionWithLocation, decodeAndVerifySessionToken } from "./crm-session";
import { getLiveSessionLoginLogIds, isSessionPresent, PRESENCE_STALE_MS, type SessionPresence } from "./login-sessions";

// ── Session presence (who has the CRM open and is active right now) ─────────
const PRESENCE_KEY = "session_presence";
async function readPresence(): Promise<SessionPresence> {
  try {
    const st = await getCrmSettingsFromDb();
    const parsed = JSON.parse(st[PRESENCE_KEY] || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
async function writePresence(p: SessionPresence): Promise<void> {
  const now = Date.now();
  const clean: SessionPresence = {};
  for (const [k, v] of Object.entries(p)) if (v && now - v.seen < 24 * 3600_000) clean[k] = v;
  await saveCrmSettingsToDb({ [PRESENCE_KEY]: JSON.stringify(clean) });
}
async function getInactivityMinutes(): Promise<number> {
  try {
    const n = Number((await getCrmSettingsFromDb())["inactivity_timeout"]);
    return [5, 10, 15, 30].includes(n) ? n : 10;
  } catch {
    return 10;
  }
}

/** Open CRM check-in: "I'm here, and the user was last active at <lastActive>". */
export const sessionHeartbeatServerFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | undefined; lastActive?: number | undefined }) => data)
  .handler(async ({ data }) => {
    const who = decodeAndVerifySessionToken(data.token || "");
    if (!who.valid || !who.payload) return { success: false };
    const now = Date.now();
    const lastActive = Math.min(Number(data.lastActive) || now, now);
    const p = await readPresence();
    p[who.payload.email.toLowerCase()] = { seen: now, active: lastActive };
    await writePresence(p);
    return { success: true };
  });

/** Any logout (button, inactivity, account removed): record it and clear presence. */
export const endSessionServerFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | undefined; reason?: string | undefined; userAgent?: string | undefined }) => data)
  .handler(async ({ data }) => {
    // An expired token still identifies who is logging out (signature is checked).
    const who = decodeAndVerifySessionToken(data.token || "");
    const email = who.payload?.email;
    if (!email || (!who.valid && who.error !== "Session token expired")) return { success: false };
    try {
      await addLoginLogInDb({
        email,
        role: who.payload?.role || "unknown",
        ip_address: "Unknown IP",
        location: (data.reason || "Logged out").slice(0, 120),
        user_agent: data.userAgent || "Web Browser",
        status: "session_terminated",
      });
    } catch {}
    const p = await readPresence();
    delete p[email.toLowerCase()];
    await writePresence(p);
    return { success: true };
  });

function sanitizeLeadPhone(phone: string, _isUsa: boolean = true): string {
  const trimmed = phone.trim();
  if (!trimmed) return trimmed;
  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    if (digits.length === 11 && digits.startsWith("1")) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return trimmed;
  }

  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return digits.length > 10 ? `+${digits}` : trimmed;
}

// ── Data change signal: bumped on every delete / restore so every open CRM screen reloads
//    within a few seconds (e.g. something the Super Admin deletes disappears for all users) ──
export async function bumpDataVersion(): Promise<void> {
  try {
    await saveCrmSettingsToDb({ crm_data_version: String(Date.now()) });
  } catch (e) {
    console.warn("bumpDataVersion warning:", e);
  }
}

export const fetchDataVersionServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const st = await getCrmSettingsFromDb();
    return { success: true, version: st["crm_data_version"] || "0" };
  } catch {
    return { success: false, version: "0" };
  }
});

// 1. Submit Lead from Website Forms
export const submitLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    source: "Contact Form" | "Popup Modal" | "USA - Contact Form" | "USA - Popup Modal" | string;
    name: string;
    phone: string;
    email?: string | undefined;
    videoType: string;
    videoQuantity?: number | string | undefined;
    business: string;
    website?: string | undefined;
    location?: string | undefined;
    industry?: string | undefined;
    requirement?: string | undefined;
    additional?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const isUsa = data.source?.includes("USA");
      const normalizedData = {
        ...data,
        phone: sanitizeLeadPhone(data.phone, isUsa),
      };

      const saved = await saveLeadToDb(normalizedData);

      // Log activity
      try {
        await addActivityLogInDb({
          lead_id: saved.id,
          action: saved.is_duplicate ? "Duplicate Lead Merged (Same Email)" : "Lead Submitted",
          details: saved.is_duplicate
            ? `Repeat inquiry from ${normalizedData.source} (same email: ${normalizedData.email || 'N/A'}) merged into existing lead ${saved.name}. Notes updated.`
            : `New lead received from ${saved.source} for ${saved.name} (${saved.phone})`,
          performed_by: "System / Website",
          user_role: "system",
        });
      } catch {}

      // Create CRM Notification
      try {
        const notifTitle = saved.is_duplicate ? "Duplicate Lead Received (Same Email)" : "New Website Lead Submitted";
        const notifMessage = saved.is_duplicate
          ? `Duplicate email inquiry from ${saved.name} (${saved.email || saved.phone}) - [Notes updated with new requirements]`
          : `${saved.name} (${saved.phone}) submitted from ${saved.source} - ${saved.video_type || "AI Video"}`;

        const notif = await saveCRMNotificationInDb({
          type: "lead_new",
          title: notifTitle,
          message: notifMessage,
          entity_id: saved.id,
          actor: saved.name,
        });

        broadcastLeadEvent({
          type: "NEW_LEAD",
          lead: saved,
          notification: notif,
        });
      } catch (notifErr) {
        console.warn("Failed to create CRM notification for new lead:", notifErr);
      }

      // Dispatch Email Notification
      try {
        await sendLeadNotificationEmail({
          ...normalizedData,
          leadId: saved.id,
        });
      } catch (mailError) {
        console.error("Failed to send lead notification email:", mailError);
      }

      return { success: true, lead: saved };
    } catch (error: any) {
      console.error("Error submitting lead to PostgreSQL:", error);
      return { success: false, error: error.message };
    }
  });

// 2. Fetch Leads (with optional deleted filter for Recycle Bin)
export const fetchLeadsServerFn = createServerFn({ method: "GET" })
  .validator((data?: { includeDeleted?: boolean | undefined }) => data || {})
  .handler(async ({ data }) => {
    try {
      const leads = await getLeadsFromDb(data?.includeDeleted || false);
      return { success: true, leads };
    } catch (error: any) {
      console.error("Error fetching leads:", error);
      return { success: false, leads: [] as Lead[], error: error.message };
    }
  });

// 3. Add Manual Lead (Admin / Super Admin)
export const addManualLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    source?: string | undefined;
    name: string;
    phone: string;
    email?: string | undefined;
    videoType: string;
    videoQuantity?: number | string | undefined;
    business: string;
    website?: string | undefined;
    location?: string | undefined;
    industry?: string | undefined;
    requirement?: string | undefined;
    additional?: string | undefined;
    status?: LeadStatus | undefined;
    projectStatus?: ProjectStatus | undefined;
    notes?: string | undefined;
    deliveryDate?: string | undefined;
    meetingDate?: string | undefined;
    meetingTime?: string | undefined;
    meetingLink?: string | undefined;
    meetingType?: string | undefined;
    meetingStatus?: string | undefined;
    campaignName?: string | undefined;
    adsetName?: string | undefined;
    adName?: string | undefined;
    formName?: string | undefined;
    metaLeadId?: string | undefined;
    isDuplicate?: boolean | undefined;
    assignedAdmin?: string | undefined;
    createdBy?: string | undefined;
    userRole?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const isUsa =
        (data.source || "").includes("USA") ||
        (data.location || "").toLowerCase().includes("usa") ||
        (data.phone || "").startsWith("+1");
      const leadSource = data.source || "Manual";
      const normalizedData = {
        ...data,
        source: leadSource,
        phone: sanitizeLeadPhone(data.phone, isUsa),
      };

      const saved = await saveLeadToDb(normalizedData);

      await addActivityLogInDb({
        lead_id: saved.id,
        action: `${leadSource} Lead Created`,
        details: `${leadSource} lead created for ${saved.name} (${saved.phone}) by ${data.createdBy || "Admin"}`,
        performed_by: data.createdBy || "Admin",
        user_role: data.userRole || "admin",
      });

      // Create CRM Notification (§20: New Meta lead vs New manual lead)
      try {
        const isMeta =
          (data.source || "").toLowerCase().includes("meta") ||
          (data.source || "").toLowerCase().includes("facebook") ||
          (data.source || "").toLowerCase().includes("instagram");
        const notifType = isMeta ? "lead_meta" : "lead_manual";
        const notifTitle = isMeta ? "New Meta Lead Received" : "New Manual Lead Created";

        const notif = await saveCRMNotificationInDb({
          type: notifType,
          title: notifTitle,
          message: `${leadSource} lead created for ${saved.name} (${saved.phone}) by ${data.createdBy || "Admin"}`,
          entity_id: saved.id,
          actor: data.createdBy || "Admin",
        });

        broadcastLeadEvent({
          type: "NEW_LEAD",
          lead: saved,
          notification: notif,
        });
      } catch (notifErr) {
        console.warn("Failed to create manual/meta lead CRM notification:", notifErr);
      }

      return { success: true, lead: saved };
    } catch (error: any) {
      console.error("Error adding manual lead:", error);
      return { success: false, error: error.message };
    }
  });

// 4. Update Lead Full Info
export const updateLeadDetailsServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    id: string;
    updates: Partial<Lead>;
    updatedBy?: string | undefined;
    userRole?: string | undefined;
    changeSummary?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await updateLeadInDb(data.id, data.updates);
      if (ok && data.changeSummary) {
        await addActivityLogInDb({
          lead_id: data.id,
          action: "Lead Updated",
          details: data.changeSummary,
          performed_by: data.updatedBy || "Admin",
          user_role: data.userRole || "admin",
        });
      }
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 5. Update Lead Status (with Closed Logic)
export const updateLeadStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    id: string;
    status: LeadStatus;
    closedBy?: string | undefined;
    deliveryDate?: string | undefined;
    closedAt?: string | undefined;
    userRole?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await updateStatusInDb(data.id, data.status, {
        closed_by: data.closedBy,
        delivery_date: data.deliveryDate,
        closed_at: data.closedAt,
      });

      if (ok) {
        const details =
          data.status === "Closed"
            ? `Lead closed by ${data.closedBy || "Admin"}${data.deliveryDate ? ` with delivery date ${data.deliveryDate}` : ""}`
            : `Lead status changed to ${data.status} by ${data.closedBy || "Admin"}`;

        await addActivityLogInDb({
          lead_id: data.id,
          action: data.status === "Closed" ? "Lead Closed" : "Status Changed",
          details,
          performed_by: data.closedBy || "Admin",
          user_role: data.userRole || "admin",
        });

        try {
          const notif = await saveCRMNotificationInDb({
            type: data.status === "Closed" ? "lead_closed" : "lead_status",
            title: data.status === "Closed" ? "Lead Closed" : "Lead Status Updated",
            message: data.status === "Closed"
              ? `Lead #${data.id.slice(-6)} marked Closed by ${data.closedBy || "Admin"}${data.deliveryDate ? ` (Delivery: ${data.deliveryDate})` : ""}`
              : `Lead #${data.id.slice(-6)} status set to ${data.status} by ${data.closedBy || "Admin"}`,
            entity_id: data.id,
            actor: data.closedBy || "Admin",
          });

          broadcastLeadEvent({
            type: "UPDATE_LEAD",
            notification: notif,
          });
        } catch {}
      }

      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 6. Update Project Status (with Delivered Logic)
export const updateProjectStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    id: string;
    projectStatus: ProjectStatus;
    deliveryDate?: string | undefined;
    performedBy?: string | undefined;
    userRole?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await updateProjectStatusInDb(data.id, data.projectStatus, data.deliveryDate);
      if (ok) {
        const details =
          data.projectStatus === "Delivered"
            ? `Project marked Delivered by ${data.performedBy || "Admin"}${data.deliveryDate ? ` (Delivery Date: ${data.deliveryDate})` : ""}`
            : `Project status set to ${data.projectStatus} by ${data.performedBy || "Admin"}`;

        await addActivityLogInDb({
          lead_id: data.id,
          action: data.projectStatus === "Delivered" ? "Project Delivered" : "Project Status Changed",
          details,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });

        try {
          const notif = await saveCRMNotificationInDb({
            type: data.projectStatus === "Delivered" ? "project_delivered" : "project_status",
            title: data.projectStatus === "Delivered" ? "Project Delivered" : "Project Status Updated",
            message: data.projectStatus === "Delivered"
              ? `Project #${data.id.slice(-6)} marked as Delivered by ${data.performedBy || "Admin"}`
              : `Project #${data.id.slice(-6)} status set to ${data.projectStatus} by ${data.performedBy || "Admin"}`,
            entity_id: data.id,
            actor: data.performedBy || "Admin",
          });

          broadcastLeadEvent({
            type: "UPDATE_LEAD",
            notification: notif,
          });
        } catch {}
      }
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 7. Soft Delete (Move to Recycle Bin)
export const softDeleteLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await softDeleteInDb(data.id);
      if (ok) {
        await addActivityLogInDb({
          lead_id: data.id,
          action: "Lead Soft-Deleted",
          details: `Lead moved to Recycle Bin by ${data.performedBy || "Admin"}`,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });
      }
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Backward-compatible deleteLeadServerFn
export const deleteLeadServerFn = softDeleteLeadServerFn;

// 8. Restore Lead from Recycle Bin
export const restoreLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await restoreLeadInDb(data.id);
      if (ok) {
        await addActivityLogInDb({
          lead_id: data.id,
          action: "Lead Restored",
          details: `Lead restored from Recycle Bin by ${data.performedBy || "Admin"}`,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });
      }
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 9. Permanent Delete (Super Admin only)
export const permanentDeleteLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.userRole && data.userRole !== "super_admin") {
        return { success: false, error: "Access Denied: Permanent delete can ONLY be performed by Super Admin." };
      }
      const ok = await permanentDeleteInDb(data.id);
      if (ok) {
        await addActivityLogInDb({
          lead_id: data.id,
          action: "Lead Permanently Deleted",
          details: `Lead permanently erased from database by ${data.performedBy || "Super Admin"}`,
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
      }
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 9b. Bulk Permanent Delete (Super Admin only)
export const bulkPermanentDeleteLeadsServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.userRole && data.userRole !== "super_admin") {
        return { success: false, count: 0, error: "Access Denied: Permanent delete can ONLY be performed by Super Admin." };
      }
      if (!data.ids || data.ids.length === 0) return { success: true, count: 0 };
      let count = 0;
      for (const id of data.ids) {
        const ok = await permanentDeleteInDb(id);
        if (ok) count++;
      }
      if (count > 0) {
        await addActivityLogInDb({
          action: "Bulk Leads Permanently Deleted",
          details: `${count} soft-deleted leads permanently erased from database by ${data.performedBy || "Super Admin"}`,
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
      }
      await bumpDataVersion();
      return { success: true, count };
    } catch (error: any) {
      return { success: false, count: 0, error: error.message };
    }
  });

// 9c. Bulk Restore Leads (Super Admin / Admin)
export const bulkRestoreLeadsServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.ids || data.ids.length === 0) return { success: true, count: 0 };
      let count = 0;
      for (const id of data.ids) {
        const ok = await restoreLeadInDb(id);
        if (ok) count++;
      }
      if (count > 0) {
        await addActivityLogInDb({
          action: "Bulk Leads Restored",
          details: `${count} leads restored from Recycle Bin by ${data.performedBy || "Admin"}`,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });
      }
      await bumpDataVersion();
      return { success: true, count };
    } catch (error: any) {
      return { success: false, count: 0, error: error.message };
    }
  });

// 9d. Empty Entire Recycle Bin (Super Admin only)
export const emptyRecycleBinServerFn = createServerFn({ method: "POST" })
  .validator((data: { performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.userRole && data.userRole !== "super_admin") {
        return { success: false, count: 0, error: "Access Denied: Emptying Recycle Bin can ONLY be performed by Super Admin." };
      }
      const count = await emptyRecycleBinInDb();
      await addActivityLogInDb({
        action: "Recycle Bin Emptied",
        details: `Entire Recycle Bin emptied (${count} records permanently wiped) by ${data.performedBy || "Super Admin"}`,
        performed_by: data.performedBy || "Super Admin",
        user_role: "super_admin",
      });
      await bumpDataVersion();
      return { success: true, count };
    } catch (error: any) {
      return { success: false, count: 0, error: error.message };
    }
  });

// 10. Activity Logs
export const fetchActivityLogsServerFn = createServerFn({ method: "GET" })
  .validator((limit?: number) => limit || 100)
  .handler(async ({ data }) => {
    try {
      const logs = await getActivityLogsFromDb(data);
      return { success: true, logs };
    } catch (error: any) {
      return { success: false, logs: [] as ActivityLog[], error: error.message };
    }
  });

export const addActivityLogServerFn = createServerFn({ method: "POST" })
  .validator((data: { lead_id?: string | undefined; action: string; details: string; performed_by: string; user_role: string }) => data)
  .handler(async ({ data }) => {
    try {
      const log = await addActivityLogInDb(data);
      return { success: true, log };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteActivityLogServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; userRole?: string | undefined; performedBy?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.userRole !== "super_admin") {
        return { success: false, error: "Only Super Admin has permission to delete activity logs." };
      }
      await deleteActivityLogInDb(data.id);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteActivityLogsBulkServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; userRole?: string | undefined; performedBy?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.userRole !== "super_admin") {
        return { success: false, error: "Only Super Admin has permission to delete activity logs." };
      }
      if (!data.ids || data.ids.length === 0) {
        return { success: true, count: 0 };
      }
      await deleteActivityLogsBulkInDb(data.ids);
      return { success: true, count: data.ids.length };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const clearAllActivityLogsServerFn = createServerFn({ method: "POST" })
  .validator((data: { userRole?: string | undefined; performedBy?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      if (data.userRole !== "super_admin") {
        return { success: false, error: "Only Super Admin has permission to clear activity logs." };
      }
      await clearAllActivityLogsInDb();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 11. Login Logs
export const recordLoginLogServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    email: string;
    role: string;
    ip_address: string;
    location?: string | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    accuracy?: number | null | undefined;
    distance_meters?: number | null | undefined;
    is_within_geofence?: boolean | null | undefined;
    user_agent: string;
    status?: "success" | "failed" | "blocked_location" | "session_terminated" | string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const log = await addLoginLogInDb(data);
      return { success: true, log };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Live record counters for CRM Settings → Access All Records (Super Admin only).
// Everything is counted from the database at request time, using the same rules as
// the CRM tabs (Calendly calls and India-site leads are not counted as leads).
export const fetchRecordCountsServerFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    const who = decodeAndVerifySessionToken(data.token || "");
    if (!who.valid || who.payload?.role !== "super_admin") {
      return { success: false as const, error: "Only Super Admin can view record counters." };
    }
    try {
      const isIndia = (src?: string | null, loc?: string | null) => {
        const s = (src || "").toLowerCase().trim();
        if (/contact|popup|modal|quote|usa|website|manual|meta|facebook|instagram|calendly/.test(s)) return false;
        const l = (loc || "").toLowerCase().trim();
        return s.includes("india") || s.includes("in -") || /\bindia\b/.test(l) || l.includes("bharat");
      };
      const [leads, orders, meetings, admins, activity, logins] = await Promise.all([
        getLeadsFromDb(true),
        getOrdersForCountsFromDb(),
        countTableRows("calendly_meetings", { supabase: "deleted_at=is.null", sql: "deleted_at IS NULL" }),
        getAdminUsersFromDb(),
        countTableRows("activity_logs"),
        countTableRows("login_logs"),
      ]);
      const crmLeads = leads.filter(
        (l) => !isIndia(l.source, l.location) && !(l.source || "").toLowerCase().includes("calendly")
      );
      const paid = orders.filter((o) => String(o.payment_status).toUpperCase() === "COMPLETED");
      return {
        success: true as const,
        counts: {
          activeLeads: crmLeads.filter((l) => !l.deleted_at).length,
          recycleBin: crmLeads.filter((l) => !!l.deleted_at).length,
          totalOrders: orders.length,
          paidOrders: paid.length,
          revenue: paid.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
          calendlyCalls: meetings,
          adminAccounts: admins.filter((u) => !/@aistudio\.com$/i.test(u.email || "")).length,
          activeAdminAccounts: admins.filter((u) => !/@aistudio\.com$/i.test(u.email || "") && u.status !== "inactive").length,
          activityLogs: activity,
          securityLogs: logins,
        },
        checkedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return { success: false as const, error: error?.message || "Could not read record counts" };
    }
  });

// Delete Login / IP tracking entries (Super Admin only, checked against the signed session).
export const deleteLoginLogsServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const check = decodeAndVerifySessionToken(data.token || "");
      if (!check.valid || check.payload?.role !== "super_admin") {
        return { success: false, count: 0, error: "Only Super Admin can delete login logs." };
      }
      // Never delete the entry of a session that may still be live (anyone's, not just the caller's).
      const [recentLogs, presence, inactivityMinutes] = await Promise.all([
        getLoginLogsFromDb(1000),
        readPresence(),
        getInactivityMinutes(),
      ]);
      const live = getLiveSessionLoginLogIds(recentLogs);
      // Only sessions whose CRM is open and in use right now are protected.
      for (const id of [...live]) {
        const email = recentLogs.find((l) => l.id === id)?.email || "";
        if (!isSessionPresent(presence, email, inactivityMinutes)) live.delete(id);
      }
      // A deleted or deactivated account has no live session, so its rows can be deleted.
      for (const id of [...live]) {
        const email = recentLogs.find((l) => l.id === id)?.email || "";
        const state = await getAdminAccountState(email);
        if (state === "missing" || state === "inactive") live.delete(id);
      }
      const ids = Array.isArray(data.ids) ? data.ids.filter((id) => typeof id === "string" && id && !live.has(id)) : [];
      if (ids.length === 0) return { success: true, count: 0 };
      const ok = await deleteLoginLogsInDb(ids);
      if (!ok) return { success: false, count: 0, error: "Could not delete login logs from the database." };
      try {
        await addActivityLogInDb({
          lead_id: "system",
          action: "Login Logs Deleted",
          details: `${ids.length} login / IP tracking entr${ids.length === 1 ? "y" : "ies"} deleted`,
          performed_by: check.payload.email,
          user_role: "super_admin",
        });
      } catch {}
      return { success: true, count: ids.length };
    } catch (error: any) {
      return { success: false, count: 0, error: error.message };
    }
  });

export const fetchLoginLogsServerFn = createServerFn({ method: "GET" })
  .validator((limit?: number) => limit || 100)
  .handler(async ({ data }) => {
    try {
      const [logs, presence, inactivityMinutes] = await Promise.all([
        getLoginLogsFromDb(data),
        readPresence(),
        getInactivityMinutes(),
      ]);
      return { success: true, logs, presence, inactivityMinutes, serverNow: Date.now() };
    } catch (error: any) {
      return { success: false, logs: [] as LoginLog[], error: error.message };
    }
  });

// 12. Admin Users (Super Admin Management)
export const fetchAdminUsersServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const users = await getAdminUsersFromDb();
    return { success: true, users, setupError: getAccountSetupError() };
  } catch (error: any) {
    return { success: false, users: [] as AdminUser[], error: error.message };
  }
});

// User Management is Super Admin only: every account change is checked against the signed session.
// (Super Admin always; an Admin / Leads Manager only if the Permissions Matrix grants "manage_users".)
async function requireSuperAdmin(token?: string | undefined): Promise<string | null> {
  const who = decodeAndVerifySessionToken(token || "");
  if (!who.valid || !who.payload) return "Your session has expired. Please log in again.";
  if (who.payload.role === "super_admin") return null;
  try {
    const st = await getCrmSettingsFromDb();
    const perms = JSON.parse(st["role_permissions"] || "{}");
    if (perms?.[who.payload.role]?.["manage_users"] === true) return null;
  } catch {}
  return "You don't have permission to manage user accounts.";
}

export const createAdminUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; password: string; role: "super_admin" | "admin" | "leads_manager"; status?: "active" | "inactive" | undefined; performedBy?: string | undefined; token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const denied = await requireSuperAdmin(data.token);
      if (denied) return { success: false, error: denied };
      // The Super Admin can create Admin and Leads Manager accounts only
      if (data.role !== "admin" && data.role !== "leads_manager") {
        return { success: false, error: "Only Admin or Leads Manager accounts can be created." };
      }
      const cleanEmail = (data.email || "").toLowerCase().trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { success: false, error: "Please enter a valid email address." };
      }
      if ((data.password || "").trim().length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
      }
      if ((data.name || "").trim().length < 2) {
        return { success: false, error: "Please enter the user's name." };
      }
      // Saving an existing email would overwrite that account (even the Super Admin)
      const existing = await getAdminUserByEmailWithPassword(cleanEmail);
      if (existing) {
        return { success: false, error: `An account with ${cleanEmail} already exists.` };
      }
      const { token: _t, ...accountData } = data;
      const user = await saveAdminUserInDb({ ...accountData, email: cleanEmail, status: "active" });
      await bumpDataVersion();
      await addActivityLogInDb({
        action: "Admin Account Created",
        details: `New ${data.role} account created for ${data.name} (${data.email})`,
        performed_by: data.performedBy || "Super Admin",
        user_role: "super_admin",
      });
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const toggleAdminUserStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: "active" | "inactive"; email?: string | undefined; performedBy?: string | undefined; token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const denied = await requireSuperAdmin(data.token);
      if (denied) return { success: false, error: denied };
      const cleanEmail = (data.email || "").toLowerCase().trim();
      const targetId = (data.id || "").toLowerCase().trim();
      if (
        cleanEmail === "sa@aistudio.us" ||
        cleanEmail.includes("superadmin") ||
        targetId === "usr_superadmin"
      ) {
        return { success: false, error: "Super Admin account is permanently protected and cannot be deactivated." };
      }
      const ok = await updateAdminUserStatusInDb(data.id || data.email || "", data.status);
      if (ok) {
        await addActivityLogInDb({
          action: "Admin Status Changed",
          details: `Admin user ${data.email || data.id} status changed to ${data.status}`,
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
        // Tell every open CRM to refresh now (lists, counts, live-session badges).
        await bumpDataVersion();
      }
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteAdminUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; email?: string | undefined; performedBy?: string | undefined; token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const denied = await requireSuperAdmin(data.token);
      if (denied) return { success: false, error: denied };
      const cleanEmail = (data.email || "").toLowerCase().trim();
      const targetId = (data.id || "").toLowerCase().trim();
      if (
        cleanEmail === "sa@aistudio.us" ||
        cleanEmail.includes("superadmin") ||
        targetId === "usr_superadmin"
      ) {
        return { success: false, error: "Super Admin account is permanently protected and cannot be deleted." };
      }
      const ok = await deleteAdminUserInDb(data.id || data.email || "");
      if (ok) {
        await addActivityLogInDb({
          action: "Admin Deleted",
          details: `Admin account ${data.email || data.id} deleted`,
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
      }
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const sendAccountActivationRequestServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; name?: string | undefined; reason?: string | undefined; ip?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const cleanEmail = (data.email || "").toLowerCase().trim();
      const name = data.name || cleanEmail;
      const res = await sendAccountActivationRequestEmail({
        email: cleanEmail,
        name,
        reason: data.reason,
        ip: data.ip,
      });
      if (res.success) {
        await addActivityLogInDb({
          action: "Account Activation Request",
          details: `User ${name} (${cleanEmail}) requested account reactivation from login portal.`,
          performed_by: name,
          user_role: "unknown",
        });
        await saveCRMNotificationInDb({
          type: "system",
          title: "Account Activation Request",
          message: `User ${name} (${cleanEmail}) is requesting their account to be reactivated.`,
        });
      }
      return res;
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send activation request email." };
    }
  });


// Helper to fetch live scheduled events from Calendly API and upsert into DB
/** Calendly API token: env var, then CRM settings, then the built-in fallback. */
export function getCalendlyApiToken(settings?: Record<string, string> | null): string {
  return (process.env["CALENDLY_API_TOKEN"] ||
        process.env["VITE_CALENDLY_API_TOKEN"] ||
        settings?.["calendly_api_token"] ||
        settings?.["calendly_personal_access_token"] ||
        settings?.["CALENDLY_API_TOKEN"] ||
        "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzkwNjcyODY3LCJqdGkiOiI4ZThmMzc5YS1mNWNkLTQzYTItYjAyMi03ZTdkMmUwMjRmMTQiLCJ1c2VyX3V1aWQiOiJlYjcxODgwNS05YzA3LTQ5MTYtOTBhZC0zNTE1ODQ1MTA3YTciLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIG1lZXRpbmdfcmVjYXBzOnJlYWQgbWVldGluZ19yZWNhcHM6d3JpdGUgYWN0aXZpdHlfbG9nOnJlYWQgZGF0YV9jb21wbGlhbmNlOndyaXRlIG91dGdvaW5nX2NvbW11bmljYXRpb25zOnJlYWQgd2ViaG9va3M6cmVhZCB3ZWJob29rczp3cml0ZSBjb250YWN0czpyZWFkIGNvbnRhY3RzOndyaXRlIn0.5dFQT3HoJos1F1_hR5RAldfPFO1J1JfAaxXoKRp7FCLvneq1dBQpuO-f2MRr_i7AjkStqBOvnsO2aBdRpU1j0A") as string;
}

// Server-side throttle: every open admin tab polls, but Calendly only needs checking
// about once a minute (the manual "Sync" button bypasses this).
let lastCalendlySyncAt = 0;
let placeholderCleanupDone = false;
const CALENDLY_SYNC_MIN_INTERVAL_MS = 60 * 1000;

export async function syncCalendlyEventsFromApi(opts?: { force?: boolean | undefined }): Promise<{ count: number; error?: string | undefined; skipped?: boolean | undefined }> {
  if (!opts?.force && Date.now() - lastCalendlySyncAt < CALENDLY_SYNC_MIN_INTERVAL_MS) {
    return { count: 0, skipped: true };
  }
  lastCalendlySyncAt = Date.now();
  try {
    const settings = await getCrmSettingsFromDb();
    const token = getCalendlyApiToken(settings);

    if (!token) {
      return {
        count: 0,
        error: "Calendly API token not configured.",
      };
    }

    // Once per server start: hide junk rows the old widget code created with placeholder data
    if (!placeholderCleanupDone) {
      placeholderCleanupDone = true;
      try {
        await removePlaceholderCalendlyMeetingsInDb();
      } catch {}
    }

    // Retrieve cutoff timestamp to prevent importing historical/pre-reset meetings
    const cutoffStr = settings?.["calendly_reset_cutoff_time"];
    const cutoffTime = cutoffStr ? new Date(cutoffStr).getTime() : 0;

    const userRes = await fetch("https://api.calendly.com/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!userRes.ok) {
      return { count: 0, error: `Calendly API user lookup failed (${userRes.status})` };
    }

    const userData = (await userRes.json()) as any;
    const userUri = userData.resource?.uri;
    if (!userUri) {
      return { count: 0, error: "Calendly user URI not found" };
    }

    // Newest first, and only meetings from the last 30 days onward: Calendly's default
    // (20 oldest events) never returned recent cancellations.
    const minStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const listUrl = (status: string) =>
      `https://api.calendly.com/scheduled_events?user=${encodeURIComponent(userUri)}&status=${status}` +
      `&count=100&sort=start_time:desc&min_start_time=${encodeURIComponent(minStart)}`;
    const [activeEventsRes, canceledEventsRes] = await Promise.all([
      fetch(listUrl("active"), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) }),
      fetch(listUrl("canceled"), { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10000) }),
    ]);

    const activeCollection = activeEventsRes.ok ? ((await activeEventsRes.json()) as any)?.collection || [] : [];
    const canceledCollection = canceledEventsRes.ok ? ((await canceledEventsRes.json()) as any)?.collection || [] : [];

    // Combine active and canceled events
    const allEvents = [...activeCollection, ...canceledCollection];
    let syncedCount = 0;

    for (const ev of allEvents) {
      try {
        const evCreatedAt = new Date(ev.created_at || ev.start_time).getTime();
        // Skip historical / pre-reset meetings
        if (cutoffTime > 0 && evCreatedAt < cutoffTime) {
          continue;
        }

        const invRes = await fetch(`${ev.uri}/invitees`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        });
        if (!invRes.ok) continue;

        const invData = (await invRes.json()) as any;
        const invitee = (invData.collection || [])[0];
        if (!invitee) continue;

        const startDate = new Date(ev.start_time);
        const dateStr = startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "America/New_York",
        });
        const timeStr =
          startDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "America/New_York",
          }) + " EST";

        const decision = classifyCalendlyInvitee({ eventStatus: ev.status, endTime: ev.end_time, invitee });
        // The old slot of a reschedule: the new booking carries the meeting forward
        if (decision.action === "ignore") {
          continue;
        }
        const status = decision.status;
        const isCanceled = status === "cancelled";
        const isRescheduled = decision.isRescheduled;
        // Original slot of a rescheduled booking, so the right CRM meeting is updated
        const previousSlot = await resolvePreviousSlot(decision.oldInviteeUri, token);

        const link = ev.location?.join_url || ev.uri;
        const cancelReason = invitee.cancellation?.reason ? ` (Reason: ${invitee.cancellation.reason})` : "";

        await saveCalendlyMeetingInDb({
          client_name: invitee.name || "Calendly Client",
          email: invitee.email || "client@calendly.com",
          phone: invitee.text_reminder_number || undefined,
          meeting_date: dateStr,
          meeting_time: timeStr,
          meeting_status: status,
          meeting_link: link,
          meeting_type: ev.name || "Quickupp AI Studio - 30 Min Strategy Call",
          is_rescheduled: isRescheduled,
          previous_meeting_date: previousSlot?.date,
          previous_meeting_time: previousSlot?.time,
          notes: isCanceled
            ? `Cancelled in Calendly${cancelReason}`
            : status === "no_show"
            ? `Client marked as No-Show in Calendly (${dateStr} at ${timeStr})`
            : status === "not_conducted"
            ? `Meeting time passed (${dateStr} at ${timeStr}) — not conducted / no result recorded yet`
            : isRescheduled
            ? `Rescheduled in Calendly to ${dateStr} at ${timeStr}`
            : `Booked in Calendly for ${dateStr} at ${timeStr}`,
        });

        syncedCount++;
      } catch (evErr) {
        console.warn("Error syncing single Calendly event:", evErr);
      }
    }

    // Meetings older than the sync window whose time passed without a result
    try {
      await markPastMeetingsNotConductedInDb();
    } catch {}

    return { count: syncedCount };
  } catch (err: any) {
    console.error("Calendly sync error:", err);
    return { count: 0, error: err.message };
  }
}

// 13. Calendly Meetings (Strictly Read-Only from CRM)
export const fetchCalendlyMeetingsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    // 1. Live sync from Calendly (respecting cutoff), but never let a slow
    // Calendly API hold the request open long enough to trigger a 504:
    // wait at most 8s, then serve what's in the DB while the sync finishes.
    const sync = syncCalendlyEventsFromApi().catch(() => ({ count: 0 }));
    await Promise.race([sync, new Promise((resolve) => setTimeout(resolve, 8000))]);

    // 2. Fetch all meetings from DB
    const meetings = await getCalendlyMeetingsFromDb();
    return { success: true, meetings };
  } catch (error: any) {
    return { success: false, meetings: [] as CalendlyMeeting[], error: error.message };
  }
});

export const syncCalendlyEventsServerFn = createServerFn({ method: "POST" }).handler(async () => {
  const result = await syncCalendlyEventsFromApi({ force: true });
  const meetings = await getCalendlyMeetingsFromDb();
  return { success: !result.error, count: result.count, meetings, error: result.error };
});

// Programmatic Reset Action for Calendly meetings in CRM
export const resetCalendlyDataServerFn = createServerFn({ method: "POST" })
  .validator((data?: { resetBy?: string | undefined; userRole?: string | undefined }) => data || {})
  .handler(async ({ data }) => {
    try {
      // Hard-deletes every meeting: Super Admin only
      if (data?.userRole !== "super_admin") {
        return { success: false, error: "Only the Super Admin can reset Calendly data." };
      }
      const ok = await clearAllCalendlyMeetingsInDb();
      const resetTime = new Date().toISOString();
      const settings = await getCrmSettingsFromDb();
      await saveCrmSettingsToDb({ ...settings, calendly_reset_cutoff_time: resetTime });

      await addActivityLogInDb({
        action: "Calendly Meetings Reset",
        details: `All CRM Calendly meeting records cleared and reset cutoff timestamp set to ${resetTime}`,
        performed_by: data?.resetBy || "Super Admin",
        user_role: "super_admin",
      });

      broadcastLeadEvent({ type: "REFRESH_ALL" });
      return { success: ok, resetTime };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Read-Only Enforcement: Block CRM-originated mutations
export const saveCalendlyMeetingServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async () => {
    return {
      success: false,
      error: "CRM is strictly read-only for Calendly. Meetings must be created directly in Calendly.",
    };
  });

export const updateCalendlyMeetingServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async () => {
    return {
      success: false,
      error: "CRM is strictly read-only for Calendly. Meetings can only be rescheduled or modified in Calendly.",
    };
  });

export const cancelCalendlyMeetingServerFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async () => {
    return {
      success: false,
      error: "CRM is strictly read-only for Calendly. Meetings can only be cancelled directly inside Calendly.",
    };
  });

// CRM user records the meeting result (Completed / Not Conducted / No Show) with a note.
// Once recorded, the automatic Calendly result no longer overwrites it; a real
// reschedule or cancellation in Calendly still updates the meeting.
export const setMeetingOutcomeServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: { id: string; outcome: string; note: string; performedBy?: string | undefined; userRole?: string | undefined }) => data
  )
  .handler(async ({ data }) => {
    try {
      const outcome = String(data.outcome || "") as MeetingOutcome;
      if (!(MEETING_OUTCOME_STATUSES as readonly string[]).includes(outcome)) {
        return { success: false, error: "Choose Completed, Not Conducted or No Show" };
      }
      const note = (data.note || "").trim();
      if (note.length < 3) return { success: false, error: "Please add a short note explaining the result" };
      const by = (data.performedBy || "CRM User").trim();

      const meeting = await setCalendlyMeetingOutcomeInDb(data.id, outcome, note.slice(0, 1000), by);
      if (!meeting) return { success: false, error: "Meeting not found or could not be updated" };

      const label = outcome === "completed" ? "Completed" : outcome === "no_show" ? "No Show" : "Not Conducted";
      try {
        await addActivityLogInDb({
          action: `Meeting Result: ${label}`,
          details: `${meeting.client_name} (${meeting.email}) ${meeting.meeting_date} ${meeting.meeting_time} marked ${label} by ${by}. Note: ${note}`,
          performed_by: by,
          user_role: data.userRole || "admin",
        });
      } catch {}
      return { success: true, meeting };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteCalendlyMeetingServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; client_name?: string | undefined; performedBy?: string | undefined; userRole?: string | undefined; permanent?: boolean | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const isSuper = data.userRole === "super_admin";
      const isPermanent = data.permanent === true && isSuper;

      // Remember it first so the Calendly sync / webhook never brings it back
      await rememberDeletedCalendlyMeetings([data.id]);

      let ok = false;
      if (isPermanent) {
        ok = await permanentDeleteCalendlyMeetingInDb(data.id);
      } else {
        ok = await softDeleteCalendlyMeetingInDb(data.id);
      }

      if (ok) {
        await addActivityLogInDb({
          action: isPermanent ? "Calendly Meeting Permanently Erased" : "Calendly Meeting Soft-Deleted",
          details: isPermanent
            ? `Permanently erased meeting record for ${data.client_name || data.id} by ${data.performedBy || "Super Admin"}`
            : `Meeting record for ${data.client_name || data.id} moved to Recycle Bin by ${data.performedBy || "Admin"}`,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });
        broadcastLeadEvent({ type: "REFRESH_ALL" });
      }
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Recycle Bin: soft-deleted Calendly meetings
export const fetchDeletedCalendlyMeetingsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const all = await getCalendlyMeetingsFromDb(true);
    return { success: true, meetings: all.filter((m) => Boolean(m.deleted_at)) };
  } catch (error: any) {
    return { success: false, meetings: [] as CalendlyMeeting[], error: error.message };
  }
});

export const restoreCalendlyMeetingServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; client_name?: string | undefined; performedBy?: string | undefined; userRole?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      await forgetDeletedCalendlyMeeting(data.id);
      const ok = await restoreCalendlyMeetingInDb(data.id);
      if (ok) {
        await addActivityLogInDb({
          action: "Calendly Meeting Restored",
          details: `Meeting record for ${data.client_name || data.id} restored from Recycle Bin by ${data.performedBy || "Admin"}`,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });
        broadcastLeadEvent({ type: "REFRESH_ALL" });
      }
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteCalendlyMeetingsBulkServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; performedBy?: string | undefined; userRole?: string | undefined; permanent?: boolean | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const isSuper = data.userRole === "super_admin";
      const isPermanent = data.permanent === true && isSuper;

      // Remember them first so the Calendly sync / webhook never brings them back
      await rememberDeletedCalendlyMeetings(data.ids || []);

      let ok = false;
      if (isPermanent) {
        ok = await permanentDeleteCalendlyMeetingsInDb(data.ids);
      } else {
        ok = await softDeleteCalendlyMeetingsInDb(data.ids);
      }

      if (ok) {
        await addActivityLogInDb({
          action: isPermanent ? "Calendly Meetings Bulk Permanently Erased" : "Calendly Meetings Bulk Soft-Deleted",
          details: isPermanent
            ? `Permanently erased ${data.ids.length} meeting records by ${data.performedBy || "Super Admin"}`
            : `${data.ids.length} meeting records moved to Recycle Bin by ${data.performedBy || "Admin"}`,
          performed_by: data.performedBy || "Admin",
          user_role: data.userRole || "admin",
        });
        broadcastLeadEvent({ type: "REFRESH_ALL" });
      }
      await bumpDataVersion();
      return { success: ok, count: data.ids.length };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 14. Record Calendly Booking (from the website widget). The widget only knows the
//     Calendly URIs, so the real invitee / event details are fetched from the API.
export const recordCalendlyBookingServerFn = createServerFn({ method: "POST" })
  .validator((data: { invitee_uri: string; event_uri?: string | undefined; notes?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const inviteeUri = (data.invitee_uri || "").trim();
      if (!inviteeUri.startsWith("https://api.calendly.com/")) {
        return { success: false, error: "Invalid Calendly invitee URI" };
      }
      const settings = await getCrmSettingsFromDb();
      const token = getCalendlyApiToken(settings);
      const headers = { Authorization: `Bearer ${token}` };

      const invRes = await fetch(inviteeUri, { headers, signal: AbortSignal.timeout(10000) });
      if (!invRes.ok) return { success: false, error: `Calendly invitee lookup failed (${invRes.status})` };
      const invitee = ((await invRes.json()) as any)?.resource;
      const eventUri = invitee?.event || data.event_uri;
      if (!invitee?.email || !eventUri) return { success: false, error: "Calendly booking details unavailable" };

      const evRes = await fetch(eventUri, { headers, signal: AbortSignal.timeout(10000) });
      if (!evRes.ok) return { success: false, error: `Calendly event lookup failed (${evRes.status})` };
      const ev = ((await evRes.json()) as any)?.resource || {};

      const slot = formatCalendlySlot(ev.start_time);
      if (!slot) return { success: false, error: "Calendly event has no start time" };
      const decision = classifyCalendlyInvitee({ eventStatus: ev.status, endTime: ev.end_time, invitee });
      if (decision.action === "ignore") return { success: true, ignored: true };
      const previousSlot = await resolvePreviousSlot(decision.oldInviteeUri, token);

      const meeting = await saveCalendlyMeetingInDb({
        client_name: invitee.name || "Calendly Client",
        email: invitee.email,
        phone: invitee.text_reminder_number || undefined,
        meeting_date: slot.date,
        meeting_time: slot.time,
        meeting_status: decision.status,
        meeting_link: ev.location?.join_url || ev.uri,
        meeting_type: ev.name || "Quickupp AI Studio - 30 Min Strategy Call",
        is_rescheduled: decision.isRescheduled,
        previous_meeting_date: previousSlot?.date,
        previous_meeting_time: previousSlot?.time,
        notes:
          decision.status === "rescheduled"
            ? `Rescheduled in Calendly to ${slot.date} at ${slot.time}`
            : `Booked in Calendly for ${slot.date} at ${slot.time}`,
      });

      // Calendly calls are kept in the Calendly tab only (no lead row is created)
      await addActivityLogInDb({
        action: decision.status === "rescheduled" ? "Calendly Meeting Rescheduled" : "Calendly Meeting Booked",
        details: `Strategy call for ${invitee.name} (${invitee.email}) on ${slot.date} at ${slot.time}`,
        performed_by: "Calendly Integration",
        user_role: "system",
      });

      return { success: true, meeting };
    } catch (error: any) {
      console.error("recordCalendlyBookingServerFn error:", error);
      return { success: false, error: error.message };
    }
  });

// 15. Send Test Calendly Booking Event (for Admins to test live sync)
export const sendTestCalendlyBookingServerFn = createServerFn({ method: "POST" })
  .validator((data: { performedBy?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const names = [
        "Marcus Vance (USA Luxury Real Estate)",
        "Elena Rostova (Fashion Brand USA)",
        "David Sterling (SaaS Founder, Austin TX)",
        "Sophia Chen (E-Commerce CEO, NYC)",
        "Alexander Hayes (Beverly Hills Dental Group)",
      ];
      const randomName = names[Math.floor(Math.random() * names.length)] as string;
      const randomSlug = (randomName.split(" ")[0] || "client").toLowerCase() + Math.floor(Math.random() * 900 + 100);
      const email = `${randomSlug}@brandventures.us`;
      const phone = `+1 (${Math.floor(Math.random() * 800 + 200)}) ${Math.floor(Math.random() * 800 + 200)}-${Math.floor(Math.random() * 8900 + 1000)}`;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const meetingDate = tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const meetingTime = "3:30 PM EST";

      const meeting = await saveCalendlyMeetingInDb({
        client_name: randomName,
        email,
        phone,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        meeting_status: "scheduled",
        meeting_link: "https://calendly.com/quickuppaistudio/strategy-call",
        meeting_type: "AI Video Strategy Call (30 min)",
        notes: `Simulated live Calendly booking test initiated by ${data.performedBy || "Admin"}`,
      });

      const lead = await saveLeadToDb({
        source: "USA Website - Calendly",
        name: randomName,
        email,
        phone,
        videoType: "AI Video Strategy Call (30 min)",
        business: "High-Ticket Brand Campaign",
        location: "United States",
        industry: "E-Commerce / Real Estate",
        requirement: "Looking for 10-15 AI Avatar and UGC video ads per month for US market expansion.",
        status: "New",
        notes: `Test Calendly Meeting scheduled on ${meetingDate} at ${meetingTime}.`,
        meetingDate: meetingDate,
        meetingTime: meetingTime,
        meetingLink: "https://calendly.com/quickuppaistudio/strategy-call",
      });

      await addActivityLogInDb({
        lead_id: lead.id,
        action: "Test Calendly Call Created",
        details: `Live test call created for ${randomName} (${email}) for ${meetingDate} at ${meetingTime}`,
        performed_by: data.performedBy || "Admin Test",
        user_role: "admin",
      });

      await saveCRMNotificationInDb({
        type: "meeting_new",
        title: "New Calendly Meeting Booked",
        message: `${randomName} scheduled a Strategy Call for ${meetingDate} at ${meetingTime}`,
        entity_id: meeting.id,
        actor: "Calendly Live Test",
      });

      return { success: true, meeting, lead };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 16. CRM Notifications Server Functions
export const fetchNotificationsServerFn = createServerFn({ method: "GET" })
  .validator((data?: { limit?: number | undefined }) => data || {})
  .handler(async ({ data }) => {
    try {
      const notifications = await getCRMNotificationsFromDb(data?.limit || 50);
      return { success: true, notifications };
    } catch (error: any) {
      return { success: false, notifications: [] as CRMNotification[], error: error.message };
    }
  });

export const markNotificationReadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await markNotificationReadInDb(data.id);
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const markAllNotificationsReadServerFn = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      const ok = await markAllNotificationsReadInDb();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const clearNotificationsServerFn = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      const ok = await clearNotificationsInDb();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Broadcast Channel utility
export function broadcastLeadEvent(event: {
  type: "NEW_LEAD" | "UPDATE_LEAD" | "DELETE_LEAD" | "RESTORE_LEAD" | "REFRESH_ALL" | "NEW_MEETING" | "NEW_NOTIFICATION";
  lead?: Lead | undefined;
  meeting?: CalendlyMeeting | undefined;
  notification?: CRMNotification | undefined;
  id?: string | undefined;
}) {
  if (typeof window === "undefined") return;
  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("ai_studio_leads_sync");
      bc.postMessage(event);
      bc.close();
    }
    window.dispatchEvent(new CustomEvent("ai_studio_lead_event", { detail: event }));
  } catch (e) {
    console.error("Broadcast lead event failed:", e);
  }
}

// CRM Settings (shared across admins; notification email is used server-side)
const DEFAULT_CRM_SETTINGS = {
  platform_title: "AI STUDIO USA - Enterprise CRM",
  notification_email: "info@quickuppaistudio.us",
  sync_interval: "10",
  inactivity_timeout: "10",
  login_attempts: "3",
  broadcast_banner: "",
};

export const fetchCrmSettingsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const saved = await getCrmSettingsFromDb();
    return { success: true, settings: { ...DEFAULT_CRM_SETTINGS, ...saved } };
  } catch (error: any) {
    return { success: false, error: error.message, settings: DEFAULT_CRM_SETTINGS };
  }
});

export const saveCrmSettingsServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    platformTitle: string;
    notificationEmail?: string | undefined;
    token?: string | undefined;
    syncInterval: number;
    inactivityTimeout?: number | undefined;
    loginAttempts?: number | undefined;
    performedBy?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const who = decodeAndVerifySessionToken(data.token || "");
      if (!who.valid || !who.payload || who.payload.role === "leads_manager") {
        return { success: false, error: "Only Super Admin / Admin can change CRM settings." };
      }
      const title = (data.platformTitle || "").trim().slice(0, 120);
      // The alert email is fixed and can't be changed from the CRM.
      const email = DEFAULT_CRM_SETTINGS.notification_email;
      const interval = Number(data.syncInterval) === 20 ? 20 : 10;
      const inactivity = [5, 10, 15, 30].includes(Number(data.inactivityTimeout)) ? Number(data.inactivityTimeout) : 10;
      const attempts = [3, 5, 10].includes(Number(data.loginAttempts)) ? Number(data.loginAttempts) : 3;
      if (!title) return { success: false, error: "Platform / CRM Title cannot be empty" };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: "Please enter a valid notification email address" };
      }

      const savedAt = new Date().toISOString();
      const savedBy = data.performedBy || "Super Admin";
      const ok = await saveCrmSettingsToDb({
        platform_title: title,
        notification_email: email,
        sync_interval: String(interval),
        inactivity_timeout: String(inactivity),
        login_attempts: String(attempts),
        settings_updated_at: savedAt,
        settings_updated_by: savedBy,
      });
      if (!ok) return { success: false, error: "Could not save settings to the database" };

      try {
        await addActivityLogInDb({
          action: "CRM Settings Updated",
          details: `CRM settings updated (title: "${title}", alert email: ${email}, auto-sync: ${interval}s, inactivity logout: ${inactivity} min, failed-login threshold: ${attempts})`,
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
      } catch {}

      return {
        success: true,
        settings: {
          platform_title: title,
          notification_email: email,
          sync_interval: String(interval),
          inactivity_timeout: String(inactivity),
          login_attempts: String(attempts),
          settings_updated_at: savedAt,
          settings_updated_by: savedBy,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Access control: role permissions matrix + built-in account status (Super Admin managed)
const PERMISSION_KEYS = [
  "dashboard", "meta_leads", "delete_leads", "recycle_bin", "purge", "orders", "activity",
  "export_data", "export_backup", "manage_users", "security_logs", "crm_settings", "broadcast",
];
const BUILT_IN_DEACTIVATABLE = ["admin@aistudio.us", "lm@aistudio.us"];

export const saveAccessControlServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      rolePermissions?: Record<string, Record<string, boolean>>;
      accountStatus?: Record<string, string>;
      performedBy?: string | undefined;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const toSave: Record<string, string> = {};
      const logParts: string[] = [];

      if (data.rolePermissions) {
        const clean: Record<string, Record<string, boolean>> = {};
        for (const role of ["admin", "leads_manager"]) {
          clean[role] = {};
          for (const key of PERMISSION_KEYS) {
            clean[role][key] = data.rolePermissions?.[role]?.[key] === true;
          }
        }
        toSave["role_permissions"] = JSON.stringify(clean);
        logParts.push("role permissions matrix updated");
      }

      if (data.accountStatus) {
        const clean: Record<string, string> = {};
        for (const [email, st] of Object.entries(data.accountStatus)) {
          const e = email.toLowerCase().trim();
          if (!BUILT_IN_DEACTIVATABLE.includes(e)) continue; // Super Admin can never be deactivated
          clean[e] = st === "inactive" ? "inactive" : "active";
        }
        toSave["account_status"] = JSON.stringify(clean);
        logParts.push(
          "account status: " + Object.entries(clean).map(([e, st]) => `${e}=${st}`).join(", ")
        );
      }

      if (Object.keys(toSave).length === 0) return { success: true };
      const ok = await saveCrmSettingsToDb(toSave);
      if (!ok) return { success: false, error: "Could not save to the database" };

      try {
        await addActivityLogInDb({
          action: "Access Control Updated",
          details: logParts.join("; "),
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
      } catch {}

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// ── Broadcast banner (shown to every logged-in admin) ──────────────────────────
export const saveBroadcastServerFn = createServerFn({ method: "POST" })
  .validator((data: { message: string; performedBy?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const message = (data.message || "").trim().slice(0, 300);
      const ok = await saveCrmSettingsToDb({ broadcast_banner: message });
      if (!ok) return { success: false, error: "Could not save the broadcast" };
      try {
        await addActivityLogInDb({
          action: message ? "Broadcast Published" : "Broadcast Cleared",
          details: message ? `System notice: "${message}"` : "System notice banner cleared",
          performed_by: data.performedBy || "Super Admin",
          user_role: "super_admin",
        });
      } catch {}
      return { success: true, message };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// ── Failed-login lockout + email alert ───────────────────────────────────────
const LOGIN_LOCKOUT_MINUTES = 15; // legacy value (kept for older callers)

// Progressive lockout (per account email): every N failed attempts locks the account,
// each lockout longer than the last. A successful login resets it. Super Admin is never locked.
const LOCKOUT_STEPS_MINUTES = [5, 10, 20, 45, 60, 120, 240, 480, 960, 1440];
const LOCKOUT_SETTINGS_KEY = "login_lockouts";
type LockState = { fails: number; level: number; lockedUntil: number };

function formatLockDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const h = Math.round((minutes / 60) * 10) / 10;
  return `${h} hour${h === 1 ? "" : "s"}`;
}

function isSuperAdminLogin(email: string, role?: string | null): boolean {
  return role === "super_admin" || (email || "").toLowerCase().trim() === "sa@aistudio.us";
}

async function readLockStates(): Promise<Record<string, LockState>> {
  try {
    const st = await getCrmSettingsFromDb();
    const parsed = JSON.parse(st[LOCKOUT_SETTINGS_KEY] || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeLockStates(states: Record<string, LockState>): Promise<void> {
  // Drop entries that are fully cleared to keep the value small
  const clean: Record<string, LockState> = {};
  for (const [k, v] of Object.entries(states)) {
    if (v && (v.fails > 0 || v.level > 0 || v.lockedUntil > Date.now())) clean[k] = v;
  }
  await saveCrmSettingsToDb({ [LOCKOUT_SETTINGS_KEY]: JSON.stringify(clean) });
}

/** Is this account locked right now? (never for the Super Admin) */
async function getActiveLock(email: string): Promise<{ locked: boolean; remainingMinutes: number; level: number }> {
  const key = (email || "").toLowerCase().trim();
  if (!key || isSuperAdminLogin(key)) return { locked: false, remainingMinutes: 0, level: 0 };
  const st = (await readLockStates())[key];
  if (st && st.lockedUntil > Date.now()) {
    return { locked: true, remainingMinutes: Math.max(1, Math.ceil((st.lockedUntil - Date.now()) / 60000)), level: st.level };
  }
  return { locked: false, remainingMinutes: 0, level: st?.level || 0 };
}

/** Count a failed attempt; returns whether it just locked the account and for how long */
async function registerFailedLogin(
  email: string,
  role: string | null | undefined,
  threshold: number
): Promise<{ lockedNow: boolean; alertNow: boolean; lockMinutes: number; attemptsLeft: number; level: number }> {
  const key = (email || "").toLowerCase().trim();
  if (!key) return { lockedNow: false, alertNow: false, lockMinutes: 0, attemptsLeft: threshold, level: 0 };
  const states = await readLockStates();
  if (isSuperAdminLogin(key, role)) {
    // Super Admin is never locked, but every N failed attempts still sends an alert
    const sa: LockState = states[key] || { fails: 0, level: 0, lockedUntil: 0 };
    sa.fails += 1;
    const alertNow = sa.fails >= threshold;
    if (alertNow) sa.fails = 0;
    sa.lockedUntil = 0;
    states[key] = sa;
    await writeLockStates(states);
    return { lockedNow: false, alertNow, lockMinutes: 0, attemptsLeft: threshold, level: 0 };
  }
  const st: LockState = states[key] || { fails: 0, level: 0, lockedUntil: 0 };
  st.fails += 1;
  let lockedNow = false;
  let lockMinutes = 0;
  if (st.fails >= threshold) {
    lockMinutes = LOCKOUT_STEPS_MINUTES[Math.min(st.level, LOCKOUT_STEPS_MINUTES.length - 1)] as number;
    st.level += 1;
    st.fails = 0;
    st.lockedUntil = Date.now() + lockMinutes * 60 * 1000;
    lockedNow = true;
  }
  states[key] = st;
  await writeLockStates(states);
  return { lockedNow, alertNow: lockedNow, lockMinutes, attemptsLeft: lockedNow ? 0 : Math.max(threshold - st.fails, 0), level: st.level };
}

/** Successful login: back to a clean slate */
async function clearLoginLock(email: string): Promise<void> {
  const key = (email || "").toLowerCase().trim();
  const states = await readLockStates();
  if (states[key]) {
    delete states[key];
    await writeLockStates(states);
  }
}

async function alertLockout(opts: {
  email: string; ip: string; location?: string | undefined; userAgent?: string | undefined;
  threshold: number; lockMinutes: number; level: number;
}) {
  let mailOk = false;
  let mailErr = "";
  try {
    const mail = await sendFailedLoginAlertEmail({
      email: opts.email,
      ipAddress: opts.ip,
      location: opts.location,
      userAgent: opts.userAgent,
      attempts: opts.threshold,
      threshold: opts.threshold,
      lockoutMinutes: opts.lockMinutes,
    });
    mailOk = mail.success;
    mailErr = mail.error || "";
  } catch (e: any) {
    mailErr = e?.message || "";
  }
  try {
    await addActivityLogInDb({
      action: opts.lockMinutes > 0 ? "Account Locked (Failed Logins)" : "Super Admin Failed Logins Alert",
      details: `${opts.threshold} failed logins for ${opts.email || "unknown"} from ${opts.ip}; ${
        opts.lockMinutes > 0 ? `lockout #${opts.level}: ${formatLockDuration(opts.lockMinutes)}` : "Super Admin is never locked"
      }; alert email ${mailOk ? "sent" : "FAILED" + (mailErr ? ": " + mailErr : "")}`,
      performed_by: "System / Security",
      user_role: "system",
    });
  } catch {}
}

async function getLoginThreshold(): Promise<number> {
  try {
    const st = await getCrmSettingsFromDb();
    const n = Number(st["login_attempts"]);
    return [3, 5, 10].includes(n) ? n : 3;
  } catch {
    return 3;
  }
}

export const checkLoginLockoutServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; ip?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const lock = await getActiveLock(data.email);
      return { success: true, locked: lock.locked, lockoutMinutes: lock.remainingMinutes };
    } catch (error: any) {
      return { success: false, locked: false, error: error.message };
    }
  });

export const recordFailedLoginServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; ip?: string | undefined; location?: string | undefined; userAgent?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      await addLoginLogInDb({
        email: (data.email || "").toLowerCase().trim() || "unknown",
        role: "unknown",
        ip_address: data.ip || "Unknown IP",
        location: data.location || "Failed Attempt",
        user_agent: data.userAgent || "Web Browser",
        status: "failed",
      });

      const threshold = await getLoginThreshold();
      const res = await registerFailedLogin(data.email, null, threshold);
      if (res.alertNow) {
        await alertLockout({
          email: data.email, ip: data.ip || "Unknown", location: data.location, userAgent: data.userAgent,
          threshold, lockMinutes: res.lockMinutes, level: res.level,
        });
      }
      return {
        success: true,
        locked: res.lockedNow,
        attemptsLeft: res.attemptsLeft,
        lockoutMinutes: res.lockMinutes,
      };
    } catch (error: any) {
      return { success: false, locked: false, attemptsLeft: undefined, error: error.message };
    }
  });

// 22. Strict Location-Based Admin Authentication & Session Management
export const authenticateAdminServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      email: string;
      password: string;
      latitude?: number | null | undefined;
      longitude?: number | null | undefined;
      accuracy?: number | null | undefined;
      ip?: string | undefined;
      locationName?: string | undefined;
      userAgent?: string | undefined;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const cleanEmail = (data.email || "").trim().toLowerCase();
      const cleanPass = (data.password || "").trim();
      const ipAddress = data.ip || "Unknown IP";
      const locationName = data.locationName || "Unknown Location";
      const userAgent = data.userAgent || "Web Browser";

      // 1. Progressive lockout (never applies to the Super Admin)
      const threshold = await getLoginThreshold();
      const activeLock = await getActiveLock(cleanEmail);
      if (activeLock.locked) {
        return {
          success: false,
          locked: true,
          error: `This account is locked after too many failed login attempts. Try again in ${formatLockDuration(activeLock.remainingMinutes)}.`,
        };
      }

      // 2. Validate credentials via database / secure lookup
      const user = await getAdminUserByEmailWithPassword(cleanEmail);

      if (!user || user.password !== cleanPass) {
        // Record failed attempt in security audit
        await addLoginLogInDb({
          email: cleanEmail || "unknown",
          role: user?.role || "unknown",
          ip_address: ipAddress,
          location: locationName,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          user_agent: userAgent,
          status: "failed",
        });

        const superAdmin = isSuperAdminLogin(cleanEmail, user?.role);
        const fail = await registerFailedLogin(cleanEmail, user?.role, threshold);
        if (fail.alertNow) {
          await alertLockout({
            email: cleanEmail, ip: ipAddress, location: locationName, userAgent,
            threshold, lockMinutes: fail.lockMinutes, level: fail.level,
          });
        }
        const leftText = superAdmin ? "" : ` ${fail.attemptsLeft} attempt(s) left before lockout.`;
        return {
          success: false,
          locked: fail.lockedNow,
          attemptsLeft: superAdmin ? undefined : fail.attemptsLeft,
          error: fail.lockedNow
            ? `Too many failed login attempts. This account is locked for ${formatLockDuration(fail.lockMinutes)}.`
            : !user
            ? `No account found with this email address. Please check the email or contact the Super Admin.${leftText}`
            : `Incorrect password.${leftText}`,
          noAccount: !user,
        };
      }

      // Correct password: failed-attempt count and lockout level start again
      try {
        await clearLoginLock(cleanEmail);
      } catch {}

      // 3. Check account deactivation (Super Admin can never be deactivated)
      if (user.role !== "super_admin" && cleanEmail !== "sa@aistudio.us") {
        // Status comes only from the user's database row (User Management → Activate / Deactivate)
        const isDeactivated = user.status !== "active";

        if (isDeactivated) {
          return {
            success: false,
            deactivated: true,
            email: user.email,
            name: user.name,
            error: "This account has been deactivated. Please contact the Super Admin for activation.",
          };
        }
      }

      const authRole = user.role;
      const authName = user.name;


      // 4. Server-Side Location & Geofence Verification
      const locationEvaluation = evaluateLocationAccess(
        authRole,
        data.latitude,
        data.longitude,
        data.accuracy
      );

      // Blocked if Admin / Lead Manager is outside the permitted radius (100m) or coordinates missing / poor
      if (!locationEvaluation.authorized) {
        const dist = isFinite(locationEvaluation.distanceMeters) ? locationEvaluation.distanceMeters : null;

        await addLoginLogInDb({
          email: cleanEmail,
          role: authRole,
          ip_address: ipAddress,
          location: locationName,
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          distance_meters: dist,
          is_within_geofence: false,
          user_agent: userAgent,
          status: "blocked_location",
        });

        await addActivityLogInDb({
          action: "Login Blocked: Location Restriction",
          details: `${authName} (${cleanEmail}) attempted login from outside permitted ${getOfficeGeoConfig().allowedRadiusMeters}m office area (${dist !== null ? dist + "m from office" : "no GPS"}).`,
          performed_by: cleanEmail,
          user_role: authRole,
        });

        return {
          success: false,
          locationBlocked: true,
          status: locationEvaluation.status,
          distanceMeters: dist,
          error: locationEvaluation.userMessage || "CRM access is not available at your current location. Please move within the permitted office location to continue.",
        };
      }

      // 5. Successful login -> Create cryptographic session token
      const dist = isFinite(locationEvaluation.distanceMeters) ? locationEvaluation.distanceMeters : null;
      const sessionToken = createCrmSessionToken(
        { email: cleanEmail, name: authName, role: authRole },
        {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          distanceMeters: dist,
        }
      );

      // Record successful login in DB
      await addLoginLogInDb({
        email: cleanEmail,
        role: authRole,
        ip_address: ipAddress,
        location: locationName,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        distance_meters: dist,
        is_within_geofence: authRole === "super_admin" ? true : locationEvaluation.authorized,
        user_agent: userAgent,
        status: "success",
      });

      await addActivityLogInDb({
        action: "Admin Logged In",
        details: `${authName} (${cleanEmail}) logged in successfully${authRole === "super_admin" ? " (Super Admin global access)" : ` (within ${dist}m of office)`}`,
        performed_by: cleanEmail,
        user_role: authRole,
      });

      return {
        success: true,
        session: {
          email: cleanEmail,
          name: authName,
          role: authRole,
          token: sessionToken,
          distanceMeters: dist,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message || "Authentication failed" };
    }
  });

// Lightweight "is my account still allowed?" check, polled every few seconds by open CRMs
// so a deleted or deactivated account is signed out almost immediately.
export const checkCrmAccountServerFn = createServerFn({ method: "POST" })
  .validator((data: { token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    const check = decodeAndVerifySessionToken(data.token || "");
    if (!check.valid || !check.payload) return { active: false as const, reason: "invalid" };
    if (check.payload.role === "super_admin") return { active: true as const };
    const state = await getAdminAccountState(check.payload.email);
    // "unknown" = database not readable right now: never log people out for that.
    if (state === "missing" || state === "inactive") return { active: false as const, reason: state };
    return { active: true as const };
  });

export const verifyLocationSessionServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      latitude?: number | null | undefined;
      longitude?: number | null | undefined;
      accuracy?: number | null | undefined;
      ip?: string | undefined;
      userAgent?: string | undefined;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const verification = verifySessionWithLocation(data.token, {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
      });

      if (!verification.valid || !verification.payload) {
        const dist = verification.locationResult?.distanceMeters ?? null;

        // Log session termination if an active Admin / LM moved outside
        if (verification.payload && verification.errorCode === "OUT_OF_BOUNDS") {
          await addLoginLogInDb({
            email: verification.payload.email,
            role: verification.payload.role,
            ip_address: data.ip || "Unknown IP",
            location: "Office Out-of-Bounds Watchdog",
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            distance_meters: isFinite(dist ?? Infinity) ? dist : null,
            is_within_geofence: false,
            user_agent: data.userAgent || "Web Browser",
            status: "session_terminated",
          });

          await addActivityLogInDb({
            action: "Session Terminated: Left Office Area",
            details: `User ${verification.payload.email} (${verification.payload.role}) moved outside ${getOfficeGeoConfig().allowedRadiusMeters}m office radius (${dist}m). Active session terminated automatically.`,
            performed_by: "System / Location Watchdog",
            user_role: "system",
          });
        }

        return {
          authorized: false,
          error: verification.error || "Session authorization expired or invalid.",
          errorCode: verification.errorCode || "OUT_OF_BOUNDS",
          distanceMeters: isFinite(dist ?? Infinity) ? dist : null,
        };
      }

      // The account must still exist and be active: deleting or deactivating a user in
      // User Management ends their open session at the next check (within ~60s).
      if (verification.payload.role !== "super_admin") {
        const state = await getAdminAccountState(verification.payload.email);
        if (state === "missing" || state === "inactive") {
          try {
            await addLoginLogInDb({
              email: verification.payload.email,
              role: verification.payload.role,
              ip_address: data.ip || "Unknown IP",
              location: state === "missing" ? "Account deleted" : "Account deactivated",
              latitude: data.latitude,
              longitude: data.longitude,
              accuracy: data.accuracy,
              distance_meters: null,
              is_within_geofence: null,
              user_agent: data.userAgent || "Web Browser",
              status: "session_terminated",
            });
          } catch {}
          return {
            authorized: false,
            error: state === "missing"
              ? "This account has been removed by the Super Admin. Please contact your administrator."
              : "This account has been deactivated by the Super Admin. Please contact your administrator.",
            errorCode: "ACCOUNT_REMOVED",
            distanceMeters: null,
          };
        }
      }

      // Re-issue refreshed token
      const dist = verification.locationResult?.distanceMeters ?? verification.payload.distanceMeters ?? null;
      const refreshedToken = createCrmSessionToken(
        {
          email: verification.payload.email,
          name: verification.payload.name,
          role: verification.payload.role,
        },
        {
          latitude: data.latitude ?? verification.payload.latitude,
          longitude: data.longitude ?? verification.payload.longitude,
          accuracy: data.accuracy ?? verification.payload.accuracy,
          distanceMeters: isFinite(dist ?? Infinity) ? dist : null,
        }
      );

      return {
        authorized: true,
        refreshedToken,
        distanceMeters: isFinite(dist ?? Infinity) ? dist : null,
      };
    } catch (error: any) {
      return { authorized: false, error: error.message || "Failed to verify location session" };
    }
  });
