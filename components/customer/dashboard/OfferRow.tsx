// components/customer/dashboard/OfferRow.tsx
// Individual offer row with accept/decline/message actions

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/services/firebase";
import { formatDateRO } from "@/utils/date";
import type { Offer } from "./types";

type Props = {
  index: number;
  requestId: string;
  offer: Offer;
  onAccept: (_requestId: string, _offerId: string) => Promise<void> | void;
  onDecline: (_requestId: string, _offerId: string) => Promise<void> | void;
};

export default function OfferRow({ index, requestId, offer, onAccept, onDecline }: Props) {
  const [showMessage, setShowMessage] = useState(false);
  const [text, setText] = useState("");

  const sendMessage = async () => {
    const t = text.trim();
    if (!t) {
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, offerId: offer.id, text: t }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }
      toast.success("Mesaj trimis");
      setText("");
      setShowMessage(false);
    } catch (err) {
      console.error("sendMessage failed", err);
      const msg = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error(`Eroare la trimiterea mesajului: ${msg}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-500 to-sky-500" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Company info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
              {offer.companyName?.charAt(0)?.toUpperCase() || "F"}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{offer.companyName}</p>
              {offer.createdAt?.toDate && (
                <p className="text-xs text-gray-500">
                  {formatDateRO(offer.createdAt, { month: "short" })}
                </p>
              )}
            </div>
          </div>
          {offer.message && (
            <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{offer.message}</p>
          )}
        </div>

        {/* Price and actions */}
        <div className="flex flex-col items-end gap-3 sm:ml-6">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500">Preț ofertat</p>
            <p className="text-3xl font-bold text-emerald-600">
              {offer.price} <span className="text-lg">lei</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAccept(requestId, offer.id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CheckCircle2 size={16} />
              Acceptă
            </button>
            <button
              onClick={() => onDecline(requestId, offer.id)}
              className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              Refuză
            </button>
            <button
              onClick={() => setShowMessage((s) => !s)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
            >
              <MessageSquare size={16} />
              Mesaj
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Scrie un mesaj către firmă..."
            className="w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm transition-all outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowMessage(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Anulează
            </button>
            <button
              onClick={sendMessage}
              className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl"
            >
              Trimite
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
