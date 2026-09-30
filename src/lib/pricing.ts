// Single authoritative pricing definition for Quickupp AI Studio
// Used across client UI and validated on server for all PayPal transactions.

export type IndividualServiceId =
  | "ai-ugc"
  | "ai-cartoon"
  | "ai-avatar"
  | "hyper-realistic"
  | "digital-twin-video"
  | "digital-twin-setup";

export type PackageTierId =
  | "single-video"
  | "starter"
  | "growth"
  | "scale"
  | "pro"
  | "enterprise";

export type PackageServiceFormat =
  | "ai-ugc"
  | "ai-avatar"
  | "ai-cartoon"
  | "hyper-realistic"
  | "digital-twin";

export interface PricingServiceMeta {
  id: IndividualServiceId;
  name: string;
  price: number;
  formattedPrice: string;
  description: string;
  badge?: string;
}

export interface PackageTierMeta {
  id: PackageTierId;
  name: string;
  videos: number;
  delivery: string;
  badge?: string;
  popular?: boolean;
  prices: Record<PackageServiceFormat, number>;
}

export const INDIVIDUAL_PRICING: Record<IndividualServiceId, PricingServiceMeta> = {
  "ai-ugc": {
    id: "ai-ugc",
    name: "AI UGC Video Ads",
    price: 79,
    formattedPrice: "$79",
    description: "Authentic creator-style product review & demo reels",
  },
  "ai-avatar": {
    id: "ai-avatar",
    name: "AI Avatar Video Ads",
    price: 79,
    formattedPrice: "$79",
    description: "Professional presenter-style spokesperson reels",
  },
  "ai-cartoon": {
    id: "ai-cartoon",
    name: "AI Cartoon Video Ads",
    price: 79,
    formattedPrice: "$79",
    description: "Engaging 3D & 2D character animation storytelling",
  },
  "hyper-realistic": {
    id: "hyper-realistic",
    name: "AI Hyper-Realistic Video Ads",
    price: 149,
    formattedPrice: "$149",
    description: "Cinematic commercial-grade visual storytelling",
  },
  "digital-twin-video": {
    id: "digital-twin-video",
    name: "AI Digital Twin Video",
    price: 179,
    formattedPrice: "$179",
    description: "Recurring content with your custom AI twin & voice",
  },
  "digital-twin-setup": {
    id: "digital-twin-setup",
    name: "Digital Twin Setup",
    price: 499,
    formattedPrice: "$499",
    badge: "One-Time",
    description: "Full avatar model training, voice clone & speaking setup",
  },
};

