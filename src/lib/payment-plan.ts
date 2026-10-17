// Shared (no server imports): payment plans for website orders, same as the India site.
//   "full"    - customer pays the whole order now
//   "advance" - customer pays 50% now, the balance later (signed "Pay remaining balance" link)
//   "balance" - the payment of that remaining balance (its own order row, linked to the advance)
// Used by the checkout, the confirmation pages, receipts/emails and the CRM.

export type OrderPlan = "full" | "advance" | "balance";
export type PaymentPlanChoice = "full" | "advance";
export const ADVANCE_PERCENT = 50;

const round2 = (n: number) => Math.round(n * 100) / 100;
const money = (v: unknown) => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? round2(n) : 0;
};

/** What the customer pays now and what stays due, for an order total in US dollars. */
export function splitPayment(total: number, plan: PaymentPlanChoice) {
  const t = money(total);
  if (plan !== "advance") return { plan: "full" as PaymentPlanChoice, payNow: t, balance: 0 };
  const payNow = Math.ceil(t * ADVANCE_PERCENT) / 100; // 50%, rounded up to the cent
  const balance = round2(t - payNow);
  // Very small totals (e.g. a $1 test price) can't be split: charge in full.
  if (balance <= 0) return { plan: "full" as PaymentPlanChoice, payNow: t, balance: 0 };
  return { plan: "advance" as PaymentPlanChoice, payNow, balance };
}

/** Order details JSON stored in orders.raw_details (older rows hold PayPal's response or nothing). */
export function parseOrderDetails(row: any): any {
  const raw = row?.raw_details;
  if (raw && typeof raw === "object") return raw;
  try {
    const parsed = JSON.parse(raw || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Official receipt number, e.g. QAS-2026-1A2B3C (balance payments: QAS-2026-1A2B3C-B1). */
export function formatOrderInvoiceNumber(orderId: string, createdAt?: string): string {
  if (orderId.startsWith("QAS-")) return orderId;
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const rawId = orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  return `QAS-${year}-${rawId.padStart(6, "0")}`;
}

export function orderReceiptNumber(row: any): string {
  const d = parseOrderDetails(row);
  if (d.receiptNumber) return String(d.receiptNumber);
  return formatOrderInvoiceNumber(String(row?.id || row?.paypal_order_id || ""), row?.created_at);
}

/** The payment picture of one order row. */
export function paymentSummary(row: any) {
  const d = parseOrderDetails(row);
  const plan: OrderPlan = d.paymentPlan === "advance" || d.paymentPlan === "balance" ? d.paymentPlan : "full";
  const amount = money(row?.amount); // what THIS transaction charged
  const paid = String(row?.payment_status || "").toUpperCase() === "COMPLETED";
  const orderTotal = money(d.orderTotal) || amount;
  const paidBefore = plan === "balance" ? money(d.paidBefore) : 0;
  const balanceAmount = plan === "advance" && d.balancePaid ? money(d.balanceAmount) : 0;
  const paidNow = paid ? amount : 0;
  const paidTotal = Math.min(orderTotal, round2(paidBefore + paidNow + balanceAmount));
  const balanceDue = paid ? Math.max(0, round2(orderTotal - paidTotal)) : 0;
  const fullyPaid = paid && balanceDue <= 0;
  const planLabel =
    plan === "advance"
      ? d.balancePaid
        ? "50% Advance + Balance"
        : "50% Advance"
      : plan === "balance"
        ? "Balance Payment"
        : "Full Payment";
  return {
    plan,
    planLabel,
    orderTotal,
    amountThisPayment: amount,
    paidBefore,
    balanceAmount,
    paidTotal,
    balanceDue,
    fullyPaid,
    /** Paid 50% advance with money still to pay. */
    partlyPaid: plan === "advance" && paid && balanceDue > 0,
    balancePaid: !!d.balancePaid,
    balancePaidAt: d.balancePaidAt ? String(d.balancePaidAt) : "",
    balanceTxn: d.balanceTxn ? String(d.balanceTxn) : "",
    parentOrderId: plan === "balance" ? String(d.parentOrderId || "") : "",
    parentOrderNumber: plan === "balance" ? String(d.parentOrderNumber || "") : "",
    balanceOrderId: plan === "advance" ? String(d.balanceOrderId || "") : "",
  };
}
export type PaymentSummary = ReturnType<typeof paymentSummary>;

export const isBalancePaymentRow = (row: any) => paymentSummary(row).plan === "balance";

export const formatUsd = (n: number) =>
  `$${(Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
