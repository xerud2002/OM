"use client";

import { motion } from "framer-motion";
import {
  StarIcon as Star,
  ChatBubbleLeftIcon as Quote,
  MapPinIcon as MapPin,
  CheckCircleIcon as CheckCircle,
} from "@heroicons/react/24/outline";

const testimonials = [
  {
    name: "Andreea Popescu",
    location: "Timișoara",
    text: "Am primit 5 oferte în doar 3 ore! Nu credeam că e atât de simplu. Recomand 100%!",
    rating: 5,
    badge: "5 oferte primite",
    avatar: "AP",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "Mihai Ionescu",
    location: "Cluj-Napoca",
    text: "Platformă serioasă! Am comparat ofertele liniștit și am ales firma perfectă. Mutarea a fost fără stres.",
    rating: 5,
    badge: "Firmă verificată",
    avatar: "MI",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Elena Marin",
    location: "Brașov",
    text: "Firmele verificate de voi sunt profesioniști adevărați. Totul a decurs perfect, la timp și fără surprize!",
    rating: 5,
    badge: "Mutare perfectă",
    avatar: "EM",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    name: "Adrian Toma",
    location: "Iași",
    text: "Formular super rapid de completat, oferte primite a doua zi. Acum știu unde să mă întorc când mă mut din nou!",
    rating: 5,
    badge: "Răspuns rapid",
    avatar: "AT",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-emerald-50/30 to-white py-12 sm:py-20 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-100 w-100 -translate-y-1/2 rounded-full bg-emerald-100/30 blur-[80px] sm:h-150 sm:w-150 sm:blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 hidden h-125 w-125 translate-y-1/2 rounded-full bg-sky-100/30 blur-[100px] sm:block" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:mb-4 sm:px-4 sm:py-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
              Experiențe reale
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            Ce spun{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              clienții noștri
            </span>
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Clienții care au folosit{" "}
            <span className="font-semibold text-emerald-600">ofertemutare.ro</span> ne-au
            împărtășit experiențele lor.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative flex h-full flex-col rounded-xl border border-slate-200/50 bg-white p-3 shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 sm:rounded-2xl sm:p-6"
              >
                {/* Quote icon */}
                <Quote className="mb-2 h-5 w-5 text-emerald-200 sm:mb-4 sm:h-8 sm:w-8" />

                {/* Rating Stars */}
                <div className="mb-2 flex gap-0.5 sm:mb-4 sm:gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-emerald-500 text-emerald-500 sm:h-4 sm:w-4"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="mb-3 flex-1 text-[11px] leading-relaxed text-slate-600 sm:mb-6 sm:text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Badge */}
                <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 sm:mb-4 sm:gap-2 sm:px-3 sm:py-1.5">
                  <CheckCircle className="h-2.5 w-2.5 text-emerald-600 sm:h-4 sm:w-4" />
                  <span className="text-[10px] font-semibold text-emerald-700 sm:text-sm">
                    {t.badge}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-1.5 border-t border-slate-100 pt-2 sm:gap-3 sm:pt-4">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-[10px] font-bold text-white sm:h-10 sm:w-10 sm:text-xs`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 sm:text-sm">{t.name}</p>
                    <p className="flex items-center gap-0.5 text-[9px] text-slate-500 sm:gap-1 sm:text-xs">
                      <MapPin className="h-2 w-2 sm:h-3 sm:w-3" />
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-8 max-w-3xl sm:mt-16"
        >
          <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200/50 bg-white p-3 shadow-lg sm:rounded-2xl sm:p-6">
            {[
              { value: "100%", label: "Gratuit" },
              { value: "24h", label: "Timp răspuns" },
              { value: "5+", label: "Oferte pe cerere" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-bold text-emerald-600 sm:text-2xl lg:text-3xl">
                  {stat.value}
                </p>
                <p className="text-[10px] text-slate-500 sm:text-xs lg:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}



