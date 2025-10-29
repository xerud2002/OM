import React from "react";
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
  // Services
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
};

export default function RequestForm({
  form,
  setForm,
  onSubmit,
  onReset,
}: {
  form: FormShape;
  setForm: (updater: (s: FormShape) => FormShape) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  const countyCities = (county?: string) =>
    county && (cities as any)[county] ? (cities as any)[county] : [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/30 p-6 shadow-lg">
      <div className="mb-6 flex items-center gap-3 border-b border-emerald-100 pb-4">
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800">Cerere nouă de mutare</h3>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Pickup Location */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-emerald-200 pb-2">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-sm font-semibold text-emerald-900">Punct de plecare</h4>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Județ</label>
              <select
                required
                value={form.fromCounty || ""}
                onChange={(e) => setForm((s) => ({ ...s, fromCounty: e.target.value, fromCity: "" }))}
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
                    fromCityManual: value === "__other__"
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
          
          {/* Property Details - Pickup */}
          <div className="mt-4 space-y-3 rounded-lg border border-emerald-100 bg-white p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Tip proprietate</label>
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
            </div>
            {form.fromType === "flat" && (
              <div className="grid grid-cols-2 gap-3">
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
              </div>
            )}
          </div>
        </div>

        {/* Destination Location */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-sky-200 pb-2">
            <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h4 className="text-sm font-semibold text-sky-900">Destinație</h4>
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
                  setForm((s) => ({ 
                    ...s, 
                    toCity: value,
                    toCityManual: value === "__other__"
                  }));
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

          {/* Property Details - Destination */}
          <div className="mt-4 space-y-3 rounded-lg border border-sky-100 bg-white p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Tip proprietate</label>
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
            </div>
            {form.toType === "flat" && (
              <div className="grid grid-cols-2 gap-3">
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
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-purple-200 pb-2">
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h4 className="text-sm font-semibold text-purple-900">Servicii căutate</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white p-3 text-sm text-gray-700 transition hover:border-purple-300 hover:bg-purple-50/30">
              <input
                type="checkbox"
                checked={!!form.serviceMoving}
                onChange={(e) => setForm((s) => ({ ...s, serviceMoving: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="font-medium">Mutare</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white p-3 text-sm text-gray-700 transition hover:border-purple-300 hover:bg-purple-50/30">
              <input
                type="checkbox"
                checked={!!form.servicePacking}
                onChange={(e) => setForm((s) => ({ ...s, servicePacking: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="font-medium">Împachetare</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white p-3 text-sm text-gray-700 transition hover:border-purple-300 hover:bg-purple-50/30">
              <input
                type="checkbox"
                checked={!!form.serviceDisassembly}
                onChange={(e) => setForm((s) => ({ ...s, serviceDisassembly: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="font-medium">Demontare</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white p-3 text-sm text-gray-700 transition hover:border-purple-300 hover:bg-purple-50/30">
              <input
                type="checkbox"
                checked={!!form.serviceCleanout}
                onChange={(e) => setForm((s) => ({ ...s, serviceCleanout: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="font-medium">Debarasare</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-purple-100 bg-white p-3 text-sm text-gray-700 transition hover:border-purple-300 hover:bg-purple-50/30">
              <input
                type="checkbox"
                checked={!!form.serviceStorage}
                onChange={(e) => setForm((s) => ({ ...s, serviceStorage: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20"
              />
              <span className="font-medium">Depozitare</span>
            </label>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">Data mutării</label>
          <input
            required
            type="date"
            value={form.moveDate || ""}
            onChange={(e) => setForm((s) => ({ ...s, moveDate: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Contact and Additional Info */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Telefon</label>
            <input
              required
              value={form.phone || ""}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="07xx xxx xxx"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Detalii suplimentare</label>
            <textarea
              value={form.details || ""}
              onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              rows={3}
              placeholder="Informații importante (acces, obiecte fragile, interval orar, etc.)"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl hover:shadow-emerald-500/40"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Trimite cererea
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Resetează
          </button>
        </div>
      </form>
    </div>
  );
}
