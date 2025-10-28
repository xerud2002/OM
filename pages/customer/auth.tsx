"use client";
import { useEffect, useState } from "react";
import { loginWithGoogle, onAuthChange, logout } from "@/services/firebase";
import { User } from "firebase/auth";
import Link from "next/link";

export default function CustomerAuthPage() {
  const [user, setUser] = useState<User | null>(null);

  // Ascultă modificările stării de autentificare
  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-sky-50 px-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-emerald-100 w-full max-w-md text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-6">
          Autentificare Client
        </h1>

        {!user ? (
          <>
            <button
              onClick={loginWithGoogle}
              className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Continuă cu Google
            </button>
            <p className="text-gray-500 text-sm mt-4">
              Autentifică-te pentru a trimite cereri și a primi oferte de la firme verificate.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">
              Salut,{" "}
              <span className="font-semibold text-emerald-600">
                {user.displayName || user.email}
              </span>
              !
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/form"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition-all hover:scale-105"
              >
                Completează cererea
              </Link>
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-all hover:scale-105"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
