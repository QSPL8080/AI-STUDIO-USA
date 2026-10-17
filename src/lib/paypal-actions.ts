import { createServerFn } from "@tanstack/react-start";
import { resolvePurchaseItem } from "./pricing";
import {
  createPayPalOrderApi,
  capturePayPalOrderApi,
  getPublicPayPalConfig,
} from "./paypal";
import {
  saveOrder as saveOrderToDb,
  updateOrderPayment as updateOrderPaymentInDb,
  getOrders as getOrdersFromDb,
  getOrderById as getOrderByIdFromDb,
  getOrderByAnyId as getOrderByAnyIdFromDb,
  updateOrderStatus as updateOrderStatusInDb,
  deleteOrder as deleteOrderFromDb,
  updateOrderDetails as updateOrderDetailsInDb,
  saveCRMNotification as saveCRMNotificationInDb,
  addActivityLog as addActivityLogInDb,
  type Order,
  type PaymentStatus,
} from "./db";
import { sendPaymentReceiptEmail } from "./email";
import { bumpDataVersion } from "./lead-actions";
import { generateInvoicePdfBuffer } from "./pdf-receipt";
import { decodeAndVerifySessionToken } from "./crm-session";
import {
  splitPayment,
  paymentSummary,
  parseOrderDetails,
  orderReceiptNumber,
  formatOrderInvoiceNumber,
  formatUsd,
  type PaymentPlanChoice,
} from "./payment-plan";
import { payBalanceUrl, validOrderSignature } from "./order-links";

export { formatOrderInvoiceNumber };

/** Everything the receipt email + PDF need for one paid order row (full, 50% advance or balance). */
function receiptPayloadForOrder(order: Order): Parameters<typeof sendPaymentReceiptEmail>[0] {
  const ps = paymentSummary(order);
  const d = parseOrderDetails(order);
  return {
    customerName: order.customer_name || "Valued Client",
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone || undefined,
    customerCompany: order.customer_company || undefined,
    orderId: order.paypal_order_id,
    internalOrderId: order.id,
    orderNumber: orderReceiptNumber(order),
    captureId: order.paypal_capture_id || undefined,
    itemName: order.item_name,
    amount: Number(order.amount),
    currency: order.currency || "USD",
    paymentMethod: "PayPal / Credit Card",
    delivery: d.delivery ? String(d.delivery) : undefined,
    plan: ps.plan,
    planLabel: ps.planLabel,
    orderTotal: ps.orderTotal,
    paidBefore: ps.paidBefore,
    balanceAmount: ps.balanceAmount,
    paidTotal: ps.paidTotal,
    balanceDue: ps.balanceDue,
    payBalanceUrl: ps.partlyPaid ? payBalanceUrl(order.id) : undefined,
    parentOrderNumber: ps.parentOrderNumber || undefined,
  };
}

/** Records a paid balance on its 50% advance order (which then shows as fully paid everywhere). */
async function applyBalanceToAdvanceOrder(balanceOrder: Order): Promise<Order | null> {
  const ps = paymentSummary(balanceOrder);
  if (ps.plan !== "balance" || !ps.parentOrderId) return null;
  const parent = await getOrderByAnyIdFromDb(ps.parentOrderId);
  if (!parent) return null;
  const pd = parseOrderDetails(parent);
  if (pd.balancePaid && pd.balanceOrderId === balanceOrder.id) return parent; // already recorded
  const updated = {
    ...pd,
    balancePaid: true,
    balanceAmount: Number(balanceOrder.amount),
    balanceOrderId: balanceOrder.id,
    balanceReceiptNumber: orderReceiptNumber(balanceOrder),
    balanceTxn: balanceOrder.paypal_capture_id || balanceOrder.paypal_order_id,
    balancePaidAt: new Date().toISOString(),
  };
  await updateOrderDetailsInDb(parent.id, JSON.stringify(updated));
  return { ...parent, raw_details: JSON.stringify(updated) };
}

/**
 * Sends the customer's payment receipt (with PDF) and records the outcome in the
 * Activity History, plus a CRM notification if it failed, so a missing receipt
 * is never silent.
 */
