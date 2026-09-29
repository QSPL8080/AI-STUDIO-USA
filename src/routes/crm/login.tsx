import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
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
    meta: [{ title: "CRM Portal Login | Quickupp AI Studio" }],
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
    if (params.get("deactivated") === "1") {
      setAuthError("Your session was terminated because this account was deactivated by the Super Admin.");
    }

    try {
      const savedSession = sessionStorage.getItem("ai_studio_auth_session");
      const lastActiveStr = sessionStorage.getItem("crm_last_active");
      const lastActive = lastActiveStr ? Number(lastActiveStr) : 0;
      const timeoutMs = 15 * 60 * 1000;

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
    if (isSubmitting) return;

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

        // Navigate to CRM
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 selection:bg-red-500 selection:text-white">
      {/* Background Subtle Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-slate-950 z-0" />

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700/60 shadow-xl shadow-black/40">
            <ShieldCheck className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Quickupp AI Studio
          </h1>
          <p className="mt-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            CRM & Lead Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Sign In to CRM</h2>
            <p className="mt-1 text-xs text-slate-400">
              Enter your authorized staff or administrator credentials
            </p>
          </div>

          {/* Deactivated Notice Box */}
          {isDeactivated && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="font-bold text-red-300 text-sm">Account Deactivated</p>
                  <p className="text-slate-300 leading-relaxed text-[12px]">
                    This account is currently deactivated. Please contact the Super Admin for activation.
                  </p>

                  {activationRequested ? (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 p-2.5 text-[11px] font-semibold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>
                        Activation request sent to <b>info@quickuppaistudio.us</b>. The Super Admin will review your account.
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSendActivationRequest}
                        disabled={isSendingRequest}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-red-900/30 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSendingRequest ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Sending Request...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Request Account Activation</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* General Error Banner */}
          {authError && !isDeactivated && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-300 animate-in fade-in">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{authError}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Authorized Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@aistudio.us"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span>Remember email</span>
              </label>

              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>Geofence Protected</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/40 hover:from-red-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials & Location...</span>
                </>
              ) : (
                <span>Sign In to CRM</span>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3 text-slate-400" />
              <span>256-Bit Encrypted CRM Portal • Authorized Personnel Only</span>
            </p>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Need access or forgot password? Contact <a href="mailto:info@quickuppaistudio.us" className="text-slate-400 hover:text-white underline">info@quickuppaistudio.us</a></p>
        </div>
      </div>
    </div>
  );
}
