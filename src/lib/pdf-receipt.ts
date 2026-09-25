import PDFDocument from "pdfkit";
import path from "node:path";
import fs from "node:fs";

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
 */
export async function generateInvoicePdfBuffer(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 42,
        size: "A4",
        info: {
          Title: `Payment Receipt - ${data.orderNumber}`,
          Author: "Quickupp AI Studio",
          Subject: `Official Payment Receipt for Order ${data.orderNumber}`,
          Creator: "Quickupp AI Studio Invoice Generator",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      const pageWidth = 595.28;
      const margin = 42;
      const contentWidth = pageWidth - margin * 2;

      // Top colored accent bar
      doc
        .rect(0, 0, pageWidth, 6)
        .fill("#7c3aed");

      let currentY = 24;

      // 1. Logo and Company Header
      const logoPath = path.resolve(process.cwd(), "public/images/logo.png");
      const logoExists = fs.existsSync(logoPath);

      if (logoExists) {
        try {
          doc.image(logoPath, margin, currentY, { width: 140 });
        } catch {
          // Fallback if image fails to render
          doc
            .font("Helvetica-Bold")
            .fontSize(16)
            .fillColor("#6d28d9")
            .text("QUICKUPP AI STUDIO", margin, currentY);
        }
      } else {
        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor("#6d28d9")
          .text("QUICKUPP AI STUDIO", margin, currentY);
      }

      // Top Right: PAYMENT RECEIPT header
      const rightColX = 350;
      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor("#0f172a")
        .text("PAYMENT RECEIPT", rightColX, currentY, { align: "right", width: contentWidth - (rightColX - margin) });

      currentY += 24;

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Receipt / Invoice No.: ", rightColX, currentY, { continued: true, align: "right", width: contentWidth - (rightColX - margin) })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(data.orderNumber);

      currentY += 14;

      const issueDateStr = data.issueDate || data.paymentDate || "September 24, 2026";
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Issue Date: ", rightColX, currentY, { continued: true, align: "right", width: contentWidth - (rightColX - margin) })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(issueDateStr);

      currentY += 14;

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Payment Status: ", rightColX, currentY, { continued: true, align: "right", width: contentWidth - (rightColX - margin) })
        .font("Helvetica-Bold")
        .fillColor("#16a34a")
        .text("PAID");

      // Left subtitle below logo
      currentY = 74;
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#0f172a")
        .text("QUICKUPP AI STUDIO", margin, currentY);

      currentY += 14;
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("AI-Powered Creative & Video Studio", margin, currentY);

      currentY += 12;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor("#64748b")
        .text("Operated by-Quickupp Softech LLC", margin, currentY);

      currentY += 12;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor("#64748b")
        .text("Email: info@quickuppaistudio.us  •  Website: quickuppaistudio.us", margin, currentY);

      currentY += 22;

      // Divider line
      doc
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .moveTo(margin, currentY)
        .lineTo(pageWidth - margin, currentY)
        .stroke();

      currentY += 16;

      // 2. BILL TO Section
      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor("#6d28d9")
        .text("BILL TO", margin, currentY);

      currentY += 14;

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Customer Name: ", margin, currentY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(data.customerName);

      currentY += 14;
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Email: ", margin, currentY, { continued: true })
        .font("Helvetica")
        .fillColor("#2563eb")
        .text(data.customerEmail);

      if (data.customerCompany && data.customerCompany.trim()) {
        currentY += 14;
        doc
          .font("Helvetica")
          .fontSize(9.5)
          .fillColor("#475569")
          .text("Company: ", margin, currentY, { continued: true })
          .font("Helvetica-Bold")
          .fillColor("#0f172a")
          .text(data.customerCompany);
      }

      if (data.billingAddress && data.billingAddress.trim()) {
        currentY += 14;
        doc
          .font("Helvetica")
          .fontSize(9.5)
          .fillColor("#475569")
          .text("Billing Address:", margin, currentY);

        const addressLines = data.billingAddress
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);

        for (const line of addressLines) {
          currentY += 13;
          doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#334155")
            .text(line, margin + 12, currentY);
        }
      }

      currentY += 24;

      // 3. PAYMENT DETAILS Table
      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor("#6d28d9")
        .text("PAYMENT DETAILS", margin, currentY);

      currentY += 14;

      // Table Header Box
      const tableX = margin;
      const col1Width = 320;
      const col2Width = 60;
      const col3Width = contentWidth - col1Width - col2Width;

      doc
        .rect(tableX, currentY, contentWidth, 22)
        .fill("#f8fafc")
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#475569")
        .text("Description", tableX + 10, currentY + 6, { width: col1Width - 10 })
        .text("Qty", tableX + col1Width, currentY + 6, { width: col2Width, align: "center" })
        .text("Amount", tableX + col1Width + col2Width, currentY + 6, { width: col3Width - 10, align: "right" });

      currentY += 22;

      // Table Row
      const rowHeight = 32;
      doc
        .rect(tableX, currentY, contentWidth, rowHeight)
        .fill("#ffffff")
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .stroke();

      const itemDesc = data.packageDescription
        ? `${data.serviceName} – ${data.packageDescription}`
        : `${data.serviceName}`;

      const qty = data.qty || 1;
      const formattedAmount = `$${data.amount.toFixed(2)}`;

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#0f172a")
        .text(itemDesc, tableX + 10, currentY + 10, { width: col1Width - 10 })
        .font("Helvetica")
        .fontSize(9.5)
        .text(String(qty), tableX + col1Width, currentY + 10, { width: col2Width, align: "center" })
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .text(formattedAmount, tableX + col1Width + col2Width, currentY + 10, { width: col3Width - 10, align: "right" });

      currentY += rowHeight + 10;

      // Subtotal, Tax, Total
      const totalsX = tableX + 280;
      const totalsWidth = contentWidth - 280;

      const subtotalVal = data.subtotal !== undefined ? data.subtotal : data.amount;
      const taxVal = data.tax !== undefined ? data.tax : 0;
      const totalVal = data.total !== undefined ? data.total : data.amount;
      const currencyStr = data.currency || "USD";

      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Subtotal:", totalsX, currentY, { width: totalsWidth - 70 })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(`$${subtotalVal.toFixed(2)}`, totalsX, currentY, { width: totalsWidth, align: "right" });

      currentY += 15;
      doc
        .font("Helvetica")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("Tax:", totalsX, currentY, { width: totalsWidth - 70 })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(`$${taxVal.toFixed(2)}`, totalsX, currentY, { width: totalsWidth, align: "right" });

      currentY += 15;

      // Total Box
      doc
        .rect(totalsX - 6, currentY - 3, totalsWidth + 6, 22)
        .fill("#f5f3ff")
        .strokeColor("#ddd6fe")
        .lineWidth(1)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor("#6d28d9")
        .text("Total:", totalsX, currentY + 2, { width: totalsWidth - 100 })
        .text(`$${totalVal.toFixed(2)} ${currencyStr}`, totalsX, currentY + 2, { width: totalsWidth, align: "right" });

      currentY += 32;

      // 4. Payment Information Card
      doc
        .roundedRect(margin, currentY, contentWidth, 76, 6)
        .fill("#f8fafc")
        .strokeColor("#e2e8f0")
        .lineWidth(1)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor("#475569")
        .text("PAYMENT INFORMATION", margin + 14, currentY + 10);

      const infoLeftX = margin + 14;
      const infoRightX = margin + 270;
      let cardY = currentY + 26;

      const paymentMethodStr = data.paymentMethod || "PayPal";
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("Payment Method: ", infoLeftX, cardY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(paymentMethodStr);

      const paymentDateStr = data.paymentDate || "September 24, 2026";
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("Payment Date: ", infoRightX, cardY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(paymentDateStr);

      cardY += 15;
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("Transaction ID: ", infoLeftX, cardY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(data.transactionId);

      const paymentTimeStr = data.paymentTime || "10:42 AM EST";
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("Payment Time: ", infoRightX, cardY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(paymentTimeStr);

      cardY += 15;
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text("Payment Status: ", infoLeftX, cardY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#16a34a")
        .text("PAID ✓");

      currentY += 92;

      // 5. THANK YOU FOR YOUR PURCHASE Section
      doc
        .font("Helvetica-Bold")
        .fontSize(10.5)
        .fillColor("#0f172a")
        .text("THANK YOU FOR YOUR PURCHASE", margin, currentY);

      currentY += 14;
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#334155")
        .text("Your payment has been successfully received.", margin, currentY);

      currentY += 13;
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#334155")
        .text("Your order is now being processed by the Quickupp AI Studio team.", margin, currentY);

      currentY += 15;
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#475569")
        .text("For questions regarding your order or payment:", margin, currentY);

      currentY += 13;
      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor("#6d28d9")
        .text("Quickupp AI Studio", margin, currentY);

      currentY += 12;
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor("#475569")
        .text("Email: ", margin, currentY, { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#2563eb")
        .text("info@quickuppaistudio.us", { continued: true })
        .font("Helvetica")
        .fillColor("#475569")
        .text("    Website: ", { continued: true })
        .font("Helvetica-Bold")
        .fillColor("#2563eb")
        .text("quickuppaistudio.us");

      currentY += 18;
      doc
        .font("Helvetica-Oblique")
        .fontSize(8)
        .fillColor("#94a3b8")
        .text(
          "This document serves as your official payment receipt for the transaction described above. Operated by-Quickupp Softech LLC.",
          margin,
          currentY,
          { width: contentWidth }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
