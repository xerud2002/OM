"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { addOffer } from "@/utils/firestoreHelpers";
import { onAuthChange } from "@/utils/firebaseHelpers";

// 🔹 Request type (Firestore document shape)
type MovingRequest = {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  fromCity: string;
  toCity: string;
  moveDate?: string;
  details?: string;
  createdAt?: any;
};

// 🔹 Company type (based on Firebase user)
type CompanyUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
} | null;

// 🔹 Offer type
type Offer = {
  id: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  createdAt?: any;
};

// 🔹 Props for OfferForm
type OfferFormProps = {
  requestId: string;
  company: CompanyUser;
};

// 🔹 Props for OfferList
type OfferListProps = {
  requestId: string;
  company: CompanyUser;
};

// 🧩 Offer editing component
function OfferItem({
  offer,
  requestId,
  company,
}: {
  offer: Offer;
  requestId: string;
  company: CompanyUser;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(offer.price.toString());
  const [message, setMessage] = useState(offer.message);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const offerRef = doc(db, "requests", requestId, "offers", offer.id);
      await updateDoc(offerRef, { price: Number(price), message });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating offer:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!company || !confirm("Ești sigur că vrei să retragi această ofertă?"))
      return;
    setRemoving(true);
    try {
      const offerRef = doc(db, "requests", requestId, "offers", offer.id);
      await deleteDoc(offerRef);
    } catch (err) {
      console.error("Error deleting offer:", err);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="rounded-md border bg-emerald-50 p-3 shadow-sm"
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded border p-2 text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded border p-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {saving ? "Se salvează..." : "Salvează"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
            >
              Anulează
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <span className="font-semibold text-emerald-700">
              {offer.companyName}
            </span>
            <span className="text-sm font-medium text-gray-700">
              💰 {offer.price} lei
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{offer.message}</p>
          {company && offer.companyId === company.uid && (
            <div className="mt-2 flex gap-2 text-xs">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sky-600 hover:underline"
              >
                ✏️ Editează
              </button>
              <button
                onClick={handleDelete}
                disabled={removing}
                className="text-red-500 hover:underline"
              >
                🗑️ Retrage
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// 🧩 Offer list with real-time updates
function OfferList({ requestId, company }: OfferListProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "requests", requestId, "offers"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setOffers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Offer)));
    });
    return () => unsub();
  }, [requestId]);

  return (
    <div className="mt-3 border-t pt-3">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-sm font-medium text-emerald-600 hover:underline"
      >
        {expanded
          ? "Ascunde ofertele ▲"
          : `Afișează ofertele (${offers.length}) ▼`}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-3 space-y-3"
          >
            {offers.length === 0 ? (
              <p className="text-sm italic text-gray-400">
                Nicio ofertă disponibilă momentan.
              </p>
            ) : (
              offers.map((offer) => (
                <OfferItem
                  key={offer.id}
                  offer={offer}
                  requestId={requestId}
                  company={company}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 🧩 Form for new offers
function OfferForm({ requestId, company }: OfferFormProps) {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSending(true);
    try {
      await addOffer(requestId, {
        companyId: company.uid,
        companyName: company.displayName || company.email,
        price: Number(price),
        message,
      });
      setPrice("");
      setMessage("");
    } catch (err) {
      console.error("Error sending offer:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="mt-3 flex flex-col gap-2 border-t pt-3 text-sm"
    >
      <input
        type="number"
        placeholder="Preț estimativ (lei)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        required
      />
      <textarea
        placeholder="Mesaj pentru client"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        required
      />
      <button
        type="submit"
        disabled={sending}
        className={`rounded-md py-2 font-semibold text-white transition-all ${
          sending
            ? "cursor-not-allowed bg-gray-400"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {sending ? "Se trimite..." : "Trimite ofertă"}
      </button>
    </form>
  );
}

// 🧩 Main page — CompanyRequestsPage
export default function CompanyRequestsPage() {
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyUser>(null);

  useEffect(() => {
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as MovingRequest)
        )
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Cereri primite de la clienți
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Se încarcă cererile...</p>
        ) : requests.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center italic text-gray-500"
          >
            Momentan nu există cereri noi. 💤
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence>
              {requests.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border bg-white/90 p-5 shadow-md backdrop-blur-md transition-all hover:shadow-lg"
                >
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-emerald-700">
                      {r.customerName || "Client anonim"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {r.fromCity} → {r.toCity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mutare: {r.moveDate || "-"}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{r.details}</p>
                  </div>

                  {/* Offer interaction area */}
                  {company ? (
                    <>
                      <OfferForm requestId={r.id} company={company} />
                      <OfferList requestId={r.id} company={company} />
                    </>
                  ) : (
                    <p className="mt-3 text-sm italic text-gray-400">
                      Trebuie să fii autentificat pentru a trimite oferte.
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </LayoutWrapper>
  );
}
