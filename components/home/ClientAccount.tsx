"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, LayoutDashboard, User, Bell, FileText, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";
import { useRouter } from "next/router";

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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 lg:py-32">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/50 blur-[80px] sm:h-[600px] sm:w-[600px] sm:blur-[100px]" />
        <div className="absolute bottom-0 left-0 hidden h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-100/50 blur-[100px] sm:block" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-2xl shadow-slate-200/50 sm:rounded-[2rem]"
          >
            <div className="grid lg:grid-cols-2">
              {/* Left - Content */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 sm:mb-6 sm:px-4 sm:py-2">
                    <User className="h-3.5 w-3.5 text-emerald-600 sm:h-4 sm:w-4" />
                    <span className="text-xs font-semibold text-emerald-700 sm:text-sm">
                      Cont de Client
                    </span>
                  </div>

                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:mb-4 sm:text-3xl lg:text-4xl">
                    Gestionează totul
                    <br />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      dintr-un singur loc
                    </span>
                  </h2>

                  <p className="mb-6 text-base leading-relaxed text-slate-600 sm:mb-8 sm:text-lg">
                    Urmărește cererile tale, primește oferte personalizate și comunică direct cu
                    firmele de mutări - totul într-un dashboard intuitiv.
                  </p>

                  {/* Features list */}
                  <div className="mb-6 space-y-2 sm:mb-8 sm:space-y-3">
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                        className="flex items-center gap-2.5 sm:gap-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 sm:h-10 sm:w-10 sm:rounded-xl">
                          <feature.icon className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 sm:text-base">
                          {feature.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  {!user ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/customer/auth"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                        >
                          <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                          Autentificare
                          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Link>
                      </motion.div>
                      <p className="self-center text-xs text-slate-500 sm:text-sm">
                        Gratuit și fără obligații
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-sm text-slate-700 sm:text-base">
                        Bun venit,{" "}
                        <span className="font-semibold text-emerald-600">
                          {user.displayName || user.email}
                        </span>
                        !
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            href="/customer/dashboard"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl sm:w-auto sm:px-6 sm:py-3"
                          >
                            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
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
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto sm:px-6 sm:py-3"
                        >
                          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
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
                <div className="relative flex h-full items-center justify-center p-8 lg:p-12">
                  <motion.div
                    whileHover={{ rotate: -2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="group/image relative"
                  >
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover/image:opacity-100" />
                    <Image
                      src="/pics/client-dashboard.png"
                      alt="Dashboard client ofertemutare.ro"
                      width={400}
                      height={400}
                      className="relative rounded-2xl object-cover shadow-2xl transition-transform duration-500 ease-in-out group-hover/image:scale-[1.01]"
                      sizes="(max-width: 1024px) 70vw, 400px"
                      decoding="async"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIBAAAgIBBAMBAAAAAAAAAAAAAQIDBAAFBhESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEuO"
                    />
                    {/* Tint and ring for consistency */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/25 via-white/10 to-sky-50/25 mix-blend-multiply" />

                    {/* Floating notification card */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="absolute -right-4 -bottom-4 rounded-xl border border-emerald-100 bg-white p-3 shadow-xl lg:-right-6 lg:-bottom-6 lg:rounded-2xl lg:p-4"
                    >
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 lg:h-10 lg:w-10">
                          <Bell className="h-4 w-4 text-emerald-600 lg:h-5 lg:w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 lg:text-sm">
                            Ofertă nouă!
                          </p>
                          <p className="text-[10px] text-slate-500 lg:text-xs">acum 2 minute</p>
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
