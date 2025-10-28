"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, logout } from "@/services/firebase";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

export default function ClientAccount() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-emerald-50 to-sky-50 overflow-hidden">
      <FadeInWhenVisible>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto rounded-3xl bg-white/85 backdrop-blur-md p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl border border-emerald-100 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/40 via-transparent to-sky-100/40 rounded-3xl" />

          {/* Left: Text */}
          <div className="flex-1 max-w-md relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-4">
              Contul tău de client
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Urmărește cererile tale de mutare într-un singur loc, primește oferte personalizate și 
              rămâi mereu la curent cu cele mai bune opțiuni oferite de firmele verificate.
            </p>

            {!user ? (
              <>
                <Link
                  href="/customer/auth"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:scale-105 hover:shadow-emerald-200/60 transition-all"
                >
                  <LogIn size={18} /> Autentificare / Înregistrare
                </Link>
                <p className="text-sm text-gray-500 mt-3">
                  Creează-ți contul gratuit și gestionează toate cererile tale într-un singur loc.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  Bun venit,{" "}
                  <span className="font-semibold text-emerald-600">
                    {user.displayName || user.email}
                  </span>
                  !
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/customer/dashboard"
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition-all hover:scale-105"
                  >
                    <LayoutDashboard size={16} className="inline mr-2" />
                    Panou Client
                  </Link>
                  <button
                    onClick={logout}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex-1 flex justify-center relative z-10"
          >
            <motion.div
              whileHover={{ rotate: -2, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Image
                src="/pics/oferta.png"
                alt="Ofertă primită pe platformă"
                width={260}
                height={260}
                className="rounded-2xl shadow-lg object-cover hidden md:block"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </FadeInWhenVisible>
    </section>
  );
}
