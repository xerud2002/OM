"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  SparklesIcon,
  DocumentPlusIcon,
  ClockIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  GiftIcon,
  LightBulbIcon,
  CameraIcon,
  MapPinIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

type CustomerWelcomeProps = {
  userName?: string | null;
  onDismiss?: () => void;
};

export default function CustomerWelcome({ userName, onDismiss }: CustomerWelcomeProps) {
  const firstName = userName?.split(" ")[0] || "acolo";

  return (
    <div className="space-y-5">
      {/* Main welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg"
        style={{ backgroundImage: "linear-gradient(135deg, #059669, #10b981, #0d9488)" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <SparklesIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Bine ai venit, {firstName}! 👋</h2>
              <p className="mt-1 text-emerald-100 text-sm sm:text-base">
                Primește oferte personalizate de la firme de mutări verificate — gratuit și fără obligații.
              </p>
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* How it works - steps */}
        <div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold">Descrie mutarea</h3>
              <p className="mt-0.5 text-sm text-emerald-100">
                Completezi detaliile mutării tale — durează doar 2 minute.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold">Primești oferte</h3>
              <p className="mt-0.5 text-sm text-emerald-100">
                Firmele verificate analizează cererea și îți trimit prețuri ferme.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold">Alegi cea mai bună</h3>
              <p className="mt-0.5 text-sm text-emerald-100">
                Compari prețuri, recenzii și alegi firma care ți se potrivește.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Benefits pills */}
        <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm">
            <GiftIcon className="h-4 w-4" />
            100% Gratuit
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm">
            <ClockIcon className="h-4 w-4" />
            Oferte în max. 24h
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm">
            <ShieldCheckIcon className="h-4 w-4" />
            Firme verificate
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm">
            <CheckBadgeIcon className="h-4 w-4" />
            Fără obligații
          </span>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]"
          >
            <DocumentPlusIcon className="h-5 w-5" />
            Trimite prima cerere
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* Tips card - advising accurate info for better pricing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
            <LightBulbIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Sfat: Detaliile contează!</h3>
            <p className="text-sm text-amber-700">Cu cât oferi mai multe informații, cu atât prețul va fi mai aproape de realitate.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2.5 rounded-xl bg-white p-3 shadow-sm">
            <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Adrese exacte</p>
              <p className="mt-0.5 text-xs text-gray-500">Strada, număr, etaj, scara — firmele calculează distanța și efortul</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white p-3 shadow-sm">
            <CubeIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Lista obiectelor</p>
              <p className="mt-0.5 text-xs text-gray-500">Menționează mobilierul mare, electrocasnicele și obiectele fragile</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white p-3 shadow-sm">
            <CameraIcon className="mt-0.5 h-5 w-5 shrink-0 text-purple-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Adaugă poze</p>
              <p className="mt-0.5 text-xs text-gray-500">Fotografiile ajută firmele să estimeze volumul mult mai precis</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white p-3 shadow-sm">
            <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Data flexibilă?</p>
              <p className="mt-0.5 text-xs text-gray-500">Dacă ai flexibilitate, menționează — poți primi prețuri mai bune</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
