"use client";

import { motion } from "framer-motion";
import { Star, Quote, MapPin, TrendingDown } from "lucide-react";

const testimonials = [
  {
    name: "Andreea Popescu",
    location: "Timișoara",
    text: "Am primit 5 oferte în doar 3 ore și am economisit 520 lei! Nu credeam că e atât de simplu. Recomand 100%!",
    rating: 5,
    savings: "520 lei",
    avatar: "AP",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Mihai Ionescu",
    location: "Cluj-Napoca",
    text: "Platformă serioasă! Am comparat ofertele liniștit și am ales firma perfectă. Mutarea a fost fără stres.",
    rating: 5,
    savings: "380 lei",
    avatar: "MI",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Elena Marin",
    location: "Brașov",
    text: "Firmele verificate de voi sunt profesioniști adevărați. Totul a decurs perfect, la timp și fără surprize!",
    rating: 5,
    savings: "450 lei",
    avatar: "EM",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Adrian Toma",
    location: "Iași",
    text: "Formular super rapid de completat, oferte primite a doua zi. Acum știu unde să mă întorc când mă mut din nou!",
    rating: 5,
    savings: "290 lei",
    avatar: "AT",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white py-24 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-emerald-100/30 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-sky-100/30 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-amber-700">4.9/5 din 5000+ reviews</span>
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Ce spun clienții noștri
          </h2>
          <p className="text-lg text-slate-600">
            Peste 5.000 de utilizatori au folosit <span className="font-semibold text-emerald-600">ofertemutare.ro</span> pentru a compara oferte de mutare în siguranță.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative flex h-full flex-col rounded-2xl border border-slate-200/50 bg-white p-6 shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50"
              >
                {/* Quote icon */}
                <Quote className="mb-4 h-8 w-8 text-emerald-200" />

                {/* Rating Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Savings badge */}
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
                  <TrendingDown className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Economie: {t.savings}</span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {t.location}
                    </p>
                  </div>
                </div>

                {/* Decorative gradient on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/0 via-transparent to-sky-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-lg">
            {[
              { value: "5000+", label: "Clienți mulțumiți" },
              { value: "100%", label: "Satisfacție clienți" },
              { value: "4.9/5", label: "Rating mediu" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-emerald-600 lg:text-3xl">{stat.value}</p>
                <p className="text-xs text-slate-500 lg:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
