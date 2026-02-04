"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon as ArrowRight,
  BuildingOfficeIcon as Building2,
  ArrowTrendingUpIcon as TrendingUp,
  UsersIcon as Users,
} from "@heroicons/react/24/outline";

export default function PartnerSection() {
  // Small blur placeholder to avoid layout shift on image reveal
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIBAAAgIBBAMBAAAAAAAAAAAAAQIDBAAFBhESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEuO";
  const benefits = [
    { icon: Users, text: "Cereri de mutare verificate zilnic" },
    { icon: TrendingUp, text: "Comunicare directă, fără comisioane" },
    { icon: Building2, text: "Panou dedicat pentru companii" },
  ];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50 py-12 sm:py-20 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/4 rounded-full bg-emerald-100/40 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[100px]" />
        <div className="absolute top-0 right-0 hidden h-[400px] w-[400px] translate-x-1/4 -translate-y-1/4 rounded-full bg-sky-100/40 blur-[100px] sm:block" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-2xl shadow-slate-200/50 sm:rounded-[2rem]"
          >
            <div className="grid lg:grid-cols-2">
              {/* Left - Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative order-2 lg:order-1"
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-sky-50 to-purple-50" />
                <div className="relative flex h-full min-h-[280px] items-center justify-center p-6 sm:min-h-[400px] sm:p-8 lg:p-12">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-emerald-500/20 to-sky-500/20 blur-2xl" />
                    <Image
                      src="/pics/partner-section.webp"
                      alt="Firme de mutări partenere ofertemutare.ro"
                      width={450}
                      height={350}
                      className="relative rounded-xl object-cover shadow-2xl sm:rounded-2xl"
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 450px"
                      decoding="async"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                    />

                    {/* Floating stats card */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="absolute -right-3 -bottom-3 rounded-xl border border-emerald-100 bg-white p-2.5 shadow-xl sm:-right-4 sm:-bottom-4 sm:rounded-2xl sm:p-4"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg shadow-lg sm:h-12 sm:w-12 sm:rounded-xl"
                          style={{ background: "linear-gradient(to bottom right, #10b981, #0d9488)" }}
                        >
                          <TrendingUp className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-slate-900 sm:text-2xl">50+</p>
                          <p className="text-[10px] text-slate-500 sm:text-xs">Firme partenere</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right - Content */}
              <div className="order-1 flex flex-col justify-center p-6 sm:p-8 lg:order-2 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-50 to-sky-50 px-3 py-1.5 sm:mb-6 sm:px-4 sm:py-2">
                    <Building2 className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
                    <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
                      Pentru Companii
                    </span>
                  </div>

                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-3xl lg:text-4xl">
                    Devino Partener
                    <br />
                    <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ofertemutare.ro
                    </span>
                  </h2>

                  <p className="mb-6 text-base leading-relaxed text-slate-600 sm:mb-8 sm:text-lg">
                    Ai o firmă de mutări și vrei mai mulți clienți fără costuri mari de publicitate?
                    Primești cereri reale de la clienți interesați din orașul tău și din întreaga
                    țară.
                  </p>

                  {/* Benefits */}
                  <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
                    {benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3 sm:gap-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 sm:h-10 sm:w-10 sm:rounded-xl">
                          <benefit.icon className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 sm:text-base">
                          {benefit.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div>
                    <Link
                      href="/partener"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 sm:w-auto sm:gap-3 sm:px-8 sm:py-4 sm:text-base"
                    >
                      Înregistrează-ți firma
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


