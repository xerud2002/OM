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
    <section className="bg-gradient-to-b from-white via-emerald-50/50 to-sky-50/40 py-20">
      <FadeInWhenVisible>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-emerald-700 md:text-4xl">
            Cum funcționează <span className="text-sky-500">Ofertemutare.ro</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-600">
            În doar câțiva pași simpli, primești rapid oferte de la firme verificate și alegi
            mutarea ideală pentru tine.
          </p>

          {/* Steps grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ scale: 1.04, y: -6 }}
                className="group rounded-3xl border border-emerald-100 bg-white p-8 shadow-md transition-all hover:shadow-emerald-100/70"
              >
                <div className="mb-5 flex justify-center text-emerald-600">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 250 }}
                  >
                    {step.icon}
                  </motion.div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-emerald-700">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.desc}</p>
                <motion.div className="mt-5 h-1 w-0 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500 group-hover:w-full" />
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
              href="/customer/dashboard"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Primește oferte GRATUITE <ArrowRight size={24} />
            </Link>
            <p className="mt-4 text-sm font-medium text-gray-600">
              ✓ Completezi în 2 minute · ✓ Fără costuri · ✓ Fără obligații
            </p>
            <p className="mt-2 text-xs text-gray-500">
              🔒 Datele tale sunt protejate și nu vor fi distribuite terților
            </p>
          </motion.div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
