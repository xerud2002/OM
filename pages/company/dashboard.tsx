"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { db } from "@/services/firebase";
import {
  collectionGroup,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

type Offer = {
  id: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  requestId: string;
  status?: "pending" | "accepted" | "declined";
  createdAt?: any;
};

export default function CompanyDashboard() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Listen to company authentication
  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setCompany(u);
    });
    return () => unsub();
  }, []);

  // 🔹 Fetch all offers made by this company
  useEffect(() => {
    if (!company?.uid) return;

    const q = query(
      collectionGroup(db, "offers"),
      where("companyId", "==", company.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Offer)
      );
      setOffers(data);
      setLoading(false);
    });

    return () => unsub();
  }, [company]);

  const stats = {
    total: offers.length,
    accepted: offers.filter((o) => o.status === "accepted").length,
    pending: offers.filter((o) => !o.status || o.status === "pending").length,
    declined: offers.filter((o) => o.status === "declined").length,
  };

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Dashboard Companie
        </h1>

        {/* STATS CARDS */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={<TrendingUp className="text-emerald-600" size={28} />}
            label="Total oferte"
            value={stats.total}
          />
          <StatCard
            icon={<CheckCircle className="text-emerald-600" size={28} />}
            label="Acceptate"
            value={stats.accepted}
          />
          <StatCard
            icon={<Clock className="text-yellow-500" size={28} />}
            label="În așteptare"
            value={stats.pending}
          />
          <StatCard
            icon={<XCircle className="text-red-500" size={28} />}
            label="Respinse"
            value={stats.declined}
          />
        </div>

        {/* RECENT OFFERS */}
        <div className="rounded-xl border bg-white/90 p-5 shadow backdrop-blur-md">
          <h2 className="mb-4 text-xl font-semibold text-emerald-700">
            Oferte recente
          </h2>

          {loading ? (
            <p className="text-gray-500">Se încarcă datele...</p>
          ) : offers.length === 0 ? (
            <p className="italic text-gray-400">
              Nu ai trimis încă nicio ofertă.
            </p>
          ) : (
            <div className="space-y-3">
              {offers.slice(0, 10).map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col rounded-lg border bg-gray-50 p-3 transition hover:bg-emerald-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Cerere #{offer.requestId.slice(0, 6)}...
                    </p>
                    <p className="text-xs text-gray-500">{offer.message}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-3 sm:mt-0">
                    <p className="font-semibold text-emerald-700">
                      {offer.price} lei
                    </p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        offer.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : offer.status === "declined"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {offer.status === "accepted"
                        ? "Acceptată"
                        : offer.status === "declined"
                        ? "Respinsă"
                        : "În așteptare"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </LayoutWrapper>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-white p-4 text-center shadow"
    >
      <div className="mb-2">{icon}</div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-emerald-700">{value}</p>
    </motion.div>
  );
}
