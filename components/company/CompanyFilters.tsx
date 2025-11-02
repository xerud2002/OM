"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, MapPin, Calendar, DollarSign, Home, Hash, CheckCircle } from "lucide-react";
import counties from "@/counties";

type FilterState = {
  location?: string;
  dateRange?: "next7" | "next30" | "custom";
  budget?: { min: number; max: number };
  propertyType?: "house" | "flat" | "any";
  rooms?: { min: number; max: number };
  status?: "unlocked" | "offered" | "won" | "any";
};

type CompanyFiltersProps = {
  onFiltersChange: (filters: FilterState) => void;
  activeFiltersCount?: number;
};

export default function CompanyFilters({
  onFiltersChange,
  activeFiltersCount = 0,
}: CompanyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "any",
    status: "any",
  });

  const applyFilters = () => {
    onFiltersChange(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const resetFilters = {
      propertyType: "any" as const,
      status: "any" as const,
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
      >
        <Filter size={16} />
        Filtrare avansată
        {activeFiltersCount > 0 && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-4 py-3">
                <h3 className="text-lg font-bold text-gray-900">Filtrare avansată</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-lg p-1 transition-colors hover:bg-white/60"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Filters */}
              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
                {/* Location */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin size={16} className="text-emerald-600" />
                    Locație
                  </label>
                  <select
                    value={filters.location || ""}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, location: e.target.value || undefined }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Toate locațiile</option>
                    {counties.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Calendar size={16} className="text-sky-600" />
                    Data mutării
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={!filters.dateRange}
                        onChange={() => setFilters((f) => ({ ...f, dateRange: undefined }))}
                        className="h-4 w-4 text-emerald-600"
                      />
                      <span className="text-sm text-gray-700">Orice dată</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={filters.dateRange === "next7"}
                        onChange={() => setFilters((f) => ({ ...f, dateRange: "next7" }))}
                        className="h-4 w-4 text-emerald-600"
                      />
                      <span className="text-sm text-gray-700">Următoarele 7 zile</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={filters.dateRange === "next30"}
                        onChange={() => setFilters((f) => ({ ...f, dateRange: "next30" }))}
                        className="h-4 w-4 text-emerald-600"
                      />
                      <span className="text-sm text-gray-700">Următoarele 30 zile</span>
                    </label>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <DollarSign size={16} className="text-amber-600" />
                    Buget estimat (lei)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.budget?.min || ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          budget: { ...f.budget, min: Number(e.target.value) || 0, max: f.budget?.max || 999999 },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.budget?.max || ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          budget: { min: f.budget?.min || 0, max: Number(e.target.value) || 999999 },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Home size={16} className="text-purple-600" />
                    Tip locuință
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "any", label: "Orice tip" },
                      { value: "house", label: "Casă" },
                      { value: "flat", label: "Apartament" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filters.propertyType === option.value}
                          onChange={() =>
                            setFilters((f) => ({ ...f, propertyType: option.value as any }))
                          }
                          className="h-4 w-4 text-emerald-600"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Hash size={16} className="text-indigo-600" />
                    Număr camere
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      min="1"
                      value={filters.rooms?.min || ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          rooms: { ...f.rooms, min: Number(e.target.value) || 1, max: f.rooms?.max || 20 },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min="1"
                      value={filters.rooms?.max || ""}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          rooms: { min: f.rooms?.min || 1, max: Number(e.target.value) || 20 },
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <CheckCircle size={16} className="text-emerald-600" />
                    Status
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "any", label: "Orice status" },
                      { value: "unlocked", label: "Deblocat (contact vizibil)" },
                      { value: "offered", label: "Ofertă trimisă" },
                      { value: "won", label: "Ofertă acceptată" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={filters.status === option.value}
                          onChange={() => setFilters((f) => ({ ...f, status: option.value as any }))}
                          className="h-4 w-4 text-emerald-600"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Resetează
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
                >
                  Aplică filtre
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
