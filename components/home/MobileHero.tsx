import { CheckCircle, Star, ShieldCheck, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load the form - deferred to prioritize LCP
const HomeRequestForm = dynamic(() => import("./HomeRequestForm"), {
  loading: () => (
    <div className="mx-auto h-[380px] w-full animate-pulse rounded-xl border border-gray-200 bg-white/50" />
  ),
  ssr: false, // Don't SSR the form - it needs client JS anyway
});

export default function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-20 pb-8">
      <div className="relative z-10 mx-auto max-w-lg">
        {/* Badge */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">🎉 500+ mutări realizate</span>
          </div>
        </div>

        {/* Headline - LCP Element */}
        <h1 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-slate-900">
          Compară oferte pentru
          <br />
          <span className="text-emerald-600">mutarea ta</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-4 text-center text-sm leading-relaxed text-slate-600">
          Primești <span className="font-semibold text-emerald-600">până la 5 oferte</span> de la
          firme verificate.
        </p>

        {/* Trust Indicators - Simplified */}
        <div className="mb-4 flex flex-wrap justify-center gap-1.5 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            Verificate
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
            <CheckCircle className="h-3 w-3 text-sky-600" />
            Gratuit
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
            <Star className="h-3 w-3 text-amber-500" />
            4.9★
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
            <TrendingUp className="h-3 w-3 text-purple-600" />
            -40%
          </div>
        </div>

        {/* Form Section with Header */}
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
