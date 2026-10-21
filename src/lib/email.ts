import nodemailer from "nodemailer";
import { generateInvoicePdfBuffer } from "./pdf-receipt.ts";
import { getCompanyLogoBuffer } from "./receipt-assets.ts";
import { getCrmSettings } from "./db.ts";

export interface LeadEmailPayload {
  source: "Contact Form" | "Popup Modal" | "USA - Contact Form" | "USA - Popup Modal" | string;
  name: string;
  phone: string;
  email?: string | undefined;
  videoType: string;
  business: string;
  website?: string | undefined;
  videoQuantity?: number | string | undefined;
  location?: string | undefined;
  industry?: string | undefined;
  requirement?: string | undefined;
  additional?: string | undefined;
  leadId?: string | undefined;
}

const DEFAULT_NOTIFICATION_EMAIL = "info@quickuppaistudio.us";
const DEFAULT_LEAD_NOTIFICATION_EMAILS = "qsaistudio@gmail.com";
const DEFAULT_FAILED_LOGIN_ALERT_EMAILS = "info@quickuppaistudio.us";
const DEFAULT_PLATFORM_TITLE = "Quickupp AI Studio USA";

/**
 * Recipient for internal lead/payment alerts. Uses the "System Alert
 * Notification Email" saved in Admin → CRM Settings; falls back to
 * info@quickuppaistudio.us when nothing valid is saved.
 */
export async function resolveNotificationEmail(): Promise<string> {
  // Fixed recipient: the alert email can no longer be changed from CRM Settings.
  return DEFAULT_NOTIFICATION_EMAIL;
}

/**
 * Recipient for new incoming leads (from website forms, popups, and Meta Lead Ads).
 * Delivers ONLY to qsaistudio@gmail.com (lead emails never go to any other inbox).
 */
export async function resolveLeadNotificationEmail(): Promise<string> {
  return DEFAULT_LEAD_NOTIFICATION_EMAILS;
}

/**
 * Recipient for CRM failed login security alerts (wrong password threshold,
 * deactivated account, location blocked). Sends ONLY to info@quickuppaistudio.us.
 */
export async function resolveFailedLoginAlertEmail(): Promise<string> {
  return DEFAULT_FAILED_LOGIN_ALERT_EMAILS;
}

/** Platform / CRM Title from Admin → CRM Settings, used in internal alert subjects. */
async function resolvePlatformTitle(): Promise<string> {
  try {
    const settings = await getCrmSettings();
    const t = (settings["platform_title"] || "").trim();
    if (t) return t;
  } catch {}
  return DEFAULT_PLATFORM_TITLE;
}
const DEFAULT_GMAIL_USER = "qsaistudio@gmail.com";

export function getGmailCredentials(): { user: string; pass: string } {
  const user = (process.env["GMAIL_USER"] || (process.env["SMTP_USER"]?.includes("@gmail.com") ? process.env["SMTP_USER"] : "") || DEFAULT_GMAIL_USER).trim();
  const rawPass =
    process.env["GMAIL_APP_PASSWORD"] ||
    process.env["GMAIL_PASS"] ||
    (process.env["SMTP_PASS"]?.includes(" ") ? process.env["SMTP_PASS"] : "") ||
    "";
  const pass = rawPass.replace(/\s+/g, "");
  return { user, pass };
}
// ─────────────────────────────────────────────────────────────────────────────
// ONE WAY TO SEND EVERY EMAIL (same as the India site):
//   1. Website mailbox info@quickuppaistudio.us on Hostinger SMTP  (SMTP_HOST / SMTP_USER / SMTP_PASS)
//   2. Backup: Gmail qsaistudio@gmail.com with an app password      (GMAIL_USER / GMAIL_APP_PASSWORD)
// Each account is tried on port 465 (SSL) and 587 (STARTTLS).
// ─────────────────────────────────────────────────────────────────────────────
type SiteMail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromName: string;
  replyTo?: string | undefined;
  attachments?: any[] | undefined;
  messageId?: string | undefined;
  headers?: Record<string, string> | undefined;
};

