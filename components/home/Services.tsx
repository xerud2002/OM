"use client";

import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

export default function Services() {
  const services = [
    {
      img: "/pics/packing1.png",
      title: "Împachetare profesională",
      desc: "Obiectele fragile, electronicele și mobilierul sunt împachetate cu materiale de protecție de calitate, pentru transport sigur.",
    },
    {
      img: "/pics/dism.png",
      title: "Demontare & reasamblare mobilier",
      desc: "Echipele de mutări se ocupă de dezasamblarea și reasamblarea mobilierului mare, rapid și fără daune.",
    },
    {
      img: "/pics/loading4.png",
      title: "Transport sigur și rapid",
      desc: "De la garsoniere la case întregi, partenerii noștri asigură transportul cu autoutilitare curate și echipate corespunzător.",
    },
    {
      img: "/pics/storage.png",
      title: "Depozitare temporară",
      desc: "Ai nevoie de timp între locații? Obiectele tale pot fi depozitate în spații sigure, ventilate și monitorizate 24/7.",
    },
    {
      img: "/pics/disposal.png",
      title: "Debarasare responsabilă",
      desc: "Scapă ușor de mobilierul vechi sau obiectele inutile. Firmele partenere le colectează și le elimină ecologic.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-emerald-50/60 to-sky-50/60 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="max-w-6xl mx-auto text-center mb-16 px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Servicii oferite de companiile partenere
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Indiferent dacă te muți în același oraș sau în alt colț al țării, 
            partenerii noștri oferă servicii complete de mutare — rapide, sigure și flexibile.
          </p>
        </div>
      </FadeInWhenVisible>

      {/* Grid of services */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-6 relative z-10">
        {services.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            whileHover={{
              scale: 1.04,
              y: -4,
              boxShadow: "0 10px 25px rgba(16,185,129,0.15)",
            }}
            className="group bg-white/85 backdrop-blur-sm p-6 rounded-3xl shadow-md border border-emerald-100 hover:shadow-emerald-200/80 flex flex-col justify-start items-center text-center h-full min-h-[380px] transition-all duration-300"
          >
            {/* Image */}
            <div className="w-full h-[160px] flex items-center justify-center overflow-hidden rounded-2xl mb-5 bg-emerald-50/50">
              <motion.img
                src={s.img}
                alt={s.title}
                className="object-contain w-[90%] h-[140px] rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-emerald-700 mb-3 min-h-[56px] flex items-center justify-center">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-grow">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
