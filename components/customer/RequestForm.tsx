import React from "react";
import { DayPicker } from "react-day-picker";
import { ro } from "date-fns/locale";
import counties from "@/counties";
import cities from "@/cities";

type FormShape = {
  fromCounty?: string;
  fromCity?: string;
  fromCityManual?: boolean;
  fromAddress?: string;
  toCounty?: string;
  toCity?: string;
  toCityManual?: boolean;
  toAddress?: string;
  moveDate?: string;
  fromType?: "house" | "flat";
  fromFloor?: string;
  fromElevator?: boolean;
  toType?: "house" | "flat";
  toFloor?: string;
  toElevator?: boolean;
  rooms?: string | number;
  phone?: string;
  details?: string;
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
  surveyType?: "in-person" | "video" | "quick-estimate";
  mediaUpload?: "now" | "later";
  mediaFiles?: File[];
  // Enhanced date fields
  moveDateMode?: "exact" | "range" | "none" | "flexible";
  moveDateStart?: string;
  moveDateEnd?: string;
  moveDateFlexDays?: number;
  contactName?: string;
};

type Props = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
  onSubmit: React.FormEventHandler;
  onReset: () => void;
};

export default function RequestForm({ form, setForm, onSubmit, onReset }: Props) {
  const countyCities = (county?: string) =>
    county && (cities as any)[county] ? (cities as any)[county] : [];

  // Date helpers
  const today = React.useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);
  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const parseYMD = (s?: string) => {
    if (!s) return undefined as unknown as Date | undefined;
    const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
    if (!y || !m || !d) return undefined as unknown as Date | undefined;
    return new Date(y, m - 1, d);
  };

  // Media upload helpers
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleAddFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles = Array.from(list);
    setForm((s) => ({
      ...s,
      mediaFiles: [...(s.mediaFiles || []), ...newFiles],
    }));
  };
  const handleRemoveFile = (idx: number) => {
    setForm((s) => ({
      ...s,
      mediaFiles: (s.mediaFiles || []).filter((_, i) => i !== idx),
    }));
  };
  const handleClearFiles = () => {
    setForm((s) => ({ ...s, mediaFiles: [] }));
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 p-4 shadow-lg sm:p-6">
      <div className="mb-6 flex items-center gap-3 border-b border-emerald-100 pb-4">
        <svg
          className="h-6 w-6 text-emerald-600"
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
        <h3 className="text-xl font-bold text-gray-800">Cerere nouă de mutare</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Pickup Location */}
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Punct de plecare</h4>
              <p className="text-xs text-gray-600">Detalii despre locația actuală</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Județ</label>
              <select
                required
                value={form.fromCounty || ""}
                onChange={(e) =>
                  setForm((s) => ({ ...s, fromCounty: e.target.value, fromCity: "" }))
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Selectează județ</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Localitate</label>
              <select
                required
                value={form.fromCity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((s) => ({
                    ...s,
                    fromCity: value,
                    fromCityManual: value === "__other__",
                  }));
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                disabled={!form.fromCounty}
              >
                <option value="">Selectează localitatea</option>
                {countyCities(form.fromCounty).map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value="__other__">Altă localitate</option>
              </select>
              {form.fromCityManual && (
                <input
                  required
                  value={form.fromCity === "__other__" ? "" : form.fromCity || ""}
                  onChange={(e) => setForm((s) => ({ ...s, fromCity: e.target.value }))}
                  placeholder="Introdu localitatea"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Adresă completă</label>
            <input
              required
              value={form.fromAddress || ""}
              onChange={(e) => setForm((s) => ({ ...s, fromAddress: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Stradă, număr, bloc/scară/apartament"
            />
          </div>
          <div className="mt-4 rounded-lg border border-emerald-100 bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-8 4h10M7 8h10"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold text-emerald-900">Detalii proprietate</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Tip proprietate
                </label>
                <select
                  value={form.fromType || "house"}
                  onChange={(e) => setForm((s) => ({ ...s, fromType: e.target.value as any }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="house">Casă</option>
                  <option value="flat">Apartament</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Număr camere</label>
                <input
                  type="text"
                  value={form.rooms || ""}
                  onChange={(e) => setForm((s) => ({ ...s, rooms: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="ex: 2"
                />
              </div>
              {form.fromType === "flat" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Etaj</label>
                    <input
                      placeholder="ex: 3"
                      value={form.fromFloor || ""}
                      onChange={(e) => setForm((s) => ({ ...s, fromFloor: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex h-[42px] items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!form.fromElevator}
                        onChange={(e) => setForm((s) => ({ ...s, fromElevator: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Lift
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-lg">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Destinație</h4>
              <p className="text-xs text-gray-600">Unde te muți</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Județ</label>
              <select
                required
                value={form.toCounty || ""}
                onChange={(e) => setForm((s) => ({ ...s, toCounty: e.target.value, toCity: "" }))}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">Selectează județ</option>
                {counties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Localitate</label>
              <select
                required
                value={form.toCity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((s) => ({ ...s, toCity: value, toCityManual: value === "__other__" }));
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                disabled={!form.toCounty}
              >
                <option value="">Selectează localitatea</option>
                {countyCities(form.toCounty).map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value="__other__">Altă localitate</option>
              </select>
              {form.toCityManual && (
                <input
                  required
                  value={form.toCity === "__other__" ? "" : form.toCity || ""}
                  onChange={(e) => setForm((s) => ({ ...s, toCity: e.target.value }))}
                  placeholder="Introdu localitatea"
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                />
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Adresă completă</label>
            <input
              required
              value={form.toAddress || ""}
              onChange={(e) => setForm((s) => ({ ...s, toAddress: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              placeholder="Stradă, număr, bloc/scară/apartament"
            />
          </div>
          <div className="mt-4 rounded-lg border border-sky-100 bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-100">
                <svg
                  className="h-4 w-4 text-sky-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-8 4h10M7 8h10"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold text-sky-900">Detalii proprietate</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Tip proprietate
                </label>
                <select
                  value={form.toType || "house"}
                  onChange={(e) => setForm((s) => ({ ...s, toType: e.target.value as any }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="house">Casă</option>
                  <option value="flat">Apartament</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Număr camere</label>
                <input
                  type="text"
                  value={form.rooms || ""}
                  onChange={(e) => setForm((s) => ({ ...s, rooms: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  placeholder="ex: 2"
                />
              </div>
              {form.toType === "flat" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Etaj</label>
                    <input
                      placeholder="ex: 3"
                      value={form.toFloor || ""}
                      onChange={(e) => setForm((s) => ({ ...s, toFloor: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex h-[42px] items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={!!form.toElevator}
                        onChange={(e) => setForm((s) => ({ ...s, toElevator: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Lift
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Servicii căutate</h4>
              <p className="text-xs text-gray-600">Selectează serviciile de care ai nevoie</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* Mutare */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-purple-200 bg-white transition-all duration-200 hover:border-purple-400 hover:shadow-lg has-[:checked]:border-purple-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-purple-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="checkbox"
                checked={!!form.serviceMoving}
                onChange={(e) => setForm((s) => ({ ...s, serviceMoving: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200 peer-checked:bg-purple-500">
                  <svg
                    className="h-6 w-6 text-purple-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h5 className="mb-1 font-semibold text-gray-900">Mutare</h5>
                <p className="text-xs text-gray-600">Transport și manipulare obiecte</p>
              </div>
              <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-purple-500 peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            {/* Împachetare */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-purple-200 bg-white transition-all duration-200 hover:border-purple-400 hover:shadow-lg has-[:checked]:border-purple-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-purple-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="checkbox"
                checked={!!form.servicePacking}
                onChange={(e) => setForm((s) => ({ ...s, servicePacking: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200 peer-checked:bg-purple-500">
                  <svg
                    className="h-6 w-6 text-purple-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h5 className="mb-1 font-semibold text-gray-900">Împachetare</h5>
                <p className="text-xs text-gray-600">Materiale și ambalare profesională</p>
              </div>
              <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-purple-500 peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            {/* Demontare */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-purple-200 bg-white transition-all duration-200 hover:border-purple-400 hover:shadow-lg has-[:checked]:border-purple-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-purple-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="checkbox"
                checked={!!form.serviceDisassembly}
                onChange={(e) => setForm((s) => ({ ...s, serviceDisassembly: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200 peer-checked:bg-purple-500">
                  <svg
                    className="h-6 w-6 text-purple-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h5 className="mb-1 font-semibold text-gray-900">Demontare</h5>
                <p className="text-xs text-gray-600">Demontare mobilier și recondiționare</p>
              </div>
              <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-purple-500 peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            {/* Debarasare */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-purple-200 bg-white transition-all duration-200 hover:border-purple-400 hover:shadow-lg has-[:checked]:border-purple-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-purple-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="checkbox"
                checked={!!form.serviceCleanout}
                onChange={(e) => setForm((s) => ({ ...s, serviceCleanout: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200 peer-checked:bg-purple-500">
                  <svg
                    className="h-6 w-6 text-purple-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h5 className="mb-1 font-semibold text-gray-900">Debarasare</h5>
                <p className="text-xs text-gray-600">Eliminare obiecte vechi nedorite</p>
              </div>
              <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-purple-500 peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            {/* Depozitare */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-purple-200 bg-white transition-all duration-200 hover:border-purple-400 hover:shadow-lg has-[:checked]:border-purple-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-purple-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="checkbox"
                checked={!!form.serviceStorage}
                onChange={(e) => setForm((s) => ({ ...s, serviceStorage: e.target.checked }))}
                className="peer sr-only"
              />
              <div className="p-4">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200 peer-checked:bg-purple-500">
                  <svg
                    className="h-6 w-6 text-purple-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h5 className="mb-1 font-semibold text-gray-900">Depozitare</h5>
                <p className="text-xs text-gray-600">Spațiu depozitare temporară/permanentă</p>
              </div>
              <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-purple-500 peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
          </div>
        </div>

        {/* Survey */}
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Survey și estimare</h4>
              <p className="text-xs text-gray-600">Alege modalitatea de evaluare</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* In-person */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-amber-200 bg-white transition-all duration-200 hover:border-amber-400 hover:shadow-lg has-[:checked]:border-amber-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-amber-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="radio"
                name="surveyType"
                value="in-person"
                checked={form.surveyType === "in-person"}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    surveyType: e.target.value as "in-person" | "video" | "quick-estimate",
                  }))
                }
                className="peer sr-only"
              />
              <div className="p-5">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200 peer-checked:bg-amber-500">
                  <svg
                    className="h-7 w-7 text-amber-600 transition-colors peer-checked:text-white"
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
                <h5 className="mb-2 font-bold text-gray-900">Survey la fața locului</h5>
                <p className="text-sm leading-relaxed text-gray-600">
                  Un reprezentant va veni să evalueze bunurile
                </p>
              </div>
              <div className="absolute right-4 top-4 hidden h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-lg peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            {/* Video */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-amber-200 bg-white transition-all duration-200 hover:border-amber-400 hover:shadow-lg has-[:checked]:border-amber-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-amber-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="radio"
                name="surveyType"
                value="video"
                checked={form.surveyType === "video"}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    surveyType: e.target.value as "in-person" | "video" | "quick-estimate",
                  }))
                }
                className="peer sr-only"
              />
              <div className="p-5">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200 peer-checked:bg-amber-500">
                  <svg
                    className="h-7 w-7 text-amber-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h5 className="mb-2 font-bold text-gray-900">Survey video</h5>
                <p className="text-sm leading-relaxed text-gray-600">Evaluare online rapidă</p>
              </div>
              <div className="absolute right-4 top-4 hidden h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-lg peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            {/* Quick estimate */}
            <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-amber-200 bg-white transition-all duration-200 hover:border-amber-400 hover:shadow-lg has-[:checked]:border-amber-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-amber-50 has-[:checked]:to-white has-[:checked]:shadow-md">
              <input
                type="radio"
                name="surveyType"
                value="quick-estimate"
                checked={form.surveyType === "quick-estimate"}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    surveyType: e.target.value as "in-person" | "video" | "quick-estimate",
                  }))
                }
                className="peer sr-only"
              />
              <div className="p-5">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200 peer-checked:bg-amber-500">
                  <svg
                    className="h-7 w-7 text-amber-600 transition-colors peer-checked:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h5 className="mb-2 font-bold text-gray-900">Estimare rapidă</h5>
                <p className="text-sm leading-relaxed text-gray-600">
                  Ofertă estimativă pe baza informațiilor
                </p>
              </div>
              <div className="absolute right-4 top-4 hidden h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-lg peer-checked:flex">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
          </div>
        </div>

        {/* Media (cards) */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">Poze și video</h4>
              <p className="text-xs text-gray-600">Alege cum vrei să trimiți media</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Upload now */}
              <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-blue-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-lg has-[:checked]:border-blue-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-blue-50 has-[:checked]:to-white has-[:checked]:shadow-md">
                <input
                  type="radio"
                  name="mediaUpload"
                  value="now"
                  checked={form.mediaUpload === "now"}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, mediaUpload: e.target.value as "now" | "later" }))
                  }
                  className="peer sr-only"
                />
                <div className="p-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200 peer-checked:bg-blue-500">
                    <svg
                      className="h-6 w-6 text-blue-600 transition-colors peer-checked:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h5 className="mb-1 font-semibold text-gray-900">Upload acum</h5>
                  <p className="text-xs text-gray-600">Încarcă fotografii/video imediat</p>
                </div>
                <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-blue-500 peer-checked:flex">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
              {/* Upload later */}
              <label className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-blue-200 bg-white transition-all duration-200 hover:border-blue-400 hover:shadow-lg has-[:checked]:border-blue-500 has-[:checked]:bg-gradient-to-br has-[:checked]:from-blue-50 has-[:checked]:to-white has-[:checked]:shadow-md">
                <input
                  type="radio"
                  name="mediaUpload"
                  value="later"
                  checked={form.mediaUpload === "later"}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, mediaUpload: e.target.value as "now" | "later" }))
                  }
                  className="peer sr-only"
                />
                <div className="p-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200 peer-checked:bg-blue-500">
                    <svg
                      className="h-6 w-6 text-blue-600 transition-colors peer-checked:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h5 className="mb-1 font-semibold text-gray-900">Primesc link pe email</h5>
                  <p className="text-xs text-gray-600">Vei primi un link pentru upload ulterior</p>
                </div>
                <div className="absolute right-3 top-3 hidden h-6 w-6 items-center justify-center rounded-full bg-blue-500 peer-checked:flex">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
            </div>

            {form.mediaUpload === "now" && (
              <div className="rounded-lg border-2 border-dashed border-blue-300 bg-white p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    handleAddFiles(e.target.files);
                    // reset input so the same file can be selected again if removed
                    e.currentTarget.value = "";
                  }}
                  className="hidden"
                  id="mediaUploadInput"
                />
                <label htmlFor="mediaUploadInput" className="cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Click pentru a încărca fișiere
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Poze sau video (max 50MB per fișier)</p>
                </label>
                {form.mediaFiles && form.mediaFiles.length > 0 && (
                  <div className="mt-4 space-y-2 text-left">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-700">Fișiere selectate:</p>
                      <button
                        type="button"
                        onClick={handleClearFiles}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Șterge toate
                      </button>
                    </div>
                    {form.mediaFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        <div className="min-w-0 pr-3">
                          <p className="truncate text-xs font-medium text-gray-800">{file.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Șterge
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {form.mediaUpload === "later" && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">Vei primi un email cu link personalizat</p>
                    <p className="mt-1 text-xs text-blue-700">
                      După trimiterea cererii, vei primi un email cu un link securizat unde poți
                      încărca fotografii și video în următoarele 7 zile.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date & Contact */}
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
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
              <h4 className="text-base font-bold text-gray-900">Data mutării și contact</h4>
              <p className="text-xs text-gray-600">Alege data și introdu datele tale de contact</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Date picker section */}
            <div>
              <label className="mb-2 block text-center text-sm font-semibold text-gray-800">
                Când dorești să te muți?
              </label>
              {/* Mode selector */}
              {(() => {
                const dateModes = [
                  { key: "exact" as const, label: "Exactă" },
                  { key: "range" as const, label: "Interval" },
                  { key: "none" as const, label: "Nu știu încă" },
                  { key: "flexible" as const, label: "Flexibilă" },
                ];
                return (
                  <div className="mb-4 flex flex-wrap justify-center gap-2 rounded-lg border border-emerald-300 bg-white p-1 text-xs shadow-sm">
                    {dateModes.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setForm((s) => ({
                            ...s,
                            moveDateMode: key,
                            // Keep moveDate in sync for downstream filters/exports
                            ...(key === "none" ? { moveDate: "" } : {}),
                          }))
                        }
                        className={`rounded-md px-4 py-2 font-medium transition-all duration-200 ${
                          (form as any).moveDateMode === key ||
                          (!(form as any).moveDateMode && key === "exact")
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md"
                            : "text-gray-700 hover:bg-emerald-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                );
              })()}

              {/* Inputs per mode */}
              {((form as any).moveDateMode ?? "exact") === "exact" && (
                <div className="mx-auto max-w-md rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/30 p-5 shadow-xl">
                  <DayPicker
                    mode="single"
                    selected={parseYMD(form.moveDate)}
                    onSelect={(date) =>
                      setForm((s) => ({
                        ...s,
                        moveDate: date ? formatYMD(date) : "",
                        moveDateStart: date ? formatYMD(date) : "",
                        moveDateEnd: "",
                      }))
                    }
                    locale={ro}
                    fromDate={today}
                    weekStartsOn={1}
                    showOutsideDays
                    numberOfMonths={1}
                    className="rdp mx-auto"
                    classNames={{
                      months: "flex justify-center",
                      month: "w-full max-w-sm",
                      caption: "flex items-center justify-between mb-4 px-2",
                      caption_label: "text-sm sm:text-base font-bold text-gray-800",
                      nav: "flex items-center gap-2",
                      nav_button:
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300 bg-white text-emerald-700 transition-all hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-md",
                      nav_button_previous: "",
                      nav_button_next: "",
                      table: "w-full border-collapse mt-2",
                      head_row: "grid grid-cols-7 gap-1 mb-2",
                      head_cell:
                        "text-center text-[10px] sm:text-xs font-bold text-emerald-700 w-9 sm:w-10",
                      row: "grid grid-cols-7 gap-1 mb-1",
                      cell: "text-center",
                      day: "h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-xl text-xs sm:text-sm font-medium transition-all hover:bg-emerald-100 hover:shadow-md hover:scale-105",
                      day_selected:
                        "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold shadow-lg hover:from-emerald-700 hover:to-emerald-800",
                      day_today: "ring-2 ring-emerald-500 ring-offset-2 font-bold text-emerald-700",
                      day_outside: "text-gray-400 opacity-50",
                      day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
                    }}
                  />
                </div>
              )}

              {((form as any).moveDateMode ?? "exact") === "range" && (
                <div className="mx-auto max-w-5xl rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/30 p-5 shadow-xl">
                  <DayPicker
                    mode="range"
                    selected={{
                      from: parseYMD((form as any).moveDateStart),
                      to: parseYMD((form as any).moveDateEnd),
                    }}
                    onSelect={(range) =>
                      setForm((s: any) => ({
                        ...s,
                        moveDateStart: range?.from ? formatYMD(range.from) : "",
                        moveDateEnd: range?.to ? formatYMD(range.to) : "",
                        moveDate: range?.from ? formatYMD(range.from) : "",
                      }))
                    }
                    locale={ro}
                    fromDate={today}
                    weekStartsOn={1}
                    showOutsideDays
                    numberOfMonths={2}
                    className="rdp mx-auto"
                    classNames={{
                      months: "flex gap-6 justify-center flex-wrap",
                      month: "w-full max-w-sm",
                      caption: "flex items-center justify-between mb-4 px-2",
                      caption_label: "text-sm sm:text-base font-bold text-gray-800",
                      nav: "flex items-center gap-2",
                      nav_button:
                        "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300 bg-white text-emerald-700 transition-all hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-md",
                      table: "w-full border-collapse mt-2",
                      head_row: "grid grid-cols-7 gap-1 mb-2",
                      head_cell:
                        "text-center text-[10px] sm:text-xs font-bold text-emerald-700 w-9 sm:w-10",
                      row: "grid grid-cols-7 gap-1 mb-1",
                      cell: "text-center",
                      day: "h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-xl text-xs sm:text-sm font-medium transition-all hover:bg-emerald-100 hover:shadow-md hover:scale-105",
                      day_selected:
                        "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold shadow-lg hover:from-emerald-700 hover:to-emerald-800",
                      day_today: "ring-2 ring-emerald-500 ring-offset-2 font-bold text-emerald-700",
                      day_outside: "text-gray-400 opacity-50",
                      day_range_start:
                        "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold rounded-l-xl",
                      day_range_end:
                        "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold rounded-r-xl",
                      day_range_middle: "bg-emerald-200 text-emerald-900 rounded-none",
                    }}
                  />
                </div>
              )}

              {((form as any).moveDateMode ?? "exact") === "none" && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-emerald-900">
                      Nu ai data stabilită? Nu-i problemă! Poți continua fără a selecta o dată și
                      companiile îți vor oferi mai multe opțiuni.
                    </p>
                  </div>
                </div>
              )}

              {((form as any).moveDateMode ?? "exact") === "flexible" && (
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/30 p-5 shadow-xl">
                    <DayPicker
                      mode="single"
                      selected={parseYMD(form.moveDate)}
                      onSelect={(date) =>
                        setForm((s: any) => ({
                          ...s,
                          moveDate: date ? formatYMD(date) : "",
                          moveDateStart: date ? formatYMD(date) : "",
                        }))
                      }
                      locale={ro}
                      fromDate={today}
                      weekStartsOn={1}
                      showOutsideDays
                      numberOfMonths={1}
                      className="rdp mx-auto"
                      classNames={{
                        months: "flex justify-center",
                        month: "w-full max-w-sm",
                        caption: "flex items-center justify-between mb-4 px-2",
                        caption_label: "text-sm sm:text-base font-bold text-gray-800",
                        nav: "flex items-center gap-2",
                        nav_button:
                          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-300 bg-white text-emerald-700 transition-all hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-md",
                        table: "w-full border-collapse mt-2",
                        head_row: "grid grid-cols-7 gap-1 mb-2",
                        head_cell:
                          "text-center text-[10px] sm:text-xs font-bold text-emerald-700 w-9 sm:w-10",
                        row: "grid grid-cols-7 gap-1 mb-1",
                        cell: "text-center",
                        day: "h-9 w-9 sm:h-10 sm:w-10 grid place-items-center rounded-xl text-xs sm:text-sm font-medium transition-all hover:bg-emerald-100 hover:shadow-md hover:scale-105",
                        day_selected:
                          "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold shadow-lg hover:from-emerald-700 hover:to-emerald-800",
                        day_today:
                          "ring-2 ring-emerald-500 ring-offset-2 font-bold text-emerald-700",
                        day_outside: "text-gray-400 opacity-50",
                      }}
                    />
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-md">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Flexibilitate
                    </label>
                    <select
                      value={(form as any).moveDateFlexDays ?? 3}
                      onChange={(e) =>
                        setForm((s: any) => ({
                          ...s,
                          moveDateFlexDays: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value={3}>±3 zile</option>
                      <option value={7}>±7 zile</option>
                      <option value={14}>±14 zile</option>
                    </select>
                    <p className="mt-3 text-xs text-gray-600">
                      Selectează câte zile înainte sau după data aleasă ești disponibil/ă pentru
                      mutare.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact fields below calendar */}
            <div className="mx-auto max-w-5xl rounded-xl border border-emerald-200 bg-white p-5 shadow-md">
              <h5 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
                <svg
                  className="h-5 w-5 text-emerald-600"
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
                Datele tale de contact
              </h5>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Nume și prenume
                  </label>
                  <input
                    value={(form as any).contactName || ""}
                    onChange={(e) => setForm((s: any) => ({ ...s, contactName: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="Ex: Popescu Andrei"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-gray-700">
                    Număr de telefon
                  </label>
                  <input
                    value={form.phone || ""}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    placeholder="07xx xxx xxx"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Detalii suplimentare
          </label>
          <textarea
            value={form.details || ""}
            onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            rows={3}
            placeholder="Informații importante (acces, obiecte fragile, interval orar, etc.)"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Trimite cererea
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Resetează
          </button>
        </div>
      </form>
    </div>
  );
}
