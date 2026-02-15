// Global date formatting helpers for RO locale
// Default format: dd-MM-yyyy (zz-ll-an)
export function formatDateRO(
  input: Date | string | number | { seconds: number; nanoseconds?: number; toDate?: () => Date } | null | undefined,
  options?: {
    separator?: string;
    fallback?: string;
    month?: "2-digit" | "short";
  },
): string {
  const sep = options?.separator ?? "-";
  const fallback = options?.fallback ?? "-";
  const monthStyle = options?.month ?? "2-digit";
  if (!input) return fallback;

  // Firestore Timestamp
  try {
    if (
      typeof input === "object" &&
      input &&
      "toDate" in input &&
      typeof (input as { toDate: () => Date }).toDate === "function"
    ) {
      return formatDateRO((input as { toDate: () => Date }).toDate(), {
        separator: sep,
        fallback,
        month: monthStyle,
      });
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
        const ro = [
          "Ian",
          "Feb",
          "Mar",
          "Apr",
          "Mai",
          "Iun",
          "Iul",
          "Aug",
          "Sep",
          "Oct",
          "Noi",
          "Dec",
        ];
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
    const ro = [
      "Ian",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Iun",
      "Iul",
      "Aug",
      "Sep",
      "Oct",
      "Noi",
      "Dec",
    ];
    return `${dd}${sep}${ro[monthIndex]}${sep}${yyyy}`;
  }
  return `${dd}${sep}${mm}${sep}${yyyy}`;
}

// Display a human-friendly move date or interval based on stored fields
// Supports modes: exact, range, flexible, none; falls back to legacy moveDate
export function formatMoveDateDisplay(
  r: Record<string, unknown> | null | undefined,
  opts?: {
    separator?: string;
    month?: "2-digit" | "short";
    rangeSep?: string;
    fallback?: string;
  },
): string {
  const sep = opts?.separator ?? "-";
  const month = opts?.month ?? "short";
  const rangeSep = opts?.rangeSep ?? " – "; // en dash with spaces
  const fallback = opts?.fallback ?? "-";

  if (!r) return fallback;

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const mode: string | undefined = r.moveDateMode as string | undefined;
  const start = (r.moveDateStart ?? r.moveDate) as string | Date | undefined; // backward compat
  const end = r.moveDateEnd as string | Date | undefined;
  const flex: number | undefined =
    typeof r.moveDateFlexDays === "number" ? r.moveDateFlexDays : undefined;

  // Flexible -> compute derived interval around the anchor date
  if (mode === "flexible" && start) {
    try {
      const base = new Date(start);
      if (!isNaN(base.getTime())) {
        const f = typeof flex === "number" && flex > 0 ? flex : 0;
        if (f > 0) {
          const lo = addDays(base, -f);
          const hi = addDays(base, f);
          return (
            formatDateRO(lo, { separator: sep, month }) +
            rangeSep +
            formatDateRO(hi, { separator: sep, month })
          );
        }
        // if flex not provided, show the base date
        return formatDateRO(base, { separator: sep, month });
      }
    } catch {}
  }

  // Explicit range
  if (mode === "range" && start && end) {
    return (
      formatDateRO(start, { separator: sep, month }) +
      rangeSep +
      formatDateRO(end, { separator: sep, month })
    );
  }

  // Exact or fallback single date
  if ((mode === "exact" && start) || r.moveDate) {
    const single = start || (r.moveDate as string | Date | undefined);
    return formatDateRO(single as Date | string | undefined, { separator: sep, month });
  }

  return fallback;
}
