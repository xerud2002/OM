"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "@/services/firebase";

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => onAuthChange(setUser), []);

  const handleGetOffers = () => {
    if (user) router.push("/form");
    else {
      localStorage.setItem("redirectAfterLogin", "form");
      router.push("/customer/auth");
    }
  };

  return (
    <section className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
      <Image
        src="/hero.webp"
        alt="Firme de mutări România"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-6">
          Găsește firma de mutări potrivită pentru tine
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          Compară oferte de la companii verificate și alege varianta ideală pentru mutarea ta.
        </p>
        <button
          onClick={handleGetOffers}
          className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Obține oferte acum
        </button>
      </div>
    </section>
  );
}
