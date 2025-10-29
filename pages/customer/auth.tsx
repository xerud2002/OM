"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

export default function CustomerAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/customer/dashboard");
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Google sign-in
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const mod = await import("@/utils/firebaseHelpers");
      const user = await mod.loginWithGoogle("customer");
      // Ensure role is correct (defensive; loginWithGoogle should create customer profile)
      const role = await mod.getUserRole(user);
      if (role !== "customer") {
        setMessage("Contul tău este înregistrat ca firmă — folosește pagina de autentificare pentru firme.");
        router.push("/company/auth");
        return;
      }
      router.push("/customer/dashboard");
    } catch (err: any) {
      setMessage(err.message || "Eroare la autentificare cu Google.");
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
      if (isLogin) {
        const user = await mod.loginWithEmail({ email, password });
        const role = await mod.getUserRole(user);
        if (role !== "customer") {
          setMessage("Acest cont este înregistrat ca firmă. Folosește pagina de autentificare pentru firme.");
          router.push("/company/auth");
          return;
        }
      } else {
        await mod.registerWithEmail("customer", { email, password });
        // registration sets role via ensureUserProfile; proceed to dashboard
      }
      router.push("/customer/dashboard");
    } catch (err: any) {
      setMessage(err.message || "A apărut o eroare neașteptată.");
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
      setMessage(err.message);
    }
  };

  return (
    <LayoutWrapper>
      <section className="mx-auto mt-10 max-w-md rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center shadow-lg backdrop-blur-md">
        <h1 className="mb-2 bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-3xl font-extrabold text-transparent">
          Autentificare Client
        </h1>

        <p className="mb-6 text-gray-600">
          {isLogin
            ? "Intră în contul tău pentru a gestiona cererile de mutare."
            : "Creează un cont nou pentru a primi oferte personalizate."}
        </p>

        {/* === Email Form === */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="flex items-center rounded-lg border px-3 py-2">
            <Mail size={18} className="mr-2 text-emerald-600" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center rounded-lg border px-3 py-2">
            <Lock size={18} className="mr-2 text-emerald-600" />
            <input
              type="password"
              placeholder="Parolă"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 py-2 font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {loading ? "Se procesează..." : isLogin ? "Autentificare" : "Înregistrare"}
          </motion.button>

          {isLogin && (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm text-sky-600 hover:underline"
            >
              Ai uitat parola?
            </button>
          )}
        </form>

        <div className="my-4 text-gray-400">sau</div>

        {/* === Google Login === */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 transition hover:bg-gray-50"
        >
          <Image src="/pics/google.svg" alt="Google" width={20} height={20} />
          Continuă cu Google
        </motion.button>

        {/* === Status Message === */}
        {message && (
          <p className="mt-4 rounded-lg bg-gray-50 py-2 text-sm text-gray-600">{message}</p>
        )}

        {/* === Toggle login/register === */}
        <div className="mt-6 text-sm">
          {isLogin ? "Nu ai cont?" : "Ai deja cont?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 hover:underline">
            {isLogin ? "Creează unul" : "Autentifică-te"}
          </button>
        </div>
      </section>
    </LayoutWrapper>
  );
}
