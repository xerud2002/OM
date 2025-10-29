"use client";
import { useState, useEffect } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import {
  loginWithGoogle,
  registerWithEmail,
  loginWithEmail,
  resetPassword,
} from "@/utils/firebaseHelpers";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function CustomerAuthPage() {
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
      await loginWithGoogle("company");
      router.push("/company/dashboard");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail({ email, password });
        router.push("/company/dashboard");
      } else {
        await registerWithEmail("company", { email, password });
        router.push("/company/dashboard");
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return setMessage("Introdu adresa de email pentru resetare.");
    try {
      await resetPassword(email);
      setMessage("Email de resetare trimis ✉️");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <LayoutWrapper>
      <section className="mx-auto mt-10 max-w-md rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center shadow-lg backdrop-blur-md">
        <h1 className="mb-2 text-3xl font-bold text-emerald-700">
          {isLogin ? "Autentificare Firmă" : "Creare Cont Client"}
        </h1>
        <p className="mb-6 text-gray-600">
          {isLogin
            ? "Intră în contul tău pentru a gestiona cererile de mutare."
            : "Creează un cont nou pentru a primi oferte personalizate."}
        </p>

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

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 transition hover:bg-gray-50"
        >
          <Image src="/pics/google.svg" alt="Google" width={20} height={20} />
          Continuă cu Google
        </motion.button>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}

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
