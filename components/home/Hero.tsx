"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "@/services/firebase";

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(setUser);
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
    <section className="relative h-[90vh] w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-emerald-700/90 to-emerald-900/80">
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
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-6">
          Mută-te fără stres cu ajutorul{" "}
          <span className="text-emerald-300">Ofertemutare.ro</span>
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
          Primește rapid oferte reale de la firme de mutări verificate din România.
          Compara prețuri, recenzii și alege varianta potrivită pentru tine.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCTA}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-emerald-400/40 transition-all"
        >
          Obține oferte acum <ArrowRight size={20} />
        </motion.button>

        <p className="text-white/70 text-sm mt-4">
          Fără costuri ascunse · Firme verificate · Timp economisit
        </p>
      </motion.div>
    </section>
  );
}
