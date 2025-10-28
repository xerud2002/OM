"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthChange } from "@/utils/firebaseHelpers";
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

// 🔹 Live offers list under each request
function OffersList({ requestId }: { requestId: string }) {
  const [offers, setOffers] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const offersRef = collection(db, "requests", requestId, "offers");
    const q = query(offersRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setOffers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [requestId]);

  return (
    <div className="mt-3 border-t pt-3">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-sm font-medium text-emerald-600 hover:underline"
      >
        {expanded
          ? "Ascunde ofertele ▲"
          : `Afișează ofertele (${offers.length}) ▼`}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-3 space-y-3"
          >
            {offers.length === 0 ? (
              <p className="text-sm italic text-gray-400">
                Nicio ofertă disponibilă momentan.
              </p>
            ) : (
              offers.map((o) => (
                <motion.div
                  key={o.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-md border bg-emerald-50 p-3 shadow-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-emerald-700">
                      {o.companyName}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      💰 {o.price} lei
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{o.message}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CustomerRequestsPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    moveDate: "",
    details: "",
  });
  const [loading, setLoading] = useState(true);

  // Listen for auth + live requests
  useEffect(() => {
    const unsubAuth = onAuthChange((u) => {
      setUser(u);
      if (u) {
        const q = query(
          collection(db, "requests"),
          where("customerId", "==", u.uid),
          orderBy("createdAt", "desc")
        );
        const unsubSnapshot = onSnapshot(q, (snapshot) => {
          setRequests(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
        return () => unsubSnapshot();
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
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Cererile tale de mutare
        </h1>

        {/* === Form === */}
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

        {/* === Requests List === */}
        {loading ? (
          <p className="text-center text-gray-500">Se încarcă cererile...</p>
        ) : requests.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center italic text-gray-500"
          >
            Nu ai nicio cerere activă. Trimite una acum! 💪
          </motion.p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border bg-white/90 p-4 shadow-sm backdrop-blur-md transition-all hover:shadow-md"
                >
                  <p className="font-semibold text-emerald-700">
                    {r.fromCity} → {r.toCity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mutare: {r.moveDate || "-"}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{r.details}</p>

                  {/* 🔹 Offers displayed below each request */}
                  <OffersList requestId={r.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </LayoutWrapper>
  );
}
