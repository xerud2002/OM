"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LogIn, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";
import FadeInWhenVisible from "@/components/FadeInWhenVisible";

export default function ClientAccount() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  return (
    <section className="overflow-hidden bg-gradient-to-r from-emerald-50 to-sky-50 py-20">
      <FadeInWhenVisible>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 overflow-hidden rounded-3xl border border-emerald-100 bg-white/85 p-10 shadow-xl backdrop-blur-md md:flex-row"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-100/40 via-transparent to-sky-100/40" />

          {/* Left: Text */}
          <div className="relative z-10 max-w-md flex-1">
            <h2 className="mb-4 text-3xl font-bold text-emerald-700 md:text-4xl">
              Contul tău de client
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              Urmărește cererile tale de mutare într-un singur loc, primește oferte personalizate și
              rămâi mereu la curent cu cele mai bune opțiuni oferite de firmele verificate.
            </p>

            {!user ? (
              <>
                <Link
                  href="/customer/auth"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-emerald-200/60"
                >
                  <LogIn size={18} /> Autentificare / Înregistrare
                </Link>
                <p className="mt-3 text-sm text-gray-500">
                  Creează-ți contul gratuit și gestionează toate cererile tale într-un singur loc.
                </p>
              </>
            ) : (
              <>
                <p className="mb-4 text-gray-700">
                  Bun venit,{" "}
                  <span className="font-semibold text-emerald-600">
                    {user.displayName || user.email}
                  </span>
                  !
                </p>
                <div className="flex gap-4">
                  <Link
                    href="/customer/dashboard"
                    className="rounded-lg bg-emerald-600 px-6 py-2 text-white shadow transition-all hover:scale-105 hover:bg-emerald-700"
                  >
                    <LayoutDashboard size={16} className="mr-2 inline" />
                    Panou Client
                  </Link>
                  <button
                    onClick={logout}
                    className="rounded-lg bg-red-500 px-6 py-2 text-white shadow transition-all hover:scale-105 hover:bg-red-600"
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
            className="relative z-10 flex flex-1 justify-center"
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
                className="hidden rounded-2xl object-cover shadow-lg md:block"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </FadeInWhenVisible>
    </section>
  );
}
