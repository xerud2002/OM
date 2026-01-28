import { motion } from "framer-motion";
import {
  CheckCircleIcon as CheckCircle2,
  XCircleIcon as XCircle,
  TrashIcon as Trash2,
  ClockIcon as Clock,
  ArrowTrendingUpIcon as TrendingUp,
  CheckIcon as Save,
  XMarkIcon as X,
  PencilIcon as Edit3,
} from "@heroicons/react/24/outline";

interface Offer {
  id: string;
  requestId?: string;
  requestCode?: string;
  status?: "accepted" | "rejected" | "declined" | "pending";
  price?: number;
  message?: string;
  companyId?: string;
  createdAt?: any;
}

interface OfferCardProps {
  offer: Offer;
  index: number;
  companyUid?: string;
  isEditing: boolean;
  editPrice: string;
  setEditPrice: (value: string) => void;
  editMessage: string;
  setEditMessage: (value: string) => void;
  isSaving: boolean;
  onStartEdit: () => void;
  onSaveEdit: () => Promise<void>;
  onCancelEdit: () => void;
  onWithdraw: () => void;
}

export default function OfferCard({
  offer,
  index,
  companyUid,
  isEditing,
  editPrice,
  setEditPrice,
  editMessage,
  setEditMessage,
  isSaving,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onWithdraw,
}: OfferCardProps) {
  return (
    <motion.div
      key={offer.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg"
    >
      <div className="flex">
        {/* Color accent bar */}
        <div
          className={`w-1.5 ${
            offer.status === "accepted"
              ? "bg-gradient-to-b from-emerald-500 to-teal-500"
              : offer.status === "rejected" || offer.status === "declined"
                ? "bg-gradient-to-b from-rose-500 to-pink-500"
                : "bg-gradient-to-b from-amber-500 to-orange-500"
          }`}
        />

        <div className="flex-1 p-5">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {offer.requestCode
                    ? offer.requestCode
                    : offer.requestId
                      ? `REQ-${String(offer.requestId).slice(0, 6).toUpperCase()}`
                      : "—"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                    offer.status === "accepted"
                      ? "bg-emerald-100 text-emerald-700"
                      : offer.status === "rejected" || offer.status === "declined"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {offer.status === "accepted" && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {(offer.status === "rejected" || offer.status === "declined") && (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {(!offer.status || offer.status === "pending") && (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                  {offer.status === "accepted"
                    ? "Acceptată"
                    : offer.status === "rejected"
                      ? "Respinsă"
                      : offer.status === "declined"
                        ? "Declinată"
                        : "În așteptare"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-lg font-bold text-emerald-700">{offer.price ?? "—"} lei</span>
            </div>
          </div>

          {/* Message preview */}
          {offer.message && (
            <p className="mb-4 line-clamp-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              {offer.message}
            </p>
          )}

          {/* Action buttons */}
          {offer.companyId === companyUid && (
            <div className="border-t border-slate-100 pt-4">
              {isEditing ? (
                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Preț (lei)
                      </label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Preț (lei)"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Mesaj
                      </label>
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Mesaj"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveEdit();
                      }}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-xl disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? "Se salvează..." : "Salvează"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelEdit();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Anulează
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWithdraw();
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Retrage
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEdit();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editează
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWithdraw();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Retrage
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