async function sendReceiptAndLog(
  payload: Parameters<typeof sendPaymentReceiptEmail>[0],
  context: { orderRef: string; performedBy?: string }
): Promise<{ success: boolean; error?: string | undefined }> {
  let result: { success: boolean; error?: string | undefined };
  try {
    result = await sendPaymentReceiptEmail(payload);
  } catch (err: any) {
    result = { success: false, error: err?.message || "Unknown error" };
  }
  try {
    await addActivityLogInDb({
      action: result.success ? "Payment Receipt Emailed" : "Payment Receipt Email FAILED",
      details: result.success
        ? `Receipt + PDF invoice sent to ${payload.customerEmail} for ${context.orderRef} ($${payload.amount.toFixed(2)})`
        : `Could not email receipt to ${payload.customerEmail} for ${context.orderRef}: ${result.error || "SMTP dispatch failed"}`,
      performed_by: context.performedBy || "System / Payments",
      user_role: "system",
    });
  } catch {}
  if (!result.success) {
    try {
      await saveCRMNotificationInDb({
        type: "order_payment",
        title: "Payment Receipt Email Failed",
        message: `Receipt for ${context.orderRef} could not be emailed to ${payload.customerEmail}. Open the order and use "Resend Receipt Email".`,
        entity_id: context.orderRef,
        actor: "System",
      });
    } catch {}
  }
  return result;
}

/**
 * Public configuration helper for client-side PayPal Script initialization.
 * Only returns client ID and environment (Never the client secret).
 */
export const getPayPalConfigServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const config = getPublicPayPalConfig();
    return {
      success: true,
      clientId: config.clientId,
      environment: config.environment,
    };
  } catch (error: any) {
    console.error("Failed to get PayPal config:", error);
    return {
      success: false,
      clientId: "",
      environment: "sandbox",
      error: error.message,
    };
  }
});

/**
 * Server-authoritative PayPal Order Creation.
 * Resolves price from trusted pricing table, validates input, calls PayPal REST API, and stores pending record.
 */
export const createPayPalOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: {
    itemType: "individual" | "package" | "setup" | string;
    itemId?: string;
    tierId?: string;
    format?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerCompany?: string;
    /** "full" (default) or "advance" (pay 50% now, the balance later). */
    paymentPlan?: PaymentPlanChoice;
  }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.customerName?.trim() || !data.customerEmail?.trim()) {
        return {
          success: false,
          error: "Please enter your full name and a valid email address.",
        };
      }

      // Authoritatively resolve item and price from server configuration
      const resolvedItem = resolvePurchaseItem({
        itemType: data.itemType,
        itemId: data.itemId,
        tierId: data.tierId,
        format: data.format,
      });

      if (!resolvedItem) {
        return {
          success: false,
          error: "Invalid or unrecognized service/package selected.",
        };
      }

      const split = splitPayment(resolvedItem.amount, data.paymentPlan === "advance" ? "advance" : "full");
      const advance = split.plan === "advance";

      // Create Order with official PayPal REST API (50% of the price when paying an advance)
      const paypalOrder = await createPayPalOrderApi({
        amount: split.payNow,
        currency: resolvedItem.currency,
        itemName: advance
          ? `${resolvedItem.itemName} | 50% Advance of ${formatUsd(resolvedItem.amount)}`
          : resolvedItem.itemName,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim(),
      });

      // Persist pending order to database
      const savedOrder = await saveOrderToDb({
        paypalOrderId: paypalOrder.id,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim(),
        customerPhone: data.customerPhone?.trim() || undefined,
        customerCompany: data.customerCompany?.trim() || undefined,
        itemType: resolvedItem.itemType,
        itemId: resolvedItem.itemId,
        itemName: resolvedItem.itemName,
        amount: split.payNow, // charged in this transaction (50% when paying an advance)
        currency: resolvedItem.currency,
        paymentStatus: "PENDING",
        paypalStatus: paypalOrder.status,
        rawDetails: JSON.stringify({
          paymentPlan: split.plan,
          orderTotal: resolvedItem.amount,
          balanceAfterPayment: split.balance,
          delivery: resolvedItem.delivery || undefined,
        }),
      });

      return {
        success: true,
        orderId: paypalOrder.id,
        internalOrderId: savedOrder.id,
        resolvedItem,
        paymentPlan: split.plan,
        payNow: split.payNow,
        balance: split.balance,
      };
    } catch (error: any) {
      console.error("Error creating PayPal order:", error);
      return {
        success: false,
        error: error.message || "Failed to initialize PayPal order.",
      };
    }
  });

