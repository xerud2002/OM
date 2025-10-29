"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { acceptOffer } from "@/utils/firestoreHelpers";
import { Building2, CalendarDays, Coins } from "lucide-react";

// 🔹 Types
type Request = {
  id: string;
  fromCity: string;
  toCity: string;
  moveDate: string;
  details: string;
};

type Offer = {
  id: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined";
};

export default function CustomerRequestsPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [offers, setOffers] = useState<Record<string, Offer[]>>({});
  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    moveDate: "",
    details: "",
  });

  // 🔸 Auth + Requests
  useEffect(() => {
    const unsubAuth = onAuthChange((u) => {
      setUser(u);
      if (u) {
        const q = query(
          collection(db, "requests"),
          where("customerId", "==", u.uid),
          orderBy("createdAt", "desc")
        );
        const unsubReq = onSnapshot(q, (snapshot) => {
          const reqs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Request[];
          setRequests(reqs);

          // Listen for offers on each request
          reqs.forEach((r) => {
            const offersQuery = query(
              collection(db, "requests", r.id, "offers"),
              orderBy("price", "asc")
            );
            onSnapshot(offersQuery, (snap) => {
              setOffers((prev) => ({
                ...prev,
                [r.id]: snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Offer[],
              }));
            });
          });
        });
        return () => unsubReq();
      }
    });
    return () => unsubAuth();
  }, []);

  // 🔸 Submit new request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "requests"), {
      ...form,
      customerId: user.uid,
      customerName: user.displayName || user.email,
      customerEmail: user.email,
      createdAt: serverTimestamp(),
    });
    setForm({ fromCity: "", toCity: "", moveDate: "", details: "" });
  };

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-emerald-700">
          Cererile tale de mutare
        </h1>

        {/* 🟢 Request form */}
        <motion.form
          onSubmit={handleSubmit}
          whileHover={{ scale: 1.01 }}
          className="mb-10 grid grid-cols-1 gap-4 rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md backdrop-blur-sm md:grid-cols-2"
        >
          <input
            placeholder="De la oraș"
            value={form.fromCity}
            onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
            className="rounded-lg border border-gray-200 p-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            placeholder="Spre oraș"
            value={form.toCity}
            onChange={(e) => setForm({ ...form, toCity: e.target.value })}
            className="rounded-lg border border-gray-200 p-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            required
          />
          <input
            type="date"
            value={form.moveDate}
            onChange={(e) => setForm({ ...form, moveDate: e.target.value })}
            className="rounded-lg border border-gray-200 p-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400"
            required
          />
          <textarea
            placeholder="Detalii despre mutare (ex: volum, etaj, lift, etc.)"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="rounded-lg border border-gray-200 p-2.5 text-sm shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 md:col-span-2"
            required
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-sky-500 py-2.5 font-semibold text-white shadow-md transition-all hover:opacity-95 md:col-span-2"
          >
            Trimite cererea
          </motion.button>
        </motion.form>

        {/* 🧳 Requests List */}
        {requests.length === 0 ? (
          <p className="text-center italic text-gray-500">
            Nu ai nicio cerere activă momentan. Trimite una nouă! 💪
          </p>
        ) : (
          <div className="space-y-8">
            {requests.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white/95 p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-700">
                      {r.fromCity} → {r.toCity}
                    </h3>
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <CalendarDays size={14} /> {r.moveDate}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 md:mt-0">
                    {r.details}
                  </p>
                </div>

                {/* Offers */}
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <h4 className="mb-3 font-semibold text-gray-700">
                    Oferte primite
                  </h4>

                  <AnimatePresence>
                    {offers[r.id]?.length ? (
                      offers[r.id].map((offer) => (
                        <motion.div
                          key={offer.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`mb-3 rounded-xl border p-4 transition ${
                            offer.status === "accepted"
                              ? "border-emerald-400 bg-emerald-50"
                              : offer.status === "declined"
                              ? "border-gray-200 opacity-70"
                              : "border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <p className="flex items-center gap-2 font-medium text-gray-800">
                                <Building2 size={16} className="text-emerald-500" />
                                {offer.companyName}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-600">
                                <Coins size={14} className="text-emerald-500" />
                                {offer.price} lei
                              </p>
                            </div>
                            {offer.status === "accepted" ? (
                              <p className="text-xs font-medium text-emerald-700">
                                ✅ Acceptată
                              </p>
                            ) : offer.status === "declined" ? (
                              <p className="text-xs text-gray-400">❌ Respinsă</p>
                            ) : (
                              <button
                                onClick={() => acceptOffer(r.id, offer.id)}
                                className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white shadow transition hover:bg-emerald-700"
                              >
                                Acceptă
                              </button>
                            )}
                          </div>
                          {offer.message && (
                            <p className="mt-2 text-sm italic text-gray-600">
                              „{offer.message}”
                            </p>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm italic text-gray-400">
                        Nu există oferte pentru această cerere încă.
                      </p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </LayoutWrapper>
  );
}
