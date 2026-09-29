import { createServerFn } from "@tanstack/react-start";
import { classifyCalendlyInvitee, resolvePreviousSlot, formatCalendlySlot } from "./calendly-status";
import {
  saveLead as saveLeadToDb,
  getLeads as getLeadsFromDb,
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
  addLoginLog as addLoginLogInDb,
  getLoginLogs as getLoginLogsFromDb,
  getAdminUsers as getAdminUsersFromDb,
  getAdminUserByEmailWithPassword,
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

// 1. Submit Lead from Website Forms
export const submitLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    source: "Contact Form" | "Popup Modal" | "USA - Contact Form" | "USA - Popup Modal" | string;
    name: string;
    phone: string;
    email?: string;
    videoType: string;
    business: string;
    location?: string;
    industry?: string;
    requirement?: string;
    additional?: string;
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
          action: saved.is_duplicate ? "Duplicate Lead Merged" : "Lead Submitted",
          details: saved.is_duplicate
            ? `Repeat submission from ${normalizedData.source} merged into existing lead ${saved.name} (${saved.phone})`
            : `New lead received from ${saved.source} for ${saved.name} (${saved.phone})`,
          performed_by: "System / Website",
          user_role: "system",
        });
      } catch {}

      // Create CRM Notification
      try {
        const notif = await saveCRMNotificationInDb({
          type: "lead_new",
          title: "New Website Lead Submitted",
          message: `${saved.name} (${saved.phone}) submitted from ${saved.source} - ${saved.video_type || "AI Video"}`,
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
  .validator((data?: { includeDeleted?: boolean }) => data || {})
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
    source?: string;
    name: string;
    phone: string;
    email?: string;
    videoType: string;
    videoQuantity?: number | string;
    business: string;
    location?: string;
    industry?: string;
    requirement?: string;
    additional?: string;
    status?: LeadStatus;
    projectStatus?: ProjectStatus;
    notes?: string;
    deliveryDate?: string;
    meetingDate?: string;
    meetingTime?: string;
    meetingLink?: string;
    meetingType?: string;
    meetingStatus?: string;
    campaignName?: string;
    adsetName?: string;
    adName?: string;
    formName?: string;
    metaLeadId?: string;
    isDuplicate?: boolean;
    assignedAdmin?: string;
    createdBy?: string;
    userRole?: string;
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
    updatedBy?: string;
    userRole?: string;
    changeSummary?: string;
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
    closedBy?: string;
    deliveryDate?: string;
    closedAt?: string;
    userRole?: string;
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
    deliveryDate?: string;
    performedBy?: string;
    userRole?: string;
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
  .validator((data: { id: string; performedBy?: string; userRole?: string }) => data)
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
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// Backward-compatible deleteLeadServerFn
export const deleteLeadServerFn = softDeleteLeadServerFn;

// 8. Restore Lead from Recycle Bin
export const restoreLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; performedBy?: string; userRole?: string }) => data)
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
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 9. Permanent Delete (Super Admin only)
export const permanentDeleteLeadServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; performedBy?: string; userRole?: string }) => data)
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
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 9b. Bulk Permanent Delete (Super Admin only)
export const bulkPermanentDeleteLeadsServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; performedBy?: string; userRole?: string }) => data)
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
      return { success: true, count };
    } catch (error: any) {
      return { success: false, count: 0, error: error.message };
    }
  });

// 9c. Bulk Restore Leads (Super Admin / Admin)
export const bulkRestoreLeadsServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; performedBy?: string; userRole?: string }) => data)
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
      return { success: true, count };
    } catch (error: any) {
      return { success: false, count: 0, error: error.message };
    }
  });

// 9d. Empty Entire Recycle Bin (Super Admin only)
export const emptyRecycleBinServerFn = createServerFn({ method: "POST" })
  .validator((data: { performedBy?: string; userRole?: string }) => data)
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
  .validator((data: { lead_id?: string; action: string; details: string; performed_by: string; user_role: string }) => data)
  .handler(async ({ data }) => {
    try {
      const log = await addActivityLogInDb(data);
      return { success: true, log };
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
    location?: string;
    latitude?: number | null;
    longitude?: number | null;
    accuracy?: number | null;
    distance_meters?: number | null;
    is_within_geofence?: boolean | null;
    user_agent: string;
    status?: "success" | "failed" | "blocked_location" | "session_terminated" | string;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const log = await addLoginLogInDb(data);
      return { success: true, log };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const fetchLoginLogsServerFn = createServerFn({ method: "GET" })
  .validator((limit?: number) => limit || 100)
  .handler(async ({ data }) => {
    try {
      const logs = await getLoginLogsFromDb(data);
      return { success: true, logs };
    } catch (error: any) {
      return { success: false, logs: [] as LoginLog[], error: error.message };
    }
  });

// 12. Admin Users (Super Admin Management)
export const fetchAdminUsersServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const users = await getAdminUsersFromDb();
    return { success: true, users };
  } catch (error: any) {
    return { success: false, users: [] as AdminUser[], error: error.message };
  }
});

