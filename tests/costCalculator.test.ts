import { describe, it, expect } from "vitest";
import {
  calculateRequestCost,
  getPricingTier,
  isUnderservedArea,
  DEFAULT_COST,
  TIER1_COST,
  TIER2_COST,
  TIER3_COST,
} from "@/utils/costCalculator";

describe("calculateRequestCost", () => {
  it("returns DEFAULT_COST for null/undefined request", () => {
    expect(calculateRequestCost(null)).toBe(DEFAULT_COST);
    expect(calculateRequestCost(undefined)).toBe(DEFAULT_COST);
  });

  it("returns admin-set cost when adminCreditCost is positive", () => {
    expect(calculateRequestCost({ adminCreditCost: 100 })).toBe(100);
    expect(calculateRequestCost({ adminCreditCost: 1 })).toBe(1);
  });

  it("ignores adminCreditCost when zero or negative", () => {
    expect(calculateRequestCost({ adminCreditCost: 0, fromCity: "București" })).toBe(TIER1_COST);
    expect(calculateRequestCost({ adminCreditCost: -5, fromCity: "București" })).toBe(TIER1_COST);
  });

  it("returns TIER1_COST for Tier 1 origin cities", () => {
    expect(calculateRequestCost({ fromCity: "București" })).toBe(TIER1_COST);
    expect(calculateRequestCost({ fromCity: "Cluj-Napoca" })).toBe(TIER1_COST);
    expect(calculateRequestCost({ fromCity: "Timișoara" })).toBe(TIER1_COST);
  });

  it("returns TIER1_COST for Tier 1 destination cities", () => {
    expect(calculateRequestCost({ toCity: "București" })).toBe(TIER1_COST);
    expect(calculateRequestCost({ toCity: "Cluj-Napoca" })).toBe(TIER1_COST);
  });

  it("returns TIER2_COST for Tier 2 cities", () => {
    expect(calculateRequestCost({ fromCity: "Iași" })).toBe(TIER2_COST);
    expect(calculateRequestCost({ toCity: "Brașov" })).toBe(TIER2_COST);
    expect(calculateRequestCost({ fromCity: "Constanța" })).toBe(TIER2_COST);
    expect(calculateRequestCost({ toCity: "Sibiu" })).toBe(TIER2_COST);
  });

  it("returns TIER2_COST for Tier 2 counties", () => {
    expect(calculateRequestCost({ fromCounty: "Ilfov" })).toBe(TIER2_COST);
    expect(calculateRequestCost({ toCounty: "Cluj" })).toBe(TIER2_COST);
    expect(calculateRequestCost({ fromCounty: "Timiș" })).toBe(TIER2_COST);
  });

  it("returns TIER3_COST for unknown/small cities", () => {
    expect(calculateRequestCost({ fromCity: "Focșani", toCity: "Buzău" })).toBe(TIER3_COST);
    expect(calculateRequestCost({ fromCity: "Zalău" })).toBe(TIER3_COST);
  });

  it("Tier 1 takes priority over Tier 2", () => {
    expect(calculateRequestCost({ fromCity: "București", toCity: "Iași" })).toBe(TIER1_COST);
    expect(calculateRequestCost({ fromCity: "Brașov", toCity: "Timișoara" })).toBe(TIER1_COST);
  });

  it("trims whitespace in city/county names", () => {
    expect(calculateRequestCost({ fromCity: " București " })).toBe(TIER1_COST);
    expect(calculateRequestCost({ toCity: "  Iași  " })).toBe(TIER2_COST);
  });

  it("handles empty strings as Tier 3", () => {
    expect(calculateRequestCost({ fromCity: "", toCity: "" })).toBe(TIER3_COST);
    expect(calculateRequestCost({})).toBe(TIER3_COST);
  });
});

describe("getPricingTier", () => {
  it("returns tier 1 info for Tier 1 cities", () => {
    const result = getPricingTier({ fromCity: "București" });
    expect(result.tier).toBe(1);
    expect(result.cost).toBe(TIER1_COST);
    expect(result.label).toBe("Zonă Premium");
  });

  it("returns tier 2 info for Tier 2 cities", () => {
    const result = getPricingTier({ fromCity: "Iași" });
    expect(result.tier).toBe(2);
    expect(result.cost).toBe(TIER2_COST);
    expect(result.label).toBe("Zonă Standard");
  });

  it("returns tier 3 info for small cities", () => {
    const result = getPricingTier({ fromCity: "Zalău" });
    expect(result.tier).toBe(3);
    expect(result.cost).toBe(TIER3_COST);
    expect(result.label).toBe("Zonă Nouă");
  });
});

describe("isUnderservedArea", () => {
  it("returns false for empty inputs", () => {
    expect(isUnderservedArea("", "")).toBe(false);
  });

  it("returns false for Tier 1 cities", () => {
    expect(isUnderservedArea("București", "")).toBe(false);
    expect(isUnderservedArea("Cluj-Napoca", "")).toBe(false);
  });

  it("returns false for Tier 2 cities", () => {
    expect(isUnderservedArea("Iași", "")).toBe(false);
    expect(isUnderservedArea("Brașov", "")).toBe(false);
  });

  it("returns false for Tier 2 counties", () => {
    expect(isUnderservedArea("", "Ilfov")).toBe(false);
    expect(isUnderservedArea("SomeTown", "Cluj")).toBe(false);
  });

  it("returns true for Tier 3 areas", () => {
    expect(isUnderservedArea("Focșani", "Vrancea")).toBe(true);
    expect(isUnderservedArea("Zalău", "Sălaj")).toBe(true);
  });
});