export const PACKAGE_TIERS: Record<PackageTierId, PackageTierMeta> = {
  "single-video": {
    id: "single-video",
    name: "1 Video",
    videos: 1,
    delivery: "24 Hrs",
    prices: {
      "ai-ugc": 79,
      "ai-avatar": 79,
      "ai-cartoon": 79,
      "hyper-realistic": 149,
      "digital-twin": 179,
    },
  },
  starter: {
    id: "starter",
    name: "5 Videos",
    videos: 5,
    delivery: "72 Hrs",
    prices: {
      "ai-ugc": 359,
      "ai-avatar": 359,
      "ai-cartoon": 359,
      "hyper-realistic": 699,
      "digital-twin": 849,
    },
  },
  growth: {
    id: "growth",
    name: "10 Videos",
    videos: 10,
    delivery: "Within 7 Days",
    popular: true,
    badge: "Most Popular",
    prices: {
      "ai-ugc": 649,
      "ai-avatar": 649,
      "ai-cartoon": 649,
      "hyper-realistic": 1249,
      "digital-twin": 1499,
    },
  },
  scale: {
    id: "scale",
    name: "15 Videos",
    videos: 15,
    delivery: "Within 14 Days",
    badge: "High Growth",
    prices: {
      "ai-ugc": 899,
      "ai-avatar": 899,
      "ai-cartoon": 899,
      "hyper-realistic": 1699,
      "digital-twin": 2049,
    },
  },
  pro: {
    id: "pro",
    name: "30 Videos",
    videos: 30,
    delivery: "Within 20 Days",
    badge: "Best Value",
    prices: {
      "ai-ugc": 1549,
      "ai-avatar": 1549,
      "ai-cartoon": 1549,
      "hyper-realistic": 2949,
      "digital-twin": 3499,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "30+ Videos",
    videos: 30,
    delivery: "Custom Timeline",
    badge: "Maximum Scale",
    prices: {
      "ai-ugc": 1549,
      "ai-avatar": 1549,
      "ai-cartoon": 1549,
      "hyper-realistic": 2949,
      "digital-twin": 3499,
    },
  },
};

export const PACKAGE_SERVICE_LABELS: Record<PackageServiceFormat, string> = {
  "ai-ugc": "AI UGC",
  "ai-avatar": "AI Avatar",
  "ai-cartoon": "AI Cartoon",
  "hyper-realistic": "Hyper-Realistic",
  "digital-twin": "Digital Twin",
};

export interface ResolvedPurchaseItem {
  itemType: "individual" | "package" | "setup";
  itemId: string;
  itemName: string;
  tierId?: PackageTierId;
  format?: PackageServiceFormat;
  amount: number;
  amountFormatted: string;
  currency: "USD";
  delivery?: string;
  videosCount?: number;
}

/**
 * Server-authoritative price resolver.
 * Given purchase identifiers, returns validated price and descriptions.
 * Never trust client amounts.
 */
export function resolvePurchaseItem(params: {
  itemType: "individual" | "package" | "setup" | string;
  itemId?: string | undefined;
  tierId?: string | undefined;
  format?: string | undefined;
}): ResolvedPurchaseItem | null {
  const { itemType, itemId, tierId, format } = params;

  // 1. Digital Twin Setup (One-time)
  if (itemType === "setup" || itemId === "digital-twin-setup" || itemId === "setup") {
    return {
      itemType: "setup",
      itemId: "digital-twin-setup",
      itemName: "Digital Twin Setup (One-time)",
      amount: 499,
      amountFormatted: "$499.00 USD",
      currency: "USD",
      delivery: "Within 72 Hrs",
      videosCount: 1,
    };
  }

  // 2. Individual Services
  if (itemType === "individual") {
    const serviceKey = (itemId || "").toLowerCase().replace(/_/g, "-") as IndividualServiceId;
    const service = INDIVIDUAL_PRICING[serviceKey];
    if (service) {
      return {
        itemType: "individual",
        itemId: service.id,
        itemName: service.name,
        amount: service.price,
        amountFormatted: `$${service.price.toFixed(2)} USD`,
        currency: "USD",
        delivery: "48–72 Hrs",
        videosCount: 1,
      };
    }
  }

  // 3. Packages
  if (itemType === "package" || (tierId && format)) {
    const tierKey = (tierId || itemId || "single-video").toLowerCase().replace(/_/g, "-") as PackageTierId;
    const formatKey = (format || "ai-ugc").toLowerCase().replace(/_/g, "-") as PackageServiceFormat;

    const tier = PACKAGE_TIERS[tierKey];
    if (tier && tier.prices[formatKey] !== undefined) {
      const price = tier.prices[formatKey];
      const formatLabel = PACKAGE_SERVICE_LABELS[formatKey] || formatKey;
      return {
        itemType: "package",
        itemId: `${tier.id}_${formatKey}`,
        tierId: tier.id,
        format: formatKey,
        itemName: `${tier.name} — ${formatLabel} (${tier.videos} ${tier.videos === 1 ? "Video" : "Videos"})`,
        amount: price,
        amountFormatted: `$${price.toFixed(2)} USD`,
        currency: "USD",
        delivery: tier.delivery,
        videosCount: tier.videos,
      };
    }
  }

  // Fallback by service name matching (e.g. from individualPricingList or cards)
  if (itemId) {
    const normalized = itemId.toLowerCase().trim();
    if (normalized.includes("cartoon")) {
      return resolvePurchaseItem({ itemType: "individual", itemId: "ai-cartoon" });
    }
    if (normalized.includes("avatar")) {
      return resolvePurchaseItem({ itemType: "individual", itemId: "ai-avatar" });
    }
    if (normalized.includes("hyper")) {
      return resolvePurchaseItem({ itemType: "individual", itemId: "hyper-realistic" });
    }
    if (normalized.includes("setup")) {
      return resolvePurchaseItem({ itemType: "setup" });
    }
    if (normalized.includes("twin")) {
      return resolvePurchaseItem({ itemType: "individual", itemId: "digital-twin-video" });
    }
    if (normalized.includes("ugc")) {
      return resolvePurchaseItem({ itemType: "individual", itemId: "ai-ugc" });
    }
  }

  return null;
}
