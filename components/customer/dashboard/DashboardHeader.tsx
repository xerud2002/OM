// components/customer/dashboard/DashboardHeader.tsx
// Dashboard hero section with stats

import { motion } from "framer-motion";
import { PlusSquare, List, Inbox, Archive as ArchiveIcon } from "lucide-react";

type Props = {
  displayName: string | null;
  activeRequestsCount: number;
  totalOffersCount: number;
  archivedCount: number;
  onNewRequest: () => void;
};

export default function DashboardHeader({
  displayName,
  activeRequestsCount,
  totalOffersCount,
  archivedCount,
  onNewRequest,
}: Props) {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 -left-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-20 -right-20 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-teal-400/10 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 pt-24 pb-8 sm:px-6 sm:pt-28 sm:pb-10 lg:pt-32 lg:pb-14">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Bună,{" "}
              <span className="bg-linear-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                {displayName || "Client"}
              </span>
              !
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-300">
              Gestionează cererile tale de mutare și ofertele primite
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onNewRequest}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-95 w-full md:w-auto"
          >
            <PlusSquare size={20} className="sm:w-[22px] sm:h-[22px] transition-transform group-hover:rotate-90" />
            Cerere nouă
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-400">Cereri active</p>
                <p className="mt-2 text-4xl font-bold text-white">{activeRequestsCount}</p>
                <p className="mt-1 text-xs text-slate-400">În așteptarea ofertelor</p>
              </div>
              <div className="rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-600/20 p-3 ring-1 ring-emerald-500/30">
                <List size={26} className="text-emerald-400" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-sky-400">Oferte primite</p>
                <p className="mt-2 text-4xl font-bold text-white">{totalOffersCount}</p>
                <p className="mt-1 text-xs text-slate-400">De la firme verificate</p>
              </div>
              <div className="rounded-xl bg-linear-to-br from-sky-500/20 to-sky-600/20 p-3 ring-1 ring-sky-500/30">
                <Inbox size={26} className="text-sky-400" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-28 w-28 rounded-full bg-sky-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-400">Arhivate</p>
                <p className="mt-2 text-4xl font-bold text-white">{archivedCount}</p>
                <p className="mt-1 text-xs text-slate-400">Cereri finalizate</p>
              </div>
              <div className="rounded-xl bg-linear-to-br from-amber-500/20 to-amber-600/20 p-3 ring-1 ring-amber-500/30">
                <ArchiveIcon size={26} className="text-amber-400" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-28 w-28 rounded-full bg-amber-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
