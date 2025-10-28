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
        <h1 className="mb-6 text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl">
          Mută-te fără stres cu ajutorul <span className="text-emerald-300">Ofertemutare.ro</span>
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-white/90 md:text-xl">
          Primește rapid oferte reale de la firme de mutări verificate din România. Compara prețuri,
          recenzii și alege varianta potrivită pentru tine.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCTA}
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-emerald-400/40"
        >
          Obține oferte acum <ArrowRight size={20} />
        </motion.button>

        <p className="mt-4 text-sm text-white/70">
          Fără costuri ascunse · Firme verificate · Timp economisit
        </p>
      </motion.div>
    </section>
  );
}
