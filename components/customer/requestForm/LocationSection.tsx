// components/customer/requestForm/LocationSection.tsx
// Reusable location section for From/To addresses

import React from "react";
import counties from "@/counties";
import cities from "@/cities";
import type { FormShape } from "./types";

type LocationType = "from" | "to";

type Props = {
  type: LocationType;
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
};

// Special-case: București sectors as locality options
const bucharestSectors = ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"];

const getCityOptions = (county?: string) => {
  if (county === "București") return bucharestSectors;
  return county && (cities as Record<string, string[]>)[county]
    ? (cities as Record<string, string[]>)[county]
    : [];
};

export default function LocationSection({ type, form, setForm }: Props) {
  const isFrom = type === "from";
  const borderColor = isFrom ? "border-emerald-200" : "border-sky-200";
  const bgGradient = isFrom
    ? "bg-linear-to-br from-emerald-50 to-white"
    : "bg-linear-to-br from-sky-50 to-white";
  const iconBg = isFrom
    ? "bg-linear-to-br from-emerald-500 to-emerald-600"
    : "bg-linear-to-br from-sky-500 to-sky-600";
  const inputFocusColor = isFrom
    ? "focus:border-emerald-500 focus:ring-emerald-500/20"
    : "focus:border-sky-500 focus:ring-sky-500/20";
  const sectionBorder = isFrom ? "border-emerald-100" : "border-sky-100";
  const labelColor = isFrom ? "text-emerald-900" : "text-sky-900";
  const iconTextColor = isFrom ? "text-emerald-600" : "text-sky-600";
  const iconBgSmall = isFrom ? "bg-emerald-100" : "bg-sky-100";

  // Form field keys based on type
  const countyKey = isFrom ? "fromCounty" : "toCounty";
  const cityKey = isFrom ? "fromCity" : "toCity";
  const cityManualKey = isFrom ? "fromCityManual" : "toCityManual";
  const typeKey = isFrom ? "fromType" : "toType";
  const floorKey = isFrom ? "fromFloor" : "toFloor";
  const elevatorKey = isFrom ? "fromElevator" : "toElevator";
  const roomsKey = isFrom ? "fromRooms" : "toRooms";

  const county = form[countyKey] as string | undefined;
  const city = form[cityKey] as string | undefined;
  const cityManual = form[cityManualKey] as boolean | undefined;
  const propertyType = (form[typeKey] as "house" | "flat") || "house";

  return (
    <div className={`rounded-xl border ${borderColor} ${bgGradient} p-6`}>
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} shadow-lg`}
        >
          {isFrom ? (
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          )}
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">
            {isFrom ? "Punct de plecare" : "Destinație"}
          </h4>
          <p className="text-xs text-gray-600">
            {isFrom ? "Detalii despre locația actuală" : "Unde te muți"}
          </p>
        </div>
      </div>

      {/* Property Details */}
      <div className={`mt-4 rounded-lg border ${sectionBorder} bg-white p-3`}>
        <div className="mb-2 flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBgSmall}`}>
            <svg
              className={`h-4 w-4 ${iconTextColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-8 4h10M7 8h10"
              />
            </svg>
          </div>
          <span className={`text-xs font-semibold ${labelColor}`}>Detalii proprietate</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_auto_auto_auto] md:items-end md:justify-start md:justify-items-start">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Tip proprietate <span className="text-red-500">*</span>
            </label>
            <select
              value={propertyType}
              onChange={(e) =>
                setForm((s) => ({ ...s, [typeKey]: e.target.value as "house" | "flat" }))
              }
              className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm shadow-sm transition ${inputFocusColor} focus:ring-2 focus:outline-none`}
            >
              <option value="house">Casă</option>
              <option value="flat">Apartament</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Număr camere <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={(form[roomsKey] as string | number) || ""}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setForm((s) => ({ ...s, [roomsKey]: digits }));
              }}
              required
              className={`w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition ${inputFocusColor} focus:ring-2 focus:outline-none`}
              placeholder="ex: 2"
            />
          </div>
          {propertyType === "flat" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Etaj</label>
                <input
                  placeholder="ex: 3"
                  value={(form[floorKey] as string) || ""}
                  onChange={(e) => setForm((s) => ({ ...s, [floorKey]: e.target.value }))}
                  className={`w-24 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition ${inputFocusColor} focus:ring-2 focus:outline-none`}
                />
              </div>
              <div className="flex items-center">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!form[elevatorKey]}
                    onChange={(e) => setForm((s) => ({ ...s, [elevatorKey]: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span>Lift</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className={`mt-4 rounded-lg border ${sectionBorder} bg-white p-3`}>
        <div className="mb-2 flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${iconBgSmall}`}>
            <svg
              className={`h-4 w-4 ${iconTextColor}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isFrom ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              )}
            </svg>
          </div>
          <span className={`text-xs font-semibold ${labelColor}`}>Detalii adresă</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Județ <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={county || ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, [countyKey]: e.target.value, [cityKey]: "" }))
              }
              className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm shadow-sm transition ${inputFocusColor} focus:ring-2 focus:outline-none`}
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
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Localitate <span className="text-red-500">*</span>
            </label>
            <select
              required={!cityManual}
              value={city || ""}
              onChange={(e) => {
                const value = e.target.value;
                setForm((s) => ({
                  ...s,
                  [cityKey]: value,
                  [cityManualKey]: value === "__other__",
                }));
              }}
              className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm shadow-sm transition ${inputFocusColor} focus:ring-2 focus:outline-none`}
              disabled={!county}
            >
              <option value="">Selectează localitatea</option>
              {getCityOptions(county).map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__other__">Altă localitate</option>
            </select>
            {cityManual && (
              <input
                required
                value={city === "__other__" ? "" : city || ""}
                onChange={(e) => setForm((s) => ({ ...s, [cityKey]: e.target.value }))}
                placeholder="Introdu localitatea"
                className={`mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition ${inputFocusColor} focus:ring-2 focus:outline-none`}
              />
            )}
          </div>
          {/* Strada și Număr eliminate */}
        </div>
        {/* Bloc/Scară/Apartament eliminate */}
      </div>
    </div>
  );
}
