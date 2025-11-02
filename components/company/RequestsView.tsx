"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { addOffer } from "@/utils/firestoreHelpers";
import { formatMoveDateDisplay } from "@/utils/date";
import { trackEvent } from "@/utils/analytics";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { maskName } from "@/utils/masking";
import { onCompanyUnlocks, unlockContact } from "@/utils/unlockHelpers";
import { sendOfferMessage } from "@/utils/messagesHelpers";
import { FileText } from "lucide-react";
import JobSheetModal from "./JobSheetModal";

// Types
export type MovingRequest = {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  phone?: string;
  fromCity: string;
  toCity: string;
  moveDate?: string;
  details?: string;
  createdAt?: any;
  requestCode?: string;
  status?: "active" | "closed" | "paused" | "cancelled";
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
  proposedDate?: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt?: any;
};

// Offer editing component
function OfferItem({
  offer,
  requestId,
  company,
  unlocked,
}: {
  offer: Offer;
  requestId: string;
  company: CompanyUser;
  unlocked: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(offer.price.toString());
  const [message, setMessage] = useState(offer.message);
  const [proposedDate, setProposedDate] = useState(offer.proposedDate || "");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const isOwn = company && offer.companyId === company.uid;
  const isPending = (offer.status ?? "pending") === "pending";

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const offerRef = doc(db, "requests", requestId, "offers", offer.id);
      await updateDoc(offerRef, {
        price: Number(price),
        message,
        proposedDate: proposedDate || null,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating offer:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!company || !messageText.trim()) return;
    setSendingMessage(true);
    try {
      await sendOfferMessage(
        requestId,
        offer.id,
        "company",
        company.uid,
        messageText,
        company.displayName || company.email || "Companie"
      );
      setMessageText("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSendingMessage(false);
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
            placeholder="Preț (lei)"
            className="w-full rounded border p-2 text-sm"
          />
          <input
            type="date"
            value={proposedDate}
            onChange={(e) => setProposedDate(e.target.value)}
            className="w-full rounded border p-2 text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesaj"
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
          {offer.proposedDate && (
            <p className="mt-1 text-xs text-gray-600">
              📅 Data propusă: {new Date(offer.proposedDate).toLocaleDateString("ro-RO")}
            </p>
          )}
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

          {/* Messaging UI - Only shown for own offers when unlocked */}
          {isOwn && unlocked && (
            <div className="mt-3 border-t border-emerald-200 pt-3">
              <p className="mb-2 text-xs font-semibold text-gray-700">✉️ Trimite mesaj clientului</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Scrie mesajul tău..."
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !sendingMessage) {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700 disabled:bg-gray-400"
                >
                  {sendingMessage ? "..." : "Trimite"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function JobSheetButton({ request }: { request: MovingRequest }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
        title="Vizualizează Job Sheet"
      >
        <FileText size={14} />
        Job Sheet
      </button>
      <JobSheetModal request={request} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

function OfferList({
  requestId,
  company,
  onHasMine,
  unlocked,
}: {
  requestId: string;
  company: CompanyUser;
  onHasMine?: any;
  unlocked: boolean;
}) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!company?.uid) return;
    const q = query(
      collection(db, "requests", requestId, "offers"),
      where("companyId", "==", company.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Offer);
        setOffers(list);
        if (onHasMine) onHasMine(list.length > 0);
      },
      async (err) => {
        console.warn("OfferList snapshot error:", err);
        // Fallback: read via admin API to avoid rules errors
        try {
          const u = (await import("@/services/firebase")).auth.currentUser;
          const token = await u?.getIdToken();
          if (!token) return;
          const resp = await fetch(`/api/company/offers`, { headers: { Authorization: `Bearer ${token}` } });
          if (resp.ok) {
            const data = await resp.json();
            const mine = (Array.isArray(data?.offers) ? data.offers : []).filter((o: any) => o.requestId === requestId);
            setOffers(mine as any);
            if (onHasMine) onHasMine(mine.length > 0);
          }
        } catch (e) {
          console.warn("OfferList fallback failed", e);
        }
      }
    );
    return () => unsub();
  }, [requestId, company?.uid, onHasMine]);

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
                <OfferItem
                  key={offer.id}
                  offer={offer}
                  requestId={requestId}
                  company={company}
                  unlocked={unlocked}
                />
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
  const [proposedDate, setProposedDate] = useState("");
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
        ...(proposedDate ? { proposedDate } : {}),
      });
      try {
        trackEvent("offer_submitted", { requestId, companyId: company.uid, price: priceNum });
      } catch {}
      setPrice("");
      setMessage("");
      setProposedDate("");
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
      <input
        type="date"
        placeholder="Data propusă pentru mutare"
        value={proposedDate}
        onChange={(e) => setProposedDate(e.target.value)}
        className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          sending || !isPriceValid
            ? "cursor-not-allowed bg-gray-400"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {sending ? "Se trimite..." : "Trimite ofertă"}
      </button>
    </form>
  );
}

export default function RequestsView({ companyFromParent }: { companyFromParent?: CompanyUser }) {
  const [company, setCompany] = useState<CompanyUser>(companyFromParent ?? null);
  const PAGE_SIZE = 10;
  const [firstPage, setFirstPage] = useState<MovingRequest[]>([]);
  const [extra, setExtra] = useState<MovingRequest[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasMineMap, setHasMineMap] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  
  // Unlock state management
  const [unlockMap, setUnlockMap] = useState<Record<string, boolean>>({});
  const [unlockingId, setUnlockingId] = useState<string | null>(null);

  // Auth (if not provided by parent)
  useEffect(() => {
    if (companyFromParent) return;
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, [companyFromParent]);

  // Subscribe to unlock records for this company
  useEffect(() => {
    if (!company?.uid) return;
    const unsub = onCompanyUnlocks(company.uid, (unlocks: Record<string, boolean>) => {
      setUnlockMap(unlocks);
    });
    return () => unsub();
  }, [company?.uid]);

  useEffect(() => {
    const q = query(
      collection(db, "requests"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
          .filter((req) => {
            const isActive = !req.status || req.status === "active";
            const notArchived = !req.archived;
            return isActive && notArchived;
          });
        setFirstPage(list);
        setLoading(false);
        const last = snapshot.docs[snapshot.docs.length - 1] || null;
        setLastDoc(last);
        setHasMore(snapshot.size === PAGE_SIZE);
      },
      async (err) => {
        console.warn("Requests snapshot error:", err);
        setLoading(false);
        if ((err as any)?.code === "permission-denied") {
          try {
            const u = (await import("@/services/firebase")).auth.currentUser;
            const token = await u?.getIdToken();
            if (!token) return;
            const resp = await fetch(`/api/company/requests?limit=${PAGE_SIZE}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resp.ok) {
              const data = await resp.json();
              setFirstPage(Array.isArray(data?.requests) ? data.requests : []);
              setHasMore(false); // disable infinite loading in fallback
            }
          } catch (e) {
            console.warn("Fallback requests fetch failed", e);
          }
        }
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    try {
      const q2 = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q2);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as any)
        .filter((req: any) => {
          const isActive = !req.status || req.status === "active";
          const notArchived = !req.archived;
          return isActive && notArchived;
        });
      setExtra((prev) => {
        const seen = new Set(prev.map((p) => p.id).concat(firstPage.map((p) => p.id)));
        return [...prev, ...list.filter((x) => !seen.has(x.id))];
      });
      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.size === PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, firstPage]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loadingMore) {
            loadMore();
          }
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  const combinedRequests = useMemo(() => {
    // Ensure uniqueness when combining pages
    const map = new Map<string, MovingRequest>();
    [...firstPage, ...extra].forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [firstPage, extra]);

  const sortedRequests = useMemo(() => {
    const arr = [...combinedRequests];
    const getTime = (r: MovingRequest) =>
      r.createdAt?.toMillis ? r.createdAt.toMillis() : r.createdAt || 0;
    return sortBy === "date-desc"
      ? arr.sort((a, b) => getTime(b) - getTime(a))
      : arr.sort((a, b) => getTime(a) - getTime(b));
  }, [combinedRequests, sortBy]);

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
          Total cereri: <span className="font-semibold">{sortedRequests.length}</span>
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
                        getTimeAgo(r.createdAt) === "Nou!"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getTimeAgo(r.createdAt)}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-emerald-700">
                        {unlockMap[r.id]
                          ? r.customerName || "Client anonim"
                          : maskName(r.customerName)}
                      </h3>
                      {r.requestCode && (
                        <span className="inline-flex items-center rounded-md bg-gradient-to-r from-emerald-100 to-sky-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          {r.requestCode}
                        </span>
                      )}
                    </div>
                    <JobSheetButton request={r} />
                  </div>

                  {/* Status Badge */}
                  {r.status && r.status !== "active" && (
                    <span
                      className={`mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        r.status === "closed"
                          ? "bg-gray-100 text-gray-700"
                          : r.status === "paused"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {r.status === "closed"
                        ? "Închisă"
                        : r.status === "paused"
                          ? "În așteptare"
                          : "Anulată"}
                    </span>
                  )}

                  <p className="text-sm text-gray-600">
                    {r.fromCity} → {r.toCity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Mutare: {(() => {
                      const d = formatMoveDateDisplay(r as any, { month: "short" });
                      return d && d !== "-" ? d : "-";
                    })()}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">{r.details}</p>

                  {/* Contact Details - Hidden by default, shown after unlock */}
                  {!unlockMap[r.id] ? (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="mb-2 text-xs font-medium text-amber-800">
                        🔒 Detaliile complete de contact sunt ascunse
                      </p>
                      <p className="mb-3 text-xs text-amber-700">
                        Deblochează pentru a vedea numele complet, email și telefon
                      </p>
                      <button
                        onClick={async () => {
                          if (!company?.uid) return;
                          if (
                            !confirm(
                              "Vrei să deblochezi detaliile de contact pentru această cerere? (simulare plată)"
                            )
                          )
                            return;
                          setUnlockingId(r.id);
                          try {
                            await unlockContact(r.id, company.uid);
                            trackEvent("contact_unlocked", { requestId: r.id, companyId: company.uid });
                          } catch (err) {
                            console.error("Unlock failed:", err);
                          } finally {
                            setUnlockingId(null);
                          }
                        }}
                        disabled={unlockingId === r.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-gray-400"
                      >
                        {unlockingId === r.id ? "Se deblochează..." : "🔓 Deblochează contactele"}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="mb-2 text-xs font-semibold text-emerald-800">
                        ✅ Detalii complete de contact
                      </p>
                      <div className="space-y-1 text-sm text-emerald-900">
                        <p>
                          <span className="font-medium">Nume:</span> {r.customerName || "—"}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> {r.customerEmail || "—"}
                        </p>
                        <p>
                          <span className="font-medium">Telefon:</span> {r.phone || "—"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {company ? (
                  <>
                    <OfferList
                      requestId={r.id}
                      company={company}
                      unlocked={!!unlockMap[r.id]}
                      onHasMine={(has: boolean) =>
                        setHasMineMap((prev) => ({ ...prev, [r.id]: has }))
                      }
                    />
                    {!hasMineMap[r.id] ? (
                      <OfferForm requestId={r.id} company={company} />
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">
                        Ai trimis deja o ofertă pentru această cerere. O poți edita sau retrage mai
                        sus.
                      </p>
                    )}
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
      <div ref={sentinelRef} />
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            disabled={loadingMore || !lastDoc}
            onClick={loadMore}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loadingMore ? "Se încarcă..." : "Încarcă mai multe"}
          </button>
        </div>
      )}
    </div>
  );
}
