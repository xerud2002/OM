// components/admin/ExportButton.tsx
// Export data as CSV or JSON

import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface ExportButtonProps {
  data: Record<string, any>[];
  filename?: string;
  columns?: { key: string; label: string }[];
  label?: string;
}

function toCSV(
  data: Record<string, any>[],
  columns?: { key: string; label: string }[]
): string {
  if (data.length === 0) return "";

  const cols = columns || Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  const header = cols.map((c) => `"${c.label}"`).join(",");
  const rows = data.map((row) =>
    cols
      .map((c) => {
        const val = row[c.key];
        if (val == null) return '""';
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  return [header, ...rows].join("\n");
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob(["\ufeff" + content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButton({
  data,
  filename = "export",
  columns,
  label = "Export",
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const exportCSV = () => {
    const csv = toCSV(data, columns);
    download(csv, `${filename}.csv`, "text/csv");
    setOpen(false);
  };

  const exportJSON = () => {
    download(JSON.stringify(data, null, 2), `${filename}.json`, "application/json");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        {label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={exportCSV}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={exportJSON}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Export JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
