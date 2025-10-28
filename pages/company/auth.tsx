"use client";
import { useState, useEffect } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

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
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("company/dashboard");
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
        await signInWithEmailAndPassword(auth, email, password);
        router.push("company/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("company/dashboard");
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
      await sendPasswordResetEmail(auth, email);
      setMessage("Email de resetare trimis ✉️");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <LayoutWrapper>
      <section className="max-w-md mx-auto mt-10 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-emerald-100 text-center">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">
          {isLogin ? "Autentificare Firmă" : "Creare Cont Client"}
        </h1>
        <p className="text-gray-600 mb-6">
          {isLogin
            ? "Intră în contul tău pentru a gestiona cererile de mutare."
            : "Creează un cont nou pentru a primi oferte personalizate."}
        </p>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail size={18} className="text-emerald-600 mr-2" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={18} className="text-emerald-600 mr-2" />
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
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition"
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
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
        >
          <img src="/google.svg" alt="Google" width={20} height={20} /> Continuă cu Google
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
