// Global date formatting helpers for RO locale
// Default format: dd-MM-yyyy (zz-ll-an)
export function formatDateRO(
  input: any,
  options?: { separator?: string; fallback?: string; month?: "2-digit" | "short" }
): string {
  const sep = options?.separator ?? "-";
  const fallback = options?.fallback ?? "-";
  const monthStyle = options?.month ?? "2-digit";
  if (!input) return fallback;

  // Firestore Timestamp
  try {
    if (typeof input === "object" && input && typeof input.toDate === "function") {
  return formatDateRO(input.toDate(), { separator: sep, fallback, month: monthStyle });
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
      if (monthStyle === "short") {
        const monthIdx = Math.max(1, Math.min(12, parseInt(mm, 10))) - 1;
        const ro = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"];
        return `${dd}${sep}${ro[monthIdx]}${sep}${y}`;
      }
      return `${dd}${sep}${mm}${sep}${y}`;
    }
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) d = parsed; // ISO
  }

  if (!d || isNaN(d.getTime())) return fallback;
  const dd = String(d.getDate()).padStart(2, "0");
  const monthIndex = d.getMonth();
  const mm = String(monthIndex + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (monthStyle === "short") {
    const ro = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Noi", "Dec"];
    return `${dd}${sep}${ro[monthIndex]}${sep}${yyyy}`;
  }
  return `${dd}${sep}${mm}${sep}${yyyy}`;
}
