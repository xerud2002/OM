"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import counties from "@/counties";
import cities from "@/cities";
import { ArrowRightIcon as ArrowRight, MapPinIcon as MapPin, HomeIcon as Home, SparklesIcon as Sparkles, CalendarIcon as Calendar, UserIcon as User, CubeIcon as Package, ChevronLeftIcon as ChevronLeft, ChevronRightIcon as ChevronRight, CheckCircleIcon as CheckCircle, XMarkIcon as X, EnvelopeIcon as Mail } from "@heroicons/react/24/outline";
import type { FormShape } from "@/components/customer/RequestForm";

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
            return <div key={`empty-${idx}`} className="h-8" />;
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
              className={`h-8 w-full rounded-lg text-sm font-medium transition ${disabled
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequestCode, setSubmittedRequestCode] = useState<string | null>(null);

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
    itemsList: "",
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

      // Only submit if we're on the last step (prevents Enter key submission on other steps)
      if (currentStep !== TOTAL_STEPS) {
        // If not on last step, just advance to next step
        await nextStep();
        return;
      }

      setIsSubmitting(true);

      const { toast } = await import("sonner");

      // Validate required fields
      const errors: string[] = [];

      if (!form.fromCounty) errors.push("Județ plecare");
      if (!form.fromCity) errors.push("Localitate plecare");
      if (!form.fromRooms) errors.push("Camere plecare");

      if (!form.toCounty) errors.push("Județ destinație");
      if (!form.toCity) errors.push("Localitate destinație");
      if (!form.toRooms) errors.push("Camere destinație");

      if (!form.contactFirstName) errors.push("Prenume");
      if (!form.contactLastName) errors.push("Nume");
      if (!form.phone) errors.push("Telefon");
      if (!form.email) errors.push("Email");

      if (!form.acceptedTerms) errors.push("Acceptă termenii");

      // Validate phone format
      const phoneClean = (form.phone || "").replace(/\s+/g, "");
      if (form.phone && !/^07\d{8}$/.test(phoneClean)) {
        errors.push("Format telefon invalid (07xxxxxxxx)");
      }

      // Validate email format
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.push("Format email invalid");
      }

      if (errors.length > 0) {
        setIsSubmitting(false);
        return;
      }

      try {
        let requestCode: string | null = null;

        // Try API first
        const response = await fetch("/api/requests/createGuest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          const result = await response.json();
          requestCode = result.data.requestCode;
        } else if (response.status === 503) {
          // Admin SDK not ready - use client-side Firebase directly
          const { createGuestRequest } = await import("@/utils/firestoreHelpers");
          const result = await createGuestRequest(form);
          requestCode = result.requestCode;
        } else {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || "Eroare la trimiterea cererii");
        }

        // Success! Show modal
        setSubmittedRequestCode(requestCode);
        setShowSuccessModal(true);

        // Clear form from localStorage
        localStorage.removeItem(STORAGE_KEY);

        // Reset form to initial state
        setForm({
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
          email: "",
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
        setCurrentStep(1);

        // Track analytics
        try {
          const { trackRequestCreated } = await import("@/utils/analytics");
          trackRequestCreated(
            form.fromCity || "",
            form.toCity || "",
            parseInt(String(form.fromRooms || 0), 10)
          );
        } catch {
          // Ignore analytics errors
        }
      } catch (error: any) {
        console.error("Submit error:", error);
        toast.error(error.message || "Eroare la trimiterea cererii. Te rugăm să încerci din nou.");
      } finally {
        setIsSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, currentStep]
  );

  const nextStep = useCallback(async () => {
    // Validate step 1 before moving to step 2
    if (currentStep === 1) {
      if (!form.fromCounty || !form.fromCity || !form.fromRooms) {
        return;
      }
    }

    // Validate step 2 before moving to step 3
    if (currentStep === 2) {
      if (!form.toCounty || !form.toCity || !form.toRooms) {
        return;
      }
    }

    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [currentStep, form]);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // Step 1: FROM Location (county + city + details)
  const renderStep1 = () => (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">De unde te muți?</span>
      </div>

      <div className="space-y-2">
        {/* County */}
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
            className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${form.fromCounty ? "text-gray-900" : "text-gray-500"}`}
          >
            <option value="" className="text-gray-500">
              Selectează județ
            </option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Localitate *</label>
          {!form.fromCityManual ? (
            <select
              value={form.fromCity || ""}
              disabled={!form.fromCounty}
              onChange={(e) => {
                if (e.target.value === "__manual__") {
                  setForm((s) => ({ ...s, fromCity: "", fromCityManual: true }));
                } else {
                  setForm((s) => ({ ...s, fromCity: e.target.value }));
                }
              }}
              className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none ${!form.fromCounty ? "cursor-not-allowed opacity-50" : ""} ${form.fromCity ? "text-gray-900" : "text-gray-500"}`}
            >
              <option value="" className="text-gray-500">
                {form.fromCounty ? "Selectează localitate" : "Selectează mai întâi județul"}
              </option>
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
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, fromCity: "", fromCityManual: false }))}
                className="h-8 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-600 hover:bg-gray-100"
              >
                Listă
              </button>
            </div>
          )}
        </div>

        {/* Details - appear after city is selected */}
        {form.fromCity && (
          <>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: form.fromType === "house" ? "2fr 1fr 1fr" : "2fr 1fr 1fr",
              }}
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Tip Proprietate *
                </label>
                <select
                  value={form.fromType || "flat"}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      fromType: e.target.value as "house" | "flat" | "office",
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="flat">Apartament</option>
                  <option value="house">Casă</option>
                  <option value="office">Birou / Office</option>
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>
              {form.fromType === "house" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Etaje *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.fromFloor || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, fromFloor: e.target.value.replace(/\D/g, "") }))
                    }
                    placeholder="ex: 2"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}
              {(form.fromType === "flat" || form.fromType === "office") && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Etaj *</label>
                  <input
                    value={form.fromFloor || ""}
                    onChange={(e) => setForm((s) => ({ ...s, fromFloor: e.target.value }))}
                    placeholder="ex: 3"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            {(form.fromType === "flat" || form.fromType === "office") && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Lift *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, fromElevator: true }))}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${form.fromElevator === true
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                      }`}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, fromElevator: false }))}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${form.fromElevator === false
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                      }`}
                  >
                    Nu
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Step 2: TO Location (county + city + details)
  const renderStep2 = () => (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow">
          <Home className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Unde te muți?</span>
      </div>

      <div className="space-y-2">
        {/* County */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Județ *</label>
          <select
            value={form.toCounty || ""}
            onChange={(e) =>
              setForm((s) => ({ ...s, toCounty: e.target.value, toCity: "", toCityManual: false }))
            }
            className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none ${form.toCounty ? "text-gray-900" : "text-gray-500"}`}
          >
            <option value="" className="text-gray-500">
              Selectează județ
            </option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Localitate *</label>
          {!form.toCityManual ? (
            <select
              value={form.toCity || ""}
              disabled={!form.toCounty}
              onChange={(e) => {
                if (e.target.value === "__manual__") {
                  setForm((s) => ({ ...s, toCity: "", toCityManual: true }));
                } else {
                  setForm((s) => ({ ...s, toCity: e.target.value }));
                }
              }}
              className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none ${!form.toCounty ? "cursor-not-allowed opacity-50" : ""} ${form.toCity ? "text-gray-900" : "text-gray-500"}`}
            >
              <option value="" className="text-gray-500">
                {form.toCounty ? "Selectează localitate" : "Selectează mai întâi județul"}
              </option>
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
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setForm((s) => ({ ...s, toCity: "", toCityManual: false }))}
                className="h-8 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-600 hover:bg-gray-100"
              >
                Listă
              </button>
            </div>
          )}
        </div>

        {/* Details - appear after city is selected */}
        {form.toCity && (
          <>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: form.toType === "house" ? "2fr 1fr 1fr" : "2fr 1fr 1fr",
              }}
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Tip Proprietate *
                </label>
                <select
                  value={form.toType || "flat"}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      toType: e.target.value as "house" | "flat" | "office",
                    }))
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
                >
                  <option value="flat">Apartament</option>
                  <option value="house">Casă</option>
                  <option value="office">Birou / Office</option>
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
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
                />
              </div>
              {form.toType === "house" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Etaje *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.toFloor || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, toFloor: e.target.value.replace(/\D/g, "") }))
                    }
                    placeholder="ex: 2"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              )}
              {(form.toType === "flat" || form.toType === "office") && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Etaj *</label>
                  <input
                    value={form.toFloor || ""}
                    onChange={(e) => setForm((s) => ({ ...s, toFloor: e.target.value }))}
                    placeholder="ex: 5"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-center text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            {(form.toType === "flat" || form.toType === "office") && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Lift *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, toElevator: true }))}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${form.toElevator === true
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300"
                      }`}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, toElevator: false }))}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${form.toElevator === false
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300"
                      }`}
                  >
                    Nu
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  // Step 3: Move Date
  const renderStep3 = () => (
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
            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${form.moveDateMode === opt.value
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

  // Step 4: Services
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Ce servicii ai nevoie?</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            {
              key: "serviceMoving",
              label: "Mutare Completă",
              desc: "Transport mobilier și obiecte",
            },
            { key: "servicePacking", label: "Ambalare", desc: "Împachetare profesională" },
            { key: "serviceDisassembly", label: "Montaj", desc: "Demontare/montare mobilier" },
            { key: "serviceCleanout", label: "Debarasare", desc: "Aruncare lucruri" },
            { key: "serviceStorage", label: "Depozitare", desc: "Stocare temporară" },
            {
              key: "serviceTransportOnly",
              label: "Doar Transport",
              desc: "Fără încărcare/descărcare",
            },
          ].map((svc) => (
            <label
              key={svc.key}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition ${(form as Record<string, boolean>)[svc.key]
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
                <span className="block text-xs text-gray-500">{svc.desc}</span>
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
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>
    </div>
  );

  // Step 5: Survey Type
  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"

              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="font-semibold text-gray-800">Tip evaluare *</span>
        </div>
        <p className="mb-3 text-xs text-gray-500">Cum preferi să primești oferta?</p>

        <div className="grid grid-cols-1 gap-2">
          {[
            {
              value: "in-person",
              label: "Evaluare la fața locului",
              desc: "Un specialist vine să evalueze volumul",
            },
            { value: "video", label: "Video-evaluare", desc: "Consultație video pentru estimare" },
            {
              value: "quick-estimate",
              label: "Estimare rapidă",
              desc: "Ofertă bazată pe informații",
            },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${form.surveyType === opt.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-200"
                }`}
            >
              <input
                type="radio"
                name="surveyType"
                value={opt.value}
                checked={form.surveyType === opt.value}
                onChange={(e) => setForm((s) => ({ ...s, surveyType: e.target.value as any }))}
                className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                <span className="block text-xs text-gray-500">{opt.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 6: Media Upload
  const renderStep6 = () => {
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

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"

                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"

                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-semibold text-gray-800">Fotografii / Video</span>
          </div>
          <p className="mb-3 text-xs text-gray-500">Ajută firmele să-ți facă oferte mai precise</p>

          <div className="grid grid-cols-1 gap-2">
            {[
              { value: "now", label: "Încarcă acum", desc: "Adaugă fotografii sau video imediat" },
              {
                value: "later",
                label: "Primește link",
                desc: "Vei primi un email cu link de încărcare",
              },
              {
                value: "list",
                label: "Am o listă de lucruri",
                desc: "Scrie ce ai de mutat (listă de obiecte)",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${form.mediaUpload === opt.value
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-200"
                  }`}
              >
                <input
                  type="radio"
                  name="mediaUpload"
                  value={opt.value}
                  checked={form.mediaUpload === opt.value}
                  onChange={(e) => setForm((s) => ({ ...s, mediaUpload: e.target.value as any }))}
                  className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                  <span className="block text-xs text-gray-500">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Upload zone when "now" is selected */}
          {form.mediaUpload === "now" && (
            <div className="mt-4 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  handleAddFiles(e.target.files);
                  e.currentTarget.value = "";
                }}
                className="hidden"
                id="heroMediaUpload"
              />
              <label htmlFor="heroMediaUpload" className="cursor-pointer">
                <svg
                  className="mx-auto h-10 w-10 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"

                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-700">Click pentru a încărca</p>
                <p className="mt-1 text-xs text-gray-500">Poze sau video (max 50MB)</p>
              </label>

              {/* File List */}
              {form.mediaFiles && form.mediaFiles.length > 0 && (
                <div className="mt-3 space-y-2 text-left">
                  <p className="text-xs font-semibold text-gray-700">
                    {form.mediaFiles.length} fișier(e) selectate
                  </p>
                  {form.mediaFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-2 py-1.5"
                    >
                      <span className="truncate text-xs text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(i)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info when "later" is selected */}
          {form.mediaUpload === "later" && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                📧 Vei primi un email cu link personalizat pentru încărcarea pozelor sau
                videoclipurilor cu ce ai de mutat.
              </p>
            </div>
          )}

          {/* Items list textarea when "list" is selected */}
          {form.mediaUpload === "list" && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Lista de lucruri de mutat
              </label>
              <textarea
                value={form.itemsList || ""}
                onChange={(e) => setForm((s) => ({ ...s, itemsList: e.target.value }))}
                placeholder="Ex: canapea 3 locuri, dulap dormitor, masă sufragerie, 10 cutii cărți..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Scrie obiectele principale pe care le ai de mutat
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-500">
          Fotografiile ajută firmele să estimeze mai exact volumul și costul mutării.
        </p>
      </div>
    );
  };

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
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Nume *</label>
              <input
                value={form.contactLastName || ""}
                onChange={(e) => setForm((s) => ({ ...s, contactLastName: e.target.value }))}
                placeholder="Popescu"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
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
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Email *</label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="exemplu@email.com"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
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

  const stepLabels = ["Plecare", "Destinație", "Când", "Servicii", "Evaluare", "Media", "Contact"];

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Progress Steps with Labels */}
      <div className="mb-4 flex items-start justify-center gap-1">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(step)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${currentStep === step
                    ? "bg-emerald-500 text-white shadow-lg"
                    : currentStep > step
                      ? "bg-emerald-200 text-emerald-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {step}
              </button>
              <span
                className={`mt-1 text-[10px] ${currentStep === step ? "font-semibold text-emerald-600" : "text-gray-500"}`}
              >
                {stepLabels[step - 1]}
              </span>
            </div>
            {step < TOTAL_STEPS && (
              <div
                className={`mt-3.5 h-0.5 w-4 rounded ${currentStep > step ? "bg-emerald-300" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting the form - only allow button click
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
      >
        {/* Form Steps */}
        <div className="min-h-64">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
          {currentStep === 7 && renderStep7()}
        </div>

        {/* Navigation */}
        <div className="mt-1 flex gap-3">
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
        ✓ 100% gratuit • Fără obligații
      </p>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
              Mulțumim pentru cerere! 🎉
            </h2>

            {/* Request code */}
            {submittedRequestCode && (
              <p className="mb-4 text-center text-sm text-gray-600">
                Codul cererii tale:{" "}
                <span className="font-semibold text-emerald-600">{submittedRequestCode}</span>
              </p>
            )}

            {/* Message */}
            <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-center">
              <p className="text-sm text-gray-700">
                <strong>Vei primi 3-5 oferte în maxim 24h</strong> de la firme de mutări verificate.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Ofertele vor fi trimise pe adresa de email furnizată.
              </p>
            </div>

            {/* Account creation CTA */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <span className="font-semibold text-gray-800">Creează-ți cont gratuit</span>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                Cu un cont poți vedea toate ofertele, comunica direct cu transportatorii și gestiona
                mutarea ta.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/customer/auth"
                  className="flex-1 rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Creează cont
                </Link>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Mai târziu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


