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
        const orderIdParam = url.searchParams.get("orderId") || url.searchParams.get("id");
        if (!orderIdParam) {
          return new Response("Missing orderId parameter.", { status: 400 });
        }
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
          amount: order ? Number(order.amount) : 1.0,
          currency: order?.currency || "USD",
          subtotal: order ? Number(order.amount) : 1.0,
          tax: 0,
          total: order ? Number(order.amount) : 1.0,
          paymentMethod: "PayPal",
          transactionId: order?.paypal_capture_id || order?.paypal_order_id || orderIdParam,
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

      // Calendly Webhook & Direct Integration Endpoint
      if (url.pathname === "/api/calendly-webhook" || url.pathname === "/api/calendly") {
        if (request.method === "OPTIONS") {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          });
        }

        if (request.method === "GET") {
          return new Response(
            JSON.stringify({
              status: "active",
              service: "Quickupp AI Studio Calendly Webhook Service (USA)",
              endpoint: url.pathname,
              timestamp: new Date().toISOString(),
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        if (request.method === "POST") {
          try {
            const body = await request.json();
            const { saveCalendlyMeeting, updateCalendlyMeetingStatus, getCrmSettings, saveCRMNotification } = await import("./lib/db");
            const { broadcastLeadEvent } = await import("./lib/lead-actions");

            const settings = await getCrmSettings();
            const cutoffStr = settings?.["calendly_reset_cutoff_time"];
            const cutoffTime = cutoffStr ? new Date(cutoffStr).getTime() : 0;

            const eventType = body.event || "invitee.created";
            const payload = body.payload || body;
            const invitee = payload.invitee || payload;
            const scheduledEvent = payload.scheduled_event || payload.event || {};

            const createdAtStr = invitee.created_at || scheduledEvent.created_at || payload.created_at;
            if (createdAtStr && cutoffTime > 0) {
              const eventCreatedAt = new Date(createdAtStr).getTime();
              if (eventCreatedAt < cutoffTime) {
                return new Response(
                  JSON.stringify({ success: true, ignored: true, reason: "pre_reset_event" }),
                  { status: 200, headers: { "Content-Type": "application/json" } }
                );
              }
            }

            const clientName = invitee.name || payload.name || payload.client_name || "Calendly Client";
            const clientEmail = invitee.email || payload.email || "client@calendly.com";
            const clientPhone = invitee.text_reminder_number || payload.phone || "";
            const startTime = scheduledEvent.start_time || payload.start_time || new Date().toISOString();
            const eventTitle = scheduledEvent.name || payload.meeting_type || "Quickupp AI Studio - 30 Min Strategy Call";
            const joinUrl =
              scheduledEvent.location?.join_url ||
              payload.meeting_link ||
              payload.join_url ||
              "https://calendly.com/qsaistudio/quickupp-ai-studio-30-min-strategy-call";

            const parsedDate = new Date(startTime);
            const meetingDate = !isNaN(parsedDate.getTime())
              ? parsedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" })
              : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const meetingTime = !isNaN(parsedDate.getTime())
              ? parsedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "America/New_York" }) + " EST"
              : "3:00 PM EST";

            const isCancelEvent =
              eventType.includes("canceled") ||
              eventType.includes("cancelled") ||
              invitee.status === "canceled" ||
              payload.status === "canceled";

            // Calendly marks the OLD booking of a reschedule with rescheduled=true / new_invitee.
            // That cancel is not a real cancellation; the invitee.created event for the new time
            // updates the meeting, so ignore it (processing it could overwrite the new date).
            const cancelledForReschedule =
              isCancelEvent &&
              (payload.rescheduled === true ||
                invitee.rescheduled === true ||
                Boolean(payload.new_invitee) ||
                Boolean(invitee.new_invitee));
            if (cancelledForReschedule) {
              return new Response(
                JSON.stringify({ success: true, ignored: true, reason: "old_slot_of_reschedule" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
            }

            // A new booking that replaced an earlier one (old_invitee set). A later real
            // cancellation of that booking still counts as cancelled.
            const isRescheduled =
              !isCancelEvent && (Boolean(payload.old_invitee) || Boolean(invitee.old_invitee) || eventType.includes("rescheduled"));

            const status = isCancelEvent ? "cancelled" : isRescheduled ? "rescheduled" : "scheduled";
            const cancellation = payload.cancellation || invitee.cancellation || {};
            const cancelNote = isCancelEvent
              ? `Cancelled in Calendly${cancellation.canceled_by ? ` by ${cancellation.canceled_by}` : ""}${
                  cancellation.reason ? ` (Reason: ${cancellation.reason})` : ""
                }`
              : "";

            const meeting = await saveCalendlyMeeting({
              client_name: clientName,
              email: clientEmail,
              phone: clientPhone,
              meeting_date: meetingDate,
              meeting_time: meetingTime,
              meeting_status: status,
              meeting_link: joinUrl,
              meeting_type: eventTitle,
              is_rescheduled: isRescheduled,
              notes: isCancelEvent
                ? cancelNote
                : isRescheduled
                ? `Rescheduled via Calendly (${meetingDate} at ${meetingTime})`
                : `Received via Calendly Webhook (${eventType})`,
            });

            await saveCRMNotification({
              type: isRescheduled
                ? "meeting_rescheduled"
                : status === "cancelled"
                ? "meeting_cancelled"
                : "meeting_new",
              title: isRescheduled
                ? "Meeting Rescheduled"
                : status === "cancelled"
                ? "Meeting Cancelled"
                : "New Calendly Meeting Booked",
              message: isRescheduled
                ? `${clientName} (${clientEmail}) rescheduled call to ${meetingDate} at ${meetingTime}`
                : status === "cancelled"
                ? `${clientName} (${clientEmail}) cancelled their ${meetingDate} ${meetingTime} strategy call${
                    cancellation.reason ? ` — ${cancellation.reason}` : ""
                  }`
                : `${clientName} (${clientEmail}) scheduled strategy call for ${meetingDate} at ${meetingTime}`,
              entity_id: meeting.id,
              actor: "Calendly",
            });

            broadcastLeadEvent({ type: "NEW_MEETING", meeting });

            return new Response(
              JSON.stringify({ success: true, meeting_id: meeting.id, status, isRescheduled }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
              }
            );
          } catch (err: any) {
            console.error("Calendly Webhook error in server.ts:", err);
            return new Response(JSON.stringify({ success: false, error: err.message }), {
              status: 500,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            });
          }
        }
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
