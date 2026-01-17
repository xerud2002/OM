"use client";

import { FileText, Users, CheckCircle2, ArrowRight, Zap } from "lucide-react";

export default function Steps() {
  const steps = [
    {
      id: "01",
      icon: FileText,
      title: "Completezi cererea",
      desc: "Spune-ne de unde și unde te muți, ce ai de mutat și când. Durează sub 2 minute.",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "02",
      icon: Users,
      title: "Primești oferte",
      desc: "Firmele verificate îți trimit oferte personalizate în maxim 24h. Compari prețuri și recenzii.",
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "03",
      icon: CheckCircle2,
      title: "Alegi și economisești",
      desc: "Selectezi oferta care ți se potrivește. Fără obligații, fără costuri ascunse.",
      gradient: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-50/50 py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 shadow-sm sm:mb-4 sm:px-4 sm:py-2">
            <Zap className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-bold text-emerald-700 sm:text-sm">
              Simplu & Rapid
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            Cum{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              funcționează?
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Am simplificat totul pentru tine. Uită de zecile de telefoane și negocieri.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 sm:p-8"
              >
                {/* Step Number Background - Watermark effect */}
                <div className="absolute top-4 right-6 text-6xl font-black text-slate-50 opacity-50 transition-colors group-hover:text-emerald-50/80">
                  {step.id}
                </div>

                {/* Icon Circle */}
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${step.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 sm:mb-8 sm:h-20 sm:w-20 sm:rounded-3xl`}
                >
                  <step.icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.5} />
                </div>

                <h3 className="mb-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {step.desc}
                </p>

                {/* Bottom decorative line */}
                <div className={`mt-6 h-1 w-12 rounded-full ${step.bgLight.replace('bg-', 'bg-')} ${step.iconColor.replace('text-', 'bg-')}/30`} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <div className="mx-auto mt-12 max-w-2xl text-center sm:mt-16">
           <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 px-6 py-6 text-white shadow-xl sm:px-10 sm:py-8">
             <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
               <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm">
                 <Zap className="h-6 w-6 text-yellow-400" />
               </div>
               <div className="text-left">
                  <p className="text-lg font-bold">Gata să începi?</p>
                  <p className="text-slate-300 text-sm">Durează mai puțin de 2 minute să primești oferte.</p>
               </div>
               <button 
                onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-4 w-full rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:mt-0 sm:w-auto"
               >
                 Vreau oferte
               </button>
             </div>
             
             {/* Decor */}
             <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
           </div>
        </div>
      </div>
    </section>
  );
}
