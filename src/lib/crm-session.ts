import { createHmac, randomBytes } from "node:crypto";
import { evaluateLocationAccess, getOfficeGeoConfig, type LocationEvaluationResult } from "./geo-config";

export interface CrmSessionPayload {
  sessionId: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "leads_manager";
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  accuracy?: number | null | undefined;
  distanceMeters?: number | null | undefined;
  issuedAt: number;
  lastVerifiedAt: number;
  expiresAt: number;
}

export interface SessionVerificationResult {
  valid: boolean;
  payload?: CrmSessionPayload | undefined;
  locationResult?: LocationEvaluationResult | undefined;
  error?: string | undefined;
  errorCode?: "EXPIRED" | "INVALID_SIGNATURE" | "OUT_OF_BOUNDS" | "MISSING_LOCATION" | "POOR_ACCURACY" | "MALFORMED" | undefined;
}

const DEFAULT_SECRET = "quickupp_ai_studio_crm_geo_secret_2026_secure_key_#8080";

function getSessionSecret(): string {
  if (typeof process !== "undefined" && process.env?.["CRM_SESSION_SECRET"]) {
    return process.env["CRM_SESSION_SECRET"];
  }
  return DEFAULT_SECRET;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

function signString(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

/**
 * Creates a cryptographically signed CRM session token containing location authorization.
 */
export function createCrmSessionToken(
  user: {
    email: string;
    name: string;
    role: "super_admin" | "admin" | "leads_manager";
  },
  location?: {
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    accuracy?: number | null | undefined;
    distanceMeters?: number | null | undefined;
  },
  durationHours: number = 24
): string {
  const now = Date.now();
  const sessionId = `sess_${now}_${randomBytes(8).toString("hex")}`;

  const payload: CrmSessionPayload = {
    sessionId,
    email: user.email.toLowerCase().trim(),
    name: user.name,
    role: user.role,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    accuracy: location?.accuracy ?? null,
    distanceMeters: location?.distanceMeters ?? null,
    issuedAt: now,
    lastVerifiedAt: now,
    expiresAt: now + durationHours * 60 * 60 * 1000,
  };

  const payloadJson = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadJson);
  const signature = signString(encodedPayload, getSessionSecret());

  return `${encodedPayload}.${signature}`;
}

/**
 * Decodes and verifies the cryptographic signature of a CRM session token.
 */
export function decodeAndVerifySessionToken(tokenString: string): { valid: boolean; payload?: CrmSessionPayload | undefined; error?: string | undefined } {
  if (!tokenString || typeof tokenString !== "string") {
    return { valid: false, error: "Missing session token" };
  }

  const parts = tokenString.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Malformed session token format" };
  }

  const encodedPayload = parts[0] as string; // length checked above
  const providedSignature = parts[1] as string;
  const expectedSignature = signString(encodedPayload, getSessionSecret());

  if (providedSignature !== expectedSignature) {
    return { valid: false, error: "Invalid session signature" };
  }

  try {
    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: CrmSessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.expiresAt) {
      return { valid: false, payload, error: "Session token expired" };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: "Failed to parse session payload" };
  }
}

/**
 * Verifies both token validity and location authorization (with optional fresh coordinates).
 */
export function verifySessionWithLocation(
  tokenString: string,
  freshCoords?: {
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    accuracy?: number | null | undefined;
  }
): SessionVerificationResult {
  const tokenCheck = decodeAndVerifySessionToken(tokenString);

  if (!tokenCheck.valid || !tokenCheck.payload) {
    return {
      valid: false,
      error: tokenCheck.error || "Invalid session",
      errorCode: tokenCheck.error === "Session token expired" ? "EXPIRED" : "INVALID_SIGNATURE",
    };
  }

  const payload = tokenCheck.payload;

  // Super Admin: always valid anywhere
  if (payload.role === "super_admin") {
    const superAdminLocationResult = evaluateLocationAccess(
      "super_admin",
      freshCoords?.latitude ?? payload.latitude,
      freshCoords?.longitude ?? payload.longitude,
      freshCoords?.accuracy ?? payload.accuracy
    );

    return {
      valid: true,
      payload,
      locationResult: superAdminLocationResult,
    };
  }

  // Admin & Lead Manager: evaluate location
  const latToCheck = freshCoords?.latitude ?? payload.latitude;
  const lngToCheck = freshCoords?.longitude ?? payload.longitude;
  const accuracyToCheck = freshCoords?.accuracy ?? payload.accuracy;

  const locationResult = evaluateLocationAccess(
    payload.role,
    latToCheck,
    lngToCheck,
    accuracyToCheck
  );

  if (!locationResult.authorized) {
    let code: SessionVerificationResult["errorCode"] = "OUT_OF_BOUNDS";
    if (locationResult.status === "missing_coordinates") code = "MISSING_LOCATION";
    if (locationResult.status === "poor_accuracy") code = "POOR_ACCURACY";

    return {
      valid: false,
      payload,
      locationResult,
      error: locationResult.userMessage || "CRM access is not available at your current location.",
      errorCode: code,
    };
  }

  // Update verified location values in payload
  if (freshCoords && typeof freshCoords.latitude === "number") {
    payload.latitude = freshCoords.latitude;
    payload.longitude = freshCoords.longitude;
    payload.accuracy = freshCoords.accuracy;
    payload.distanceMeters = locationResult.distanceMeters;
    payload.lastVerifiedAt = Date.now();
  }

  return {
    valid: true,
    payload,
    locationResult,
  };
}
