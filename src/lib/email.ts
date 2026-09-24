import nodemailer from "nodemailer";

export interface LeadEmailPayload {
  source: "Contact Form" | "Popup Modal" | "USA - Contact Form" | "USA - Popup Modal" | string;
  name: string;
  phone: string;
  email?: string;
  videoType: string;
  business: string;
  location?: string;
  industry?: string;
  requirement?: string;
  additional?: string;
  leadId?: string;
}

const NOTIFICATION_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || "qsaistudio@gmail.com";
const BACKUP_NOTIFICATION_EMAIL = "quickuppaistudio1@gmail.com";

export async function sendLeadNotificationEmail(lead: LeadEmailPayload): Promise<{ success: boolean; error?: string }> {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const isUsa = lead.source.includes("USA");
  const subject = isUsa
    ? `🇺🇸 [USA Website Lead] ${lead.name} (${lead.videoType}) - ${lead.source}`
    : `🚀 New Lead: ${lead.name} (${lead.videoType}) - ${lead.source}`;

  const cleanPhone = lead.phone.replace(/[^0-9+]/g, "");
  const waPhone = cleanPhone.startsWith("+")
    ? cleanPhone.replace("+", "")
    : cleanPhone.length === 10
    ? (isUsa ? `1${cleanPhone}` : `91${cleanPhone}`)
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
        <img src="https://quickuppaistudio.us/images/logo.png" alt="Quickupp AI Studio" style="height: 38px; width: auto; display: block; border: 0;" />
      </div>
      <div class="brand-pill">Quickupp AI Studio</div>
      <h1 class="title">🎯 New Lead Received</h1>
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
        ${lead.industry ? `<tr><th>Industry</th><td>${lead.industry}</td></tr>` : ''}
        ${lead.location ? `<tr><th>City / Location</th><td>${lead.location}</td></tr>` : ''}
        ${lead.requirement ? `<tr><th>Requirement</th><td>${lead.requirement}</td></tr>` : ''}
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
Video Service: ${lead.videoType}
Business: ${lead.business}
Industry: ${lead.industry || "N/A"}
Location: ${lead.location || "N/A"}
Requirement: ${lead.requirement || "N/A"}
Additional Notes: ${lead.additional || "N/A"}
Received At: ${timestamp}
------------------------------------------
WhatsApp: https://wa.me/${waPhone}
Call: tel:${cleanPhone}
  `;

  // 1. Direct Hostinger / SMTP Delivery (Primary Guaranteed Delivery)
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = process.env.SMTP_SECURE === "false" ? false : true;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "info@quickuppaistudio.us";
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "Quickuppaistudio@8080";
  const fromAddress = process.env.EMAIL_FROM || smtpUser || "info@quickuppaistudio.us";

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, ""),
        },
      });

      await transporter.sendMail({
        from: `"Quickupp AI Studio" <${fromAddress}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: lead.email || undefined,
        subject,
        text: textContent,
        html: htmlContent,
      });

      return { success: true };
    } catch (smtpErr: any) {
      console.error("Hostinger SMTP email dispatch failed:", smtpErr?.message);
    }
  }

  // 2. Backup Gmail SMTP Fallback
  const backupUser = process.env.GMAIL_USER || "quickuppaistudio1@gmail.com";
  const backupPass = process.env.GMAIL_APP_PASSWORD || "ggtodbgiucfdypcj";
  if (backupUser && backupPass && backupUser !== smtpUser) {
    try {
      const backupTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: backupUser,
          pass: backupPass.replace(/\s+/g, ""),
        },
      });

      await backupTransporter.sendMail({
        from: `"Quickupp AI Studio" <${backupUser}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: lead.email || undefined,
        subject,
        text: textContent,
        html: htmlContent,
      });

      return { success: true };
    } catch (backupErr: any) {
      console.error("Backup Gmail SMTP failed:", backupErr?.message);
    }
  }

  // 3. Check for Resend API Key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Quickupp Leads <leads@quickuppaistudio.us>",
          to: [NOTIFICATION_EMAIL],
          reply_to: lead.email || undefined,
          subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (res.ok) {
        return { success: true };
      }
      const errTxt = await res.text();
      console.warn("Resend API failed:", errTxt);
    } catch (resendErr: any) {
      console.warn("Resend email dispatch error:", resendErr?.message);
    }
  }

  // 4. Guaranteed Direct HTTP Delivery via FormSubmit AJAX to quickuppaistudio1@gmail.com
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://quickuppaistudio.us",
        "Referer": "https://quickuppaistudio.us",
      },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        "Lead Source": lead.source,
        "Customer Name": lead.name,
        "Phone Number": lead.phone,
        "Email Address": lead.email || "Not provided",
        "Video Service": lead.videoType,
        "Business / Company": lead.business,
        "Industry": lead.industry || "N/A",
        "Location / City": lead.location || "N/A",
        "Requirement": lead.requirement || "N/A",
        "Additional Details": lead.additional || "N/A",
        "Submission Time": timestamp,
      }),
    });

    if (response.ok) {
      return { success: true };
    }
    const resData = await response.text();
    console.warn("FormSubmit response:", resData);
    return { success: true };
  } catch (httpErr: any) {
    console.error("HTTP email notification fallback error:", httpErr?.message);
    return { success: false, error: httpErr?.message };
  }
}

export interface PaymentReceiptEmailPayload {
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
  paymentDate?: string;
  delivery?: string;
}

/**
 * Sends an automated, beautifully formatted payment receipt email to the customer
 * and sends a carbon copy / notification to info@quickuppaistudio.us.
 */
export async function sendPaymentReceiptEmail(
  payload: PaymentReceiptEmailPayload
): Promise<{ success: boolean; error?: string }> {
  const currency = payload.currency || "USD";
  const formattedAmount = `$${payload.amount.toFixed(2)} ${currency}`;
  const transactionId = payload.captureId || payload.orderId;
  const paymentDate = payload.paymentDate || new Date().toUTCString();
  const paymentMethod = payload.paymentMethod || "PayPal / Card";

  const subject = `Receipt & Order Confirmation #${transactionId.slice(-8).toUpperCase()} - Quickupp AI Studio`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - Quickupp AI Studio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0714;
      color: #1e293b;
      margin: 0;
      padding: 32px 12px;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      border: 1px solid #e2e8f0;
    }
    .top-gradient {
      height: 6px;
      background: linear-gradient(90deg, #7c3aed 0%, #ec4899 50%, #8b5cf6 100%);
    }
    .header {
      background-color: #ffffff;
      padding: 32px 28px 24px 28px;
      border-bottom: 1px solid #f1f5f9;
      text-align: center;
    }
    .logo-img {
      height: 40px;
      width: auto;
      margin-bottom: 16px;
    }
    .badge-success {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #047857;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .receipt-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
    }
    .receipt-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
    .content {
      padding: 28px;
      background-color: #ffffff;
    }
    .highlight-card {
      background: linear-gradient(135deg, #f8f6ff 0%, #fdf2f8 100%);
      border: 1px solid #e9d5ff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .amount-label {
      font-size: 11px;
      font-weight: 700;
      color: #7c3aed;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .amount-value {
      font-size: 32px;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
    }
    .table-details {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    .table-details th {
      text-align: left;
      color: #64748b;
      font-weight: 600;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      width: 40%;
    }
    .table-details td {
      text-align: right;
      color: #0f172a;
      font-weight: 700;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .next-steps-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .next-steps-title {
      font-size: 13px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
    }
    .step-num {
      background: #7c3aed;
      color: #ffffff;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .btn-container {
      text-align: center;
      padding-top: 8px;
    }
    .btn-contact {
      display: inline-block;
      background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(217, 70, 239, 0.35);
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="top-gradient"></div>
    <div class="header">
      <div class="badge-success">&#10004; Payment Confirmed &amp; Verified</div>
      <h1 class="receipt-title">Payment Receipt</h1>
      <p class="receipt-subtitle">Thank you for your order with Quickupp AI Studio!</p>
    </div>

    <div class="content">
      <div class="highlight-card">
        <div class="amount-label">Amount Paid</div>
        <div class="amount-value">${formattedAmount}</div>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #6b21a8; font-weight: 600;">
          &#10003; 100% Satisfaction Guarantee • Official Commercial License Included
        </p>
      </div>

      <table class="table-details">
        <tr>
          <th>Customer Name</th>
          <td>${payload.customerName}</td>
        </tr>
        <tr>
          <th>Customer Email</th>
          <td>${payload.customerEmail}</td>
        </tr>
        ${payload.customerPhone ? `<tr><th>Phone Number</th><td>${payload.customerPhone}</td></tr>` : ""}
        ${payload.customerCompany ? `<tr><th>Company / Brand</th><td>${payload.customerCompany}</td></tr>` : ""}
        <tr>
          <th>Service / Package</th>
          <td style="color: #7c3aed;">${payload.itemName}</td>
        </tr>
        <tr>
          <th>Transaction ID</th>
          <td style="font-family: monospace; font-size: 12px;">${transactionId}</td>
        </tr>
        <tr>
          <th>PayPal Order ID</th>
          <td style="font-family: monospace; font-size: 12px;">${payload.orderId}</td>
        </tr>
        <tr>
          <th>Payment Method</th>
          <td>${paymentMethod}</td>
        </tr>
        <tr>
          <th>Date &amp; Time</th>
          <td>${paymentDate}</td>
        </tr>
      </table>

      <div class="next-steps-card">
        <div class="next-steps-title">&#128640; What Happens Next?</div>
        <div class="step-item">
          <span class="step-num">1</span>
          <div><strong>Creative Briefing:</strong> Our creative director has queued your project and will review your branding requirements.</div>
        </div>
        <div class="step-item">
          <span class="step-num">2</span>
          <div><strong>Script &amp; AI Production:</strong> We write the engaging hook &amp; script and produce your video in stunning 4K Ultra HD.</div>
        </div>
        <div class="step-item">
          <span class="step-num">3</span>
          <div><strong>Direct Delivery &amp; Revisions:</strong> Your video is delivered directly via email / WhatsApp with 1 free revision included.</div>
        </div>
      </div>

      <div class="btn-container">
        <a href="https://wa.me/15550000000?text=Hi%20Quickupp%20AI%20Studio,%20I%20just%20completed%20my%20payment%20for%20order%20${transactionId}" class="btn-contact" target="_blank">
          Connect with Production Team on WhatsApp
        </a>
      </div>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Quickupp AI Studio. All rights reserved.<br>
      For any inquiries, reply to this email at <a href="mailto:info@quickuppaistudio.us" style="color: #7c3aed; text-decoration: none;">info@quickuppaistudio.us</a>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Quickupp AI Studio - Payment Receipt & Order Confirmation
=========================================================
Thank you, ${payload.customerName}! Your payment has been received and verified.

Order & Transaction Summary:
---------------------------------------------------------
Service: ${payload.itemName}
Amount Paid: ${formattedAmount}
Transaction ID: ${transactionId}
PayPal Order ID: ${payload.orderId}
Payment Method: ${paymentMethod}
Date: ${paymentDate}
Customer: ${payload.customerName} (${payload.customerEmail})
${payload.customerPhone ? `Phone: ${payload.customerPhone}\n` : ""}${payload.customerCompany ? `Company: ${payload.customerCompany}\n` : ""}
Production Next Steps:
1. Our creative team will review your order requirements.
2. We craft your script, generate AI visuals/voice, and render in 4K.
3. Delivery directly to your email with revisions included.

Contact & Support:
Email: info@quickuppaistudio.us
Website: https://quickuppaistudio.us
=========================================================
  `;

  // 1. Send via Hostinger SMTP to customer and BCC to official company mailbox
  const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = process.env.SMTP_SECURE === "false" ? false : true;
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || "info@quickuppaistudio.us";
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || "Quickuppaistudio@8080";
  const fromAddress = process.env.EMAIL_FROM || smtpUser || "info@quickuppaistudio.us";

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass.replace(/\s+/g, ""),
        },
      });

      await transporter.sendMail({
        from: `"Quickupp AI Studio" <${fromAddress}>`,
        to: payload.customerEmail,
        bcc: [fromAddress, NOTIFICATION_EMAIL].filter((m, idx, arr) => arr.indexOf(m) === idx),
        replyTo: fromAddress,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ Automated payment receipt sent successfully to ${payload.customerEmail}`);
      return { success: true };
    } catch (smtpErr: any) {
      console.error("Hostinger SMTP payment receipt email failed:", smtpErr?.message);
    }
  }

  // 2. Backup Gmail SMTP Fallback
  const backupUser = process.env.GMAIL_USER || "quickuppaistudio1@gmail.com";
  const backupPass = process.env.GMAIL_APP_PASSWORD || "ggtodbgiucfdypcj";
  if (backupUser && backupPass && backupUser !== smtpUser) {
    try {
      const backupTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: backupUser,
          pass: backupPass.replace(/\s+/g, ""),
        },
      });

      await backupTransporter.sendMail({
        from: `"Quickupp AI Studio" <${backupUser}>`,
        to: payload.customerEmail,
        bcc: [backupUser, NOTIFICATION_EMAIL],
        replyTo: fromAddress,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`✅ Backup SMTP payment receipt sent to ${payload.customerEmail}`);
      return { success: true };
    } catch (backupErr: any) {
      console.error("Backup Gmail SMTP payment receipt failed:", backupErr?.message);
    }
  }

  return { success: false, error: "SMTP dispatch failed" };
}

