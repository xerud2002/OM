// components/customer/requestForm/DateContactSection.tsx
// Move date preferences and contact information

import React from "react";
import type { FormShape, MoveDateMode } from "./types";

type Props = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
};

const dateOptions: { value: MoveDateMode; label: string; desc: string }[] = [
  { value: "exact", label: "Dată exactă", desc: "Știu exact când mă mut" },
  { value: "range", label: "Interval", desc: "Am o perioadă în minte" },
  { value: "flexible", label: "Flexibil", desc: "Sunt deschis la sugestii" },
];

export default function DateContactSection({ form, setForm }: Props) {
  const moveDateMode = form.moveDateMode || "exact";

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  const roWeekdays = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
  const roMonths = [
    "ian",
    "feb",
    "mar",
    "apr",
    "mai",
    "iun",
    "iul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const formatWeekdayPreview = (ymd?: string) => {
    if (!ymd) return "";
    const d = new Date(`${ymd}T00:00:00`);
    return `${roWeekdays[d.getDay()]}, ${d.getDate()} ${roMonths[d.getMonth()]}`;
  };

  return (
    <div className="space-y-6">
      {/* Move Date Section */}
      <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">Data mutării</h4>
            <p className="text-xs text-gray-600">Când dorești să te muți?</p>
          </div>
        </div>

        {/* Date Mode Selection */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {dateOptions.map((opt) => {
            const isSelected = moveDateMode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((s) => ({ ...s, moveDateMode: opt.value }))}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-gray-200 bg-white hover:border-cyan-300"
                }`}
              >
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-300"
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <div>
                  <div
                    className={`text-sm font-medium ${isSelected ? "text-cyan-900" : "text-gray-900"}`}
                  >
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Date Inputs Based on Mode */}
        <div className="rounded-lg border border-cyan-100 bg-white p-4">
          {moveDateMode === "exact" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Data mutării <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                min={today}
                value={form.moveDateStart || ""}
                onChange={(e) => setForm((s) => ({ ...s, moveDateStart: e.target.value }))}
                className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
              />
              {form.moveDateStart && (
                <p className="mt-1 text-xs text-gray-500">
                  {formatWeekdayPreview(form.moveDateStart)}
                </p>
              )}
            </div>
          )}

          {moveDateMode === "range" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  De la <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={form.moveDateStart || ""}
                  onChange={(e) => setForm((s) => ({ ...s, moveDateStart: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
                {form.moveDateStart && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formatWeekdayPreview(form.moveDateStart)}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Până la <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={form.moveDateStart || today}
                  value={form.moveDateEnd || ""}
                  onChange={(e) => setForm((s) => ({ ...s, moveDateEnd: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
                {form.moveDateEnd && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formatWeekdayPreview(form.moveDateEnd)}
                  </p>
                )}
              </div>
            </div>
          )}

          {moveDateMode === "flexible" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Aproximativ de la <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={form.moveDateStart || ""}
                  onChange={(e) => setForm((s) => ({ ...s, moveDateStart: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
                {form.moveDateStart && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formatWeekdayPreview(form.moveDateStart)}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Flexibilitate (zile)
                </label>
                <select
                  value={form.moveDateFlexDays || 7}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, moveDateFlexDays: Number(e.target.value) }))
                  }
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                >
                  <option value={3}>± 3 zile</option>
                  <option value={7}>± 7 zile</option>
                  <option value={14}>± 14 zile</option>
                  <option value={30}>± 30 zile</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">Date de contact</h4>
            <p className="text-xs text-gray-600">Pentru a fi contactat de firme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Prenume <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.contactFirstName || ""}
              onChange={(e) => setForm((s) => ({ ...s, contactFirstName: e.target.value }))}
              placeholder="Prenumele tău"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Nume <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.contactLastName || ""}
              onChange={(e) => setForm((s) => ({ ...s, contactLastName: e.target.value }))}
              placeholder="Numele tău"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Telefon <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              value={form.phone || ""}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="07xxxxxxxx"
              pattern="^(07[0-9]{8}|\+407[0-9]{8})$"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Format: 07xxxxxxxx sau +407xxxxxxxx</p>
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-900">Detalii suplimentare</h4>
            <p className="text-xs text-gray-600">Informații utile pentru firme (opțional)</p>
          </div>
        </div>

        <textarea
          value={form.details || ""}
          onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
          rows={4}
          placeholder="Ex: Am un pian mare, canapea extensibilă de 3 locuri, 10 cutii cu cărți..."
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
        />
      </div>
    </div>
  );
}
