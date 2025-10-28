"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormInput, Users, CheckCircle, ArrowRight } from "lucide-react";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const steps = [
  {
    icon: <FormInput className="text-emerald-600" size={38} />,
    title: "Completează cererea ta de mutare",
    desc: "Spune-ne ce trebuie mutat, de unde și unde. Formularul este rapid, intuitiv și complet gratuit.",
  },
  {
    icon: <Users className="text-emerald-600" size={38} />,
    title: "Primești oferte verificate în 24 de ore",
    desc: "Firmele partenere îți trimit oferte personalizate. Poți compara prețuri și condiții fără nicio obligație.",
  },
  {
    icon: <CheckCircle className="text-emerald-600" size={38} />,
    title: "Alegi cea mai bună variantă pentru tine",
    desc: "Analizezi recenziile, compari prețurile și alegi firma care îți oferă cea mai bună combinație de preț, timp și siguranță.",
  },
];

export default function Steps() {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-emerald-50">
      <FadeInWhenVisible>
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-700">
            Cum funcționează platforma{" "}
            <span className="text-sky-500">Ofertemutare.ro</span>?
          </h2>
          <p className="text-gray-600 mt-3 text-lg max-w-3xl mx-auto">
            Cu doar câteva click-uri, primești oferte verificate de la firme din zona ta. Totul 100% online, fără apeluri inutile.
          </p>
        </div>
      </FadeInWhenVisible>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.04, y: -6 }}
            className="relative bg-white/85 p-8 rounded-3xl shadow-lg border border-emerald-100 hover:shadow-emerald-200/70 transition-all duration-300 group"
          >
            <div className="flex justify-center mb-5 mt-4">{s.icon}</div>
            <h3 className="text-xl font-semibold text-emerald-700 mb-3">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link
          href="/form"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:scale-105 transition-all"
        >
          Începe acum <ArrowRight size={20} />
        </Link>
        <p className="text-gray-500 mt-3 text-sm">
          Fără costuri ascunse, fără stres — doar oferte reale.
        </p>
      </div>
    </section>
  );
}
