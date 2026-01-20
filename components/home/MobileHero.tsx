import Link from "next/link";
import { ArrowRight, CheckCircle, Star, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

export default function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-24 pb-12">
      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">
            🎉 500+ mutări realizate
          </span>
        </div>

        {/* Headline - LCP Element */}
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

        {/* Trust Indicators - Simplified */}
        <div className="mb-6 flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Verificate
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 shadow-sm">
            <CheckCircle className="h-3.5 w-3.5 text-sky-600" />
            Gratuit
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 shadow-sm">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            4.9★
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 shadow-sm">
            <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
            -40%
          </div>
        </div>

        {/* CTA Button - Simple Link, No JS */}
        <Link
          href="/customer/auth"
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25"
        >
          <Sparkles className="h-5 w-5" />
          Obține Oferte Gratuite
          <ArrowRight className="h-5 w-5" />
        </Link>

        {/* Secondary CTA */}
        <a
          href="#how-it-works"
          className="inline-block text-sm font-medium text-slate-600 underline"
        >
          Cum funcționează? ↓
        </a>

        {/* Trust Text */}
        <p className="mt-6 text-xs text-gray-500">
          🔒 100% gratuit • Fără obligații • 2 minute
        </p>
      </div>
    </section>
  );
}


