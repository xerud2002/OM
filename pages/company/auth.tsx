"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Building2, ArrowRight, Users, TrendingUp, Award } from "lucide-react";
import Image from "next/image";
import { translateFirebaseError } from "@/utils/authErrors";
import { toast } from "sonner";

export default function CompanyAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // 🔹 Redirect automat dacă userul e deja logat
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/company/dashboard");
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const mod = await import("@/utils/firebaseHelpers");
      const user = await mod.loginWithGoogle("company");

      // Handle popup blocked/cancelled case
      if (!user) {
        setLoading(false);
        return; // User cancelled or popup was blocked - no error message needed
      }

      const role = await mod.getUserRole(user);
      if (role !== "company") {
        setMessage(
          "Contul tău este înregistrat ca client – folosește pagina de autentificare pentru clienți."
        );
        router.push("/customer/auth");
        return;
      }
      toast.success(`Bine ai revenit, ${user.displayName || "partener"}! 👋`);
      router.push("/company/dashboard");
    } catch (err: any) {
      if (err?.code === "ROLE_CONFLICT" || (err?.message || "").includes("registered as")) {
        try {
          const mod = await import("@/utils/firebaseHelpers");
          const current = auth.currentUser;
          const role = current ? await mod.getUserRole(current) : null;
          if (role === "customer") {
            setMessage("Contul tău este înregistrat ca client. Redirecționare...");
            router.push("/customer/auth");
            return;
          }
        } catch {
          // ignore
        }
      }
      setMessage(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const mod = await import("@/utils/firebaseHelpers");
      if (isLogin) {
        const user = await mod.loginWithEmail({ email, password });
        const role = await mod.getUserRole(user);
        if (role !== "company") {
          setMessage(
            "Acest cont este înregistrat ca client. Folosește pagina de autentificare pentru clienți."
          );
          router.push("/customer/auth");
          return;
        }
        toast.success(`Bine ai revenit, ${user.displayName || user.email?.split("@")[0] || "partener"}! 👋`);
        router.push("/company/dashboard");
      } else {
        await mod.registerWithEmail("company", { email, password });
        toast.success("Cont firmă creat cu succes! Bine ai venit! 🎉");
        router.push("/company/dashboard");
      }
    } catch (err: any) {
      if (err?.code === "ROLE_CONFLICT" || (err?.message || "").includes("registered as")) {
        try {
          const mod = await import("@/utils/firebaseHelpers");
          const current = auth.currentUser;
          const role = current ? await mod.getUserRole(current) : null;
          if (role === "customer") {
            setMessage("Acest cont este înregistrat ca client. Redirecționare...");
            router.push("/customer/auth");
            return;
          }
        } catch {
          // ignore
        }
      }
      setMessage(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return setMessage("Introdu adresa de email pentru resetare.");
    try {
      const mod = await import("@/utils/firebaseHelpers");
      await mod.resetPassword(email);
      setMessage("Email de resetare trimis ✉️");
    } catch (err: any) {
      setMessage(translateFirebaseError(err));
    }
  };

  return (
    <>
      <Head>
        <title>Autentificare Firmă | OferteMutare.ro</title>
        <meta
          name="description"
          content="Autentifică-te sau înregistrează-ți firma pe OferteMutare.ro. Accesează cereri de mutări și crește-ți business-ul."
        />
        <link rel="canonical" href="https://ofertemutare.ro/company/auth" />
      </Head>

      <LayoutWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
            {/* Left Side - Illustration & Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative hidden bg-gradient-company p-12 lg:flex lg:flex-col lg:justify-between"
            >
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                >
                  <Building2 size={16} />
                  Pentru Firme
                </motion.div>

                <h2 className="mb-4 text-4xl font-bold text-white">
                  Dezvoltă-ți
                  <br />
                  <span className="text-blue-100">business-ul.</span>
                </h2>
                <p className="text-lg text-blue-50">
                  Primești cereri verificate de la clienți reali și îți crești vânzările.
                </p>
              </div>

              {/* Benefits list */}
              <div className="relative z-10 space-y-4">
                {[
                  { icon: Users, text: "Acces la clienți verificați" },
                  { icon: TrendingUp, text: "Crește-ți vânzările" },
                  { icon: Award, text: "Verificare gratuită" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 text-white"
                  >
                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                      <item.icon size={20} />
                    </div>
                    <span className="text-blue-50">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Decorative illustration */}
              <div className="absolute right-8 bottom-8 opacity-10">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    stroke="white"
                    strokeWidth="2"
                    rx="20"
                  />
                  <rect
                    x="40"
                    y="40"
                    width="120"
                    height="120"
                    stroke="white"
                    strokeWidth="2"
                    rx="15"
                  />
                  <rect
                    x="60"
                    y="60"
                    width="80"
                    height="80"
                    stroke="white"
                    strokeWidth="2"
                    rx="10"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-12"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                >
                  <Building2 size={16} />
                  Cont Firmă
                </motion.div>

                <h1 className="mb-2 text-3xl font-bold text-slate-900 lg:text-4xl">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isLogin ? "login" : "register"}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isLogin ? "Bine ai revenit!" : "Alătură-te platformei"}
                    </motion.span>
                  </AnimatePresence>
                </h1>
                <p className="text-gray-600">
                  {isLogin
                    ? "Intră în cont pentru a gestiona cererile."
                    : "Înregistrează-te și primește cereri de ofertă."}
                </p>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-6">
                {/* Email Input with Floating Label */}
                <div className="group relative">
                  <label
                    htmlFor="company-email"
                    className={`pointer-events-none absolute left-12 transition-all duration-200 ${email
                        ? "-top-2.5 left-3 bg-white px-2 text-xs font-medium text-blue-600"
                        : "top-3.5 text-gray-400 group-focus-within:-top-2.5 group-focus-within:left-3 group-focus-within:bg-white group-focus-within:px-2 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-blue-600"
                      }`}
                  >
                    Email firmă
                  </label>
                  <div className="relative flex items-center rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3.5 transition-all duration-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:ring-4 focus-within:shadow-blue-100 focus-within:ring-blue-50 hover:border-gray-300 hover:shadow-sm">
                    <motion.div
                      animate={{
                        scale: email ? 1.1 : 1,
                        rotate: email ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Mail
                        size={20}
                        className="mr-3 text-gray-400 transition-all duration-300 group-focus-within:text-blue-600 group-hover:text-gray-500"
                      />
                    </motion.div>
                    <input
                      id="company-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-gray-900 placeholder-transparent outline-none"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Input with Floating Label */}
                <div className="group relative">
                  <label
                    htmlFor="company-password"
                    className={`pointer-events-none absolute left-12 transition-all duration-200 ${password
                        ? "-top-2.5 left-3 bg-white px-2 text-xs font-medium text-blue-600"
                        : "top-3.5 text-gray-400 group-focus-within:-top-2.5 group-focus-within:left-3 group-focus-within:bg-white group-focus-within:px-2 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-blue-600"
                      }`}
                  >
                    Parolă
                  </label>
                  <div className="relative flex items-center rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3.5 transition-all duration-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:ring-4 focus-within:shadow-blue-100 focus-within:ring-blue-50 hover:border-gray-300 hover:shadow-sm">
                    <motion.div
                      animate={{
                        scale: password ? 1.1 : 1,
                        rotate: password ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lock
                        size={20}
                        className="mr-3 text-gray-400 transition-all duration-300 group-focus-within:text-blue-600 group-hover:text-gray-500"
                      />
                    </motion.div>
                    <input
                      id="company-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-gray-900 placeholder-transparent outline-none"
                      autoComplete="off"
                      name="company-password"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                        />
                        Se procesează...
                      </>
                    ) : (
                      <>
                        {isLogin ? "Autentificare" : "Înregistrare firmă"}
                        <ArrowRight
                          size={20}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.button>

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      Ai uitat parola?
                    </button>
                  </div>
                )}
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">sau continuă cu</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-50"
              >
                <Image src="/pics/google.svg" alt="Google" width={24} height={24} />
                Google
              </motion.button>

              {/* === Status Message === */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 text-center text-sm text-gray-600">
                {isLogin ? "Nu ai cont?" : "Ai deja cont?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                  }}
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                >
                  {isLogin ? "Înregistrează-te" : "Autentifică-te"}
                </button>
              </div>

              {/* Customer auth link */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Ești client?{" "}
                <Link
                  href="/customer/auth"
                  className="font-medium text-emerald-600 hover:underline"
                >
                  Click aici
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
