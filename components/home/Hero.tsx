"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "@/utils/firebaseHelpers";

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((user) => setUser(user));
    return () => unsub();
  }, []);

  const handleCTA = () => {
    if (user) router.push("/form");
    else {
      localStorage.setItem("redirectAfterLogin", "form");
      router.push("/customer/auth");
    }
  };

  return (
    <section className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-700/90 to-emerald-900/80">
      {/* Background image */}
      <Image
        src="/pics/index.png"
        alt="Camion de mutări în România"
        fill
        priority
        className="object-cover object-center opacity-50"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl px-6 text-center"
      >
        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-4 inline-block rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-sm"
        >
          🏆 Peste 5.000 de mutări reușite în 2024
        </motion.div>

        <h1 className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl">
          Economisești până la <span className="text-emerald-300">40%</span> la mutare
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-white/90 md:text-xl">
          Primești <strong className="text-emerald-300">3-5 oferte gratuite</strong> în 24h de la
          cele mai bune firme verificate din România. <strong>Fără obligații.</strong> Compară și
          alegi oferta perfectă pentru tine!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCTA}
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:shadow-emerald-400/50"
        >
          Primește oferte GRATUITE <ArrowRight size={24} />
        </motion.button>

        <p className="mt-4 text-sm text-white/80">
          ✓ 100% Gratuit · ✓ Fără obligații · ✓ Răspuns în 24h · ✓ Firme verificate
        </p>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/90"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>
              <strong className="text-emerald-300">4.9/5</strong> rating mediu
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span>
              Economie medie <strong className="text-emerald-300">450 lei</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>
              Răspuns în <strong className="text-emerald-300">24 ore</strong>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
