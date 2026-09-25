import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  const captured = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(captured);
  const detail = captured instanceof Error ? captured.message : String(captured);
  return new Response(renderErrorPage(detail), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.hostname === "www.quickuppaistudio.us") {
        url.hostname = "quickuppaistudio.us";
        url.protocol = "https:";
        return Response.redirect(url.toString(), 301);
      }

      if (url.pathname === "/api/download-receipt") {
        const orderIdParam = url.searchParams.get("orderId") || url.searchParams.get("id") || "QAS-2026-000127";
        const emailParam = url.searchParams.get("email") || "";
        const nameParam = url.searchParams.get("name") || "";

        let order = null;
        try {
          const { getOrderByAnyId } = await import("./lib/db");
          order = await getOrderByAnyId(orderIdParam);
        } catch (dbErr) {
          console.warn("DB lookup error in download-receipt:", dbErr);
        }

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

        const { generateInvoicePdfBuffer } = await import("./lib/pdf-receipt");
        const { formatOrderInvoiceNumber } = await import("./lib/paypal-actions");

        const orderNum = order
          ? formatOrderInvoiceNumber(order.id, order.created_at)
          : orderIdParam.startsWith("QAS-")
          ? orderIdParam
          : formatOrderInvoiceNumber(orderIdParam);

        const pdfBuffer = await generateInvoicePdfBuffer({
          orderNumber: orderNum,
          issueDate: dateStr,
          paymentDate: dateStr,
          paymentTime: timeStr,
          paymentStatus: "PAID",
          customerName: order?.customer_name || nameParam || "Valued Client",
          customerEmail: order?.customer_email || emailParam || "info@quickuppaistudio.us",
          customerCompany: order?.customer_company || undefined,
          billingAddress: undefined,
          serviceName: order?.item_name || "AI UGC Video",
          packageDescription: order?.item_name?.includes("Package") ? order.item_name : "60 Seconds",
          qty: 1,
          amount: order ? Number(order.amount) : 79.0,
          currency: order?.currency || "USD",
          subtotal: order ? Number(order.amount) : 79.0,
          tax: 0,
          total: order ? Number(order.amount) : 79.0,
          paymentMethod: "PayPal",
          transactionId: order?.paypal_capture_id || order?.paypal_order_id || "8XX12345XXXXXXX",
        });

        return new Response(new Uint8Array(pdfBuffer), {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Receipt_${orderNum}.pdf"`,
            "Content-Length": String(pdfBuffer.length),
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      const headers = new Headers(normalized.headers);
      headers.set("X-Robots-Tag", "index, follow");
      return new Response(normalized.body, {
        status: normalized.status,
        statusText: normalized.statusText,
        headers,
      });
    } catch (error) {
      console.error(error);
      const detail = error instanceof Error ? error.message : String(error);
      return new Response(renderErrorPage(detail), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8", "X-Robots-Tag": "index, follow" },
      });
    }
  },
};
