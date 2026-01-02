"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Package, Wrench, Truck, Warehouse, Trash2, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      img: "/pics/packing1.png",
      icon: Package,
      title: "Împachetare profesională",
      desc: "Obiectele fragile și mobilierul sunt împachetate cu materiale de protecție de calitate.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
    },
    {
      img: "/pics/dism.png",
      icon: Wrench,
      title: "Demontare mobilier",
      desc: "Dezasamblare și reasamblare a mobilierului mare, rapid și fără daune.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
    },
    {
      img: "/pics/loading4.png",
      icon: Truck,
      title: "Transport sigur",
      desc: "De la garsoniere la case întregi, transport cu autoutilitare curate și echipate.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
    },
    {
      img: "/pics/storage.png",
      icon: Warehouse,
      title: "Depozitare temporară",
      desc: "Spații sigure, ventilate și monitorizate 24/7 pentru obiectele tale.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      img: "/pics/disposal.png",
      icon: Trash2,
      title: "Debarasare",
      desc: "Colectare și eliminare ecologică a mobilierului vechi sau obiectelor inutile.",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-24 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-100/30 blur-[100px]" />
        <div className="absolute right-0 bottom-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-sky-100/30 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
            <Truck className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Servicii Complete</span>
          </div>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Tot ce ai nevoie pentru mutare
          </h2>
          <p className="text-lg text-slate-600">
            Firmele noastre partenere oferă servicii profesionale complete, de la împachetare până la instalare la noua locație.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-lg transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50"
              >
                {/* Image */}
                <div className="relative h-40 overflow-visible bg-gradient-to-br from-slate-50 to-slate-100">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                
                {/* Icon badge - positioned outside image container */}
                <div className="relative z-10 -mt-6 flex justify-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} shadow-lg`}>
                    <service.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 pt-3 text-center">
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-slate-600">
                    {service.desc}
                  </p>
                </div>

                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-50/0 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto mt-16 max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
            <span className="text-slate-600">Ai nevoie de un serviciu specific?</span>
            <span className="font-semibold text-emerald-600">Descrie-l în cererea ta!</span>
            <ArrowRight className="h-4 w-4 text-emerald-600" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
