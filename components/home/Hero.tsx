"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange } from "@/utils/firebaseHelpers";
import Image from "next/image";

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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-24 pb-16 lg:pt-32 lg:pb-24">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-[10%] h-[500px] w-[500px] rounded-full bg-emerald-200/40 blur-[100px]" />
        <div className="absolute right-[5%] bottom-20 h-[400px] w-[400px] rounded-full bg-sky-200/40 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-100/30 blur-[80px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-5 py-2.5 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-700">
                🎉 Peste 5.000+ mutări realizate cu succes
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Mutări simple,
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 bg-clip-text text-transparent">
                  prețuri corecte.
                </span>
                <motion.span 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 h-3 w-full origin-left bg-gradient-to-r from-emerald-200 to-sky-200 opacity-50"
                />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0 lg:text-xl">
              Completezi o singură cerere și primești <span className="font-semibold text-emerald-600">până la 5 oferte</span> de la firme verificate. 
              Compari, alegi și <span className="font-semibold text-emerald-600">economisești până la 40%</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <motion.button 
                onClick={handleCTA}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:shadow-2xl hover:shadow-emerald-500/30 sm:w-auto"
              >
                <Sparkles className="h-5 w-5" />
                Obține oferte gratuite
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <motion.button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 sm:w-auto"
              >
                Cum funcționează?
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:justify-start"
            >
              {[
                { icon: ShieldCheck, label: "Firme Verificate", color: "text-emerald-600" },
                { icon: CheckCircle, label: "100% Gratuit", color: "text-sky-600" },
                { icon: Star, label: "4.9/5 Rating", color: "text-amber-500" },
                { icon: TrendingUp, label: "Economie ~40%", color: "text-purple-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex-1"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-2xl shadow-slate-200/50">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-emerald-50/50">
                  <Image 
                    src="/pics/index.png" 
                    alt="Platforma Oferte Mutare" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                </div>
                
                {/* Floating Stats Card */}
                <motion.div 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 rounded-2xl border border-emerald-100 bg-white/95 p-5 shadow-xl backdrop-blur-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-lg">
                        OM
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Cerere nouă primită!</p>
                        <p className="text-xs text-slate-500">acum 2 minute</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-100 px-3 py-1">
                      <span className="text-xs font-semibold text-emerald-700">5 Oferte</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Economie estimată</span>
                    <span className="font-bold text-emerald-600">~450 RON</span>
                  </div>
                </motion.div>
              </div>

              {/* Floating Badge - Top Right */}
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -6 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="absolute -top-4 -right-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-amber-700">4.9/5</span>
                </div>
                <p className="text-xs text-amber-600">5000+ reviews</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
