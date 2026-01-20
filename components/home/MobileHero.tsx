import dynamic from "next/dynamic";
import { CheckCircle, Star, ShieldCheck, TrendingUp } from "lucide-react";

// Lazy load the form for better LCP
const HomeRequestForm = dynamic(() => import("./HomeRequestForm"), {
  loading: () => (
    <div className="mx-auto h-[400px] w-full max-w-md animate-pulse rounded-2xl border border-gray-200 bg-white/50" />
  ),
});

export default function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-24 pb-12">
      {/* Static Background Elements */}
      <div className="pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Badge - Static */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 shadow-sm">
          <span className="flex h-2 w-2">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            🎉 Peste 500+ mutări realizate
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Compară oferte pentru
          <br />
          <span className="text-emerald-600">mutarea ta</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-6 text-base leading-relaxed text-slate-600">
          Primești <span className="font-semibold text-emerald-600">până la 5 oferte</span> de la
          firme verificate. Economisești{" "}
          <span className="font-semibold text-emerald-600">până la 40%</span>.
        </p>

        {/* Trust Indicators - Static Grid */}
        <div className="mb-6 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
          <div className="flex items-center justify-center gap-1 rounded-full bg-white/80 py-1.5 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Firme Verificate
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full bg-white/80 py-1.5 shadow-sm">
            <CheckCircle className="h-3.5 w-3.5 text-sky-600" />
            100% Gratuit
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full bg-white/80 py-1.5 shadow-sm">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            4.9/5 Recenzii
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full bg-white/80 py-1.5 shadow-sm">
            <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
            Economie 40%
          </div>
        </div>

        {/* Mini Form Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
          <div className="mb-3 text-center">
            <h2 className="text-lg font-bold text-gray-800">Completează în 2 minute</h2>
            <p className="text-sm text-gray-500">Primești 3-5 oferte în 24h</p>
          </div>
          <HomeRequestForm />
        </div>
      </div>
    </section>
  );
}

