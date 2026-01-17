import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export default function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-24 pb-12 block lg:hidden">
      {/* Static Background Elements - CSS only, no blur calculation overhead */}
      <div className="pointer-events-none absolute inset-0 z-0">
         {/* Removed blurred blobs for maximum mobile performance */}
      </div>

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

        {/* Headline - No gradient animation, just text */}
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Compara oferte pentru
          <br />
          <span className="text-emerald-600">mutarea ta</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-8 text-base leading-relaxed text-slate-600">
          Primești <span className="font-semibold text-emerald-600">până la 5 oferte</span> de la firme verificate.
          Economisești <span className="font-semibold text-emerald-600">până la 40%</span>.
        </p>

        {/* CTA Buttons - Simple Links instead of handlers to avoid hydration */}
        <div className="flex flex-col gap-3">
          <Link
            href="/customer/auth"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            Obține oferte gratuite
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <a
            href="#how-it-works"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 active:bg-slate-50"
          >
            Cum funcționează?
          </a>
        </div>

        {/* Trust Indicators - Static Grid */}
        <div className="mt-8 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
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
             4.9/5 Rating
          </div>
          <div className="flex items-center justify-center gap-1 rounded-full bg-white/80 py-1.5 shadow-sm">
             <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
             Economie timp
          </div>
        </div>

        {/* Image - Optimized for Mobile LCP */}
        <div className="mt-8 relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-xl">
           <div className="relative aspect-4/3">
              <Image
                src="/pics/hero-branded-v1.webp"
                alt="Servicii Mutare"
                fill
                className="object-cover"
                priority={true}
                sizes="(max-width: 640px) 100vw, 300px"
              />
           </div>
        </div>
      </div>
    </section>
  );
}
