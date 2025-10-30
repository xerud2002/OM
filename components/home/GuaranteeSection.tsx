"use client";

import { motion } from "framer-motion";
import { Shield, Lock, ThumbsUp, Clock } from "lucide-react";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

export default function GuaranteeSection() {
  const guarantees = [
    {
      icon: <Shield className="text-emerald-600" size={32} />,
      title: "100% Gratuit",
      desc: "Platforma este complet gratuită. Nu plătești nimic pentru a primi oferte.",
    },
    {
      icon: <Lock className="text-sky-600" size={32} />,
      title: "Date Protejate",
      desc: "Informațiile tale sunt criptate și nu sunt distribuite terților.",
    },
    {
      icon: <ThumbsUp className="text-emerald-600" size={32} />,
      title: "Fără Obligații",
      desc: "Primești oferte fără nicio obligație de a accepta. Tu decizi!",
    },
    {
      icon: <Clock className="text-sky-600" size={32} />,
      title: "Răspuns Garantat",
      desc: "Primești oferte în maxim 24 de ore sau îți returnăm... nimic, că e gratuit! 😊",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/30 via-white to-sky-50/30 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="relative z-10 mx-auto mb-12 max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            🛡️ Garanțiile Noastre
          </motion.div>

          <h2 className="mb-4 text-3xl font-bold text-emerald-700 md:text-4xl">
            De ce să alegi Ofertemutare.ro?
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Suntem dedicați să îți oferim cea mai simplă și sigură experiență de comparare a
            ofertelor de mutare din România.
          </p>
        </div>
      </FadeInWhenVisible>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
        {guarantees.map((g, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="flex flex-col items-center rounded-2xl border border-emerald-100 bg-white/90 p-6 text-center shadow-md backdrop-blur-sm transition-all hover:shadow-emerald-100"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-sky-50"
            >
              {g.icon}
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold text-emerald-700">{g.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{g.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Final trust message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 mx-auto mt-12 max-w-3xl px-6 text-center"
      >
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-sky-50 p-8 shadow-lg">
          <p className="mb-4 text-lg font-semibold text-emerald-700">
            💚 Garantăm siguranța și transparența procesului!
          </p>
          <p className="text-sm leading-relaxed text-gray-600">
            Toate firmele partenere sunt verificate și au licențe valide. Citește recenziile altor
            clienți și alege cu încredere. Dacă nu ești mulțumit de ofertele primite, nu ești
            obligat să accepți niciuna.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
