// Which Login / IP Tracking rows belong to sessions that may still be live.
// Several people (Super Admin, Admins, Leads Managers) can be signed in at once, so every
// user's newest successful login from the last 24 hours (the session token lifetime) is
// treated as live, unless a later "session_terminated" entry exists for that user.
export const CRM_SESSION_HOURS = 24;

export function getLiveSessionLoginLogIds(
  logs: { id: string; email?: string | null; status?: string | null; created_at: string }[],
  now: number = Date.now()
): Set<string> {
  const cutoff = now - CRM_SESSION_HOURS * 60 * 60 * 1000;
  const sorted = [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const seen = new Set<string>();
  const live = new Set<string>();
  for (const log of sorted) {
    const email = (log.email || "").toLowerCase().trim();
    if (!email || seen.has(email)) continue;
    if (log.status === "session_terminated") {
      seen.add(email); // latest event for this user is a logout: nothing live
      continue;
    }
    if (log.status !== "success") continue;
    seen.add(email);
    if (new Date(log.created_at).getTime() >= cutoff) live.add(log.id);
  }
  return live;
}
