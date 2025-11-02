/**
 * Utility functions for masking/anonymizing customer information
 * Used to protect customer privacy until company unlocks full details
 */

/**
 * Masks a full name to show only first initial and last name
 * Examples:
 *   "John Popescu" -> "J. Popescu"
 *   "Maria Elena Ionescu" -> "M. Ionescu"
 *   "Dan" -> "D."
 *   null/undefined -> "Client"
 */
export function maskName(fullName?: string | null): string {
  if (!fullName) return "Client";
  
  const trimmed = fullName.trim();
  if (!trimmed) return "Client";
  
  const parts = trimmed.split(/\s+/).filter(Boolean);
  
  if (parts.length === 0) return "Client";
  if (parts.length === 1) {
    // Only first name provided
    return `${parts[0][0].toUpperCase()}.`;
  }
  
  // Get first initial and last name
  const firstInitial = parts[0][0].toUpperCase();
  const lastName = parts[parts.length - 1];
  
  return `${firstInitial}. ${lastName}`;
}

/**
 * Masks an email address partially
 * Example: "john.doe@example.com" -> "j***@example.com"
 */
export function maskEmail(email?: string | null): string {
  if (!email) return "***";
  
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  
  const maskedLocal = local[0] + "***";
  return `${maskedLocal}@${domain}`;
}

/**
 * Masks a phone number partially
 * Example: "0712345678" -> "07***5678"
 */
export function maskPhone(phone?: string | null): string {
  if (!phone) return "***";
  
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 6) return "***";
  
  const start = cleaned.slice(0, 2);
  const end = cleaned.slice(-4);
  return `${start}***${end}`;
}
