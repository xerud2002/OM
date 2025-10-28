"use client";
import { motion } from "framer-motion";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

const services = [
  {
    img: "/pics/packing1.png",
    title: "Împachetare profesională",
    desc: "Obiectele fragile, electronicele și mobilierul sunt împachetate cu materiale de protecție de calitate.",
  },
  {
    img: "/pics/dism.png",
    title: "Demontare & reasamblare mobilier",
    desc: "Echipele se ocupă de dezasamblarea și reasamblarea mobilierului rapid și fără daune.",
  },
  {
    img: "/pics/loading4.png",
    title: "Transport sigur și rapid",
    desc: "De la garsoniere până la case întregi, transport curat și echipat corespunzător.",
  },
  {
    img: "/pics/storage.png",
    title: "Depozitare temporară",
    desc: "Ai nevoie de timp între locații? Obiectele tale sunt păstrate în spații sigure și monitorizate.",
  },
  {
    img: "/pics/disposal.png",
    title: "Debarasare responsabilă",
    desc: "Scapă ușor de mobilierul vechi; partenerii noștri le colectează și elimină ecologic.",
  },
];

export default function Services() {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-emerald-50/50 to-sky-50/50">
      <FadeInWhenVisible>
        <div className="max-w-6xl mx-auto text-center mb-16 px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
            Servicii oferite de companiile partenere
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fie că te muți în același oraș sau în alt colț al țării, partenerii
            noștri oferă servicii complete, flexibile și sigure.
          </p>
        </div>
      </FadeInWhenVisible>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              scale: 1.05,
              y: -5,
              boxShadow: "0 10px 30px rgba(16,185,129,0.2)",
            }}
            className="bg-white/85 p-6 rounded-3xl shadow-md border border-emerald-100 hover:shadow-emerald-200/80 flex flex-col justify-between transition-all"
          >
            <motion.img
              src={s.img}
              alt={s.title}
              className="rounded-2xl object-cover w-full h-40 mb-4"
              whileHover={{ scale: 1.05 }}
            />
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
