"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  ArrowRightIcon as ArrowRight,
  MapPinIcon as MapPin,
  HomeIcon as Home,
  SparklesIcon as Sparkles,
  CalendarIcon as Calendar,
  UserIcon as User,
  CubeIcon as Package,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
  CheckCircleIcon as CheckCircle,
  XMarkIcon as X,
  EnvelopeIcon as Mail,
} from "@heroicons/react/24/outline";
import type { FormShape } from "@/components/customer/RequestForm";
import { logger } from "@/utils/logger";

// Location Autocomplete Component using localapi.ro
type LocalApiResult = {
  id: string;
  name: string;
  county: string;
  full: string;
};

function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  hasError,
}: {
  value: { city: string; county: string };
  onChange: (city: string, county: string) => void;
  placeholder?: string;
  label?: string;
  hasError?: boolean;
}) {
  const [inputValue, setInputValue] = useState(
    value.city && value.county ? `${value.city}, ${value.county}` : "",
  );
  const [suggestions, setSuggestions] = useState<LocalApiResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const listboxId = useRef(`loc-listbox-${Math.random().toString(36).slice(2,8)}`).current;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync input value when external value changes
  useEffect(() => {
    if (value.city && value.county) {
      setInputValue(`${value.city}, ${value.county}`);
    } else {
      setInputValue("");
    }
  }, [value.city, value.county]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/locations/search?q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();

      // API already returns normalized format
      if (Array.isArray(data)) {
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      logger.error("LocalAPI error:", err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowDropdown(true);
    setActiveIndex(-1);

    // Clear previous selection
    if (value.city || value.county) {
      onChange("", "");
    }

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (item: LocalApiResult) => {
    setInputValue(item.full);
    onChange(item.name, item.county);
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("", "");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="mb-1 block text-xs font-medium text-gray-600">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Caută oraș sau localitate..."}
          role="combobox"
          aria-expanded={showDropdown && suggestions.length > 0}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          aria-autocomplete="list"
          aria-label={label || placeholder || "Caută oraș sau localitate"}
          className={`w-full rounded-lg border bg-white px-3 py-2 pr-8 text-sm focus:outline-none ${
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          } ${
            value.city && value.county ? "text-gray-900" : "text-gray-700"
          }`}
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500" role="status">Se caută...</div>
          ) : (
            <ul ref={listboxRef} id={listboxId} role="listbox" className="max-h-48 overflow-auto py-1">
              {suggestions.map((item, idx) => (
                <li
                  key={item.id}
                  id={`${listboxId}-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onClick={() => handleSelect(item)}
                  className={`cursor-pointer px-3 py-2 text-sm flex items-center justify-between ${idx === activeIndex ? "bg-emerald-50 text-emerald-800" : "hover:bg-emerald-50"}`}
                >
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    jud. {item.county}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Format date as YYYY-MM-DD
const formatYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const STORAGE_KEY = "homeRequestForm";
const TOTAL_STEPS = 6;

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
  const [focusDay, setFocusDay] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
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
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
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

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    const current = focusDay || (value ? new Date(`${value}T00:00:00`).getDate() : 1);
    let next = current;
    if (e.key === "ArrowRight") { e.preventDefault(); next = Math.min(current + 1, daysInMonth); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); next = Math.max(current - 1, 1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); next = Math.min(current + 7, daysInMonth); }
    else if (e.key === "ArrowUp") { e.preventDefault(); next = Math.max(current - 7, 1); }
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!isDateDisabled(current)) handleSelect(current);
      return;
    }
    else return;
    setFocusDay(next);
    // Focus the button
    const btn = gridRef.current?.querySelector(`[data-day="${next}"]`) as HTMLButtonElement;
    btn?.focus();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3" role="group" aria-label="Calendar selectare dată">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Luna anterioară"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-gray-800" aria-live="polite">
          {roMonthsFull[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Luna următoare"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1" role="row">
        {roWeekdaysShort.map((wd) => (
          <div
            key={wd}
            className="text-center text-xs font-medium text-gray-400"
            role="columnheader"
            aria-label={wd}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div ref={gridRef} className="grid grid-cols-7 gap-1" role="grid" aria-label="Zile disponibile" onKeyDown={handleCalendarKeyDown}>
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
              data-day={day}
              onClick={() => handleSelect(day)}
              disabled={disabled}
              role="gridcell"
              aria-selected={selected}
              aria-label={`${day} ${roMonthsFull[month]} ${year}`}
              tabIndex={selected || (focusDay === day) ? 0 : -1}
              className={`h-8 w-full rounded-lg text-sm font-medium transition ${
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

// Inline Range Calendar Component for flexible date selection
function InlineRangeCalendar({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  minDate,
}: {
  startDate: string;
  endDate: string;
  onChangeStart: (date: string) => void;
  onChangeEnd: (date: string) => void;
  minDate: string;
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    if (startDate) return new Date(`${startDate}T00:00:00`);
    return today;
  });
  const [selectingEnd, setSelectingEnd] = useState(false);

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

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
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
    if (date < minD) return true;
    // If selecting end date, disable dates before start
    if (selectingEnd && startDate) {
      const startD = new Date(`${startDate}T00:00:00`);
      startD.setHours(0, 0, 0, 0);
      if (date < startD) return true;
    }
    return false;
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    const selected = new Date(`${startDate}T00:00:00`);
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    const selected = new Date(`${endDate}T00:00:00`);
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    );
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(year, month, day);
    const startD = new Date(`${startDate}T00:00:00`);
    const endD = new Date(`${endDate}T00:00:00`);
    date.setHours(0, 0, 0, 0);
    startD.setHours(0, 0, 0, 0);
    endD.setHours(0, 0, 0, 0);
    return date > startD && date < endD;
  };

  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const handleSelect = (day: number) => {
    if (isDateDisabled(day)) return;
    const date = new Date(year, month, day);
    const dateStr = formatDateYMD(date);

    if (!selectingEnd) {
      // Selecting start date
      onChangeStart(dateStr);
      onChangeEnd(""); // Clear end date
      setSelectingEnd(true);
    } else {
      // Selecting end date
      onChangeEnd(dateStr);
      setSelectingEnd(false);
    }
  };

  const handleReset = () => {
    onChangeStart("");
    onChangeEnd("");
    setSelectingEnd(false);
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      {/* Instruction */}
      <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-700">
        {!startDate
          ? "📅 Selectează data de început"
          : !endDate
            ? "📅 Acum selectează data de final"
            : "✓ Interval selectat"}
      </div>

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
          <div
            key={wd}
            className="text-center text-xs font-medium text-gray-400"
          >
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
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);
          const inRange = isInRange(day);
          const todayMark = isToday(day) && !isStart && !isEnd;

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={`h-8 w-full rounded-lg text-sm font-medium transition ${
                disabled
                  ? "cursor-not-allowed text-gray-300"
                  : isStart
                    ? "bg-emerald-500 text-white shadow-sm rounded-r-none"
                    : isEnd
                      ? "bg-emerald-500 text-white shadow-sm rounded-l-none"
                      : inRange
                        ? "bg-emerald-100 text-emerald-700 rounded-none"
                        : todayMark
                          ? "border border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                          : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Reset button */}
      {(startDate || endDate) && (
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Resetează selecția
        </button>
      )}
    </div>
  );
}

interface HomeRequestFormProps {
  /** When provided (e.g. from customer dashboard), auto-fills contact fields */
  user?: { displayName?: string; email?: string; phoneNumber?: string } | null;
}

export default function HomeRequestForm({ user: authUser }: HomeRequestFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRequestCode, setSubmittedRequestCode] = useState<
    string | null
  >(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

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
    email: "",
    serviceMoving: true,
    serviceCleanout: false,
    serviceTransportOnly: false,
    servicePiano: false,
    serviceFewItems: false,
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

  // Auto-fill contact fields from authenticated user (customer dashboard)
  useEffect(() => {
    if (!authUser) return;
    setForm((prev) => {
      const updates: Partial<FormShape> = {};
      if (!prev.contactFirstName && !prev.contactLastName && authUser.displayName) {
        const parts = authUser.displayName.trim().split(/\s+/);
        updates.contactFirstName = parts[0] || "";
        updates.contactLastName = parts.slice(1).join(" ") || "";
      }
      if (!prev.email && authUser.email) {
        updates.email = authUser.email;
      }
      if (!prev.phone && authUser.phoneNumber) {
        updates.phone = authUser.phoneNumber;
      }
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [authUser]);

  // Save form to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form]);

  const today = new Date();
  const minDate = formatYMD(today);

  // Calendar helpers for a friendlier UX
  const roWeekdays = [
    "Duminică",
    "Luni",
    "Marți",
    "Miercuri",
    "Joi",
    "Vineri",
    "Sâmbătă",
  ];
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
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      // Only submit if we're on the last step
      if (currentStep !== TOTAL_STEPS) {
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

      // Validate phone - must have at least 6 digits
      const phoneDigits = (form.phone || "").replace(/\D/g, "");
      if (form.phone && phoneDigits.length < 6) {
        errors.push("Număr de telefon prea scurt");
      }

      // Validate email format
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.push("Format email invalid");
      }

      if (errors.length > 0) {
        // Build field-level error map for ALL invalid fields
        const errs: Record<string, boolean> = {};
        if (!form.fromCity || !form.fromCounty) errs.fromCity = true;
        if (!form.fromRooms) errs.fromRooms = true;
        if (!form.toCity || !form.toCounty) errs.toCity = true;
        if (!form.toRooms) errs.toRooms = true;
        if (!form.contactFirstName) errs.contactFirstName = true;
        if (!form.contactLastName) errs.contactLastName = true;
        if (!form.phone || phoneDigits.length < 6) errs.phone = true;
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = true;
        if (!form.acceptedTerms) errs.acceptedTerms = true;
        setFieldErrors(errs);
        toast.error("Completează câmpurile obligatorii marcate cu roșu.");
        setIsSubmitting(false);
        return;
      }

      try {
        let requestCode: string | null = null;

        const response = await fetch("/api/requests/createGuest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          const result = await response.json();
          requestCode = result.data.requestCode;
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
          serviceCleanout: false,
          serviceTransportOnly: false,
          servicePiano: false,
          serviceFewItems: false,
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
            parseInt(String(form.fromRooms || 0), 10),
          );
        } catch {
          // Ignore analytics errors
        }
      } catch (error: any) {
        logger.error("Submit error:", error);
        toast.error(
          error.message ||
            "Eroare la trimiterea cererii. Te rugăm să încerci din nou.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, currentStep],
  );

  const nextStep = useCallback(async () => {
    const { toast } = await import("sonner");

    // Validate step 1 before moving to step 2
    if (currentStep === 1) {
      const errs: Record<string, boolean> = {};
      if (!form.fromCity || !form.fromCounty) errs.fromCity = true;
      if (!form.fromRooms) errs.fromRooms = true;
      if (Object.keys(errs).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...errs }));
        toast.error("Completează câmpurile obligatorii marcate cu roșu.");
        return;
      }
    }

    // Validate step 2 before moving to step 3
    if (currentStep === 2) {
      const errs: Record<string, boolean> = {};
      if (!form.toCity || !form.toCounty) errs.toCity = true;
      if (!form.toRooms) errs.toRooms = true;
      if (Object.keys(errs).length > 0) {
        setFieldErrors((prev) => ({ ...prev, ...errs }));
        toast.error("Completează câmpurile obligatorii marcate cu roșu.");
        return;
      }
    }

    // Validate step 4 before moving to step 5
    if (currentStep === 4) {
      if (!form.details || form.details.trim().length < 50) {
        setFieldErrors((prev) => ({ ...prev, details: true }));
        toast.error("Adaugă cel puțin 50 de caractere în câmpul de detalii.");
        return;
      }
    }

    setFieldErrors({});
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [currentStep, form]);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  // Step 1: FROM Location (county + city + details)
  const renderStep1 = () => (
    <div className="rounded-xl border border-emerald-200 bg-linear-to-br from-emerald-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">De unde te muți?</span>
      </div>

      <div className="space-y-2">
        {/* Location Autocomplete */}
        <LocationAutocomplete
          value={{ city: form.fromCity || "", county: form.fromCounty || "" }}
          onChange={(city, county) => {
            setForm((s) => ({ ...s, fromCity: city, fromCounty: county }));
            if (city && county) setFieldErrors((prev) => { const n = { ...prev }; delete n.fromCity; return n; });
          }}
          label="Localitate *"
          placeholder="Caută oraș sau localitate..."
          hasError={!!fieldErrors.fromCity}
        />

        {/* Details - appear after city is selected */}
        {form.fromCity && (
          <>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns:
                  form.fromType === "house"
                    ? "1.4fr 1fr 1fr"
                    : "1.4fr 1fr 1.2fr",
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
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Nr. Camere *
                </label>
                <select
                  value={form.fromRooms || ""}
                  onChange={(e) => {
                    setForm((s) => ({ ...s, fromRooms: e.target.value }));
                    if (e.target.value) setFieldErrors((prev) => { const n = { ...prev }; delete n.fromRooms; return n; });
                  }}
                  className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none ${
                    fieldErrors.fromRooms
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                >
                  <option value="">-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              {form.fromType === "house" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Etaje *
                  </label>
                  <select
                    value={form.fromFloor || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, fromFloor: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
              )}
              {(form.fromType === "flat" || form.fromType === "office") && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Etaj *
                  </label>
                  <select
                    value={form.fromFloor || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, fromFloor: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-</option>
                    <option value="Demisol">Demisol</option>
                    <option value="Parter">Parter</option>
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {(form.fromType === "flat" || form.fromType === "office") && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Lift *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((s) => ({ ...s, fromElevator: true }))
                    }
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${
                      form.fromElevator === true
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                    }`}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((s) => ({ ...s, fromElevator: false }))
                    }
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${
                      form.fromElevator === false
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
    <div className="rounded-xl border border-sky-200 bg-linear-to-br from-sky-50/50 to-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 shadow">
          <Home className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-gray-800">Unde te muți?</span>
      </div>

      <div className="space-y-2">
        {/* Location Autocomplete */}
        <LocationAutocomplete
          value={{ city: form.toCity || "", county: form.toCounty || "" }}
          onChange={(city, county) => {
            setForm((s) => ({ ...s, toCity: city, toCounty: county }));
            if (city && county) setFieldErrors((prev) => { const n = { ...prev }; delete n.toCity; return n; });
          }}
          label="Localitate *"
          placeholder="Caută oraș sau localitate..."
          hasError={!!fieldErrors.toCity}
        />

        {/* Details - appear after city is selected */}
        {form.toCity && (
          <>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns:
                  form.toType === "house" ? "1.4fr 1fr 1fr" : "1.4fr 1fr 1.2fr",
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
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Nr. Camere *
                </label>
                <select
                  value={form.toRooms || ""}
                  onChange={(e) => {
                    setForm((s) => ({ ...s, toRooms: e.target.value }));
                    if (e.target.value) setFieldErrors((prev) => { const n = { ...prev }; delete n.toRooms; return n; });
                  }}
                  className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none ${
                    fieldErrors.toRooms
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  }`}
                >
                  <option value="">-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              {form.toType === "house" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Etaje *
                  </label>
                  <select
                    value={form.toFloor || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, toFloor: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
              )}
              {(form.toType === "flat" || form.toType === "office") && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Etaj *
                  </label>
                  <select
                    value={form.toFloor || ""}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, toFloor: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-sky-500 focus:outline-none"
                  >
                    <option value="">-</option>
                    <option value="Demisol">Demisol</option>
                    <option value="Parter">Parter</option>
                    {[...Array(20)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {(form.toType === "flat" || form.toType === "office") && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Lift *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, toElevator: true }))}
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${
                      form.toElevator === true
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-sky-300"
                    }`}
                  >
                    Da
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((s) => ({ ...s, toElevator: false }))
                    }
                    className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition ${
                      form.toElevator === false
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
          { value: "urgent", label: "Urgent" },
          { value: "flexible", label: "Flexibil" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              setForm((s) => ({
                ...s,
                moveDateMode: opt.value as "exact" | "flexible" | "urgent",
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

      {form.moveDateMode === "urgent" && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center space-y-2">
          <p className="text-sm font-medium text-red-700">
            🚨 Mutare urgentă - în următoarele 24-48 ore
          </p>
          <p className="text-xs text-red-600">
            Companiile vor fi notificate imediat și vei primi oferte prioritare.
          </p>
        </div>
      )}
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
          <InlineRangeCalendar
            startDate={form.moveDateStart || ""}
            endDate={form.moveDateEnd || ""}
            onChangeStart={(date) =>
              setForm((s) => ({ ...s, moveDateStart: date }))
            }
            onChangeEnd={(date) =>
              setForm((s) => ({ ...s, moveDateEnd: date }))
            }
            minDate={minDate}
          />
          {form.moveDateStart && form.moveDateEnd && (
            <p className="text-center text-sm font-medium text-emerald-600">
              📅 {formatWeekdayPreview(form.moveDateStart)} →{" "}
              {formatWeekdayPreview(form.moveDateEnd)}
            </p>
          )}
        </div>
      )}
    </div>
  );

  // Step 4: Services
  const renderStep4 = () => (
    <div className="space-y-4">
      {/* Main service type */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">Tip serviciu</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {[
            {
              value: "full",
              label: "Mutare completă",
              desc: "Cu ajutor pentru încărcare/descărcare",
            },
            {
              value: "transport",
              label: "Doar câteva lucruri",
              desc: "Am o lista",
            },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                (opt.value === "full" &&
                  form.serviceMoving &&
                  !form.serviceTransportOnly) ||
                (opt.value === "transport" && form.serviceTransportOnly)
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-200"
              }`}
            >
              <input
                type="radio"
                name="serviceType"
                checked={
                  (opt.value === "full" &&
                    form.serviceMoving &&
                    !form.serviceTransportOnly) ||
                  (opt.value === "transport" && form.serviceTransportOnly)
                }
                onChange={() => {
                  if (opt.value === "full") {
                    setForm((s) => ({
                      ...s,
                      serviceMoving: true,
                      serviceTransportOnly: false,
                    }));
                  } else {
                    setForm((s) => ({
                      ...s,
                      serviceMoving: false,
                      serviceTransportOnly: true,
                    }));
                  }
                }}
                className="h-4 w-4 shrink-0 border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm leading-tight text-gray-700">
                <span className="font-medium">{opt.label}</span>
                <span className="block text-xs text-gray-500">{opt.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Detalii
        </label>
        <textarea
          value={form.details || ""}
          onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
          rows={3}
          minLength={50}
          placeholder="Descrie ce trebuie mutat: mobilier, electrocasnice, cutii, obiecte fragile, acces dificil..."
          className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none ${
            fieldErrors.details ? "border-red-400" : "border-gray-200"
          }`}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={`${
            (form.details?.length || 0) < 50 ? "text-red-500" : "text-green-600"
          }`}>
            {form.details?.length || 0}/50 caractere minim
          </span>
        </div>
      </div>
    </div>
  );

  // Step 5: Media Upload
  const renderStep5 = () => {
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
            <span className="font-semibold text-gray-800">
              Fotografii / Video
            </span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Ajută firmele să-ți facă oferte mai precise
          </p>

          <div className="grid grid-cols-1 gap-2">
            {[
              {
                value: "now",
                label: "Încarcă acum",
                desc: "Adaugă fotografii sau video imediat",
              },
              {
                value: "later",
                label: "Primește link",
                desc: "Vei primi un email cu link de încărcare",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                  form.mediaUpload === opt.value
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-200"
                }`}
              >
                <input
                  type="radio"
                  name="mediaUpload"
                  value={opt.value}
                  checked={form.mediaUpload === opt.value}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      mediaUpload: e.target.value as any,
                    }))
                  }
                  className="h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {opt.desc}
                  </span>
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
                <p className="mt-2 text-sm font-medium text-gray-700">
                  Click pentru a încărca
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Poze sau video (max 50MB)
                </p>
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
                      <span className="truncate text-xs text-gray-700">
                        {file.name}
                      </span>
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
                📧 Vei primi un email cu link personalizat pentru încărcarea
                pozelor sau videoclipurilor cu ce ai de mutat.
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-500">
          Fotografiile ajută firmele să estimeze mai exact volumul și costul
          mutării.
        </p>
      </div>
    );
  };

  // Step 6: Contact
  const renderStep6 = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <User className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-gray-800">
            Datele tale de contact
          </span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Prenume *
              </label>
              <input
                value={form.contactFirstName || ""}
                onChange={(e) => {
                  setForm((s) => ({ ...s, contactFirstName: e.target.value }));
                  if (e.target.value) setFieldErrors((prev) => { const n = { ...prev }; delete n.contactFirstName; return n; });
                }}
                placeholder="Ion"
                className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none ${
                  fieldErrors.contactFirstName
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Nume *
              </label>
              <input
                value={form.contactLastName || ""}
                onChange={(e) => {
                  setForm((s) => ({ ...s, contactLastName: e.target.value }));
                  if (e.target.value) setFieldErrors((prev) => { const n = { ...prev }; delete n.contactLastName; return n; });
                }}
                placeholder="Popescu"
                className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none ${
                  fieldErrors.contactLastName
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Telefon *
            </label>
            <input
              type="text"
              value={form.phone || ""}
              onChange={(e) => {
                setForm((s) => ({ ...s, phone: e.target.value }));
                if (e.target.value) setFieldErrors((prev) => { const n = { ...prev }; delete n.phone; return n; });
              }}
              placeholder="Număr de telefon"
              className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none ${
                fieldErrors.phone
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Email *
            </label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => {
                setForm((s) => ({ ...s, email: e.target.value }));
                if (e.target.value) setFieldErrors((prev) => { const n = { ...prev }; delete n.email; return n; });
              }}
              placeholder="exemplu@email.com"
              className={`w-full rounded-lg border bg-white px-3 py-1.5 text-sm focus:outline-none ${
                fieldErrors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Terms */}
      <label className={`flex items-start gap-2 rounded-lg border p-3 ${
        fieldErrors.acceptedTerms ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
      }`}>
        <input
          type="checkbox"
          checked={!!form.acceptedTerms}
          onChange={(e) => {
            setForm((s) => ({ ...s, acceptedTerms: e.target.checked }));
            if (e.target.checked) setFieldErrors((prev) => { const n = { ...prev }; delete n.acceptedTerms; return n; });
          }}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-xs text-gray-600">
          Accept{" "}
          <Link
            href="/terms"
            className="text-emerald-600 underline hover:text-emerald-700"
          >
            termenii
          </Link>{" "}
          și{" "}
          <Link
            href="/privacy"
            className="text-emerald-600 underline hover:text-emerald-700"
          >
            politica de confidențialitate
          </Link>
          .
        </span>
      </label>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          // Prevent Enter key from submitting the form on any element
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        {/* Step announcement for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Pasul {currentStep} din {TOTAL_STEPS}
        </div>
        {/* Form Steps */}
        <div>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>

        {/* Navigation */}
        <div className="mt-3 flex gap-3">
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
              type="button"
              onClick={handleSubmit}
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
        ✓ 100% gratuit • Fără obligații
      </p>

      {/* Success Modal - rendered via portal to escape container */}
      {showSuccessModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4">
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
                  <span className="font-semibold text-emerald-600">
                    {submittedRequestCode}
                  </span>
                </p>
              )}

              {/* Message */}
              <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-center">
                <p className="text-sm text-gray-700">
                  <strong>Vei primi 3-5 oferte în maxim 24h</strong> de la firme
                  de mutări verificate.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Ofertele vor fi trimise pe adresa de email furnizată.
                </p>
              </div>

              {/* Account creation CTA */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-gray-800">
                    Creează-ți cont gratuit
                  </span>
                </div>
                <p className="mb-3 text-sm text-gray-600">
                  Cu un cont poți vedea toate ofertele, comunica direct cu
                  transportatorii și gestiona mutarea ta.
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
          </div>,
          document.body,
        )}
    </div>
  );
}
