import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import {
  getPayPalConfigServerFn,
  getBalancePaymentInfoServerFn,
  createBalancePayPalOrderServerFn,
  capturePayPalOrderServerFn,
} from "@/lib/paypal-actions";
import { formatUsd } from "@/lib/payment-plan";

// "Pay remaining balance" page for a paid 50% advance order:
//   /pay-balance?order=<order id>&t=<signature>   (link from the payment email, confirmation page or CRM)
export const Route = createFileRoute("/pay-balance")({
  head: () => ({
    meta: [
      { title: "Pay Remaining Balance | Quickupp AI Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PayBalancePage,
});

const DEFAULT_PAYPAL_CLIENT_ID =
  "BAA7157wDWOsI4aOFpTyYgR9LzKwOnesJ69re7SMM3N8JZ8ZSOURUwr2vcJxWBGCHggTBhew1IYP2pzmjY";

type BalanceInfo = {
  receiptNumber: string;
  itemName: string;
  customerName: string;
  customerEmail: string;
  orderTotal: number;
  paidTotal: number;
  balanceDue: number;
  currency: string;
};

function PayBalancePage() {
  const [orderId, setOrderId] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<BalanceInfo | null>(null);
  const [problem, setProblem] = useState<{ paid: boolean; message: string } | null>(null);
  const [paypalClientId, setPayPalClientId] = useState(DEFAULT_PAYPAL_CLIENT_ID);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const o = params.get("order") || "";
    const t = params.get("t") || "";
    setOrderId(o);
    setToken(t);
    getPayPalConfigServerFn()
      .then((r) => {
        if (r.success && r.clientId) setPayPalClientId(r.clientId);
      })
      .catch(() => {});
    (async () => {
      try {
        const r: any = await getBalancePaymentInfoServerFn({ data: { order: o, t } });
        if (r.success) setInfo(r as BalanceInfo);
        else setProblem({ paid: !!r.paid, message: r.error || "We couldn't open this payment." });
      } catch {
        setProblem({ paid: false, message: "Something went wrong. Please try again in a minute." });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src="/images/LOGO 1.png" alt="Quickupp AI Studio" className="h-8 sm:h-9 w-auto object-contain" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-purple-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Quickupp AI Studio</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="h-2 w-full bg-gradient-brand" />
          {loading ? (
            <div className="p-12 text-center space-y-4">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
              <p className="text-sm font-semibold text-slate-700">Loading your order...</p>
            </div>
          ) : problem || !info ? (
            <div className="p-8 sm:p-12 text-center space-y-4">
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                  problem?.paid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                }`}
              >
                {problem?.paid ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                {problem?.paid ? "Order Fully Paid" : "We couldn't open this payment"}
              </h1>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">{problem?.message || "Please try again."}</p>
              <p className="text-xs text-slate-500">
                Need help?{" "}
                <a href="mailto:info@quickuppaistudio.us" className="font-semibold text-purple-600 underline">
                  info@quickuppaistudio.us
                </a>
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-10 space-y-6">
              <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Pay Remaining Balance</h1>
                <p className="text-sm text-slate-600">
                  Hi {info.customerName.split(" ")[0] || "there"}, complete the payment for your order.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2.5 text-sm">
                <Row label="Order Number" value={info.receiptNumber} mono />
                <Row label="Service" value={info.itemName} />
                <Row label="Order Total" value={`${formatUsd(info.orderTotal)} ${info.currency}`} />
                <Row label="Paid (50% Advance)" value={`${formatUsd(info.paidTotal)} ${info.currency}`} />
                <div className="border-t border-slate-200 pt-2.5">
                  <Row label="Balance Due" value={`${formatUsd(info.balanceDue)} ${info.currency}`} strong />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-red-800 text-xs font-medium">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="rounded-2xl border border-purple-200 bg-white p-5 space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-700">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Pay {formatUsd(info.balanceDue)} securely with PayPal or card</span>
                </div>
                <div className="mx-auto w-full max-w-sm">
                  <PayPalScriptProvider
                    options={{
                      clientId: paypalClientId,
                      currency: "USD",
                      intent: "capture",
                      components: "buttons",
                      "disable-funding": "paylater,credit,venmo",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", height: 46 }}
                      disabled={busy}
                      createOrder={async () => {
                        setError(null);
                        setBusy(true);
                        const r: any = await createBalancePayPalOrderServerFn({ data: { order: orderId, t: token } });
                        if (!r.success || !r.orderId) {
                          setBusy(false);
                          setError(r.error || "Could not start the payment. Please try again.");
                          throw new Error(r.error || "Could not start the payment.");
                        }
                        return r.orderId as string;
                      }}
                      onApprove={async (data) => {
                        try {
                          setBusy(true);
                          const res: any = await capturePayPalOrderServerFn({ data: { orderId: data.orderID } });
                          if (!res.success) throw new Error(res.error || "Payment verification failed.");
                          window.location.href = `/order-confirmation?orderId=${encodeURIComponent(
                            res.order?.id || data.orderID
                          )}&token=${encodeURIComponent(data.orderID)}&email=${encodeURIComponent(info.customerEmail)}`;
                        } catch (err: any) {
                          setError(err?.message || "Payment could not be completed. Please contact support.");
                          setBusy(false);
                        }
                      }}
                      onCancel={() => {
                        setBusy(false);
                        setError("Payment was cancelled. You can try again whenever you're ready.");
                      }}
                      onError={() => {
                        setBusy(false);
                        setError("An error occurred while communicating with PayPal. Please try again.");
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>A receipt for this payment will be emailed to {info.customerEmail}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, mono, strong }: { label: string; value: string; mono?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span
        className={`text-right ${mono ? "font-mono text-[13px] text-slate-800" : ""} ${
          strong ? "text-lg font-black text-amber-700" : "font-semibold text-slate-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
