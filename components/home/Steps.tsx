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
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        <div className="absolute left-1/2 bottom-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Proces simplu în 3 pași</span>
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Cum funcționează?
          </h2>
          <p className="text-lg text-slate-600">
            Un proces transparent și simplu, gândit să îți economisească timp și bani.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative mx-auto max-w-5xl">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-0 right-0 top-[100px] z-0 hidden h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200 md:block" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
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
                  <div className="relative mb-8">
                    {/* Background circle */}
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      className={`flex h-[120px] w-[120px] items-center justify-center rounded-3xl bg-gradient-to-br ${step.gradient} shadow-xl transition-all duration-300`}
                    >
                      <step.icon className="h-12 w-12 text-white" strokeWidth={1.5} />
                    </motion.div>
                    
                    {/* Step number badge */}
                    <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-800 shadow-lg ring-4 ring-white">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Arrow indicator (mobile) */}
                  {i < steps.length - 1 && (
                    <div className="mt-6 flex items-center justify-center md:hidden">
                      <ArrowRight className="h-6 w-6 rotate-90 text-slate-300" />
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
          className="mx-auto mt-16 max-w-lg text-center"
        >
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 px-8 py-6">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-emerald-700">💡 Știai că...</span> clienții noștri economisesc în medie <span className="font-bold text-emerald-700">450 lei</span> pe mutare?
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
