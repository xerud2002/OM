"use client";

import { useEffect, useState, useMemo } from "react";
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

// Types
export type MovingRequest = {
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

export type CompanyUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
} | null;

export type Offer = {
  id: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt?: any;
};

// Offer editing component
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

  const isOwn = company && offer.companyId === company.uid;
  const isPending = (offer.status ?? "pending") === "pending";

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
    if (!company || !confirm("Ești sigur că vrei să retragi această ofertă?")) return;
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
            <span className="font-semibold text-emerald-700">{offer.companyName}</span>
            <span className="text-sm font-medium text-gray-700">💰 {offer.price} lei</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="text-sm text-gray-600">{offer.message}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                (offer.status ?? "pending") === "accepted"
                  ? "bg-emerald-100 text-emerald-700"
                  : (offer.status ?? "pending") === "rejected" ||
                    (offer.status ?? "pending") === "declined"
                  ? "bg-rose-100 text-rose-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {offer.status ?? "pending"}
            </span>
          </div>
          {isOwn && isPending && (
            <div className="mt-2 flex gap-2 text-xs">
              <button onClick={() => setIsEditing(true)} className="text-sky-600 hover:underline">
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

function OfferList({ requestId, company, onHasMine }: {
  requestId: string;
  company: CompanyUser;
  onHasMine?: any;
}) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "requests", requestId, "offers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Offer);
      setOffers(list);
      if (company && onHasMine) {
        const mine = list.some((o) => o.companyId === company.uid);
        onHasMine(mine);
      }
    });
    return () => unsub();
  }, [requestId, company, onHasMine]);

  return (
    <div className="mt-3 border-t pt-3">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-sm font-medium text-emerald-600 hover:underline"
      >
        {expanded ? "Ascunde ofertele ▲" : `Afișează ofertele (${offers.length}) ▼`}
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
              <p className="text-sm italic text-gray-400">Nicio ofertă disponibilă momentan.</p>
            ) : (
              offers.map((offer) => (
                <OfferItem key={offer.id} offer={offer} requestId={requestId} company={company} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OfferForm({ requestId, company }: { requestId: string; company: CompanyUser }) {
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const priceNum = Number(price);
  const isPriceValid = !Number.isNaN(priceNum) && priceNum > 0;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !isPriceValid) return;
    setSending(true);
    try {
      await addOffer(requestId, {
        companyId: company.uid,
        companyName: company.displayName || company.email || "Companie",
        price: priceNum,
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
    <form onSubmit={handleSend} className="mt-3 flex flex-col gap-2 border-t pt-3 text-sm">
      <input
        type="number"
        placeholder="Preț estimativ (lei)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min={1}
        className={`rounded-md border p-2 focus:outline-none focus:ring-2 ${
          isPriceValid ? "focus:ring-emerald-500" : "border-rose-300 focus:ring-rose-400"
        }`}
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
        disabled={sending || !isPriceValid}
        className={`rounded-md py-2 font-semibold text-white transition-all ${
          sending || !isPriceValid ? "cursor-not-allowed bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {sending ? "Se trimite..." : "Trimite ofertă"}
      </button>
    </form>
  );
}

export default function RequestsView({ companyFromParent }: { companyFromParent?: CompanyUser }) {
  const [company, setCompany] = useState<CompanyUser>(companyFromParent ?? null);
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMineMap, setHasMineMap] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Auth (if not provided by parent)
  useEffect(() => {
    if (companyFromParent) return;
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, [companyFromParent]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as MovingRequest));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedRequests = useMemo(() => {
    const arr = [...requests];
    const getTime = (r: MovingRequest) => (r.createdAt?.toMillis ? r.createdAt.toMillis() : r.createdAt || 0);
    return sortBy === "date-desc" ? arr.sort((a, b) => getTime(b) - getTime(a)) : arr.sort((a, b) => getTime(a) - getTime(b));
  }, [requests, sortBy]);

  const getTimeAgo = useMemo(
    () => (createdAt: any) => {
      if (!createdAt) return "";
      const ms = createdAt.toMillis ? createdAt.toMillis() : createdAt;
      const diff = currentTime - ms;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      return "Nou!";
    },
    [currentTime]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Total cereri: <span className="font-semibold">{requests.length}</span>
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="date-desc">Cele mai noi</option>
          <option value="date-asc">Cele mai vechi</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Se încarcă cererile...</p>
      ) : sortedRequests.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center italic text-gray-500">
          Momentan nu există cereri noi. 💤
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {sortedRequests.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border bg-white/90 p-5 shadow-md backdrop-blur-md transition-all hover:shadow-lg"
              >
                {r.createdAt && (
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        getTimeAgo(r.createdAt) === "Nou!" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getTimeAgo(r.createdAt)}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="mb-1 text-lg font-semibold text-emerald-700">{r.customerName || "Client anonim"}</h3>
                  <p className="text-sm text-gray-600">
                    {r.fromCity} → {r.toCity}
                  </p>
                  <p className="text-sm text-gray-500">Mutare: {r.moveDate || "-"}</p>
                  <p className="mt-2 text-sm text-gray-600">{r.details}</p>
                </div>

                {company ? (
                  <>
                    <OfferList
                      requestId={r.id}
                      company={company}
                      onHasMine={(has: boolean) => setHasMineMap((prev) => ({ ...prev, [r.id]: has }))}
                    />
                    {!hasMineMap[r.id] ? (
                      <OfferForm requestId={r.id} company={company} />
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">
                        Ai trimis deja o ofertă pentru această cerere. O poți edita sau retrage mai sus.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-sm italic text-gray-400">Trebuie să fii autentificat pentru a trimite oferte.</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
