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
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { formatMoveDateDisplay } from "@/utils/date";
import { onAuthChange } from "@/utils/firebaseHelpers";
import PlaceOfferForm from "@/components/company/PlaceOfferForm";

import {
  ChatBubbleLeftEllipsisIcon,
  CalendarIcon,
  TruckIcon,
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  HomeModernIcon // For detailed view
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

// Compact request card with expand/collapse functionality
function RequestCardCompact({
  request,
  company,
  hasMine,
  onUpdateHasMine,
  onChat,
}: {
  request: MovingRequest;
  company: CompanyUser;
  hasMine?: boolean | string;
  // eslint-disable-next-line no-unused-vars
  onUpdateHasMine?: (arg: boolean | string) => void;
  // eslint-disable-next-line no-unused-vars
  onChat?: (requestId: string, offerId: string) => void;
}) {
  const [paidAccess, setPaidAccess] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [myOfferId, setMyOfferId] = useState<string | null>(null);
  const r = request;

  // Check if company has already paid for this request or placed an offer
  useEffect(() => {
    const checkStatus = async () => {
      if (!company?.uid || !r.id) {
        setCheckingPayment(false);
        return;
      }

      try {

        // but here we know the request path: requests/{r.id}/offers
        // We need to find if *we* made an offer. 
        // We should query where("companyId", "==", company.uid)
        // This requires composite index usually? specific subcollection queries might not.
        // Actually for specific path (requests/ID/offers), no index needed for simple filter.

        // However, standard querying requires "companyId" field in the offer doc.
        // Let's assume we store it.
        const q = query(collection(db, "requests", r.id, "offers"), where("companyId", "==", company.uid));
        const offerSnap = await getDocs(q);

        if (!offerSnap.empty) {
          const oid = offerSnap.docs[0].id;
          setPaidAccess(true);
          setMyOfferId(oid);
          if (onUpdateHasMine) onUpdateHasMine(oid);
          return; // Done
        }

        // 2. Fallback: check legacy payments (if any)
        const paymentRef = doc(db, `companies/${company.uid}/payments/${r.id}`);
        const paymentSnap = await getDoc(paymentRef);

        if (paymentSnap.exists() && paymentSnap.data()?.status === "completed") {
          setPaidAccess(true);
          // Payment exists but maybe no offer yet? Or offer in process?
          if (onUpdateHasMine) {
            onUpdateHasMine(true);
          }
        }
      } catch (err) {
        console.error("Error checking payment/offer:", err);
      } finally {
        setCheckingPayment(false);
      }
    };

    checkStatus();
  }, [company?.uid, r.id, onUpdateHasMine]);

  const handleOfferPlaced = (offerId?: string) => {
    setPaidAccess(true);
    if (offerId) setMyOfferId(offerId);
    if (onUpdateHasMine) {
      onUpdateHasMine(offerId || true);
    }
  };

  return (
    <div id={`request-${r.id}`} className="print:break-inside-avoid">
      {/* Header - always visible */}
      <div onClick={() => setIsExpanded(!isExpanded)} className="group cursor-pointer">
        {/* Main header row */}
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Left: Code + Client */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-sm font-bold text-transparent sm:text-base">
                {(r as any).requestCode || r.id.substring(0, 8)}
              </span>

               {/* Date Badge - Visible in Header */}
               <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200/60">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>
                  {(() => {
                    const d = formatMoveDateDisplay(r as any, { month: "short" });
                     return d && d !== "-" ? d : "Flexibil";
                  })()}
                </span>
               </div>
            </div>

            {/* Route indicator - desktop */}
            <div className="hidden items-center gap-1.5 text-xs sm:flex">
              <span className="font-semibold text-slate-700">
                {(r as any).fromCounty || r.fromCity}
              </span>
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="font-semibold text-slate-700">
                {(r as any).toCounty || r.toCity}
              </span>
            </div>

            </div>

            {/* Services Icons - Header */}
            <div className="hidden items-center gap-2 lg:flex">
               {(r as any).serviceMoving && (
                  <div className="rounded-full bg-indigo-50 p-1 text-indigo-600 ring-1 ring-indigo-100" title="Transport">
                    <TruckIcon className="h-3.5 w-3.5" />
                  </div>
               )}
               {(r as any).servicePacking && (
                  <div className="rounded-full bg-indigo-50 p-1 text-indigo-600 ring-1 ring-indigo-100" title="Ambalare">
                    <ArchiveBoxIcon className="h-3.5 w-3.5" />
                  </div>
               )}
               {(r as any).serviceDisassembly && (
                  <div className="rounded-full bg-indigo-50 p-1 text-indigo-600 ring-1 ring-indigo-100" title="Demontare/Montare">
                    <WrenchScrewdriverIcon className="h-3.5 w-3.5" />
                  </div>
               )}
                {((r as any).serviceCleanout || (r as any).serviceStorage) && (
                  <div className="rounded-full bg-indigo-50 p-1 text-indigo-600 ring-1 ring-indigo-100" title="Alte servicii">
                    <HomeModernIcon className="h-3.5 w-3.5" />
                  </div>
               )}
            </div>

            {/* Property badges - inline after route */}
            <div className="hidden flex-wrap items-center gap-1.5 xl:flex">
              {(r as any).fromRooms && (
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                  {(r as any).fromRooms} cam
                </span>
              )}
              {(r as any).fromType && (
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                  {(r as any).fromType === "house" ? "Casă" : "Apt"}
                </span>
              )}
               {(r as any).fromFloor !== undefined && (r as any).fromType !== "house" && (
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                  Et. {(r as any).fromFloor}
                </span>
              )}
              {(r as any).fromElevator !== undefined && (r as any).fromType !== "house" && (
                <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${(r as any).fromElevator ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "bg-red-50 text-red-700 ring-1 ring-red-100"}`}>
                  {(r as any).fromElevator ? "Lift" : "Fără lift"}
                </span>
              )}
            </div>

          {/* Right: Rooms badge + Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {(r as any).rooms && (
              <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm shadow-indigo-200 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-xs">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {(r as any).rooms} cam
              </span>
            )}

            {/* Expand/Collapse button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all duration-200 print:hidden sm:gap-1.5 sm:rounded-xl sm:px-4 sm:py-2 sm:text-xs ${isExpanded
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200"
                : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200 group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:text-emerald-600 group-hover:ring-emerald-200"
                }`}
            >
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </motion.svg>
              {isExpanded ? "Închide" : "Vezi"}
            </button>
          </div>
        </div>

        {/* Mobile: Route + badges on second line */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs sm:hidden">
          <span className="font-medium text-slate-600">{(r as any).fromCounty || r.fromCity}</span>
          <svg className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="font-medium text-slate-600">{(r as any).toCounty || r.toCity}</span>
          
          {/* Property badges on mobile */}
          {(r as any).fromRooms && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
              {(r as any).fromRooms} cam
            </span>
          )}
          {(r as any).fromType && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
              {(r as any).fromType === "house" ? "Casă" : "Apt"}
            </span>
          )}
          {(r as any).fromFloor !== undefined && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
              Et.{(r as any).fromFloor}
            </span>
          )}
          {(r as any).fromElevator !== undefined && (
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${(r as any).fromElevator ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
              {(r as any).fromElevator ? "Lift" : "Fără lift"}
            </span>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4 print:space-y-2">
              {/* Contact Info - Only show if paid/has access */}
              {(paidAccess || hasMine) && (
                <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50/30 p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Date de Contact</span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {(r.customerName || (r as any).contactFirstName) && (
                      <div className="flex items-center gap-3 rounded-xl bg-white/60 p-2.5 ring-1 ring-slate-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                            Nume
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {r.customerName ||
                              `${(r as any).contactFirstName || ""} ${(r as any).contactLastName || ""}`.trim()}
                          </p>
                        </div>
                      </div>
                    )}

                    {r.customerEmail && (
                      <div className="flex items-center gap-3 rounded-xl bg-white/60 p-2.5 ring-1 ring-slate-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-sm">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                            Email
                          </p>
                          <p className="truncate text-sm font-bold text-slate-700">
                            {r.customerEmail}
                          </p>
                        </div>
                      </div>
                    )}

                    {(r as any).phone && (
                      <div className="flex items-center gap-3 rounded-xl bg-white/60 p-2.5 ring-1 ring-slate-100">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-sm">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                            Telefon
                          </p>
                          <p className="text-sm font-bold text-slate-700">{(r as any).phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location details - Two column layout */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* From Location */}
                <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 to-amber-50/30 p-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 shadow-sm">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold tracking-wide text-orange-600 uppercase">
                      Colectare
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {(r as any).fromCounty || ""}
                    {(r as any).fromCounty && ", "}
                    {r.fromCity}
                  </p>
                  {paidAccess || hasMine
                    ? ((r as any).fromStreet || (r as any).fromAddress) && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {(r as any).fromStreet && `Str. ${(r as any).fromStreet}`}
                        {!(r as any).fromStreet &&
                          (r as any).fromAddress &&
                          (r as any).fromAddress}
                        {(r as any).fromNumber && ` nr. ${(r as any).fromNumber}`}
                        {(r as any).fromBloc && `, Bl. ${(r as any).fromBloc}`}
                        {(r as any).fromStaircase && `, Sc. ${(r as any).fromStaircase}`}
                        {(r as any).fromApartment && `, Ap. ${(r as any).fromApartment}`}
                      </p>
                    )
                    : ((r as any).fromStreet || (r as any).fromAddress) && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {(r as any).fromStreet && `Str. ${(r as any).fromStreet}`}
                        {!(r as any).fromStreet && (r as any).fromAddress}
                      </p>
                    )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(r as any).fromRooms && (
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {(r as any).fromRooms} camere
                      </span>
                    )}
                    {(r as any).fromType && (
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {(r as any).fromType === "house" ? "Casă" : "Apartament"}
                      </span>
                    )}
                    {(r as any).fromFloor !== undefined && (
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        Etaj {(r as any).fromFloor}
                      </span>
                    )}
                    {(r as any).fromElevator !== undefined && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${(r as any).fromElevator
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                          : "bg-red-50 text-red-500 ring-red-200"
                          }`}
                      >
                        {(r as any).fromElevator ? "Cu lift" : "Fără lift"}
                      </span>
                    )}
                  </div>
                </div>

                {/* To Location */}
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/30 p-4">
                  <div className="mb-2.5 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold tracking-wide text-emerald-600 uppercase">
                      Livrare
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {(r as any).toCounty || ""}
                    {(r as any).toCounty && ", "}
                    {r.toCity}
                  </p>
                  {paidAccess || hasMine
                    ? ((r as any).toStreet || (r as any).toAddress) && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {(r as any).toStreet && `Str. ${(r as any).toStreet}`}
                        {!(r as any).toStreet && (r as any).toAddress && (r as any).toAddress}
                        {(r as any).toNumber && ` nr. ${(r as any).toNumber}`}
                        {(r as any).toBloc && `, Bl. ${(r as any).toBloc}`}
                        {(r as any).toStaircase && `, Sc. ${(r as any).toStaircase}`}
                        {(r as any).toApartment && `, Ap. ${(r as any).toApartment}`}
                      </p>
                    )
                    : ((r as any).toStreet || (r as any).toAddress) && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {(r as any).toStreet && `Str. ${(r as any).toStreet}`}
                        {!(r as any).toStreet && (r as any).toAddress}
                      </p>
                    )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(r as any).toRooms && (
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {(r as any).toRooms} camere
                      </span>
                    )}
                    {(r as any).toType && (
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {(r as any).toType === "house" ? "Casă" : "Apartament"}
                      </span>
                    )}
                    {(r as any).toFloor !== undefined && (
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                        Etaj {(r as any).toFloor}
                      </span>
                    )}
                    {(r as any).toElevator !== undefined && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ${(r as any).toElevator
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                          : "bg-red-50 text-red-500 ring-red-200"
                          }`}
                      >
                        {(r as any).toElevator ? "Cu lift" : "Fără lift"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom info row: Date + Services + Survey */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Move date */}
                <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 ring-1 ring-amber-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm">
                    <svg
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-medium tracking-wide text-amber-500 uppercase">
                      Data mutării
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {(() => {
                        const d = formatMoveDateDisplay(r as any, { month: "short" });
                        return d && d !== "-" ? d : "Flexibilă";
                      })()}
                    </span>
                  </div>
                </div>

                {/* Survey type */}
                {(r as any).surveyType && (
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2 ring-1 ring-rose-100">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 shadow-sm">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-medium tracking-wide text-rose-400 uppercase">
                        Tip evaluare
                      </span>
                      <span className="text-xs font-bold text-rose-700">
                        {(r as any).surveyType === "in-person" && "La fața locului"}
                        {(r as any).surveyType === "video" && "Video call"}
                        {(r as any).surveyType === "quick-estimate" && "Estimare rapidă"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Media indicator */}
                {(r as any).mediaUrls && (r as any).mediaUrls.length > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 ring-1 ring-blue-100">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 shadow-sm">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-700">
                      {(r as any).mediaUrls.length} fișiere
                    </span>
                  </div>
                )}
              </div>

              {/* Services requested */}
              {((r as any).serviceMoving ||
                (r as any).servicePacking ||
                (r as any).serviceDisassembly ||
                (r as any).serviceCleanout ||
                (r as any).serviceStorage) && (
                  <div className="flex flex-wrap gap-2">
                    {(r as any).serviceMoving && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                          />
                        </svg>
                        Transport
                      </span>
                    )}
                    {(r as any).servicePacking && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                        Ambalare
                      </span>
                    )}
                    {(r as any).serviceDisassembly && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Demontare/Montare
                      </span>
                    )}
                    {(r as any).serviceCleanout && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Debarasare
                      </span>
                    )}
                    {(r as any).serviceStorage && (
                      <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1.5 text-[11px] font-bold text-violet-700 ring-1 ring-violet-200">
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                          />
                        </svg>
                        Depozitare
                      </span>
                    )}
                  </div>
                )}

              {/* Details/notes */}
              {r.details && (
                <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-gray-50/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-gray-500 shadow-sm">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                      Detalii suplimentare
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{r.details}</p>
                </div>
              )}

              {/* Action button */}
              {company ? (
                <>
                  {checkingPayment ? (
                    <div className="flex items-center justify-center rounded-xl bg-slate-50 p-4 print:hidden">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                        <span>Verificare acces...</span>
                      </div>
                    </div>
                  ) : !hasMine && !paidAccess ? (
                    <div className="print:hidden">
                      <PlaceOfferForm
                        request={r}
                        company={company}
                        onOfferPlaced={handleOfferPlaced}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 print:hidden">
                      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 ring-1 ring-emerald-200">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-sm">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-bold text-emerald-700">
                          Ai trimis o ofertă pentru această cerere
                        </span>
                      </div>

                      {myOfferId && onChat && (
                        <button
                          onClick={() => onChat(r.id, myOfferId)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-700"
                        >
                          <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                          Chat cu clientul
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400 italic print:hidden">
                  Trebuie să fii autentificat pentru a trimite oferte.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [hasMineMap, setHasMineMap] = useState<Record<string, boolean | string>>({});
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auth (if not provided by parent)
  useEffect(() => {
    if (companyFromParent) return;
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, [companyFromParent]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
          .filter((req) => {
            // Show requests that are not closed, cancelled, or archived
            const isVisible =
              !req.status ||
              req.status === "active" ||
              req.status === "accepted" ||
              req.status === "pending";
            const notArchived = !req.archived;
            return isVisible && notArchived;
          });
        setFirstPage(list);
        setLoading(false);
        const last = snapshot.docs[snapshot.docs.length - 1] || null;
        setLastDoc(last);
        setHasMore(snapshot.size === PAGE_SIZE);
      },
      (error) => {
        console.warn("Error loading requests (this might be normal for new companies):", error);
        // Set empty state instead of error for better UX
        setFirstPage([]);
        setLoading(false);
        setHasMore(false);
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
        return [...prev, ...list.filter((x) => !seen.has(x.id))];
      });
      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.size === PAGE_SIZE);
    } catch (error) {
      console.warn("Error loading more requests:", error);
      // Stop trying to load more if there are permission errors
      setHasMore(false);
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

      // Show "Nou!" for recent posts (less than 1 hour)
      if (hours < 1) return "Nou!";

      // Show the actual date and time
      const date = new Date(ms);
      const day = date.getDate().toString().padStart(2, "0");
      const months = [
        "Ian",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Iun",
        "Iul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[date.getMonth()];
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      return `${day} ${month}, ${hour}:${minute}`;
    },
    [currentTime]
  );

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
        <p className="text-center text-gray-500">Se încarcă cererile...</p>
      ) : sortedRequests.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center text-slate-400"
        >
          Momentan nu există cereri noi.
        </motion.p>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {sortedRequests.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className="group/card relative overflow-hidden rounded-xl border border-slate-200/60 bg-gradient-to-br from-white via-white to-slate-50/80 px-3 py-3 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 sm:rounded-2xl sm:px-5 sm:py-4"
              >
                {/* Decorative gradient bar */}
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-80" />

                {r.createdAt && (
                  <div className="mb-2 flex items-center sm:mb-3">
                    <span
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase shadow-sm sm:gap-1.5 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-wider ${getTimeAgo(r.createdAt) === "Nou!"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 ring-1 ring-slate-200"
                        }`}
                    >
                      <svg
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {getTimeAgo(r.createdAt)}
                    </span>
                  </div>
                )}

                <RequestCardCompact
                  request={r}
                  company={company}
                  hasMine={hasMineMap[r.id]}
                  onUpdateHasMine={(has: boolean | string) =>
                    setHasMineMap((prev) => ({ ...prev, [r.id]: has }))
                  }
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
    </div>
  );
}

