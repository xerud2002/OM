import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { TicketIcon, PhoneIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function BuyCredits() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <RequireRole allowedRole="company">
      <DashboardLayout role="company" user={user}>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-4 shadow-lg shadow-emerald-500/30">
                <TicketIcon className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Cumpără Credite</h1>
            <p className="mt-2 text-gray-500">
              Reîncarcă-ți contul pentru a putea trimite mai multe oferte clienților.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic Pack */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">Pachet Start</h3>
              <p className="mt-2 text-sm text-gray-500">Pentru început de drum</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">250</span>
                <span className="ml-2 text-base font-medium text-gray-500">RON</span>
              </div>
              <ul className="mb-8 space-y-4 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>500 Credite</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>~10 Oferte</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Achizitie Pachet Start 250 RON", "_blank")}
                className="mt-auto block w-full rounded-xl border border-gray-200 bg-white py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Contactează-ne
              </button>
            </div>

            {/* Pro Pack - Popular */}
            <div className="relative flex flex-col rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1 text-sm font-bold text-white shadow-lg">
                Cel mai popular
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pachet Pro</h3>
              <p className="mt-2 text-sm text-gray-500">Pentru activitate constantă</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">500</span>
                <span className="ml-2 text-base font-medium text-gray-500">RON</span>
              </div>
              <ul className="mb-8 space-y-4 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>1200 Credite <span className="text-emerald-600 font-bold">(+20%)</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>~24 Oferte</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>Suport Prioritar</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Achizitie Pachet Pro 500 RON", "_blank")}
                className="mt-auto block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-center font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40"
              >
                Comandă Acum
              </button>
            </div>

            {/* Business Pack */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">Business</h3>
              <p className="mt-2 text-sm text-gray-500">Pentru volum mare</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold text-gray-900">1000</span>
                <span className="ml-2 text-base font-medium text-gray-500">RON</span>
              </div>
              <ul className="mb-8 space-y-4 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>2500 Credite <span className="text-emerald-600 font-bold">(+25%)</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>~50 Oferte</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                  <span>Manager dedicat</span>
                </li>
              </ul>
              <button 
                onClick={() => window.open("mailto:contact@ofertemutare.ro?subject=Achizitie Pachet Business 1000 RON", "_blank")}
                className="mt-auto block w-full rounded-xl border border-gray-200 bg-white py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50"
              >
                Contactează-ne
              </button>
            </div>
          </div>

          {/* Custom CTA */}
          <div className="rounded-2xl bg-gray-900 p-8 text-center text-white">
            <h2 className="text-xl font-bold">Ai nevoie de o ofertă personalizată?</h2>
            <p className="mt-2 text-gray-300">
              Pentru flote mari sau parteneriate strategice, putem crea un pachet adaptat nevoilor tale.
            </p>
            <div className="mt-6 flex justify-center">
              <a 
                href="tel:0700000000" 
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-gray-900 transition hover:bg-gray-100"
              >
                <PhoneIcon className="h-5 w-5" />
                0700 000 000
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}


