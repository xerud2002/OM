// Centralized constants for OferteMutare.ro platform

/**
 * Platform Statistics and Metrics
 * Used across marketing pages and hero sections
 */
export const PLATFORM_STATS = {
  OFFERS_RANGE: "3-5",
  RESPONSE_TIME: "24h",
  AVERAGE_SAVINGS: "40%",
  COMPLETED_MOVES: "500+",
  VERIFIED_COMPANIES: "50+",
  RESPONSE_RATE: "100%",
  CUSTOMER_SATISFACTION: "4.8/5",
} as const;

/**
 * Pricing Ranges by Property Type (in RON)
 * Based on market research and average costs
 */
export const PRICING = {
  STUDIO_APARTMENT: { min: 400, max: 800, label: "Garsonieră" },
  TWO_THREE_ROOMS: { min: 800, max: 1800, label: "2-3 camere" },
  FOUR_PLUS_ROOMS: { min: 1800, max: 3000, label: "4+ camere" },
  HOUSE: { min: 2000, max: 5000, label: "Casă" },
  OFFICE: { min: 1500, max: 10000, label: "Birou" },
} as const;

/**
 * Service-specific pricing (in RON)
 */
export const SERVICE_PRICING = {
  PACKING_PROFESSIONAL: { min: 150, max: 500, label: "Împachetare profesională" },
  PACKING_MATERIALS: { min: 50, max: 300, label: "Materiale de împachetare" },
  FURNITURE_ASSEMBLY: { min: 100, max: 400, label: "Montaj/Demontaj mobilă" },
  STORAGE_PER_M3: { min: 80, max: 200, label: "Depozitare (lunar/m³)" },
  CLEAROUT: { min: 200, max: 1000, label: "Debarasare" },
  PIANO_MOVE: { min: 500, max: 1500, label: "Transport pian" },
} as const;

/**
 * Request Code Configuration
 */
export const REQUEST_CODE = {
  PREFIX: "REQ",
  BASELINE: 141000, // Starting number for sequential codes
  PADDING: 6, // Number of digits (e.g., REQ-141000)
} as const;

/**
 * Trial and Subscription Settings
 */
export const SUBSCRIPTION = {
  TRIAL_DAYS: 14,
  FREE_LEADS_PER_TRIAL: 5,
  LEAD_COST_RON: 10,
} as const;

/**
 * Time Constants
 */
export const TIME = {
  UPLOAD_TOKEN_EXPIRY_DAYS: 7,
  REMINDER_AFTER_DAYS: 3,
  RESPONSE_GUARANTEE_HOURS: 24,
} as const;

/**
 * Romanian Month Names
 */
export const ROMANIAN_MONTHS = {
  SHORT: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"],
  FULL: [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ],
} as const;

/**
 * Contact Information
 */
export const CONTACT = {
  EMAIL_CLIENTS: "info@ofertemutare.ro",
  EMAIL_PARTNERS: "info@ofertemutare.ro",
  SUPPORT_HOURS: "Luni-Vineri: 9:00-18:00",
} as const;

/**
 * Social Proof Messages
 */
export const SOCIAL_PROOF = {
  TRUST_BADGE_1: "Firme verificate cu CUI valid",
  TRUST_BADGE_2: "Recenzii reale de la clienți",
  TRUST_BADGE_3: "Prețuri transparente, fără ascunse",
  GUARANTEE: "Garanție satisfacție 100%",
} as const;

/**
 * SEO Default Values
 */
export const SEO_DEFAULTS = {
  SITE_NAME: "OferteMutare.ro",
  SITE_URL: "https://ofertemutare.ro",
  OG_IMAGE: "https://ofertemutare.ro/images/og-image.png",
  TWITTER_HANDLE: "@ofertemutare",
  DEFAULT_DESCRIPTION:
    "Compară oferte de la firme de mutări verificate din România. Primești 3-5 oferte în 24h. 100% gratuit, economii până la 40%.",
} as const;
