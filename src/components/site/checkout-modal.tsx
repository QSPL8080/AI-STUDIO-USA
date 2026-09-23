import React, { useState, useEffect, useMemo } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Package,
  Video,
  Clock,
  Zap,
  RotateCcw,
  CreditCard,
  Star,
  Check,
  Tag,
  Globe,
} from "lucide-react";
import {
  resolvePurchaseItem,
  INDIVIDUAL_PRICING,
  PACKAGE_TIERS,
  PACKAGE_SERVICE_LABELS,
  type IndividualServiceId,
  type PackageTierId,
  type PackageServiceFormat,
  type ResolvedPurchaseItem,
} from "@/lib/pricing";
import {
  getPayPalConfigServerFn,
  createPayPalOrderServerFn,
  capturePayPalOrderServerFn,
  broadcastOrderEvent,
} from "@/lib/paypal-actions";

export interface CheckoutModalOptions {
  itemType: "individual" | "package" | "setup";
  itemId?: string;
  tierId?: PackageTierId;
  format?: PackageServiceFormat;
}

const DEFAULT_PAYPAL_CLIENT_ID =
  "BAA7157wDWOsI4aOFpTyYgR9LzKwOnesJ69re7SMM3N8JZ8ZSOURUwr2vcJxWBGCHggTBhew1IYP2pzmjY";

/**
 * Global helper to trigger the checkout modal from anywhere in the app.
 */
export function openCheckoutModal(options: CheckoutModalOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-checkout-modal", { detail: options })
    );
  }
}

