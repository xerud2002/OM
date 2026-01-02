"use client";

import { motion } from "framer-motion";
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
    <section id="how-it-works" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent sm:w-[80%]" />
        <div className="absolute left-1/2 bottom-0 h-px w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent sm:w-[80%]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:mb-4 sm:px-4 sm:py-2">
            <Zap className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">Proces simplu în 3 pași</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            Cum{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              funcționează?
            </span>
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Un proces transparent și simplu, gândit să îți economisească timp și bani.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative mx-auto max-w-5xl">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-0 right-0 top-[80px] z-0 hidden h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 lg:top-[100px] lg:block" />

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group relative"
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mb-5 sm:mb-8">
                    {/* Background circle */}
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className={`flex h-[80px] w-[80px] items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-xl transition-all duration-300 sm:h-[100px] sm:w-[100px] sm:rounded-3xl lg:h-[120px] lg:w-[120px]`}
                    >
                      <step.icon className="h-8 w-8 text-white sm:h-10 sm:w-10 lg:h-12 lg:w-12" strokeWidth={1.5} />
                    </motion.div>
                    
                    {/* Step number badge */}
                    <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-800 shadow-lg ring-2 ring-white sm:-right-2 sm:-top-2 sm:h-10 sm:w-10 sm:rounded-xl sm:text-lg sm:ring-4">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-sm leading-relaxed text-slate-600 sm:text-base">
                    {step.desc}
                  </p>

                  {/* Arrow indicator (mobile) */}
                  {i < steps.length - 1 && (
                    <div className="mt-4 flex items-center justify-center sm:mt-6 md:hidden">
                      <ArrowRight className="h-5 w-5 rotate-90 text-slate-300 sm:h-6 sm:w-6" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-10 max-w-lg text-center sm:mt-16"
        >
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 px-5 py-4 sm:rounded-2xl sm:px-8 sm:py-6">
            <p className="text-xs text-slate-600 sm:text-sm">
              <span className="font-semibold text-emerald-700">💡 Știai că...</span> poți compara <span className="font-bold text-emerald-700">până la 5 oferte</span> și să alegi cea mai bună variantă pentru tine?
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
