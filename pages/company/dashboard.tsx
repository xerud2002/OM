"use client";

import { useEffect, useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import { db } from "@/services/firebase";
import { onAuthChange } from "@/utils/firebaseHelpers";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { formatMoveDateDisplay } from "@/utils/date";

export default function CompanyDashboard() {
  const [company, setCompany] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "accepted" | "pending" | "rejected" | "declined"
  >("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"offers" | "requests">("offers");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // Track logged-in company
  useEffect(() => {
    const unsub = onAuthChange((user) => setCompany(user));
    return () => unsub();
  }, []);

  // Real-time offers listener
  useEffect(() => {
    if (!company?.uid) return;

    const q = query(
      collectionGroup(db, "offers"),
      where("companyId", "==", company.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOffers(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading offers:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [company?.uid]);

  // Fetch request details for modal
  const fetchRequestDetails = async (requestId: string) => {
    try {
      if (!requestId) {
        setRequestDetails(null);
        return;
      }
      const reqRef = doc(db, "requests", requestId);
      const reqSnap = await getDoc(reqRef);
      if (reqSnap.exists()) {
        setRequestDetails(reqSnap.data());
      } else {
        setRequestDetails(null);
      }
    } catch (err) {
      console.error("Error fetching request details:", err);
    }
  };

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const statusOk = statusFilter === "all" ? true : (o.status ?? "pending") === statusFilter;
      const q = search.toLowerCase();
      const text = `${o.message || ""} ${o.requestId || ""}`.toLowerCase();
      return statusOk && (!q || text.includes(q));
    });
  }, [offers, statusFilter, search]);

  // Counts
  const total = offers.length;
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const pending = offers.filter((o) => !o.status || o.status === "pending").length;
  const rejected = offers.filter((o) => o.status === "rejected" || o.status === "declined").length;

  // Edit/delete actions for an offer
  async function updateOffer(offer: any, fields: Partial<any>) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await updateDoc(offerRef, fields);
    } catch (e) {
      console.error("Failed to update offer", e);
    }
  }

  async function removeOffer(offer: any) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await deleteDoc(offerRef);
    } catch (e) {
      console.error("Failed to delete offer", e);
    }
  }

  return (
    <RequireRole allowedRole="company">
      <LayoutWrapper>
        <section className="mx-auto max-w-7xl px-4 py-10">
          {/* Hero Header */}
          <div className="mb-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-sky-600 p-8 text-white shadow-xl">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="mb-2 text-4xl font-bold">Dashboard Companie</h1>
                <p className="text-emerald-50">
                  Bine ai revenit, {company?.displayName || "Companie"}!
                </p>
              </div>
              <button className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-600 shadow-lg transition hover:bg-emerald-50">
                Profil companie
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8 flex justify-center gap-2 rounded-xl bg-gray-100 p-1.5">
            <button
              onClick={() => setActiveTab("offers")}
              className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "offers"
                  ? "bg-white text-emerald-700 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {activeTab === "offers" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-white shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Ofertele mele</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`relative rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "requests"
                  ? "bg-white text-emerald-700 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {activeTab === "requests" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-lg bg-white shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Cereri clienți</span>
            </button>
          </div>

          {activeTab === "offers" && (
            <>
              {/* Stats Cards */}
              <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg transition-transform hover:scale-105"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10"></div>
                  <div className="relative">
                    <p className="mb-1 text-sm font-medium text-emerald-100">Total oferte</p>
                    <p className="text-4xl font-bold">{total}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white shadow-lg transition-transform hover:scale-105"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10"></div>
                  <div className="relative">
                    <p className="mb-1 text-sm font-medium text-sky-100">Acceptate</p>
                    <p className="text-4xl font-bold">{accepted}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white shadow-lg transition-transform hover:scale-105"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10"></div>
                  <div className="relative">
                    <p className="mb-1 text-sm font-medium text-amber-100">În așteptare</p>
                    <p className="text-4xl font-bold">{pending}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-6 text-white shadow-lg transition-transform hover:scale-105"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                  <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10"></div>
                  <div className="relative">
                    <p className="mb-1 text-sm font-medium text-rose-100">Respinse</p>
                    <p className="text-4xl font-bold">{rejected}</p>
                  </div>
                </motion.div>
              </div>

              {/* Filters */}
              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Ofertele mele</h2>
                  <div className="flex flex-1 items-center gap-3 md:justify-end">
                    <div className="relative flex-1 md:max-w-xs">
                      <svg
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Caută după mesaj sau ID cerere"
                        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="all">Toate</option>
                      <option value="pending">În așteptare</option>
                      <option value="accepted">Acceptate</option>
                      <option value="declined">Declinate</option>
                      <option value="rejected">Respinse</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
                  <p className="mt-4 text-sm font-medium text-gray-600">Se încarcă datele...</p>
                </div>
              ) : Array.isArray(filteredOffers) && filteredOffers.length > 0 ? (
                <div className="space-y-4">
                  {filteredOffers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      onClick={() => {
                        setSelectedOffer(offer);
                        fetchRequestDetails(offer.requestId);
                      }}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-emerald-300 hover:shadow-lg"
                    >
                      <div className="flex">
                        {/* Color accent bar */}
                        <div
                          className={`w-1.5 ${
                            offer.status === "accepted"
                              ? "bg-gradient-to-b from-emerald-500 to-sky-500"
                              : offer.status === "rejected" || offer.status === "declined"
                                ? "bg-gradient-to-b from-rose-500 to-rose-600"
                                : "bg-gradient-to-b from-amber-500 to-amber-600"
                          }`}
                        ></div>

                        <div className="flex-1 p-5">
                          {/* Header */}
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <p className="mb-1 text-lg font-bold text-gray-900">
                                Cerere #
                                {offer.requestId ? String(offer.requestId).slice(0, 8) : "—"}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
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
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                  </svg>
                                  {offer.price ?? "—"} lei
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold ${
                                    offer.status === "accepted"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : offer.status === "rejected" || offer.status === "declined"
                                        ? "bg-rose-100 text-rose-700"
                                        : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {offer.status === "accepted" && (
                                    <svg
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                  {offer.status ?? "În așteptare"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message preview */}
                          {offer.message && (
                            <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                              {offer.message}
                            </p>
                          )}

                          {/* Action buttons */}
                          {offer.companyId === company?.uid && (
                            <div className="mt-4 border-t border-gray-100 pt-4">
                              {editingId === offer.id ? (
                                <div
                                  className="rounded-xl border-2 border-emerald-200 bg-emerald-50/30 p-4"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="mb-3 flex flex-col gap-3 sm:flex-row">
                                    <div className="flex-1">
                                      <label className="mb-1 block text-xs font-medium text-gray-700">
                                        Preț (lei)
                                      </label>
                                      <input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Preț (lei)"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="mb-1 block text-xs font-medium text-gray-700">
                                        Mesaj
                                      </label>
                                      <textarea
                                        value={editMessage}
                                        onChange={(e) => setEditMessage(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Mesaj"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        setSavingId(offer.id);
                                        await updateOffer(offer, {
                                          price: Number(editPrice),
                                          message: editMessage,
                                        });
                                        setSavingId(null);
                                        setEditingId(null);
                                      }}
                                      disabled={savingId === offer.id}
                                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
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
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      {savingId === offer.id ? "Se salvează..." : "Salvează"}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(null);
                                      }}
                                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                      Anulează
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          confirm("Ești sigur că vrei să retragi această ofertă?")
                                        )
                                          removeOffer(offer);
                                      }}
                                      className="inline-flex items-center gap-2 rounded-lg border-2 border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
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
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      Retrage
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(offer.id);
                                      setEditPrice(String(offer.price ?? ""));
                                      setEditMessage(offer.message ?? "");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Editează
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm("Ești sigur că vrei să retragi această ofertă?"))
                                        removeOffer(offer);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
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
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Retrage
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 py-20 text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-semibold text-gray-700">
                    Nu există oferte de afișat
                  </p>
                  <p className="mt-2 text-sm text-gray-500">Ofertele tale vor apărea aici</p>
                </div>
              )}
            </>
          )}

          {/* Offer details modal */}
          <AnimatePresence>
            {selectedOffer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setSelectedOffer(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-800 shadow-xl"
                >
                  <h3 className="mb-2 text-lg font-bold text-emerald-700">Detalii ofertă</h3>
                  <p className="mb-1 text-sm">
                    <strong>Preț:</strong> {selectedOffer.price} lei
                  </p>
                  <p className="mb-1 text-sm">
                    <strong>Status:</strong> {selectedOffer.status ?? "În așteptare"}
                  </p>
                  <p className="mb-3 text-sm">
                    <strong>Mesaj:</strong> {selectedOffer.message || "Fără mesaj adăugat."}
                  </p>

                  {requestDetails && (
                    <div className="mt-4 border-t pt-3">
                      <h4 className="text-md mb-1 font-semibold text-gray-700">Detalii cerere:</h4>
                      <p className="text-sm">
                        {requestDetails.fromCity} → {requestDetails.toCity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Data mutării: {(() => {
                          const d = formatMoveDateDisplay(requestDetails as any, { month: "short" });
                          return d && d !== "-" ? d : "-";
                        })()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Detalii: {requestDetails.details || "—"}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedOffer(null)}
                    className="mt-6 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-sky-500 py-2 font-semibold text-white transition hover:opacity-90"
                  >
                    Închide
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === "requests" && (
            <div className="mt-6">
              {/** Reuse the same requests view from company requests page */}
              {company ? (
                (() => {
                  const RequestsView = require("@/components/company/RequestsView").default;
                  return <RequestsView companyFromParent={company} />;
                })()
              ) : (
                <p className="text-center text-sm italic text-gray-500">
                  Se încarcă utilizatorul...
                </p>
              )}
            </div>
          )}
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
