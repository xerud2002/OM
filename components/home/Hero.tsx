"use client";

import { ArrowRight, CheckCircle, Star, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

// Tiny blur placeholder (10x7 px encoded as base64) - prevents CLS
const blurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIBAAAgIBBAMBAAAAAAAAAAAAAQIDBAAFBhESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEuO";

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [animationsReady, setAnimationsReady] = useState(false);
  const [, setAuthChecked] = useState(false);

  // Defer Firebase loading until after LCP - use requestIdleCallback
  useEffect(() => {
    const timer = setTimeout(() => setAnimationsReady(true), 100);
    let unsub: (() => void) | undefined;
    let mounted = true;

    const loadAuth = async () => {
      if (!mounted) return;
      try {
        // Dynamically import Firebase auth only when needed
        const { auth } = await import("@/services/firebase");
        const { onAuthStateChanged } = await import("firebase/auth");
        unsub = onAuthStateChanged(auth, (u) => {
          if (!mounted) return;
          setUser(u ? { uid: u.uid } : null);
          setAuthChecked(true);
        });
      } catch {
        setAuthChecked(true);
      }
    };

    // Use requestIdleCallback to load Firebase after browser is idle
    if ("requestIdleCallback" in window) {
      const idleId = requestIdleCallback(() => loadAuth(), { timeout: 4000 });
      return () => {
        mounted = false;
        clearTimeout(timer);
        cancelIdleCallback(idleId);
        unsub?.();
      };
    } else {
      // Fallback: load after 3s to allow LCP to complete first
      const authTimer = setTimeout(loadAuth, 3000);
      return () => {
        mounted = false;
        clearTimeout(timer);
        clearTimeout(authTimer);
        unsub?.();
      };
    }
  }, []);

  const handleCTA = useCallback(() => {
    if (user) {
      router.push("/customer/dashboard");
    } else {
      localStorage.setItem("redirectAfterLogin", "form");
      router.push("/customer/auth");
    }
  }, [user, router]);

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 px-4 pt-16 pb-8 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-16 flex items-center">
      {/* Animated Background Elements - simplified for performance */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-[10%] h-75 w-75 rounded-full bg-emerald-200/40 blur-[80px] sm:h-100 sm:w-100 lg:h-125 lg:w-125 lg:blur-[100px]" />
        <div className="absolute right-[5%] bottom-20 hidden h-75 w-75 rounded-full bg-sky-200/40 blur-[80px] sm:block sm:h-100 sm:w-100 lg:blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="flex flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:gap-20">
          {/* Text Content - renders immediately without animation delay */}
          <div
            className={`flex-1 text-center transition-all duration-500 lg:text-left ${animationsReady ? "translate-y-0 opacity-100" : "opacity-100"}`}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-linear-to-r from-emerald-50 to-sky-50 px-3 py-2 shadow-sm sm:mb-8 sm:gap-3 sm:px-5 sm:py-2.5">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 sm:h-2.5 sm:w-2.5"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
                🎉 Peste 500+ mutări realizate cu succes
              </span>
            </div>

            {/* Headline - Critical LCP element */}
            <h1 className="mb-4 text-3xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Compara oferte pentru
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
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-600 sm:mb-10 sm:text-lg lg:mx-0 lg:text-xl">
              Completezi o singură cerere și primești{" "}
              <span className="font-semibold text-emerald-600">până la 5 oferte</span> de la firme
              verificate. Compari, alegi și{" "}
              <span className="font-semibold text-emerald-600">economisești până la 40%</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <button
                onClick={handleCTA}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-[0.98] sm:w-auto sm:gap-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                Obține oferte gratuite
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() =>
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-all hover:scale-[1.02] hover:border-emerald-200 hover:bg-emerald-50 active:scale-[0.98] sm:w-auto sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg"
              >
                Cum funcționează?
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4 lg:justify-start lg:gap-6">
              {[
                { icon: ShieldCheck, label: "Firme Verificate", color: "text-emerald-600" },
                { icon: CheckCircle, label: "100% Gratuit", color: "text-sky-600" },
                { icon: Star, label: "4.9/5 Rating", color: "text-amber-500" },
                { icon: TrendingUp, label: "Economie timp", color: "text-purple-600" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2"
                >
                  <item.icon className={`h-4 w-4 ${item.color} sm:h-5 sm:w-5`} />
                  <span className="text-xs font-medium text-slate-700 sm:text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Content - Image loads with priority */}
          <div className="relative w-full flex-1 lg:w-auto">
            <div className="relative mx-auto max-w-md sm:max-w-lg lg:max-w-none">
              {/* Main Card with Hero Image - LCP element */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-2xl shadow-slate-200/50 sm:rounded-3xl">
                <div className="relative aspect-4/3 bg-linear-to-br from-slate-50 to-emerald-50/50">
                  <Image
                    src="/pics/hero-branded-v1.png"
                    alt="Servicii de Mutare Profesionale - OferteMutare.ro"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    quality={85}
                    fetchPriority="high"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                  />
                </div>
              </div>

              {/* Floating Badge - Top Right */}
              <div className="absolute -top-2 -right-2 -rotate-6 rounded-xl border border-amber-200 bg-linear-to-br from-amber-50 to-orange-50 px-2.5 py-2 shadow-lg sm:-top-4 sm:-right-4 sm:rounded-2xl sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5" />
                  <span className="text-xs font-bold text-amber-700 sm:text-sm">4.9/5</span>
                </div>
                <p className="text-[10px] text-amber-600 sm:text-xs">500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
