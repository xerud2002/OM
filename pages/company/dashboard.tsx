"use client";
import { useEffect, useState } from "react";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import LayoutWrapper from "@/components/layout/Layout";

export default function CompanyDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // 🔹 Redirect if not authenticated
  useEffect(() => {
    const unsub = onAuthChange((u: User | null) => {
      if (!u) router.push("/company/auth");
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  if (!user) return null;

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-emerald-700">
          Bun venit, {user.displayName || user.email}
        </h1>
        <p className="mb-6 text-gray-600">
          Aici poți vedea cererile de mutare disponibile și lead-urile cumpărate.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-emerald-700">Cereri noi</h2>
            <p className="text-sm text-gray-600">Vezi cererile recente de mutare din zona ta.</p>
            <button
              onClick={() => router.push("/company/requests")}
              className="mt-4 rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2 font-medium text-white shadow transition-all hover:shadow-lg"
            >
              Vezi cererile
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-emerald-700">Lead-uri achiziționate</h2>
            <p className="text-sm text-gray-600">
              Urmărește istoricul lead-urilor cumpărate și statusul fiecăruia.
            </p>
            <button
              onClick={() => router.push("/company/leads")}
              className="mt-4 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2 font-medium text-white shadow transition-all hover:shadow-lg"
            >
              Vezi lead-urile
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-10 rounded-lg bg-red-500 px-6 py-2 text-white shadow-md transition-all hover:bg-red-600"
        >
          Logout
        </button>
      </section>
    </LayoutWrapper>
  );
}
