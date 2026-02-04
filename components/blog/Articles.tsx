"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon as ArrowRight,
  BookOpenIcon as BookOpen,
  ClockIcon as Clock,
  ChevronRightIcon as ChevronRight,
} from "@heroicons/react/24/outline";

const articles = [
  {
    title: "Cât Costă o Mutare în România 2026 | Prețuri Reale",
    desc: "Analiză detaliată a costurilor: prețuri pe cameră, distanță și servicii extra. Află cum să obții cel mai bun preț.",
    link: "/articles/cat-costa-mutarea-2026",
    readTime: "6 min",
    category: "Costuri",
    gradient: "linear-gradient(to right, #059669, #34d399)",
    image: "/pics/blog/moving-cost-2026.webp",
  },
  {
    title: "Ghid Mutare în Cluj-Napoca 2026",
    desc: "Tot ce trebuie să știi despre viața și mutarea în 'Silicon Valley' de România. Prețuri, zone și logistică pentru IT-iști și studenți.",
    link: "/guides/mutare-cluj-napoca",
    readTime: "7 min",
    category: "Ghid Oraș",
    gradient: "linear-gradient(to right, #2563eb, #60a5fa)",
    image: "/pics/blog/cluj-guide-2026.webp",
  },
  {
    title: "Ghid Complet Mutare în București 2026",
    desc: "Cartiere, prețuri și sfaturi practice pentru o mutare fără stres în Capitală. Tot ce trebuie să știi despre logistică și parcare.",
    link: "/guides/mutare-bucuresti-complet",
    readTime: "8 min",
    category: "Ghid Oraș",
    gradient: "linear-gradient(to right, #2563eb, #3b82f6)",
    image: "/pics/blog/bucharest-guide-2026.webp",
  },
  {
    title: "Top 5 trucuri pentru împachetarea obiectelor fragile",
    desc: "Află cum să eviți deteriorarea obiectelor tale preferate prin tehnici folosite de profesioniști.",
    link: "/articles/impachetare",
    readTime: "5 min",
    category: "Împachetare",
    gradient: "linear-gradient(to right, #3b82f6, #4f46e5)",
    image: "/pics/blog/packing-fragile.webp",
  },
  {
    title: "Cum îți pregătești locuința pentru ziua mutării",
    desc: "De la etichetarea cutiilor până la protejarea podelelor, iată cum să ai o zi de mutare organizată.",
    link: "/articles/pregatire",
    readTime: "7 min",
    category: "Pregătire",
    gradient: "linear-gradient(to right, #10b981, #0d9488)",
    image: "/pics/blog/moving-prep.webp",
  },
  {
    title: "De ce o vizită virtuală te ajută să primești oferta corectă",
    desc: "Un video call rapid îți oferă o evaluare precisă și te ajută să economisești timp și bani.",
    link: "/articles/survey",
    readTime: "4 min",
    category: "Sfaturi",
    gradient: "linear-gradient(to right, #a855f7, #ec4899)",
    image: "/pics/blog/video-survey-v2.webp",
  },
];

export default function Articles() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-white py-12 sm:py-20 lg:py-32">
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
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
              Ghiduri Gratuite
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            Totul pentru o{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              mutare reușită
            </span>
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Articole practice, sfaturi de la experți și tot ce trebuie să știi pentru a economisi timp și bani.
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
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-lg transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 sm:rounded-2xl"
                >
                  {/* Image Container */}
                  <div className="relative h-64 w-full overflow-hidden border-b border-slate-100 bg-white p-4">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Category Badge overlay on image */}
                    <div className="absolute left-4 top-4 z-10">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:px-3 sm:py-1 sm:text-xs"
                        style={{ background: article.gradient }}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    {/* Meta info - simplified */}
                    <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-500 sm:mb-4 sm:text-xs">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime} lectură</span>
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
            href="/blog"
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

