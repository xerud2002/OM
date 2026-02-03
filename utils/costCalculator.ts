
// Basic cost calculator for requests
// In the future, this can pull from Firestore meta/pricing

export const DEFAULT_COST = 50;

// Hardcoded for now, can be moved to Firestore later
const CITY_COSTS: Record<string, number> = {
  "București": 50,
  "Cluj-Napoca": 50,
  "Timișoara": 45,
  "Iași": 45,
  "Constanța": 45,
  "Brașov": 45,
  // Add more major cities as needed
};

const COUNTY_COSTS: Record<string, number> = {
  "Ilfov": 50,
  "Cluj": 50,
  "Timiș": 45,
  "Iași": 45,
  "Constanța": 45,
  "Brașov": 45,
};

export function calculateRequestCost(request: any): number {
  if (!request) return DEFAULT_COST;

  // 1. Check City
  if (request.fromCity && CITY_COSTS[request.fromCity]) {
    return CITY_COSTS[request.fromCity];
  }

  // 2. Check County
  if (request.fromCounty && COUNTY_COSTS[request.fromCounty]) {
    return COUNTY_COSTS[request.fromCounty];
  }

  // 3. Default
  return DEFAULT_COST;
}
