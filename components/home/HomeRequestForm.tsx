"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import counties from "@/counties";
import cities from "@/cities";
import {
  ArrowRight,
  MapPin,
  Home,
  Sparkles,
  Calendar,
  User,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

// Inline Calendar Component
function InlineCalendar({
  value,
  onChange,
  minDate,
}: {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(`${value}T00:00:00`);
    return today;
  });

  const roMonthsFull = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ];
  const roWeekdaysShort = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const formatDateYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    const minD = new Date(`${minDate}T00:00:00`);
    minD.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < minD;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selected = new Date(`${value}T00:00:00`);
    return (
      selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day
    );
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const handleSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(year, month, day);
    onChange(formatDateYMD(date));
  };

  // Build calendar grid
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {roMonthsFull[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {roWeekdaysShort.map((wd) => (
          <div key={wd} className="text-center text-xs font-medium text-gray-400">
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }
          const disabled = isDateDisabled(day);
          const selected = isSelected(day);
          const todayClass = isToday(day) && !selected;

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={`h-9 w-full rounded-lg text-sm font-medium transition ${
                disabled
                  ? "cursor-not-allowed text-gray-300"
                  : selected
                    ? "bg-emerald-500 text-white shadow-sm"
                    : todayClass
                      ? "border border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                      : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function HomeRequestForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with default values to avoid hydration mismatch
  const [form, setForm] = useState<FormShape>({
    fromCounty: "",
    fromCity: "",
    fromCityManual: false,
    fromStreet: "",
    fromNumber: "",
    fromType: "flat",
    fromRooms: "",
    fromFloor: "",
    fromElevator: false,
    toCounty: "",
    toCity: "",
    toCityManual: false,
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Validate required fields
      const errors: string[] = [];

      if (!form.fromCounty) errors.push("Județ plecare");
      if (!form.fromCity) errors.push("Localitate plecare");
      // Removed street/number requirements
      if (!form.fromRooms) errors.push("Camere plecare");

      if (!form.toCounty) errors.push("Județ destinație");
      if (!form.toCity) errors.push("Localitate destinație");
      // Removed street/number requirements
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
    <div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50/50 to-white p-4">
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
            onChange={(e) =>
              setForm((s) => ({
                ...s,
                fromCounty: e.target.value,
                fromCity: "",
                fromCityManual: false,
              }))
            }
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
          {!form.fromCityManual ? (
            <select
              value={form.fromCity || ""}
              onChange={(e) => {
                if (e.target.value === "__manual__") {
                  setForm((s) => ({ ...s, fromCity: "", fromCityManual: true }));
                } else {
                  setForm((s) => ({ ...s, fromCity: e.target.value }));
                }
              }}
              disabled={!form.fromCounty}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-50"
            >
              <option value="">Selectează localitate</option>
              {getCityOptions(form.fromCounty).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__manual__">--- Altă localitate ---</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={form.fromCity || ""}
                onChange={(e) => setForm((s) => ({ ...s, fromCity: e.target.value }))}
                placeholder="Scrie numele localității"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, fromCity: "", fromCityManual: false }))}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
              >
                Listă
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Step 2: TO Location (county + city only)
  const renderStep2 = () => (
    <div className="rounded-xl border border-sky-200 bg-linear-to-br from-sky-50/50 to-white p-4">
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
            onChange={(e) =>
              setForm((s) => ({ ...s, toCounty: e.target.value, toCity: "", toCityManual: false }))
            }
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
          {!form.toCityManual ? (
            <select
              value={form.toCity || ""}
              onChange={(e) => {
                if (e.target.value === "__manual__") {
                  setForm((s) => ({ ...s, toCity: "", toCityManual: true }));
                } else {
                  setForm((s) => ({ ...s, toCity: e.target.value }));
                }
              }}
              disabled={!form.toCounty}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none disabled:opacity-50"
            >
              <option value="">Selectează localitate</option>
              {getCityOptions(form.toCounty).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__manual__">--- Altă localitate ---</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={form.toCity || ""}
                onChange={(e) => setForm((s) => ({ ...s, toCity: e.target.value }))}
                placeholder="Scrie numele localității"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, toCity: "", toCityManual: false }))}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
              >
                Listă
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Step 3: FROM Address details
  const renderStep3 = () => (
    <div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Detalii plecare</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>
        {form.fromType === "flat" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Etaj</label>
              <input
                value={form.fromFloor || ""}
                onChange={(e) => setForm((s) => ({ ...s, fromFloor: e.target.value }))}
                placeholder="ex: 3"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex h-9.5 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 transition hover:border-emerald-300">
                <input
                  type="checkbox"
                  checked={!!form.fromElevator}
                  onChange={(e) => setForm((s) => ({ ...s, fromElevator: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                Lift
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 4: TO Address details
  const renderStep4 = () => (
    <div className="rounded-xl border border-sky-200 bg-linear-to-br from-sky-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow">
          <Home className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Detalii destinație</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>
        {form.toType === "flat" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Etaj</label>
              <input
                value={form.toFloor || ""}
                onChange={(e) => setForm((s) => ({ ...s, toFloor: e.target.value }))}
                placeholder="ex: 5"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex h-9.5 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600 transition hover:border-sky-300">
                <input
                  type="checkbox"
                  checked={!!form.toElevator}
                  onChange={(e) => setForm((s) => ({ ...s, toElevator: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-sky-600"
                />
                Lift
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Step 5: Move Date
  const renderStep5 = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
          <Calendar className="h-4 w-4 text-emerald-600" />
        </div>
        <span className="font-semibold text-gray-800">Când te muți?</span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
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
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              form.moveDateMode === opt.value
                ? "bg-emerald-500 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {form.moveDateMode === "exact" && (
        <div className="space-y-2">
          <InlineCalendar
            value={form.moveDate || ""}
            onChange={(date) => setForm((s) => ({ ...s, moveDate: date }))}
            minDate={minDate}
          />
          {form.moveDate && (
            <p className="text-center text-sm font-medium text-emerald-600">
              📅 {formatWeekdayPreview(form.moveDate)}
            </p>
          )}
        </div>
      )}
      {form.moveDateMode === "flexible" && (
        <div className="space-y-3">
          <InlineCalendar
            value={form.moveDate || ""}
            onChange={(date) => setForm((s) => ({ ...s, moveDate: date }))}
            minDate={minDate}
          />
          {form.moveDate && (
            <p className="text-center text-sm font-medium text-emerald-600">
              📅 {formatWeekdayPreview(form.moveDate)}
            </p>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Flexibilitate</label>
            <select
              value={String(form.moveDateFlexDays ?? 7)}
              onChange={(e) => setForm((s) => ({ ...s, moveDateFlexDays: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              <option value={3}>± 3 zile</option>
              <option value={7}>± 7 zile</option>
              <option value={14}>± 14 zile</option>
              <option value={30}>± 30 zile</option>
            </select>
          </div>
          <p className="rounded-lg bg-emerald-50 p-3 text-center text-xs text-emerald-700">
            💡 Companiile pot propune date în jurul perioadei selectate.
          </p>
        </div>
      )}
      {form.moveDateMode === "none" && (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-600">
            Nu-i problemă! Companiile îți vor propune mai multe date disponibile.
          </p>
        </div>
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
            { key: "serviceTransportOnly", label: "Doar Transport", sublabel: "(fără încărcare)" },
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
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm leading-tight text-gray-700">
                {svc.label}
                {"sublabel" in svc && (
                  <span className="block text-xs text-gray-500">{svc.sublabel}</span>
                )}
              </span>
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
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="07xx xxx xxx"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="exemplu@email.com"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
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
        <div className="min-h-70">
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-3 font-bold text-white shadow-lg transition hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50"
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
