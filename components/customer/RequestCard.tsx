import React from "react";
import { useState } from "react";
import OfferItem from "@/components/customer/OfferItem";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";
import { auth } from "@/services/firebase";

type Offer = {
  id?: string;
  companyName?: string;
  price?: number;
  message?: string;
  status?: "pending" | "accepted" | "declined";
};

type Request = {
  id?: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
  details?: string;
  rooms?: number | string;
  volumeM3?: number;
  budgetEstimate?: number;
  needPacking?: boolean;
  status?: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
};

const RequestCard = React.memo(({ r, offers }: { r: Request; offers?: Offer[] }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleAccept = async (offerId: string) => {
    if (!r.id) return;
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Trebuie să fii autentificat pentru a accepta o ofertă");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: r.id, offerId }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }
      toast.success("Oferta a fost acceptată!");

      const accepted: any = (offers || []).find((o) => o.id === offerId) || null;
      try {
        trackEvent("offer_accepted", {
          requestId: r.id,
          offerId,
          price: accepted?.price,
          companyId: accepted?.companyId,
        });
      } catch {}
    } catch (err) {
      console.error("Failed to accept offer", err);
      const errMsg = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error(`Eroare la acceptarea ofertei: ${errMsg}`);
    }
  };

  const handleDecline = async (offerId: string) => {
    if (!r.id) return;
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Trebuie să fii autentificat pentru a refuza o ofertă");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: r.id, offerId }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }
      try {
        trackEvent("offer_declined", { requestId: r.id, offerId });
      } catch {}
      try {
        trackEvent("offer_declined", { requestId: r.id, offerId });
      } catch {}
      toast.success("Oferta a fost refuzată");
    } catch (err) {
      console.error("Failed to decline offer", err);
      const errMsg = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error(`Eroare la refuzarea ofertei: ${errMsg}`);
    }
  };

  const toggleFavorite = (offerId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
      } else {
        next.add(offerId);
      }
      return next;
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-sm transition-all hover:shadow-xl">
      {/* Gradient accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-sky-500" />
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-gray-900">
                {r.fromCity} → {r.toCity}
              </h3>
              {r.status && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                    r.status === "accepted" || r.status === "in-progress"
                      ? "bg-emerald-100 text-emerald-700"
                      : r.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : r.status === "cancelled"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {r.status === "accepted"
                    ? "Acceptată"
                    : r.status === "in-progress"
                    ? "În desfășurare"
                    : r.status === "completed"
                    ? "Finalizată"
                    : r.status === "cancelled"
                    ? "Anulată"
                    : "În așteptare"}
                </span>
              )}
            </div>
            
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{r.moveDate}</span>
            </div>

            {r.details && (
              <p className="mb-4 text-sm leading-relaxed text-gray-600">{r.details}</p>
            )}

            <div className="flex flex-wrap gap-3">
              {r.rooms && (
                <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
                  <span className="font-semibold text-gray-900">{r.rooms}</span>
                  <span className="ml-1 text-gray-600">camere</span>
                </div>
              )}
              {typeof r.volumeM3 !== "undefined" && (
                <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
                  <span className="font-semibold text-gray-900">{r.volumeM3}</span>
                  <span className="ml-1 text-gray-600">m³</span>
                </div>
              )}
              {r.budgetEstimate && (
                <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm">
                  <span className="font-semibold text-emerald-700">{r.budgetEstimate}</span>
                  <span className="ml-1 text-emerald-600">RON</span>
                </div>
              )}
              {r.needPacking && (
                <div className="rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
                  Necesită ambalare
                </div>
              )}
            </div>
          </div>

          {/* Offers Badge */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 shadow-lg">
              <span className="text-2xl font-bold text-white">{offers?.length ?? 0}</span>
            </div>
            <span className="text-xs font-medium text-gray-500">oferte</span>
          </div>
        </div>

        {/* Offers Section */}
        {offers && offers.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Oferte primite ({offers.length})
            </h4>
            <div className="space-y-3">
              {offers.map((o) => (
                <OfferItem
                  key={o.id}
                  offer={o}
                  requestId={r.id}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.has(o.id!)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No offers state */}
        {(!offers || offers.length === 0) && (
          <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
            <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-500">Nicio ofertă încă</p>
            <p className="mt-1 text-xs text-gray-400">Firmele vor răspunde în curând</p>
          </div>
        )}
      </div>
    </div>
  );
});

RequestCard.displayName = "RequestCard";

export default RequestCard;
