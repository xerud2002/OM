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
  fromCityManual?: boolean;
  fromAddress?: string;
  toCounty: string;
  toCity: string;
  toCityManual?: boolean;
  toAddress?: string;
  moveDate: string;
  fromType?: "house" | "flat";
  fromFloor?: string;
  fromElevator?: boolean;
  toType?: "house" | "flat";
  toFloor?: string;
  toElevator?: boolean;
  rooms?: string | number;
  phone?: string;
  details?: string;
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
    fromCityManual: false,
    fromAddress: "",
    toCounty: defaultToCounty,
    toCity: defaultToCity,
    toCityManual: false,
    toAddress: "",
    moveDate: new Date().toISOString().split("T")[0],
    fromType: "house",
    fromFloor: "",
    fromElevator: false,
    toType: "house",
    toFloor: "",
    toElevator: false,
    rooms: "2",
    phone: "",
    details: "",
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

    setSubmitting(true);
    try {
      // Normalize numeric fields before sending
      const payload: Record<string, any> = {
        ...form,
        rooms: form.rooms === undefined ? undefined : Number(form.rooms),
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            {/* Summary */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                <strong>{form.fromCity}</strong> → <strong>{form.toCity}</strong>
              </p>
              <p className="text-sm text-gray-500">Data: {form.moveDate}</p>
              <p className="text-sm text-gray-500">
                Camere: {form.rooms ?? "-"}
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