export const createAdminUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; password: string; role: "super_admin" | "admin" | "leads_manager"; status?: "active" | "inactive"; performedBy?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const user = await saveAdminUserInDb(data);
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
  .validator((data: { id: string; status: "active" | "inactive"; email?: string; performedBy?: string }) => data)
  .handler(async ({ data }) => {
    try {
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
      }
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteAdminUserServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; email?: string; performedBy?: string }) => data)
  .handler(async ({ data }) => {
    try {
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
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const sendAccountActivationRequestServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; name?: string; reason?: string; ip?: string }) => data)
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
  return (process.env.CALENDLY_API_TOKEN ||
        process.env.VITE_CALENDLY_API_TOKEN ||
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

export async function syncCalendlyEventsFromApi(opts?: { force?: boolean }): Promise<{ count: number; error?: string; skipped?: boolean }> {
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
      fetch(listUrl("active"), { headers: { Authorization: `Bearer ${token}` } }),
      fetch(listUrl("canceled"), { headers: { Authorization: `Bearer ${token}` } }),
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
    // 1. Live Sync from Calendly API in background/inline (respecting cutoff)
    await syncCalendlyEventsFromApi();

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
  .validator((data?: { resetBy?: string }) => data || {})
  .handler(async ({ data }) => {
    try {
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
    (data: { id: string; outcome: string; note: string; performedBy?: string; userRole?: string }) => data
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
  .validator((data: { id: string; client_name?: string; performedBy?: string; userRole?: string; permanent?: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      const isSuper = data.userRole === "super_admin";
      const isPermanent = data.permanent === true && isSuper;

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
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const deleteCalendlyMeetingsBulkServerFn = createServerFn({ method: "POST" })
  .validator((data: { ids: string[]; performedBy?: string; userRole?: string; permanent?: boolean }) => data)
  .handler(async ({ data }) => {
    try {
      const isSuper = data.userRole === "super_admin";
      const isPermanent = data.permanent === true && isSuper;

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
      return { success: ok, count: data.ids.length };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// 14. Record Calendly Booking (from the website widget). The widget only knows the
//     Calendly URIs, so the real invitee / event details are fetched from the API.
export const recordCalendlyBookingServerFn = createServerFn({ method: "POST" })
  .validator((data: { invitee_uri: string; event_uri?: string | undefined; notes?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const inviteeUri = (data.invitee_uri || "").trim();
      if (!inviteeUri.startsWith("https://api.calendly.com/")) {
        return { success: false, error: "Invalid Calendly invitee URI" };
      }
      const settings = await getCrmSettingsFromDb();
      const token = getCalendlyApiToken(settings);
      const headers = { Authorization: `Bearer ${token}` };

      const invRes = await fetch(inviteeUri, { headers });
      if (!invRes.ok) return { success: false, error: `Calendly invitee lookup failed (${invRes.status})` };
      const invitee = ((await invRes.json()) as any)?.resource;
      const eventUri = invitee?.event || data.event_uri;
      if (!invitee?.email || !eventUri) return { success: false, error: "Calendly booking details unavailable" };

      const evRes = await fetch(eventUri, { headers });
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

      // Linked lead (saveLead merges duplicates by email / phone)
      const lead = await saveLeadToDb({
        source: "USA Website - Calendly",
        name: invitee.name || "Calendly Client",
        email: invitee.email,
        phone: invitee.text_reminder_number || "N/A",
        videoType: ev.name || "AI Video Strategy Call (30 min)",
        business: "Inbound Calendly Strategy Call",
        status: "New",
        notes: `Calendly booking on ${slot.date} at ${slot.time}. Meeting Link: ${ev.location?.join_url || ev.uri}`,
        meetingDate: slot.date,
        meetingTime: slot.time,
        meetingLink: ev.location?.join_url || ev.uri,
      });

      await addActivityLogInDb({
        lead_id: lead.id,
        action: decision.status === "rescheduled" ? "Calendly Meeting Rescheduled" : "Calendly Meeting Booked",
        details: `Strategy call for ${invitee.name} (${invitee.email}) on ${slot.date} at ${slot.time}`,
        performed_by: "Calendly Integration",
        user_role: "system",
      });

      return { success: true, meeting, lead };
    } catch (error: any) {
      console.error("recordCalendlyBookingServerFn error:", error);
      return { success: false, error: error.message };
    }
  });

// 15. Send Test Calendly Booking Event (for Admins to test live sync)
export const sendTestCalendlyBookingServerFn = createServerFn({ method: "POST" })
  .validator((data: { performedBy?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const names = [
        "Marcus Vance (USA Luxury Real Estate)",
        "Elena Rostova (Fashion Brand USA)",
        "David Sterling (SaaS Founder, Austin TX)",
        "Sophia Chen (E-Commerce CEO, NYC)",
        "Alexander Hayes (Beverly Hills Dental Group)",
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomSlug = randomName.split(" ")[0].toLowerCase() + Math.floor(Math.random() * 900 + 100);
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
  .validator((data?: { limit?: number }) => data || {})
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
  lead?: Lead;
  meeting?: CalendlyMeeting;
  notification?: CRMNotification;
  id?: string;
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
    notificationEmail: string;
    syncInterval: number;
    inactivityTimeout?: number;
    loginAttempts?: number;
    performedBy?: string;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const title = (data.platformTitle || "").trim().slice(0, 120);
      const email = (data.notificationEmail || "").trim();
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
      performedBy?: string;
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
  .validator((data: { message: string; performedBy?: string }) => data)
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
const LOGIN_LOCKOUT_MINUTES = 15;

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
  .validator((data: { email: string; ip?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const threshold = await getLoginThreshold();
      const failures = await countRecentFailedLogins(data.email, data.ip, LOGIN_LOCKOUT_MINUTES);
      return { success: true, locked: failures >= threshold, lockoutMinutes: LOGIN_LOCKOUT_MINUTES };
    } catch (error: any) {
      return { success: false, locked: false, error: error.message };
    }
  });

export const recordFailedLoginServerFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; ip?: string; location?: string; userAgent?: string }) => data)
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
      const failures = await countRecentFailedLogins(data.email, data.ip, LOGIN_LOCKOUT_MINUTES);
      const locked = failures >= threshold;

      // Alert exactly once, when the threshold is first reached
      if (failures === threshold) {
        const mail = await sendFailedLoginAlertEmail({
          email: data.email,
          ipAddress: data.ip || "Unknown",
          location: data.location,
          userAgent: data.userAgent,
          attempts: failures,
          threshold,
          lockoutMinutes: LOGIN_LOCKOUT_MINUTES,
        });
        try {
          await addActivityLogInDb({
            action: "Failed Login Threshold Reached",
            details: `${failures} failed logins for ${data.email || "unknown"} from ${data.ip || "unknown IP"}; locked ${LOGIN_LOCKOUT_MINUTES} min; alert email ${mail.success ? "sent" : "FAILED: " + (mail.error || "")}`,
            performed_by: "System / Security",
            user_role: "system",
          });
        } catch {}
      }

      return {
        success: true,
        locked,
        attemptsLeft: Math.max(threshold - failures, 0),
        lockoutMinutes: LOGIN_LOCKOUT_MINUTES,
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
      latitude?: number | null;
      longitude?: number | null;
      accuracy?: number | null;
      ip?: string;
      locationName?: string;
      userAgent?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const cleanEmail = (data.email || "").trim().toLowerCase();
      const cleanPass = (data.password || "").trim();
      const ipAddress = data.ip || "Unknown IP";
      const locationName = data.locationName || "Unknown Location";
      const userAgent = data.userAgent || "Web Browser";

      // 1. Check lockout threshold
      const threshold = await getLoginThreshold();
      const failures = await countRecentFailedLogins(cleanEmail, ipAddress, LOGIN_LOCKOUT_MINUTES);
      if (failures >= threshold) {
        return {
          success: false,
          locked: true,
          error: `Too many failed login attempts. This account / IP is locked for ${LOGIN_LOCKOUT_MINUTES} minutes. The Super Admin has been notified.`,
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

        const newFailures = await countRecentFailedLogins(cleanEmail, ipAddress, LOGIN_LOCKOUT_MINUTES);
        if (newFailures === threshold) {
          await sendFailedLoginAlertEmail({
            email: cleanEmail,
            ipAddress,
            location: locationName,
            userAgent,
            attempts: newFailures,
            threshold,
            lockoutMinutes: LOGIN_LOCKOUT_MINUTES,
          });
          try {
            await addActivityLogInDb({
              action: "Failed Login Threshold Reached",
              details: `${newFailures} failed logins for ${cleanEmail} from ${ipAddress}; locked ${LOGIN_LOCKOUT_MINUTES} min`,
              performed_by: "System / Security",
              user_role: "system",
            });
          } catch {}
        }

        const lockedNow = newFailures >= threshold;
        return {
          success: false,
          locked: lockedNow,
          attemptsLeft: Math.max(threshold - newFailures, 0),
          error: lockedNow
            ? `Too many failed login attempts. This account / IP is locked for ${LOGIN_LOCKOUT_MINUTES} minutes.`
            : `Invalid email or password. ${Math.max(threshold - newFailures, 0)} attempt(s) left before lockout.`,
        };
      }

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

      // Blocked if Admin / Lead Manager is outside 200m or coordinates missing / poor
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
          details: `${authName} (${cleanEmail}) attempted login from outside permitted 200m office area (${dist !== null ? dist + "m from office" : "no GPS"}).`,
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

export const verifyLocationSessionServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      token: string;
      latitude?: number | null;
      longitude?: number | null;
      accuracy?: number | null;
      ip?: string;
      userAgent?: string;
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
            details: `User ${verification.payload.email} (${verification.payload.role}) moved outside 200m office radius (${dist}m). Active session terminated automatically.`,
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
