"use client";

import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const testimonials = [
  {
    name: "Andreea Popescu",
    text: "Am primit 3 oferte în mai puțin de o zi. Totul a fost clar și profesionist!",
  },
  {
    name: "Mihai Dumitrescu",
    text: "Platforma mi-a economisit timp și bani. Recomand cu încredere!",
  },
  {
    name: "Iulia Radu",
    text: "Am găsit o firmă de mutări excelentă în București în câteva ore!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
      <FadeInWhenVisible>
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-14">
            Ce spun clienții noștri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/80 border border-emerald-100 shadow-md p-6 rounded-2xl backdrop-blur-sm"
              >
                <p className="text-gray-700 italic mb-4">“{t.text}”</p>
                <h4 className="text-emerald-600 font-semibold">{t.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
