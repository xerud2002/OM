"use client";

import { motion } from "framer-motion";
import { Shield, Lock, ThumbsUp, Clock, Award, HeartHandshake } from "lucide-react";

export default function GuaranteeSection() {
  const guarantees = [
    {
      icon: Shield,
      title: "100% Gratuit",
      desc: "Platforma este complet gratuită. Nu plătești nimic pentru a primi oferte.",
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
    },
    {
      icon: Lock,
      title: "Date Protejate",
      desc: "Informațiile tale sunt criptate și nu sunt distribuite terților.",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
    },
    {
      icon: ThumbsUp,
      title: "Fără Obligații",
      desc: "Primești oferte fără nicio obligație de a accepta. Tu decizi!",
      gradient: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
    },
    {
      icon: Clock,
      title: "Răspuns în 24h",
      desc: "Primești oferte de la firme verificate în maximum 24 de ore.",
      gradient: "from-orange-500 to-red-500",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-50/50 blur-[100px]" />
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <Award className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Garanțiile Noastre</span>
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            De ce să alegi{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Ofertemutare.ro
            </span>
            ?
          </h2>
          <p className="text-lg text-slate-600">
            Suntem dedicați să îți oferim cea mai simplă și sigură experiență de comparare a ofertelor de mutare din România.
          </p>
        </motion.div>

        {/* Guarantees Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative flex h-full flex-col items-center rounded-2xl border border-slate-200/50 bg-white p-8 text-center shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${g.gradient} shadow-lg`}
                >
                  <g.icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                </motion.div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-bold text-slate-900">{g.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{g.desc}</p>

                {/* Decorative corner */}
                <div className="absolute right-0 top-0 h-20 w-20 overflow-hidden rounded-tr-2xl">
                  <div className={`absolute -right-10 -top-10 h-20 w-20 rotate-45 ${g.bgLight} opacity-50`} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 shadow-xl lg:p-10">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
            
            <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <HeartHandshake className="h-10 w-10 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  💚 Garantăm siguranța și transparența procesului!
                </h3>
                <p className="text-slate-600">
                  Toate firmele partenere sunt verificate și au licențe valide. Citește recenziile altor clienți și alege cu încredere. 
                  Dacă nu ești mulțumit de ofertele primite, nu ești obligat să accepți niciuna.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
