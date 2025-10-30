"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-sky-50/60 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_70%)]" />

      <FadeInWhenVisible>
        <div className="relative z-10 mx-auto mb-16 max-w-6xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-emerald-700 md:text-4xl">
            Servicii oferite de companiile partenere
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
            Indiferent dacă te muți în același oraș sau în alt colț al țării, partenerii noștri
            oferă servicii complete de mutare rapide, sigure și flexibile.
          </p>
        </div>
      </FadeInWhenVisible>

      {/* Grid of services */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-5">
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
            className="group flex h-full min-h-[380px] flex-col items-center justify-start rounded-3xl border border-emerald-100 bg-white/85 p-6 text-center shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-emerald-200/80"
          >
            {/* Image */}
            <div className="relative mb-5 h-[160px] w-full overflow-hidden rounded-2xl bg-emerald-50/50">
              <Image
                src={s.img}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Title & Description */}
            <h3 className="mb-3 flex min-h-[56px] items-center justify-center text-lg font-semibold text-emerald-700">
              {s.title}
            </h3>
            <p className="flex-grow text-sm leading-relaxed text-gray-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
