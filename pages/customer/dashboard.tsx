import { useEffect, useState } from "react";
import { onAuthChange, logout } from "@/services/firebase";
import { User } from "firebase/auth";
import LayoutWrapper from "@/components/layout/Layout";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange((u: User | null) => {
      if (!u) router.push("/customer/auth");
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  if (!user) return null;

  return (
    <LayoutWrapper>
      <section className="max-w-4xl mx-auto text-center py-10">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4">
          Bine ai venit, {user.displayName || user.email}
        </h1>
        <p className="text-gray-600 mb-6">
          Aici poți urmări cererile tale de mutare și ofertele primite.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition-all"
        >
          Logout
        </button>
      </section>
    </LayoutWrapper>
  );
}
