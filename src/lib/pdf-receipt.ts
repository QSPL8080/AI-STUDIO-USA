import PDFDocument from "pdfkit";
import {
  getReceiptRegularFont,
  getReceiptBoldFont,
  getCompanyLogoBuffer,
} from "./receipt-assets.ts";

export interface InvoiceData {
  orderNumber: string;
  issueDate?: string | undefined;
  paymentDate?: string | undefined;
  paymentTime?: string | undefined;
  paymentStatus?: string | undefined;
  customerName: string;
  customerEmail: string;
  customerCompany?: string | undefined;
  billingAddress?: string | undefined;
  serviceName: string;
  packageDescription?: string | undefined;
  qty?: number | undefined;
  amount: number;
  currency?: string | undefined;
  subtotal?: number | undefined;
  tax?: number | undefined;
  total?: number | undefined;
  paymentMethod?: string | undefined;
  transactionId: string;
}

/**
 * Generates an official, beautiful PDF Payment Receipt / Invoice buffer
 * matching Quickupp AI Studio branding and official format.
 * 100% self-contained with embedded fonts and logo for zero-crash reliability.
 */
export async function generateInvoicePdfBuffer(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const regularFont = getReceiptRegularFont();
      const boldFont = getReceiptBoldFont();
      const logoBuffer = getCompanyLogoBuffer();

      const doc = new PDFDocument({
        font: regularFont as unknown as string,
        margins: { top: 20, bottom: 0, left: 44, right: 44 },
        size: "A4",
        info: {
          Title: `Payment Receipt - ${data.orderNumber}`,
          Author: "Quickupp AI Studio",
          Subject: `Official Payment Receipt for Order ${data.orderNumber}`,
          Creator: "Quickupp AI Studio Invoice Generator",
        },
      });

      doc.registerFont("ReceiptRegular", regularFont);
      doc.registerFont("ReceiptBold", boldFont);

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 44;
      const contentWidth = pageWidth - margin * 2;
      const right = pageWidth - margin;

      const label = (t: string, x: number, y: number, size = 10.5, color = "#64748b") =>
        doc.font("ReceiptRegular").fontSize(size).fillColor(color).text(t, x, y, { continued: true, lineBreak: false });
      const card = (x: number, y: number, w: number, h: number, fill = "#f8fafc", stroke = "#e2e8f0") =>
        doc.roundedRect(x, y, w, h, 8).fillAndStroke(fill, stroke);
      const sectionTitle = (t: string, x: number, y: number, color = "#6d28d9") =>
        doc.font("ReceiptBold").fontSize(11).fillColor(color).text(t, x, y, { characterSpacing: 0.6, lineBreak: false });

      // Top and bottom brand bars
      doc.rect(0, 0, pageWidth, 8).fill("#7c3aed");
      doc.rect(0, pageHeight - 8, pageWidth, 8).fill("#7c3aed");

      // ── 1. HEADER ───────────────────────────────────────────────
      const topY = 34;
      let leftY = topY;
      try {
        doc.image(logoBuffer, margin, topY, { width: 205 });
        leftY = topY + 46;
      } catch {
        doc.font("ReceiptBold").fontSize(20).fillColor("#6d28d9").text("QUICKUPP AI STUDIO", margin, topY);
        leftY = topY + 30;
      }
      doc.font("ReceiptRegular").fontSize(10).fillColor("#64748b").text("AI-Powered Creative & Video Studio", margin, leftY);
      leftY += 14;
      doc.font("ReceiptRegular").fontSize(9.5).fillColor("#64748b").text("Operated by-Quickupp Softech LLC", margin, leftY);
      leftY += 14;
      label("Email: ", margin, leftY, 9.5, "#475569");
      doc.fillColor("#2563eb").text("info@quickuppaistudio.us", { link: "mailto:info@quickuppaistudio.us", underline: true });
      leftY += 14;
      label("Website: ", margin, leftY, 9.5, "#475569");
      doc.fillColor("#2563eb").text("quickuppaistudio.us", { link: "https://quickuppaistudio.us", underline: true });
      leftY += 14;

      const rightColWidth = 260;
      const rightColX = right - rightColWidth;
      let rightY = topY - 2;
      doc.font("ReceiptBold").fontSize(24).fillColor("#0f172a")
        .text("PAYMENT RECEIPT", rightColX, rightY, { width: rightColWidth, align: "right" });
      rightY += 34;
      doc.font("ReceiptBold").fontSize(10.5).fillColor("#0f172a")
        .text(`Receipt No: ${data.orderNumber}`, rightColX, rightY, { width: rightColWidth, align: "right" });
      rightY += 16;
      const issueDateStr = data.issueDate || data.paymentDate || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      doc.font("ReceiptRegular").fontSize(10.5).fillColor("#475569")
        .text(`Date: ${issueDateStr}`, rightColX, rightY, { width: rightColWidth, align: "right" });
      rightY += 20;
      // PAID badge
      const badgeW = 74;
      doc.roundedRect(right - badgeW, rightY, badgeW, 22, 11).fill("#dcfce7");
      doc.font("ReceiptBold").fontSize(10).fillColor("#15803d").text("PAID", right - badgeW, rightY + 6, { width: badgeW, align: "center" });
      rightY += 22;

      let y = Math.max(leftY, rightY) + 12;
      doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(margin, y).lineTo(right, y).stroke();
      y += 16;

      // ── 2. BILL TO (full width, two columns) ────────────────────
      const pad = 16;
      const infoCardH = 96;
      card(margin, y, contentWidth, infoCardH);
      const billLeftX = margin + pad;
      const billRightX = margin + contentWidth / 2 + 8;
      let by = y + pad;
      sectionTitle("BILL TO", billLeftX, by);
      by += 24;
      label("Name: ", billLeftX, by);
      doc.font("ReceiptBold").fillColor("#0f172a").text(data.customerName, { lineBreak: false });
      label("Email: ", billRightX, by);
      doc.fillColor("#2563eb").text(data.customerEmail, { link: `mailto:${data.customerEmail}`, underline: true, lineBreak: false });
      by += 20;
      const formattedAddress = (data.billingAddress || "United States").replace(/[\r\n]+/g, ", ").trim();
      if (data.customerCompany && data.customerCompany.trim()) {
        label("Company: ", billLeftX, by);
        doc.font("ReceiptBold").fillColor("#0f172a").text(data.customerCompany, { lineBreak: false });
        label("Address: ", billRightX, by);
      } else {
        label("Address: ", billLeftX, by);
      }
      doc.font("ReceiptRegular").fillColor("#0f172a").text(formattedAddress, { underline: false, lineBreak: false });

      y += infoCardH + 20;

      // ── 3. PAYMENT DETAILS TABLE ────────────────────────────────
      sectionTitle("PAYMENT DETAILS", margin, y);
      y += 20;
      const col1X = margin + 16;
      const col2X = margin + 330;
      const col2Width = 60;
      const col3X = margin + 400;
      const col3Width = right - 16 - col3X;
      const col1Width = col2X - col1X - 10;

      doc.rect(margin, y, contentWidth, 30).fill("#6d28d9");
      doc.font("ReceiptBold").fontSize(10.5).fillColor("#ffffff")
        .text("Description", col1X, y + 9, { width: col1Width, lineBreak: false })
        .text("Qty", col2X, y + 9, { width: col2Width, align: "center" })
        .text("Amount", col3X, y + 9, { width: col3Width, align: "right" });
      y += 30;

      const itemDesc = data.packageDescription ? `${data.serviceName} – ${data.packageDescription}` : `${data.serviceName}`;
      doc.font("ReceiptBold").fontSize(11);
      const descH = doc.heightOfString(itemDesc, { width: col1Width });
      const rowHeight = Math.max(44, descH + 24);
      doc.rect(margin, y, contentWidth, rowHeight).fillAndStroke("#ffffff", "#e2e8f0");
      const rowTextY = y + (rowHeight - 13) / 2;
      doc.font("ReceiptBold").fontSize(11).fillColor("#0f172a").text(itemDesc, col1X, y + (rowHeight - descH) / 2, { width: col1Width });
      doc.font("ReceiptRegular").fontSize(11).fillColor("#0f172a").text(String(data.qty || 1), col2X, rowTextY, { width: col2Width, align: "center" });
      doc.font("ReceiptBold").fontSize(11).fillColor("#0f172a").text(`$${data.amount.toFixed(2)}`, col3X, rowTextY, { width: col3Width, align: "right" });
      y += rowHeight + 16;

      // Totals
      const totalsWidth = 250;
      const totalsX = right - totalsWidth;
      const tLabelX = totalsX + 16;
      const tValX = totalsX + 110;
      const tValW = totalsWidth - 110 - 16;
      const subtotalVal = data.subtotal !== undefined ? data.subtotal : data.amount;
      const taxVal = data.tax !== undefined ? data.tax : 0;
      const totalVal = data.total !== undefined ? data.total : data.amount;
      const currencyStr = data.currency || "USD";

      doc.font("ReceiptRegular").fontSize(10.5).fillColor("#64748b").text("Subtotal:", tLabelX, y, { lineBreak: false });
      doc.font("ReceiptBold").fillColor("#0f172a").text(`$${subtotalVal.toFixed(2)}`, tValX, y, { width: tValW, align: "right" });
      y += 20;
      doc.font("ReceiptRegular").fontSize(10.5).fillColor("#64748b").text("Tax (0%):", tLabelX, y, { lineBreak: false });
      doc.font("ReceiptBold").fillColor("#0f172a").text(`$${taxVal.toFixed(2)}`, tValX, y, { width: tValW, align: "right" });
      y += 22;
      doc.roundedRect(totalsX, y, totalsWidth, 36, 8).fillAndStroke("#f5f3ff", "#ddd6fe");
      doc.font("ReceiptBold").fontSize(13).fillColor("#6d28d9")
        .text("Total:", tLabelX, y + 11, { lineBreak: false })
        .text(`$${totalVal.toFixed(2)} ${currencyStr}`, tValX - 20, y + 11, { width: tValW + 20, align: "right" });
      y += 36 + 20;

      // ── 4. PAYMENT INFORMATION CARD ─────────────────────────────
      const payCardH = 106;
      card(margin, y, contentWidth, payCardH);
      sectionTitle("PAYMENT INFORMATION", margin + pad, y + pad, "#475569");
      const infoLeftX = margin + pad;
      const infoRightX = margin + contentWidth / 2 + 8;
      let cy = y + pad + 26;
      label("Payment Method: ", infoLeftX, cy);
      doc.font("ReceiptBold").fillColor("#0f172a").text(data.paymentMethod || "PayPal", { lineBreak: false });
      label("Payment Date: ", infoRightX, cy);
      doc.font("ReceiptBold").fillColor("#0f172a").text(data.paymentDate || issueDateStr, { lineBreak: false });
      cy += 20;
      label("Transaction ID: ", infoLeftX, cy);
      doc.font("ReceiptBold").fillColor("#0f172a").text(data.transactionId, { lineBreak: false });
      label("Payment Time: ", infoRightX, cy);
      doc.font("ReceiptBold").fillColor("#0f172a").text(data.paymentTime || "—", { lineBreak: false });
      cy += 20;
      label("Payment Status: ", infoLeftX, cy);
      doc.font("ReceiptBold").fillColor("#16a34a").text("PAID", { lineBreak: false });
      label("Currency: ", infoRightX, cy);
      doc.font("ReceiptBold").fillColor("#0f172a").text(currencyStr, { lineBreak: false });
      y += payCardH;

      // ── 5. THANK YOU (anchored near the bottom of the page) ─────
      const footerY = pageHeight - 8 - 34;
      const thanksH = 140;
      const thanksY = Math.max(y + 20, footerY - 20 - thanksH);
      doc.roundedRect(margin, thanksY, contentWidth, thanksH, 8).fillAndStroke("#faf5ff", "#e9d5ff");
      doc.roundedRect(margin + 14, thanksY + 18, 4, 20, 2).fill("#7c3aed");
      let ty = thanksY + 20;
      doc.font("ReceiptBold").fontSize(15).fillColor("#0f172a").text("Thank You For Your Purchase!", margin + 22, ty, { lineBreak: false });
      ty += 24;
      doc.font("ReceiptRegular").fontSize(10.5).fillColor("#334155")
        .text("Your payment has been successfully received. Your order is now being processed by the Quickupp AI Studio team.", margin + 22, ty, { width: contentWidth - 44 });
      ty += 32;
      doc.font("ReceiptBold").fontSize(10).fillColor("#475569").text("For questions regarding your order or payment:", margin + 22, ty, { lineBreak: false });
      ty += 17;
      doc.font("ReceiptBold").fontSize(10.5).fillColor("#6d28d9").text("Quickupp AI Studio", margin + 22, ty, { lineBreak: false });
      ty += 16;
      label("Email: ", margin + 22, ty, 10, "#475569");
      doc.fillColor("#2563eb").text("info@quickuppaistudio.us", { link: "mailto:info@quickuppaistudio.us", underline: true, lineBreak: false });
      ty += 15;
      label("Website: ", margin + 22, ty, 10, "#475569");
      doc.fillColor("#2563eb").text("quickuppaistudio.us", { link: "https://quickuppaistudio.us", underline: true, lineBreak: false });

      // ── 6. FOOTER ───────────────────────────────────────────────
      doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(margin, footerY - 6).lineTo(right, footerY - 6).stroke();
      doc.font("ReceiptRegular").fontSize(8.5).fillColor("#94a3b8").text(
        "This document serves as your official payment receipt for the transaction described above. Operated by-Quickupp Softech LLC.",
        margin,
        footerY + 4,
        { width: contentWidth, align: "center", lineBreak: false }
      );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
