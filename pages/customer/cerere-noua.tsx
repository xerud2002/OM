import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RequireRole from "@/components/auth/RequireRole";
import { useEffect, useState } from "react";
import { onAuthChange } from "@/utils/firebaseHelpers";
import {
  DocumentTextIcon,
  DocumentPlusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const HomeRequestForm = dynamic(
  () => import("@/components/home/HomeRequestForm"),
  {
    loading: () => (
      <div className="mx-auto max-w-3xl animate-pulse space-y-4 rounded-2xl bg-white p-8">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
        <div className="mt-6 space-y-3">
          <div className="h-12 rounded-xl bg-gray-100" />
          <div className="h-12 rounded-xl bg-gray-100" />
          <div className="h-12 rounded-xl bg-gray-100" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

const navigation = [
  {
    name: "Cererile Mele",
    href: "/customer/dashboard",
    icon: DocumentTextIcon,
  },
  {
    name: "Cerere Nouă",
    href: "/customer/cerere-noua",
    icon: DocumentPlusIcon,
  },
  {
    name: "Setări",
    href: "/customer/settings",
    icon: Cog6ToothIcon,
  },
];

export default function CerereNoua() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthChange((u: any) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <RequireRole allowedRole="customer">
      <DashboardLayout role="customer" user={user} navigation={navigation}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Cerere{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Nouă
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Completează formularul pentru a primi oferte de la firme de mutări verificate.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <HomeRequestForm />
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
