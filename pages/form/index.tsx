"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/components/layout/Layout";
import cities from "@/cities";
import counties from "@/counties";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { createRequest } from "@/utils/firestoreHelpers";
import { trackConversion, useABTest } from "@/utils/abTesting";
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
  // Services
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
};

export default function FormPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const buttonVariant = useABTest("form-cta-button");
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
    serviceMoving: false,
    servicePacking: false,
    serviceDisassembly: false,
    serviceCleanout: false,
    serviceStorage: false,
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

      // Track conversion for A/B test
      trackConversion("form-cta-button", buttonVariant, "form_submission");

      toast.success("Cererea a fost trimisă. Vei primi oferte în curând.");
      router.push("/customer/dashboard");
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
          {/* Trust banner */}
          <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-sky-50 p-4 text-center">
            <p className="text-sm font-semibold text-emerald-700">
              🎉 Alătură-te celor <strong>5.000+</strong> de români care au economisit deja!
            </p>
            <p className="mt-1 text-xs text-gray-600">
              ⏱️ Completezi în <strong>2 minute</strong> · 💰 Economie medie{" "}
              <strong>450 lei</strong> · ✅ Răspuns garantat în <strong>24h</strong>
            </p>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-emerald-700">
            Primește 3-5 Oferte GRATUITE!
          </h1>
          <p className="mb-6 text-gray-600">
            Completează formularul rapid și primești oferte personalizate de la cele mai bune firme
            de mutări din România. <strong>Fără costuri, fără obligații!</strong>
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

            {/* Trust reassurance before submit */}
            <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="mb-2 text-center text-sm font-semibold text-emerald-700">
                🔒 Datele tale sunt în siguranță
              </p>
              <p className="text-center text-xs text-gray-600">
                Informațiile vor fi trimise doar către firmele verificate de noi. Nu distribuim
                datele tale terților și nu vei primi spam.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl disabled:opacity-60"
              >
                {submitting
                  ? "Se trimite..."
                  : buttonVariant === "A"
                    ? "🎁 PRIMEȘTE OFERTE GRATUITE"
                    : "💰 ECONOMISEȘTE ACUM"}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-500">
              Apasă butonul și vei primi între 3-5 oferte în maxim 24 de ore!
            </p>
          </form>
        </main>
      </LayoutWrapper>
    </RequireRole>
  );
}
