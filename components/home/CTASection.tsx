"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRightIcon as ArrowRight,
  SparklesIcon as Sparkles,
  ShieldCheckIcon as ShieldCheck,
  ClockIcon as Clock,
  BoltIcon as Zap,
} from "@heroicons/react/24/outline";

export default function CTASection() {
  const badges = [
    { icon: ShieldCheck, text: "100% Gratuit" },
    { icon: Clock, text: "Răspuns în 24h" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-12 sm:py-20 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-0 h-100 w-100 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[80px] sm:h-150 sm:w-[600px] sm:blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 hidden h-125 w-125 translate-y-1/2 rounded-full bg-sky-500/20 blur-[100px] sm:block" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] sm:bg-size-[60px_60px]" />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 sm:mb-8 sm:px-5 sm:py-2"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-emerald-400 sm:text-sm">
              Începe acum - durează 2 minute
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 text-2xl font-extrabold tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Gata să economisești
            <br />
            <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              la mutarea ta?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-6 max-w-2xl text-sm text-slate-300 sm:mb-10 sm:text-lg md:text-xl"
          >
            Completează cererea în{" "}
            <span className="font-bold text-white">2 minute</span> și primește{" "}
            <span className="font-bold text-emerald-400">oferte gratuite</span> de la firme
            locale din orașul tău!
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 sm:mb-12"
          >
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/customer/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-bold text-white shadow-2xl shadow-emerald-500/30 transition-all hover:shadow-emerald-500/40 sm:gap-3 sm:rounded-2xl sm:px-10 sm:py-5 sm:text-lg"
              >
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="hidden sm:inline">Primește oferte gratuite</span>
                <span className="sm:hidden">Oferte gratuite</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 sm:h-6 sm:w-6" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6"
          >
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2"
              >
                <badge.icon className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
                <span className="text-xs font-medium text-slate-300 sm:text-sm">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 grid grid-cols-3 divide-x divide-slate-700 rounded-xl border border-slate-700 bg-slate-800/50 p-3 backdrop-blur-sm sm:mt-16 sm:rounded-2xl sm:p-6"
          >
            {[
              { value: "100%", label: "Gratuit" },
              { value: "24h", label: "Timp răspuns" },
              { value: "5+", label: "Oferte/cerere" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-base font-bold text-emerald-400 sm:text-2xl lg:text-3xl">
                  {stat.value}
                </p>
                <p className="text-[9px] text-slate-400 sm:text-xs lg:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}


