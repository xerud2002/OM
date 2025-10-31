// Global date formatting helpers for RO locale
// Default format: dd-MM-yyyy (zz-ll-an)
export function formatDateRO(
  input: any,
  options?: { separator?: string; fallback?: string }
): string {
  const sep = options?.separator ?? "-";
  const fallback = options?.fallback ?? "-";
  if (!input) return fallback;

  // Firestore Timestamp
  try {
    if (typeof input === "object" && input && typeof input.toDate === "function") {
      return formatDateRO(input.toDate(), { separator: sep, fallback });
    }
  } catch {}

  let d: Date | null = null;
  if (input instanceof Date) d = input;
  else if (typeof input === "number") d = new Date(input);
  else if (typeof input === "string") {
    // Accept YYYY-MM-DD or ISO strings
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const [, y, mm, dd] = m;
      return `${dd}${sep}${mm}${sep}${y}`;
    }
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) d = parsed; // ISO
  }

  if (!d || isNaN(d.getTime())) return fallback;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}${sep}${mm}${sep}${yyyy}`;
}
