"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

// Lazy load the form for better LCP
const HomeRequestForm = dynamic(() => import("./HomeRequestForm"), {
  loading: () => (
    <div className="mx-auto h-105 w-full max-w-md animate-pulse rounded-2xl border border-gray-200 bg-white/50" />
  ),
  ssr: false,
});

function TrustIndicators() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-3 lg:justify-start lg:gap-4">
        <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-[10px] font-medium shadow-sm sm:px-4 sm:py-2 sm:text-sm">
          ✓ Firme Verificate
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-[10px] font-medium shadow-sm sm:px-4 sm:py-2 sm:text-sm">
          ✓ 100% Gratuit
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-[10px] font-medium shadow-sm sm:px-4 sm:py-2 sm:text-sm">
          ⭐ Recenzii
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1.5 text-[10px] font-medium shadow-sm sm:px-4 sm:py-2 sm:text-sm">
          ↗ Economie timp
        </span>
      </div>
    );
  }

  const indicators = [
    { icon: ShieldCheckIcon, label: "Firme Verificate", color: "text-emerald-600" },
    { icon: CheckCircleIcon, label: "100% Gratuit", color: "text-sky-600" },
    { icon: StarIcon, label: "Recenzii", color: "text-amber-500" },
    { icon: ArrowTrendingUpIcon, label: "Economie timp", color: "text-purple-600" },
  ];

  return (
    <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-3 lg:justify-start lg:gap-4">
      {indicators.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-1 whitespace-nowrap text-xs font-medium sm:gap-1.5 sm:text-sm"
        >
          <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
          <span className="text-slate-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [animationsReady, setAnimationsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="request-form" className="relative hidden min-h-[70vh] items-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-12 pb-6 sm:pt-16 sm:pb-10 md:flex lg:pt-20 lg:pb-12">
      {/* Animated Background Elements - simplified for performance */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-[10%] h-75 w-75 rounded-full bg-emerald-200/40 blur-[80px] sm:h-100 sm:w-100 lg:h-125 lg:w-125 lg:blur-[100px]" />
        <div className="absolute right-[5%] bottom-20 hidden h-75 w-75 rounded-full bg-sky-200/40 blur-[80px] sm:block sm:h-100 sm:w-100 lg:blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          {/* Text Content - renders immediately without animation delay */}
          <div
            className={`max-w-xl flex-1 text-center transition-all duration-500 lg:text-left ${animationsReady ? "translate-y-0 opacity-100" : "opacity-100"}`}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-linear-to-r from-emerald-50 to-sky-50 px-3 py-2 shadow-sm sm:mb-8 sm:gap-3 sm:px-5 sm:py-2.5">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 sm:h-2.5 sm:w-2.5"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
                Compară oferte gratuit
              </span>
            </div>

            {/* Headline - Critical LCP element */}
            <h1 className="mb-4 text-3xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl md:text-[2.5rem] lg:text-5xl xl:text-6xl">
              Compară oferte pentru
              <br />
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                  mutarea ta
                </span>
                {/* Underline decoration - CSS only, no JS animation */}
                <svg
                  className="absolute -bottom-1 left-0 w-full sm:-bottom-2"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C40 4 100 2 150 6C200 10 260 4 298 8"
                    stroke="url(#hero-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="hero-gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-slate-600 sm:mb-8 sm:text-lg lg:mx-0 lg:text-xl">
              Găsește firma de mutări perfectă,{" "}
              <span className="font-semibold text-slate-900">fără zeci de telefoane</span>. Obține
              oferte personalizate, compară prețurile și{" "}
              <span className="font-semibold text-emerald-600">ia cea mai bună decizie</span> pentru
              bugetul tău.
            </p>

            {/* Trust Indicators - lazy loaded */}
            <TrustIndicators />

            {/* How it works link - mobile only */}
            <button
              onClick={() =>
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-6 text-sm font-medium text-emerald-600 underline hover:text-emerald-700 lg:hidden"
            >
              Cum funcționează? ↓
            </button>
          </div>

          {/* Form Section */}
          <div className="w-full max-w-md lg:w-105 lg:shrink-0">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-2xl shadow-slate-200/50 backdrop-blur-sm sm:rounded-3xl sm:p-6">
              <div className="mb-4 text-center">
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                  Completează în 2 minute
                </h2>
                <p className="text-sm text-gray-500">Primești 3-5 oferte în 24h</p>
              </div>
              <HomeRequestForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


