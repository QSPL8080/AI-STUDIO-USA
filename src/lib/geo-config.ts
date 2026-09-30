/**
 * CRM Office Geolocation & Distance Configuration
 *
 * Configured Office:
 * Office 411, Suratwala Mark Plazzo, Hinjawadi Rd, Phase 1, Hinjawadi, Maharashtra 411057
 *
 * Coordinates: 18.590441° N, 73.748332° E
 * Permitted Boundary: 100 Meters Radius
 */

export interface OfficeGeoConfig {
  name: string;
  latitude: number;
  longitude: number;
  allowedRadiusMeters: number;
  maxAllowedAccuracyMeters: number;
}

export const DEFAULT_OFFICE_CONFIG: OfficeGeoConfig = {
  name: "Office 411, Suratwala Mark Plazzo, Hinjawadi Phase 1, Pune, MH 411057",
  latitude: 18.590441,
  longitude: 73.748332,
  allowedRadiusMeters: 100,
  maxAllowedAccuracyMeters: 500, // Maximum acceptable GPS accuracy in meters
};

/**
 * Returns the active office geolocation configuration.
 * Environment variables override default values if defined.
 */
export function getOfficeGeoConfig(): OfficeGeoConfig {
  const envLat = typeof process !== "undefined" && process.env?.["CRM_OFFICE_LAT"] ? parseFloat(process.env["CRM_OFFICE_LAT"]) : NaN;
  const envLng = typeof process !== "undefined" && process.env?.["CRM_OFFICE_LNG"] ? parseFloat(process.env["CRM_OFFICE_LNG"]) : NaN;
  const envRadius = typeof process !== "undefined" && process.env?.["CRM_ALLOWED_RADIUS_METERS"] ? parseFloat(process.env["CRM_ALLOWED_RADIUS_METERS"]) : NaN;
  const envAccuracy = typeof process !== "undefined" && process.env?.["CRM_MAX_ACCURACY_METERS"] ? parseFloat(process.env["CRM_MAX_ACCURACY_METERS"]) : NaN;

  return {
    name: DEFAULT_OFFICE_CONFIG.name,
    latitude: !isNaN(envLat) ? envLat : DEFAULT_OFFICE_CONFIG.latitude,
    longitude: !isNaN(envLng) ? envLng : DEFAULT_OFFICE_CONFIG.longitude,
    allowedRadiusMeters: !isNaN(envRadius) && envRadius > 0 ? envRadius : DEFAULT_OFFICE_CONFIG.allowedRadiusMeters,
    maxAllowedAccuracyMeters: !isNaN(envAccuracy) && envAccuracy > 0 ? envAccuracy : DEFAULT_OFFICE_CONFIG.maxAllowedAccuracyMeters,
  };
}

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in meters (rounded to nearest meter)
 */
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    typeof lat1 !== "number" ||
    typeof lon1 !== "number" ||
    typeof lat2 !== "number" ||
    typeof lon2 !== "number" ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return Infinity;
  }

  const R = 6371e3; // Earth's mean radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface LocationEvaluationResult {
  authorized: boolean;
  role: string;
  distanceMeters: number;
  allowedRadiusMeters: number;
  accuracyMeters?: number | undefined;
  isSuperAdminBypass: boolean;
  isAccuracyPoor: boolean;
  status: "authorized" | "out_of_bounds" | "poor_accuracy" | "missing_coordinates" | "super_admin_bypass";
  userMessage?: string | undefined;
}

/**
 * Evaluates whether a given device location is authorized to access the CRM based on user role and office geofence.
 */
export function evaluateLocationAccess(
  role: string,
  userLat?: number | null | undefined,
  userLng?: number | null | undefined,
  accuracy?: number | null | undefined,
  config: OfficeGeoConfig = getOfficeGeoConfig()
): LocationEvaluationResult {
  const isSuperAdmin = role === "super_admin";

  // Calculate distance if coordinates are present
  const hasCoords = typeof userLat === "number" && typeof userLng === "number" && !isNaN(userLat) && !isNaN(userLng);
  const distanceMeters = hasCoords
    ? calculateHaversineDistanceMeters(userLat, userLng, config.latitude, config.longitude)
    : Infinity;

  // Super Admin: always authorized from any location
  if (isSuperAdmin) {
    return {
      authorized: true,
      role,
      distanceMeters: isFinite(distanceMeters) ? distanceMeters : 0,
      allowedRadiusMeters: config.allowedRadiusMeters,
      accuracyMeters: typeof accuracy === "number" ? accuracy : undefined,
      isSuperAdminBypass: true,
      isAccuracyPoor: false,
      status: "super_admin_bypass",
      userMessage: undefined,
    };
  }

  // Admin / Lead Manager require valid coordinates
  if (!hasCoords) {
    return {
      authorized: false,
      role,
      distanceMeters: Infinity,
      allowedRadiusMeters: config.allowedRadiusMeters,
      accuracyMeters: undefined,
      isSuperAdminBypass: false,
      isAccuracyPoor: false,
      status: "missing_coordinates",
      userMessage: "Location access is required to access the CRM from your current account. Please enable location permission and try again.",
    };
  }

  // Check accuracy threshold
  const isAccuracyPoor = typeof accuracy === "number" && accuracy > config.maxAllowedAccuracyMeters;
  if (isAccuracyPoor) {
    return {
      authorized: false,
      role,
      distanceMeters,
      allowedRadiusMeters: config.allowedRadiusMeters,
      accuracyMeters: accuracy,
      isSuperAdminBypass: false,
      isAccuracyPoor: true,
      status: "poor_accuracy",
      userMessage: "Location accuracy is insufficient. Please enable high accuracy / GPS on your device and try again.",
    };
  }

  // Check permitted radius (100m by default)
  const isWithinRadius = distanceMeters <= config.allowedRadiusMeters;

  if (isWithinRadius) {
    return {
      authorized: true,
      role,
      distanceMeters,
      allowedRadiusMeters: config.allowedRadiusMeters,
      accuracyMeters: typeof accuracy === "number" ? accuracy : undefined,
      isSuperAdminBypass: false,
      isAccuracyPoor: false,
      status: "authorized",
      userMessage: undefined,
    };
  }

  return {
    authorized: false,
    role,
    distanceMeters,
    allowedRadiusMeters: config.allowedRadiusMeters,
    accuracyMeters: typeof accuracy === "number" ? accuracy : undefined,
    isSuperAdminBypass: false,
    isAccuracyPoor: false,
    status: "out_of_bounds",
    userMessage: "CRM access is not available at your current location. Please move within the permitted office location to continue.",
  };
}
