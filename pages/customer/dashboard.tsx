import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { logger } from "@/utils/logger";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  InboxIcon,
  CheckCircleIcon,
  ChatBubbleBottomCenterTextIcon as MessageSquare,
  ClockIcon,
  CalendarIcon,
  TruckIcon,
  XMarkIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { MovingRequest, Offer } from "@/types";
import { formatDateRO, formatMoveDateDisplay } from "@/utils/date";

import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/services/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthChange } from "@/utils/firebaseHelpers";

// Lazy load heavy components
const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />,
  ssr: false,
});

const RequestFullDetails = dynamic(() => import("@/components/customer/RequestFullDetails"), {
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-gray-50" />,
  ssr: false,
});

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [offersByRequest, setOffersByRequest] = useState<Record<string, Offer[]>>({});
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [chatOffer, setChatOffer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Helper: check if a request has an accepted offer
  const hasAcceptedOffer = (requestId: string) => {
    return (offersByRequest[requestId] || []).some(o => o?.status === "accepted");
  };

  // Stats for header
  const stats = useMemo(() => {
    const totalOffers = Object.values(offersByRequest).flat().filter(o => o && o.id).length;
    const pendingOffers = Object.values(offersByRequest).flat().filter(o => o?.status === "pending").length;
    const acceptedOffers = Object.values(offersByRequest).flat().filter(o => o?.status === "accepted").length;
    
    return [
      { label: "Cereri Active", value: requests.length },
      { label: "Oferte Primite", value: totalOffers },
      { label: "În Așteptare", value: pendingOffers },
      { label: "Acceptate", value: acceptedOffers, changeType: "positive" as const },
    ];
  }, [requests, offersByRequest]);

  // Auth & data loading
  useEffect(() => {
    const unsubAuth = onAuthChange(async (u: any) => {
      setUser(u);
      if (!u) {
        setRequests([]);
        setOffersByRequest({});
        return;
      }

      // Ensure customer profile exists
      const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
      const customerRef = doc(db, "customers", u.uid);
      const customerSnap = await getDoc(customerRef);
      
      if (!customerSnap.exists()) {
        try {
          await setDoc(customerRef, {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName || null,
            photoURL: u.photoURL || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          logger.info("Created customer profile for", u.uid);
        } catch (err) {
          logger.error("Failed to create customer profile", err);
        }
      }

      const q = query(
        collection(db, "requests"),
        where("customerId", "==", u.uid),
        where("status", "in", ["active", "paused", "closed"]),
        orderBy("createdAt", "desc")
      );

      const unsubRequests = onSnapshot(q, (snap) => {
        const reqs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MovingRequest));
        setRequests(reqs);

        // Subscribe to offers for each request
        reqs.forEach((req) => {
          const offersQ = query(
            collection(db, "requests", req.id, "offers"),
            orderBy("createdAt", "desc")
          );
          onSnapshot(offersQ, (offersSnap) => {
            const offers = offersSnap.docs.map((od) => ({ id: od.id, ...od.data() } as Offer));
            setOffersByRequest((prev) => ({ ...prev, [req.id]: offers }));
          }, (err) => {
            logger.error("Error loading offers for request", req.id, err);
          });
        });
      }, (err) => {
        logger.error("Error loading requests", err);
        // Clear requests on error to show empty state
        setRequests([]);
      });

      return () => unsubRequests();
    });

    return () => unsubAuth();
  }, []);

  // Select first request with offers by default
  useEffect(() => {
    if (requests.length === 0) {
      setSelectedRequestId(null);
      return;
    }
    const withOffers = requests.find((r) => (offersByRequest[r.id] || []).length > 0)?.id;
    setSelectedRequestId((prev) => prev || withOffers || requests[0].id);
  }, [requests, offersByRequest]);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);
  const selectedOffers = selectedRequestId ? (offersByRequest[selectedRequestId] || []) : [];

  // Accept/Decline handlers
  const handleAccept = async (requestId: string, offerId: string): Promise<void> => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, offerId }),
      });

      if (!resp.ok && resp.status === 503) {
        // Fallback for dev
        const { writeBatch, doc } = await import("firebase/firestore");
        const batch = writeBatch(db);
        batch.update(doc(db, "requests", requestId, "offers", offerId), { status: "accepted" });
        const others = (offersByRequest[requestId] || []).filter((o) => o.id !== offerId);
        for (const o of others) {
          batch.update(doc(db, "requests", requestId, "offers", o.id), { status: "declined" });
        }
        batch.update(doc(db, "requests", requestId), { status: "closed" });
        await batch.commit();
      } else if (!resp.ok) {
        throw new Error("Failed");
      }
      
      toast.success("Oferta a fost acceptată!");
    } catch (err) {
      logger.error("Failed to accept", err);
      toast.error("Eroare la acceptare");
    }
  };

  const handleDecline = async (requestId: string, offerId: string): Promise<void> => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, offerId }),
      });

      if (!resp.ok && resp.status === 503) {
        const { doc, updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, "requests", requestId, "offers", offerId), { status: "declined" });
      } else if (!resp.ok) {
        throw new Error("Failed");
      }
      
      toast.success("Oferta a fost refuzată");
    } catch (err) {
      logger.error("Failed to decline", err);
      toast.error("Eroare la refuzare");
    }
  };

  // Reactivate a closed request
  const handleReactivate = async (requestId: string): Promise<void> => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      
      const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore");
      await updateDoc(doc(db, "requests", requestId), { 
        status: "active",
        updatedAt: serverTimestamp()
      });
      
      toast.success("Cererea a fost reactivată!");
    } catch (err) {
      logger.error("Failed to reactivate request", err);
      toast.error("Eroare la reactivare");
    }
  };

  const navigation = [
    { name: "Cererile Mele", href: "/customer/dashboard", icon: InboxIcon, badge: requests.length },
  ];

  return (
    <RequireRole allowedRole="customer">
      <DashboardLayout 
        role="customer" 
        user={user} 
        navigation={navigation}
        showStats={true}
        stats={stats}
      >
        {requests.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
              <InboxIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">Nu ai încă cereri</h3>
            <p className="mt-2 max-w-sm text-gray-500">
              Creează o cerere de pe pagina principală pentru a primi oferte de la firme de mutări verificate.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/40"
            >
              Creează cerere
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          // Main content grid
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Requests sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900">Cererile tale</h3>
                </div>
                <nav className="max-h-[calc(100vh-280px)] overflow-y-auto p-2">
                  <ul className="space-y-1">
                    {requests.map((req) => {
                      const offers = offersByRequest[req.id] || [];
                      const isSelected = selectedRequestId === req.id;
                      const hasNewOffers = offers.some(o => o.status === "pending");

                      return (
                        <li key={req.id}>
                          <button
                            onClick={() => setSelectedRequestId(req.id)}
                            className={`w-full rounded-lg p-3 text-left transition-all ${
                              isSelected
                                ? "bg-emerald-50 ring-1 ring-emerald-200"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm font-semibold ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                                  {req.fromCity} → {req.toCity}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                  <CalendarIcon className="h-3.5 w-3.5" />
                                  <span>{formatMoveDateDisplay(req as any, { month: "short" }) || "Flexibil"}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {offers.length > 0 && (
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                    hasNewOffers 
                                      ? "bg-emerald-100 text-emerald-700" 
                                      : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {offers.length} {offers.length === 1 ? "ofertă" : "oferte"}
                                  </span>
                                )}
                                <span className={`text-[10px] uppercase tracking-wide ${
                                  req.status === "closed" ? "text-emerald-600" :
                                  req.status === "active" ? "text-blue-600" : "text-gray-500"
                                }`}>
                                  {req.status === "closed" ? "Finalizată" : 
                                   req.status === "active" ? "Activă" : 
                                   req.status === "paused" ? "Pauză" :
                                   req.status === "cancelled" ? "Anulată" : req.status}
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-8 xl:col-span-9">
              {selectedRequest ? (
                <div className="space-y-6">
                  {/* Request summary card */}
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20">
                            <TruckIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">
                              {selectedRequest.fromCity} → {selectedRequest.toCity}
                            </h2>
                            <p className="text-sm text-gray-500">
                              {selectedRequest.requestCode || `#${selectedRequest.id.slice(0, 8)}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                          hasAcceptedOffer(selectedRequest.id) 
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedRequest.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {hasAcceptedOffer(selectedRequest.id) && <CheckCircleSolid className="h-4 w-4" />}
                          {selectedRequest.status === "active" && !hasAcceptedOffer(selectedRequest.id) && <ClockIcon className="h-4 w-4" />}
                          {hasAcceptedOffer(selectedRequest.id) ? "Ofertă Acceptată" : 
                           selectedRequest.status === "active" ? "În Așteptare" : 
                           selectedRequest.status === "closed" ? "Finalizată" :
                           selectedRequest.status === "paused" ? "Pauză" : 
                           selectedRequest.status === "cancelled" ? "Anulată" : selectedRequest.status}
                        </span>
                        
                        {/* Reactivate button for closed requests */}
                        {selectedRequest.status === "closed" && (
                          <button
                            onClick={() => handleReactivate(selectedRequest.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reactivează
                          </button>
                        )}
                        
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          {showDetails ? "Ascunde detalii" : "Vezi detalii"}
                        </button>
                      </div>
                    </div>

                    {/* Quick info */}
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">De la</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {selectedRequest.fromCity}, {selectedRequest.fromCounty}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">La</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {selectedRequest.toCity}, {selectedRequest.toCounty}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">Data</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {formatMoveDateDisplay(selectedRequest as any, { month: "short" }) || "Flexibil"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-medium text-gray-500">Camere</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {selectedRequest.fromRooms || "-"} → {selectedRequest.toRooms || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <RequestFullDetails request={selectedRequest} isOwner={true} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Offers section */}
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Oferte primite 
                        {selectedOffers.length > 0 && (
                          <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-bold text-emerald-700">
                            {selectedOffers.length}
                          </span>
                        )}
                      </h3>
                    </div>

                    {selectedOffers.length === 0 ? (
                      <div className="p-8 text-center">
                        <ClockIcon className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-900">Încă nu ai oferte</p>
                        <p className="mt-1 text-sm text-gray-500">
                          Firmele verificate îți vor trimite oferte în curând.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {selectedOffers.map((offer, idx) => (
                          <OfferCard
                            key={offer.id}
                            offer={offer}
                            requestId={selectedRequestId!}
                            index={idx}
                            onAccept={handleAccept}
                            onDecline={handleDecline}
                            onChat={() => setChatOffer(offer)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white">
                  <p className="text-gray-500">Selectează o cerere din listă</p>
                </div>
              )}
            </main>
          </div>
        )}

        {/* Chat Modal */}
        <AnimatePresence>
          {chatOffer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative h-[600px] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              >
                <button
                  onClick={() => setChatOffer(null)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <ChatWindow
                  requestId={selectedRequestId!}
                  offerId={chatOffer.id}
                  otherPartyName={chatOffer.companyName || "Companie"}
                  currentUserRole="customer"
                  onClose={() => setChatOffer(null)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </RequireRole>
  );
}

// Offer card component
function OfferCard({
  offer,
  requestId,
  index,
  onAccept,
  onDecline,
  onChat,
}: {
  offer: Offer;
  requestId: string;
  index: number;
  onAccept: (reqId: string, offerId: string) => Promise<void>;
  onDecline: (reqId: string, offerId: string) => Promise<void>;
  onChat: () => void;
}) {
  const isAccepted = offer.status === "accepted";
  const isDeclined = offer.status === "declined";
  const isPending = offer.status === "pending" || !offer.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-6 ${isDeclined ? "bg-gray-50 opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Company info */}
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white shadow-lg ${
            isAccepted 
              ? "bg-linear-to-br from-emerald-500 to-green-500 shadow-emerald-500/30"
              : "bg-linear-to-br from-blue-500 to-indigo-500 shadow-blue-500/30"
          }`}>
            {offer.companyName?.charAt(0)?.toUpperCase() || "F"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-gray-900">{offer.companyName}</p>
              {isAccepted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <CheckCircleSolid className="h-3 w-3" />
                  Acceptată
                </span>
              )}
            </div>
            {offer.createdAt?.toDate?.() && (
              <p className="text-sm text-gray-500">
                Primită pe {formatDateRO(offer.createdAt, { month: "short" })}
              </p>
            )}
            {offer.message && (
              <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{offer.message}</p>
            )}
          </div>
        </div>

        {/* Price and actions */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Preț ofertat</p>
            <p className={`text-3xl font-bold ${isAccepted ? "text-emerald-600" : "text-gray-900"}`}>
              {offer.price} <span className="text-base font-medium text-gray-500">lei</span>
            </p>
          </div>

          {isPending && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onAccept(requestId, offer.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Acceptă
              </button>
              <button
                onClick={() => onDecline(requestId, offer.id)}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Refuză
              </button>
              <button
                onClick={onChat}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </button>
            </div>
          )}

          {isAccepted && (
            <button
              onClick={onChat}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <MessageSquare className="h-4 w-4" />
              Contactează
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

