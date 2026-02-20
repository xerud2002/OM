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
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl gradient-emerald p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <SparklesIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Bine ai venit, {firstName}! 👋</h2>
              <p className="mt-1 text-sm sm:text-base text-emerald-100">
                Primește oferte personalizate de la firme verificate, gratuit și fără obligații.
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
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { step: 1, title: "Descrie mutarea", desc: "Completezi detaliile mutării, durează doar 2 minute." },
            { step: 2, title: "Primești oferte", desc: "Firmele verificate analizează cererea și trimit prețuri ferme." },
            { step: 3, title: "Alegi cea mai bună", desc: "Compari prețuri, recenzii și alegi firma potrivită." },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.step * 0.1 }}
              className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-sm font-bold">
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-0.5 text-sm text-emerald-100">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits + CTA inline */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { icon: ClockIcon, label: "Oferte în max. 24h" },
              { icon: ShieldCheckIcon, label: "Firme verificate" },
              { icon: CheckBadgeIcon, label: "Fără obligații" },
            ].map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs sm:text-sm backdrop-blur-sm">
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </span>
            ))}
          </div>
          <Link
            href="/customer/cerere-noua"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 hover:shadow-md active:scale-[0.98] shrink-0"
          >
            <DocumentPlusIcon className="h-5 w-5" />
            Creează cerere
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      {/* Tips for better pricing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
            <LightBulbIcon className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Cum obții cel mai bun preț?</h3>
            <p className="text-sm text-amber-700">Cu cât oferi mai multe detalii, cu atât prețul primit va fi mai aproape de cel real.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPinIcon, color: "text-emerald-500", title: "Localitate completă", desc: "Selectează județul și localitatea. Firmele estimează distanța și costul" },
            { icon: CubeIcon, color: "text-blue-500", title: "Detalii în notă", desc: "Scrie în câmpul 'Alte detalii' ce obiecte ai: canapea, frigider, obiecte fragile etc." },
            { icon: CameraIcon, color: "text-purple-500", title: "Adaugă poze", desc: "Fotografiile ajută firmele să estimeze volumul mult mai precis" },
            { icon: ClockIcon, color: "text-orange-500", title: "Data flexibilă?", desc: "Dacă ai flexibilitate, menționează. Poți primi prețuri mai bune" },
          ].map((tip) => (
            <div key={tip.title} className="flex items-start gap-2.5 rounded-xl bg-white p-3 shadow-sm">
              <tip.icon className={`mt-0.5 h-5 w-5 shrink-0 ${tip.color}`} />
              <div>
                <p className="text-sm font-semibold text-gray-800">{tip.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        <h4 className="text-sm font-bold text-gray-700 mb-3">Întrebări frecvente</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { q: "Cât costă serviciul?", a: "Este complet gratuit pentru clienți. Nu plătești nimic pentru a primi oferte." },
            { q: "Cât de repede primesc oferte?", a: "De obicei în primele ore, maxim 24h de la trimiterea cererii." },
            { q: "Sunt obligat să accept o ofertă?", a: "Nu, nu ai nicio obligație. Poți refuza toate ofertele fără cost." },
            { q: "Cum obțin prețuri mai exacte?", a: "Completează cât mai multe detalii și adaugă fotografii ale obiectelor." },
          ].map((faq) => (
            <div key={faq.q}>
              <p className="text-sm font-medium text-gray-800">{faq.q}</p>
              <p className="mt-0.5 text-xs text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
