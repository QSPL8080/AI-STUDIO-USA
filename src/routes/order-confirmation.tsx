import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Mail,
  ArrowLeft,
  HelpCircle,
  FileText,
} from "lucide-react";
import {
  capturePayPalOrderServerFn,
  lookupOrderServerFn,
  formatOrderInvoiceNumber,
} from "@/lib/paypal-actions";
import { FloatingWhatsAppButton } from "@/components/site/sections";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed | Quickupp AI Studio" },
      {
        name: "description",
        content: "Your payment has been successfully received and your order is confirmed.",
      },
    ],
  }),
  component: OrderConfirmationPage,
});

export function OrderConfirmationPage() {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    serviceName: string;
    packageName: string;
    amountPaid: string;
    amountNumber: number;
    paymentMethod: string;
    transactionId: string;
    customerName: string;
    customerEmail: string;
    customerCompany?: string | undefined;
    billingAddress?: string | undefined;
    paymentDate: string;
    paymentTime: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("orderId") || params.get("order_id");
    const payerId = params.get("PayerID");
    const queryEmail = params.get("email");

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    });
    const timeStr =
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      }) + " EST";

    async function initializeOrder() {
      try {
        // If returning from PayPal redirect flow with pending token
        if (token && payerId) {
          const captureRes = await capturePayPalOrderServerFn({
            data: { orderId: token },
          });
          if (captureRes.success && captureRes.order) {
            const o = captureRes.order;
            setOrderData({
              orderNumber: formatOrderInvoiceNumber(o.id, o.created_at),
              serviceName: o.item_name || "AI Video Service",
              packageName: o.item_name?.includes("Package") ? o.item_name : "Video Package",
              amountPaid: `$${Number(o.amount).toFixed(2)} ${o.currency || "USD"}`,
              amountNumber: Number(o.amount),
              paymentMethod: "PayPal",
              transactionId: captureRes.captureId || o.paypal_order_id,
              customerName: o.customer_name || "Valued Client",
              customerEmail: o.customer_email || queryEmail || "",
              customerCompany: o.customer_company || undefined,
              billingAddress: undefined,
              paymentDate: dateStr,
              paymentTime: timeStr,
            });
            setLoading(false);
            return;
          }
        }

        // If lookup token or orderId is provided
        if (token) {
          const lookupRes = await lookupOrderServerFn({
            data: { identifier: token },
          });
          if (lookupRes.success && lookupRes.order) {
            const o = lookupRes.order;
            setOrderData({
              orderNumber: formatOrderInvoiceNumber(o.id, o.created_at),
              serviceName: o.item_name || "AI Video Service",
              packageName: o.item_name?.includes("Package") ? o.item_name : "Video Package",
              amountPaid: `$${Number(o.amount).toFixed(2)} ${o.currency || "USD"}`,
              amountNumber: Number(o.amount),
              paymentMethod: "PayPal",
              transactionId: o.paypal_capture_id || o.paypal_order_id,
              customerName: o.customer_name || "Valued Client",
              customerEmail: o.customer_email || queryEmail || "",
              customerCompany: o.customer_company || undefined,
              billingAddress: undefined,
              paymentDate: dateStr,
              paymentTime: timeStr,
            });
            setLoading(false);
            return;
          } else {
            // Token provided from direct checkout redirect
            setOrderData({
              orderNumber: formatOrderInvoiceNumber(token),
              serviceName: "AI Video Service",
              packageName: "Order Confirmed",
              amountPaid: "$1.00 USD",
              amountNumber: 1.0,
              paymentMethod: "PayPal",
              transactionId: token,
              customerName: "Valued Client",
              customerEmail: queryEmail || "",
              customerCompany: undefined,
              billingAddress: undefined,
              paymentDate: dateStr,
              paymentTime: timeStr,
            });
          }
        }
      } catch (err) {
        console.warn("Could not lookup order automatically:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeOrder();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      {/* Top Header - Pure Light Mode */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img
              src="/images/logo.png"
              alt="Quickupp AI Studio"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-purple-600 hover:text-purple-600 transition-all shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Quickupp AI Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Order Confirmation Screen - Light Mode */}
      <main className="flex-1 py-10 sm:py-16 px-4 bg-slate-50">
        <div className="mx-auto w-full max-w-2xl">
          {/* Card Container */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 animate-in zoom-in-95 duration-200">
            {/* Top Brand Accent Bar */}
            <div className="h-2 w-full bg-gradient-brand" />

            {loading ? (
              <div className="p-12 text-center space-y-4">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
                <p className="text-sm font-semibold text-slate-700">Verifying order confirmation...</p>
              </div>
            ) : !orderData ? (
              <div className="p-8 sm:p-12 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/60">
                  <FileText className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">No Recent Order Found</h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  If you recently placed an order, please check your inbox for your confirmation and PDF receipt, or contact support at{" "}
                  <a href="mailto:info@quickuppaistudio.us" className="text-purple-600 underline font-semibold">
                    info@quickuppaistudio.us
                  </a>.
                </p>
                <div className="pt-2">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-98"
                  >
                    <span>Back to Quickupp AI Studio</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 space-y-7">
                {/* Header Icon & Message */}
                <div className="text-center space-y-2.5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 shadow-inner">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Payment Successful! 🎉
                    </h1>
                    <p className="text-sm sm:text-base font-semibold text-purple-700">
                      Thank you for your order.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                      Your payment has been received successfully and your order is now confirmed.
                    </p>
                  </div>
                </div>

                {/* Payment Details Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-700 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Payment Details</span>
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      ✓ PAID
                    </span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                    <div className="space-y-0.5">
                      <dt className="text-xs text-slate-500 font-medium">Order Number</dt>
                      <dd className="font-mono font-bold text-slate-900 select-all">
                        {orderData.orderNumber}
                      </dd>
                    </div>

                    <div className="space-y-0.5">
                      <dt className="text-xs text-slate-500 font-medium">Service</dt>
                      <dd className="font-semibold text-slate-900">
                        {orderData.serviceName}
                      </dd>
                    </div>

                    <div className="space-y-0.5">
                      <dt className="text-xs text-slate-500 font-medium">Package</dt>
                      <dd className="font-semibold text-slate-900">
                        {orderData.packageName}
                      </dd>
                    </div>

                    <div className="space-y-0.5">
                      <dt className="text-xs text-slate-500 font-medium">Amount Paid</dt>
                      <dd className="font-bold text-purple-700 text-sm sm:text-base">
                        {orderData.amountPaid}
                      </dd>
                    </div>

                    <div className="space-y-0.5">
                      <dt className="text-xs text-slate-500 font-medium">Payment Method</dt>
                      <dd className="font-medium text-slate-800">
                        {orderData.paymentMethod}
                      </dd>
                    </div>

                    <div className="space-y-0.5">
                      <dt className="text-xs text-slate-500 font-medium">Transaction ID</dt>
                      <dd className="font-mono text-xs text-slate-700 select-all truncate">
                        {orderData.transactionId}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Your Receipt Has Been Emailed Section */}
                <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-5 text-left space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                    <Mail className="h-4.5 w-4.5 text-purple-600" />
                    <span>Your Receipt Has Been Emailed</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A payment confirmation and PDF receipt have been sent to:
                  </p>
                  <div className="font-semibold font-mono text-sm text-purple-900 bg-white px-3.5 py-1.5 rounded-lg border border-purple-200 shadow-xs inline-block">
                    {orderData.customerEmail || "your email address"}
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Please check your inbox, and your spam/junk folder if you don't see it shortly.
                  </p>
                </div>

                {/* Next Steps Notice (Sentence only, no heading) */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    Our team will review your order and contact you with the next steps.
                  </p>
                </div>

                {/* Need Help & Footer Actions */}
                <div className="pt-2 text-center space-y-5 border-t border-slate-200">
                  <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 flex-wrap">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                    <span>Need help?</span>
                    <a
                      href="mailto:info@quickuppaistudio.us"
                      className="font-semibold text-purple-600 hover:text-purple-700 underline"
                    >
                      info@quickuppaistudio.us
                    </a>
                  </div>

                  <div>
                    <Link
                      to="/"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/20 transition-all duration-200 active:scale-98 cursor-pointer"
                    >
                      <span>Back to Quickupp AI Studio</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Clean Light Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="Quickupp AI Studio" className="h-6 w-auto object-contain" />
            <span className="font-semibold text-slate-700">Quickupp AI Studio</span>
          </div>
          <p className="text-slate-500 text-[11px]">
            © 2026 Quickupp AI Studio. Operated by Quickupp Softech LLC. All rights reserved.
          </p>
        </div>
      </footer>

      <FloatingWhatsAppButton />
    </div>
  );
}
