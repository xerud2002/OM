import React, { useMemo, useState } from "react";
import { Check, X, ArrowUpDown, Star } from "lucide-react";

export type ComparableOffer = {
  id: string;
  requestId: string;
  companyName?: string;
  price?: number;
  message?: string;
  status?: "pending" | "accepted" | "declined";
  favorite?: boolean;
  createdAt?: any;
};

interface OfferComparisonProps {
  offers: ComparableOffer[];
  onAccept: any;
  onDecline: any;
}

export default function OfferComparison({ offers, onAccept, onDecline }: OfferComparisonProps) {
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "date-desc" | "date-asc">(
    "price-asc"
  );
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(true);

  const sorted = useMemo(() => {
    const list = offers.filter((o) => (onlyFavorites ? o.favorite : true));
    const by = (o: ComparableOffer) => ({
      price: typeof o.price === "number" ? o.price : Number.POSITIVE_INFINITY,
      date: o.createdAt?.toMillis ? o.createdAt.toMillis() : o.createdAt || 0,
    });
    switch (sort) {
      case "price-desc":
        return [...list].sort((a, b) => by(b).price - by(a).price);
      case "date-asc":
        return [...list].sort((a, b) => by(a).date - by(b).date);
      case "date-desc":
        return [...list].sort((a, b) => by(b).date - by(a).date);
      case "price-asc":
      default:
        return [...list].sort((a, b) => by(a).price - by(b).price);
    }
  }, [offers, sort, onlyFavorites]);

  if (!offers.length) {
    return <p className="text-sm italic text-gray-500">Nu există oferte pentru comparare.</p>;
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => setOnlyFavorites(e.target.checked)}
            />
            <span className="flex items-center gap-1">
              <Star size={14} className={onlyFavorites ? "text-amber-500" : "text-gray-400"} />
              Doar favorite
            </span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSort(sort === "price-asc" ? "price-desc" : "price-asc")}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
            title="Sortează după preț"
          >
            <ArrowUpDown size={14} /> Preț
          </button>
          <button
            onClick={() => setSort(sort === "date-asc" ? "date-desc" : "date-asc")}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
            title="Sortează după dată"
          >
            <ArrowUpDown size={14} /> Dată
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {sorted.map((o) => (
          <div key={o.id} className="flex flex-col gap-3 rounded-md border bg-gray-50 p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">{o.companyName || "Companie"}</p>
                {o.message && <p className="text-xs text-gray-500">{o.message}</p>}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-700">{o.price ?? "-"} lei</p>
                {o.status && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                      o.status === "accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : o.status === "declined"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {o.status}
                  </span>
                )}
              </div>
            </div>

            {(!o.status || o.status === "pending") && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAccept(o.requestId, o.id)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  <Check size={14} /> Acceptă
                </button>
                <button
                  onClick={() => onDecline(o.requestId, o.id)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <X size={14} /> Refuză
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
