// components/admin/DateRangeFilter.tsx
// Preset date range selector: Today, 7 days, 30 days, custom

import { useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export type DateRange = {
  from: Date;
  to: Date;
  label: string;
};

type Preset = "today" | "7d" | "30d" | "90d" | "all";

interface DateRangeFilterProps {
  value: Preset;
  onChange: (preset: Preset, range: DateRange) => void;
  className?: string;
}

const presets: { key: Preset; label: string; days: number | null }[] = [
  { key: "today", label: "Azi", days: 0 },
  { key: "7d", label: "7 zile", days: 7 },
  { key: "30d", label: "30 zile", days: 30 },
  { key: "90d", label: "90 zile", days: 90 },
  { key: "all", label: "Total", days: null },
];

function getRange(preset: Preset): DateRange {
  const now = new Date();
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const p = presets.find((pr) => pr.key === preset)!;

  if (p.days === null) {
    // All time — 2 years back
    return { from: new Date(2024, 0, 1), to, label: p.label };
  }

  const from = new Date(to);
  from.setDate(from.getDate() - (p.days || 0));
  from.setHours(0, 0, 0, 0);

  return { from, to, label: p.label };
}

export default function DateRangeFilter({
  value,
  onChange,
  className = "",
}: DateRangeFilterProps) {
  const [active, setActive] = useState<Preset>(value);

  const handleClick = (preset: Preset) => {
    setActive(preset);
    onChange(preset, getRange(preset));
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <CalendarDaysIcon className="mr-1 h-4 w-4 text-gray-400" />
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => handleClick(p.key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            active === p.key
              ? "bg-purple-100 text-purple-700"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export { getRange };
