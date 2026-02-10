import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RequireRole from "@/components/auth/RequireRole";
import { useEffect, useState } from "react";
import { onAuthChange } from "@/utils/firebaseHelpers";
import {
  DocumentTextIcon,
  DocumentPlusIcon,
  Cog6ToothIcon,
  ClockIcon,
  ShieldCheckIcon,
  MapPinIcon,
  CubeIcon,
  CameraIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const HomeRequestForm = dynamic(
  () => import("@/components/home/HomeRequestForm"),
  {
    loading: () => (
      <div className="animate-pulse space-y-4 p-6">
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

const tips = [
  {
    icon: MapPinIcon,
    color: "text-emerald-500 bg-emerald-50",
    title: "Adrese exacte",
    desc: "Include strada, numărul, etajul și scara pentru estimări precise.",
  },
  {
    icon: CubeIcon,
    color: "text-blue-500 bg-blue-50",
    title: "Lista obiectelor",
    desc: "Menționează mobilierul mare, electrocasnicele și obiectele fragile.",
  },
  {
    icon: CameraIcon,
    color: "text-purple-500 bg-purple-50",
    title: "Adauga poze",
    desc: "Fotografiile ajută firmele să estimeze volumul mult mai precis.",
  },
  {
    icon: ClockIcon,
    color: "text-orange-500 bg-orange-50",
    title: "Data flexibilă?",
    desc: "Dacă ai flexibilitate, menționează. Poți primi prețuri mai bune.",
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
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Cerere{" "}
              <span className="gradient-emerald-r bg-clip-text text-transparent">
                Nouă
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Completează formularul pentru a primi oferte de la firme de mutări verificate.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-5">
            {/* Form card - main content */}
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* Card header */}
                <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-emerald">
                      <DocumentPlusIcon className="h-4.5 w-4.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Formular cerere</p>
                      <p className="text-xs text-gray-500">Câțiva pași rapizi, durează ~2 minute</p>
                    </div>
                  </div>
                </div>

                {/* Form body */}
                <div className="p-5">
                  <HomeRequestForm />
                </div>
              </div>
            </div>

            {/* Sidebar - tips & info */}
            <div className="space-y-4 lg:col-span-2">
              {/* Quick tips */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                    <LightBulbIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800">Sfaturi pentru preț mai bun</h3>
                </div>
                <div className="space-y-2.5">
                  {tips.map((tip) => (
                    <div key={tip.title} className="flex items-start gap-2.5 rounded-xl bg-white p-2.5 shadow-sm">
                      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tip.color.split(" ")[1]}`}>
                        <tip.icon className={`h-4 w-4 ${tip.color.split(" ")[0]}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{tip.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-gray-700">De ce să alegi ofertemutare.ro?</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: ShieldCheckIcon, label: "Firme verificate", desc: "Parteneri atent selectați și verificați" },
                    { icon: ClockIcon, label: "Oferte în max. 24h", desc: "Primești răspuns rapid de la firme" },
                    { icon: DocumentPlusIcon, label: "100% gratuit", desc: "Nu plătești nimic pentru a primi oferte" },
                  ].map((badge) => (
                    <div key={badge.label} className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        <badge.icon className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{badge.label}</p>
                        <p className="text-xs text-gray-500">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
