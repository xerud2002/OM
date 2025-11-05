"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 py-20 text-white">
      {/* Background pattern or glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-3xl font-extrabold leading-tight md:text-5xl"
          >
            Gata să economisești până la 40% la mutare?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl"
          >
            Peste <strong>5.000 de români</strong> au economisit deja prin Ofertemutare.ro.
            Completează formularul în 2 minute și primește <strong>oferte gratuite</strong> de la
            firme verificate din România!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/customer/dashboard"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-emerald-600 shadow-2xl transition-all duration-300 hover:text-emerald-700 hover:shadow-white/30"
            >
              PRIMEȘTE 5 OFERTE GRATUITE <ArrowRight size={24} />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>100% Gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Fără obligații</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span>Răspuns garantat în 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <span>Datele tale sunt protejate</span>
            </div>
          </motion.div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
