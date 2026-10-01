// Browser-only helper: get the most precise location the device can give within a
// short time. The first fix from laptops / PCs is often rough (Wi-Fi/IP based,
// ±500-2000 m); watching for a few seconds usually yields a much better one.
export type PreciseLocation = { latitude: number; longitude: number; accuracy: number };
export type PreciseLocationResult =
  | { ok: true; position: PreciseLocation }
  | { ok: false; reason: "denied" | "unavailable" };

export function getPreciseLocation(opts?: { maxWaitMs?: number; goodEnoughMeters?: number }): Promise<PreciseLocationResult> {
  const maxWaitMs = opts?.maxWaitMs ?? 10000;
  const goodEnough = opts?.goodEnoughMeters ?? 60;
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unavailable" });
      return;
    }
    let best: PreciseLocation | null = null;
    let done = false;
    let watchId: number | null = null;
    const finish = (result: PreciseLocationResult) => {
      if (done) return;
      done = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
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
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) finish({ ok: false, reason: "denied" });
        // other errors: keep waiting for a fix until the timer ends
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: maxWaitMs }
    );
  });
}