export function CheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemType, setItemType] = useState<"individual" | "package" | "setup">("individual");
  const [individualService, setIndividualService] = useState<IndividualServiceId>("ai-ugc");
  const [packageTier, setPackageTier] = useState<PackageTierId>("growth");
  const [packageFormat, setPackageFormat] = useState<PackageServiceFormat>("ai-ugc");

  // Customer Information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  // Payment UI States
  const [activeTab, setActiveTab] = useState<"cards" | "paypal" | "applepay">("cards");
  const [formErrors, setFormErrors] = useState<{ fullName?: string; email?: string }>({});
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card details mock / input state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // PayPal config state
  const [paypalClientId, setPayPalClientId] = useState<string>(DEFAULT_PAYPAL_CLIENT_ID);
  const [paypalEnv, setPayPalEnv] = useState<string>("live");

  // Success details state
  const [successDetails, setSuccessDetails] = useState<{
    orderId: string;
    captureId?: string;
    itemName: string;
    amount: number;
    currency: string;
    customerName: string;
    paymentMethod?: string;
  } | null>(null);

  // Fetch PayPal public config once on mount
  useEffect(() => {
    let isMounted = true;
    getPayPalConfigServerFn()
      .then((res) => {
        if (isMounted && res.success && res.clientId) {
          setPayPalClientId(res.clientId);
          setPayPalEnv(res.environment || "live");
        }
      })
      .catch((err) => {
        console.warn("Failed to load PayPal public config, using default:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to open-checkout-modal event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<CheckoutModalOptions>;
      const detail = customEvent.detail;
      if (detail) {
        setItemType(detail.itemType || "individual");

        if (detail.itemType === "setup") {
          setIndividualService("digital-twin-setup");
        } else if (detail.itemType === "individual" && detail.itemId) {
          const validId = detail.itemId as IndividualServiceId;
          if (INDIVIDUAL_PRICING[validId]) {
            setIndividualService(validId);
          }
        } else if (detail.itemType === "package") {
          if (detail.tierId && PACKAGE_TIERS[detail.tierId]) {
            setPackageTier(detail.tierId);
          }
          if (detail.format && PACKAGE_SERVICE_LABELS[detail.format]) {
            setPackageFormat(detail.format);
          }
        }
      }

      setStep("form");
      setErrorMessage(null);
      setIsOpen(true);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("open-checkout-modal", handleOpen);
    return () => {
      window.removeEventListener("open-checkout-modal", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      setStep("form");
      setErrorMessage(null);
      setSuccessDetails(null);
    }, 300);
  };

  // Compute resolved item details authoritatively
  const resolvedItem = useMemo<ResolvedPurchaseItem | null>(() => {
    if (itemType === "setup") {
      return resolvePurchaseItem({ itemType: "setup" });
    }
    if (itemType === "individual") {
      return resolvePurchaseItem({
        itemType: "individual",
        itemId: individualService,
      });
    }
    if (itemType === "package") {
      return resolvePurchaseItem({
        itemType: "package",
        tierId: packageTier,
        format: packageFormat,
      });
    }
    return null;
  }, [itemType, individualService, packageTier, packageFormat]);

  // Form Validation
  const validateForm = () => {
    const errors: { fullName?: string; email?: string } = {};
    if (!fullName.trim()) {
      errors.fullName = "Please enter your full name";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setErrorMessage(null);
    setStep("payment");
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-200"
    >
      <div
        className={`relative w-full overflow-hidden rounded-3xl border border-purple-200/90 bg-white/98 shadow-2xl shadow-purple-950/25 backdrop-blur-2xl transition-all duration-300 animate-in zoom-in-95 ${
          step === "payment" ? "max-w-4xl" : "max-w-xl sm:max-w-2xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Header Accent Bar */}
        <div className="h-2 w-full bg-gradient-brand" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 sm:px-7 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2
                id="checkout-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900"
              >
                {step === "success"
                  ? "Order Confirmed"
                  : step === "payment"
                  ? "Complete Your Payment"
                  : "Order Checkout"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Official Quickupp AI Studio Video Production
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close checkout modal"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* STEP 1: CUSTOMER DETAILS FORM */}
          {step === "form" && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Selected Service / Package Box */}
              <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/60 via-white to-pink-50/40 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100/70 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-800">
                        {itemType === "package" ? "Package Tier" : "Individual Service"}
                      </span>
                      {resolvedItem?.delivery && (
                        <span className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                          <Clock className="h-3.5 w-3.5 text-purple-600" />
                          {resolvedItem.delivery}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {resolvedItem?.itemName || "AI Video Service"}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-purple-700">
                      {resolvedItem?.amountFormatted || "$0.00 USD"}
                    </span>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      One-time payment • No subscription
                    </p>
                  </div>
                </div>

                {/* Switcher Option */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {itemType === "individual" && (
                    <div className="col-span-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Select Video Format:
                      </label>
                      <select
                        value={individualService}
                        onChange={(e) => setIndividualService(e.target.value as IndividualServiceId)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      >
                        {Object.values(INDIVIDUAL_PRICING).map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} — {srv.formattedPrice}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {itemType === "package" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Package Volume:
                        </label>
                        <select
                          value={packageTier}
                          onChange={(e) => setPackageTier(e.target.value as PackageTierId)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                          {Object.values(PACKAGE_TIERS).map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.videos} {t.videos === 1 ? "Video" : "Videos"})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Video Style:
                        </label>
                        <select
                          value={packageFormat}
                          onChange={(e) => setPackageFormat(e.target.value as PackageServiceFormat)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        >
                          {Object.entries(PACKAGE_SERVICE_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Customer Input Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <span>Customer Information</span>
                  <span className="text-[11px] font-normal text-slate-400">(Required for project assets delivery)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkoutFullName"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkoutFullName"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName) {
                          setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                        }
                      }}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 shadow-xs transition-all focus:outline-none focus:ring-2 ${
                        formErrors.fullName
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-purple-500 focus:ring-purple-100"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkoutEmail"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkoutEmail"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formErrors.email) {
                          setFormErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-800 shadow-xs transition-all focus:outline-none focus:ring-2 ${
                        formErrors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-purple-500 focus:ring-purple-100"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkoutPhone"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Phone Number (Optional)
                    </label>
                    <input
                      id="checkoutPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 shadow-xs transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkoutCompany"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Company / Brand Name (Optional)
                    </label>
                    <input
                      id="checkoutCompany"
                      type="text"
                      placeholder="e.g. Nexus Media"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 shadow-xs transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>
              </div>

              {/* Continue to Payment Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3.5 text-base font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-200 hover:scale-[1.008] hover:brightness-110 active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2.5 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>256-bit SSL encrypted • Official PayPal Verified Checkout</span>
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: 2-COLUMN PAYMENT SCREEN WITH CARDS / PAYPAL / APPLE PAY TABS */}
          {step === "payment" && resolvedItem && (
            <div className="space-y-5">
              {/* Back to details button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Edit Contact Details</span>
                </button>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Customer: </span>
                  <span className="text-xs font-bold text-slate-800">{fullName}</span>
                </div>
              </div>

              {/* Error message alert if any */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 flex items-start gap-2.5 text-red-800 text-xs font-medium animate-in fade-in">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN: ORDER SUMMARY & CAMPAIGN DETAILS */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Summary Box */}
                  <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 shadow-xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Your order is ready to launch!
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Selected: <span className="font-semibold text-purple-700">{resolvedItem.itemName}</span>
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                        Active
                      </span>
                    </div>

                    {/* Features breakdown */}
                    <div className="rounded-xl bg-white p-3 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Estimated Delivery</span>
                        <span className="font-semibold text-slate-900">{resolvedItem.delivery || "3–5 Days"}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Resolution</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-green-600" /> 4K Ultra HD
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Commercial License</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-green-600" /> Included
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500">Script & Voice AI</span>
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-green-600" /> Included
                        </span>
                      </div>
                    </div>

                    {/* Coupon Bar */}
                    <div className="flex items-center gap-2 rounded-xl bg-purple-50/80 p-2 border border-purple-100 text-xs">
                      <Tag className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                      <input
                        type="text"
                        placeholder="Coupon: STUDIO10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setCouponApplied(true)}
                        className="rounded-lg bg-purple-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-purple-700 transition-colors shrink-0 cursor-pointer"
                      >
                        {couponApplied ? "Applied" : "Apply"}
                      </button>
                    </div>

                    {/* Total Price Section */}
                    <div className="border-t border-slate-200/80 pt-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-600">Total payable today</span>
                        <span className="text-2xl font-black text-slate-900">
                          {resolvedItem.amountFormatted}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        One-time charge • No recurring subscription
                      </p>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                      <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Money Back Guarantee</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        100% satisfaction assurance
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                      <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span>4.9 / 5 Rating</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        1,400+ satisfied clients
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: PAYMENT METHODS (Cards | PayPal | Apple Pay) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* 3 Tabs: Cards | PayPal | Apple Pay */}
                  <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-100/90 p-1.5">
                    {/* Cards Tab */}
                    <button
                      type="button"
                      onClick={() => setActiveTab("cards")}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeTab === "cards"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span>Cards</span>
                    </button>

                    {/* PayPal Tab */}
                    <button
                      type="button"
                      onClick={() => setActiveTab("paypal")}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeTab === "paypal"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.738A.8.8 0 0 1 5.733 3.1h7.027c2.378 0 4.116.536 5.027 1.551.868.966 1.08 2.373.633 4.187-.04.164-.085.33-.136.498-.946 3.125-3.082 4.71-6.349 4.71H9.288a.8.8 0 0 0-.789.664l-.994 5.308-.429 1.319z"
                          fill="#003087"
                        />
                        <path
                          d="M19.424 9.336c-.946 3.125-3.082 4.71-6.349 4.71H10.43a.8.8 0 0 0-.789.664l-1.196 6.386a.48.48 0 0 0 .474.565h3.498a.72.72 0 0 0 .71-.607l.794-4.237a.8.8 0 0 1 .789-.664h1.037c2.934 0 4.852-1.424 5.703-4.23.385-1.27.3-2.316-.226-2.587z"
                          fill="#0079C1"
                        />
                      </svg>
                      <span className="font-bold text-[#003087]">PayPal</span>
                    </button>

                    {/* Apple Pay Tab */}
                    <button
                      type="button"
                      onClick={() => setActiveTab("applepay")}
                      className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeTab === "applepay"
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                    >
                      <svg className="h-4 w-4 fill-current text-slate-900" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.43-5.78-9.13-10.36-19.64-13.73-31.54-3.37-11.9-5.06-23.08-5.06-33.54 0-14.68 3.73-26.79 11.19-36.31 7.46-9.52 16.73-14.39 27.81-14.61 4.58 0 9.77 1.25 15.58 3.75 5.8 2.5 9.72 3.81 11.75 3.93 1.62-.24 5.75-1.63 12.38-4.17 6.64-2.54 12.02-3.68 16.16-3.41 12.43.64 22.38 5.48 29.85 14.52-10.9 6.58-16.19 15.65-15.87 27.21.32 9.06 3.88 16.59 10.68 22.61 6.8 6.01 14.88 9.53 24.23 10.55-2.02 6.13-4.59 12.28-7.71 18.45zM119.22 33.02c0-7.39 2.68-14.36 8.03-20.91 5.36-6.55 12.01-10.87 19.96-12.96.24 1.13.36 2.22.36 3.27 0 7.37-2.81 14.47-8.43 21.29-5.63 6.82-12.57 11.1-20.82 12.86-.36-1.18-.54-2.36-.54-3.55z" />
                      </svg>
                      <span>Apple Pay</span>
                    </button>
                  </div>

                  {/* TAB 1: CARDS PAYMENT FORM */}
                  {activeTab === "cards" && (
                    <div className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                      {/* Card Number with Brand Logos */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Card number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="1234 1234 1234 1234"
                            value={cardNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                              const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                              setCardNumber(formatted);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-800 placeholder-slate-400 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 pr-28"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                            <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                              VISA
                            </span>
                            <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                              MC
                            </span>
                            <span className="rounded bg-blue-400 px-1.5 py-0.5 text-[9px] font-black text-white">
                              AMEX
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expiration & CVC */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Expiration date
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                              if (val.length > 2) val = val.slice(0, 2) + " / " + val.slice(2);
                              setCardExpiry(val);
                            }}
                            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono text-slate-800 placeholder-slate-400 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Security code
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="CVC"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono text-slate-800 placeholder-slate-400 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 pr-8"
                            />
                            <CreditCard className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Full Name on Card */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full name on card
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                      </div>

                      {/* Country or Region */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Country or region
                        </label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-xs focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                          <option value="Germany">Germany</option>
                          <option value="Singapore">Singapore</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                        </select>
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
                        By providing your card information, you allow Quickupp AI Studio to process your payment for the selected package in accordance with our terms and 100% money-back guarantee.
                      </p>

                      {/* Pay with PayPal / Card Gateway Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab("paypal")}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                        >
                          <span>Pay {resolvedItem.amountFormatted} with Card (via PayPal Gateway)</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: PAYPAL OFFICIAL BUTTONS */}
                  {activeTab === "paypal" && (
                    <div className="space-y-4 rounded-2xl border border-purple-200 bg-white p-5 shadow-xs">
                      <div className="text-center space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          Pay with Official PayPal Checkout
                        </h4>
                        <p className="text-xs text-slate-500">
                          Fast & secure payment with your PayPal account or linked Debit/Credit card.
                        </p>
                      </div>

                      <div className="relative min-h-[140px] flex flex-col items-center justify-center rounded-xl bg-slate-50/80 p-4 border border-slate-200/80">
                        {paypalClientId ? (
                          <PayPalScriptProvider
                            options={{
                              clientId: paypalClientId,
                              currency: "USD",
                              intent: "capture",
                            }}
                          >
                            <div className="w-full max-w-sm">
                              <PayPalButtons
                                style={{
                                  layout: "vertical",
                                  color: "gold",
                                  shape: "rect",
                                  label: "pay",
                                  height: 46,
                                }}
                                disabled={isProcessing}
                                createOrder={async () => {
                                  try {
                                    setIsProcessing(true);
                                    setErrorMessage(null);
                                    const res = await createPayPalOrderServerFn({
                                      data: {
                                        itemType: resolvedItem.itemType,
                                        itemId: resolvedItem.itemId,
                                        tierId: resolvedItem.tierId,
                                        format: resolvedItem.format,
                                        customerName: fullName,
                                        customerEmail: email,
                                        customerPhone: phone,
                                        customerCompany: company,
                                      },
                                    });

                                    if (!res.success || !res.orderId) {
                                      throw new Error(res.error || "Failed to initialize PayPal order.");
                                    }

                                    return res.orderId;
                                  } catch (err: any) {
                                    console.error("PayPal createOrder error:", err);
                                    setErrorMessage(
                                      err.message || "Failed to create PayPal order. Please try again."
                                    );
                                    setIsProcessing(false);
                                    throw err;
                                  }
                                }}
                                onApprove={async (data) => {
                                  try {
                                    setIsProcessing(true);
                                    const res = await capturePayPalOrderServerFn({
                                      data: { orderId: data.orderID },
                                    });

                                    if (!res.success) {
                                      throw new Error(
                                        res.error || "Payment verification failed on the server."
                                      );
                                    }

                                    // Payment Completed Successfully
                                    setSuccessDetails({
                                      orderId: data.orderID,
                                      captureId: res.captureId,
                                      itemName: resolvedItem.itemName,
                                      amount: resolvedItem.amount,
                                      currency: resolvedItem.currency,
                                      customerName: fullName,
                                      paymentMethod: "PayPal",
                                    });

                                    // Broadcast real-time event for admin sync
                                    if (res.order) {
                                      broadcastOrderEvent({
                                        type: "NEW_ORDER",
                                        order: res.order,
                                      });
                                    }

                                    setStep("success");
                                  } catch (err: any) {
                                    console.error("PayPal capture error:", err);
                                    setErrorMessage(
                                      err.message || "Payment capture failed. Please contact support."
                                    );
                                  } finally {
                                    setIsProcessing(false);
                                  }
                                }}
                                onCancel={() => {
                                  setIsProcessing(false);
                                  setErrorMessage("Payment was cancelled. You can retry whenever you're ready.");
                                }}
                                onError={(err) => {
                                  console.error("PayPal button error:", err);
                                  setIsProcessing(false);
                                  setErrorMessage(
                                    "An error occurred while communicating with PayPal. Please check your network or try again."
                                  );
                                }}
                              />
                            </div>
                          </PayPalScriptProvider>
                        ) : (
                          <div className="text-center py-6 space-y-3">
                            <div className="inline-flex h-8 w-8 animate-spin items-center justify-center rounded-full border-2 border-purple-600 border-t-transparent" />
                            <p className="text-xs text-slate-600 font-medium">
                              Initializing secure PayPal connection...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: APPLE PAY */}
                  {activeTab === "applepay" && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">
                          Apple Pay Checkout
                        </h4>
                        <p className="text-xs text-slate-500">
                          One-touch checkout with Touch ID / Face ID on Apple devices.
                        </p>
                      </div>

                      <div className="py-4">
                        <button
                          type="button"
                          onClick={() => setActiveTab("paypal")}
                          className="flex h-12 w-full max-w-sm mx-auto items-center justify-center gap-2 rounded-xl bg-black text-white font-semibold shadow-md hover:bg-slate-900 active:scale-98 transition-all cursor-pointer"
                        >
                          <svg className="h-5 w-5 fill-current" viewBox="0 0 170 170">
                            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.43-5.78-9.13-10.36-19.64-13.73-31.54-3.37-11.9-5.06-23.08-5.06-33.54 0-14.68 3.73-26.79 11.19-36.31 7.46-9.52 16.73-14.39 27.81-14.61 4.58 0 9.77 1.25 15.58 3.75 5.8 2.5 9.72 3.81 11.75 3.93 1.62-.24 5.75-1.63 12.38-4.17 6.64-2.54 12.02-3.68 16.16-3.41 12.43.64 22.38 5.48 29.85 14.52-10.9 6.58-16.19 15.65-15.87 27.21.32 9.06 3.88 16.59 10.68 22.61 6.8 6.01 14.88 9.53 24.23 10.55-2.02 6.13-4.59 12.28-7.71 18.45zM119.22 33.02c0-7.39 2.68-14.36 8.03-20.91 5.36-6.55 12.01-10.87 19.96-12.96.24 1.13.36 2.22.36 3.27 0 7.37-2.81 14.47-8.43 21.29-5.63 6.82-12.57 11.1-20.82 12.86-.36-1.18-.54-2.36-.54-3.55z" />
                          </svg>
                          <span>Pay with Apple Pay</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500">
                        Apple Pay is available on Safari with an active Apple Wallet card or through PayPal wallet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT CONFIRMATION / SUCCESS SCREEN */}
          {step === "success" && successDetails && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 ring-8 ring-green-50 shadow-inner">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Payment Successful!
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Thank you for your purchase, <span className="font-bold">{successDetails.customerName}</span>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-left text-xs space-y-2.5 shadow-xs max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service / Package:</span>
                  <span className="font-bold text-slate-900 text-right">{successDetails.itemName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-purple-700 text-sm">
                    ${successDetails.amount.toFixed(2)} {successDetails.currency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono text-[11px] text-slate-700 select-all">
                    {successDetails.orderId}
                  </span>
                </div>
                {successDetails.captureId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Capture ID:</span>
                    <span className="font-mono text-[11px] text-slate-700 select-all">
                      {successDetails.captureId}
                    </span>
                  </div>
                )}
              </div>

              {/* Next Steps Notification */}
              <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-xs text-purple-900 leading-relaxed font-medium max-w-lg mx-auto">
                <Sparkles className="h-4 w-4 text-purple-600 inline mr-1.5 -mt-0.5" />
                Our creative team has received your order and will contact you via email shortly to begin your AI video production script and assets.
              </div>

              {/* Close / Done Button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-full max-w-xs mx-auto block rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-98 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
