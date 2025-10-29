"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/components/layout/Layout";
import cities from "@/cities";
import counties from "@/counties";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { createRequest } from "@/utils/firestoreHelpers";
import { toast } from "sonner";
import RequireRole from "@/components/auth/RequireRole";

type FormState = {
  fromCounty: string;
  fromCity: string;
  toCounty: string;
  toCity: string;
  moveDate: string;
  details: string;
  rooms?: number;
  volumeM3?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  specialItems?: string;
  phone?: string;
  budgetEstimate?: number;
};

export default function FormPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  // sensible defaults: pick the first counties/cities if available
  const defaultFromCounty = counties[0] ?? "";
  const defaultToCounty = counties.length > 1 ? counties[1] : (counties[0] ?? "");
  const defaultFromCity = (cities[defaultFromCounty] || [])[0] ?? "";
  const defaultToCity = (cities[defaultToCounty] || [])[0] ?? "";

  const [form, setForm] = useState<FormState>({
    fromCounty: defaultFromCounty,
    fromCity: defaultFromCity,
    toCounty: defaultToCounty,
    toCity: defaultToCity,
    moveDate: new Date().toISOString().split("T")[0],
    details: "",
    rooms: 2,
    volumeM3: undefined,
    needPacking: false,
    hasElevator: true,
    specialItems: "",
    phone: "",
    budgetEstimate: undefined,
  });

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  // helper: list of cities for selected counties
  const fromCountyCities = cities[form.fromCounty] ?? ([] as string[]);
  const toCountyCities = cities[form.toCounty] ?? ([] as string[]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Trebuie să fii autentificat pentru a trimite o cerere.");
      router.push("/customer/auth");
      return;
    }

    if (!form.fromCity || !form.toCity || !form.moveDate) {
      toast.error("Completați câmpurile obligatorii.");
      return;
    }

    // Basic client-side validation
    const phoneRegex = /^\+?[0-9 \-]{7,20}$/;
    if (!form.phone || !phoneRegex.test(form.phone)) {
      toast.error("Introduceți un număr de telefon valid (ex: +407xxxxxxxx).");
      return;
    }
    if (form.rooms !== undefined && Number(form.rooms) < 1) {
      toast.error("Numărul de camere trebuie să fie cel puțin 1.");
      return;
    }
    if (form.volumeM3 !== undefined && Number(form.volumeM3) <= 0) {
      toast.error("Volumul trebuie să fie un număr pozitiv.");
      return;
    }

    setSubmitting(true);
    try {
      // Normalize numeric fields before sending
      const payload: Record<string, any> = {
        ...form,
        rooms: form.rooms === undefined ? undefined : Number(form.rooms),
        volumeM3: form.volumeM3 === undefined ? undefined : Number(form.volumeM3),
        budgetEstimate: form.budgetEstimate === undefined ? undefined : Number(form.budgetEstimate),
        needPacking: !!form.needPacking,
        hasElevator: !!form.hasElevator,
        // user metadata
        userId: user.uid,
        customerId: user.uid,
        customerName: user.displayName ?? user.email ?? null,
        customerEmail: user.email ?? null,
      };

      await createRequest(payload);

      toast.success("Cererea a fost trimisă. Vei primi oferte în curând.");
      router.push("/customer/requests");
    } catch (err) {
      console.error(err);
      toast.error("A apărut o eroare la trimitere. Încearcă din nou.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RequireRole allowedRole="customer">
      <LayoutWrapper>
        <main className="mx-auto max-w-3xl px-6 pt-[80px]">
          <h1 className="mb-4 text-3xl font-bold text-emerald-700">Formular Cerere Mutare</h1>
          <p className="mb-6 text-gray-600">
            Completează detaliile mutării tale pentru a primi oferte de la firme verificate.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Județ (De la)
                  </span>
                  <select
                    value={form.fromCounty}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        fromCounty: e.target.value,
                        fromCity: (cities[e.target.value] || [])[0] || "",
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                    required
                  >
                    {counties.map((cty) => (
                      <option key={`fc-${cty}`} value={cty}>
                        {cty}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-3 block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Oraș (De la)</span>
                  <select
                    value={form.fromCity}
                    onChange={(e) => setForm((s) => ({ ...s, fromCity: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                    required
                  >
                    {(fromCountyCities.length ? fromCountyCities : [form.fromCity]).map((c) => (
                      <option key={`from-${c}`} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Județ (Către)
                  </span>
                  <select
                    value={form.toCounty}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        toCounty: e.target.value,
                        toCity: (cities[e.target.value] || [])[0] || "",
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                    required
                  >
                    {counties.map((cty) => (
                      <option key={`tc-${cty}`} value={cty}>
                        {cty}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-3 block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Oraș (Către)</span>
                  <select
                    value={form.toCity}
                    onChange={(e) => setForm((s) => ({ ...s, toCity: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                    required
                  >
                    {(toCountyCities.length ? toCountyCities : [form.toCity]).map((c) => (
                      <option key={`to-${c}`} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Data mutării</span>
              <input
                type="date"
                value={form.moveDate}
                onChange={(e) => setForm((s) => ({ ...s, moveDate: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Detalii</span>
              <textarea
                value={form.details}
                onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
                className="h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                placeholder="Ex: apartament 2 camere, etaj 3, lift, obiecte voluminoase etc."
              />
            </label>

            {/* Additional move details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Camere</span>
                <input
                  type="number"
                  min={1}
                  value={form.rooms ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      rooms: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Volum estimat (m³)
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={form.volumeM3 ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      volumeM3: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Buget estimat (RON)
                </span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.budgetEstimate ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      budgetEstimate: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.needPacking}
                  onChange={(e) => setForm((s) => ({ ...s, needPacking: e.target.checked }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">Am nevoie de ambalare</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!form.hasElevator}
                  onChange={(e) => setForm((s) => ({ ...s, hasElevator: e.target.checked }))}
                  className="h-4 w-4"
                />
                <span className="text-sm text-gray-700">Există lift</span>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Telefon (de contact)
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                  placeholder="ex: +407xxxxxxxx"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Articole speciale
              </span>
              <input
                type="text"
                value={form.specialItems}
                onChange={(e) => setForm((s) => ({ ...s, specialItems: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2"
                placeholder="Ex: pian, seif, mobilier demontabil"
              />
            </label>

            {/* Summary */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                <strong>{form.fromCity}</strong> → <strong>{form.toCity}</strong>
              </p>
              <p className="text-sm text-gray-500">Data: {form.moveDate}</p>
              <p className="text-sm text-gray-500">
                Camere: {form.rooms ?? "-"} • Volum: {form.volumeM3 ?? "-"} m³
              </p>
              <p className="text-sm text-gray-500">
                Ambalare: {form.needPacking ? "Da" : "Nu"} • Lift: {form.hasElevator ? "Da" : "Nu"}
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-2 font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
              >
                {submitting ? "Se trimite..." : "Trimite cerere"}
              </button>
            </div>
          </form>
        </main>
      </LayoutWrapper>
    </RequireRole>
  );
}
