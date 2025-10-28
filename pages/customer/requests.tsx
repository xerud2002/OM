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

  // Auth + Requests
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

          // Listen to offers for each request
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
      <section className="mx-auto max-w-4xl py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Cererile tale de mutare
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 gap-4 rounded-xl border bg-white/80 p-4 shadow backdrop-blur-sm md:grid-cols-2"
        >
          <input
            placeholder="De la oraș"
            value={form.fromCity}
            onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            placeholder="Spre oraș"
            value={form.toCity}
            onChange={(e) => setForm({ ...form, toCity: e.target.value })}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <input
            type="date"
            value={form.moveDate}
            onChange={(e) => setForm({ ...form, moveDate: e.target.value })}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
          <textarea
            placeholder="Detalii mutare"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:col-span-2"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="rounded-lg bg-gradient-to-r from-emerald-600 to-sky-500 py-2 font-semibold text-white shadow transition-all hover:shadow-lg md:col-span-2"
          >
            Trimite cererea
          </motion.button>
        </form>

        {/* Requests List */}
        {requests.length === 0 ? (
          <p className="text-center italic text-gray-500">
            Nu ai nicio cerere activă. Trimite una acum! 💪
          </p>
        ) : (
          <div className="space-y-6">
            {requests.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-white/90 p-5 shadow-md backdrop-blur-md"
              >
                <p className="font-semibold text-emerald-700">
                  {r.fromCity} → {r.toCity}
                </p>
                <p className="mb-3 text-sm text-gray-600">
                  Mutare: {r.moveDate}
                </p>
                <p className="text-sm text-gray-500">{r.details}</p>

                {/* Offers */}
                <div className="mt-4 border-t pt-3">
                  <h4 className="mb-2 font-semibold text-gray-700">
                    Oferte primite
                  </h4>
                  <AnimatePresence>
                    {offers[r.id]?.length ? (
                      offers[r.id].map((offer) => (
                        <motion.div
                          key={offer.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`mb-2 rounded-md border p-3 ${
                            offer.status === "accepted"
                              ? "border-emerald-500 bg-emerald-50"
                              : offer.status === "declined"
                              ? "opacity-60"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-800">
                              {offer.companyName}
                            </p>
                            <p className="font-semibold text-emerald-600">
                              {offer.price} lei
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {offer.message}
                          </p>
                          {offer.status === "accepted" ? (
                            <p className="mt-2 text-xs text-emerald-700">
                              ✅ Ofertă acceptată
                            </p>
                          ) : offer.status === "declined" ? (
                            <p className="mt-2 text-xs text-gray-400">
                              ❌ Ofertă respinsă
                            </p>
                          ) : (
                            <button
                              onClick={() => acceptOffer(r.id, offer.id)}
                              className="mt-2 rounded-md bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
                            >
                              Acceptă ofertă
                            </button>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm italic text-gray-400">
                        Nu există oferte momentan.
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
