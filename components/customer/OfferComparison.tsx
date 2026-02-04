import React, { useMemo, useState } from "react";
import {
  ArrowsUpDownIcon as ArrowUpDown,
  StarIcon as Star,
  ChatBubbleLeftEllipsisIcon as ChatIcon
} from "@heroicons/react/24/outline";

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
  onAccept: (requestId: string, offerId: string) => void;
  onDecline: (requestId: string, offerId: string) => void;
  onChat: (offer: ComparableOffer) => void;
}

export default function OfferComparison({ offers, onAccept, onDecline, onChat }: OfferComparisonProps) {
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "date-desc" | "date-asc">(
    "price-asc"
  );
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false); // Changed default to false for visibility

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
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-1">
              <Star
                className={`h-3.5 w-3.5 ${onlyFavorites ? "fill-amber-400 text-amber-400" : "text-gray-400"}`}
              />
              Doar favorite
            </span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSort(sort === "price-asc" ? "price-desc" : "price-asc")}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            title="Sortează după preț"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> Preț
          </button>
          <button
            onClick={() => setSort(sort === "date-asc" ? "date-desc" : "date-asc")}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
            title="Sortează după dată"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> Dată
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((o) => (
          <div key={o.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-gray-900">{o.companyName || "Companie"}</h4>
                {o.message && <p className="mt-1 line-clamp-2 text-xs text-gray-500">{o.message}</p>}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">{o.price ?? "-"} <span className="text-xs font-normal text-gray-500">RON</span></p>
                {o.status && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${o.status === "accepted"
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

            <div className="mt-auto flex gap-2 pt-2">
              <button
                onClick={() => onChat(o)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                title="Chat cu compania"
              >
                <ChatIcon className="h-5 w-5" />
              </button>

              {(!o.status || o.status === "pending") && (
                <>
                  <button
                    onClick={() => onDecline(o.requestId, o.id)}
                    className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Refuză
                  </button>
                  <button
                    onClick={() => onAccept(o.requestId, o.id)}
                    className="flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                  >
                    Acceptă
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

