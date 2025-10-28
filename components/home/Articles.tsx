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
    <section className="bg-gradient-to-b from-white to-emerald-50 py-16">
      <FadeInWhenVisible>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-14 text-center text-3xl font-bold text-emerald-700 md:text-4xl">
            Sfaturi utile pentru o mutare reușită
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {articles.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.04, y: -4 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col justify-between rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-md transition-all hover:shadow-emerald-200/60"
              >
                <div>
                  <h3 className="mb-2 text-lg font-semibold leading-snug text-emerald-700">
                    {a.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">{a.desc}</p>
                </div>
                <Link
                  href={a.link}
                  className="mt-5 inline-flex items-center gap-1 font-medium text-emerald-600 transition-all hover:underline"
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
