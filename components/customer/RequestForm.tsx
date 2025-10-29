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
  volumeM3?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  budgetEstimate?: number;
  phone?: string;
  specialItems?: string;
  details?: string;
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

  const setPreset = (preset: string) => {
    const map: Record<string, { rooms: string; volumeM3: number }> = {
      Garsonieră: { rooms: "1", volumeM3: 12 },
      "2 camere": { rooms: "2", volumeM3: 18 },
      "3 camere": { rooms: "3", volumeM3: 25 },
      "4+ camere": { rooms: "4", volumeM3: 35 },
    };
    if (map[preset]) {
      setForm((s) => ({ ...s, rooms: map[preset].rooms, volumeM3: map[preset].volumeM3 }));
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 md:p-6">
      <h3 className="mb-4 text-lg font-semibold">Cerere nouă</h3>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Pickup and Destination */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* From county/city */}
          <div>
            <label className="block text-xs text-gray-600">Județ plecare</label>
            <select
              required
              value={form.fromCounty || ""}
              onChange={(e) => setForm((s) => ({ ...s, fromCounty: e.target.value, fromCity: "" }))}
              className="w-full rounded-md border p-2 text-sm"
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
            <label className="block text-xs text-gray-600">Localitate plecare</label>
            {form.fromCityManual ? (
              <input
                required
                value={form.fromCity || ""}
                onChange={(e) => setForm((s) => ({ ...s, fromCity: e.target.value }))}
                placeholder="Introdu localitatea"
                className="w-full rounded-md border p-2 text-sm"
              />
            ) : (
              <select
                required
                value={form.fromCity || ""}
                onChange={(e) => setForm((s) => ({ ...s, fromCity: e.target.value }))}
                className="w-full rounded-md border p-2 text-sm"
                disabled={!form.fromCounty}
              >
                <option value="">Selectează localitatea</option>
                {countyCities(form.fromCounty).map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
            <label className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={!!form.fromCityManual}
                onChange={(e) =>
                  setForm((s) => ({ ...s, fromCityManual: e.target.checked, fromCity: "" }))
                }
              />
              Localitatea nu e în listă? Introdu manual
            </label>
          </div>

          {/* To county/city */}
          <div>
            <label className="block text-xs text-gray-600">Județ destinație</label>
            <select
              required
              value={form.toCounty || ""}
              onChange={(e) => setForm((s) => ({ ...s, toCounty: e.target.value, toCity: "" }))}
              className="w-full rounded-md border p-2 text-sm"
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
            <label className="block text-xs text-gray-600">Localitate destinație</label>
            {form.toCityManual ? (
              <input
                required
                value={form.toCity || ""}
                onChange={(e) => setForm((s) => ({ ...s, toCity: e.target.value }))}
                placeholder="Introdu localitatea"
                className="w-full rounded-md border p-2 text-sm"
              />
            ) : (
              <select
                required
                value={form.toCity || ""}
                onChange={(e) => setForm((s) => ({ ...s, toCity: e.target.value }))}
                className="w-full rounded-md border p-2 text-sm"
                disabled={!form.toCounty}
              >
                <option value="">Selectează localitatea</option>
                {countyCities(form.toCounty).map((city: string) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}
            <label className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={!!form.toCityManual}
                onChange={(e) =>
                  setForm((s) => ({ ...s, toCityManual: e.target.checked, toCity: "" }))
                }
              />
              Localitatea nu e în listă? Introdu manual
            </label>
          </div>

          {/* Addresses */}
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600">Adresă plecare</label>
            <input
              required
              value={form.fromAddress || ""}
              onChange={(e) => setForm((s) => ({ ...s, fromAddress: e.target.value }))}
              className="w-full rounded-md border p-2 text-sm"
              placeholder="Stradă, număr, bloc/scară/apartament (dacă e cazul)"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600">Adresă destinație</label>
            <input
              required
              value={form.toAddress || ""}
              onChange={(e) => setForm((s) => ({ ...s, toAddress: e.target.value }))}
              className="w-full rounded-md border p-2 text-sm"
              placeholder="Stradă, număr, bloc/scară/apartament (dacă e cazul)"
            />
          </div>
        </div>

        {/* Date + preset */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-600">Data mutării</label>
            <input
              required
              type="date"
              value={form.moveDate || ""}
              onChange={(e) => setForm((s) => ({ ...s, moveDate: e.target.value }))}
              className="w-full rounded-md border p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Tip locuință (preset)</label>
            <select
              onChange={(e) => setPreset(e.target.value)}
              defaultValue=""
              className="w-full rounded-md border p-2 text-sm"
            >
              <option value="" disabled>
                Selectează preset
              </option>
              <option>Garsonieră</option>
              <option>2 camere</option>
              <option>3 camere</option>
              <option>4+ camere</option>
            </select>
          </div>
        </div>

        {/* From/To dwelling details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid grid-cols-2 items-center gap-2">
            <label className="text-xs text-gray-600">Plecare: tip locuință</label>
            <select
              value={form.fromType || "house"}
              onChange={(e) => setForm((s) => ({ ...s, fromType: e.target.value as any }))}
              className="rounded-md border p-2 text-sm"
            >
              <option value="house">Casă</option>
              <option value="flat">Apartament</option>
            </select>
            {form.fromType === "flat" && (
              <>
                <input
                  placeholder="Etaj plecare"
                  value={form.fromFloor || ""}
                  onChange={(e) => setForm((s) => ({ ...s, fromFloor: e.target.value }))}
                  className="col-span-2 rounded-md border p-2 text-sm"
                />
                <label className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!form.fromElevator}
                    onChange={(e) => setForm((s) => ({ ...s, fromElevator: e.target.checked }))}
                  />
                  Bloc cu lift (plecare)
                </label>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 items-center gap-2">
            <label className="text-xs text-gray-600">Destinație: tip locuință</label>
            <select
              value={form.toType || "house"}
              onChange={(e) => setForm((s) => ({ ...s, toType: e.target.value as any }))}
              className="rounded-md border p-2 text-sm"
            >
              <option value="house">Casă</option>
              <option value="flat">Apartament</option>
            </select>
            {form.toType === "flat" && (
              <>
                <input
                  placeholder="Etaj destinație"
                  value={form.toFloor || ""}
                  onChange={(e) => setForm((s) => ({ ...s, toFloor: e.target.value }))}
                  className="col-span-2 rounded-md border p-2 text-sm"
                />
                <label className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!form.toElevator}
                    onChange={(e) => setForm((s) => ({ ...s, toElevator: e.target.checked }))}
                  />
                  Bloc cu lift (destinație)
                </label>
              </>
            )}
          </div>
        </div>

        {/* Rooms and Volume */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-600">Număr camere</label>
            <input
              type="text"
              value={form.rooms || ""}
              onChange={(e) => setForm((s) => ({ ...s, rooms: e.target.value }))}
              className="w-full rounded-md border p-2 text-sm"
              placeholder="ex: 2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Volum estimat (m³)</label>
            <input
              type="number"
              min={0}
              value={form.volumeM3 ?? 0}
              onChange={(e) => setForm((s) => ({ ...s, volumeM3: Number(e.target.value || 0) }))}
              className="w-full rounded-md border p-2 text-sm"
              placeholder="ex: 20"
            />
          </div>
        </div>

        {/* Misc options */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!form.needPacking}
              onChange={(e) => setForm((s) => ({ ...s, needPacking: e.target.checked }))}
            />
            Necesit ambalare
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!form.hasElevator}
              onChange={(e) => setForm((s) => ({ ...s, hasElevator: e.target.checked }))}
            />
            Bloc cu lift
          </label>
          <div>
            <label className="block text-xs text-gray-600">Buget estimat (RON)</label>
            <input
              type="number"
              min={0}
              value={form.budgetEstimate ?? 0}
              onChange={(e) =>
                setForm((s) => ({ ...s, budgetEstimate: Number(e.target.value || 0) }))
              }
              className="w-full rounded-md border p-2 text-sm"
              placeholder="ex: 1500"
            />
          </div>
        </div>

        {/* Contact and details */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-600">Telefon</label>
            <input
              required
              value={form.phone || ""}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              className="w-full rounded-md border p-2 text-sm"
              placeholder="ex: 07xx xxx xxx"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Obiecte speciale (opțional)</label>
            <input
              value={form.specialItems || ""}
              onChange={(e) => setForm((s) => ({ ...s, specialItems: e.target.value }))}
              className="w-full rounded-md border p-2 text-sm"
              placeholder="ex: pian, seif, vitrină mare"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-600">Detalii</label>
          <textarea
            value={form.details || ""}
            onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
            rows={4}
            placeholder="Informații suplimentare (acces, etaj, interval orar preferat, etc.)"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
          >
            Trimite
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
