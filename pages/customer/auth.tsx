"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Mail, Lock, User, ArrowRight, Sparkles, Shield, CheckCircle } from "lucide-react";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { translateFirebaseError } from "@/utils/authErrors";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

export default function CustomerAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Link any guest requests to this account
  const linkGuestRequests = async (user: any) => {
    try {
      const token = await user.getIdToken();
      await fetch("/api/requests/linkToAccount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      logger.warn("Failed to link guest requests:", err);
      // Non-critical, don't show error to user
    }
  };

  // Handle post-auth redirect and form submission
  const handlePostAuthRedirect = async (user?: any) => {
    // Link any guest requests first
    if (user) {
      await linkGuestRequests(user);
    }

    const pendingSubmission = localStorage.getItem("pendingRequestSubmission");

    if (pendingSubmission === "true") {
      // Clear the flag
      localStorage.removeItem("pendingRequestSubmission");
      // Redirect to dashboard where form will auto-submit
      router.push("/customer/dashboard?autoSubmit=true");
    } else {
      router.push("/customer/dashboard");
    }
  };

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        handlePostAuthRedirect(user);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ✅ Google sign-in
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const mod = await import("@/utils/firebaseHelpers");
      const user = await mod.loginWithGoogle("customer");

      // Handle popup blocked/cancelled case
      if (!user) {
        setLoading(false);
        return; // User cancelled or popup was blocked - no error message needed
      }

      // Ensure role is correct (defensive; loginWithGoogle should create customer profile)
      const role = await mod.getUserRole(user);
      if (role !== "customer") {
        setMessage(
          "Contul tău este înregistrat ca firmă – folosește pagina de autentificare pentru firme."
        );
        router.push("/company/auth");
        return;
      }
      toast.success(`Bine ai revenit, ${user.displayName || "utilizator"}! 👋`);
      await handlePostAuthRedirect(user);
    } catch (err: any) {
      // If role conflict occurred, attempt to detect existing role and redirect
      if (err?.code === "ROLE_CONFLICT" || (err?.message || "").includes("registered as")) {
        try {
          const mod = await import("@/utils/firebaseHelpers");
          const current = auth.currentUser;
          const role = current ? await mod.getUserRole(current) : null;
          if (role === "company") {
            setMessage("Contul tău este înregistrat ca firmă. Redirecționare...");
            router.push("/company/auth");
            return;
          }
        } catch {
          // fall back to generic message
        }
      }
      setMessage(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Email/password login or register
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const mod = await import("@/utils/firebaseHelpers");
      let user;
      if (isLogin) {
        user = await mod.loginWithEmail({ email, password });
        const role = await mod.getUserRole(user);
        if (role !== "customer") {
          setMessage(
            "Acest cont este înregistrat ca firmă. Folosește pagina de autentificare pentru firme."
          );
          router.push("/company/auth");
          return;
        }
        toast.success(
          `Bine ai revenit, ${user.displayName || user.email?.split("@")[0] || "utilizator"}! 👋`
        );
      } else {
        user = await mod.registerWithEmail("customer", { email, password });
        toast.success("Cont creat cu succes! Bine ai venit! 🎉");
      }
      await handlePostAuthRedirect(user);
    } catch (err: any) {
      if (err?.code === "ROLE_CONFLICT" || (err?.message || "").includes("registered as")) {
        try {
          const mod = await import("@/utils/firebaseHelpers");
          const current = auth.currentUser;
          const role = current ? await mod.getUserRole(current) : null;
          if (role === "company") {
            setMessage("Acest cont este înregistrat ca firmă. Redirecționare...");
            router.push("/company/auth");
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

  // ✅ Password reset
  const handlePasswordReset = async () => {
    if (!email) return setMessage("Introdu adresa de email pentru resetare.");
    try {
      const mod = await import("@/utils/firebaseHelpers");
      await mod.resetPassword(email);
      setMessage("✉️ Email de resetare trimis cu succes!");
    } catch (err: any) {
      setMessage(translateFirebaseError(err));
    }
  };

  return (
    <>
      <Head>
        <title>Autentificare Client | OferteMutare.ro</title>
        <meta
          name="description"
          content="Autentifică-te sau creează cont de client pe OferteMutare.ro. Primești oferte gratuite de la firme de mutări verificate."
        />
        <link rel="canonical" href="https://ofertemutare.ro/customer/auth" />
      </Head>

      <LayoutWrapper>
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
            {/* Left Side - Illustration & Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative hidden bg-emerald-50 p-12 lg:flex lg:flex-col lg:justify-between"
            >
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm"
                >
                  <Sparkles size={16} className="text-emerald-600" />
                  Pentru Clienți
                </motion.div>

                <h2 className="mb-4 text-4xl font-bold text-emerald-950">
                  Mutări simple,
                  <br />
                  <span className="text-emerald-600">prețuri corecte.</span>
                </h2>
                <p className="text-lg text-emerald-700">
                  Primești până la 5 oferte de la firme verificate și alegi cea mai bună pentru
                  tine.
                </p>
              </div>

              {/* Benefits list */}
              <div className="relative z-10 space-y-4">
                {[
                  { icon: CheckCircle, text: "Oferte gratuite în 24h" },
                  { icon: Shield, text: "Firme verificate" },
                  { icon: Sparkles, text: "Economisești până la 40%" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 text-emerald-800"
                  >
                    <div className="rounded-full bg-white p-2 shadow-sm">
                      <item.icon size={20} className="text-emerald-600" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Decorative illustration */}
              <div className="absolute right-8 bottom-8 opacity-5">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-emerald-900"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-emerald-900"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-emerald-900"
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
                  className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                >
                  <User size={16} />
                  Cont Client
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
                      {isLogin ? "Bine ai revenit!" : "Creează cont"}
                    </motion.span>
                  </AnimatePresence>
                </h1>
                <p className="text-gray-600">
                  {isLogin
                    ? "Intră în cont pentru a gestiona cererile tale."
                    : "Înregistrează-te gratuit și primește oferte instant."}
                </p>
              </div>

              {/* === Email Form === */}
              <form onSubmit={handleEmailAuth} className="space-y-6">
                {/* Email Input with Floating Label */}
                <div className="group relative">
                  <label
                    htmlFor="email"
                    className={`pointer-events-none absolute left-12 transition-all duration-200 ${
                      email
                        ? "-top-2.5 left-3 bg-white px-2 text-xs font-medium text-emerald-600"
                        : "top-3.5 text-gray-400 group-focus-within:-top-2.5 group-focus-within:left-3 group-focus-within:bg-white group-focus-within:px-2 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-emerald-600"
                    }`}
                  >
                    Adresa ta de email
                  </label>
                  <div className="relative flex items-center rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3.5 transition-all duration-300 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:ring-4 focus-within:shadow-emerald-100 focus-within:ring-emerald-50 hover:border-gray-300 hover:shadow-sm">
                    <motion.div
                      animate={{
                        scale: email ? 1.1 : 1,
                        rotate: email ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Mail
                        size={20}
                        className="mr-3 text-gray-400 transition-all duration-300 group-focus-within:text-emerald-600 group-hover:text-gray-500"
                      />
                    </motion.div>
                    <input
                      id="email"
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
                    htmlFor="password"
                    className={`pointer-events-none absolute left-12 transition-all duration-200 ${
                      password
                        ? "-top-2.5 left-3 bg-white px-2 text-xs font-medium text-emerald-600"
                        : "top-3.5 text-gray-400 group-focus-within:-top-2.5 group-focus-within:left-3 group-focus-within:bg-white group-focus-within:px-2 group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-emerald-600"
                    }`}
                  >
                    Parola ta
                  </label>
                  <div className="relative flex items-center rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3.5 transition-all duration-300 focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-lg focus-within:ring-4 focus-within:shadow-emerald-100 focus-within:ring-emerald-50 hover:border-gray-300 hover:shadow-sm">
                    <motion.div
                      animate={{
                        scale: password ? 1.1 : 1,
                        rotate: password ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lock
                        size={20}
                        className="mr-3 text-gray-400 transition-all duration-300 group-focus-within:text-emerald-600 group-hover:text-gray-500"
                      />
                    </motion.div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-gray-900 placeholder-transparent outline-none"
                      autoComplete="off"
                      name="password"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
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
                        {isLogin ? "Autentificare" : "Creează cont gratuit"}
                        <ArrowRight
                          size={20}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.button>

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
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

              {/* === Social Login Buttons === */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="group flex flex-1 items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-4 font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-50"
                >
                  <Image src="/pics/google.svg" alt="Google" width={24} height={24} />
                  Google
                </motion.button>
              </div>

              {/* === Status Message === */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === Toggle login/register === */}
              <div className="mt-8 text-center text-sm text-gray-600">
                {isLogin ? "Nu ai cont?" : "Ai deja cont?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                  }}
                  className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
                >
                  {isLogin ? "Creează unul acum" : "Autentifică-te"}
                </button>
              </div>

              {/* Company auth link */}
              <div className="mt-4 text-center text-sm text-gray-500">
                Ești o firmă de mutări?{" "}
                <Link href="/company/auth" className="font-medium text-blue-600 hover:underline">
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
