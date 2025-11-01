"use client";

import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Andreea Popescu",
    role: "Clientă – București",
    text: "Am primit 5 oferte în doar 3 ore și am economisit 520 lei! Nu credeam că e atât de simplu. Recomand 100%!",
    rating: 5,
    savings: "520 lei",
  },
  {
    name: "Mihai Ionescu",
    role: "Client – Cluj-Napoca",
    text: "Platformă serioasă! Am comparat ofertele liniștit și am ales firma perfectă. Mutarea a fost fără stres.",
    rating: 5,
    savings: "380 lei",
  },
  {
    name: "Elena Marin",
    role: "Clientă – Brașov",
    text: "Firmele verificate de voi sunt profesioniști adevărați. Totul a decurs perfect, la timp și fără surprize neplăcute!",
    rating: 5,
    savings: "450 lei",
  },
  {
    name: "Adrian Toma",
    role: "Client – Iași",
    text: "Formular super rapid de completat, oferte primite a doua zi. Acum știu unde să mă întorc când mă mut din nou!",
    rating: 5,
    savings: "290 lei",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-emerald-50/60 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(16,185,129,0.05),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="relative z-10 mx-auto mb-14 max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-emerald-700 md:text-4xl">
            Ce spun clienții noștri
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Peste 5.000 de utilizatori au folosit <strong>ofertemutare.ro</strong> pentru a compara
            oferte de mutare în siguranță și fără bătăi de cap.
          </p>
        </div>
      </FadeInWhenVisible>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="flex flex-col items-center rounded-3xl border border-emerald-100 bg-white/85 p-6 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-emerald-200/70"
          >
            {/* Savings badge removed at user request */}

            {/* ⭐ Rating Stars */}
            <div className="mb-4 flex justify-center">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} className="mx-[1px] fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Text */}
            <p className="mb-4 text-sm italic leading-relaxed text-gray-700">
              &ldquo;{t.text}&rdquo;
            </p>
            <h4 className="font-semibold text-emerald-700">{t.name}</h4>
            <span className="text-xs text-gray-500">{t.role}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
