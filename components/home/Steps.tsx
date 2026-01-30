"use client";

import {
  DocumentTextIcon as FileText,
  UsersIcon as Users,
  CheckCircleIcon as CheckCircle2,
  BoltIcon as Zap,
  ClockIcon as Clock,
  ArrowRightIcon as ArrowRight,
  RocketLaunchIcon as Rocket,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function Steps() {
  // Tiny blur placeholder to avoid CLS on illustrations
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIBAAAgIBBAMBAAAAAAAAAAAAAQIDBAAFBhESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEuO";
  const steps = [
    {
      id: "01",
      icon: FileText,
      image: "/pics/step1-form.png",
      title: "Completezi cererea online",
      desc: "Formularul nostru simplu îți ia mai puțin de 2 minute. Ne spui detaliile mutării tale:",
      bullets: [
        "De unde și unde te muți",
        "Ce obiecte ai de transportat",
        "Data dorită pentru mutare",
      ],
      time: "~2 min",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "02",
      icon: Users,
      image: "/pics/step2-offers.png",
      title: "Primești oferte personalizate",
      desc: "Firmele de mutări verificate din rețeaua noastră îți trimit oferte în maxim 24 de ore:",
      bullets: [
        "Până la 5 oferte competitive",
        "Prețuri transparente detaliate",
        "Recenzii și rating-uri reale",
      ],
      time: "24h",
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "03",
      icon: CheckCircle2,
      image: "/pics/step3-choose.png",
      title: "Alegi și te muți relaxat",
      desc: "Compari ofertele primite și alegi firma care ți se potrivește cel mai bine:",
      bullets: [
        "Fără obligații sau costuri ascunse",
        "Contactezi direct firma aleasă",
        "Suport gratuit pe tot parcursul",
      ],
      time: "Tu decizi",
      gradient: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="steps-heading"
      className="relative overflow-hidden bg-slate-50/50 py-12 sm:py-20 lg:py-28"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 shadow-sm sm:mb-4 sm:px-4 sm:py-2">
            <Zap className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-bold text-emerald-700 sm:text-sm">Simplu & Rapid</span>
          </div>
          <h2
            id="steps-heading"
            className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl"
          >
            Cum{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              funcționează?
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Găsește cea mai bună firmă de mutări în <strong>3 pași simpli</strong>. Fără zeci de
            telefoane, fără negocieri interminabile. Noi facem munca grea pentru tine.
          </p>
        </header>

        {/* Steps Cards */}
        <div className="relative mx-auto max-w-6xl">
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10" role="list">
            {steps.map((step, i) => (
              <li
                key={i}
                className="group relative flex flex-col rounded-2xl bg-white p-4 pt-6 shadow-xl ring-1 shadow-slate-200/40 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 sm:rounded-3xl sm:p-8 sm:pt-8"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg sm:left-6 sm:px-3 sm:text-xs">
                  <span>Pasul {step.id}</span>
                </div>

                {/* Time Badge */}
                <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 shadow-lg sm:right-6 sm:px-2.5 sm:text-xs">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {step.time}
                </div>

                {/* Step Illustration */}
                <div className="group/image relative mt-3 mb-4 h-24 w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 sm:mt-4 sm:mb-5 sm:h-36 sm:rounded-2xl">
                  {/* Base Image */}
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 30vw, 320px"
                    className="object-contain p-2 transition-transform duration-500 ease-in-out group-hover/image:scale-105 z-10"
                    loading="lazy"
                    decoding="async"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                  />
                  {/* Soft tint + ring for consistent card style */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/20 via-white/10 to-sky-50/20 mix-blend-multiply" />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-2 z-0 rounded-3xl bg-gradient-to-br from-emerald-200/50 via-sky-200/50 to-purple-200/50 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-2xl">{step.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {step.desc}
                </p>

                {/* Bullet Points */}
                <ul className="mb-4 space-y-2 text-sm text-slate-600">
                  {step.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${step.iconColor}`} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Arrow connector on desktop */}
                {i < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-5 z-10 hidden -translate-y-1/2 md:block lg:-right-7">
                    <ArrowRight className="h-6 w-6 text-slate-300 lg:h-8 lg:w-8" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-8 max-w-3xl text-center sm:mt-14">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-6 text-white shadow-2xl shadow-emerald-500/25 sm:rounded-3xl sm:px-12 sm:py-10">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0yNiAzNGgtMnYtNGgydjR6bTAtNnYtNGgtMnY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/30 backdrop-blur-sm">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-yellow-400"></span>
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold sm:text-2xl">Gata să începi?</p>
                  <p className="text-sm text-emerald-100 sm:text-base">
                    Primești oferte gratuite în mai puțin de 2 minute
                  </p>
                </div>
              </div>
              <Link
                href="/customer/auth"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-emerald-700 shadow-lg transition-all hover:shadow-xl sm:w-auto"
              >
                Obține oferte acum
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
