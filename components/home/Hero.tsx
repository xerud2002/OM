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
        src="/hero.webp"
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
          Compara prețuri, recenzii și alege varianta potrivită pentru tine — 100% online.
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

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,29,158,17.39C274.86,39.31,343.1,2.07,424,0c75.43-2,143.66,26.59,218,31.88,63.12,4.45,127.13-9.62,186-27.35C939.59,0,995.39-3.48,1048,6.25c52.07,9.61,103.55,29.79,152,52.73V0Z"
            fill="#fff"
            fillOpacity="1"
          ></path>
        </svg>
      </div>
    </section>
  );
}
