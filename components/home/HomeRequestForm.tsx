"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import counties from "@/counties";
import cities from "@/cities";
import { ArrowRight, MapPin, Home, Sparkles, Calendar, Phone, User, Package } from "lucide-react";
import type { FormShape } from "@/components/customer/requestForm/types";

// Special-case: București sectors
const bucharestSectors = ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"];

const getCityOptions = (county?: string) => {
  if (county === "București") return bucharestSectors;
  return county && (cities as Record<string, string[]>)[county]
    ? (cities as Record<string, string[]>)[county]
    : [];
};

// Format date as YYYY-MM-DD
const formatYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const STORAGE_KEY = "homeRequestForm";
const TOTAL_STEPS = 7;

export default function HomeRequestForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with default values to avoid hydration mismatch
  const [form, setForm] = useState<FormShape>({
    fromCounty: "",
    fromCity: "",
    fromStreet: "",
    fromNumber: "",
    fromType: "flat",
    fromRooms: "",
    fromFloor: "",
    fromElevator: false,
    toCounty: "",
    toCity: "",
    toStreet: "",
    toNumber: "",
    toType: "flat",
    toRooms: "",
    toFloor: "",
    toElevator: false,
    moveDateMode: "exact",
    moveDate: "",
    moveDateStart: "",
    moveDateEnd: "",
    contactFirstName: "",
    contactLastName: "",
    phone: "",
    serviceMoving: true,
    servicePacking: false,
    serviceDisassembly: false,
    serviceStorage: false,
    serviceCleanout: false,
    serviceTransportOnly: false,
    servicePiano: false,
    serviceFewItems: false,
    surveyType: "quick-estimate",
    mediaUpload: "later",
    acceptedTerms: false,
    details: "",
  });

  // Restore form from localStorage after mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  // Save form to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form]);

  const today = new Date();
  const minDate = formatYMD(today);

  // Calendar helpers for a friendlier UX
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
    const wd = roWeekdays[d.getDay()];
    const month = roMonths[d.getMonth()];
    return `${wd}, ${d.getDate()} ${month}`;
  };

  const getNextDow = (start: Date, targetDow: number) => {
    const d = new Date(start);
    const diff = (targetDow - d.getDay() + 7) % 7;
    // If today already matches target, offer the next week's target
    d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
    return formatYMD(d);
  };

  const getNextWorkday = (start: Date) => {
    const d = new Date(start);
    for (let i = 0; i < 14; i++) {
      const check = new Date(d);
      check.setDate(d.getDate() + i + 1);
      const dow = check.getDay();
      if (dow >= 1 && dow <= 5) return formatYMD(check);
    }
    return formatYMD(d);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate required fields
      const errors: string[] = [];

      if (!form.fromCounty) errors.push("Județ plecare");
      if (!form.fromCity) errors.push("Localitate plecare");
      if (!form.fromStreet) errors.push("Strada plecare");
      if (!form.fromNumber) errors.push("Număr plecare");
      if (!form.fromRooms) errors.push("Camere plecare");

      if (!form.toCounty) errors.push("Județ destinație");
      if (!form.toCity) errors.push("Localitate destinație");
      if (!form.toStreet) errors.push("Strada destinație");
      if (!form.toNumber) errors.push("Număr destinație");
      if (!form.toRooms) errors.push("Camere destinație");

      if (!form.contactFirstName) errors.push("Prenume");
      if (!form.contactLastName) errors.push("Nume");
      if (!form.phone) errors.push("Telefon");

      if (!form.acceptedTerms) errors.push("Acceptă termenii");

      if (errors.length > 0) {
        const { toast } = await import("sonner");
        toast.error(
          `Completează câmpurile: ${errors.slice(0, 3).join(", ")}${errors.length > 3 ? "..." : ""}`
        );
        setIsSubmitting(false);
        return;
      }

      // Save form to localStorage for post-auth submission
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      localStorage.setItem("pendingRequestSubmission", "true");

      // Redirect to auth page
      router.push("/customer/auth?redirect=submit");
    },
    [form, router]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // Step 1: FROM Location (county + city only)
  const renderStep1 = () => (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">De unde te muți?</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Județ *</label>
          <select
            value={form.fromCounty || ""}
            onChange={(e) => setForm((s) => ({ ...s, fromCounty: e.target.value, fromCity: "" }))}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
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
          <label className="mb-1 block text-xs font-medium text-gray-600">Localitate *</label>
          <select
            value={form.fromCity || ""}
            onChange={(e) => setForm((s) => ({ ...s, fromCity: e.target.value }))}
            disabled={!form.fromCounty}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50"
          >
            <option value="">Selectează localitate</option>
            {getCityOptions(form.fromCounty).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Step 2: TO Location (county + city only)
  const renderStep2 = () => (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow">
          <Home className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Unde te muți?</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Județ *</label>
          <select
            value={form.toCounty || ""}
            onChange={(e) => setForm((s) => ({ ...s, toCounty: e.target.value, toCity: "" }))}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
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
          <label className="mb-1 block text-xs font-medium text-gray-600">Localitate *</label>
          <select
            value={form.toCity || ""}
            onChange={(e) => setForm((s) => ({ ...s, toCity: e.target.value }))}
            disabled={!form.toCounty}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none disabled:opacity-50"
          >
            <option value="">Selectează localitate</option>
            {getCityOptions(form.toCounty).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Step 3: FROM Address details
  const renderStep3 = () => (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Detalii plecare</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Strada *</label>
          <input
            value={form.fromStreet || ""}
            onChange={(e) => setForm((s) => ({ ...s, fromStreet: e.target.value }))}
            placeholder="Numele străzii"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nr. *</label>
            <input
              value={form.fromNumber || ""}
              onChange={(e) => setForm((s) => ({ ...s, fromNumber: e.target.value }))}
              placeholder="Nr."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Camere *</label>
            <input
              type="text"
              inputMode="numeric"
              value={form.fromRooms || ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, fromRooms: e.target.value.replace(/\D/g, "") }))
              }
              placeholder="ex: 2"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tip</label>
            <select
              value={form.fromType || "flat"}
              onChange={(e) =>
                setForm((s) => ({ ...s, fromType: e.target.value as "house" | "flat" }))
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="flat">Apartament</option>
              <option value="house">Casă</option>
            </select>
          </div>
        </div>
        {form.fromType === "flat" && (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600">Etaj</label>
              <input
                value={form.fromFloor || ""}
                onChange={(e) => setForm((s) => ({ ...s, fromFloor: e.target.value }))}
                placeholder="Etaj"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 pt-5 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={!!form.fromElevator}
                onChange={(e) => setForm((s) => ({ ...s, fromElevator: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              Lift
            </label>
          </div>
        )}
      </div>
    </div>
  );

  // Step 4: TO Address details
  const renderStep4 = () => (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow">
          <Home className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Detalii destinație</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Strada *</label>
          <input
            value={form.toStreet || ""}
            onChange={(e) => setForm((s) => ({ ...s, toStreet: e.target.value }))}
            placeholder="Numele străzii"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nr. *</label>
            <input
              value={form.toNumber || ""}
              onChange={(e) => setForm((s) => ({ ...s, toNumber: e.target.value }))}
              placeholder="Nr."
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Camere *</label>
            <input
              type="text"
              inputMode="numeric"
              value={form.toRooms || ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, toRooms: e.target.value.replace(/\D/g, "") }))
              }
              placeholder="ex: 3"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tip</label>
            <select
              value={form.toType || "flat"}
              onChange={(e) =>
                setForm((s) => ({ ...s, toType: e.target.value as "house" | "flat" }))
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            >
              <option value="flat">Apartament</option>
              <option value="house">Casă</option>
            </select>
          </div>
        </div>
        {form.toType === "flat" && (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-600">Etaj</label>
              <input
                value={form.toFloor || ""}
                onChange={(e) => setForm((s) => ({ ...s, toFloor: e.target.value }))}
                placeholder="Etaj"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 pt-5 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={!!form.toElevator}
                onChange={(e) => setForm((s) => ({ ...s, toElevator: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              Lift
            </label>
          </div>
        )}
      </div>
    </div>
  );

  // Step 5: Move Date
  const renderStep5 = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-emerald-600" />
        <span className="font-semibold text-gray-800">Când te muți?</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {[
          { value: "exact", label: "Dată exactă" },
          { value: "flexible", label: "Flexibil" },
          { value: "none", label: "Nu știu încă" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              setForm((s) => ({
                ...s,
                moveDateMode: opt.value as "exact" | "flexible" | "none",
              }))
            }
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              form.moveDateMode === opt.value
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Quick suggestions to speed selection */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500">Sugestii rapide:</span>
        <button
          type="button"
          onClick={() =>
            setForm((s) => ({
              ...s,
              moveDateMode: "exact",
              moveDate: getNextDow(today, 6), // Sâmbătă
            }))
          }
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-200"
        >
          Sâmbătă
        </button>
        <button
          type="button"
          onClick={() =>
            setForm((s) => ({
              ...s,
              moveDateMode: "exact",
              moveDate: getNextDow(today, 0), // Duminică
            }))
          }
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-200"
        >
          Duminică
        </button>
        <button
          type="button"
          onClick={() =>
            setForm((s) => ({
              ...s,
              moveDateMode: "exact",
              moveDate: getNextWorkday(today),
            }))
          }
          className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-200"
        >
          Zi lucrătoare
        </button>
      </div>

      {form.moveDateMode === "exact" && (
        <input
          type="date"
          min={minDate}
          value={form.moveDate || ""}
          onChange={(e) => setForm((s) => ({ ...s, moveDate: e.target.value }))}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      )}
      {form.moveDateMode === "exact" && form.moveDate && (
        <p className="mt-1 text-xs text-gray-500">{formatWeekdayPreview(form.moveDate)}</p>
      )}
      {form.moveDateMode === "flexible" && (
        <div className="space-y-2">
          <input
            type="date"
            min={minDate}
            value={form.moveDate || ""}
            onChange={(e) => setForm((s) => ({ ...s, moveDate: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          {form.moveDate && (
            <p className="text-xs text-gray-500">{formatWeekdayPreview(form.moveDate)}</p>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Flexibilitate</label>
              <select
                value={String(form.moveDateFlexDays ?? 7)}
                onChange={(e) =>
                  setForm((s) => ({ ...s, moveDateFlexDays: Number(e.target.value) }))
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value={3}>± 3 zile</option>
                <option value={7}>± 7 zile</option>
                <option value={14}>± 14 zile</option>
                <option value={30}>± 30 zile</option>
              </select>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-600">
              Companiile pot propune date în jurul perioadei selectate.
            </div>
          </div>
        </div>
      )}
      {form.moveDateMode === "none" && (
        <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
          Nu-i problemă! Companiile îți vor propune mai multe date.
        </p>
      )}
    </div>
  );

  // Step 6: Services
  const renderStep6 = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Ce servicii ai nevoie?</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { key: "serviceMoving", label: "Mutare" },
            { key: "servicePacking", label: "Ambalare" },
            { key: "serviceDisassembly", label: "Montaj" },
            { key: "serviceCleanout", label: "Debarasare" },
            { key: "serviceStorage", label: "Depozitare" },
            { key: "serviceTransportOnly", label: "Doar Transport (fără încărcare/descărcare)" },
            { key: "servicePiano", label: "Mutare Pian" },
            { key: "serviceFewItems", label: "Câteva lucruri" },
          ].map((svc) => (
            <label
              key={svc.key}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition ${
                (form as Record<string, boolean>)[svc.key]
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-200"
              }`}
            >
              <input
                type="checkbox"
                checked={!!(form as Record<string, boolean>)[svc.key]}
                onChange={(e) => setForm((s) => ({ ...s, [svc.key]: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">{svc.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Detalii (opțional)</label>
        <textarea
          value={form.details || ""}
          onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
          rows={2}
          placeholder="Obiecte speciale, acces dificil..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </div>
  );

  // Step 7: Contact
  const renderStep7 = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Datele tale de contact</span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Prenume *</label>
              <input
                value={form.contactFirstName || ""}
                onChange={(e) => setForm((s) => ({ ...s, contactFirstName: e.target.value }))}
                placeholder="Ion"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Nume *</label>
              <input
                value={form.contactLastName || ""}
                onChange={(e) => setForm((s) => ({ ...s, contactLastName: e.target.value }))}
                placeholder="Popescu"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Telefon *</label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={form.phone || ""}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                placeholder="07xx xxx xxx"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <input
          type="checkbox"
          checked={!!form.acceptedTerms}
          onChange={(e) => setForm((s) => ({ ...s, acceptedTerms: e.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-xs text-gray-600">
          Accept{" "}
          <Link href="/terms" className="text-emerald-600 underline hover:text-emerald-700">
            termenii
          </Link>{" "}
          și{" "}
          <Link href="/privacy" className="text-emerald-600 underline hover:text-emerald-700">
            politica de confidențialitate
          </Link>
          .
        </span>
      </label>
    </div>
  );

  const stepLabels = ["De unde", "Unde", "Plecare", "Destinație", "Când", "Servicii", "Contact"];

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Progress Steps */}
      <div className="mb-4 flex items-center justify-center gap-1">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <button
              type="button"
              onClick={() => setCurrentStep(step)}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                currentStep === step
                  ? "bg-emerald-500 text-white shadow-lg"
                  : currentStep > step
                    ? "bg-emerald-200 text-emerald-700"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </button>
            {step < TOTAL_STEPS && (
              <div
                className={`h-0.5 w-4 rounded ${currentStep > step ? "bg-emerald-300" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="mb-4 flex justify-between text-[10px] text-gray-500">
        {stepLabels.map((label, i) => (
          <span
            key={label}
            className={currentStep === i + 1 ? "font-semibold text-emerald-600" : ""}
          >
            {label}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Steps */}
        <div className="min-h-[280px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
          {currentStep === 7 && renderStep7()}
        </div>

        {/* Navigation */}
        <div className="mt-4 flex gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ← Înapoi
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600"
            >
              Continuă →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 font-bold text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />
              {isSubmitting ? "Se procesează..." : "Obține Oferte Gratuite"}
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Trust badge */}
      <p className="mt-4 text-center text-xs text-gray-500">
        🔒 100% gratuit • Fără obligații • Date securizate
      </p>
    </div>
  );
}
