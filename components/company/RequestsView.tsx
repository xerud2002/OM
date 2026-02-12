"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  startAfter,
  limit,
  limitToLast,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { formatMoveDateDisplay } from "@/utils/date";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { calculateRequestCost } from "@/utils/costCalculator";
import OfferModal from "@/components/company/OfferModal";
import { logger } from "@/utils/logger";
import { markOfferAsRead } from "@/hooks/useUnreadMessages";

import {
  ChatBubbleLeftEllipsisIcon,
  CalendarIcon,
  TruckIcon,
  PaperAirplaneIcon,
  CheckBadgeIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

const RequestFullDetails = dynamic(
  () => import("@/components/customer/RequestFullDetails"),
  { ssr: false }
);

import type { MovingRequest, CompanyUser } from "@/types";

// Core services to always display

// County abbreviations mapping
const COUNTY_ABBREV: Record<string, string> = {
  "Alba": "AB", "Arad": "AR", "Argeș": "AG", "Bacău": "BC", "Bihor": "BH",
  "Bistrița-Năsăud": "BN", "Botoșani": "BT", "Brașov": "BV", "Brăila": "BR",
  "București": "B", "Buzău": "BZ", "Caraș-Severin": "CS", "Cluj": "CJ",
  "Constanța": "CT", "Covasna": "CV", "Dâmbovița": "DB", "Dolj": "DJ",
  "Galați": "GL", "Giurgiu": "GR", "Gorj": "GJ", "Harghita": "HR",
  "Hunedoara": "HD", "Ialomița": "IL", "Iași": "IS", "Ilfov": "IF",
  "Maramureș": "MM", "Mehedinți": "MH", "Mureș": "MS", "Neamț": "NT",
  "Olt": "OT", "Prahova": "PH", "Satu Mare": "SM", "Sălaj": "SJ",
  "Sibiu": "SB", "Suceava": "SV", "Teleorman": "TR", "Timiș": "TM",
  "Tulcea": "TL", "Vaslui": "VS", "Vâlcea": "VL", "Vrancea": "VN",
};

function JobCard({
  request,
  hasMine,
  onOfferClick,
  onChatClick,
  onDetailClick,
  unreadOfferIds,
}: {
  request: MovingRequest;
  hasMine: false | { offerId: string; status: string };
   
  onOfferClick: (r: MovingRequest) => void;
   
  onChatClick?: (requestId: string, offerId: string) => void;
  onDetailClick?: (r: MovingRequest) => void;
  unreadOfferIds?: Set<string>;
}) {
  const r = request;
  const cost = calculateRequestCost(r);

  // Determine card colors based on offer status
  const cardStyle = !hasMine
    ? { bg: "bg-blue-50/40", border: "border-blue-200", bar: "bg-blue-500" }
    : hasMine.status === "accepted"
      ? { bg: "bg-emerald-50/40", border: "border-emerald-200", bar: "bg-emerald-500" }
      : hasMine.status === "declined" || hasMine.status === "rejected"
        ? { bg: "bg-red-50/40", border: "border-red-200", bar: "bg-red-400" }
        : { bg: "bg-amber-50/40", border: "border-amber-200", bar: "bg-amber-400" };

  return (
    <div className={`relative flex flex-col rounded-xl border ${cardStyle.border} ${cardStyle.bg} shadow-sm transition-all hover:shadow-lg`}>
      {/* Top Status Bar */}
      <div
        className={`absolute left-0 top-0 right-0 h-1 rounded-t-xl ${cardStyle.bar}`}
      />

      {/* Header: Code, Date & Move Date */}
      <div className="flex items-center justify-between border-b border-gray-100 px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-gray-500">
            {r.requestCode || r.id.substring(0, 8)}
          </span>
          <span className="text-[9px] sm:text-[10px] text-gray-400">
            {(() => {
              const ts = r.createdAt;
              if (!ts) return "—";
              let d: Date;
              if (ts.toDate) {
                d = ts.toDate();
              } else if (ts.seconds) {
                d = new Date(ts.seconds * 1000);
              } else {
                return "—";
              }
              if (isNaN(d.getTime())) return "—";
              return (
                d.toLocaleDateString("ro-RO", {
                  day: "2-digit",
                  month: "short",
                }) +
                " • " +
                d.toLocaleTimeString("ro-RO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              );
            })()}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-md bg-amber-50 px-1.5 sm:px-2 py-1 text-[9px] sm:text-[10px] font-bold text-amber-700 ring-1 ring-amber-100">
          <CalendarIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
          <span>
            {(() => {
              const d = formatMoveDateDisplay(r as any, { month: "short" });
              return d && d !== "-" ? d : "Flexibil";
            })()}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-gray-800">
        <span className="line-clamp-1 text-right max-w-[40%]">
          {r.fromCity}{r.fromCounty && COUNTY_ABBREV[r.fromCounty] ? `, ${COUNTY_ABBREV[r.fromCounty]}` : ""}
        </span>
        <TruckIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4 shrink-0 text-blue-500" />
        <span className="line-clamp-1 text-left max-w-[40%]">
          {r.toCity}{r.toCounty && COUNTY_ABBREV[r.toCounty] ? `, ${COUNTY_ABBREV[r.toCounty]}` : ""}
        </span>
      </div>

      {/* Specs: Colectie & Livrare */}
      <div className="grid grid-cols-2 gap-2 border-t border-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase text-gray-400">
            Colecție
          </span>
          <span className="font-medium">
            {r.fromType === "house" ? "Casă" : "Apartament"}
          </span>
          {r.fromRooms && <span>{r.fromRooms} {r.fromRooms === 1 ? "cameră" : "camere"}</span>}
          {r.fromFloor && <span>Etaj {r.fromFloor}</span>}
          <span
            className={
              r.fromElevator
                ? "text-emerald-600 font-medium"
                : "text-rose-500 font-medium"
            }
          >
            {r.fromElevator !== undefined &&
              (r.fromElevator ? "✓ Lift" : "✗ Fără lift")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase text-gray-400">
            Livrare
          </span>
          <span className="font-medium">
            {r.toType === "house" ? "Casă" : "Apartament"}
          </span>
          {r.toRooms && <span>{r.toRooms} {r.toRooms === 1 ? "cameră" : "camere"}</span>}
          {r.toFloor !== undefined && (
            <span>Etaj {r.toFloor}</span>
          )}
          <span
            className={
              r.toElevator
                ? "text-emerald-600 font-medium"
                : "text-rose-500 font-medium"
            }
          >
            {r.toElevator !== undefined &&
              (r.toElevator ? "✓ Lift" : "✗ Fără lift")}
          </span>
        </div>
      </div>

      {/* Additional Details */}
      {(r.volumeM3 ||
        r.budgetEstimate) && (
        <div className="border-t border-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600">
          {r.volumeM3 && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-gray-400">Volum:</span>
              <span className="font-medium">{r.volumeM3} m³</span>
            </div>
          )}
          {r.budgetEstimate && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-gray-400">Buget:</span>
              <span className="font-medium">
                {r.budgetEstimate} RON
              </span>
            </div>
          )}
        </div>
      )}

      {/* Media thumbnails */}
      {r.mediaUrls && r.mediaUrls.length > 0 && (
        <div className="border-t border-gray-100 px-3 sm:px-4 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {r.mediaUrls.slice(0, 4).map((url: string, i: number) => (
              <Image
                key={i}
                src={url}
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded object-cover"
              />
            ))}
            {r.mediaUrls.length > 4 && (
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded bg-gray-100 text-[10px] sm:text-xs text-gray-500">
                +{r.mediaUrls.length - 4}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service type - show only what the client selected */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 border-t border-gray-100 px-3 sm:px-4 py-2">
        {(() => {
          const service = r.serviceTransportOnly
            ? { label: "Doar câteva lucruri", icon: TruckIcon }
            : { label: "Mutare completă", icon: TruckIcon };
          return (
            <span className="flex items-center gap-0.5 sm:gap-1 rounded bg-blue-50 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-blue-700">
              <service.icon className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
              {service.label}
            </span>
          );
        })()}
      </div>

      {/* Notes Section - Always visible, 3 lines fixed */}
      <div className="border-t border-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs">
        <span className="text-gray-400">Note:</span>
        <p className={`mt-0.5 line-clamp-3 min-h-12 sm:min-h-15 ${r.details ? 'text-gray-700' : 'text-gray-300 italic'}`}>
          {r.details || 'Nicio notă adăugată'}
        </p>
      </div>

      {/* Detail Button */}
      <div className="border-t border-gray-100 px-3 sm:px-4 py-2 flex justify-center">
        <button
          onClick={() => onDetailClick?.(r)}
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
        >
          <EyeIcon className="h-3.5 w-3.5" />
          Detalii
        </button>
      </div>

      {/* Action Button */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2">
        {hasMine ? (
          <div className="flex items-center justify-center gap-2">
            {hasMine.status === "accepted" ? (
              <span className="flex items-center gap-1 rounded-lg bg-green-100 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-green-700 ring-1 ring-green-200">
                <CheckBadgeIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                ACCEPTAT
              </span>
            ) : hasMine.status === "declined" ||
              hasMine.status === "rejected" ? (
              <span className="flex items-center gap-1 rounded-lg bg-red-50 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-red-600">
                <XMarkIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                REFUZAT
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-emerald-700">
                <CheckBadgeIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                OFERTAT
              </span>
            )}
            {hasMine.offerId && onChatClick && (
              <button
                onClick={() => onChatClick(r.id, hasMine.offerId)}
                className="relative rounded-lg bg-emerald-600 p-1.5 sm:p-2 text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
                title="Chat"
              >
                <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                {unreadOfferIds?.has(hasMine.offerId) && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>
                )}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOfferClick(r)}
            className="flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-blue-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <PaperAirplaneIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
            <span>Trimite Ofertă</span>
            <span className="rounded bg-white/20 px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-white">
              {cost}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// --- Main RequestsView Component ---
export default function RequestsView({
  companyFromParent,
}: {
  companyFromParent?: CompanyUser;
}) {
  const [company, setCompany] = useState<CompanyUser>(
    companyFromParent ?? null,
  );
  const PAGE_SIZE = 10;
  const [firstPage, setFirstPage] = useState<MovingRequest[]>([]);
  const [extra, setExtra] = useState<MovingRequest[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  // Map of request ID to offer info: false = no offer, or { offerId, status }
  const [hasMineMap, setHasMineMap] = useState<
    Record<string, false | { offerId: string; status: string }>
  >({});
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [detailRequest, setDetailRequest] = useState<MovingRequest | null>(null);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filterService, setFilterService] = useState<string>("");
  const [filterElevator, setFilterElevator] = useState<"" | "yes" | "no">("");
  const [filterPropertyType, setFilterPropertyType] = useState<
    "" | "apartment" | "house"
  >("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "" | "available" | "offered"
  >("");

  // Modal State
  const [activeOfferRequest, setActiveOfferRequest] =
    useState<MovingRequest | null>(null);
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Unread chat messages tracking
  const [unreadOfferIds, setUnreadOfferIds] = useState<Set<string>>(new Set());

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const checkedOffersRef = useRef<Set<string>>(new Set());
  const unreadSubsRef = useRef<Map<string, () => void>>(new Map());

  // Helpers to read persisted timestamps from localStorage
  const getReadTimestamps = (): Record<string, number> => {
    try {
      const raw = localStorage.getItem("om_chat_read_ts");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  // Track unread messages for company offers
  useEffect(() => {
    if (!company?.uid) return;

    const entries = Object.entries(hasMineMap).filter(
      (entry): entry is [string, { offerId: string; status: string }] =>
        entry[1] !== false,
    );

    const readTs = getReadTimestamps();

    // Subscribe to new offer chats, skip already-subscribed
    const currentSubs = unreadSubsRef.current;
    for (const [requestId, offerInfo] of entries) {
      const key = `${requestId}__${offerInfo.offerId}`;
      if (currentSubs.has(key)) continue;

      const messagesRef = collection(
        db,
        "requests",
        requestId,
        "offers",
        offerInfo.offerId,
        "messages",
      );
      const q = query(messagesRef, orderBy("createdAt", "asc"), limitToLast(1));

      const unsub = onSnapshot(
        q,
        (snap) => {
          if (snap.empty) return;
          const lastMsg = snap.docs[0].data();
          const isFromCustomer =
            lastMsg.senderId !== company.uid && lastMsg.senderRole !== "company";

          // Check if message is newer than last read timestamp
          const msgTime = lastMsg.createdAt?.toMillis?.() || lastMsg.createdAt?.seconds * 1000 || 0;
          const lastRead = readTs[offerInfo.offerId] || 0;

          setUnreadOfferIds((prev) => {
            const next = new Set(prev);
            if (isFromCustomer && msgTime > lastRead) {
              next.add(offerInfo.offerId);
            } else {
              next.delete(offerInfo.offerId);
            }
            return next;
          });
        },
        () => {/* ignore errors for missing collections */},
      );

      currentSubs.set(key, unsub);
    }

    return () => {
      // Cleanup all unread subscriptions on unmount or company change
      currentSubs.forEach((unsub) => unsub());
      currentSubs.clear();
    };
  }, [company?.uid, hasMineMap]);

  // Auth (if not provided by parent)
  useEffect(() => {
    if (companyFromParent) return;
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, [companyFromParent]);

  const checkMyOffers = useCallback(
    async (requests: MovingRequest[], companyId: string) => {
      try {
        const toCheck = requests.filter(
          (r) => !checkedOffersRef.current.has(r.id),
        );
        if (toCheck.length === 0) return;

        const updates: Record<
          string,
          false | { offerId: string; status: string }
        > = {};

        // Mark as checked immediately
        toCheck.forEach((r) => checkedOffersRef.current.add(r.id));

        await Promise.all(
          toCheck.map(async (r) => {
            try {
              // Check offers subcollection
              const q = query(
                collection(db, "requests", r.id, "offers"),
                where("companyId", "==", companyId),
              );
              const snap = await getDocs(q);
              if (!snap.empty) {
                const offerDoc = snap.docs[0];
                const offerData = offerDoc.data();
                updates[r.id] = {
                  offerId: offerDoc.id,
                  status: offerData.status || "pending",
                };
              } else {
                // Also check legacy payments
                const paymentRef = doc(
                  db,
                  `companies/${companyId}/payments/${r.id}`,
                );
                const paymentSnap = await getDoc(paymentRef);
                if (
                  paymentSnap.exists() &&
                  paymentSnap.data()?.status === "completed"
                ) {
                  updates[r.id] = { offerId: r.id, status: "pending" };
                } else {
                  updates[r.id] = false;
                }
              }
            } catch (err) {
              logger.error("Error checking offer:", err);
            }
          }),
        );

        if (Object.keys(updates).length > 0) {
          setHasMineMap((prev) => ({ ...prev, ...updates }));
        }
      } catch (e) {
        logger.error("Error batch checking offers", e);
      }
    },
    [],
  );

  // Initial Load — wait for auth before querying Firestore
  useEffect(() => {
    if (!company?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "requests"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE),
    );
    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as MovingRequest)
          .filter((req) => {
            // Only show admin-approved requests to companies
            if (!req.adminApproved) return false;
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
        logger.warn("Error loading requests:", error);
        setFirstPage([]);
        setLoading(false);
        setHasMore(false);
      },
    );
    return () => unsub();
  }, [company?.uid, checkMyOffers]);

  const loadMore = useCallback(async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    try {
      const q2 = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE),
      );
      const snap = await getDocs(q2);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as MovingRequest)
        .filter((req) => {
          // Only show admin-approved requests to companies
          if (!req.adminApproved) return false;
          const isVisible =
            !req.status ||
            req.status === "active" ||
            req.status === "accepted" ||
            req.status === "pending";
          const notArchived = !req.archived;
          return isVisible && notArchived;
        });

      setExtra((prev) => {
        const seen = new Set(
          prev.map((p) => p.id).concat(firstPage.map((p) => p.id)),
        );
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
      logger.warn("Error loading more requests:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, firstPage, company?.uid, checkMyOffers]);

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
      { rootMargin: "200px" },
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
    let arr = [...combinedRequests];

    // Filter by service
    if (filterService) {
      arr = arr.filter((r) => {
        switch (filterService) {
          case "moving":
            return r.serviceMoving;
          case "transport":
            return r.serviceTransportOnly;
          default:
            return true;
        }
      });
    }

    // Filter by elevator
    if (filterElevator) {
      arr = arr.filter((r) => {
        const hasElevator = r.fromElevator || r.toElevator;
        return filterElevator === "yes" ? hasElevator : !hasElevator;
      });
    }

    // Filter by property type
    if (filterPropertyType) {
      arr = arr.filter((r) => {
        if (filterPropertyType === "apartment") {
          return r.fromType !== "house" || r.toType !== "house";
        } else {
          return r.fromType === "house" || r.toType === "house";
        }
      });
    }

    // Filter by move date range
    if (filterDateFrom || filterDateTo) {
      arr = arr.filter((r) => {
        if (!r.moveDate) return false;
        const moveDate = new Date(r.moveDate);
        if (filterDateFrom && moveDate < new Date(filterDateFrom)) return false;
        if (filterDateTo && moveDate > new Date(filterDateTo)) return false;
        return true;
      });
    }

    // Filter by offer status
    if (filterStatus) {
      arr = arr.filter((r) => {
        const hasOffer = hasMineMap[r.id];
        return filterStatus === "offered" ? hasOffer : !hasOffer;
      });
    }

    // Apply sort
    const getTime = (r: MovingRequest): number =>
      r.createdAt?.toMillis ? r.createdAt.toMillis() : 0;
    return sortBy === "date-desc"
      ? arr.sort((a, b) => getTime(b) - getTime(a))
      : arr.sort((a, b) => getTime(a) - getTime(b));
  }, [
    combinedRequests,
    sortBy,
    filterService,
    filterElevator,
    filterPropertyType,
    filterDateFrom,
    filterDateTo,
    filterStatus,
    hasMineMap,
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterService) count++;
    if (filterElevator) count++;
    if (filterPropertyType) count++;
    if (filterDateFrom || filterDateTo) count++;
    if (filterStatus) count++;
    return count;
  }, [
    filterService,
    filterElevator,
    filterPropertyType,
    filterDateFrom,
    filterDateTo,
    filterStatus,
  ]);

  const clearAllFilters = () => {
    setFilterService("");
    setFilterElevator("");
    setFilterPropertyType("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterStatus("");
  };

  // --- Handling Offer Submission ---
  const handleOfferSubmit = async (price: number, message: string) => {
    if (!activeOfferRequest || !company?.uid) return;

    setSubmittingOffer(true);
    try {
      // Get fresh auth token for API call
      const { getAuth } = await import("firebase/auth");
      const currentUser = getAuth().currentUser;
      if (!currentUser) throw "Nu ești autentificat. Re-loghează-te.";
      const token = await currentUser.getIdToken(true);

      const response = await fetch("/api/offers/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: activeOfferRequest.id,
          price,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result.error || "Eroare la trimiterea ofertei.";
      }

      // Success — optimistic update
      setHasMineMap((prev) => ({
        ...prev,
        [activeOfferRequest.id]: { offerId: result.offerId || "temp", status: "pending" },
      }));
      checkMyOffers([activeOfferRequest], company.uid);
    } catch (err: unknown) {
      logger.error("Failed to place offer", err);
      const msg = typeof err === "string" ? err : (err instanceof Error ? err.message : "Eroare la trimiterea ofertei.");
      alert(msg);
    } finally {
      setSubmittingOffer(false);
    }
  };

  return (
    <div>
      {/* Top Bar: Sort + Filter Toggle */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date-desc" | "date-asc")}
          aria-label="Sortare cereri"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="date-desc">Cele mai noi</option>
          <option value="date-asc">Cele mai vechi</option>
        </select>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            showFilters || activeFiltersCount > 0
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FunnelIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Filtre</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
          {showFilters ? (
            <ChevronUpIcon className="h-3.5 w-3.5" />
          ) : (
            <ChevronDownIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Compact Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className={`rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none ${
                  filterService ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <option value="">Serviciu: Toate</option>
                <option value="moving">Mutare completă</option>
                <option value="transport">Doar câteva lucruri</option>
              </select>

              <select
                value={filterPropertyType}
                onChange={(e) => setFilterPropertyType(e.target.value as any)}
                className={`rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none ${
                  filterPropertyType ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <option value="">Proprietate: Oricare</option>
                <option value="apartment">Apartament</option>
                <option value="house">Casă</option>
              </select>

              <select
                value={filterElevator}
                onChange={(e) => setFilterElevator(e.target.value as any)}
                className={`rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none ${
                  filterElevator ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <option value="">Lift: Oricare</option>
                <option value="yes">Cu lift</option>
                <option value="no">Fără lift</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className={`rounded-lg border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none ${
                  filterStatus ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                <option value="">Status: Toate</option>
                <option value="available">Disponibile</option>
                <option value="offered">Ofertate de mine</option>
              </select>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">De la</span>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className={`rounded-lg border px-2.5 py-2 text-sm focus:border-emerald-500 focus:outline-none ${
                    filterDateFrom ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
                  }`}
                />
                <span className="text-xs text-gray-500">până la</span>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className={`rounded-lg border px-2.5 py-2 text-sm focus:border-emerald-500 focus:outline-none ${
                    filterDateTo ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-white text-gray-600"
                  }`}
                />
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="ml-auto flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                  Resetează
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && !showFilters && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-1">Filtre active:</span>
          {filterService && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {{moving:"Mutare completă",transport:"Doar câteva lucruri"}[filterService] || filterService}
              <button onClick={() => setFilterService("")} className="hover:text-emerald-900"><XMarkIcon className="h-3 w-3" /></button>
            </span>
          )}
          {filterPropertyType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterPropertyType === "apartment" ? "Apartament" : "Casă"}
              <button onClick={() => setFilterPropertyType("")} className="hover:text-emerald-900"><XMarkIcon className="h-3 w-3" /></button>
            </span>
          )}
          {filterElevator && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterElevator === "yes" ? "Cu lift" : "Fără lift"}
              <button onClick={() => setFilterElevator("")} className="hover:text-emerald-900"><XMarkIcon className="h-3 w-3" /></button>
            </span>
          )}
          {filterStatus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterStatus === "available" ? "Disponibile" : "Ofertate de mine"}
              <button onClick={() => setFilterStatus("")} className="hover:text-emerald-900"><XMarkIcon className="h-3 w-3" /></button>
            </span>
          )}
          {(filterDateFrom || filterDateTo) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterDateFrom && filterDateTo ? `${filterDateFrom} - ${filterDateTo}` : filterDateFrom ? `De la ${filterDateFrom}` : `Până la ${filterDateTo}`}
              <button onClick={() => { setFilterDateFrom(""); setFilterDateTo(""); }} className="hover:text-emerald-900"><XMarkIcon className="h-3 w-3" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-gray-400 hover:text-gray-600 ml-1"
          >
            Șterge tot
          </button>
        </div>
      )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  hasMine={hasMineMap[r.id] ?? false}
                  onOfferClick={(req) => setActiveOfferRequest(req)}
                  onDetailClick={(req) => setDetailRequest(req)}
                  onChatClick={(reqId, offerId) => {
                    // Clear unread and persist read timestamp
                    markOfferAsRead(offerId);
                    setUnreadOfferIds((prev) => {
                      const next = new Set(prev);
                      next.delete(offerId);
                      return next;
                    });
                    if (window)
                      window.location.href = `/company/chat?request=${reqId}&offer=${offerId}`;
                  }}
                  unreadOfferIds={unreadOfferIds}
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

      {/* Request Detail Modal */}
      <AnimatePresence>
        {detailRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDetailRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {detailRequest.fromCity} → {detailRequest.toCity}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {detailRequest.requestCode || `#${detailRequest.id.slice(0, 8)}`}
                  </p>
                </div>
                <button onClick={() => setDetailRequest(null)} className="rounded-full p-1 hover:bg-gray-100">
                  <XMarkIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              <RequestFullDetails request={detailRequest} isOwner={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <OfferModal
        isOpen={!!activeOfferRequest}
        onClose={() => setActiveOfferRequest(null)}
        onConfirm={handleOfferSubmit}
        title={
          activeOfferRequest
            ? `Ofertă pentru ${activeOfferRequest.requestCode || "Cerere"}`
            : "Trimite Ofertă"
        }
        isLoading={submittingOffer}
        offerCost={activeOfferRequest ? calculateRequestCost(activeOfferRequest) : undefined}
      />
    </div>
  );
}
