/**
 * Shared Calendly → CRM status rules (used by the webhook and by the API sync).
 *
 * How Calendly represents a lifecycle:
 *  - Booked:       invitee (status active)
 *  - Rescheduled:  the OLD invitee is cancelled with `rescheduled: true` and `new_invitee` set;
 *                  a NEW invitee is created with `old_invitee` pointing at the old one.
 *  - Cancelled:    invitee status "canceled" with `rescheduled: false`. A booking that was
 *                  itself created by a reschedule still has `old_invitee` set when cancelled.
 */
export type CalendlyAction =
  | { action: "ignore"; reason: "old_slot_of_reschedule" }
  | {
      action: "save";
      status: "scheduled" | "rescheduled" | "cancelled" | "not_conducted" | "no_show";
      isRescheduled: boolean;
      /** Set when this booking replaced an earlier one (used to find the CRM meeting). */
      oldInviteeUri?: string;
      /** Host marked the invitee as a no-show in Calendly */
      noShow?: boolean;
    };

export function classifyCalendlyInvitee(input: {
  eventType?: string | undefined; // webhook event, e.g. "invitee.canceled"
  eventStatus?: string | undefined; // scheduled_event.status: "active" | "canceled"
  endTime?: string | undefined; // scheduled_event.end_time (meeting time passed?)
  now?: number;
  invitee: any;
  payload?: any;
}): CalendlyAction {
  const invitee = input.invitee || {};
  const payload = input.payload || {};
  const eventType = (input.eventType || "").toLowerCase();

  const isCancelled =
    eventType.includes("canceled") ||
    eventType.includes("cancelled") ||
    invitee.status === "canceled" ||
    payload.status === "canceled" ||
    input.eventStatus === "canceled";

  const newInvitee = invitee.new_invitee || payload.new_invitee;
  const oldInvitee = invitee.old_invitee || payload.old_invitee;
  const replacedByReschedule = invitee.rescheduled === true || payload.rescheduled === true || Boolean(newInvitee);

  if (isCancelled && replacedByReschedule) {
    return { action: "ignore", reason: "old_slot_of_reschedule" };
  }
  if (isCancelled) {
    // A rescheduled booking that is later cancelled: still a real cancellation
    return oldInvitee
      ? { action: "save", status: "cancelled", isRescheduled: false, oldInviteeUri: String(oldInvitee) }
      : { action: "save", status: "cancelled", isRescheduled: false };
  }
  // Meeting time has passed: Calendly only tells us about a no-show (marked by the host).
  // Otherwise it is "not_conducted" until a CRM user records the real result.
  const endMs = input.endTime ? new Date(input.endTime).getTime() : NaN;
  const isPast = !isNaN(endMs) && endMs < (input.now ?? Date.now());
  const noShow = Boolean(invitee.no_show);
  if (isPast) {
    const status = noShow ? "no_show" : "not_conducted";
    return oldInvitee
      ? { action: "save", status, isRescheduled: true, oldInviteeUri: String(oldInvitee), noShow }
      : { action: "save", status, isRescheduled: false, noShow };
  }
  if (oldInvitee) {
    return { action: "save", status: "rescheduled", isRescheduled: true, oldInviteeUri: String(oldInvitee) };
  }
  return { action: "save", status: "scheduled", isRescheduled: false };
}

/** Same date/time strings the CRM stores (America/New_York). */
export function formatCalendlySlot(startTime: string | undefined): { date: string; time: string } | null {
  if (!startTime) return null;
  const d = new Date(startTime);
  if (isNaN(d.getTime())) return null;
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" }),
    time:
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/New_York" }) +
      " EST",
  };
}

// Cache: old invitee URI → its original slot (a slot never changes once cancelled)
const previousSlotCache = new Map<string, { date: string; time: string } | null>();

/**
 * For a rescheduled booking, look up the ORIGINAL slot (date/time) via the old invitee,
 * so the CRM updates exactly that meeting even if the client has several meetings.
 */
export async function resolvePreviousSlot(
  oldInviteeUri: string | undefined,
  token: string | undefined
): Promise<{ date: string; time: string } | null> {
  if (!oldInviteeUri || !token || !oldInviteeUri.startsWith("https://api.calendly.com/")) return null;
  if (previousSlotCache.has(oldInviteeUri)) return previousSlotCache.get(oldInviteeUri) || null;
  try {
    const headers = { Authorization: `Bearer ${token}` };
    const invRes = await fetch(oldInviteeUri, { headers });
    if (!invRes.ok) return null;
    const inv = ((await invRes.json()) as any)?.resource;
    const eventUri: string | undefined = inv?.event;
    if (!eventUri) return null;
    const evRes = await fetch(eventUri, { headers });
    if (!evRes.ok) return null;
    const ev = ((await evRes.json()) as any)?.resource;
    const slot = formatCalendlySlot(ev?.start_time);
    previousSlotCache.set(oldInviteeUri, slot);
    return slot;
  } catch {
    return null;
  }
}