export async function sendSiteMail(mail: SiteMail): Promise<{ success: boolean; via?: string | undefined; error?: string | undefined }> {
  const accounts: { host: string; user: string; pass: string; from: string; ports: number[] }[] = [];
  const siteUser = (process.env["SMTP_USER"] || process.env["EMAIL_USER"] || "info@quickuppaistudio.us").trim();
  const sitePass = (process.env["SMTP_PASS"] || process.env["EMAIL_PASS"] || "Quickuppaistudio@8080").trim();
  const siteHost = (process.env["SMTP_HOST"] || (siteUser.includes("@gmail.com") ? "smtp.gmail.com" : "smtp.hostinger.com")).trim();
  const firstPort = Number(process.env["SMTP_PORT"] || 465) || 465;
  if (siteUser && sitePass) {
    accounts.push({
      host: siteHost,
      user: siteUser,
      pass: siteHost.includes("gmail") ? sitePass.replace(/\s+/g, "") : sitePass,
      from: (process.env["EMAIL_FROM"] || siteUser).trim(),
      ports: [firstPort, ...[465, 587].filter((p) => p !== firstPort)],
    });
  }
  const { user: gUser, pass: gPass } = getGmailCredentials();
  if (gUser && gPass && gUser.toLowerCase() !== siteUser.toLowerCase()) {
    accounts.push({ host: "smtp.gmail.com", user: gUser, pass: gPass, from: gUser, ports: [465, 587] });
  }

  const errors: string[] = [];
  for (const acc of accounts) {
    for (const port of acc.ports) {
      try {
        const transporter = nodemailer.createTransport({
          host: acc.host,
          port,
          secure: port === 465,
          requireTLS: port === 587,
          auth: { user: acc.user, pass: acc.pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 20000,
        });
        await transporter.sendMail({
          from: `"${mail.fromName.replace(/"/g, "")}" <${acc.from}>`,
          to: mail.to,
          replyTo: mail.replyTo || undefined,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          ...(mail.attachments?.length ? { attachments: mail.attachments } : {}),
          ...(mail.messageId ? { messageId: mail.messageId } : {}),
          ...(mail.headers ? { headers: mail.headers } : {}),
          date: new Date(),
        });
        return { success: true, via: `${acc.host}:${port} (${acc.user})` };
      } catch (e: any) {
        const msg = `${acc.host}:${port} (${acc.user}): ${e?.code ? e.code + " " : ""}${e?.message || e}`;
        errors.push(e?.code === "EAUTH" ? `${msg} - wrong email or password` : msg);
        console.warn("Email send attempt failed:", msg);
        if (e?.code === "EAUTH") break; // same password fails on the other port too
      }
    }
  }
  if (!accounts.length) errors.push("No email account configured (set SMTP_USER / SMTP_PASS in Hostinger)");
  return { success: false, error: errors.join(" | ") };
}
const BACKUP_NOTIFICATION_EMAIL = "qsaistudio@gmail.com";

export async function sendLeadNotificationEmail(lead: LeadEmailPayload): Promise<{ success: boolean; error?: string | undefined }> {
  const NOTIFICATION_EMAIL = await resolveLeadNotificationEmail();
  const PLATFORM_TITLE = await resolvePlatformTitle();
  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `🇺🇸 [${PLATFORM_TITLE}] New Lead: ${lead.name} (${lead.videoType}) - ${lead.source}`;

  const cleanPhone = lead.phone.replace(/[^0-9+]/g, "");
  const waPhone = cleanPhone.startsWith("+")
    ? cleanPhone.replace("+", "")
    : cleanPhone.length === 10
    ? `1${cleanPhone}`
    : cleanPhone;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f5f8;
      color: #1e293b;
      margin: 0;
      padding: 24px 12px;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .top-bar {
      height: 4px;
      background: linear-gradient(90deg, #7c3aed 0%, #ec4899 100%);
    }
    .header {
      background-color: #ffffff;
      padding: 28px 24px 20px 24px;
      border-bottom: 1px solid #f1f5f9;
      text-align: left;
    }
    .brand-pill {
      display: inline-block;
      background: #f5f3ff;
      border: 1px solid #ddd6fe;
      color: #6d28d9;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .title {
      margin: 0 0 4px 0;
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
    }
    .subtitle {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }
    .content {
      padding: 24px;
      background-color: #ffffff;
    }
    .lead-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .lead-table th {
      width: 34%;
      padding: 12px 16px;
      background-color: #f8fafc;
      color: #475569;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid #e2e8f0;
    }
    .lead-table td {
      padding: 12px 16px;
      background-color: #ffffff;
      color: #0f172a;
      font-size: 14px;
      font-weight: 500;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid #e2e8f0;
    }
    .lead-table tr:last-child th,
    .lead-table tr:last-child td {
      border-bottom: none;
    }
    .lead-name {
      font-weight: 700;
      font-size: 15px;
      color: #0f172a;
    }
    .video-service {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 2px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
    }
    .actions-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px;
      text-align: center;
      margin-top: 10px;
    }
    .actions-title {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 14px;
    }
    .btn {
      display: inline-block;
      padding: 10px 18px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      margin: 4px;
      color: #ffffff !important;
    }
    .btn-wa {
      background-color: #16a34a;
    }
    .btn-call {
      background-color: #2563eb;
    }
    .btn-mail {
      background-color: #7c3aed;
    }
    .footer {
      background-color: #ffffff;
      padding: 18px 24px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-bar"></div>
    <div class="header">
      <div style="margin-bottom: 12px;">
        <img src="cid:quickupp-logo" alt="Quickupp AI Studio" style="height: 38px; width: auto; display: block; border: 0;" />
      </div>
      <div class="brand-pill">Quickupp AI Studio</div>
      <h1 class="title">New Lead Received</h1>
      <p class="subtitle">Source: <strong>${lead.source}</strong> &bull; Received: ${timestamp}</p>
    </div>
    <div class="content">
      <table class="lead-table">
        <tr>
          <th>Full Name</th>
          <td class="lead-name">${lead.name}</td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td>
            <a href="tel:${cleanPhone}" style="color: #15803d; text-decoration: none; font-weight: 700;">
              ${lead.phone}
            </a>
          </td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td>
            ${lead.email ? `<a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${lead.email}</a>` : '<span style="color: #94a3b8;">Not provided</span>'}
          </td>
        </tr>
        <tr>
          <th>Service / Type</th>
          <td><span class="video-service">${lead.videoType}</span></td>
        </tr>
        <tr>
          <th>Business / Brand</th>
          <td style="font-weight: 600;">${lead.business}</td>
        </tr>
        ${lead.website ? `<tr><th>Website</th><td><a href="${lead.website.startsWith('http') ? lead.website : 'https://' + lead.website}" target="_blank" style="color: #2563eb; text-decoration: underline;">${lead.website}</a></td></tr>` : ''}
        ${lead.videoQuantity ? `<tr><th>Monthly Requirement</th><td>${lead.videoQuantity}</td></tr>` : ''}
        ${lead.industry ? `<tr><th>Industry</th><td>${lead.industry}</td></tr>` : ''}
        ${lead.location ? `<tr><th>City / Location</th><td>${lead.location}</td></tr>` : ''}
        ${lead.requirement ? `<tr><th>Project Details / Requirement</th><td>${lead.requirement}</td></tr>` : ''}
        ${lead.additional ? `<tr><th>Additional Message</th><td>${lead.additional}</td></tr>` : ''}
      </table>

      <div class="actions-box">
        <div class="actions-title">Instant Response Actions</div>
        <a href="https://wa.me/${waPhone}" class="btn btn-wa" target="_blank">&#128172; WhatsApp Chat</a>
        <a href="tel:${cleanPhone}" class="btn btn-call">&#128222; Call Client</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Quickupp AI Studio
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Quickupp AI Studio - New Lead Notification
------------------------------------------
Source: ${lead.source}
Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "Not provided"}
Video Service / Requirement: ${lead.videoType}
Monthly Requirement: ${lead.videoQuantity || "N/A"}
Business / Brand: ${lead.business}
Website: ${lead.website || "N/A"}
Industry: ${lead.industry || "N/A"}
Location: ${lead.location || "N/A"}
Project Details: ${lead.requirement || "N/A"}
Additional Notes: ${lead.additional || "N/A"}
Received At: ${timestamp}
------------------------------------------
WhatsApp: https://wa.me/${waPhone}
Call: tel:${cleanPhone}
  `;

  // New-lead alert TO qsaistudio@gmail.com, sent FROM the website mailbox info@quickuppaistudio.us
  // (Gmail is only the backup sender).
  const sent = await sendSiteMail({
    to: NOTIFICATION_EMAIL,
    subject,
    text: textContent,
    html: htmlContent,
    fromName: "Quickupp AI Studio Leads",
    replyTo: lead.email || undefined,
    attachments: [
      { filename: "logo.png", content: getCompanyLogoBuffer(), cid: "quickupp-logo", contentType: "image/png" },
    ],
  });
  if (!sent.success) console.error("Lead notification email failed:", sent.error);
  return { success: sent.success, error: sent.error };
}

export interface PaymentReceiptEmailPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | undefined;
  customerCompany?: string | undefined;
  orderId: string;
  captureId?: string | undefined;
  itemName: string;
  amount: number;
  currency?: string | undefined;
  paymentMethod?: string | undefined;
  paymentDate?: string | undefined;
  delivery?: string | undefined;
  billingAddress?: string | undefined;
  /** Internal order id (used for the receipt download / confirmation links). */
  internalOrderId?: string | undefined;
  /** Official receipt number (QAS-...). Worked out from the order id when missing. */
  orderNumber?: string | undefined;
  /** "full" (default), "advance" (50% paid, balance due later) or "balance" (rest of an advance). */
  plan?: "full" | "advance" | "balance" | undefined;
  planLabel?: string | undefined;
  orderTotal?: number | undefined;
  paidBefore?: number | undefined;
  balanceAmount?: number | undefined;
  paidTotal?: number | undefined;
  balanceDue?: number | undefined;
  /** Signed "Pay remaining balance" link (50% advance with a balance still due). */
  payBalanceUrl?: string | undefined;
  parentOrderNumber?: string | undefined;
}

/**
 * Sends an automated, beautifully formatted payment receipt email to the customer
 * and sends a carbon copy / notification to info@quickuppaistudio.us.
 */
export async function sendPaymentReceiptEmail(
  payload: PaymentReceiptEmailPayload
): Promise<{ success: boolean; error?: string | undefined }> {
  const NOTIFICATION_EMAIL = await resolveNotificationEmail();
  const currency = payload.currency || "USD";
  const formattedAmount = `$${payload.amount.toFixed(2)} ${currency}`;
  const transactionId = payload.captureId || payload.orderId;
  const firstName = payload.customerName?.trim().split(" ")[0] || "Valued Client";

  // Standardized order invoice number: e.g. QAS-2026-000127 (same number as the confirmation page / CRM)
  const currentYear = new Date().getFullYear();
  const rawId = (payload.orderId || transactionId).replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
  const orderNumber =
    payload.orderNumber ||
    (payload.orderId.startsWith("QAS-") ? payload.orderId : `QAS-${currentYear}-${rawId.padStart(6, "0")}`);
  const linkId = payload.internalOrderId || payload.orderId;
  const money = (n: number | undefined) => `$${(Number(n) || 0).toFixed(2)} ${currency}`;
  const plan = payload.plan || "full";
  const balanceDue = Math.max(0, Number(payload.balanceDue) || 0);
  const partly = plan === "advance" && balanceDue > 0;
  const planLabel = payload.planLabel || "Full Payment";
  const fullyPaidLater = plan === "balance" || (plan === "advance" && !partly);
  // Amount rows for the order table / plain text, per payment type
  const amountRows: [string, string, boolean][] =
    plan === "advance"
      ? [
          ["Order Total", money(payload.orderTotal ?? payload.amount), false],
          ["Amount Paid (50% Advance)", formattedAmount, true],
          ...((payload.balanceAmount || 0) > 0 ? ([["Balance Paid", money(payload.balanceAmount), true]] as [string, string, boolean][]) : []),
          ["Balance Due", partly ? money(balanceDue) : "Nil (Fully Paid)", true],
        ]
      : plan === "balance"
        ? [
            ["Order Total", money(payload.orderTotal ?? payload.amount), false],
            ["Paid Earlier (50% Advance)", money(payload.paidBefore), false],
            ["Amount Paid Now (Balance)", formattedAmount, true],
            ["Balance Due", "Nil (Fully Paid)", true],
          ]
        : [["Amount Paid", formattedAmount, true]];

  const now = new Date();
  const paymentDateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });

  const paymentTimeStr =
    now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/New_York",
    }) + " EST";

  const paymentMethod = payload.paymentMethod || "PayPal";
  const packageText = payload.delivery?.includes("Video")
    ? payload.delivery
    : payload.delivery
    ? `1 × 60-Second Video (${payload.delivery})`
    : "1 × 60-Second Video";

  const subject = partly
    ? `Advance Payment Confirmed — Quickupp AI Studio | Order #${orderNumber}`
    : plan === "balance"
      ? `Balance Payment Confirmed (Fully Paid) — Quickupp AI Studio | Order #${payload.parentOrderNumber || orderNumber}`
      : `Payment Confirmed — Quickupp AI Studio | Order #${orderNumber}`;

  // Generate official PDF Payment Receipt / Invoice buffer
  let pdfAttachment: { filename: string; content: Buffer; contentType: string } | undefined;
  try {
    const pdfBuf = await generateInvoicePdfBuffer({
      orderNumber,
      issueDate: paymentDateStr,
      paymentDate: paymentDateStr,
      paymentTime: paymentTimeStr,
      paymentStatus: "PAID",
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerCompany: payload.customerCompany,
      billingAddress: payload.billingAddress || "United States",
      serviceName: payload.itemName,
      packageDescription: packageText,
      qty: 1,
      amount: payload.amount,
      currency,
      subtotal: payload.amount,
      tax: 0,
      total: payload.amount,
      paymentMethod,
      transactionId,
      plan,
      planLabel,
      orderTotal: payload.orderTotal,
      paidBefore: payload.paidBefore,
      balanceAmount: payload.balanceAmount,
      paidTotal: payload.paidTotal,
      balanceDue,
      parentOrderNumber: payload.parentOrderNumber,
    });
    pdfAttachment = {
      filename: `Receipt_${orderNumber}.pdf`,
      content: pdfBuf,
      contentType: "application/pdf",
    };
  } catch (pdfErr) {
    console.error("PDF Invoice generation failed:", pdfErr);
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmed — Quickupp AI Studio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 32px 12px;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }
    .top-gradient {
      height: 5px;
      background: linear-gradient(90deg, #7c3aed 0%, #ec4899 100%);
    }
    .header {
      padding: 28px 28px 20px 28px;
      border-bottom: 1px solid #f1f5f9;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 800;
      color: #7c3aed;
      letter-spacing: -0.5px;
      text-transform: uppercase;
      margin: 0 0 16px 0;
    }
    .greeting {
      font-size: 15px;
      color: #0f172a;
      line-height: 1.6;
      margin: 0 0 12px 0;
    }
    .status-badge-card {
      background: #f5f3ff;
      border: 1px solid #ddd6fe;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 16px 0 20px 0;
      text-align: center;
    }
    .status-title {
      font-size: 14px;
      font-weight: 800;
      color: #6d28d9;
      letter-spacing: 0.5px;
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }
    .status-paid {
      font-size: 13px;
      font-weight: 700;
      color: #16a34a;
      margin: 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 22px 0 10px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid #f1f5f9;
    }
    .table-details {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 18px;
    }
    .table-details td {
      padding: 8px 0;
      border-bottom: 1px solid #f8fafc;
      vertical-align: top;
    }
    .table-details td.label {
      color: #64748b;
      font-weight: 500;
      width: 44%;
    }
    .table-details td.val {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
    .amount-highlight {
      color: #7c3aed !important;
      font-weight: 800 !important;
      font-size: 14px !important;
    }
    .download-card {
      background-color: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 10px;
      padding: 20px;
      margin: 22px 0;
      text-align: center;
    }
    .download-btn {
      display: inline-block;
      background: #7c3aed;
      color: #ffffff !important;
      padding: 12px 26px;
      border-radius: 8px;
      font-weight: 800;
      text-decoration: none;
      font-size: 13px;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
    }
    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 13px;
      line-height: 1.6;
      color: #334155;
      margin: 18px 0;
    }
    .order-callout {
      background-color: #faf5ff;
      border: 1px dashed #c084fc;
      border-radius: 6px;
      padding: 10px 14px;
      font-weight: 700;
      color: #6b21a8;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 22px 28px;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
      border-top: 1px solid #f1f5f9;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-gradient"></div>
    <div class="header">
      <div style="margin-bottom: 18px;">
        <img src="cid:quickupp-logo" alt="Quickupp AI Studio" style="height: 38px; width: auto; max-width: 180px; display: block; border: 0;" />
      </div>
      <p class="greeting">
        Hi <strong>${firstName}</strong>,<br>
        Thank you for choosing Quickupp AI Studio.<br>
        We’re pleased to confirm that your payment has been successfully received.
      </p>

      ${
        partly
          ? ""
          : `<div class="status-badge-card">
        <div class="status-title">PAYMENT CONFIRMED</div>
        <div class="status-paid">Status: ${fullyPaidLater ? "FULLY PAID" : "PAID"} &#10003;</div>
      </div>`
      }

      <div class="section-title">Order Details</div>
      <table class="table-details">
        <tr>
          <td class="label">Order / Invoice No.</td>
          <td class="val">${orderNumber}</td>
        </tr>
        <tr>
          <td class="label">Service</td>
          <td class="val">${payload.itemName}</td>
        </tr>
        <tr>
          <td class="label">Package</td>
          <td class="val">${packageText}</td>
        </tr>
        ${amountRows
          .map(
            ([l, v, strong]) =>
              `<tr><td class="label">${l}</td><td class="val${strong ? " amount-highlight" : ""}"${
                l === "Balance Due" && partly ? ' style="color:#b45309 !important;"' : ""
              }>${v}</td></tr>`
          )
          .join("")}
        <tr>
          <td class="label">Payment Type</td>
          <td class="val">${planLabel}</td>
        </tr>
        <tr>
          <td class="label">Payment Date</td>
          <td class="val">${paymentDateStr}</td>
        </tr>
        <tr>
          <td class="label">Payment Time</td>
          <td class="val">${paymentTimeStr}</td>
        </tr>
        <tr>
          <td class="label">Payment Method</td>
          <td class="val">${paymentMethod}</td>
        </tr>
        <tr>
          <td class="label">Transaction ID</td>
          <td class="val" style="font-family: monospace; font-size: 12px;">${transactionId}</td>
        </tr>
      </table>

      <div class="section-title">Billing Information</div>
      <table class="table-details">
        <tr>
          <td class="label">Name</td>
          <td class="val">${payload.customerName}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="val">${payload.customerEmail}</td>
        </tr>
        ${payload.customerCompany ? `<tr><td class="label">Company</td><td class="val">${payload.customerCompany}</td></tr>` : ""}
        ${payload.customerPhone ? `<tr><td class="label">Phone</td><td class="val">${payload.customerPhone}</td></tr>` : ""}
        ${payload.billingAddress ? `<tr><td class="label">Billing Address</td><td class="val">${payload.billingAddress}</td></tr>` : ""}
      </table>

      ${
        partly && payload.payBalanceUrl
          ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:20px;margin:22px 0;text-align:center;">
        <div style="font-size:13px;font-weight:800;letter-spacing:1px;color:#b45309;">BALANCE PENDING</div>
        <div style="margin-top:6px;font-size:22px;font-weight:800;color:#111827;">${money(balanceDue)}</div>
        <p style="margin:6px 0 14px;font-size:13px;line-height:1.6;color:#6b7280;">Pay the remaining balance anytime with the secure link below.</p>
        <a href="${payload.payBalanceUrl}" target="_blank" style="display:inline-block;background:#111827;color:#ffffff !important;padding:12px 26px;border-radius:999px;font-weight:800;text-decoration:none;font-size:13px;letter-spacing:0.5px;">PAY REMAINING BALANCE</a>
      </div>`
          : ""
      }
      <div class="download-card">
        <p style="margin: 0 0 14px 0; font-size: 13.5px; color: #374151; font-weight: 500;">
          Your payment receipt/invoice is attached to this email as a PDF.
        </p>
        <a href="https://quickuppaistudio.us/api/download-receipt?orderId=${encodeURIComponent(linkId)}&email=${encodeURIComponent(payload.customerEmail)}" target="_blank" class="download-btn">
          Download Payment Receipt (PDF)
        </a>
        <p style="margin: 12px 0 0 0; font-size: 11.5px; color: #64748b;">
          Or <a href="https://quickuppaistudio.us/order-confirmation?orderId=${encodeURIComponent(linkId)}&email=${encodeURIComponent(payload.customerEmail)}" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">view your confirmed order details online</a>
        </p>
      </div>

      <p style="margin: 18px 0; font-size: 13px; color: #475569; line-height: 1.6; text-align: center;">
        Our team will process your order and contact you with the next steps.
      </p>
    </div>

    <div class="footer">
      If you have any questions, simply reply to this email or contact us at:<br>
      <strong>Quickupp AI Studio</strong><br>
      Email: <a href="mailto:info@quickuppaistudio.us">info@quickuppaistudio.us</a><br>
      Website: <a href="https://quickuppaistudio.us">quickuppaistudio.us</a><br><br>
      Thank you for choosing Quickupp AI Studio.<br><br>
      <strong>Best regards,</strong><br>
      Quickupp AI Studio<br>
      AI-Powered Creative & Video Studio<br>
      <em>Operated by-Quickupp Softech LLC</em>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `Subject: ${subject}

Hi ${firstName},
Thank you for choosing Quickupp AI Studio.
We’re pleased to confirm that your payment has been successfully received.

${partly ? "" : `PAYMENT CONFIRMED
Status: ${fullyPaidLater ? "FULLY PAID" : "PAID"}
`}
Order Details
---------------------------------------------------------
Order / Invoice No.: ${orderNumber}
Service: ${payload.itemName}
Package: ${packageText}
${amountRows.map(([l, v]) => `${l}: ${v}`).join("\n")}
Payment Type: ${planLabel}
Payment Date: ${paymentDateStr}
Payment Time: ${paymentTimeStr}
Payment Method: ${paymentMethod}
Transaction ID: ${transactionId}

Billing Information
---------------------------------------------------------
Name: ${payload.customerName}
Email: ${payload.customerEmail}
${payload.customerCompany ? `Company: ${payload.customerCompany}\n` : ""}${payload.customerPhone ? `Phone: ${payload.customerPhone}\n` : ""}${payload.billingAddress ? `Billing Address: ${payload.billingAddress}\n` : ""}
${partly && payload.payBalanceUrl ? `BALANCE PENDING: ${money(balanceDue)}\nPay the remaining balance: ${payload.payBalanceUrl}\n\n` : ""}Your payment receipt/invoice is attached to this email as a PDF.
Download Payment Receipt (PDF): https://quickuppaistudio.us/api/download-receipt?orderId=${encodeURIComponent(linkId)}&email=${encodeURIComponent(payload.customerEmail)}
Online Order Confirmation: https://quickuppaistudio.us/order-confirmation?orderId=${encodeURIComponent(linkId)}&email=${encodeURIComponent(payload.customerEmail)}

Our team will process your order and contact you with the next steps.

If you have any questions, simply reply to this email or contact us at:
Quickupp AI Studio
Email: info@quickuppaistudio.us
Website: quickuppaistudio.us

Thank you for choosing Quickupp AI Studio.

Best regards,
Quickupp AI Studio
AI-Powered Creative & Video Studio
Operated by-Quickupp Softech LLC
  `;

  const emailAttachments = [
    {
      filename: "logo.png",
      content: getCompanyLogoBuffer(),
      cid: "quickupp-logo",
      contentType: "image/png",
    },
    ...(pdfAttachment ? [pdfAttachment] : []),
  ];

  // Customer receipt + PDF FROM info@quickuppaistudio.us (Gmail only as backup)
  const customerMail = await sendSiteMail({
    to: payload.customerEmail,
    subject,
    text: textContent,
    html: htmlContent,
    fromName: "Quickupp AI Studio",
    replyTo: (process.env["EMAIL_FROM"] || process.env["SMTP_USER"] || "info@quickuppaistudio.us").trim(),
    attachments: emailAttachments,
    messageId: `<receipt-${orderNumber}-${Date.now()}@quickuppaistudio.us>`,
    headers: { "X-Entity-Ref-ID": orderNumber },
  });
  if (!customerMail.success) {
    console.error("Payment receipt email failed:", customerMail.error);
    return { success: false, error: customerMail.error || "SMTP dispatch failed" };
  }
  console.log(`Payment receipt sent to ${payload.customerEmail} via ${customerMail.via}`);

  return { success: true };
}

export interface FailedLoginAlertPayload {
  email: string;
  ipAddress: string;
  location?: string | undefined;
  userAgent?: string | undefined;
  attempts?: number | undefined;
  threshold?: number | undefined;
  lockoutMinutes?: number | undefined;
  role?: string | undefined;
  userName?: string | undefined;
  reason?: string | undefined;
  isLocked?: boolean | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  distanceMeters?: number | null | undefined;
}

function formatRoleBadge(role?: string): string {
  if (!role) return "Unregistered Account";
  const r = role.toLowerCase().trim();
  if (r === "super_admin") return "Super Admin";
  if (r === "admin") return "Admin";
  if (r === "manager" || r === "lead_manager") return "Lead Manager";
  if (r === "caller" || r === "telecaller") return "Telecaller";
  if (r === "editor" || r === "video_editor") return "Video Editor";
  if (r === "locked_account") return "Locked Account";
  if (r === "unknown") return "Unregistered / Unknown User";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatLockMinutesText(minutes?: number): string {
  if (!minutes || minutes <= 0) return "Account not locked";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const h = Math.round((minutes / 60) * 10) / 10;
  return `${h} hour${h === 1 ? "" : "s"}`;
}

/**
 * Security alert sent to info@quickuppaistudio.us and info@quickuppaistudio.in
 * on ANY failed CRM login attempt (Super Admin, Admin, team members, or unregistered users).
 */
export async function sendFailedLoginAlertEmail(
  info: FailedLoginAlertPayload
): Promise<{ success: boolean; via?: string | undefined; error?: string | undefined }> {
  const to = await resolveFailedLoginAlertEmail();
  const title = await resolvePlatformTitle();
  const now = new Date();

  const whenIST = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  }) + " (IST - India)";

  const whenET = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "medium",
  }) + " (ET - US Eastern)";

  const threshold = info.threshold || 3;
  const isLocked = Boolean(info.isLocked || (info.lockoutMinutes && info.lockoutMinutes > 0));
  const roleDisplay = formatRoleBadge(info.role);
  const failureReason = info.reason || "Incorrect Password";

  const isSuperAdmin = (info.role || "").toLowerCase() === "super_admin" || (info.email || "").toLowerCase().trim() === "sa@aistudio.us";

  const subject = isLocked
    ? `Security Alert: CRM account locked - ${info.email || "Unknown user"}`
    : `Security Alert: ${threshold} failed sign-in attempts - ${info.email || "Unknown user"}`;

  const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

  const summary = isLocked
    ? `Account has reached the policy threshold of ${threshold} consecutive failed login attempts and is temporarily locked for ${formatLockMinutesText(info.lockoutMinutes)}.`
    : isSuperAdmin
    ? `The Super Admin account has reached ${threshold} consecutive failed login attempts. The Super Admin account is never locked.`
    : `This account has reached the policy threshold of ${threshold} consecutive failed login attempts.`;

  const rows: [string, string][] = [
    ["Email", info.email || "N/A"],
    ...(info.userName ? [["Name", info.userName] as [string, string]] : []),
    ["Role", roleDisplay],
    ["Reason", failureReason],
    ["IP address", info.ipAddress || "Unknown"],
    ["Location", info.location || "Unknown"],
    ["Time (IST)", whenIST],
    ["Time (US Eastern)", whenET],
  ];

  const rowsHtml = rows
    .map(
      ([k, v]) => `
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 38%; vertical-align: top;">${esc(k)}</td>
            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${esc(v)}</td>
          </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CRM Security Alert</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #0f172a;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #991b1b; padding: 18px 24px; color: #ffffff;">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; opacity: 0.85;">Security Alert</div>
      <h1 style="margin: 4px 0 0; font-size: 19px; font-weight: 700;">
        ${isLocked ? "CRM account locked" : "Failed sign-in attempts"}
      </h1>
    </div>

    <div style="padding: 24px;">
      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 14px; border-radius: 6px; margin-bottom: 18px;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #991b1b;">${esc(summary)}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tbody>${rowsHtml}
        </tbody>
      </table>

      <p style="margin: 18px 0 0; font-size: 12px; color: #64748b; line-height: 1.6;">
        If this was not you or your team, review the account in CRM &rarr; User Management.
      </p>
    </div>

    <div style="border-top: 1px solid #e2e8f0; padding: 12px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
      ${esc(title)} &bull; Automated security alert
    </div>
  </div>
</body>
</html>`;

  const text = [
    `Security Alert - ${isLocked ? "CRM account locked" : "Failed sign-in attempts"}`,
    "",
    summary,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "If this was not you or your team, review the account in CRM > User Management.",
    `${title} - Automated security alert`,
  ].join("\n");

  // Failed-login alert TO info@quickuppaistudio.us, sent from the website mailbox (Gmail as backup)
  const sent = await sendSiteMail({ to, subject, text, html, fromName: `${title} Security` });
  if (!sent.success) console.error("Failed-login alert could not be sent:", sent.error);
  return sent;
}

/**
 * Sends an email notification to info@quickuppaistudio.us / Super Admin
 * when a deactivated user requests account reactivation from the CRM login page.
 */
export async function sendAccountActivationRequestEmail(data: {
  name?: string | undefined;
  email: string;
  reason?: string | undefined;
  ip?: string | undefined;
}): Promise<{ success: boolean; error?: string | undefined }> {
  const to = await resolveNotificationEmail();
  const title = await resolvePlatformTitle();
  const when = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const subject = `⚠️ [${title}] Account Activation Request: ${data.name || data.email} (${data.email})`;

  const esc = (v: string) =>
    v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

  const text = `A user has requested account reactivation for their CRM account.

User Name: ${data.name || "N/A"}
Email Address: ${data.email}
Reason / Note: ${data.reason || "User requested account reactivation via CRM login portal."}
IP Address: ${data.ip || "Unknown"}
Requested At (ET): ${when}

To reactivate this user, log in as Super Admin to the CRM portal and toggle their status to Active under User Management.`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Account Activation Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: #0f172a; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">${esc(title)}</h1>
      <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">CRM Account Activation Request</p>
    </div>
    
    <div style="padding: 24px;">
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
        <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
          A deactivated team member is requesting access reactivation.
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 140px;">User Name:</td>
          <td style="padding: 10px 0; color: #0f172a; font-weight: 700;">${esc(data.name || "N/A")}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Email Address:</td>
          <td style="padding: 10px 0; color: #0f172a; font-family: monospace; font-size: 13px;">${esc(data.email)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Request Note:</td>
          <td style="padding: 10px 0; color: #334155;">${esc(data.reason || "Reactivation requested via CRM login portal.")}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">IP Address:</td>
          <td style="padding: 10px 0; color: #64748b; font-family: monospace; font-size: 12px;">${esc(data.ip || "Unknown")}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Timestamp:</td>
          <td style="padding: 10px 0; color: #64748b; font-size: 13px;">${when}</td>
        </tr>
      </table>

      <div style="text-align: center; padding-top: 8px;">
        <p style="color: #64748b; font-size: 13px; margin-bottom: 16px;">
          To grant access, log in to the CRM with your Super Admin account and activate this user under <b>User Management</b>.
        </p>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
      This is an automated administrative notification from ${esc(title)}.
    </div>
  </div>
</body>
</html>`;

  const sent = await sendSiteMail({ to, subject, text, html, fromName: `${title} Admin System` });
  if (!sent.success) console.error("Account activation request email failed:", sent.error);
  return { success: sent.success, error: sent.error };
}

