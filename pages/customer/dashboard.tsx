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
  DocumentTextIcon,
  GiftIcon,
  PhoneIcon,
  EnvelopeIcon,
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

  // Stats for header - with icons and colors
  const stats = useMemo(() => {
    const totalOffers = Object.values(offersByRequest).flat().filter(o => o && o.id).length;
    const pendingOffers = Object.values(offersByRequest).flat().filter(o => o?.status === "pending").length;
    const acceptedOffers = Object.values(offersByRequest).flat().filter(o => o?.status === "accepted").length;
    
    return [
      { 
        label: "Cereri Active", 
        value: requests.length,
        icon: DocumentTextIcon,
        color: "blue",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      { 
        label: "Oferte Primite", 
        value: totalOffers,
        icon: GiftIcon,
        color: "purple",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      { 
        label: "În Așteptare", 
        value: pendingOffers,
        icon: ClockIcon,
        color: "amber",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      { 
        label: "Acceptate", 
        value: acceptedOffers, 
        changeType: "positive" as const,
        icon: CheckCircleIcon,
        color: "emerald",
        bgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
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
        showStats={false}
      >
        {/* Custom Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl ${stat.bgColor} p-3`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className={`absolute -bottom-6 -right-6 h-24 w-24 rounded-full ${stat.bgColor} opacity-50 transition-transform group-hover:scale-110`} />
              </div>
            );
          })}
        </div>

        {requests.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
              <InboxIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">Nu ai încă cereri</h3>
            <p className="mt-2 max-w-sm text-gray-500">
              Creează o cerere de pe pagina principală pentru a primi oferte de la firme de mutări verificate.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/40"
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
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4">
                  <h3 className="text-sm font-bold text-gray-900">Cererile tale</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{requests.length} {requests.length === 1 ? "cerere" : "cereri"}</p>
                </div>
                <nav className="max-h-[calc(100vh-320px)] overflow-y-auto p-3">
                  <ul className="space-y-2">
                    {requests.map((req) => {
                      const offers = offersByRequest[req.id] || [];
                      const isSelected = selectedRequestId === req.id;
                      const hasNewOffers = offers.some(o => o.status === "pending");
                      const hasAccepted = offers.some(o => o.status === "accepted");

                      return (
                        <li key={req.id}>
                          <button
                            onClick={() => setSelectedRequestId(req.id)}
                            className={`group relative w-full rounded-xl p-4 text-left transition-all ${
                              isSelected
                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm ring-1 ring-emerald-200"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {/* Status indicator line */}
                            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full transition-all ${
                              isSelected ? "bg-emerald-500" : 
                              hasAccepted ? "bg-emerald-400" :
                              hasNewOffers ? "bg-blue-400" : "bg-gray-200"
                            }`} />
                            
                            <div className="ml-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className={`truncate font-semibold ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>
                                    {req.fromCity} → {req.toCity}
                                  </p>
                                  <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    <span>{formatMoveDateDisplay(req as any, { month: "short" }) || "Flexibil"}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 flex items-center justify-between">
                                {offers.length > 0 ? (
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    hasAccepted 
                                      ? "bg-emerald-100 text-emerald-700" 
                                      : hasNewOffers 
                                        ? "bg-blue-100 text-blue-700" 
                                        : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {hasAccepted && <CheckCircleSolid className="h-3 w-3" />}
                                    {offers.length} {offers.length === 1 ? "ofertă" : "oferte"}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">Fără oferte</span>
                                )}
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  req.status === "closed" ? "bg-emerald-100 text-emerald-700" :
                                  req.status === "active" ? "bg-blue-100 text-blue-700" : 
                                  "bg-gray-100 text-gray-500"
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
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Header with gradient */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
                      <div className="relative flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <TruckIcon className="h-7 w-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">
                              {selectedRequest.fromCity} → {selectedRequest.toCity}
                            </h2>
                            <p className="mt-0.5 text-sm text-white/80">
                              {selectedRequest.requestCode || `#${selectedRequest.id.slice(0, 8)}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur-sm ${
                            hasAcceptedOffer(selectedRequest.id) 
                              ? "bg-white text-emerald-700"
                              : selectedRequest.status === "active"
                              ? "bg-white/20 text-white"
                              : "bg-white/20 text-white"
                          }`}>
                            {hasAcceptedOffer(selectedRequest.id) && <CheckCircleSolid className="h-4 w-4" />}
                            {selectedRequest.status === "active" && !hasAcceptedOffer(selectedRequest.id) && <ClockIcon className="h-4 w-4" />}
                            {hasAcceptedOffer(selectedRequest.id) ? "Ofertă Acceptată" : 
                             selectedRequest.status === "active" ? "În Așteptare" : 
                             selectedRequest.status === "closed" ? "Finalizată" :
                             selectedRequest.status === "paused" ? "Pauză" : 
                             selectedRequest.status === "cancelled" ? "Anulată" : selectedRequest.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Quick info */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">De la</p>
                          <p className="mt-1.5 font-bold text-gray-900">
                            {selectedRequest.fromCity}
                          </p>
                          <p className="text-sm text-gray-500">{selectedRequest.fromCounty}</p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">La</p>
                          <p className="mt-1.5 font-bold text-gray-900">
                            {selectedRequest.toCity}
                          </p>
                          <p className="text-sm text-gray-500">{selectedRequest.toCounty}</p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Data</p>
                          <p className="mt-1.5 font-bold text-gray-900">
                            {formatMoveDateDisplay(selectedRequest as any, { month: "short" }) || "Flexibil"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Camere</p>
                          <p className="mt-1.5 font-bold text-gray-900">
                            {selectedRequest.fromRooms || "-"} → {selectedRequest.toRooms || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        {selectedRequest.status === "closed" && (
                          <button
                            onClick={() => handleReactivate(selectedRequest.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reactivează cererea
                          </button>
                        )}
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                          {showDetails ? "Ascunde detalii" : "Vezi toate detaliile"}
                          <ChevronRightIcon className={`h-4 w-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
                        </button>
                      </div>

                      {/* Expandable details */}
                      <AnimatePresence>
                        {showDetails && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-5 overflow-hidden"
                          >
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                              <RequestFullDetails request={selectedRequest} isOwner={true} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Offers section */}
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                          <GiftIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Oferte primite</h3>
                          <p className="text-sm text-gray-500">
                            {selectedOffers.length === 0 
                              ? "Încă nu ai primit oferte"
                              : `${selectedOffers.length} ${selectedOffers.length === 1 ? "ofertă" : "oferte"} de la firme verificate`
                            }
                          </p>
                        </div>
                      </div>
                      {selectedOffers.length > 0 && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
                          {selectedOffers.length}
                        </span>
                      )}
                    </div>

                    {selectedOffers.length === 0 ? (
                      <div className="p-10 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                          <ClockIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="mt-4 font-semibold text-gray-900">Încă nu ai oferte</p>
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
                <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 font-medium text-gray-500">Selectează o cerere din listă</p>
                  </div>
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
      className={`relative p-6 transition-colors ${
        isDeclined ? "bg-gray-50/50" : 
        isAccepted ? "bg-emerald-50/30" : "hover:bg-gray-50/50"
      }`}
    >
      {/* Accepted indicator */}
      {isAccepted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
      )}
      
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Company info */}
        <div className="flex items-start gap-4">
          {/* Logo column with contact info */}
          <div className="flex flex-col items-center gap-2">
            <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-lg ${
              isAccepted 
                ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-emerald-500/30"
                : isDeclined
                  ? "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/30"
                  : "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/30"
            }`}>
              {offer.companyName?.charAt(0)?.toUpperCase() || "F"}
              {isAccepted && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                  <CheckCircleSolid className="h-5 w-5 text-emerald-500" />
                </div>
              )}
            </div>
            {/* Contact buttons under logo */}
            {(isAccepted || isPending) && (offer.companyPhone || offer.companyEmail) && (
              <div className="flex items-center gap-1">
                {offer.companyPhone && (
                  <a
                    href={`tel:${offer.companyPhone}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                    title={offer.companyPhone}
                  >
                    <PhoneIcon className="h-4 w-4" />
                  </a>
                )}
                {offer.companyEmail && (
                  <a
                    href={`mailto:${offer.companyEmail}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                    title={offer.companyEmail}
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className={`text-lg font-bold ${isDeclined ? "text-gray-500" : "text-gray-900"}`}>
                {offer.companyName}
              </p>
              {isAccepted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Acceptată
                </span>
              )}
              {isDeclined && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                  Refuzată
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {offer.createdAt?.toDate?.() 
                ? `Primită pe ${formatDateRO(offer.createdAt, { month: "short" })}`
                : "Ofertă nouă"
              }
            </p>
            {offer.message && (
              <div className="mt-3 rounded-xl bg-gray-100/80 p-4">
                <p className={`text-sm leading-relaxed ${isDeclined ? "text-gray-500" : "text-gray-700"}`}>
                  &ldquo;{offer.message}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price and actions */}
        <div className="flex flex-col items-end gap-4 sm:min-w-[180px]">
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Preț ofertat</p>
            <p className={`mt-1 text-4xl font-bold ${
              isAccepted ? "text-emerald-600" : 
              isDeclined ? "text-gray-400" : "text-gray-900"
            }`}>
              {offer.price}
              <span className="ml-1 text-lg font-medium text-gray-400">lei</span>
            </p>
          </div>

          {isPending && (
            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={() => onAccept(requestId, offer.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-700 hover:shadow-emerald-500/30"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Acceptă
              </button>
              <button
                onClick={() => onDecline(requestId, offer.id)}
                className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:border-gray-300"
              >
                Refuză
              </button>
              <button
                onClick={onChat}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </button>
            </div>
          )}

          {isAccepted && (
            <button
              onClick={onChat}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <MessageSquare className="h-4 w-4" />
              Contactează firma
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


