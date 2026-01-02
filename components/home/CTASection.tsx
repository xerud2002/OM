"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Clock, Lock, Zap } from "lucide-react";

export default function CTASection() {
  const badges = [
    { icon: ShieldCheck, text: "100% Gratuit" },
    { icon: Clock, text: "Răspuns în 24h" },
    { icon: Lock, text: "Date protejate" },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-sky-500/20 blur-[100px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
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
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2"
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Începe acum - durează 2 minute</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Gata să economisești
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              până la 40% la mutare?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 md:text-xl"
          >
            Peste <span className="font-bold text-white">5.000 de români</span> au economisit deja prin Ofertemutare.ro. 
            Completează cererea și primește <span className="font-bold text-emerald-400">oferte gratuite</span> de la firme verificate!
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/customer/dashboard"
                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-emerald-500/30 transition-all hover:shadow-emerald-500/40"
              >
                <Sparkles className="h-6 w-6" />
                PRIMEȘTE OFERTE GRATUITE
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 backdrop-blur-sm"
              >
                <badge.icon className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 grid grid-cols-3 divide-x divide-slate-700 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm"
          >
            {[
              { value: "5000+", label: "Mutări realizate" },
              { value: "24h", label: "Timp de răspuns" },
              { value: "50+", label: "Firme partenere" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-emerald-400 lg:text-3xl">{stat.value}</p>
                <p className="text-xs text-slate-400 lg:text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
