"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  getDoc,
  where,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { formatMoveDateDisplay } from "@/utils/date";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { calculateRequestCost } from "@/utils/costCalculator";
import OfferModal from "@/components/company/OfferModal";
import { logger } from "@/utils/logger";

import {
  ChatBubbleLeftEllipsisIcon,
  CalendarIcon,
  TruckIcon,
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  HomeModernIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  CubeIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/outline";

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
  status?: string;
  archived?: boolean;
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

// --- JobCard Component ---
function JobCard({
  request,
  company,
  hasMine,
  onOfferClick,
  onChatClick,
}: {
  request: MovingRequest;
  company: CompanyUser;
  hasMine: boolean | string;
  // eslint-disable-next-line no-unused-vars
  onOfferClick: (r: MovingRequest) => void;
  // eslint-disable-next-line no-unused-vars
  onChatClick?: (requestId: string, offerId: string) => void;
}) {
  const r = request;
  const cost = calculateRequestCost(r);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
       {/* Decorative Side Bar based on status/hasMine */}
       <div className={`absolute left-0 top-0 h-full w-1 ${
         hasMine ? "bg-emerald-500" : "bg-blue-500"
       }`} />

       <div className="flex flex-col gap-4">
         {/* Top Row: ID, Date, Status */}
         <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
               <span className="font-mono text-xs font-bold text-gray-400">
                 {(r as any).requestCode || r.id.substring(0, 8)}
               </span>
               <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-100">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>
                    {(() => {
                      const d = formatMoveDateDisplay(r as any, { month: "short" });
                       return d && d !== "-" ? d : "Flexibil";
                    })()}
                  </span>
               </div>
               {/* New Badge */}
               {r.createdAt && (Date.now() - (r.createdAt.toMillis ? r.createdAt.toMillis() : r.createdAt) < 3600000) && (
                 <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">NOU</span>
               )}
            </div>
            
            {hasMine && (
               <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                 <CheckBadgeIcon className="h-4 w-4" />
                 Ofertat
               </span>
            )}
         </div>

         {/* Route Row - Prominent */}
         <div className="flex items-center gap-3 text-gray-800">
            <div className="flex flex-col">
               <span className="text-xs font-medium text-gray-400 uppercase">De la</span>
               <span className="text-lg font-bold leading-tight">{(r as any).fromCounty || r.fromCity}</span>
               <span className="text-sm text-gray-600">{r.fromCity}</span>
            </div>
            
            <div className="flex flex-1 items-center justify-center px-4">
               <div className="h-[2px] w-full bg-gray-100 relative">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-50 p-1 text-gray-300 ring-4 ring-white">
                     <TruckIcon className="h-4 w-4" />
                  </div>
               </div>
            </div>

            <div className="flex flex-col text-right">
               <span className="text-xs font-medium text-gray-400 uppercase">Către</span>
               <span className="text-lg font-bold leading-tight">{(r as any).toCounty || r.toCity}</span>
               <span className="text-sm text-gray-600">{r.toCity}</span>
            </div>
         </div>

         {/* Details Grid */}
         <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
            {/* From Details */}
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  Colectare
               </div>
               <div className="pl-6 flex flex-wrap gap-2 text-gray-600">
                  <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 shadow-sm">
                     <BuildingOffice2Icon className="h-3 w-3 text-gray-400" />
                     {(r as any).fromType === "house" ? "Casă" : "Apt"}
                  </span>
                  {(r as any).fromRooms && (
                     <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 shadow-sm">
                        <CubeIcon className="h-3 w-3 text-gray-400" />
                        {(r as any).fromRooms} cam
                     </span>
                  )}
                  {(r as any).fromFloor !== undefined && (
                     <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 shadow-sm">
                        Et. {(r as any).fromFloor}
                     </span>
                  )}
                  <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 shadow-sm text-xs border ${
                     (r as any).fromElevator ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {(r as any).fromElevator ? "Lift" : "Fără lift"}
                  </span>
               </div>
            </div>

            {/* To Details */}
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-gray-900 font-medium">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  Livrare
               </div>
               <div className="pl-6 flex flex-wrap gap-2 text-gray-600">
                  <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 shadow-sm">
                     <BuildingOffice2Icon className="h-3 w-3 text-gray-400" />
                     {(r as any).toType === "house" ? "Casă" : "Apt"}
                  </span>
                  {(r as any).toFloor !== undefined && (
                     <span className="inline-flex items-center gap-1 rounded bg-white px-1.5 py-0.5 shadow-sm">
                        Et. {(r as any).toFloor}
                     </span>
                  )}
                  <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 shadow-sm text-xs border ${
                     (r as any).toElevator ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {(r as any).toElevator ? "Lift" : "Fără lift"}
                  </span>
               </div>
            </div>
         </div>

         {/* Services */}
         <div className="flex flex-wrap gap-2">
            {(r as any).serviceMoving && (
               <div className="flex items-center gap-1 rounded border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  <TruckIcon className="h-3.5 w-3.5" /> Transport
               </div>
            )}
            {(r as any).servicePacking && (
               <div className="flex items-center gap-1 rounded border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  <ArchiveBoxIcon className="h-3.5 w-3.5" /> Ambalare
               </div>
            )}
            {(r as any).serviceDisassembly && (
               <div className="flex items-center gap-1 rounded border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  <WrenchScrewdriverIcon className="h-3.5 w-3.5" /> Demontare
               </div>
            )}
            {((r as any).serviceCleanout || (r as any).serviceStorage) && (
               <div className="flex items-center gap-1 rounded border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                  <HomeModernIcon className="h-3.5 w-3.5" /> Alte servicii
               </div>
            )}
         </div>

         {/* Actions */}
         <div className="mt-2 flex items-center justify-end gap-3 border-t border-gray-50 pt-4">
            {hasMine ? (
               <div className="flex gap-2">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                     <CheckCircleIcon className="h-5 w-5" />
                     Ai aplicat deja
                  </span>
                  {typeof hasMine === 'string' && onChatClick && (
                    <button 
                      onClick={() => onChatClick(r.id, hasMine)}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                      Chat
                    </button>
                  )}
               </div>
            ) : (
               <button
                  onClick={() => onOfferClick(r)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/40"
               >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Trimite Ofertă 
                  <span className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px] text-white">
                     {cost} Credite
                  </span>
               </button>
            )}
         </div>
       </div>
    </div>
  );
}

// Icons needed for JobCard
function CheckCircleIcon({className}: {className?: string}) {
   return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
   );
}


// --- Main RequestsView Component ---
export default function RequestsView({ companyFromParent }: { companyFromParent?: CompanyUser }) {
  const [company, setCompany] = useState<CompanyUser>(companyFromParent ?? null);
  const PAGE_SIZE = 10;
  const [firstPage, setFirstPage] = useState<MovingRequest[]>([]);
  const [extra, setExtra] = useState<MovingRequest[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasMineMap, setHasMineMap] = useState<Record<string, boolean | string>>({});
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");

  // Modal State
  const [activeOfferRequest, setActiveOfferRequest] = useState<MovingRequest | null>(null);
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auth (if not provided by parent)
  useEffect(() => {
    if (companyFromParent) return;
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, [companyFromParent]);

  // Initial Load
  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
          .filter((req) => {
            const isVisible =
              !req.status ||
              req.status === "active" ||
              req.status === "accepted" || // Accepted by someone else? We might want to filter this out eventually?
              req.status === "pending";
            const notArchived = !req.archived;
            return isVisible && notArchived;
          });
        
        setFirstPage(list);
        setLoading(false);
        const last = snapshot.docs[snapshot.docs.length - 1] || null;
        setLastDoc(last);
        setHasMore(snapshot.size === PAGE_SIZE);

        // Check which ones we have offered on
        if (company?.uid && list.length > 0) {
            checkMyOffers(list, company.uid);
        }
      },
      (error) => {
        console.warn("Error loading requests:", error);
        setFirstPage([]);
        setLoading(false);
        setHasMore(false);
      }
    );
    return () => unsub();
  }, [company?.uid]);

  const checkMyOffers = async (requests: MovingRequest[], companyId: string) => {
     try {
       // Batch check isn't easy in Firestore without complex queries or reading all my offers.
       // For now, simpler approach: For the visible requests, check if I have an offer.
       // We can iterate and run parallel checks or use a collectionGroup query for my offers?
       // CollectionGroup "offers" where companyId == myId would give ALL my offers. We can map them.
       // It's efficient enough if not too many offers total.

       // Better: loop visible ID's and check. Ideally we'd have a 'participants' array on the request but we have subcollections.
       // Let's stick to per-request check or read all my recent offers.
       const newMap = { ...hasMineMap };
       
       // Optimization: CollectionGroup Query for my offers created recently?
       // Let's just do parallel checks for the current page items for simplicity.
       await Promise.all(requests.map(async (r) => {
          // If we already know we have it, skip
          if (newMap[r.id]) return;

          // Check offers subcollection
          const q = query(collection(db, "requests", r.id, "offers"), where("companyId", "==", companyId));
          const snap = await getDocs(q);
          if (!snap.empty) {
             newMap[r.id] = snap.docs[0].id; // Store Offer ID
          } else {
             // Also check legacy payments
             const paymentRef = doc(db, `companies/${companyId}/payments/${r.id}`);
             const paymentSnap = await getDoc(paymentRef);
             if (paymentSnap.exists() && paymentSnap.data()?.status === "completed") {
                newMap[r.id] = true;
             } else {
                newMap[r.id] = false;
             }
          }
       }));

       setHasMineMap(newMap);
     } catch (e) {
       console.error("Error checking offers", e);
     }
  };

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
          const isVisible =
            !req.status ||
            req.status === "active" ||
            req.status === "accepted" ||
            req.status === "pending";
          const notArchived = !req.archived;
          return isVisible && notArchived;
        });

      setExtra((prev) => {
        const seen = new Set(prev.map((p) => p.id).concat(firstPage.map((p) => p.id)));
        const newItems = list.filter((x) => !seen.has(x.id));
        return [...prev, ...newItems];
      });
      
      if (company?.uid && list.length > 0) {
         checkMyOffers(list, company.uid);
      }

      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.size === PAGE_SIZE);
    } catch (error) {
      console.warn("Error loading more requests:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, firstPage, company?.uid]);

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

  // --- Handling Offer Submission ---
  const handleOfferSubmit = async (price: number, message: string) => {
     if (!activeOfferRequest || !company?.uid) return;
     
     setSubmittingOffer(true);
     try {
       const cost = calculateRequestCost(activeOfferRequest);
       
       await runTransaction(db, async (transaction) => {
         const companyRef = doc(db, "companies", company.uid);
         const companyDoc = await transaction.get(companyRef);
 
         if (!companyDoc.exists()) throw "Profilul companiei nu a fost găsit.";
 
         const companyData = companyDoc.data();
         if (companyData.verificationStatus !== 'verified') {
           throw "Contul tău trebuie să fie verificat (KYC) pentru a trimite oferte.";
         }
 
         const currentCredits = companyData.credits || 0;
         if (currentCredits < cost) {
           throw `Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${currentCredits}.`;
         }
 
         // Deduct
         transaction.update(companyRef, { credits: currentCredits - cost });
 
         // Create Offer
         const offerRef = doc(collection(db, "requests", activeOfferRequest.id, "offers"));
         const newOfferId = offerRef.id;
        
         transaction.set(offerRef, {
           requestId: activeOfferRequest.id,
           requestCode: (activeOfferRequest as any).requestCode || activeOfferRequest.id,
           companyId: company.uid,
           companyName: company.displayName || "Companie",
           price: price,
           message: message,
           status: "pending",
           createdAt: serverTimestamp(),
           costPaid: cost
         });
 
         // Record Transaction
         const txRef = doc(collection(db, "companies", company.uid, "transactions"));
         transaction.set(txRef, {
           type: "offer_placement",
           amount: -cost,
           requestId: activeOfferRequest.id,
           description: `Ofertă pentru cererea ${(activeOfferRequest as any).requestCode || activeOfferRequest.id}`,
           createdAt: serverTimestamp()
         });
         
         return newOfferId;
       });

       // Success
       setHasMineMap(prev => ({ ...prev, [activeOfferRequest.id]: true })); // Optimistic update
       // Refresh actual ID via quick check or just use true for now
       checkMyOffers([activeOfferRequest], company.uid);
       
     } catch (err: any) {
        logger.error("Failed to place offer", err);
        alert(err.toString() || "Eroare la trimiterea ofertei");
     } finally {
        setSubmittingOffer(false);
        // Modal closes automatically via onConfirm unless we want to keep it open?
        // OfferModal doesn't have controlled open state exposed but we used onClose in it. 
        // We passed onClose to Modal, which calls setActiveOfferRequest(null).
     }
  };

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-600 sm:text-sm">
          Total cereri: <span className="font-semibold">{sortedRequests.length}</span>
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full rounded-lg border px-3 py-1.5 text-xs sm:w-auto sm:py-2 sm:text-sm"
        >
          <option value="date-desc">Cele mai noi</option>
          <option value="date-asc">Cele mai vechi</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      ) : sortedRequests.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-slate-400"
        >
          Momentan nu există cereri noi.
        </motion.p>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {sortedRequests.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                 <JobCard 
                   request={r}
                   company={company}
                   hasMine={hasMineMap[r.id] ?? false}
                   onOfferClick={(req) => setActiveOfferRequest(req)}
                   onChatClick={(reqId, offerId) => {
                     // TODO: Implement chat handling
                     console.log("Chat clicked", reqId, offerId);
                     // If there's a parent handler, call it?
                     // Currently checking parent usage. 
                     // Dashboard passes nothing for onChat. We can ignore or implement navigation.
                     if (window) window.location.href = `/company/chat?request=${reqId}&offer=${offerId}`;
                   }}
                 />
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

      {/* Offer Modal */}
      <OfferModal 
        isOpen={!!activeOfferRequest}
        onClose={() => setActiveOfferRequest(null)}
        onConfirm={handleOfferSubmit}
        title={activeOfferRequest ? `Ofertă pentru ${(activeOfferRequest as any).requestCode || "Cerere"}` : "Trimite Ofertă"}
        isLoading={submittingOffer}
      />
    </div>
  );
}