/**
 * Server-authoritative PayPal Payment Capture.
 * Captures payment from PayPal, verifies COMPLETED status, updates database, and broadcasts sync event.
 */
export const capturePayPalOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: { orderId: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.orderId) {
        return { success: false, error: "Missing PayPal Order ID for capture." };
      }

      const captureResult = await capturePayPalOrderApi(data.orderId);
      const isCompleted = captureResult.status === "COMPLETED";

      let captureId: string | undefined;
      const captures =
        captureResult.purchase_units?.[0]?.payments?.captures;
      if (captures && captures.length > 0 && captures[0]) {
        captureId = captures[0].id;
      }

      const paymentStatus: PaymentStatus = isCompleted ? "COMPLETED" : "FAILED";

      // Keep the order's payment plan details: add PayPal's response instead of replacing them.
      let existingDetails: any = {};
      try {
        existingDetails = parseOrderDetails(await getOrderByAnyIdFromDb(data.orderId));
      } catch {}
      const { paypal: _oldPaypal, captureError: _oldErr, ...keepDetails } = existingDetails;

      let updatedOrder = await updateOrderPaymentInDb({
        paypalOrderId: data.orderId,
        paypalCaptureId: captureId,
        paymentStatus,
        paypalStatus: captureResult.status,
        rawDetails: JSON.stringify({
          ...keepDetails,
          paidAt: isCompleted ? new Date().toISOString() : undefined,
          paypal: captureResult,
        }),
      });
      // If the update didn't return the row, load it so the receipt still goes out
      if (!updatedOrder) {
        try {
          updatedOrder = await getOrderByAnyIdFromDb(data.orderId);
        } catch {}
      }

      // Automated Payment Receipt Email Dispatch (Hostinger SMTP, Gmail backup)
      if (isCompleted) {
        const cap = captures?.[0];
        const payerName = [captureResult.payer?.name?.given_name, captureResult.payer?.name?.surname]
          .filter(Boolean)
          .join(" ");
        const orderForReceipt: Order | null = updatedOrder
          ? { ...updatedOrder, customer_email: updatedOrder.customer_email || captureResult.payer?.email_address || "" }
          : null;
        const ps = paymentSummary(orderForReceipt);
        const customerName = orderForReceipt?.customer_name || payerName || "Valued Client";
        const itemName = orderForReceipt?.item_name || "AI Video Service";
        const paidNow = orderForReceipt ? Number(orderForReceipt.amount) : Number(cap?.amount?.value || 0);

        // A paid balance completes its 50% advance order.
        let parentOrder: Order | null = null;
        if (orderForReceipt && ps.plan === "balance") {
          try {
            parentOrder = await applyBalanceToAdvanceOrder(orderForReceipt);
          } catch (e) {
            console.error("Could not update the advance order after the balance payment", e);
          }
        }

        if (orderForReceipt && orderForReceipt.customer_email) {
          // Not awaited so the customer sees the confirmation immediately;
          // the outcome is logged to Activity History either way.
          sendReceiptAndLog(receiptPayloadForOrder(orderForReceipt), {
            orderRef: orderReceiptNumber(orderForReceipt),
          }).catch((err) => console.error("Automated payment receipt dispatch error:", err));
        } else {
          try {
            await addActivityLogInDb({
              action: "Payment Receipt Email FAILED",
              details: `No customer email found for PayPal order ${data.orderId}; receipt not sent`,
              performed_by: "System / Payments",
              user_role: "system",
            });
          } catch {}
        }

        try {
          const title =
            ps.plan === "advance"
              ? "Advance Payment Received (50%)"
              : ps.plan === "balance"
                ? "Balance Paid - Order Fully Paid"
                : "New PayPal Payment Received";
          const message =
            ps.plan === "advance"
              ? `${customerName} paid a 50% advance of ${formatUsd(paidNow)} for ${itemName} (order total ${formatUsd(ps.orderTotal)}, balance due ${formatUsd(ps.balanceDue)})`
              : ps.plan === "balance"
                ? `${customerName} paid the balance of ${formatUsd(paidNow)} for ${itemName.replace(/ - Balance$/, "")}. Order ${ps.parentOrderNumber || ps.parentOrderId} is now fully paid (${formatUsd(ps.orderTotal)}).`
                : `${customerName} completed payment of ${formatUsd(paidNow)} for ${itemName}`;
          await saveCRMNotificationInDb({
            type: "order_payment",
            title,
            message,
            entity_id: parentOrder?.id || orderForReceipt?.id || data.orderId,
            actor: customerName,
          });
          await addActivityLogInDb({
            action: title,
            details: `${message}. Receipt ${orderForReceipt ? orderReceiptNumber(orderForReceipt) : data.orderId}, PayPal ${captureId || data.orderId}.`,
            performed_by: "System / Payments",
            user_role: "system",
          });
        } catch {}
      }

      return {
        success: isCompleted,
        status: captureResult.status,
        captureId,
        order: updatedOrder,
      };
    } catch (error: any) {
      console.error("Error capturing PayPal order:", error);
      // A second capture of an already-paid order (e.g. from the confirmation page)
      // must not overwrite COMPLETED with FAILED.
      try {
        const existing = await getOrderByAnyIdFromDb(data.orderId);
        if (existing && existing.payment_status === "COMPLETED") {
          return {
            success: true,
            status: "COMPLETED",
            captureId: existing.paypal_capture_id || undefined,
            order: existing,
          };
        }
      } catch {}
      // Mark as failed in DB (keeping the order's payment plan details)
      try {
        let keep: any = {};
        try {
          keep = parseOrderDetails(await getOrderByAnyIdFromDb(data.orderId));
        } catch {}
        await updateOrderPaymentInDb({
          paypalOrderId: data.orderId,
          paymentStatus: "FAILED",
          rawDetails: JSON.stringify({ ...keep, captureError: String(error?.message || error) }),
        });
      } catch {}
      return {
        success: false,
        error: error.message || "Failed to capture PayPal payment.",
      };
    }
  });

