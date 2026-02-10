import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { logger } from "@/utils/logger";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerWelcome from "@/components/customer/CustomerWelcome";
import CustomerNotificationBell from "@/components/customer/CustomerNotificationBell";
import SearchInput from "@/components/ui/SearchInput";
import {
  InboxIcon,
  CheckCircleIcon,
  ChatBubbleBottomCenterTextIcon as MessageSquare,
  ClockIcon,
  CalendarIcon,
  TruckIcon,
  XMarkIcon,
  ChevronRightIcon,
  GiftIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentPlusIcon,
  ArrowRightIcon,
  StarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import type { User } from "firebase/auth";
import { MovingRequest, Offer } from "@/types";
import { formatDateRO } from "@/utils/date";

import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { useUnreadMessages, countUnreadForRequest } from "@/hooks/useUnreadMessages";

// Lazy load heavy components
const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl" />,
  ssr: false,
});

const RequestFullDetails = dynamic(
  () => import("@/components/customer/RequestFullDetails"),
  {
    loading: () => <div className="h-48 animate-pulse rounded-xl bg-gray-50" />,
    ssr: false,
  },
);

// Status label mapping
const STATUS_LABELS: Record<string, string> = {
  active: "Activă",
  closed: "Finalizată",
  accepted: "Acceptată",
  paused: "Pauză",
  cancelled: "Anulată",
};
const getStatusLabel = (status?: string) => STATUS_LABELS[status || ""] || status || "Activă";

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [offersByRequest, setOffersByRequest] = useState<
    Record<string, Offer[]>
  >({});
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [chatOffer, setChatOffer] = useState<Offer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const offerUnsubsRef = useRef<Array<() => void>>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "accepted" | "closed">("all");

  // Helper: check if a request has an accepted offer
  const hasAcceptedOffer = (requestId: string) => {
    return (offersByRequest[requestId] || []).some(
      (o) => o?.status === "accepted",
    );
  };

  // Auth & data loading
  useEffect(() => {
    const unsubAuth = onAuthChange(async (u: User | null) => {
      setUser(u);
      if (!u) {
        setRequests([]);
        setOffersByRequest({});
        return;
      }

      // Ensure customer profile exists
      const { doc, getDoc, setDoc, serverTimestamp } =
        await import("firebase/firestore");
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
        where("status", "in", ["active", "paused", "closed", "accepted"]),
        orderBy("createdAt", "desc"),
      );

      const unsubRequests = onSnapshot(
        q,
        (snap) => {
          const reqs = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as MovingRequest,
          );
          setRequests(reqs);

          // Clean up previous offer subscriptions
          offerUnsubsRef.current.forEach(unsub => unsub());
          offerUnsubsRef.current = [];

          // Subscribe to offers for each request
          reqs.forEach((req) => {
            const offersQ = query(
              collection(db, "requests", req.id, "offers"),
              orderBy("createdAt", "desc"),
            );
            const unsubOffers = onSnapshot(
              offersQ,
              (offersSnap) => {
                const offers = offersSnap.docs.map(
                  (od) => ({ id: od.id, ...od.data() }) as Offer,
                );
                setOffersByRequest((prev) => ({ ...prev, [req.id]: offers }));
              },
              (err) => {
                logger.error("Error loading offers for request", req.id, err);
              },
            );
            offerUnsubsRef.current.push(unsubOffers);
          });
        },
        (err) => {
          logger.error("Error loading requests", err);
          // Clear requests on error to show empty state
          setRequests([]);
        },
      );

      return () => {
        unsubRequests();
        offerUnsubsRef.current.forEach(unsub => unsub());
        offerUnsubsRef.current = [];
      };
    });

    return () => unsubAuth();
  }, []);

  // Select request from URL query parameter or first request with offers
  useEffect(() => {
    if (requests.length === 0) {
      setSelectedRequestId(null);
      return;
    }

    // Check for requestId in URL query
    const queryRequestId = router.query.requestId as string;
    const openChatOfferId = router.query.openChat as string;
    if (queryRequestId) {
      const requestFromQuery = requests.find((r) => r.id === queryRequestId);
      if (requestFromQuery) {
        setSelectedRequestId(queryRequestId);
        // Auto-open chat if offerId provided
        if (openChatOfferId) {
          const offers = offersByRequest[queryRequestId] || [];
          const targetOffer = offers.find((o) => o.id === openChatOfferId);
          if (targetOffer) {
            handleOpenChat(targetOffer);
          }
        }
        // Clear the query parameter from URL without refresh
        router.replace("/customer/dashboard", undefined, { shallow: true });
        return;
      }
    }

    const withOffers = requests.find(
      (r) => (offersByRequest[r.id] || []).length > 0,
    )?.id;
    setSelectedRequestId((prev) => prev || withOffers || requests[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, offersByRequest, router.query.requestId]);

  // Filtered requests
  const filteredRequests = requests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || req.fromCity?.toLowerCase().includes(q) || req.toCity?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);
  const selectedOffers = selectedRequestId
    ? offersByRequest[selectedRequestId] || []
    : [];

  // Track unread chat messages
  const requestIdsList = requests.map((r) => r.id);
  const { unreadOffers, markRead } = useUnreadMessages(
    requestIdsList,
    offersByRequest,
    "customer",
  );

  // When user opens a chat, mark that offer as read
  const handleOpenChat = (offer: Offer) => {
    markRead(offer.id);
    setChatOffer(offer);
  };

  // Total unread across all requests
  const totalUnreadChats = unreadOffers.size;

  // Accept/Decline handlers
  const handleAccept = async (
    requestId: string,
    offerId: string,
  ): Promise<void> => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }

      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId }),
      });

      if (!resp.ok && resp.status === 503) {
        toast.error("Serviciul este temporar indisponibil. Încearcă din nou.");
        return;
      } else if (!resp.ok) {
        throw new Error("Failed");
      }

      toast.success("Oferta a fost acceptată!");
    } catch (err) {
      logger.error("Failed to accept", err);
      toast.error("Eroare la acceptare");
    }
  };

  const handleDecline = async (
    requestId: string,
    offerId: string,
  ): Promise<void> => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }

      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId }),
      });

      if (!resp.ok && resp.status === 503) {
        toast.error("Serviciul este temporar indisponibil. Încearcă din nou.");
        return;
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

      const { doc, updateDoc, serverTimestamp } =
        await import("firebase/firestore");
      await updateDoc(doc(db, "requests", requestId), {
        status: "active",
        updatedAt: serverTimestamp(),
      });

      toast.success("Cererea a fost reactivată!");
    } catch (err) {
      logger.error("Failed to reactivate request", err);
      toast.error("Eroare la reactivare");
    }
  };

  const navigation = [
    {
      name: "Cererile Mele",
      href: "/customer/dashboard",
      icon: DocumentTextIcon,
      badge: requests.length,
    },
    {
      name: "Cerere Nouă",
      href: "/customer/cerere-noua",
      icon: DocumentPlusIcon,
    },
    {
      name: "Setări",
      href: "/customer/settings",
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <RequireRole allowedRole="customer">
      <DashboardLayout
        role="customer"
        user={user ? { displayName: user.displayName || undefined, email: user.email || undefined, photoURL: user.photoURL || undefined } : undefined}
        navigation={navigation}
        showStats={false}
        headerActions={
          user?.uid ? (
            <CustomerNotificationBell
              customerId={user.uid}
              unreadChats={totalUnreadChats}
            />
          ) : null
        }
      >
        {requests.length === 0 ? (
          // Welcome state for new users
          <div className="space-y-6">
            <CustomerWelcome userName={user?.displayName} />
            
            {/* Empty state card */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl shadow-emerald-500/30">
                <InboxIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Nu ai încă cereri
              </h3>
              <p className="mt-2 max-w-sm text-gray-500">
                Creează o cerere pentru a primi oferte de la firme de mutări verificate.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/40"
              >
                <DocumentPlusIcon className="h-5 w-5" />
                Creează prima cerere
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          // Main content grid
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-start">
            {/* Requests sidebar */}
            <aside className="md:col-span-5 lg:col-span-4 xl:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 py-3 sm:px-5 sm:py-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Cererile tale
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {requests.length}{" "}
                      {requests.length === 1 ? "cerere" : "cereri"}
                    </p>
                  </div>
                  <Link
                    href="/customer/cerere-noua"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800"
                  >
                    <DocumentPlusIcon className="h-3.5 w-3.5" />
                    Nouă
                  </Link>
                </div>
                {/* Filter bar */}
                <div className="border-b border-gray-100 px-3 py-2 sm:px-4 sm:py-3 space-y-2">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Caută oraș..."
                    className="[&_input]:w-full [&_input]:sm:w-full"
                  />
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    >
                      <option value="all">Toate statusurile</option>
                      <option value="active">Activă</option>
                      <option value="accepted">Acceptată</option>
                      <option value="closed">Finalizată</option>
                    </select>
                  </div>
                </div>

                <nav className="max-h-[50vh] md:max-h-[calc(100vh-380px)] lg:max-h-[calc(100vh-420px)] overflow-y-auto p-2 sm:p-3">
                  {filteredRequests.length === 0 ? (
                    <div className="py-6 text-center">
                      <FunnelIcon className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">Nicio cerere găsită</p>
                      <button onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="mt-1 text-xs text-emerald-600 hover:underline">Resetează filtrele</button>
                    </div>
                  ) : (
                  <ul className="space-y-2">
                    {filteredRequests.map((req) => {
                      const offers = offersByRequest[req.id] || [];
                      const isSelected = selectedRequestId === req.id;
                      const hasNewOffers = offers.some(
                        (o) => o.status === "pending",
                      );
                      const hasAccepted = offers.some(
                        (o) => o.status === "accepted",
                      );
                      const reqUnreadCount = countUnreadForRequest(
                        req.id,
                        offersByRequest,
                        unreadOffers,
                      );

                      return (
                        <li key={req.id}>
                          <button
                            onClick={() => setSelectedRequestId(req.id)}
                            className={`group relative w-full rounded-xl p-3 sm:p-4 text-left transition-all active:scale-[0.98] ${
                              isSelected
                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm ring-1 ring-emerald-200"
                                : "hover:bg-gray-50 active:bg-gray-100"
                            }`}
                          >
                            {/* Status indicator line */}
                            <div
                              className={`absolute left-0 top-2 bottom-2 sm:top-3 sm:bottom-3 w-1 rounded-full transition-all ${
                                isSelected
                                  ? "bg-emerald-500"
                                  : hasAccepted
                                    ? "bg-emerald-400"
                                    : hasNewOffers
                                      ? "bg-blue-400"
                                      : "bg-gray-200"
                              }`}
                            />

                            <div className="ml-2 sm:ml-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`truncate text-sm sm:text-base font-semibold ${isSelected ? "text-emerald-900" : "text-gray-900"}`}
                                  >
                                    {req.fromCity} → {req.toCity}
                                  </p>
                                  <div className="mt-1 sm:mt-1.5 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
                                    <CalendarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span>
                                      {formatDateRO(req.createdAt, {
                                        month: "short",
                                      }) || "-"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
                                {offers.length > 0 ? (
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold ${
                                        hasAccepted
                                          ? "bg-emerald-100 text-emerald-700"
                                          : hasNewOffers
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {hasAccepted && (
                                        <CheckCircleSolid className="h-3 w-3" />
                                      )}
                                      {offers.length}{" "}
                                      {offers.length === 1 ? "ofertă" : "oferte"}
                                    </span>
                                    {reqUnreadCount > 0 && (
                                      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                                        <MessageSquare className="h-2.5 w-2.5" />
                                        {reqUnreadCount}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[10px] sm:text-xs text-gray-400">
                                    Fără oferte
                                  </span>
                                )}
                                <span
                                  className={`shrink-0 rounded-full px-1.5 py-0.5 sm:px-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                                    req.status === "closed" ||
                                    req.status === "accepted"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : req.status === "active"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {getStatusLabel(req.status)}
                                </span>
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  )}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <main className="md:col-span-7 lg:col-span-8 xl:col-span-9">
              {selectedRequest ? (
                <div className="space-y-4">
                  {/* Offers section */}
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-purple-100">
                          <GiftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900">
                            Oferte primite
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {selectedOffers.length === 0
                              ? "Încă nu ai primit oferte"
                              : `${selectedOffers.length} ${selectedOffers.length === 1 ? "ofertă" : "oferte"} de la firme verificate`}
                          </p>
                        </div>
                      </div>
                      {selectedOffers.length > 0 && (
                        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold text-purple-700">
                          {selectedOffers.length}
                        </span>
                      )}
                    </div>

                    {selectedOffers.length === 0 ? (
                      <div className="p-6 sm:p-10 text-center">
                        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
                          <svg className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400" viewBox="0 0 48 48" fill="none">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" opacity="0.5" />
                            <path d="M16 28l4-4 4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="36" cy="14" r="4" fill="#10b981" opacity="0.6">
                              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                            </circle>
                          </svg>
                        </div>
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-gray-900">
                          Așteptăm oferte pentru tine
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xs mx-auto">
                          Firmele verificate analizează cererea ta. Primești oferte în maxim 24h.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
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
                            onChat={() => handleOpenChat(offer)}
                            hasUnread={unreadOffers.has(offer.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expandable details */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                      >
                        <div className="p-4 sm:p-6">
                          <RequestFullDetails
                            request={selectedRequest}
                            isOwner={true}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Request summary card (route + status) */}
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-emerald-600 px-4 py-2.5 sm:px-6 sm:py-4">
                      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-white/20">
                            <TruckIcon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-base sm:text-xl font-bold text-white truncate">
                              {selectedRequest.fromCity} →{" "}
                              {selectedRequest.toCity}
                            </h2>
                            <p className="mt-0.5 text-xs sm:text-sm text-white/80">
                              {selectedRequest.requestCode ||
                                `#${selectedRequest.id.slice(0, 8)}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/30 active:bg-white/40"
                          >
                            {showDetails
                              ? "Ascunde"
                              : "Detalii"}
                            <ChevronRightIcon
                              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${showDetails ? "rotate-90" : ""}`}
                            />
                          </button>
                          <span
                            className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold ${
                              hasAcceptedOffer(selectedRequest.id)
                                ? "bg-white text-emerald-700"
                                : selectedRequest.status === "active"
                                  ? "bg-white/20 text-white"
                                  : "bg-white/20 text-white"
                            }`}
                          >
                            {hasAcceptedOffer(selectedRequest.id) && (
                              <CheckCircleSolid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            )}
                            {selectedRequest.status === "active" &&
                              !hasAcceptedOffer(selectedRequest.id) && (
                                <ClockIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              )}
                            <span className="hidden sm:inline">
                              {hasAcceptedOffer(selectedRequest.id)
                                ? "Ofertă Acceptată"
                                : selectedRequest.status === "active" && !hasAcceptedOffer(selectedRequest.id)
                                  ? "În Așteptare"
                                  : getStatusLabel(selectedRequest.status)}
                            </span>
                            <span className="sm:hidden">
                              {hasAcceptedOffer(selectedRequest.id)
                                ? "Acceptată"
                                : selectedRequest.status === "active" && !hasAcceptedOffer(selectedRequest.id)
                                  ? "Așteptare"
                                  : getStatusLabel(selectedRequest.status)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for closed requests */}
                    {selectedRequest.status === "closed" && (
                      <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-50/50 to-white">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => handleReactivate(selectedRequest.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            Reactivează cererea
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 font-medium text-gray-500">
                      Selectează o cerere din listă
                    </p>
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
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative h-[100dvh] sm:h-[600px] md:h-[75vh] w-full sm:max-w-lg md:max-w-2xl overflow-hidden rounded-none sm:rounded-2xl bg-white shadow-2xl"
              >
                <button
                  onClick={() => setChatOffer(null)}
                  className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 active:bg-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <ChatWindow
                  requestId={selectedRequestId!}
                  offerId={chatOffer.id}
                  otherPartyName={chatOffer.companyName || "Companie"}
                  currentUserRole="customer"
                  onClose={() => setChatOffer(null)}
                  offerMessage={chatOffer.message}
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
const CONTACT_STYLES = {
  pending: {
    chat: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5 text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100",
    phone: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-emerald-200 bg-white p-2 sm:p-2.5 text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 active:bg-emerald-100",
    email: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-blue-200 bg-white p-2 sm:p-2.5 text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100",
  },
  accepted: {
    chat: "inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-emerald-600 p-2 sm:p-2.5 text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800",
    phone: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-emerald-200 bg-emerald-50 p-2 sm:p-2.5 text-emerald-700 transition hover:bg-emerald-100 active:bg-emerald-200",
    email: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-blue-200 bg-blue-50 p-2 sm:p-2.5 text-blue-700 transition hover:bg-blue-100 active:bg-blue-200",
  },
  declined: {
    chat: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100",
    phone: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5 text-gray-500 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100",
    email: "inline-flex items-center justify-center rounded-lg sm:rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100",
  },
} as const;

function ContactButtons({ offer, onChat, variant, hasUnread }: { offer: Offer; onChat: () => void; variant: keyof typeof CONTACT_STYLES; hasUnread?: boolean }) {
  const styles = CONTACT_STYLES[variant];
  return (
    <>
      <button onClick={onChat} className={`${styles.chat} relative`} title="Chat">
        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
        )}
      </button>
      {offer.companyPhone && (
        <a href={`tel:${offer.companyPhone}`} className={styles.phone} title={offer.companyPhone}>
          <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </a>
      )}
      {offer.companyEmail && (
        <a href={`mailto:${offer.companyEmail}`} className={styles.email} title={offer.companyEmail}>
          <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </a>
      )}
    </>
  );
}

function OfferCard({
  offer,
  requestId,
  index,
  onAccept,
  onDecline,
  onChat,
  hasUnread,
}: {
  offer: Offer;
  requestId: string;
  index: number;
  onAccept: (reqId: string, offerId: string) => Promise<void>;
  onDecline: (reqId: string, offerId: string) => Promise<void>;
  onChat: () => void;
  hasUnread?: boolean;
}) {
  const isAccepted = offer.status === "accepted";
  const isDeclined = offer.status === "declined";
  const isPending = offer.status === "pending" || !offer.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-4 sm:p-6 transition-colors ${
        isDeclined
          ? "bg-gray-50/50"
          : isAccepted
            ? "bg-emerald-50/30"
            : "hover:bg-gray-50/50"
      }`}
    >
      {/* Accepted indicator */}
      {isAccepted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
      )}

      <div className="flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Company info */}
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Logo column with contact info */}
          <div className="flex flex-col items-center gap-2">
            <div
              className={`relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ${
                isAccepted
                  ? "shadow-emerald-500/30 ring-2 ring-emerald-500"
                  : isDeclined
                    ? "shadow-gray-400/30"
                    : "shadow-blue-500/30"
              }`}
            >
              {offer.companyLogo ? (
                <Image
                  src={offer.companyLogo}
                  alt={offer.companyName || "Logo companie"}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="/pics/default-company.svg"
                  alt="Logo companie"
                  width={56}
                  height={56}
                  className={`h-full w-full object-cover ${isDeclined ? "opacity-50 grayscale" : ""}`}
                />
              )}
              {isAccepted && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                  <CheckCircleSolid className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <p
                className={`text-base sm:text-lg font-bold ${isDeclined ? "text-gray-500" : "text-gray-900"}`}
              >
                {offer.companyName}
              </p>
              {isAccepted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-700">
                  Acceptată
                </span>
              )}
              {isDeclined && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-gray-500">
                  Refuzată
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
              {offer.createdAt?.toDate?.()
                ? `Primită pe ${formatDateRO(offer.createdAt, { month: "short" })}`
                : "Ofertă nouă"}
            </p>
          </div>
        </div>

        {/* Price and actions */}
        <div className="flex flex-col items-start sm:items-end gap-3 sm:gap-4 sm:min-w-[180px]">
          <div className="sm:text-right">
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gray-400">
              Preț ofertat
            </p>
            <p
              className={`mt-0.5 sm:mt-1 text-3xl sm:text-4xl font-bold ${
                isAccepted
                  ? "text-emerald-600"
                  : isDeclined
                    ? "text-gray-400"
                    : "text-gray-900"
              }`}
            >
              {offer.price}
              <span className="ml-1 text-base sm:text-lg font-medium text-gray-400">
                lei
              </span>
            </p>
          </div>

          {isPending && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
              <button
                onClick={() => onAccept(requestId, offer.id)}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-600 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-700 active:bg-emerald-800"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Acceptă
              </button>
              <button
                onClick={() => onDecline(requestId, offer.id)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 transition hover:bg-gray-50 active:bg-gray-100"
              >
                Refuză
              </button>
              <ContactButtons offer={offer} onChat={onChat} variant="pending" hasUnread={hasUnread} />
            </div>
          )}

          {isAccepted && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
              <Link
                href={`/reviews/new?company=${offer.companyId}&request=${requestId}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-amber-500 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-amber-500/20 transition hover:bg-amber-600 active:bg-amber-700"
              >
                <StarIcon className="h-4 w-4" />
                Lasă un review
              </Link>
              <ContactButtons offer={offer} onChat={onChat} variant="accepted" hasUnread={hasUnread} />
            </div>
          )}

          {isDeclined && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:justify-end">
              <ContactButtons offer={offer} onChat={onChat} variant="declined" hasUnread={hasUnread} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
