"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ești gata să te muți fără stres?
        </h2>
        <p className="text-white/90 mb-8 text-lg">
          Completează formularul acum și primește oferte reale de la firme verificate.
        </p>
        <Link
          href="/form"
          className="inline-flex items-center gap-3 bg-white text-emerald-600 font-semibold px-8 py-3 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all"
        >
          Obține oferte acum <ArrowRight size={20} />
        </Link>
      </motion.div>
    </section>
  );
}
