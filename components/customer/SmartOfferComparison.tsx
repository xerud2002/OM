"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Check, X, Star, Award } from "lucide-react";

type Offer = {
  id: string;
  companyName: string;
  price: number;
  message?: string;
  proposedDate?: string;
  status?: string;
  createdAt?: any;
  // Services included
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
};

type SmartOfferComparisonProps = {
  offers: Offer[];
  onAccept: Function;
  onDecline: Function;
};

export default function SmartOfferComparison({
  offers,
  onAccept,
  onDecline,
}: SmartOfferComparisonProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  if (offers.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Nu există oferte de comparat.</p>
      </div>
    );
  }

  // Calculate statistics
  const prices = offers.map((o) => o.price).filter((p) => p > 0);
  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Determine best value (lowest price with most services)
  const bestValueId = offers.reduce((best, current) => {
    const bestServices = [
      best.serviceMoving,
      best.servicePacking,
      best.serviceDisassembly,
      best.serviceCleanout,
      best.serviceStorage,
    ].filter(Boolean).length;
    const currentServices = [
      current.serviceMoving,
      current.servicePacking,
      current.serviceDisassembly,
      current.serviceCleanout,
      current.serviceStorage,
    ].filter(Boolean).length;

    if (current.price < best.price && currentServices >= bestServices) {
      return current;
    }
    return best;
  }, offers[0])?.id;

  const toggleSelection = (id: string) => {
    setSelectedOffers((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  const displayOffers = selectedOffers.length > 0
    ? offers.filter((o) => selectedOffers.includes(o.id))
    : offers.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <TrendingDown size={20} />
            <span className="text-sm font-medium">Cel mai mic preț</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900">
            {new Intl.NumberFormat("ro-RO").format(minPrice)} lei
          </p>
        </div>

        <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-4">
          <div className="flex items-center gap-2 text-sky-700">
            <Star size={20} />
            <span className="text-sm font-medium">Preț mediu</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-sky-900">
            {new Intl.NumberFormat("ro-RO").format(Math.round(avgPrice))} lei
          </p>
        </div>

        <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-4">
          <div className="flex items-center gap-2 text-rose-700">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Cel mai mare preț</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-900">
            {new Intl.NumberFormat("ro-RO").format(maxPrice)} lei
          </p>
        </div>
      </div>

      {/* Offer Selection */}
      {offers.length > 3 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Selectează oferte pentru comparație (max 3):
          </p>
          <div className="flex flex-wrap gap-2">
            {offers.map((offer) => (
              <button
                key={offer.id}
                onClick={() => toggleSelection(offer.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  selectedOffers.includes(offer.id)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {offer.companyName} - {new Intl.NumberFormat("ro-RO").format(offer.price)} lei
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison */}
      <div className="overflow-x-auto">
        <div className="grid min-w-[768px] grid-cols-3 gap-4">
          {displayOffers.map((offer) => {
            const isBestValue = offer.id === bestValueId;
            const priceVsAvg = avgPrice > 0 ? ((offer.price - avgPrice) / avgPrice) * 100 : 0;

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-xl border-2 bg-white shadow-lg transition-all hover:shadow-xl ${
                  isBestValue ? "border-amber-400" : "border-gray-200"
                }`}
              >
                {/* Best Value Badge */}
                {isBestValue && (
                  <div className="absolute right-0 top-0 z-10">
                    <div className="flex items-center gap-1 rounded-bl-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      <Award size={14} />
                      Recomandat
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Company Name */}
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{offer.companyName}</h3>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-emerald-600">
                      {new Intl.NumberFormat("ro-RO").format(offer.price)}
                      <span className="text-lg font-normal text-gray-600"> lei</span>
                    </p>
                    {avgPrice > 0 && (
                      <p className={`mt-1 text-sm font-medium ${
                        priceVsAvg < 0 ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {priceVsAvg < 0 ? `${Math.abs(Math.round(priceVsAvg))}% sub medie` : `${Math.round(priceVsAvg)}% peste medie`}
                      </p>
                    )}
                  </div>

                  {/* Services */}
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Servicii incluse
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { key: "serviceMoving", label: "Transport" },
                        { key: "servicePacking", label: "Ambalare" },
                        { key: "serviceDisassembly", label: "Demontare" },
                        { key: "serviceCleanout", label: "Debarasare" },
                        { key: "serviceStorage", label: "Depozitare" },
                      ].map((service) => (
                        <div key={service.key} className="flex items-center gap-2">
                          {(offer as any)[service.key] ? (
                            <>
                              <Check size={16} className="text-emerald-600" />
                              <span className="text-sm text-gray-700">{service.label}</span>
                            </>
                          ) : (
                            <>
                              <X size={16} className="text-gray-300" />
                              <span className="text-sm text-gray-400">{service.label}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  {offer.message && (
                    <div className="mb-4 rounded-lg bg-gray-50 p-3">
                      <p className="mb-1 text-xs font-semibold text-gray-500">Mesaj:</p>
                      <p className="line-clamp-3 text-sm text-gray-700">{offer.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {offer.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAccept(offer.id)}
                        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Acceptă
                      </button>
                      <button
                        onClick={() => onDecline(offer.id)}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Refuză
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
