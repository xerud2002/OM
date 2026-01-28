import { useState } from "react";
import { motion } from "framer-motion";
import {
  InboxIcon as Inbox,
  ListBulletIcon as List,
  CheckCircleIcon as CheckCircle2,
  PlusCircleIcon as PlusSquare,
  ChatBubbleBottomCenterTextIcon as MessageSquare,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { logger } from "@/utils/logger";
import { formatDateRO, formatMoveDateDisplay } from "@/utils/date";
import { auth } from "@/services/firebase";

const OfferComparison = dynamic(() => import("@/components/customer/OfferComparison"), {
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-gray-100" />,
  ssr: false,
});

type Request = {
  id: string;
  fromCity?: string;
  toCity?: string;
  fromCounty?: string;
  toCounty?: string;
  [key: string]: any;
};

interface OffersSectionProps {
  requests: Request[];
  offersByRequest: Record<string, any[]>;
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string) => void;
  onNewRequest: () => void;
  acceptFromAggregated: (requestId: string, offerId: string) => Promise<void>;
  declineFromAggregated: (requestId: string, offerId: string) => Promise<void>;
}

export default function OffersSection({
  requests,
  offersByRequest,
  selectedRequestId,
  onSelectRequest,
  onNewRequest,
  acceptFromAggregated,
  declineFromAggregated,
}: OffersSectionProps) {
  if (requests.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-xl shadow-sky-500/30">
          <Inbox className="h-9 w-9 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Nu ai încă cereri</h3>
        <p className="mt-2 text-gray-500">
          Creează o cerere pentru a primi oferte de la firme verificate.
        </p>
        <button
          onClick={onNewRequest}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
        >
          <PlusSquare className="h-4 w-4" />
          Creează prima cerere
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[320px,1fr]">
      {/* Sidebar: requests list */}
      <aside className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white lg:border-r lg:border-b-0">
        <div className="sticky top-20 max-h-[calc(100vh-120px)] overflow-auto p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
            <List className="h-4 w-4 text-emerald-600" />
            Selectează o cerere
          </h3>
          <div className="space-y-3">
            {requests.map((r) => {
              const cnt = (offersByRequest[r.id] || []).length;
              const active = selectedRequestId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRequest(r.id)}
                  className={`w-full rounded-xl border-2 px-4 py-4 text-left transition-all duration-300 ${
                    active
                      ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg shadow-emerald-500/10"
                      : "border-transparent bg-white shadow-sm hover:border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`truncate font-bold ${active ? "text-emerald-700" : "text-gray-900"}`}
                      >
                        {r.fromCity || r.fromCounty} - {r.toCity || r.toCounty}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {(() => {
                          const d = formatMoveDateDisplay(r as any, { month: "short" });
                          return d && d !== "-" ? d : "fără dată";
                        })()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-xl px-3 py-1 text-sm font-bold ${
                        active
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cnt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main: offers for selected request */}
      <main className="p-5 lg:p-8">
        {!selectedRequestId ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Inbox className="h-7 w-7 text-gray-400" />
            </div>
            <p className="text-gray-500">Selectează o cerere din stânga pentru a vedea ofertele.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Oferte primite</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Compară și selectează cea mai bună ofertă
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2">
                <span className="text-sm font-medium text-emerald-700">Total:</span>
                <span className="text-lg font-bold text-emerald-600">
                  {(offersByRequest[selectedRequestId] || []).length}
                </span>
              </div>
            </div>

            {!(offersByRequest[selectedRequestId] || []).length ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-xl shadow-sky-500/30">
                  <Inbox className="h-9 w-9 text-white" />
                </div>
                <h4 className="mt-5 text-lg font-bold text-gray-900">Nicio ofertă încă</h4>
                <p className="mt-2 max-w-sm text-gray-500">
                  Firmele verificate vor trimite oferte aici în curând. Te vom notifica!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {(offersByRequest[selectedRequestId] || []).map((o: any, index: number) => (
                  <OfferRow
                    key={o.id}
                    index={index}
                    requestId={selectedRequestId}
                    offer={o}
                    onAccept={acceptFromAggregated}
                    onDecline={declineFromAggregated}
                  />
                ))}
              </div>
            )}

            {/* Comparison for selected request only */}
            {(offersByRequest[selectedRequestId] || []).length > 1 && (
              <div className="mt-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-6 shadow-lg">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                    ⚖️
                  </span>
                  Compară oferte
                </h3>
                <OfferComparison
                  offers={(offersByRequest[selectedRequestId] as any[]).map((o) => ({
                    id: o.id,
                    requestId: selectedRequestId,
                    companyName: (o as any).companyName,
                    price: (o as any).price,
                    message: (o as any).message,
                    status: (o as any).status,
                    createdAt: (o as any).createdAt,
                    favorite: false,
                  }))}
                  onAccept={acceptFromAggregated}
                  onDecline={declineFromAggregated}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function OfferRow({
  index,
  requestId,
  offer,
  onAccept,
  onDecline,
}: {
  index: number;
  requestId: string;
  offer: any;
  onAccept: (requestId: string, offerId: string) => Promise<void> | void;
  onDecline: (requestId: string, offerId: string) => Promise<void> | void;
}) {
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
      logger.error("sendMessage failed", err);
      const msg = err instanceof Error ? err.message : "Eroare necunoscută";
      toast.error(`Eroare la trimiterea mesajului: ${msg}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Gradient accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-sky-500" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Company info */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <CheckCircle2 className="h-4 w-4" />
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
              <MessageSquare className="h-4 w-4" />
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
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl"
            >
              Trimite
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
