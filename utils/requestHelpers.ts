// utils/requestHelpers.ts
// Shared helpers for request creation (used by both client & server code)

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
