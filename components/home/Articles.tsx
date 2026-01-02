"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, ChevronRight } from "lucide-react";

const articles = [
  {
    title: "Top 5 trucuri pentru împachetarea obiectelor fragile",
    desc: "Află cum să eviți deteriorarea obiectelor tale preferate prin tehnici folosite de profesioniști.",
    link: "/articles/impachetare",
    readTime: "5 min",
    category: "Împachetare",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Cum îți pregătești locuința pentru ziua mutării",
    desc: "De la etichetarea cutiilor până la protejarea podelelor – iată cum să ai o zi de mutare organizată.",
    link: "/articles/pregatire",
    readTime: "7 min",
    category: "Pregătire",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "De ce o vizită virtuală te ajută să primești oferta corectă",
    desc: "Un video call rapid îți oferă o evaluare precisă și te ajută să economisești timp și bani.",
    link: "/articles/survey",
    readTime: "4 min",
    category: "Sfaturi",
    gradient: "from-purple-500 to-pink-600",
  },
];

export default function Articles() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-emerald-100/30 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 hidden h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-sky-100/30 blur-[100px] sm:block" />
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
            <BookOpen className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">Ghid de Mutare</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            Sfaturi pentru o mutare reușită
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Articole utile și ghiduri practice care te ajută să te pregătești pentru ziua mutării.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-8 md:grid-cols-3">
          {articles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={article.link} className="group block h-full">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 sm:rounded-2xl"
                >
                  {/* Top gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${article.gradient} sm:h-2`} />

                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    {/* Meta info */}
                    <div className="mb-3 flex items-center justify-between sm:mb-4">
                      <span className={`rounded-full bg-gradient-to-r ${article.gradient} px-2.5 py-0.5 text-[10px] font-semibold text-white sm:px-3 sm:py-1 sm:text-xs`}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
                        <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600 sm:mb-3 sm:text-lg">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-600 sm:mb-6 sm:text-sm">
                      {article.desc}
                    </p>

                    {/* Read more link */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2.5 sm:gap-2 sm:group-hover:gap-3">
                      Citește articolul
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-transparent to-sky-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all articles link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center sm:mt-12"
        >
          <Link
            href="/articles/tips"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:rounded-full sm:px-6 sm:py-3"
          >
            Vezi toate articolele
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