/**
 * Fetch all orders for the Admin Portal.
 */
export const fetchOrdersServerFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const orders = (await getOrdersFromDb()).map((o) =>
      paymentSummary(o).partlyPaid ? { ...o, pay_balance_url: payBalanceUrl(o.id) } : o
    );
    return { success: true, orders };
  } catch (error: any) {
    console.error("Error fetching orders from database:", error);
    return { success: false, orders: [] as Order[], error: error.message };
  }
});

/**
 * Update order payment status (Admin).
 */
export const updateOrderStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: PaymentStatus }) => data)
  .handler(async ({ data }) => {
    try {
      const ok = await updateOrderStatusInDb(data.id, data.status);
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * Delete an order record. Super Admin only, and only for unpaid orders (PENDING, FAILED,
 * CANCELLED): paid (COMPLETED) and REFUNDED orders are financial records and are never deleted.
 */
export const deleteOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; token?: string | undefined }) => data)
  .handler(async ({ data }) => {
    try {
      const check = decodeAndVerifySessionToken(data.token || "");
      if (!check.valid || check.payload?.role !== "super_admin") {
        return { success: false, error: "Only Super Admin can delete orders." };
      }
      const order = await getOrderByIdFromDb(data.id);
      if (!order) {
        return { success: false, error: "Order not found." };
      }
      if (!["PENDING", "FAILED", "CANCELLED"].includes(String(order.payment_status).toUpperCase())) {
        return { success: false, error: "Only Pending, Failed or Cancelled orders can be deleted." };
      }
      const ok = await deleteOrderFromDb(data.id);
      await bumpDataVersion();
      return { success: ok };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

/**
 * Send or re-send payment receipt email to customer (Admin / Client).
 */
export const sendReceiptEmailServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      customerName: string;
      customerEmail: string;
      customerPhone?: string;
      customerCompany?: string;
      orderId: string;
      captureId?: string;
      itemName: string;
      amount: number;
      currency?: string;
      paymentMethod?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const res = await sendPaymentReceiptEmail(data);
      return res;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });


/**
 * Lookup order by internal ID, PayPal order ID, or capture ID
 */
export const lookupOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: { identifier: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data.identifier) {
        return { success: false, error: "Missing order identifier." };
      }
      const order = await getOrderByAnyIdFromDb(data.identifier);
      if (!order) {
        return { success: false, error: "Order not found." };
      }
      const ps = paymentSummary(order);
      return {
        success: true,
        order,
        receiptNumber: orderReceiptNumber(order),
        summary: ps,
        payBalanceUrl: ps.partlyPaid ? payBalanceUrl(order.id) : "",
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

/**
 * Generate official PDF receipt buffer for in-browser download
 */
export const downloadReceiptPdfServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      orderNumber: string;
      issueDate?: string | undefined;
      paymentDate?: string | undefined;
      paymentTime?: string | undefined;
      customerName: string;
      customerEmail: string;
      customerCompany?: string | undefined;
      billingAddress?: string | undefined;
      serviceName: string;
      packageDescription?: string | undefined;
      amount: number;
      currency?: string | undefined;
      paymentMethod?: string | undefined;
      transactionId: string;
    }) => data
  )
  .handler(async ({ data }) => {
    try {
      const buffer = await generateInvoicePdfBuffer({
        orderNumber: data.orderNumber,
        issueDate: data.issueDate,
        paymentDate: data.paymentDate,
        paymentTime: data.paymentTime,
        paymentStatus: "PAID",
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerCompany: data.customerCompany,
        billingAddress: data.billingAddress || "United States",
        serviceName: data.serviceName,
        packageDescription: data.packageDescription || "60 Seconds",
        qty: 1,
        amount: data.amount,
        currency: data.currency || "USD",
        subtotal: data.amount,
        tax: 0,
        total: data.amount,
        paymentMethod: data.paymentMethod || "PayPal",
        transactionId: data.transactionId,
      });

      return {
        success: true,
        filename: `Receipt_${data.orderNumber}.pdf`,
        base64: buffer.toString("base64"),
      };
    } catch (error: any) {
      console.error("PDF Receipt generation failed:", error);
      return { success: false, error: error.message };
    }
  });

