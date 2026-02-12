// utils/leadSource.ts
// Captures UTM parameters and referrer to identify lead source (ads vs organic)
// Stores in sessionStorage so it persists across pages within the same session

const STORAGE_KEY = "om_lead_source";

export interface LeadSource {
  utm_source?: string;   // e.g. "google", "facebook"
  utm_medium?: string;   // e.g. "cpc", "organic", "social"
  utm_campaign?: string; // e.g. "mutari_bucuresti_feb"
  utm_term?: string;     // search keyword (from Google Ads)
  utm_content?: string;  // ad variation identifier
  gclid?: string;        // Google Ads click ID
  fbclid?: string;       // Facebook Ads click ID
  referrer?: string;     // document.referrer at first landing
  landingPage?: string;  // first page URL visited
  channel: "google_ads" | "facebook_ads" | "organic" | "direct" | "referral" | "other";
  capturedAt: string;    // ISO timestamp
}

/**
 * Detect lead channel from UTM params and referrer
 */
function detectChannel(params: URLSearchParams, referrer: string): LeadSource["channel"] {
  // Google Ads: gclid or utm_source=google + utm_medium=cpc
  if (params.get("gclid")) return "google_ads";
  if (params.get("utm_source")?.toLowerCase() === "google" && params.get("utm_medium")?.toLowerCase() === "cpc") return "google_ads";

  // Facebook Ads: fbclid or utm_source=facebook + utm_medium=cpc/paid
  if (params.get("fbclid")) return "facebook_ads";
  if (params.get("utm_source")?.toLowerCase() === "facebook" && ["cpc", "paid", "paid_social"].includes(params.get("utm_medium")?.toLowerCase() || "")) return "facebook_ads";

  // Has UTM but not ads — could be organic social, email, etc.
  if (params.get("utm_source")) return "other";

  // No UTM — check referrer
  if (!referrer) return "direct";
  try {
    const ref = new URL(referrer);
    const host = ref.hostname.toLowerCase();
    if (host.includes("google.") || host.includes("bing.") || host.includes("yahoo.") || host.includes("duckduckgo.")) {
      return "organic";
    }
    if (host.includes("facebook.") || host.includes("instagram.") || host.includes("tiktok.") || host.includes("twitter.") || host.includes("t.co")) {
      return "other"; // organic social
    }
    return "referral";
  } catch {
    return "direct";
  }
}

/**
 * Capture UTM params from current URL on page load.
 * Should be called once on app mount. Only stores if not already captured in this session.
 */
export function captureLeadSource(): void {
  if (typeof window === "undefined") return;

  // Don't overwrite if already captured this session
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) return;

  const params = new URLSearchParams(window.location.search);
  const referrer = document.referrer || "";

  const source: LeadSource = {
    channel: detectChannel(params, referrer),
    capturedAt: new Date().toISOString(),
    landingPage: window.location.pathname,
  };

  // Copy UTM params if present
  const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) source[key] = val;
  }

  if (params.get("gclid")) source.gclid = params.get("gclid")!;
  if (params.get("fbclid")) source.fbclid = params.get("fbclid")!;
  if (referrer) source.referrer = referrer;

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
}

/**
 * Get the captured lead source for the current session.
 * Returns null if not captured yet.
 */
export function getLeadSource(): LeadSource | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as LeadSource;
  } catch {
    return null;
  }
}

/**
 * Human-readable label for admin display
 */
export function getChannelLabel(channel: LeadSource["channel"]): string {
  switch (channel) {
    case "google_ads": return "Google Ads";
    case "facebook_ads": return "Facebook Ads";
    case "organic": return "Organic (Search)";
    case "direct": return "Direct";
    case "referral": return "Referral";
    case "other": return "Altele";
  }
}

/**
 * Tailwind color classes for channel badges
 */
export function getChannelColor(channel: LeadSource["channel"]): string {
  switch (channel) {
    case "google_ads": return "bg-blue-100 text-blue-700";
    case "facebook_ads": return "bg-indigo-100 text-indigo-700";
    case "organic": return "bg-green-100 text-green-700";
    case "direct": return "bg-gray-100 text-gray-700";
    case "referral": return "bg-orange-100 text-orange-700";
    case "other": return "bg-purple-100 text-purple-700";
  }
}
