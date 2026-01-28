"use client";

import { motion } from "framer-motion";
import { TrophyIcon as Award, HeartIcon as HeartHandshake } from "@heroicons/react/24/outline";

export default function GuaranteeSection() {
  const guarantees = [
    {
      title: "100% Gratuit",
      desc: "Platforma este complet gratuită. Nu plătești nimic pentru a primi oferte.",
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Date Protejate",
      desc: "Informațiile tale sunt criptate și nu sunt distribuite terților.",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
    },
    {
      title: "Fără Obligații",
      desc: "Primești oferte fără nicio obligație de a accepta. Tu decizi!",
      gradient: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Răspuns în 24h",
      desc: "Primești oferte de la firme verificate în maximum 24 de ore.",
      gradient: "from-orange-500 to-red-500",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50/50 blur-[80px] sm:h-[800px] sm:w-[800px] sm:blur-[100px]" />
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
            <Award className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
              Garanțiile Noastre
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            De ce să alegi{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ofertemutare.ro
            </span>
            ?
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Suntem dedicați să îți oferim cea mai simplă și sigură experiență de comparare a
            ofertelor de mutare din România.
          </p>
        </motion.div>

        {/* Guarantees Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {guarantees.map((g, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="relative flex h-full flex-col items-center rounded-xl border border-slate-200/50 bg-white p-4 text-center shadow-lg sm:rounded-2xl sm:p-8">
                {/* Badge */}
                <div
                  className={`mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${g.gradient} shadow-lg ring-4 ring-white sm:mb-6 sm:h-20 sm:w-20`}
                />

                {/* Content */}
                <h3 className="mb-2 text-sm font-bold text-slate-900 sm:mb-3 sm:text-lg">
                  {g.title}
                </h3>
                <p className="hidden text-sm leading-relaxed text-slate-600 sm:block">{g.desc}</p>

                {/* Decorative corner */}
                <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden rounded-tr-xl sm:h-20 sm:w-20 sm:rounded-tr-2xl">
                  <div
                    className={`absolute -right-8 -top-8 h-16 w-16 rotate-45 ${g.bgLight} opacity-50 sm:-right-10 sm:-top-10 sm:h-20 sm:w-20`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto mt-10 max-w-4xl sm:mt-16"
        >
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-5 shadow-xl sm:rounded-3xl sm:p-8 lg:p-10">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:20px_20px] sm:bg-[size:30px_30px]" />

            <div className="relative flex flex-col items-center gap-4 text-center sm:gap-6 lg:flex-row lg:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg sm:h-20 sm:w-20 sm:rounded-2xl">
                <HeartHandshake className="h-7 w-7 text-white sm:h-10 sm:w-10" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
                  Garantăm siguranța și transparența procesului!
                </h3>
                <p className="text-sm text-slate-600 sm:text-base">
                  Toate firmele partenere sunt verificate și au licențe valide. Citește recenziile
                  altor clienți și alege cu încredere. Dacă nu ești mulțumit de ofertele primite, nu
                  ești obligat să accepți niciuna.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
