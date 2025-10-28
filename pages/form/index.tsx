"use client";
import { useState } from "react";

export default function MoveFormPage() {
  const [data, setData] = useState({
    fromCity: "",
    toCity: "",
    date: "",
    volume: "",
    extras: [] as string[],
    notes: "",
  });

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Cererea a fost trimisă (demo).");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 p-6">
      <div className="max-w-3xl bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 w-full">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Cere oferte pentru mutare
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Oraș plecare</label>
              <input
                type="text"
                value={data.fromCity}
                onChange={(e) => update("fromCity", e.target.value)}
                className="w-full border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Oraș destinație</label>
              <input
                type="text"
                value={data.toCity}
                onChange={(e) => update("toCity", e.target.value)}
                className="w-full border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data mutării</label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Volum estimat</label>
              <select
                value={data.volume}
                onChange={(e) => update("volume", e.target.value)}
                className="w-full border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Alege...</option>
                <option>Garsonieră</option>
                <option>2 camere</option>
                <option>3 camere</option>
                <option>Casă</option>
                <option>Birou</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Servicii extra</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {["Împachetare", "Demontare", "Depozitare", "Debarasare"].map((x) => (
                <label key={x} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.extras.includes(x)}
                    onChange={(e) => {
                      const next = new Set(data.extras);
                      e.target.checked ? next.add(x) : next.delete(x);
                      update("extras", Array.from(next));
                    }}
                  />
                  {x}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Detalii suplimentare</label>
            <textarea
              rows={4}
              value={data.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full border border-emerald-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Descrie detalii importante despre mutare..."
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
          >
            Trimite cererea
          </button>
        </form>
      </div>
    </main>
  );
}
