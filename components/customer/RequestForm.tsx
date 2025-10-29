import React from "react";

export default function RequestForm({
  form,
  setForm,
  onSubmit,
  onReset,
}: {
  form: any;
  setForm: (updater: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-600">Trimite o cerere</h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div>
          <label className="block text-xs text-gray-600">Localitate plecare</label>
          <input
            value={form.fromCity}
            onChange={(e) => setForm((s: any) => ({ ...s, fromCity: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Județ plecare</label>
          <input
            value={form.fromCounty}
            onChange={(e) => setForm((s: any) => ({ ...s, fromCounty: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Localitate destinație</label>
          <input
            value={form.toCity}
            onChange={(e) => setForm((s: any) => ({ ...s, toCity: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Județ destinație</label>
          <input
            value={form.toCounty}
            onChange={(e) => setForm((s: any) => ({ ...s, toCounty: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Data</label>
          <input
            type="date"
            value={form.moveDate}
            onChange={(e) => setForm((s: any) => ({ ...s, moveDate: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Camere (estimare)</label>
          <input
            value={form.rooms}
            onChange={(e) => setForm((s: any) => ({ ...s, rooms: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Telefon</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((s: any) => ({ ...s, phone: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Detalii</label>
          <textarea
            value={form.details}
            onChange={(e) => setForm((s: any) => ({ ...s, details: e.target.value }))}
            className="w-full rounded-md border p-2 text-sm"
            rows={4}
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
