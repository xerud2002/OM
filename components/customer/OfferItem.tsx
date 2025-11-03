import React from "react";
import { useState, useEffect } from "react";
import { Star, Check, X, MessageSquare } from "lucide-react";
import StarRating from "@/components/reviews/StarRating";
import { doc, getDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/services/firebase";
import { auth } from "@/services/firebase";
import { toast } from "sonner";

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
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; senderId: string; senderRole?: string; createdAt?: any }>
  >([]);

  // Live messages when the panel is open
  useEffect(() => {
    if (!showMessage || !requestId || !offer.id) return;
    const q = query(
      collection(db, "requests", requestId, "offers", offer.id, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setMessages(list);
    });
    return () => unsub();
  }, [showMessage, requestId, offer.id]);

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

  const handleSendMessage = async () => {
    if (!requestId || !offer.id) return;
    const text = messageText.trim();
    if (!text) {
      toast.error("Scrie un mesaj înainte de a trimite.");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Trebuie să fii autentificat pentru a trimite mesajul.");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId: offer.id, text }),
      });
      if (!resp.ok) {
        if (resp.status === 503) {
          // Fallback: write message directly (rules allow involved parties to create messages)
          const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
          await addDoc(collection(db, "requests", requestId, "offers", offer.id, "messages"), {
            text,
            senderId: user.uid,
            senderRole: "customer",
            createdAt: serverTimestamp(),
          });
        } else {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }
      }
      toast.success("Mesaj trimis");
      setMessageText("");
      setShowMessage(false);
    } catch (err) {
      console.error("Failed to send message", err);
      const errMsg = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error(`Eroare la trimiterea mesajului: ${errMsg}`);
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
        <div className="flex flex-col gap-2 border-t pt-2">
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setShowMessage((s) => !s)}
              className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <MessageSquare size={14} />
              Mesaj
            </button>
          </div>
          {showMessage && (
            <div className="flex w-full flex-col gap-2 rounded-md border border-gray-200 bg-white p-2">
              {/* Conversation */}
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-xs italic text-gray-400">Nu există mesaje încă.</p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.senderId === auth.currentUser?.uid ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`rounded-md px-2 py-1 text-sm ${
                          m.senderId === auth.currentUser?.uid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                placeholder="Scrie un mesaj către firmă..."
                className="w-full resize-y rounded-md border border-gray-200 p-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowMessage(false)}
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm"
                >
                  Anulează
                </button>
                <button
                  onClick={handleSendMessage}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Trimite
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
