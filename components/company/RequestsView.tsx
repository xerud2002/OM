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
import { formatMoveDateDisplay, isMoveDateUrgent } from "@/utils/date";
import { onAuthChange } from "@/services/firebaseHelpers";
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
  EyeIcon,
  PlayIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArchiveBoxIcon,
  InboxStackIcon,
  WrenchScrewdriverIcon,
  TrashIcon,
  ScissorsIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  HomeModernIcon,
  ArrowPathIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import counties from "@/data/counties";

const RequestFullDetails = dynamic(
  () => import("@/components/customer/RequestFullDetails"),
  { ssr: false },
);

import type { MovingRequest, CompanyUser } from "@/types";

// Core services to always display

// County abbreviations mapping
const COUNTY_ABBREV: Record<string, string> = {
  Alba: "AB",
  Arad: "AR",
  Argeș: "AG",
  Bacău: "BC",
  Bihor: "BH",
  "Bistrița-Năsăud": "BN",
  Botoșani: "BT",
  Brașov: "BV",
  Brăila: "BR",
  București: "B",
  Buzău: "BZ",
  "Caraș-Severin": "CS",
  Cluj: "CJ",
  Constanța: "CT",
  Covasna: "CV",
  Dâmbovița: "DB",
  Dolj: "DJ",
  Galați: "GL",
  Giurgiu: "GR",
  Gorj: "GJ",
  Harghita: "HR",
  Hunedoara: "HD",
  Ialomița: "IL",
  Iași: "IS",
  Ilfov: "IF",
  Maramureș: "MM",
  Mehedinți: "MH",
  Mureș: "MS",
  Neamț: "NT",
  Olt: "OT",
  Prahova: "PH",
  "Satu Mare": "SM",
  Sălaj: "SJ",
  Sibiu: "SB",
  Suceava: "SV",
  Teleorman: "TR",
  Timiș: "TM",
  Tulcea: "TL",
  Vaslui: "VS",
  Vâlcea: "VL",
  Vrancea: "VN",
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

  // Card accent based on offer status
  const accent = !hasMine
    ? { bar: "from-blue-500 to-indigo-500", ring: "ring-blue-100", glow: "hover:shadow-blue-100/50" }
    : hasMine.status === "accepted"
      ? { bar: "from-emerald-500 to-teal-500", ring: "ring-emerald-100", glow: "hover:shadow-emerald-100/50" }
      : hasMine.status === "declined" || hasMine.status === "rejected"
        ? { bar: "from-rose-400 to-red-400", ring: "ring-rose-100", glow: "hover:shadow-rose-100/50" }
        : { bar: "from-amber-400 to-orange-400", ring: "ring-amber-100", glow: "hover:shadow-amber-100/50" };

  // Service badge color per type
  const svcColors: Record<string, string> = {
    serviceMoving: "bg-indigo-50 text-indigo-700 ring-indigo-200/60",
    serviceTransportOnly: "bg-slate-50 text-slate-700 ring-slate-200/60",
    servicePacking: "bg-violet-50 text-violet-700 ring-violet-200/60",
    serviceAssembly: "bg-amber-50 text-amber-700 ring-amber-200/60",
    serviceDisposal: "bg-rose-50 text-rose-700 ring-rose-200/60",
    servicePackingMaterials: "bg-teal-50 text-teal-700 ring-teal-200/60",
  };

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-200 ${accent.glow} hover:shadow-lg overflow-hidden`}
    >
      {/* Gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${accent.bar}`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-3">
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-[11px] sm:text-xs font-semibold text-gray-400 tracking-wide">
            {r.requestCode || r.id.substring(0, 8)}
          </span>
          <span className="text-[10px] text-gray-400/80 mt-0.5">
            {(() => {
              const ts = r.createdAt;
              if (!ts) return "-";
              let d: Date;
              if (ts.toDate) {
                d = ts.toDate();
              } else if (ts.seconds) {
                d = new Date(ts.seconds * 1000);
              } else {
                return "-";
              }
              if (isNaN(d.getTime())) return "-";
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
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/50 whitespace-nowrap">
          <CalendarIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5 opacity-70" />
          <span>
            {(() => {
              const mode = r.moveDateMode;
              const hasDate = (fmt: Record<string, unknown>) => {
                const v = formatMoveDateDisplay(fmt, { month: "short" });
                return v && v !== "-" ? v : null;
              };
              if (mode === "flexible") {
                const d = formatMoveDateDisplay(r as any, {
                  month: "short",
                  noYear: true,
                });
                const ok = d && d !== "-";
                return ok ? `Flexibil ${d}` : "Flexibil";
              }
              if (mode === "exact") {
                const d = formatMoveDateDisplay(r as any, {
                  month: "short",
                  noYear: true,
                });
                const ok = d && d !== "-";
                return ok ? `Dată fixă · ${d}` : "Dată fixă";
              }
              const d = formatMoveDateDisplay(r as any, { month: "short" });
              const dOk = d && d !== "-";
              if (mode === "range") return dOk ? `${d}` : "Interval";
              if (mode === "none") return "Fără dată";
              // legacy fallback
              return dOk ? d : "Flexibil";
            })()}
          </span>
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center justify-center gap-3 px-4 py-3 min-h-[3.5rem]">
        <span className="text-right text-[13px] sm:text-sm font-bold text-gray-800 leading-tight">
          {r.fromCity}
          {r.fromCounty && COUNTY_ABBREV[r.fromCounty]
            ? <span className="text-gray-400 font-medium">{`, ${COUNTY_ABBREV[r.fromCounty]}`}</span>
            : ""}
        </span>
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-200/40 shrink-0">
          <TruckIcon className="h-3.5 w-3.5 text-blue-500" />
        </div>
        <span className="text-left text-[13px] sm:text-sm font-bold text-gray-800 leading-tight">
          {r.toCity}
          {r.toCounty && COUNTY_ABBREV[r.toCounty]
            ? <span className="text-gray-400 font-medium">{`, ${COUNTY_ABBREV[r.toCounty]}`}</span>
            : ""}
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Specs: Colecție & Livrare */}
      <div className="grid grid-cols-2 gap-3 px-4 py-3 min-h-[7.5rem] text-[11px] sm:text-xs text-gray-600">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Colecție
          </span>
          <span className="font-semibold text-gray-700">
            {r.fromType === "house" ? "Casă" : "Apartament"}
          </span>
          {r.fromRooms && (
            <span className="text-gray-500">
              {r.fromRooms} {Number(r.fromRooms) === 1 ? "cameră" : "camere"}
            </span>
          )}
          {r.fromFloor && (
            <span className="text-gray-500">
              {/^(parter|demisol)$/i.test(String(r.fromFloor))
                ? r.fromFloor
                : `Etaj ${r.fromFloor}`}
            </span>
          )}
          {r.fromType !== "house" &&
            r.fromFloor &&
            !/^(parter|demisol)$/i.test(String(r.fromFloor)) &&
            r.fromElevator !== undefined && (
              <span
                className={`text-[10px] font-semibold ${
                  r.fromElevator
                    ? "text-emerald-600"
                    : "text-rose-500"
                }`}
              >
                {r.fromElevator ? "✓ Lift" : "✗ Fără lift"}
              </span>
            )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Livrare
          </span>
          <span className="font-semibold text-gray-700">
            {r.toType === "house" ? "Casă" : "Apartament"}
          </span>
          {r.toRooms && (
            <span className="text-gray-500">
              {r.toRooms} {Number(r.toRooms) === 1 ? "cameră" : "camere"}
            </span>
          )}
          {r.toFloor !== undefined && (
            <span className="text-gray-500">
              {/^(parter|demisol)$/i.test(String(r.toFloor))
                ? r.toFloor
                : `Etaj ${r.toFloor}`}
            </span>
          )}
          {r.toType !== "house" &&
            r.toFloor !== undefined &&
            !/^(parter|demisol)$/i.test(String(r.toFloor)) &&
            r.toElevator !== undefined && (
              <span
                className={`text-[10px] font-semibold ${
                  r.toElevator
                    ? "text-emerald-600"
                    : "text-rose-500"
                }`}
              >
                {r.toElevator ? "✓ Lift" : "✗ Fără lift"}
              </span>
            )}
        </div>
      </div>

      {/* Additional Details */}
      {(r.volumeM3 || r.budgetEstimate) && (
        <>
          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <div className="px-4 py-2.5 text-[11px] sm:text-xs text-gray-500 flex items-center gap-4">
            {r.volumeM3 && (
              <span>
                <span className="text-gray-400">Volum</span>{" "}
                <span className="font-semibold text-gray-700">{r.volumeM3} m³</span>
              </span>
            )}
            {r.budgetEstimate && (
              <span>
                <span className="text-gray-400">Buget</span>{" "}
                <span className="font-semibold text-gray-700">{r.budgetEstimate} RON</span>
              </span>
            )}
          </div>
        </>
      )}

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Service badges */}
      <div className="flex flex-1 flex-wrap items-start content-start gap-1.5 px-4 py-3 min-h-[5.5rem]">
        {(
          [
            {
              key: "serviceMoving" as const,
              label: "Mutare completă",
              icon: TruckIcon,
            },
            {
              key: "serviceTransportOnly" as const,
              label: "Doar câteva lucruri",
              icon: ArchiveBoxIcon,
            },
            {
              key: "servicePacking" as const,
              label: "Împachetare",
              icon: InboxStackIcon,
            },
            {
              key: "serviceAssembly" as const,
              label: "Montaj / Demontare",
              icon: WrenchScrewdriverIcon,
            },
            {
              key: "serviceDisposal" as const,
              label: "Debarasare",
              icon: TrashIcon,
            },
            {
              key: "servicePackingMaterials" as const,
              label: "Materiale",
              icon: ScissorsIcon,
            },
          ] as const
        )
          .filter((s) => r[s.key])
          .map((s) => (
            <span
              key={s.key}
              className={`inline-flex items-center gap-1 rounded-full ring-1 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium ${svcColors[s.key]}`}
            >
              <s.icon className="h-2.5 sm:h-3 w-2.5 sm:w-3 opacity-70" />
              {s.label}
            </span>
          ))}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Notes */}
      <div className="px-4 py-3 text-[11px] sm:text-xs">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Note</span>
        <p
          className={`mt-1 line-clamp-3 min-h-[2.5rem] leading-relaxed ${r.details ? "text-gray-600" : "text-gray-300 italic"}`}
        >
          {r.details || "Nicio notă adăugată"}
        </p>
      </div>

      {/* Footer actions */}
      <div className="mt-auto border-t border-gray-100 bg-gray-50/50 px-4 py-3">
        {hasMine ? (
          <>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onDetailClick?.(r)}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200/80 transition hover:bg-gray-50 hover:shadow active:scale-[0.97]"
              >
                <EyeIcon className="h-3.5 w-3.5" />
                Detalii
              </button>
              {hasMine.status === "accepted" ? (
                <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/60">
                  <CheckBadgeIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  Acceptată
                </span>
              ) : hasMine.status === "declined" ||
                hasMine.status === "rejected" ? (
                <span className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-rose-600 ring-1 ring-rose-200/60">
                  <XMarkIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  Refuzată
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-amber-700 ring-1 ring-amber-200/60">
                  <CheckBadgeIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                  Trimisă
                </span>
              )}
            </div>
            {/* Contact row */}
            <div className="flex items-center justify-center gap-2 mt-2.5">
              {r.phone && (
                <a
                  href={`tel:${r.phone}`}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-gray-200/80 hover:bg-blue-50 hover:ring-blue-200 transition active:scale-95"
                  title={r.phone}
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                </a>
              )}
              {hasMine.offerId && onChatClick && (
                <button
                  onClick={() => onChatClick(r.id, hasMine.offerId)}
                  className="relative flex items-center justify-center h-8 w-8 rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-gray-200/80 hover:bg-emerald-50 hover:ring-emerald-200 transition active:scale-95"
                  title="Chat"
                >
                  <ChatBubbleLeftEllipsisIcon className="h-3.5 w-3.5" />
                  {unreadOfferIds?.has(hasMine.offerId) && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                    </span>
                  )}
                </button>
              )}
              {(r.customerEmail || r.guestEmail) && (
                <a
                  href={`mailto:${r.customerEmail || r.guestEmail}`}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-violet-600 shadow-sm ring-1 ring-gray-200/80 hover:bg-violet-50 hover:ring-violet-200 transition active:scale-95"
                  title={r.customerEmail || r.guestEmail}
                >
                  <EnvelopeIcon className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onDetailClick?.(r)}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-200/80 transition hover:bg-gray-50 hover:shadow active:scale-[0.97]"
              >
                <EyeIcon className="h-3.5 w-3.5" />
                Detalii
              </button>
              {isMoveDateUrgent(r as any) && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200 animate-pulse">
                  ⚡ Urgent
                </span>
              )}
            </div>
            <button
              onClick={() => onOfferClick(r)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition hover:shadow-lg hover:shadow-emerald-200/50 active:scale-[0.98]"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Trimite Ofertă</span>
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-white/90">
                {cost}
              </span>
            </button>
          </div>
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
  const [companyProfile, setCompanyProfile] = useState<{
    city?: string;
    county?: string;
  } | null>(null);
  const [geoLatLng, setGeoLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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
  const [detailRequest, setDetailRequest] = useState<MovingRequest | null>(
    null,
  );

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
    "" | "available" | "offered" | "accepted" | "declined"
  >("");
  const [filterCounty, setFilterCounty] = useState<string>("");
  const [filterCity, setFilterCity] = useState<string>("");
  const [filterRooms, setFilterRooms] = useState<"" | "1" | "2" | "3" | "4" | "5+">("");
  const [filterHasMedia, setFilterHasMedia] = useState<"" | "yes" | "no">("");
  const [filterFloor, setFilterFloor] = useState<"" | "parter" | "1-3" | "4-7" | "8+">("");

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
    } catch {
      return {};
    }
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
            lastMsg.senderId !== company.uid &&
            lastMsg.senderRole !== "company";

          // Check if message is newer than last read timestamp
          const msgTime =
            lastMsg.createdAt?.toMillis?.() ||
            lastMsg.createdAt?.seconds * 1000 ||
            0;
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
        () => {
          /* ignore errors for missing collections */
        },
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

  // Fetch company profile (city/county) for distance badges
  useEffect(() => {
    if (!company?.uid) return;
    getDoc(doc(db, "companies", company.uid))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setCompanyProfile({ city: d.city || "", county: d.county || "" });
        }
      })
      .catch(() => {});
  }, [company?.uid]);

  // Get browser geolocation as fallback for company location
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoLatLng({ lat: 45.7983, lng: 24.1256 }); // Sibiu fallback
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setGeoLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeoLatLng({ lat: 45.7983, lng: 24.1256 }), // Sibiu fallback
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
    );
  }, []);

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

  // Initial Load - wait for auth before querying Firestore
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
          case "packing":
            return r.servicePacking;
          case "assembly":
            return r.serviceAssembly;
          case "disposal":
            return r.serviceDisposal;
          case "materials":
            return r.servicePackingMaterials;
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

    // Filter by county
    if (filterCounty) {
      arr = arr.filter((r) => {
        return r.fromCounty === filterCounty || r.toCounty === filterCounty;
      });
    }

    // Filter by city (text search)
    if (filterCity) {
      const search = filterCity.toLowerCase().trim();
      arr = arr.filter((r) => {
        return (
          r.fromCity?.toLowerCase().includes(search) ||
          r.toCity?.toLowerCase().includes(search)
        );
      });
    }

    // Filter by rooms
    if (filterRooms) {
      arr = arr.filter((r) => {
        const rooms = Math.max(Number(r.fromRooms) || 0, Number(r.toRooms) || 0);
        switch (filterRooms) {
          case "1": return rooms === 1;
          case "2": return rooms === 2;
          case "3": return rooms === 3;
          case "4": return rooms === 4;
          case "5+": return rooms >= 5;
          default: return true;
        }
      });
    }

    // Filter by floor range
    if (filterFloor) {
      arr = arr.filter((r) => {
        const floors = [r.fromFloor, r.toFloor].filter(Boolean).map(String);
        if (floors.length === 0) return false;
        return floors.some((f) => {
          if (filterFloor === "parter") return /^(parter|demisol|0)$/i.test(f);
          const num = parseInt(f, 10);
          if (isNaN(num)) return false;
          if (filterFloor === "1-3") return num >= 1 && num <= 3;
          if (filterFloor === "4-7") return num >= 4 && num <= 7;
          if (filterFloor === "8+") return num >= 8;
          return true;
        });
      });
    }

    // Filter by media
    if (filterHasMedia) {
      arr = arr.filter((r) => {
        const has = Array.isArray(r.mediaUrls) && r.mediaUrls.length > 0;
        return filterHasMedia === "yes" ? has : !has;
      });
    }

    // Filter by move date range
    if (filterDateFrom || filterDateTo) {
      arr = arr.filter((r) => {
        // Support both legacy moveDate and new moveDateStart/moveDateEnd
        const dateStr = r.moveDateStart || r.moveDate;
        if (!dateStr) return false;
        const moveDate = new Date(dateStr);
        if (filterDateFrom && moveDate < new Date(filterDateFrom)) return false;
        const endStr = r.moveDateEnd || dateStr;
        const endDate = new Date(endStr);
        if (filterDateTo && endDate > new Date(filterDateTo)) return false;
        return true;
      });
    }

    // Filter by offer status (expanded)
    if (filterStatus) {
      arr = arr.filter((r) => {
        const mine = hasMineMap[r.id];
        switch (filterStatus) {
          case "available": return !mine;
          case "offered": return mine && mine.status !== "accepted" && mine.status !== "declined" && mine.status !== "rejected";
          case "accepted": return mine && mine.status === "accepted";
          case "declined": return mine && (mine.status === "declined" || mine.status === "rejected");
          default: return true;
        }
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
    filterCounty,
    filterCity,
    filterRooms,
    filterFloor,
    filterHasMedia,
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
    if (filterCounty) count++;
    if (filterCity) count++;
    if (filterRooms) count++;
    if (filterFloor) count++;
    if (filterHasMedia) count++;
    if (filterDateFrom || filterDateTo) count++;
    if (filterStatus) count++;
    return count;
  }, [
    filterService,
    filterElevator,
    filterPropertyType,
    filterCounty,
    filterCity,
    filterRooms,
    filterFloor,
    filterHasMedia,
    filterDateFrom,
    filterDateTo,
    filterStatus,
  ]);

  const clearAllFilters = () => {
    setFilterService("");
    setFilterElevator("");
    setFilterPropertyType("");
    setFilterCounty("");
    setFilterCity("");
    setFilterRooms("");
    setFilterFloor("");
    setFilterHasMedia("");
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

      // Success - optimistic update
      setHasMineMap((prev) => ({
        ...prev,
        [activeOfferRequest.id]: {
          offerId: result.data?.offerId || "temp",
          status: "pending",
        },
      }));
      checkMyOffers([activeOfferRequest], company.uid);
    } catch (err: unknown) {
      logger.error("Failed to place offer", err);
      const msg =
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Eroare la trimiterea ofertei.";
      alert(msg);
      throw err; // Re-throw so OfferModal keeps the form open for retry
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
          onChange={(e) =>
            setSortBy(e.target.value as "date-desc" | "date-asc")
          }
          aria-label="Sortare cereri"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="date-desc">Cele mai noi</option>
          <option value="date-asc">Cele mai vechi</option>
        </select>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            activeFiltersCount > 0
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
        </button>
      </div>

      {/* Filters Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <FunnelIcon className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Filtre avansate</h3>
                    <p className="text-[11px] text-gray-400">{sortedRequests.length} cereri potrivite</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200/80 hover:text-gray-600 transition"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable filter body */}
              <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
                <div className="flex flex-col gap-5">

                  {/* -- City search -- */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                      Caută oraș
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                      <input
                        type="text"
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        placeholder="Ex: București, Cluj, Timișoara..."
                        className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterCity
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-700 placeholder:text-gray-300"
                        }`}
                      />
                      {filterCity && (
                        <button
                          onClick={() => setFilterCity("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* -- Service type -- */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <TruckIcon className="h-3.5 w-3.5" />
                      Tip serviciu
                    </label>
                    <select
                      value={filterService}
                      onChange={(e) => setFilterService(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        filterService
                          ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      <option value="">Toate serviciile</option>
                      <option value="moving">🚛 Mutare completă</option>
                      <option value="transport">📦 Doar câteva lucruri</option>
                      <option value="packing">📋 Împachetare</option>
                      <option value="assembly">🔧 Montaj / Demontare</option>
                      <option value="disposal">🗑️ Debarasare</option>
                      <option value="materials">✂️ Materiale împachetare</option>
                    </select>
                  </div>

                  {/* -- Location: County -- */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <MapPinIcon className="h-3.5 w-3.5" />
                      Județ
                    </label>
                    <select
                      value={filterCounty}
                      onChange={(e) => setFilterCounty(e.target.value)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        filterCounty
                          ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                          : "border-gray-200 bg-white text-gray-600"
                      }`}
                    >
                      <option value="">Toate județele</option>
                      {counties.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* -- Row: Property + Elevator -- */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <HomeModernIcon className="h-3.5 w-3.5" />
                        Proprietate
                      </label>
                      <select
                        value={filterPropertyType}
                        onChange={(e) =>
                          setFilterPropertyType(e.target.value as "" | "apartment" | "house")
                        }
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterPropertyType
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <option value="">Oricare</option>
                        <option value="apartment">🏢 Apartament</option>
                        <option value="house">🏠 Casă</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Lift
                      </label>
                      <select
                        value={filterElevator}
                        onChange={(e) =>
                          setFilterElevator(e.target.value as "" | "yes" | "no")
                        }
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterElevator
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <option value="">Oricare</option>
                        <option value="yes">✓ Cu lift</option>
                        <option value="no">✗ Fără lift</option>
                      </select>
                    </div>
                  </div>

                  {/* -- Row: Rooms + Floor -- */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Camere
                      </label>
                      <select
                        value={filterRooms}
                        onChange={(e) =>
                          setFilterRooms(e.target.value as "" | "1" | "2" | "3" | "4" | "5+")
                        }
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterRooms
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <option value="">Oricare</option>
                        <option value="1">1 cameră</option>
                        <option value="2">2 camere</option>
                        <option value="3">3 camere</option>
                        <option value="4">4 camere</option>
                        <option value="5+">5+ camere</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Etaj
                      </label>
                      <select
                        value={filterFloor}
                        onChange={(e) =>
                          setFilterFloor(e.target.value as "" | "parter" | "1-3" | "4-7" | "8+")
                        }
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterFloor
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <option value="">Oricare</option>
                        <option value="parter">Parter / Demisol</option>
                        <option value="1-3">Etaj 1 – 3</option>
                        <option value="4-7">Etaj 4 – 7</option>
                        <option value="8+">Etaj 8+</option>
                      </select>
                    </div>
                  </div>

                  {/* -- Row: Status + Media -- */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Status ofertă
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) =>
                          setFilterStatus(e.target.value as "" | "available" | "offered" | "accepted" | "declined")
                        }
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterStatus
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <option value="">Toate</option>
                        <option value="available">🟢 Disponibile</option>
                        <option value="offered">🟡 Ofertă trimisă</option>
                        <option value="accepted">✅ Acceptate</option>
                        <option value="declined">❌ Refuzate</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <PhotoIcon className="h-3.5 w-3.5" />
                        Fotografii
                      </label>
                      <select
                        value={filterHasMedia}
                        onChange={(e) =>
                          setFilterHasMedia(e.target.value as "" | "yes" | "no")
                        }
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          filterHasMedia
                            ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-600"
                        }`}
                      >
                        <option value="">Oricare</option>
                        <option value="yes">📷 Cu fotografii</option>
                        <option value="no">Fără fotografii</option>
                      </select>
                    </div>
                  </div>

                  {/* -- Date range -- */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      Perioadă mutare
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-300 uppercase">De la</span>
                        <input
                          type="date"
                          value={filterDateFrom}
                          onChange={(e) => setFilterDateFrom(e.target.value)}
                          className={`w-full rounded-xl border px-3 pt-5 pb-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                            filterDateFrom
                              ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-300 uppercase">Până la</span>
                        <input
                          type="date"
                          value={filterDateTo}
                          onChange={(e) => setFilterDateTo(e.target.value)}
                          className={`w-full rounded-xl border px-3 pt-5 pb-2 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                            filterDateTo
                              ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                              : "border-gray-200 bg-white text-gray-600"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-6 py-4">
                {activeFiltersCount > 0 ? (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-200/80 hover:text-gray-700"
                  >
                    <ArrowPathIcon className="h-3.5 w-3.5" />
                    Resetează tot
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow active:scale-[0.98]"
                >
                  Aplică
                  {activeFiltersCount > 0 && (
                    <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 mr-1">Filtre active:</span>
          {filterService && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {{
                moving: "Mutare completă",
                transport: "Doar câteva lucruri",
                packing: "Împachetare",
                assembly: "Montaj / Demontare",
                disposal: "Debarasare",
                materials: "Materiale",
              }[filterService] || filterService}
              <button
                onClick={() => setFilterService("")}
                className="hover:text-emerald-900"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {filterPropertyType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterPropertyType === "apartment" ? "Apartament" : "Casă"}
              <button
                onClick={() => setFilterPropertyType("")}
                className="hover:text-emerald-900"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {filterElevator && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterElevator === "yes" ? "Cu lift" : "Fără lift"}
              <button
                onClick={() => setFilterElevator("")}
                className="hover:text-emerald-900"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {filterCounty && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterCounty}
              <button
                onClick={() => setFilterCounty("")}
                className="hover:text-emerald-900"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {filterStatus && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterStatus === "available"
                ? "Disponibile"
                : "Ofertate de mine"}
              <button
                onClick={() => setFilterStatus("")}
                className="hover:text-emerald-900"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {(filterDateFrom || filterDateTo) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {filterDateFrom && filterDateTo
                ? `${filterDateFrom} - ${filterDateTo}`
                : filterDateFrom
                  ? `De la ${filterDateFrom}`
                  : `Până la ${filterDateTo}`}
              <button
                onClick={() => {
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="hover:text-emerald-900"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
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
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          style={{ gridAutoRows: "1fr" }}
        >
          <AnimatePresence>
            {sortedRequests.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
            onClick={() => setDetailRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white p-3 sm:p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDetailRequest(null)}
                className="absolute right-3 top-3 rounded-full bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <TruckIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {detailRequest.fromCity} → {detailRequest.toCity}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {detailRequest.requestCode ||
                      `#${detailRequest.id.slice(0, 8)}`}
                  </p>
                </div>
              </div>
              <RequestFullDetails
                request={detailRequest}
                isOwner={false}
                companyCity={companyProfile?.city}
                companyCounty={companyProfile?.county}
                companyLatLng={
                  !companyProfile?.city && geoLatLng ? geoLatLng : undefined
                }
                onPlaceOffer={() => {
                  setActiveOfferRequest(detailRequest);
                  setDetailRequest(null);
                }}
              />
              <div className="mt-4 border-t border-gray-100 pt-4">
                <button
                  onClick={() => {
                    setActiveOfferRequest(detailRequest);
                    setDetailRequest(null);
                  }}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98]"
                >
                  Plasează o ofertă
                </button>
              </div>
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
        offerCost={
          activeOfferRequest
            ? calculateRequestCost(activeOfferRequest)
            : undefined
        }
      />
    </div>
  );
}
