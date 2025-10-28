import { useEffect, useState } from "react";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";
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
      <section className="mx-auto max-w-4xl py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-emerald-700">
          Bine ai venit, {user.displayName || user.email}
        </h1>
        <p className="mb-6 text-gray-600">
          Aici poți urmări cererile tale de mutare și ofertele primite.
        </p>
        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-6 py-2 text-white shadow-md transition-all hover:bg-red-600"
        >
          Logout
        </button>
      </section>
    </LayoutWrapper>
  );
}
