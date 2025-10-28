import { useEffect, useState } from "react";
import { onAuthChange, logout } from "@/utils/firebaseHelpers";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (!u) router.push("/customer/auth");
      setUser(u);
    });
    return () => unsub();
  }, [router]);

  if (!user) return null;

  return (
    <main className="pt-[100px] max-w-4xl mx-auto px-6 text-center">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Bine ai venit, {user.displayName || user.email}
      </h1>
      <p className="text-gray-600 mb-6">
        Aici poți vedea cererile tale, ofertele primite și istoricul mutărilor.
      </p>
      <button
        onClick={logout}
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition-all"
      >
        Logout
      </button>
    </main>
  );
}
