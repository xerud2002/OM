"use client";
import { useEffect, useState } from "react";
import { loginWithGoogle, onAuthChange } from "@/services/firebase";
import { User } from "firebase/auth";
import Link from "next/link";

export default function CompanyAuthPage() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => onAuthChange(setUser), []);

  return (
    <main className="max-w-xl mx-auto p-6 card mt-10">
      <h1 className="text-2xl font-bold text-emerald-700 mb-4">
        Autentificare Companie
      </h1>
      {!user ? (
        <>
          <button onClick={loginWithGoogle} className="btn-primary w-full">
            Continuă cu Google (cont firmă)
          </button>
          <p className="text-sm text-gray-500 mt-3">
            După autentificare vei putea accesa panoul companiilor și cumpăra lead-uri.
          </p>
        </>
      ) : (
        <>
          <p className="mb-4">Ești autentificat ca <b>{user.displayName || user.email}</b>.</p>
          <Link className="btn-primary" href="/company/dashboard">
            Mergi la Panou Companie
          </Link>
        </>
      )}
    </main>
  );
}
