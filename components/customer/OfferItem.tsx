import React from "react";
import { useState, useEffect } from "react";
import { Star, Check, X } from "lucide-react";
import StarRating from "@/components/reviews/StarRating";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

type Offer = {
  id?: string;
  companyId?: string;
  companyName?: string;
  price?: number;
  message?: string;
  status?: "pending" | "accepted" | "declined";
};

export default function OfferItem({
  offer,
  requestId,
  onAccept,
  onDecline,
  onToggleFavorite,
  isFavorite,
}: {
  offer: Offer;
  requestId?: string;
  onAccept?: any;
  onDecline?: any;
  onToggleFavorite?: any;
  isFavorite?: boolean;
}) {
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [companyRating, setCompanyRating] = useState<{
    average: number;
    total: number;
  } | null>(null);

  // Fetch company rating if companyId is available
  useEffect(() => {
    if (!offer.companyId) return;
    const fetchRating = async () => {
      try {
        const compRef = doc(db, "companies", offer.companyId!);
        const compSnap = await getDoc(compRef);
        if (compSnap.exists()) {
          const data = compSnap.data();
          setCompanyRating({
            average: data.averageRating || 0,
            total: data.totalReviews || 0,
          });
        }
      } catch (err) {
        console.warn("Failed to fetch company rating", err);
      }
    };
    fetchRating();
  }, [offer.companyId]);

  const handleAccept = async () => {
    if (!onAccept || !offer.id) return;
    setAccepting(true);
    try {
      await onAccept(offer.id);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!onDecline || !offer.id) return;
    setDeclining(true);
    try {
      await onDecline(offer.id);
    } finally {
      setDeclining(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-3 rounded-md border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-gray-800">{offer.companyName}</p>
          {companyRating && companyRating.total > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <StarRating rating={companyRating.average} size="sm" />
              <span className="text-xs text-gray-500">
                ({companyRating.total} {companyRating.total === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
          {offer.message && <p className="mt-1 text-sm text-gray-500">{offer.message}</p>}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-emerald-700">{offer.price} lei</p>
          {onToggleFavorite && offer.id && (
            <button
              onClick={() => onToggleFavorite(offer.id!)}
              className={`rounded p-1 transition ${isFavorite ? "text-amber-500" : "text-gray-400 hover:text-amber-500"}`}
              title={isFavorite ? "Elimină din favorite" : "Adaugă la favorite"}
            >
              <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      {offer.status && (
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              offer.status === "accepted"
                ? "bg-emerald-100 text-emerald-700"
                : offer.status === "declined"
                ? "bg-rose-100 text-rose-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {offer.status === "accepted"
              ? "Acceptată"
              : offer.status === "declined"
              ? "Refuzată"
              : "În așteptare"}
          </span>
        </div>
      )}

      {requestId && onAccept && onDecline && (!offer.status || offer.status === "pending") && (
        <div className="flex items-center gap-2 border-t pt-2">
          <button
            onClick={handleAccept}
            disabled={accepting || declining}
            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <Check size={14} />
            {accepting ? "Se acceptă..." : "Acceptă"}
          </button>
          <button
            onClick={handleDecline}
            disabled={accepting || declining}
            className="flex flex-1 items-center justify-center gap-1 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
          >
            <X size={14} />
            {declining ? "Se refuză..." : "Refuză"}
          </button>
        </div>
      )}
    </div>
  );
}
