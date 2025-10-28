"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const articles = [
  {
    title: "Top 5 trucuri pentru împachetarea eficientă a obiectelor fragile",
    desc: "Află cum să eviți deteriorarea obiectelor tale preferate prin tehnici folosite de profesioniști.",
    link: "/articles/impachetare",
  },
  {
    title: "Cum îți pregătești locuința pentru ziua mutării fără stres",
    desc: "De la etichetarea cutiilor până la protejarea podelelor – iată cum să ai o zi de mutare organizată și calmă.",
    link: "/articles/pregatire",
  },
  {
    title: "De ce o vizită virtuală (survey) te ajută să primești o ofertă corectă",
    desc: "Un video call rapid îți oferă o evaluare precisă și te ajută să economisești timp și bani.",
    link: "/articles/survey",
  },
];

export default function Articles() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
      <FadeInWhenVisible>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-700 mb-14">
            Sfaturi utile pentru o mutare reușită
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {articles.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/90 border border-emerald-100 shadow-md hover:shadow-emerald-200/60 p-8 rounded-3xl flex flex-col justify-between transition-all"
              >
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2 leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {a.desc}
                  </p>
                </div>
                <Link
                  href={a.link}
                  className="mt-5 inline-flex items-center gap-1 text-emerald-600 font-medium hover:underline transition-all"
                >
                  Citește mai mult <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
