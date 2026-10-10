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
            const { broadcastLeadEvent, getCalendlyApiToken } = await import("./lib/lead-actions");
            const { classifyCalendlyInvitee, resolvePreviousSlot } = await import("./lib/calendly-status");

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

            // Scheduled → Rescheduled → Cancelled rules (shared with the API sync)
            const decision = classifyCalendlyInvitee({
              eventType,
              eventStatus: scheduledEvent?.status,
              invitee,
              payload,
            });
            // Old slot of a reschedule: the invitee.created event for the new time updates
            // the meeting, so ignore it (processing it could overwrite the new date).
            if (decision.action === "ignore") {
              return new Response(
                JSON.stringify({ success: true, ignored: true, reason: decision.reason }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
            }
            const status = decision.status;
            const isCancelEvent = status === "cancelled";
            const isRescheduled = decision.isRescheduled;
            // Original slot of a rescheduled booking, so exactly that CRM meeting is updated
            const previousSlot = await resolvePreviousSlot(decision.oldInviteeUri, getCalendlyApiToken(settings));
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
              previous_meeting_date: previousSlot?.date,
              previous_meeting_time: previousSlot?.time,
              notes: isCancelEvent
                ? cancelNote
                : isRescheduled
                ? `Rescheduled via Calendly (${meetingDate} at ${meetingTime})`
                : `Booked via Calendly for ${meetingDate} at ${meetingTime}`,
            });

            // Deleted in the CRM: acknowledge Calendly but keep it out of the CRM
            if ((meeting as any)?.suppressed) {
              return new Response(
                JSON.stringify({ success: true, ignored: true, reason: "deleted_in_crm" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
              );
            }

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

      // Meta (Facebook & Instagram) Lead Ads Webhook Endpoint
      if (
        url.pathname === "/api/meta-leads" ||
        url.pathname === "/api/meta-webhook" ||
        url.pathname === "/api/webhook/meta"
      ) {
        if (request.method === "OPTIONS") {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Hub-Signature, X-Hub-Signature-256",
            },
          });
        }

        // Meta Webhook Verification (Handshake)
        if (request.method === "GET") {
          const mode = url.searchParams.get("hub.mode") || url.searchParams.get("hub_mode");
          const token = url.searchParams.get("hub.verify_token") || url.searchParams.get("hub_verify_token");
          const challenge = url.searchParams.get("hub.challenge") || url.searchParams.get("hub_challenge");

          const EXPECTED_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "quickupp_meta_leads_secure_token";

          if (mode === "subscribe" && token === EXPECTED_VERIFY_TOKEN) {
            console.log("[Meta Webhook] Successfully verified handshake with Meta server.");
            return new Response(challenge || "OK", {
              status: 200,
              headers: { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" },
            });
          }

          // If accessed in browser, show active service status & quick test info
          return new Response(
            JSON.stringify({
              status: "active",
              service: "Quickupp AI Studio Meta Lead Ads Webhook Service (USA)",
              endpoint: url.pathname,
              verify_token: EXPECTED_VERIFY_TOKEN,
              subscribed_fields: ["leadgen"],
              crm_destination_tab: "Meta Leads",
              timestamp: new Date().toISOString(),
              instructions: "Set this URL in Meta Business Suite / Meta Developers Portal under Webhooks > Page > leadgen subscription, or send direct POST payloads.",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            }
          );
        }

        // Handle Incoming Lead Submissions (from Meta Webhook, Zapier, Make, Pabbly, or Custom POST)
        if (request.method === "POST") {
          try {
            const body = await request.json().catch(() => ({}));
            const { saveLead, saveCRMNotification, addActivityLog } = await import("./lib/db");
            const { broadcastLeadEvent, sanitizeLeadPhone, sendLeadNotificationEmail } = await import("./lib/lead-actions");

            const savedLeads: any[] = [];

            // Case 1: Meta Standard Webhook Object
            if (body.object === "page" && Array.isArray(body.entry)) {
              const metaAccessToken = process.env.META_PAGE_ACCESS_TOKEN || "";

              for (const entry of body.entry) {
                const pageId = entry.id;
                const changes = entry.changes || [];
                for (const change of changes) {
                  if (change.field === "leadgen" && change.value) {
                    const leadgenId = change.value.leadgen_id;
                    const formId = change.value.form_id || "";
                    const adId = change.value.ad_id || "";

                    let leadName = `Meta Lead (${leadgenId})`;
                    let leadEmail = `lead_${leadgenId}@meta.leads`;
                    let leadPhone = "";
                    let leadBusiness = "Meta Ad Prospect";
                    let leadVideoType = "AI Video Commercial";
                    let leadRequirements = `Meta Lead Form ID: ${formId} | Ad ID: ${adId || "N/A"} | Page ID: ${pageId}`;

                    // If Meta Page Access Token is configured, fetch full field_data from Meta Graph API
                    if (metaAccessToken && leadgenId && leadgenId !== "444444444444") {
                      try {
                        const metaGraphRes = await fetch(
                          `https://graph.facebook.com/v20.0/${leadgenId}?access_token=${metaAccessToken}`
                        );
                        if (metaGraphRes.ok) {
                          const graphData = await metaGraphRes.json();
                          const fieldData = graphData.field_data || [];
                          const fieldMap: Record<string, string> = {};
                          for (const f of fieldData) {
                            const val = Array.isArray(f.values) ? f.values[0] : f.values;
                            if (f.name && val) fieldMap[f.name.toLowerCase()] = String(val);
                          }

                          leadName =
                            fieldMap["full_name"] ||
                            `${fieldMap["first_name"] || ""} ${fieldMap["last_name"] || ""}`.trim() ||
                            leadName;
                          leadEmail = fieldMap["email"] || leadEmail;
                          leadPhone = fieldMap["phone_number"] || fieldMap["phone"] || leadPhone;
                          leadBusiness = fieldMap["company_name"] || fieldMap["business_name"] || leadBusiness;
                          leadVideoType = fieldMap["video_type"] || fieldMap["service"] || leadVideoType;

                          const extraNotes = Object.entries(fieldMap)
                            .filter(
                              ([k]) =>
                                ![
                                  "full_name",
                                  "first_name",
                                  "last_name",
                                  "email",
                                  "phone_number",
                                  "phone",
                                  "company_name",
                                  "business_name",
                                ].includes(k)
                            )
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" | ");

                          if (extraNotes) {
                            leadRequirements += ` | ${extraNotes}`;
                          }
                        }
                      } catch (graphErr) {
                        console.warn("[Meta Webhook] Error fetching lead from Graph API:", graphErr);
                      }
                    }

                    const normalizedLead = {
                      source: "Meta (Facebook Lead Ads)",
                      name: leadName,
                      email: leadEmail,
                      phone: sanitizeLeadPhone(leadPhone, true),
                      business: leadBusiness,
                      video_type: leadVideoType,
                      video_quantity: 1,
                      location: "USA",
                      requirement: leadRequirements,
                    };

                    const saved = await saveLead(normalizedLead);
                    savedLeads.push(saved);

                    // Add CRM Activity Log
                    try {
                      await addActivityLog({
                        lead_id: saved.id,
                        action: "Meta Lead Received",
                        details: `New lead from Meta Lead Ads (Form: ${formId}, Ad: ${adId || "N/A"}) for ${saved.name}`,
                        performed_by: "Meta Lead Ads Webhook",
                        user_role: "system",
                      });
                    } catch {}

                    // Add CRM Notification
                    try {
                      const notif = await saveCRMNotification({
                        type: "lead_new",
                        title: "New Meta Lead Received",
                        message: `${saved.name} submitted lead via Meta Ads (${saved.phone || saved.email})`,
                        entity_id: saved.id,
                        actor: "Meta Lead Ads",
                      });

                      broadcastLeadEvent({
                        type: "NEW_LEAD",
                        lead: saved,
                        notification: notif,
                      });
                    } catch {}

                    // Email notification
                    try {
                      await sendLeadNotificationEmail({
                        source: saved.source,
                        name: saved.name,
                        email: saved.email,
                        phone: saved.phone,
                        business: saved.business,
                        videoType: saved.video_type,
                        videoQuantity: saved.video_quantity,
                        requirement: saved.requirement || (saved as any).notes,
                        leadId: saved.id,
                      });
                    } catch {}
                  }
                }
              }
            } else {
              // Case 2: Direct JSON / Zapier / Make.com / Pabbly / Webhook Forwarder Payload
              const payload = body.payload || body;
              const name = payload.name || payload.full_name || payload.client_name || payload.customer_name || "Meta Prospect";
              const email = String(payload.email || payload.email_address || "");
              const rawPhone = String(payload.phone || payload.phone_number || payload.mobile || "");
              const phone = typeof sanitizeLeadPhone === "function" ? sanitizeLeadPhone(rawPhone, true) : rawPhone;
              const business = payload.business || payload.company || payload.business_name || payload.brand_name || "Business";
              const website = payload.website || payload.company_website || "";
              const location = payload.location || payload.city || payload.state || "USA";
              const videoType = payload.videoType || payload.video_type || payload.service || "AI UGC Video Ads";
              const videoQuantity = payload.videoQuantity || payload.video_quantity || 1;
              const campaignName = payload.campaign || payload.campaign_name || payload.ad_name || "";
              const formName = payload.form || payload.form_name || "";
              const rawRequirement = payload.requirement || payload.notes || payload.message || payload.comments || "";
              
              let requirementNotes = rawRequirement;
              if (campaignName || formName) {
                const metaMeta = [
                  campaignName ? `Campaign: ${campaignName}` : "",
                  formName ? `Form: ${formName}` : "",
                ]
                  .filter(Boolean)
                  .join(" | ");
                requirementNotes = requirementNotes ? `${requirementNotes} [${metaMeta}]` : `[${metaMeta}]`;
              }

              // Auto-segregate Instagram vs Facebook
              const platformRaw = String(payload.platform || payload.publisher_platform || "").toLowerCase();
              const adNameRaw = String(payload.ad_name || payload.adName || "").toLowerCase();
              const campaignRaw = String(payload.campaign_name || payload.campaign || "").toLowerCase();
              const rawSource = String(payload.source || "");

              let source = "Meta (Facebook Lead Ads)";
              if (
                platformRaw.includes("instagram") ||
                platformRaw.includes("ig") ||
                adNameRaw.includes("instagram") ||
                adNameRaw.includes("insta") ||
                campaignRaw.includes("instagram") ||
                campaignRaw.includes("insta") ||
                rawSource.toLowerCase().includes("instagram") ||
                rawSource.toLowerCase().includes("insta")
              ) {
                source = "Meta (Instagram Lead Ads)";
              } else if (
                platformRaw.includes("facebook") ||
                platformRaw.includes("fb") ||
                rawSource.toLowerCase().includes("facebook")
              ) {
                source = "Meta (Facebook Lead Ads)";
              } else if (rawSource && rawSource !== "Meta (Facebook Ad)") {
                source = rawSource.toLowerCase().includes("meta") ? rawSource : `Meta (${rawSource})`;
              }

              const normalizedLead = {
                source,
                name,
                email,
                phone,
                business,
                website,
                location,
                video_type: videoType,
                video_quantity: videoQuantity,
                requirement: requirementNotes,
              };

              const saved = await saveLead(normalizedLead);
              savedLeads.push(saved);

              // Activity Log
              try {
                await addActivityLog({
                  lead_id: saved.id,
                  action: saved.is_duplicate ? "Duplicate Meta Lead Merged" : "Meta Lead Received",
                  details: saved.is_duplicate
                    ? `Repeat inquiry from ${saved.source} (email: ${saved.email || 'N/A'}) merged for ${saved.name}.`
                    : `New lead from ${saved.source} for ${saved.name} (${saved.phone || saved.email})`,
                  performed_by: "Meta Webhook API",
                  user_role: "system",
                });
              } catch {}

              // CRM Notification
              try {
                const notif = await saveCRMNotification({
                  type: "lead_new",
                  title: saved.is_duplicate ? "Duplicate Meta Lead Received" : "New Meta Ad Lead Received",
                  message: `${saved.name} (${saved.phone || saved.email}) submitted via ${saved.source} - ${saved.video_type || "AI Video"}`,
                  entity_id: saved.id,
                  actor: saved.source,
                });

                broadcastLeadEvent({
                  type: "NEW_LEAD",
                  lead: saved,
                  notification: notif,
                });
              } catch {}

              // Email Notification
              try {
                await sendLeadNotificationEmail({
                  source: saved.source,
                  name: saved.name,
                  email: saved.email,
                  phone: saved.phone,
                  business: saved.business,
                  website: saved.website,
                  location: saved.location,
                  videoType: saved.video_type,
                  videoQuantity: saved.video_quantity,
                  requirement: saved.requirement || (saved as any).notes,
                  leadId: saved.id,
                });
              } catch {}
            }

            return new Response(
              JSON.stringify({
                success: true,
                synced_count: savedLeads.length,
                leads: savedLeads.map((l) => ({ id: l.id, name: l.name, source: l.source })),
                message: "Lead(s) successfully routed to Meta Leads CRM tab.",
              }),
              {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              }
            );
          } catch (postErr: any) {
            console.error("[Meta Webhook] Error processing lead:", postErr);
            return new Response(
              JSON.stringify({ success: false, error: postErr.message || "Failed to process Meta lead" }),
              {
                status: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
              }
            );
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
