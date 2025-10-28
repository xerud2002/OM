"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SlideInWhenVisible from "@/components/SlideInWhenVisible";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

export default function PartnerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-20">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.08),transparent_70%)]" />

      <FadeInWhenVisible>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl border border-emerald-100 bg-white/85 p-10 shadow-xl backdrop-blur-md md:grid-cols-2"
        >
          {/* Left - Text Content */}
          <SlideInWhenVisible direction="left" className="space-y-5">
            <h2 className="text-3xl font-bold leading-tight text-emerald-700 md:text-4xl">
              Devino partener ofertemutare.ro
            </h2>

            <p className="leading-relaxed text-gray-700">
              Ai o firmă de mutări și vrei mai mulți clienți fără costuri mari de publicitate? Prin
              platforma <strong>ofertemutare.ro</strong> primești cereri reale de la clienți
              interesați din orașul tău și din întreaga țară.
            </p>

            <ul className="mb-8 space-y-2 text-sm text-gray-700 md:text-base">
              <li>✅ Primești cereri de mutare verificate</li>
              <li>✅ Comunici direct cu clientul, fără comisioane ascunse</li>
              <li>✅ Acces rapid la panou dedicat companiilor</li>
            </ul>

            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <Link
                href="/company/auth"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-emerald-300/50"
              >
                Înregistrează-ți firma <ArrowRight size={20} />
              </Link>
            </motion.div>
          </SlideInWhenVisible>

          {/* Right - Image */}
          <SlideInWhenVisible direction="right">
            <Image
              src="/pics/partner.png"
              alt="Firme de mutări partenere ofertemutare.ro"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-md transition-all duration-300 hover:shadow-emerald-100"
            />
          </SlideInWhenVisible>
        </motion.div>
      </FadeInWhenVisible>
    </section>
  );
}
