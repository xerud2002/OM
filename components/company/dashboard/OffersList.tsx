import { useState } from "react";
import { motion } from "framer-motion";
import {
  PaperAirplaneIcon as Send,
  DocumentTextIcon as FileText,
  ChevronRightIcon as ChevronRight,
} from "@heroicons/react/24/outline";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { logger } from "@/utils/logger";
import OfferCard from "./OfferCard";

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

interface OffersListProps {
  offers: Offer[];
  loading: boolean;
  companyUid?: string;
  onSwitchToRequests: () => void;
  onWithdrawOffer: (offer: Offer) => void;
}

export default function OffersList({
  offers,
  loading,
  companyUid,
  onSwitchToRequests,
  onWithdrawOffer,
}: OffersListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateOffer(offer: Offer, fields: Partial<Offer>) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await updateDoc(offerRef, fields);
    } catch (e) {
      logger.error("Failed to update offer", e);
    }
  }

  const handleSaveEdit = async (offer: Offer) => {
    setSavingId(offer.id);
    await updateOffer(offer, {
      price: Number(editPrice),
      message: editMessage,
    });
    setSavingId(null);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="mt-4 text-sm font-medium text-slate-600">Se încarcă datele...</p>
      </div>
    );
  }

  if (!Array.isArray(offers) || offers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Send className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-lg font-semibold text-slate-700">Nu există oferte de afișat</p>
        <p className="mt-2 text-sm text-slate-500">
          Trimite oferte la cererile clienților pentru a le vedea aici
        </p>
        <button
          onClick={onSwitchToRequests}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          <FileText className="h-5 w-5" />
          Vezi cererile disponibile
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((offer, i) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          index={i}
          companyUid={companyUid}
          isEditing={editingId === offer.id}
          editPrice={editPrice}
          setEditPrice={setEditPrice}
          editMessage={editMessage}
          setEditMessage={setEditMessage}
          isSaving={savingId === offer.id}
          onStartEdit={() => {
            setEditingId(offer.id);
            setEditPrice(String(offer.price ?? ""));
            setEditMessage(offer.message ?? "");
          }}
          onSaveEdit={() => handleSaveEdit(offer)}
          onCancelEdit={() => setEditingId(null)}
          onWithdraw={() => onWithdrawOffer(offer)}
        />
      ))}
    </div>
  );
}
