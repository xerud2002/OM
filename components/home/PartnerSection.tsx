"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Building2, TrendingUp, Users } from "lucide-react";

export default function PartnerSection() {
  const benefits = [
    { icon: Users, text: "Cereri de mutare verificate zilnic" },
    { icon: TrendingUp, text: "Comunicare directă, fără comisioane" },
    { icon: Building2, text: "Panou dedicat pentru companii" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-24 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/4 rounded-full bg-emerald-100/40 blur-[100px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] translate-x-1/4 -translate-y-1/4 rounded-full bg-sky-100/40 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white shadow-2xl shadow-slate-200/50"
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-purple-50" />
                <div className="relative flex h-full min-h-[400px] items-center justify-center p-8 lg:p-12">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 blur-2xl" />
                    <Image
                      src="/pics/partner.png"
                      alt="Firme de mutări partenere ofertemutare.ro"
                      width={450}
                      height={350}
                      className="relative rounded-2xl object-cover shadow-2xl"
                    />
                    
                    {/* Floating stats card */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="absolute -bottom-4 -right-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">50+</p>
                          <p className="text-xs text-slate-500">Firme partenere</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Right - Content */}
              <div className="order-1 flex flex-col justify-center p-8 lg:order-2 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-sky-50 px-4 py-2">
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Pentru Companii</span>
                  </div>

                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                    Devino partener
                    <br />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ofertemutare.ro
                    </span>
                  </h2>

                  <p className="mb-8 text-lg leading-relaxed text-slate-600">
                    Ai o firmă de mutări și vrei mai mulți clienți fără costuri mari de publicitate? 
                    Primești cereri reale de la clienți interesați din orașul tău și din întreaga țară.
                  </p>

                  {/* Benefits */}
                  <div className="mb-8 space-y-4">
                    {benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-700">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/company/auth"
                      className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
                    >
                      Înregistrează-ți firma
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
