import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Send,
  Loader2,
} from "lucide-react";
import { authenticateAdminServerFn, sendAccountActivationRequestServerFn } from "@/lib/lead-actions";

export const Route = createFileRoute("/crm/login")({
  ssr: false,
  head: () => ({
    meta: [{ title: "CRM Admin Portal | Quickupp AI Studio" }],
  }),
  component: CrmLoginPage,
});

export function CrmLoginPage() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [locationErrorType, setLocationErrorType] = useState<"none" | "denied" | "out_of_bounds" | "poor_accuracy">("none");

  // Deactivated Account State & Activation Request
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [deactivatedEmail, setDeactivatedEmail] = useState("");
  const [deactivatedName, setDeactivatedName] = useState("");
  const [activationRequested, setActivationRequested] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if redirected because of session deactivation
    const params = new URLSearchParams(window.location.search);
    const wasDeactivated = params.get("deactivated") === "1";
    if (wasDeactivated) {
      setAuthError("Your session was terminated because this account was deactivated by the Super Admin.");
      // Make sure no saved login sends them straight back into the CRM
      try {
        sessionStorage.removeItem("ai_studio_auth_session");
        sessionStorage.removeItem("crm_last_active");
        localStorage.removeItem("ai_studio_auth_session");
        localStorage.removeItem("crm_last_active");
      } catch {}
    }

    try {
      if (wasDeactivated) throw new Error("skip auto-login");
      const savedSession = sessionStorage.getItem("ai_studio_auth_session") || localStorage.getItem("ai_studio_auth_session");
      const lastActiveStr = sessionStorage.getItem("crm_last_active") || localStorage.getItem("crm_last_active");
      const lastActive = lastActiveStr ? Number(lastActiveStr) : 0;
      const timeoutMs = 30 * 60 * 1000;

      if (savedSession && lastActive && Date.now() - lastActive < timeoutMs) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.role) {
          window.location.replace("/crm");
          return;
        }
      }
    } catch {}

    const savedEmail = localStorage.getItem("ai_studio_remembered_email");
    if (savedEmail) {
      setEmailInput(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isCheckingLocation) return;

    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanEmail || !cleanPass) {
      setAuthError("Please enter both email and password.");
      return;
    }

    setAuthError("");
    setIsDeactivated(false);
    setActivationRequested(false);
    setIsSubmitting(true);
    setIsCheckingLocation(true);
    setLocationErrorType("none");

    // Geolocation acquisition
    let lat: number | null = null;
    let lon: number | null = null;
    let acc: number | null = null;
    let locName = "USA Office";

    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        acc = pos.coords.accuracy;
      } catch (err: any) {
        console.warn("Geolocation prompt skipped or unavailable:", err.message);
      }
    }

    try {
      const res = await authenticateAdminServerFn({
        data: {
          email: cleanEmail,
          password: cleanPass,
          latitude: lat,
          longitude: lon,
          accuracy: acc,
          locationName: locName,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Browser",
        },
      });

      if (res.success && res.session) {
        // Successful login
        const nowStr = Date.now().toString();
        sessionStorage.setItem("ai_studio_auth_session", JSON.stringify(res.session));
        localStorage.setItem("ai_studio_auth_session", JSON.stringify(res.session));
        sessionStorage.setItem("crm_last_active", nowStr);
        localStorage.setItem("crm_last_active", nowStr);

        if (rememberMe) {
          localStorage.setItem("ai_studio_remembered_email", cleanEmail);
        } else {
          localStorage.removeItem("ai_studio_remembered_email");
        }

        // Navigate to CRM portal
        window.location.replace("/crm");
      } else if (res.deactivated) {
        setIsDeactivated(true);
        setDeactivatedEmail(res.email || cleanEmail);
        setDeactivatedName(res.name || cleanEmail);
        setAuthError(res.error || "This account is deactivated. Please contact the Super Admin for activation.");
      } else if (res.locationBlocked) {
        setLocationErrorType("out_of_bounds");
        setAuthError(res.error || "CRM access restricted to permitted office geofence.");
      } else {
        setAuthError(res.error || "Invalid email or password. Please verify your credentials.");
      }
    } catch (err: any) {
      setAuthError(err?.message || "Connection failed. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
      setIsCheckingLocation(false);
    }
  };

  const handleSendActivationRequest = async () => {
    if (isSendingRequest || !deactivatedEmail) return;

    setIsSendingRequest(true);
    try {
      const res = await sendAccountActivationRequestServerFn({
        data: {
          email: deactivatedEmail,
          name: deactivatedName,
          reason: "User requested account reactivation via CRM login portal.",
        },
      });

      if (res.success) {
        setActivationRequested(true);
      } else {
        alert(res.error || "Failed to send activation email. Please email info@quickuppaistudio.us directly.");
      }
    } catch (err: any) {
      alert("Error sending request: " + (err?.message || "Network error. Please try again."));
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 text-slate-900 transition-colors">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl transition-all">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <img
              src="/images/LOGO 1.png"
              alt="Quickupp AI Studio logo"
              className="h-10 w-auto object-contain"
              width={140}
              height={44}
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">CRM Admin Portal</h2>
          <p className="mt-1 text-xs text-slate-500">
            Quickupp AI Studio Leads Management & CRM
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
          {authError ? (
            <div
              className={`rounded-xl border p-3.5 text-xs ${
                locationErrorType !== "none"
                  ? "border-amber-300 bg-amber-50 text-amber-900"
                  : isDeactivated
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-red-500/40 bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {locationErrorType !== "none" ? (
                  <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                ) : isDeactivated ? (
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold">
                    {locationErrorType !== "none"
                      ? "Location Restriction Alert"
                      : isDeactivated
                      ? "Account Deactivated"
                      : "Authentication Notice"}
                  </p>
                  <p className="mt-0.5 leading-relaxed">{authError}</p>

                  {/* Location guidance */}
                  {locationErrorType === "denied" && (
                    <p className="mt-1.5 text-[11px] font-semibold text-amber-800">
                      💡 Please click the lock/settings icon in your browser URL address bar to enable Location Permission, then retry.
                    </p>
                  )}

                  {/* Deactivated activation button */}
                  {isDeactivated && (
                    <div className="mt-2.5">
                      {activationRequested ? (
                        <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Activation request sent to info@quickuppaistudio.us. Super Admin will review.</span>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendActivationRequest}
                          disabled={isSendingRequest}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-60"
                        >
                          {isSendingRequest ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Sending Request...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3" />
                              <span>Request Account Activation</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Admin Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="sa@aistudio.us"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Email Checkbox */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-600">Remember email</span>
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isCheckingLocation || isSubmitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCheckingLocation || isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Location &amp; Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Sign In to CRM Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
