// Global date formatting helpers for RO locale
// Default format: dd-MM-yyyy (zz-ll-an)
export function formatDateRO(
  input:
    | Date
    | string
    | number
    | { seconds: number; nanoseconds?: number; toDate?: () => Date }
    | null
    | undefined,
  options?: {
    separator?: string;
    fallback?: string;
    month?: "2-digit" | "short";
    noYear?: boolean;
    shortYear?: boolean;
  },
): string {
  const sep = options?.separator ?? "-";
  const fallback = options?.fallback ?? "-";
  const monthStyle = options?.month ?? "2-digit";
  const noYear = options?.noYear ?? false;
  const shortYear = options?.shortYear ?? false;
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
        shortYear,
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
        const yr = shortYear ? y.slice(-2) : y;
        return noYear
          ? `${dd}${sep}${ro[monthIdx]}`
          : `${dd}${sep}${ro[monthIdx]}${sep}${yr}`;
      }
      const yr = shortYear ? y.slice(-2) : y;
      return noYear ? `${dd}${sep}${mm}` : `${dd}${sep}${mm}${sep}${yr}`;
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
    const yr = shortYear ? String(yyyy).slice(-2) : String(yyyy);
    return noYear
      ? `${dd}${sep}${ro[monthIndex]}`
      : `${dd}${sep}${ro[monthIndex]}${sep}${yr}`;
  }
  const yr = shortYear ? String(yyyy).slice(-2) : String(yyyy);
  return noYear ? `${dd}${sep}${mm}` : `${dd}${sep}${mm}${sep}${yr}`;
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
    noYear?: boolean;
    shortYear?: boolean;
  },
): string {
  const sep = opts?.separator ?? "-";
  const month = opts?.month ?? "short";
  const rangeSep = opts?.rangeSep ?? " – "; // en dash with spaces
  const fallback = opts?.fallback ?? "-";
  const noYear = opts?.noYear ?? false;
  const shortYear = opts?.shortYear ?? false;

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

  // Flexible -> show explicit start/end if available, else compute from flex days
  if (mode === "flexible" && start) {
    try {
      const base = new Date(start);
      if (!isNaN(base.getTime())) {
        // If explicit end date is stored, use start–end range
        if (end) {
          const endD = new Date(end);
          if (!isNaN(endD.getTime())) {
            return (
              formatDateRO(base, { separator: sep, month, noYear, shortYear }) +
              rangeSep +
              formatDateRO(endD, { separator: sep, month, noYear, shortYear })
            );
          }
        }
        const f = typeof flex === "number" && flex > 0 ? flex : 0;
        if (f > 0) {
          const lo = addDays(base, -f);
          const hi = addDays(base, f);
          return (
            formatDateRO(lo, { separator: sep, month, noYear, shortYear }) +
            rangeSep +
            formatDateRO(hi, { separator: sep, month, noYear, shortYear })
          );
        }
        // if flex not provided, show the base date
        return formatDateRO(base, { separator: sep, month, noYear, shortYear });
      }
    } catch {}
  }

  // Explicit range
  if (mode === "range" && start && end) {
    return (
      formatDateRO(start, { separator: sep, month, noYear, shortYear }) +
      rangeSep +
      formatDateRO(end, { separator: sep, month, noYear, shortYear })
    );
  }

  // Exact or fallback single date
  if ((mode === "exact" && start) || r.moveDate) {
    const single = start || (r.moveDate as string | Date | undefined);
    return formatDateRO(single as Date | string | undefined, {
      separator: sep,
      month,
      noYear,
      shortYear,
    });
  }

  return fallback;
}

/**
 * Check if a request's move date is urgent (within N days from now).
 * For flexible/range modes, returns true if any part of the interval is within the threshold.
 */
export function isMoveDateUrgent(
  r: Record<string, unknown> | null | undefined,
  thresholdDays = 5,
): boolean {
  if (!r) return false;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + thresholdDays);

  const toDate = (v: unknown): Date | null => {
    if (!v) return null;
    const d = new Date(v as string | number);
    return isNaN(d.getTime()) ? null : d;
  };

  const mode = r.moveDateMode as string | undefined;
  const start = toDate(r.moveDateStart ?? r.moveDate);
  const end = toDate(r.moveDateEnd);
  const flex: number =
    typeof r.moveDateFlexDays === "number" && r.moveDateFlexDays > 0
      ? r.moveDateFlexDays
      : 0;

  if (mode === "flexible" && start) {
    // Use explicit end date if available, otherwise compute from flex days
    if (end) {
      return start <= cutoff && end >= now;
    }
    const lo = new Date(start);
    lo.setDate(lo.getDate() - flex);
    return lo <= cutoff && lo >= now;
  }

  if (mode === "range" && start) {
    // If the start of the range is within threshold
    const earliest = start;
    return earliest <= cutoff && (end ? end >= now : earliest >= now);
  }

  // Exact or legacy single date
  if (start) {
    return start >= now && start <= cutoff;
  }

  return false;
}
