import { motion } from "framer-motion";
import {
  PaperAirplaneIcon as Send,
  FunnelIcon as Filter,
  MagnifyingGlassIcon as Search,
} from "@heroicons/react/24/outline";

interface OffersFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: "all" | "accepted" | "pending" | "rejected" | "declined";
  setStatusFilter: (value: "all" | "accepted" | "pending" | "rejected" | "declined") => void;
}

export default function OffersFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: OffersFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Send className="h-5 w-5 text-emerald-600" />
          Ofertele mele
        </h2>
      </div>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută după mesaj sau ID cerere..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <label htmlFor="status-filter" className="sr-only">
            Filtrare după status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "accepted" | "pending" | "rejected" | "declined"
              )
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          >
            <option value="all">Toate statusurile</option>
            <option value="pending">În așteptare</option>
            <option value="accepted">Acceptate</option>
            <option value="declined">Declinate</option>
            <option value="rejected">Respinse</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
