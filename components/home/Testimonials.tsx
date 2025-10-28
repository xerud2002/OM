"use client";

import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const testimonials = [
  {
    name: "Andreea Popescu",
    role: "Clientă – București",
    text: "Am primit 3 oferte în mai puțin de o oră și am economisit peste 400 lei. Totul a fost simplu și rapid!",
    avatar: "/pics/avatar1.png",
  },
  {
    name: "Mihai Ionescu",
    role: "Client – Cluj-Napoca",
    text: "O platformă foarte utilă. Am comparat prețurile ușor și am ales firma potrivită fără stres.",
    avatar: "/pics/avatar2.png",
  },
  {
    name: "Elena Marin",
    role: "Clientă – Brașov",
    text: "Firmele partenere au fost profesioniste, iar mutarea a decurs perfect. Recomand cu drag!",
    avatar: "/pics/avatar3.png",
  },
  {
    name: "Adrian Toma",
    role: "Client – Iași",
    text: "Mi-a plăcut claritatea și simplitatea formularului. Într-o zi aveam totul stabilit pentru mutare!",
    avatar: "/pics/avatar4.png",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(16,185,129,0.05),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Ce spun clienții noștri
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Peste 5.000 de utilizatori au folosit <strong>ofertemutare.ro</strong> pentru a
            compara oferte de mutare în siguranță și fără bătăi de cap.
          </p>
        </div>
      </FadeInWhenVisible>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 relative z-10">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white/85 backdrop-blur-md border border-emerald-100 rounded-3xl shadow-md hover:shadow-emerald-200/70 p-6 flex flex-col items-center text-center transition-all duration-300"
          >
            {/* Avatar */}
            <div className="w-16 h-16 mb-4 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm bg-emerald-50 flex items-center justify-center">
              {t.avatar ? (
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-emerald-600 font-bold text-xl">
                  {t.name[0]}
                </span>
              )}
            </div>

            {/* Text */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
              “{t.text}”
            </p>
            <h4 className="text-emerald-700 font-semibold">{t.name}</h4>
            <span className="text-gray-500 text-xs">{t.role}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
