"use client";

import Link from "next/link";
import { MapPinIcon as MapPin } from "@heroicons/react/24/outline";
import { cityData } from "@/utils/citySlugData";

export default function CityLinksSection() {
  // Group cities by tier for better organization
  const tier1Cities = cityData.filter((city) => city.tier === 1);
  const tier2Cities = cityData.filter((city) => city.tier === 2);

  return (
    <section className="border-t border-gray-200 bg-gradient-to-br from-slate-50 to-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 sm:px-4 sm:py-2">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-700">Acoperire Națională</span>
          </div>
          <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-bold text-gray-900 px-4">
            Servicii de Mutări în Toată România
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-gray-600 px-4">
            Compară oferte gratuite de la firme locale verificate în peste 40 de orașe
          </p>
        </div>

        {/* Tier 1 Cities - Major Cities */}
        <div className="mb-8 sm:mb-10">
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Orașe Majore
          </h3>
          <div className="grid gap-2.5 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tier1Cities.map((city) => (
              <Link
                key={city.slug}
                href={`/mutari/${city.slug}`}
                className="group rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-center transition-all hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-emerald-600">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tier 2 Cities - County Capitals */}
        <div>
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
            Reședințe de Județ
          </h3>
          <div className="grid gap-2.5 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {tier2Cities.map((city) => (
              <Link
                key={city.slug}
                href={`/mutari/${city.slug}`}
                className="group rounded-lg border border-gray-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3 text-center transition-all hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-emerald-600">
                  {city.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 text-center">
          <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 px-4">
            Nu găsești orașul tău? Oferim servicii în întreaga țară!
          </p>
          <Link
            href="/customer/auth"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:opacity-95 active:scale-95"
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            Cere Oferte pentru Orașul Tău
          </Link>
        </div>
      </div>
    </section>
  );
}


