// Server only: signed customer links for orders (no login needed, can't be guessed or edited).
import { createHmac, timingSafeEqual } from "node:crypto";

const SITE_URL = (process.env["PUBLIC_SITE_URL"] || "https://quickuppaistudio.us").replace(/\/+$/, "");

function secret(): string {
  return (
    process.env["ORDER_LINK_SECRET"] ||
    process.env["CRM_SESSION_SECRET"] ||
    process.env["PAYPAL_CLIENT_SECRET"] ||
    "quickupp_ai_studio_usa_order_links_2026"
  );
}

export function signOrderId(orderId: string): string {
  return createHmac("sha256", secret()).update(`order:${orderId}`).digest("base64url").slice(0, 32);
}

export function validOrderSignature(orderId: string, token: string): boolean {
  if (!orderId || !token) return false;
  const expected = Buffer.from(signOrderId(orderId));
  const given = Buffer.from(String(token));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Customer's secure "Pay remaining balance" page for a paid 50% advance order. */
export function payBalanceUrl(orderId: string): string {
  return `${SITE_URL}/pay-balance?${new URLSearchParams({ order: orderId, t: signOrderId(orderId) }).toString()}`;
}

export function siteUrl(): string {
  return SITE_URL;
}
