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
} from "@heroicons/react/24/outline";

type CustomerWelcomeProps = {
  userName?: string | null;
  onDismiss?: () => void;
};

export default function CustomerWelcome({ userName, onDismiss }: CustomerWelcomeProps) {
  const firstName = userName?.split(" ")[0] || "acolo";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bine ai venit, {firstName}! 👋</h2>
            <p className="text-emerald-100">
              Ești gata să primești oferte de mutări de la firme verificate.
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

      {/* How it works */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            1
          </div>
          <div>
            <h3 className="font-semibold">Trimite cererea</h3>
            <p className="mt-0.5 text-sm text-emerald-100">
              Completezi detaliile mutării tale în 2 minute.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            2
          </div>
          <div>
            <h3 className="font-semibold">Primești oferte</h3>
            <p className="mt-0.5 text-sm text-emerald-100">
              Firme verificate îți trimit oferte cu preț fix.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            3
          </div>
          <div>
            <h3 className="font-semibold">Alegi ce-ți place</h3>
            <p className="mt-0.5 text-sm text-emerald-100">
              Compari prețuri, recenzii și alegi firma potrivită.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm">
          <GiftIcon className="h-4 w-4" />
          100% Gratuit
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm">
          <ClockIcon className="h-4 w-4" />
          Oferte în 24h
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm">
          <ShieldCheckIcon className="h-4 w-4" />
          Firme verificate
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur-sm">
          <CheckBadgeIcon className="h-4 w-4" />
          Fără obligații
        </span>
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md"
        >
          <DocumentPlusIcon className="h-5 w-5" />
          Trimite prima cerere
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
