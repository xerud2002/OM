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
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  getDoc,
  where,
  runTransaction,
  serverTimestamp,
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
  PaperAirplaneIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

import type { MovingRequest, CompanyUser } from "@/types";

// Core services to always display
const CORE_SERVICES: { key: keyof MovingRequest; label: string; icon?: typeof TruckIcon }[] = [
  { key: "serviceMoving", label: "Transport", icon: TruckIcon },
  { key: "servicePacking", label: "Ambalare", icon: ArchiveBoxIcon },
  { key: "serviceDisassembly", label: "Demontare", icon: WrenchScrewdriverIcon },
  { key: "serviceStorage", label: "Depozitare", icon: HomeModernIcon },
  { key: "serviceCleanout", label: "Debarasare" },
  { key: "serviceTransportOnly", label: "Doar transport" },
];

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
}: {
  request: MovingRequest;
  hasMine: false | { offerId: string; status: string };
  // eslint-disable-next-line no-unused-vars
  onOfferClick: (r: MovingRequest) => void;
  // eslint-disable-next-line no-unused-vars
  onChatClick?: (requestId: string, offerId: string) => void;
}) {
  const r = request;
  const cost = calculateRequestCost(r);

  return (
    <div className="relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300">
      {/* Top Status Bar */}
      <div
        className={`absolute left-0 top-0 right-0 h-1 rounded-t-xl ${hasMine ? "bg-emerald-500" : "bg-blue-500"}`}
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
      {(r.specialItems ||
        r.volumeM3 ||
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
          {r.specialItems && (
            <div className="mb-1">
              <span className="text-gray-400">Obiecte speciale:</span>
              <p className="text-gray-700 line-clamp-2">
                {r.specialItems}
              </p>
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
                unoptimized
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

      {/* Services - Always show all core services */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 border-t border-gray-100 px-3 sm:px-4 py-2">
        {CORE_SERVICES.map((s) => {
          const isSelected = !!r[s.key];
          return (
            <span 
              key={s.key} 
              className={`flex items-center gap-0.5 sm:gap-1 rounded px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium ${
                isSelected 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'bg-red-50 text-red-400'
              }`}
            >
              {s.icon && <s.icon className="h-2.5 sm:h-3 w-2.5 sm:w-3" />}
              {s.label}
            </span>
          );
        })}
      </div>

      {/* Notes Section - Always visible, 3 lines fixed */}
      <div className="border-t border-gray-100 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs">
        <span className="text-gray-400">Note:</span>
        <p className={`mt-0.5 line-clamp-3 min-h-[3rem] sm:min-h-[3.75rem] ${r.details ? 'text-gray-700' : 'text-gray-300 italic'}`}>
          {r.details || 'Nicio notă adăugată'}
        </p>
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
                className="rounded-lg bg-emerald-600 p-1.5 sm:p-2 text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
                title="Chat"
              >
                <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
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

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const checkedOffersRef = useRef<Set<string>>(new Set());

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

  // Initial Load
  useEffect(() => {
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

    // Apply filters
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      arr = arr.filter((r) => {
        const fromCity = (r.fromCity || "").toLowerCase();
        const toCity = (r.toCity || "").toLowerCase();
        const code = (r.requestCode || r.id).toLowerCase();
        return fromCity.includes(q) || toCity.includes(q) || code.includes(q);
      });
    }

    // Filter by service
    if (filterService) {
      arr = arr.filter((r) => {
        switch (filterService) {
          case "moving":
            return r.serviceMoving;
          case "packing":
            return r.servicePacking;
          case "disassembly":
            return r.serviceDisassembly;
          case "storage":
            return r.serviceStorage;
          case "piano":
            return r.servicePiano;
          case "cleanout":
            return r.serviceCleanout;
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
    searchQuery,
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
    if (searchQuery) count++;
    if (filterService) count++;
    if (filterElevator) count++;
    if (filterPropertyType) count++;
    if (filterDateFrom || filterDateTo) count++;
    if (filterStatus) count++;
    return count;
  }, [
    searchQuery,
    filterService,
    filterElevator,
    filterPropertyType,
    filterDateFrom,
    filterDateTo,
    filterStatus,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
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
      const cost = calculateRequestCost(activeOfferRequest);

      await runTransaction(db, async (transaction) => {
        const companyRef = doc(db, "companies", company.uid);
        const companyDoc = await transaction.get(companyRef);

        if (!companyDoc.exists()) throw "Profilul companiei nu a fost găsit.";

        const companyData = companyDoc.data();
        if (companyData.verificationStatus !== "verified") {
          throw "Contul tău trebuie să fie verificat (KYC) pentru a trimite oferte.";
        }

        const currentCredits = companyData.credits || 0;
        if (currentCredits < cost) {
          throw `Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${currentCredits}.`;
        }

        // Deduct
        transaction.update(companyRef, { credits: currentCredits - cost });

        // Create Offer
        const offerRef = doc(
          collection(db, "requests", activeOfferRequest.id, "offers"),
        );
        const newOfferId = offerRef.id;

        transaction.set(offerRef, {
          requestId: activeOfferRequest.id,
          requestCode:
            activeOfferRequest.requestCode || activeOfferRequest.id,
          companyId: company.uid,
          companyName:
            companyData.companyName || company.displayName || "Companie",
          companyLogo: companyData.logoUrl || companyData.photoURL || null,
          companyPhone: companyData.phone || null,
          companyEmail: companyData.email || company.email || null,
          price: price,
          message: message,
          status: "pending",
          createdAt: serverTimestamp(),
          costPaid: cost,
          // Refund tracking
          refunded: false,
          refundEligibleAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours from now
        });

        // Record Transaction
        const txRef = doc(
          collection(db, "companies", company.uid, "transactions"),
        );
        transaction.set(txRef, {
          type: "offer_placement",
          amount: -cost,
          requestId: activeOfferRequest.id,
          description: `Ofertă pentru cererea ${activeOfferRequest.requestCode || activeOfferRequest.id}`,
          createdAt: serverTimestamp(),
        });

        return newOfferId;
      });

      // Send email notification to customer
      const customerEmail =
        activeOfferRequest.customerEmail ||
        activeOfferRequest.guestEmail;
      if (customerEmail) {
        try {
          const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'newOffer',
              data: {
                customerEmail,
                requestCode:
                  activeOfferRequest.requestCode || activeOfferRequest.id,
                requestId: activeOfferRequest.id,
                companyName: company.displayName || "Companie",
                companyMessage: message,
                price: price,
                fromCity: activeOfferRequest.fromCity,
                toCity: activeOfferRequest.toCity,
                moveDate:
                  activeOfferRequest.moveDate ||
                  activeOfferRequest.moveDateStart,
              },
            }),
          });
          if (!response.ok) {
            logger.error("Offer email API returned error:", await response.text());
          }
        } catch (emailErr) {
          logger.error("Failed to send offer notification email:", emailErr);
          // Don't fail the whole operation just because email failed
        }
      }

      // Success
      setHasMineMap((prev) => ({
        ...prev,
        [activeOfferRequest.id]: { offerId: "temp", status: "pending" },
      })); // Optimistic update
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
      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            showFilters || activeFiltersCount > 0
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filtre</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
          {showFilters ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="date-desc">Cele mai noi</option>
          <option value="date-asc">Cele mai vechi</option>
        </select>
      </div>

      {/* Expandable Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              {/* Search */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Căutare
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Caută după oraș sau cod cerere..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {/* Service Type */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Serviciu
                  </label>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Toate serviciile</option>
                    <option value="moving">Transport</option>
                    <option value="packing">Ambalare</option>
                    <option value="disassembly">Demontare</option>
                    <option value="storage">Depozitare</option>
                    <option value="piano">Pian</option>
                    <option value="cleanout">Debarasare</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Tip proprietate
                  </label>
                  <select
                    value={filterPropertyType}
                    onChange={(e) =>
                      setFilterPropertyType(e.target.value as any)
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Oricare</option>
                    <option value="apartment">Apartament</option>
                    <option value="house">Casă</option>
                  </select>
                </div>

                {/* Elevator */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Lift
                  </label>
                  <select
                    value={filterElevator}
                    onChange={(e) => setFilterElevator(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Oricare</option>
                    <option value="yes">Cu lift</option>
                    <option value="no">Fără lift</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Status ofertă
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Toate</option>
                    <option value="available">Disponibile</option>
                    <option value="offered">Ofertate de mine</option>
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Data mutării de la
                  </label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Data mutării până la
                  </label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Șterge toate filtrele
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  onChatClick={(reqId, offerId) => {
                    if (window)
                      window.location.href = `/company/chat?request=${reqId}&offer=${offerId}`;
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
