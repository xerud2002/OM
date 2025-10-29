"use client";

import { useEffect, useState } from "react";
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
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function CompanyDashboard() {
  const [company, setCompany] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState<any | null>(null);

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

  // Counts
  const total = offers.length;
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const pending = offers.filter((o) => !o.status || o.status === "pending").length;
  const rejected = offers.filter((o) => o.status === "rejected").length;

  return (
    <RequireRole allowedRole="company">
      <LayoutWrapper>
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
            Dashboard Companie
          </h1>

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
                className={`border- rounded-xl border bg-white/80 p-4 text-center shadow-sm${item.color}-100`}
              >
                <p className={`text-${item.color}-600 text-lg font-semibold`}>{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent offers */}
          <h2 className="mb-3 text-xl font-semibold text-emerald-700">Oferte recente</h2>

          {loading ? (
            <p className="text-sm italic text-gray-500">Se încarcă datele...</p>
          ) : Array.isArray(offers) && offers.length > 0 ? (
            <div className="space-y-3">
              {offers.slice(0, 5).map((offer) => (
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
                    Cerere #{offer.requestId?.slice(0, 6) ?? "—"}
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
                          : offer.status === "rejected"
                            ? "text-rose-600"
                            : "text-amber-600"
                      } font-medium`}
                    >
                      {offer.status ?? "În așteptare"}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">Nu există oferte recente de afișat.</p>
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
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