/**
 * Server-authoritative Payment Tab Security PIN Verification.
 * The secret PIN is verified on the backend and NEVER exposed in client-side code bundles.
 */
export const verifyPaymentPinServerFn = createServerFn({ method: "POST" })
  .validator((data: { pin: string }) => data)
  .handler(async ({ data }) => {
    try {
      if (!data || typeof data.pin !== "string") {
        return { success: false, error: "PIN is required." };
      }

      const expectedPin = process.env.ADMIN_PAYMENT_PIN || "Admin@8080";
      const isMatch = data.pin.trim() === expectedPin.trim();

      if (isMatch) {
        return { success: true };
      }
      return { success: false, error: "Incorrect security PIN. Please try again." };
    } catch (error: any) {
      console.error("PIN verification error on server:", error);
      return { success: false, error: "Failed to verify security PIN." };
    }
  });

/**
 * Client Broadcast helper for real-time order synchronization across tabs.
 */
export function broadcastOrderEvent(event: {
  type: "NEW_ORDER" | "UPDATE_ORDER" | "DELETE_ORDER";
  order?: Order;
  id?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    if ("BroadcastChannel" in window) {
      const bc = new BroadcastChannel("ai_studio_orders_sync");
      bc.postMessage(event);
      bc.close();
    }
    window.dispatchEvent(new CustomEvent("ai_studio_order_event", { detail: event }));
  } catch (e) {
    console.error("Broadcast order event failed:", e);
  }
}

