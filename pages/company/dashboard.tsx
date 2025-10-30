"use client";

import { useEffect, useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import { db } from "@/services/firebase";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { collectionGroup, query, where, orderBy, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyDashboard() {
  const [company, setCompany] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "accepted" | "pending" | "rejected" | "declined">("all");
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
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-2 text-center text-3xl font-bold text-emerald-700">Dashboard Companie</h1>
          <div className="mb-8 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab("offers")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === "offers" ? "bg-emerald-600 text-white" : "border bg-white text-gray-700"
              }`}
            >
              Ofertele mele
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeTab === "requests" ? "bg-emerald-600 text-white" : "border bg-white text-gray-700"
              }`}
            >
              Cereri clienți
            </button>
          </div>

          {activeTab === "offers" && (
          <>
          {/* Stats */}
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total oferte", value: total, color: "emerald" },
              { label: "Acceptate", value: accepted, color: "sky" },
              { label: "În așteptare", value: pending, color: "amber" },
              { label: "Respins", value: rejected, color: "rose" },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border bg-white/80 p-4 text-center shadow-sm"
              >
                <p className={`text-${item.color}-600 text-lg font-semibold`}>{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold text-emerald-700">Ofertele mele</h2>
            <div className="flex flex-1 items-center gap-2 md:justify-end">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Caută după mesaj sau ID cerere"
                className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="all">Toate</option>
                <option value="pending">În așteptare</option>
                <option value="accepted">Acceptate</option>
                <option value="declined">Declinate</option>
                <option value="rejected">Respinse</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-sm italic text-gray-500">Se încarcă datele...</p>
          ) : Array.isArray(filteredOffers) && filteredOffers.length > 0 ? (
            <div className="space-y-3">
              {filteredOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedOffer(offer);
                    fetchRequestDetails(offer.requestId);
                  }}
                  className="cursor-pointer rounded-lg border border-emerald-100 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <p className="font-medium text-emerald-700">
                    Cerere #{offer.requestId ? String(offer.requestId).slice(0, 6) : "—"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Preț: <span className="font-semibold">{offer.price ?? "—"} lei</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`${
                        offer.status === "accepted"
                          ? "text-emerald-600"
                          : offer.status === "rejected" || offer.status === "declined"
                          ? "text-rose-600"
                          : "text-amber-600"
                      } font-medium`}
                    >
                      {offer.status ?? "În așteptare"}
                    </span>
                  </p>

                  {/* Inline actions for own offers */}
                  {offer.companyId === company?.uid && (
                    <div className="mt-3 flex flex-col gap-2">
                      {editingId === offer.id ? (
                        <div
                          className="rounded-md border p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full rounded border p-2 text-sm"
                              placeholder="Preț (lei)"
                            />
                            <textarea
                              value={editMessage}
                              onChange={(e) => setEditMessage(e.target.value)}
                              className="w-full rounded border p-2 text-sm"
                              placeholder="Mesaj"
                            />
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
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
                              className="rounded-md bg-emerald-600 px-3 py-1 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              {savingId === offer.id ? "Se salvează..." : "Salvează"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(null);
                              }}
                              className="rounded-md border px-3 py-1 font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Anulează
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Ești sigur că vrei să retragi această ofertă?")) removeOffer(offer);
                              }}
                              className="rounded-md border border-red-200 px-3 py-1 font-medium text-red-600 hover:bg-red-50"
                            >
                              🗑️ Retrage
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
                            className="rounded-md border px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            ✏️ Editează
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Ești sigur că vrei să retragi această ofertă?")) removeOffer(offer);
                            }}
                            className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            🗑️ Retrage
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">Nu există oferte de afișat.</p>
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
                        Data mutării: {requestDetails.moveDate || "-"}
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
                <p className="text-center text-sm italic text-gray-500">Se încarcă utilizatorul...</p>
              )}
            </div>
          )}
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
