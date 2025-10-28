"use client";

import { motion } from "framer-motion";
import { FormInput, Users, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

export default function Steps() {
  const steps = [
    {
      icon: <FormInput className="text-emerald-600" size={38} />,
      title: "Completează cererea ta de mutare",
      desc: "Spune-ne ce trebuie mutat, de unde și unde. Formularul este rapid, intuitiv și complet gratuit.",
    },
    {
      icon: <Users className="text-sky-600" size={38} />,
      title: "Primești oferte verificate în 24 de ore",
      desc: "Firmele partenere îți trimit oferte personalizate, pe baza detaliilor tale. Poți compara prețuri și condiții fără obligații.",
    },
    {
      icon: <CheckCircle className="text-emerald-600" size={38} />,
      title: "Alegi cea mai bună variantă pentru tine",
      desc: "Compară recenziile, prețurile și timpii de livrare, apoi selectează firma care ți se potrivește cel mai bine.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-emerald-50/50 to-sky-50/40">
      <FadeInWhenVisible>
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Cum funcționează{" "}
            <span className="text-sky-500">Ofertemutare.ro</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            În doar câțiva pași simpli, primești rapid oferte de la firme
            verificate și alegi mutarea ideală pentru tine.
          </p>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ scale: 1.04, y: -6 }}
                className="bg-white rounded-3xl shadow-md border border-emerald-100 p-8 transition-all hover:shadow-emerald-100/70 group"
              >
                <div className="flex justify-center mb-5 text-emerald-600">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 250 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-700 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
                <motion.div
                  className="mt-5 h-1 w-0 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full group-hover:w-full transition-all duration-500"
                />
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Link
              href="/form"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all"
            >
              Începe acum <ArrowRight size={20} />
            </Link>
            <p className="text-gray-500 mt-3 text-sm">
              Rapid · Gratuit · Fără stres
            </p>
          </motion.div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
