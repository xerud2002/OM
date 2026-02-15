// utils/requestHelpers.ts
// Shared helpers for request creation (used by both client & server code)

/**
 * Validate a Romanian phone number.
 * Accepts: 07xx xxx xxx, +407xx xxx xxx, or 00407xx xxx xxx.
 * Must have exactly 10 digits (after stripping country prefix).
 */
export function isValidRoPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  // Strip +40 or 0040 prefix to normalize
  const normalized = cleaned.replace(/^(\+40|0040)/, "0");
  return /^07\d{8}$/.test(normalized);
}

/**
 * Build full address string from components.
 * Pure function — no Firebase dependency.
 */
export function buildAddressString(
  street?: string,
  number?: string,
  type?: "house" | "flat",
  bloc?: string,
  staircase?: string,
  apartment?: string,
): string {
  const parts = [street, number];
  if (type === "flat") {
    if (bloc) parts.push(`Bl. ${bloc}`);
    if (staircase) parts.push(`Sc. ${staircase}`);
    if (apartment) parts.push(`Ap. ${apartment}`);
  }
  return parts.filter(Boolean).join(", ");
}
