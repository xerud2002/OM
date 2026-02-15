"use client";

import { useState, useEffect, useCallback } from "react";
import { trackCalculatorUsage } from "@/utils/analytics";
import { motion } from "framer-motion";
import Link from "next/link";
import counties from "@/data/counties";
import cities from "@/data/cities";

export default function SavingsCalculator() {
  const [propertyType, setPropertyType] = useState<"apartament" | "casa" | "birou">("apartament");
  const [rooms, setRooms] = useState("2");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  // Get cities for a county (same logic as RequestForm)
  const getCityOptions = (selectedCounty?: string) => {
    if (selectedCounty === "București") {
      return ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"];
    }
    return selectedCounty && (cities as Record<string, string[]>)[selectedCounty]
      ? (cities as Record<string, string[]>)[selectedCounty]
      : [];
  };

  // Build serviceType key from property + rooms
  const getServiceKey = useCallback(() => {
    if (propertyType === "birou") {
      return parseInt(rooms) <= 2 ? "birou-mic" : "birou-mare";
    }
    return `${propertyType}-${rooms}`;
  }, [propertyType, rooms]);

  // Track usage
  useEffect(() => {
    const timer = setTimeout(() => {
      const { minPrice, maxPrice } = calculatePrices(getServiceKey(), county);
      trackCalculatorUsage(getServiceKey(), county || "necunoscut", (minPrice + maxPrice) / 2);
    }, 600);

    return () => clearTimeout(timer);
  }, [propertyType, rooms, county, getServiceKey]);

  const calculatePrices = (type: string, selectedCounty: string) => {
    const basePrices: Record<string, number> = {
      // Apartament
      "apartament-1": 600,
      "apartament-2": 900,
      "apartament-3": 1400,
      "apartament-4": 2000,
      "apartament-5": 2500,
      // Casă
      "casa-1": 800,
      "casa-2": 1800,
      "casa-3": 2500,
      "casa-4": 3500,
      "casa-5": 4500,
      // Birou
      "birou-mic": 1500,
      "birou-mare": 3000,
    };

    const countyMultiplier: Record<string, number> = {
      "București": 1.2,
      "Ilfov": 1.15,
      "Cluj": 1.15,
      "Timiș": 1.1,
      "Brașov": 1.1,
      "Constanța": 1.08,
      "Iași": 1.08,
      "Sibiu": 1.08,
      "Prahova": 1.05,
      "Argeș": 1.05,
      "Mureș": 1.05,
      "Dolj": 1.05,
      "Arad": 1.05,
      "Bihor": 1.05,
      "Galați": 1.02,
      "Bacău": 1.02,
      "Hunedoara": 1.02,
      "Maramureș": 1.02,
      "Suceava": 1.0,
      "Neamț": 1.0,
      "Gorj": 1.0,
      "Vâlcea": 1.0,
      "Olt": 1.0,
      "Teleorman": 0.98,
      "Mehedinți": 0.98,
      "Tulcea": 0.98,
      "Giurgiu": 0.98,
      "Călărași": 0.98,
      "Ialomița": 0.98,
      "Botoșani": 0.95,
      "Vaslui": 0.95,
      "Sălaj": 0.95,
      "Covasna": 0.95,
      "Harghita": 0.95,
    };

    const basePrice = basePrices[type] || 900;
    const multiplier = countyMultiplier[selectedCounty] || 1.0;

    const estimatedAvg = Math.round(basePrice * multiplier);
    const minPrice = Math.round(estimatedAvg * 0.85);
    const maxPrice = Math.round(estimatedAvg * 1.25);

    return { minPrice, maxPrice };
  };

  const { minPrice, maxPrice } = calculatePrices(getServiceKey(), county);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-50 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-50 blur-3xl"></div>

      <div className="relative p-6 md:p-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 shadow-lg shadow-orange-500/20 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
              <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75Zm-5.25-.75a.75.75 0 0 0 0 1.5h-2.25a.75.75 0 0 0 0-1.5h2.25ZM12 5.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75h6Zm-6 9a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Zm9.75 0a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 0-1.5h-2.25Z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="mb-2 text-3xl font-bold text-gray-900">Estimator Cost Mutare</h3>
          <p className="max-w-md text-gray-600">
            Calculează un buget estimativ pentru mutarea ta în funcție de prețurile actuale din piață.
          </p>
        </div>

        {/* Row 1: Property Type + Rooms */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          {/* Tip Proprietate */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-purple-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              Tip Proprietate
            </label>
            <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as "apartament" | "casa" | "birou")}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 p-4 font-medium text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="apartament">Apartament</option>
                <option value="casa">Casă</option>
                <option value="birou">Birou / Office</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Camere */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              </div>
              {propertyType === "birou" ? "Mărime" : "Număr Camere"}
            </label>
            <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 p-4 font-medium text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
              >
                {propertyType === "birou" ? (
                  <>
                    <option value="1">Mic (1-2 birouri)</option>
                    <option value="3">Mare (3+ birouri)</option>
                  </>
                ) : (
                  <>
                    <option value="1">1 cameră</option>
                    <option value="2">2 camere</option>
                    <option value="3">3 camere</option>
                    <option value="4">4 camere</option>
                    <option value="5">5+ camere</option>
                  </>
                )}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: County + City */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          {/* Județ */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
              </div>
              Județ
            </label>
            <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
              <select
                value={county}
                onChange={(e) => {
                  setCounty(e.target.value);
                  setCity("");
                }}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 p-4 font-medium text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="">Selectează județ</option>
                {counties.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Localitate */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              Localitate
            </label>
            <div className="relative transition-transform duration-200 group-hover:-translate-y-0.5">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!county}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 p-4 font-medium text-gray-900 shadow-sm transition-all focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selectează localitatea</option>
                {getCityOptions(county).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-linear-to-b from-gray-50 to-white ring-1 ring-gray-200">
          <div className="p-6 md:p-8">
            <div className="mb-8 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">Buget Estimat</p>
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <motion.div
                  key={`min-${minPrice}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-extrabold text-gray-900 md:text-5xl"
                >
                  {minPrice}
                </motion.div>
                <span className="text-2xl font-light text-gray-300 md:text-4xl">-</span>
                <motion.div
                  key={`max-${maxPrice}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-extrabold text-gray-900 md:text-5xl"
                >
                  {maxPrice} <span className="text-xl font-bold text-orange-600 md:text-3xl">RON</span>
                </motion.div>
              </div>
            </div>

            <div className="mb-8 rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-800">
              <div className="mb-1 flex items-center justify-center gap-2 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                Ce include acest preț?
              </div>
              <p className="opacity-90">
                Manipulare, transport și asigurare de bază. Prețul final poate varia în funcție de etaj, lift și distanță.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <Link
                href="/"
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gray-900 px-8 py-4 font-bold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-gray-800 hover:shadow-gray-900/30 hover:-translate-y-0.5 md:w-auto md:min-w-[280px]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  Vezi Oferte Exacte
                </span>
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                Serviciu gratuit și fără obligații
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


