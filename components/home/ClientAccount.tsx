"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, LayoutDashboard, User, Bell, FileText, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";
import { useRouter } from "next/navigation";

export default function ClientAccount() {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  const features = [
    { icon: FileText, label: "Cererile tale într-un singur loc" },
    { icon: Bell, label: "Notificări în timp real" },
    { icon: User, label: "Profil personalizat" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-24 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-emerald-100/50 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-100/50 blur-[100px]" />
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
              {/* Left - Content */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Cont de Client</span>
                  </div>

                  <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                    Gestionează totul
                    <br />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      dintr-un singur loc
                    </span>
                  </h2>

                  <p className="mb-8 text-lg leading-relaxed text-slate-600">
                    Urmărește cererile tale, primește oferte personalizate și comunică direct cu firmele de mutări - totul într-un dashboard intuitiv.
                  </p>

                  {/* Features list */}
                  <div className="mb-8 space-y-3">
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                          <feature.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="font-medium text-slate-700">{feature.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  {!user ? (
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/customer/auth"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
                        >
                          <LogIn className="h-5 w-5" />
                          Autentificare
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </motion.div>
                      <p className="self-center text-sm text-slate-500">
                        Gratuit și fără obligații
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-slate-700">
                        Bun venit,{" "}
                        <span className="font-semibold text-emerald-600">
                          {user.displayName || user.email}
                        </span>
                        !
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            href="/customer/dashboard"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                          >
                            <LayoutDashboard className="h-5 w-5" />
                            Panou Client
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={async () => {
                            router.push("/");
                            await logout();
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <LogOut className="h-5 w-5" />
                          Deconectare
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right - Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative hidden lg:block"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-purple-50" />
                <div className="relative flex h-full items-center justify-center p-12">
                  <motion.div
                    whileHover={{ rotate: -2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 blur-2xl" />
                    <Image
                      src="/pics/oferta.png"
                      alt="Dashboard client ofertemutare.ro"
                      width={400}
                      height={400}
                      className="relative rounded-2xl object-cover shadow-2xl"
                      priority
                    />
                    
                    {/* Floating notification card */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute -right-6 -bottom-6 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                          <Bell className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Ofertă nouă!</p>
                          <p className="text-xs text-slate-500">acum 2 minute</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