/**
 * Admin: re-send the payment receipt + PDF invoice for a completed order.
 */
export const resendOrderReceiptServerFn = createServerFn({ method: "POST" })
  .validator((data: { orderId: string; performedBy?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const order = await getOrderByAnyIdFromDb(data.orderId);
      if (!order) return { success: false, error: "Order not found" };
      if (order.payment_status !== "COMPLETED") {
        return { success: false, error: "Receipts can only be sent for completed payments" };
      }
      if (!order.customer_email) return { success: false, error: "This order has no customer email" };
      return await sendReceiptAndLog(receiptPayloadForOrder(order), {
        orderRef: orderReceiptNumber(order),
        performedBy: data.performedBy || "Admin",
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

// ─────────────────────────────────────────────────────────────────────────────
// 50% ADVANCE → PAY REMAINING BALANCE (signed link from the email / confirmation page / CRM)
// ─────────────────────────────────────────────────────────────────────────────
async function loadAdvanceOrderForBalance(orderId: string, token: string) {
  if (!validOrderSignature(orderId, token)) {
    return { ok: false as const, error: "This payment link is not valid. Please use the link from your payment email." };
  }
  const parent = await getOrderByAnyIdFromDb(orderId);
  if (!parent) return { ok: false as const, error: "We couldn't find this order." };
  const ps = paymentSummary(parent);
  if (ps.plan !== "advance" || parent.payment_status !== "COMPLETED") {
    return { ok: false as const, error: "This order has no balance to pay." };
  }
  if (ps.balanceDue <= 0 || ps.balancePaid) {
    return { ok: false as const, paid: true as const, error: "This order is already fully paid. Thank you!" };
  }
  return { ok: true as const, parent, ps };
}

/** Pay-balance page: what is still due on a paid 50% advance order. */
export const getBalancePaymentInfoServerFn = createServerFn({ method: "POST" })
  .validator((data: { order: string; t: string }) => data)
  .handler(async ({ data }) => {
    try {
      const r = await loadAdvanceOrderForBalance(String(data.order || ""), String(data.t || ""));
      if (!r.ok) return { success: false as const, paid: "paid" in r ? true : false, error: r.error };
      const { parent, ps } = r;
      return {
        success: true as const,
        receiptNumber: orderReceiptNumber(parent),
        itemName: parent.item_name,
        customerName: parent.customer_name,
        customerEmail: parent.customer_email,
        orderTotal: ps.orderTotal,
        paidTotal: ps.paidTotal,
        balanceDue: ps.balanceDue,
        currency: parent.currency || "USD",
      };
    } catch (error: any) {
      return { success: false as const, paid: false, error: error?.message || "Could not load this order." };
    }
  });

/** Creates the PayPal order for the remaining balance, linked to its 50% advance order. */
export const createBalancePayPalOrderServerFn = createServerFn({ method: "POST" })
  .validator((data: { order: string; t: string }) => data)
  .handler(async ({ data }) => {
    try {
      const r = await loadAdvanceOrderForBalance(String(data.order || ""), String(data.t || ""));
      if (!r.ok) return { success: false as const, error: r.error };
      const { parent, ps } = r;

      // Earlier balance attempts for this order: unfinished ones are closed, and the count gives the next number.
      const all = await getOrdersFromDb();
      const earlier = all.filter((o) => String(o.id).startsWith(`${parent.id}-B`));
      for (const old of earlier.filter((o) => o.payment_status === "PENDING")) {
        try {
          await updateOrderStatusInDb(old.id, "CANCELLED");
        } catch {}
      }
      const n = earlier.length + 1;
      const parentNumber = orderReceiptNumber(parent);

      const paypalOrder = await createPayPalOrderApi({
        amount: ps.balanceDue,
        currency: parent.currency || "USD",
        itemName: `${parent.item_name} | Balance of ${formatUsd(ps.orderTotal)} order ${parentNumber}`,
        customerName: parent.customer_name,
        customerEmail: parent.customer_email,
      });

      const pd = parseOrderDetails(parent);
      const saved = await saveOrderToDb({
        id: `${parent.id}-B${n}`,
        paypalOrderId: paypalOrder.id,
        customerName: parent.customer_name,
        customerEmail: parent.customer_email,
        customerPhone: parent.customer_phone || undefined,
        customerCompany: parent.customer_company || undefined,
        itemType: parent.item_type,
        itemId: parent.item_id,
        itemName: `${parent.item_name} - Balance`,
        amount: ps.balanceDue,
        currency: parent.currency || "USD",
        paymentStatus: "PENDING",
        paypalStatus: paypalOrder.status,
        rawDetails: JSON.stringify({
          paymentPlan: "balance",
          parentOrderId: parent.id,
          parentOrderNumber: parentNumber,
          parentPaypalOrderId: parent.paypal_order_id,
          receiptNumber: `${parentNumber}-B${n}`,
          orderTotal: ps.orderTotal,
          paidBefore: ps.paidTotal,
          delivery: pd.delivery || undefined,
        }),
      });

      try {
        await addActivityLogInDb({
          action: "Balance Payment Started",
          details: `${parent.customer_name} is paying the balance ${formatUsd(ps.balanceDue)} for order ${parentNumber} (PayPal ${paypalOrder.id}).`,
          performed_by: parent.customer_email || "Customer",
          user_role: "customer",
        });
      } catch {}

      return { success: true as const, orderId: paypalOrder.id, internalOrderId: saved.id, amount: ps.balanceDue };
    } catch (error: any) {
      console.error("Error creating balance PayPal order:", error);
      return { success: false as const, error: error?.message || "Failed to start the balance payment." };
    }
  });

/** Official PDF receipt for one paid order row, built from the order itself (server use). */
export async function buildReceiptPdfForOrder(order: Order): Promise<{ filename: string; pdf: Buffer }> {
  const ps = paymentSummary(order);
  const d = parseOrderDetails(order);
  const paidAt = new Date(d.paidAt || order.updated_at || order.created_at || Date.now());
  const dateStr = paidAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
  const timeStr =
    paidAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/New_York" }) + " EST";
  const receiptNumber = orderReceiptNumber(order);
  const delivery = d.delivery ? String(d.delivery) : "";
  const pdf = await generateInvoicePdfBuffer({
    orderNumber: receiptNumber,
    issueDate: dateStr,
    paymentDate: dateStr,
    paymentTime: timeStr,
    paymentStatus: "PAID",
    customerName: order.customer_name || "Valued Client",
    customerEmail: order.customer_email,
    customerCompany: order.customer_company || undefined,
    billingAddress: "United States",
    serviceName: order.item_name,
    packageDescription: delivery.includes("Video") ? delivery : delivery ? `1 × 60-Second Video (${delivery})` : "1 × 60-Second Video",
    qty: 1,
    amount: Number(order.amount),
    currency: order.currency || "USD",
    subtotal: Number(order.amount),
    tax: 0,
    total: Number(order.amount),
    paymentMethod: "PayPal / Credit Card",
    transactionId: order.paypal_capture_id || order.paypal_order_id,
    plan: ps.plan,
    planLabel: ps.planLabel,
    orderTotal: ps.orderTotal,
    paidBefore: ps.paidBefore,
    balanceAmount: ps.balanceAmount,
    paidTotal: ps.paidTotal,
    balanceDue: ps.balanceDue,
    parentOrderNumber: ps.parentOrderNumber || undefined,
  });
  return { filename: `Receipt_${receiptNumber}.pdf`, pdf };
}

/** Finds an order by internal id, PayPal ids, or its receipt number (QAS-...). */
export async function findOrderForReceipt(identifier: string): Promise<Order | null> {
  const id = String(identifier || "").trim();
  if (!id) return null;
  const direct = await getOrderByAnyIdFromDb(id);
  if (direct) return direct;
  if (/^QAS-/i.test(id)) {
    const all = await getOrdersFromDb();
    return all.find((o) => orderReceiptNumber(o).toUpperCase() === id.toUpperCase()) || null;
  }
  return null;
}
