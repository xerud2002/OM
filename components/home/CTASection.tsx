"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 text-white overflow-hidden">
      {/* Background pattern or glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight"
          >
            Ești gata să te muți fără stres?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Completează formularul de cerere și primește oferte reale de la firme
            verificate din România. Rapid, sigur și gratuit!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/form"
              className="inline-flex items-center gap-3 bg-white text-emerald-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-emerald-300/50 hover:text-emerald-700 transition-all duration-300"
            >
              Obține oferte gratuite acum <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
