// utils/abTesting.ts
import { useState } from "react";

type Variant = "A" | "B";

/**
 * Simple A/B testing hook that randomly assigns users to variant A or B
 * and persists the choice in localStorage for consistency.
 * 
 * Usage:
 * const variant = useABTest("hero-headline");
 * return variant === "A" ? <HeadlineA /> : <HeadlineB />;
 */
export function useABTest(testName: string): Variant {
  const [variant] = useState<Variant>(() => {
    if (typeof window === "undefined") return "A";

    const storageKey = `ab_test_${testName}`;
    const stored = localStorage.getItem(storageKey);

    if (stored === "A" || stored === "B") {
      return stored;
    }

    // Randomly assign 50/50
    const newVariant: Variant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(storageKey, newVariant);
    return newVariant;
  });

  return variant;
}

/**
 * Track exposure event when a user sees a specific variant.
 */
export function trackExposure(testName: string, variantUsed: Variant) {
  if (typeof window === "undefined") return;
  if ((window as any).gtag) {
    (window as any).gtag("event", "ab_exposure", {
      test_name: testName,
      variant: variantUsed,
    });
  }
}

/**
 * Track conversion events for A/B tests.
 * Call this when a user completes a desired action (form submit, signup, etc.)
 */
export function trackConversion(testName: string, variantUsed: Variant, eventName: string = "conversion") {
  if (typeof window === "undefined") return;

  // Send to analytics (example for Google Analytics 4)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, {
      test_name: testName,
      variant: variantUsed,
    });
  }

  // Store conversion in localStorage for reporting
  const conversions = JSON.parse(localStorage.getItem("ab_conversions") || "[]");
  conversions.push({
    testName,
    variant: variantUsed,
    eventName,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("ab_conversions", JSON.stringify(conversions));
}

/**
 * Get A/B test results from localStorage (for admin dashboard)
 */
export function getABTestResults(): Record<string, { A: number; B: number }> {
  if (typeof window === "undefined") return {};

  const conversions = JSON.parse(localStorage.getItem("ab_conversions") || "[]");
  const results: Record<string, { A: number; B: number }> = {};

  conversions.forEach((conv: any) => {
    if (!results[conv.testName]) {
      results[conv.testName] = { A: 0, B: 0 };
    }
    results[conv.testName][conv.variant as Variant]++;
  });

  return results;
}
