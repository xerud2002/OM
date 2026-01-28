"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  CheckCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

// Lazy load the form - deferred to prioritize LCP
const HomeRequestForm = dynamic(() => import("./HomeRequestForm"), {
  loading: () => (
    <div className="mx-auto h-[380px] w-full animate-pulse rounded-xl border border-gray-200 bg-white/50" />
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
      <div className="mb-4 flex flex-wrap justify-center gap-1.5 text-xs font-medium text-slate-700">
        <span className="rounded-full bg-white/80 px-2 py-1 shadow-sm">✓ Verificate</span>
        <span className="rounded-full bg-white/80 px-2 py-1 shadow-sm">✓ Gratuit</span>
        <span className="rounded-full bg-white/80 px-2 py-1 shadow-sm">⭐ 4.9</span>
        <span className="rounded-full bg-white/80 px-2 py-1 shadow-sm">↑ Rapid</span>
      </div>
    );
  }

  return (
    <div className="mb-4 flex flex-wrap justify-center gap-1.5 text-xs font-medium text-slate-700">
      <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
        <ShieldCheckIcon className="h-3 w-3 text-emerald-600" />
        Verificate
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
        <CheckCircleIcon className="h-3 w-3 text-sky-600" />
        Gratuit
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
        <StarIcon className="h-3 w-3 text-amber-500" />
        4.9★
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
        <ArrowTrendingUpIcon className="h-3 w-3 text-purple-600" />
        Rapid
      </div>
    </div>
  );
}

export default function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-20 pb-8 md:hidden">
      <div className="relative z-10 mx-auto max-w-lg">
        {/* Badge - pure HTML, no JS */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">🎉 500+ mutări realizate</span>
          </div>
        </div>

        {/* Headline - LCP Element - PURE HTML, no icons */}
        <h1 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          Compară oferte pentru
          <br />
          <span className="text-emerald-600">mutarea ta</span>
        </h1>

        {/* Subheadline - pure HTML */}
        <p className="mx-auto mb-4 text-center text-sm leading-relaxed text-slate-600">
          Primești <span className="font-semibold text-emerald-600">până la 5 oferte</span> de la
          firme verificate.
        </p>

        {/* Trust Indicators - lazy loaded */}
        <TrustIndicators />

        {/* Form Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
          <div className="mb-3 text-center">
            <h2 className="text-base font-bold text-gray-800">Completează în 2 minute</h2>
            <p className="text-xs text-gray-500">Primești 3-5 oferte în 24h</p>
          </div>
          <HomeRequestForm />
        </div>
      </div>
    </section>
  );
}
