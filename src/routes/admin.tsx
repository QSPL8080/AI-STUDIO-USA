import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Redirecting to CRM Portal | Quickupp AI Studio" }],
  }),
  component: AdminRedirectPage,
});

function AdminRedirectPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

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

    window.location.replace("/crm/login");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <ShieldCheck className="h-7 w-7 text-red-500" />
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
          <span>Redirecting to CRM Portal...</span>
        </div>
      </div>
    </div>
  );
}
