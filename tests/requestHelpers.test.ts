import { describe, it, expect } from "vitest";
import { buildAddressString } from "@/utils/requestHelpers";

describe("buildAddressString", () => {
  it("returns street and number for house type", () => {
    expect(buildAddressString("Str. Florilor", "12", "house")).toBe(
      "Str. Florilor, 12",
    );
  });

  it("includes bloc, staircase, apartment for flat type", () => {
    expect(
      buildAddressString("Str. Florilor", "12", "flat", "A", "1", "23"),
    ).toBe("Str. Florilor, 12, Bl. A, Sc. 1, Ap. 23");
  });

  it("omits empty parts", () => {
    expect(buildAddressString("Str. Florilor", "12", "flat", "", "", "5")).toBe(
      "Str. Florilor, 12, Ap. 5",
    );
  });

  it("returns empty string when no args", () => {
    expect(buildAddressString()).toBe("");
  });

  it("handles undefined number gracefully", () => {
    expect(buildAddressString("Str. Florilor")).toBe("Str. Florilor");
  });

  it("ignores bloc/staircase/apartment for house type", () => {
    expect(
      buildAddressString("Str. Florilor", "12", "house", "A", "1", "23"),
    ).toBe("Str. Florilor, 12");
  });
});
