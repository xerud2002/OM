// Zone-based cost calculator for requests
// Pricing strategy:
// - Tier 1 (Big cities, high value): 50 credits
// - Tier 2 (Medium cities): 45 credits
// - Tier 3 (Small cities/zones): 30 credits (lower barrier for adoption)
//
// Future: Pull from Firestore meta/pricing for dynamic adjustments

export const DEFAULT_COST = 45;
export const TIER1_COST = 50; // Big cities
export const TIER2_COST = 45; // Medium cities
export const TIER3_COST = 30; // Small cities / new zones

// Tier 1: Major metropolitan areas with high job values (2,000-5,000+ RON)
const TIER1_CITIES = new Set([
  "București",
  "Cluj-Napoca",
  "Timișoara",
]);

// Tier 2: Large cities with good volume
const TIER2_CITIES = new Set([
  "Iași",
  "Constanța",
  "Brașov",
  "Sibiu",
  "Oradea",
  "Craiova",
  "Ploiești",
  "Galați",
  "Arad",
  "Pitești",
]);

// Tier 2 Counties (capital cities are Tier 2)
const TIER2_COUNTIES = new Set([
  "Ilfov", // București metropolitan
  "Cluj",
  "Timiș",
  "Iași",
  "Constanța",
  "Brașov",
  "Sibiu",
  "Bihor",
  "Dolj",
  "Prahova",
  "Galați",
  "Arad",
  "Argeș",
]);

// All other cities/counties default to Tier 3 (30 credits)
// This encourages companies to expand to underserved areas

/**
 * Calculate the cost (in credits) for a company to submit an offer
 * @param request - The moving request to price
 * @returns Number of credits required
 */
interface RequestForCost {
  adminCreditCost?: number;
  fromCity?: string;
  toCity?: string;
  fromCounty?: string;
  toCounty?: string;
}

export function calculateRequestCost(request: RequestForCost | null | undefined): number {
  if (!request) return DEFAULT_COST;

  // If admin has manually set a credit cost, always use that
  if (typeof request.adminCreditCost === "number" && request.adminCreditCost > 0) {
    return request.adminCreditCost;
  }

  const fromCity = request.fromCity?.trim() || "";
  const toCity = request.toCity?.trim() || "";
  const fromCounty = request.fromCounty?.trim() || "";
  const toCounty = request.toCounty?.trim() || "";

  // Check if either origin or destination is Tier 1
  if (TIER1_CITIES.has(fromCity) || TIER1_CITIES.has(toCity)) {
    return TIER1_COST;
  }

  // Check if either origin or destination is Tier 2
  if (
    TIER2_CITIES.has(fromCity) ||
    TIER2_CITIES.has(toCity) ||
    TIER2_COUNTIES.has(fromCounty) ||
    TIER2_COUNTIES.has(toCounty)
  ) {
    return TIER2_COST;
  }

  // All other areas: Tier 3 (lower cost to encourage adoption)
  return TIER3_COST;
}

/**
 * Get a human-readable pricing tier for display
 */
export function getPricingTier(request: RequestForCost | null | undefined): {
  tier: 1 | 2 | 3;
  cost: number;
  label: string;
} {
  const cost = calculateRequestCost(request);
  
  if (cost === TIER1_COST) {
    return { tier: 1, cost, label: "Zonă Premium" };
  }
  if (cost === TIER2_COST) {
    return { tier: 2, cost, label: "Zonă Standard" };
  }
  return { tier: 3, cost, label: "Zonă Nouă" };
}

/**
 * Check if a location is in an underserved area (Tier 3)
 * Useful for company acquisition messaging
 */
export function isUnderservedArea(city: string, county: string): boolean {
  if (!city && !county) return false;
  return (
    !TIER1_CITIES.has(city) &&
    !TIER2_CITIES.has(city) &&
    !TIER2_COUNTIES.has(county)
  );
}
