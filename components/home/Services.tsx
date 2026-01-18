"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Package, Wrench, Truck, Warehouse, Trash2, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      img: "/pics/service-packing.png",
      iconImg: "/pics/icon-packing.png",
      icon: Package,
      title: "Împachetare profesională",
      desc: "Obiectele fragile și mobilierul sunt împachetate cu materiale de protecție de calitate.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
    },
    {
      img: "/pics/service-furniture.png",
      iconImg: "/pics/icon-furniture.png",
      icon: Wrench,
      title: "Demontare mobilier",
      desc: "Dezasamblare și reasamblare a mobilierului mare, rapid și fără daune.",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
    },
    {
      img: "/pics/service-transport.png",
      iconImg: "/pics/icon-transport.png",
      icon: Truck,
      title: "Transport sigur",
      desc: "De la garsoniere la case întregi, transport cu autoutilitare curate și echipate.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
    },
    {
      img: "/pics/service-storage.png",
      iconImg: "/pics/icon-storage.png",
      icon: Warehouse,
      title: "Depozitare temporară",
      desc: "Spații sigure, ventilate și monitorizate 24/7 pentru obiectele tale.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      img: "/pics/service-disposal.png",
      iconImg: "/pics/icon-disposal.png",
      icon: Trash2,
      title: "Debarasare",
      desc: "Colectare și eliminare ecologică a mobilierului vechi sau obiectelor inutile.",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-slate-50/50 to-white py-16 sm:py-20 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 h-75 w-75 -translate-x-1/2 rounded-full bg-emerald-100/30 blur-[80px] sm:h-125 sm:w-125 sm:blur-[100px]" />
        <div className="absolute right-0 bottom-1/4 hidden h-100 w-100 translate-x-1/2 rounded-full bg-sky-100/30 blur-[100px] sm:block" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-16"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:mb-4 sm:px-4 sm:py-2">
            <Truck className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
            <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
              Servicii Complete
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:mb-5 sm:text-4xl md:text-5xl">
            Tot ce ai nevoie pentru{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              mutare
            </span>
          </h2>
          <p className="text-base text-slate-600 sm:text-lg">
            Firmele noastre partenere oferă servicii profesionale complete, de la împachetare până
            la instalare la noua locație.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
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
                className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/50 bg-white shadow-lg transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 sm:rounded-2xl"
              >
                {/* Image */}
                <div className="relative h-24 overflow-visible bg-linear-to-br from-slate-50 to-slate-100 sm:h-40">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-110 sm:p-4"
                    loading="lazy"
                  />
                </div>

                {/* Icon badge - positioned outside image container */}
                <div className="relative z-10 -mt-5 flex justify-center sm:-mt-8">
                  <div
                    className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg ring-4 ring-white sm:h-14 sm:w-14 sm:rounded-2xl`}
                  >
                    <Image
                      src={service.iconImg}
                      alt={service.title}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-3 pt-2 text-center sm:p-5 sm:pt-3">
                  <h3 className="mb-1 text-sm font-bold text-slate-900 sm:mb-2 sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="hidden flex-1 text-sm leading-relaxed text-slate-600 sm:block">
                    {service.desc}
                  </p>
                </div>

                {/* Hover gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-emerald-50/0 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
          className="mx-auto mt-10 max-w-2xl text-center sm:mt-16"
        >
          <Link 
            href="/customer/auth"
            className="inline-flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100 sm:flex-row sm:gap-2 sm:rounded-full sm:px-6 sm:py-3"
          >
            <span className="text-sm text-slate-600 sm:text-base">
              Ai nevoie de un serviciu specific?
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600 sm:gap-2">
              Descrie-l în cererea ta!
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
