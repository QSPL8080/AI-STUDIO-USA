// Browser-only helper: get the most precise location the device can give within a
// short time. The first fix from laptops / PCs is often rough (Wi-Fi/IP based,
// ±500-2000 m); watching for a few seconds usually yields a much better one.
export type PreciseLocation = { latitude: number; longitude: number; accuracy: number };
export type PreciseLocationResult =
  | { ok: true; position: PreciseLocation }
  | { ok: false; reason: "denied" | "unavailable" };

export function getPreciseLocation(opts?: {
  maxWaitMs?: number;
  goodEnoughMeters?: number;
  /** After the first fix, wait at most this long for a better one (default 2s). */
  settleMs?: number;
}): Promise<PreciseLocationResult> {
  const maxWaitMs = opts?.maxWaitMs ?? 10000;
  const goodEnough = opts?.goodEnoughMeters ?? 60;
  const settleMs = opts?.settleMs ?? 2000;
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unavailable" });
      return;
    }
    let best: PreciseLocation | null = null;
    let done = false;
    let watchId: number | null = null;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const finish = (result: PreciseLocationResult) => {
      if (done) return;
      done = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      if (settleTimer) clearTimeout(settleTimer);
      resolve(result);
    };
    const timer = setTimeout(() => {
      finish(best ? { ok: true, position: best } : { ok: false, reason: "unavailable" });
    }, maxWaitMs);
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const p = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy };
        if (!best || p.accuracy < best.accuracy) best = p;
        if (p.accuracy <= goodEnough) finish({ ok: true, position: p });
        // First fix received: give the device a short moment to improve it, then go
        // (the server accepts any accuracy when the reading is inside the office area).
        else if (!settleTimer) settleTimer = setTimeout(() => best && finish({ ok: true, position: best }), settleMs);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) finish({ ok: false, reason: "denied" });
        // Location not available on this device (e.g. location services off): don't wait for nothing.
        else if (err.code === err.POSITION_UNAVAILABLE)
          finish(best ? { ok: true, position: best } : { ok: false, reason: "unavailable" });
        // timeout: the timer above finishes with the best fix so far
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: maxWaitMs }
    );
  });
}
