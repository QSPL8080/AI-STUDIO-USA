import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  Mail,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  HelpCircle,
  FileText,
} from "lucide-react";
import {
  capturePayPalOrderServerFn,
  lookupOrderServerFn,
  downloadReceiptPdfServerFn,
  formatOrderInvoiceNumber,
} from "@/lib/paypal-actions";
import { Footer, FloatingWhatsAppButton } from "@/components/site/sections";

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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
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
  }>({
    orderNumber: "QAS-2026-000127",
    serviceName: "AI UGC Video",
    packageName: "60-Second Video",
    amountPaid: "$79.00 USD",
    amountNumber: 79.0,
    paymentMethod: "PayPal",
    transactionId: "8XX12345XXXXXXX",
    customerName: "Valued Client",
    customerEmail: "john@company.com",
    customerCompany: "ABC Brands LLC",
    billingAddress: "123 Main Street\nNew York, NY 10001\nUnited States",
    paymentDate: "September 24, 2026",
    paymentTime: "10:42 AM EST",
  });

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
              serviceName: o.item_name || "AI UGC Video",
              packageName: o.item_name?.includes("Package") ? o.item_name : "60-Second Video",
              amountPaid: `$${Number(o.amount).toFixed(2)} ${o.currency || "USD"}`,
              amountNumber: Number(o.amount),
              paymentMethod: "PayPal",
              transactionId: captureRes.captureId || o.paypal_order_id,
              customerName: o.customer_name || "Valued Client",
              customerEmail: o.customer_email || queryEmail || "info@quickuppaistudio.us",
              customerCompany: o.customer_company || undefined,
              billingAddress: "United States",
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
              serviceName: o.item_name || "AI UGC Video",
              packageName: o.item_name?.includes("Package") ? o.item_name : "60-Second Video",
              amountPaid: `$${Number(o.amount).toFixed(2)} ${o.currency || "USD"}`,
              amountNumber: Number(o.amount),
              paymentMethod: "PayPal",
              transactionId: o.paypal_capture_id || o.paypal_order_id,
              customerName: o.customer_name || "Valued Client",
              customerEmail: o.customer_email || queryEmail || "info@quickuppaistudio.us",
              customerCompany: o.customer_company || undefined,
              billingAddress: "United States",
              paymentDate: dateStr,
              paymentTime: timeStr,
            });
            setLoading(false);
            return;
          }
        }

        // Fallback or explicit query params
        if (queryEmail) {
          setOrderData((prev) => ({
            ...prev,
            customerEmail: queryEmail,
            paymentDate: dateStr,
            paymentTime: timeStr,
          }));
        }
      } catch (err) {
        console.warn("Could not lookup order automatically:", err);
      } finally {
        setLoading(false);
      }
    }

    initializeOrder();
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setDownloadingPdf(true);
      const res = await downloadReceiptPdfServerFn({
        data: {
          orderNumber: orderData.orderNumber,
          issueDate: orderData.paymentDate,
          paymentDate: orderData.paymentDate,
          paymentTime: orderData.paymentTime,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerCompany: orderData.customerCompany,
          billingAddress: orderData.billingAddress || "United States",
          serviceName: orderData.serviceName,
          packageDescription: orderData.packageName,
          amount: orderData.amountNumber,
          currency: "USD",
          paymentMethod: orderData.paymentMethod,
          transactionId: orderData.transactionId,
        },
      });

      if (!res.success || !res.base64) {
        throw new Error(res.error || "Failed to generate receipt PDF.");
      }

      // Convert base64 to Blob and trigger instant browser download
      const binaryString = window.atob(res.base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename || `Receipt_${orderData.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("PDF download error:", err);
      alert("Failed to download PDF receipt. Please try again or contact info@quickuppaistudio.us.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-purple-500 hover:text-white transition-all shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Quickupp AI Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Order Confirmation Screen */}
      <main className="flex-1 py-10 sm:py-16 px-4">
        <div className="mx-auto w-full max-w-2xl">
          {/* Card Container */}
          <div className="overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/90 shadow-2xl shadow-purple-950/40 backdrop-blur-xl animate-in zoom-in-95 duration-200">
            {/* Top Brand Accent Bar */}
            <div className="h-2 w-full bg-gradient-brand" />

            <div className="p-6 sm:p-10 space-y-8">
              {/* Header Icon & Message */}
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/5 shadow-inner">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Payment Successful! 🎉
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-purple-300">
                    Thank you for your order.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Your payment has been received successfully and your order is now confirmed.
                  </p>
                </div>
              </div>

              {/* Payment Details Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Payment Details</span>
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    ✓ PAID
                  </span>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <dt className="text-xs text-slate-400">Order Number</dt>
                    <dd className="font-mono font-bold text-white select-all">
                      {orderData.orderNumber}
                    </dd>
                  </div>

                  <div className="space-y-0.5">
                    <dt className="text-xs text-slate-400">Service</dt>
                    <dd className="font-semibold text-white">
                      {orderData.serviceName}
                    </dd>
                  </div>

                  <div className="space-y-0.5">
                    <dt className="text-xs text-slate-400">Package</dt>
                    <dd className="font-semibold text-white">
                      {orderData.packageName}
                    </dd>
                  </div>

                  <div className="space-y-0.5">
                    <dt className="text-xs text-slate-400">Amount Paid</dt>
                    <dd className="font-bold text-purple-400">
                      {orderData.amountPaid}
                    </dd>
                  </div>

                  <div className="space-y-0.5">
                    <dt className="text-xs text-slate-400">Payment Method</dt>
                    <dd className="font-medium text-slate-200">
                      {orderData.paymentMethod}
                    </dd>
                  </div>

                  <div className="space-y-0.5">
                    <dt className="text-xs text-slate-400">Transaction ID</dt>
                    <dd className="font-mono text-xs text-slate-300 select-all truncate">
                      {orderData.transactionId}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Your Receipt Has Been Emailed Section */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 text-left space-y-2.5">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Mail className="h-4.5 w-4.5 text-purple-400" />
                  <span>Your Receipt Has Been Emailed</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A payment confirmation and PDF receipt have been sent to:
                </p>
                <div className="font-semibold font-mono text-sm text-purple-200 bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-500/20 inline-block">
                  {orderData.customerEmail}
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Please check your inbox, and your spam/junk folder if you don't see it shortly.
                </p>

                {/* Instant PDF Download Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>
                      {downloadingPdf ? "Generating PDF Receipt..." : "Download Payment Receipt (PDF)"}
                    </span>
                  </button>
                </div>
              </div>

              {/* What's Next? Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>What's Next?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Our team will review your order and contact you with the next steps.
                </p>
                <p className="text-xs text-slate-400">
                  Please keep your order number handy when communicating with our creative team:{" "}
                  <strong className="text-purple-300 font-mono">{orderData.orderNumber}</strong>
                </p>
              </div>

              {/* Need Help & Footer Actions */}
              <div className="pt-2 text-center space-y-5 border-t border-slate-800">
                <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  <span>Need help? Contact us anytime:</span>
                  <a
                    href="mailto:info@quickuppaistudio.us"
                    className="font-semibold text-purple-400 hover:text-purple-300 underline"
                  >
                    info@quickuppaistudio.us
                  </a>
                </div>

                <div>
                  <Link
                    to="/"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-brand px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:brightness-110 active:scale-98 cursor-pointer"
                  >
                    <span>Back to Quickupp AI Studio</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
