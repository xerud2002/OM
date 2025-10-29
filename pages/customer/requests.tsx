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
import { onAuthChange } from "@/utils/firebaseHelpers";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

  // 🔹 Verificare autentificare
  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  // 🔹 Ascultă cererile utilizatorului
  useEffect(() => {
    if (!user) return;
    // Use customerId for consistency with dashboard and form submissions
    const q = query(
      collection(db, "requests"),
      where("customerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const reqs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Request[];
      setRequests(reqs);
    });

    return () => unsub();
  }, [user]);

  // 🔹 Ascultă ofertele pentru fiecare cerere
  useEffect(() => {
    if (!requests.length) return;

    const unsubs = requests.map((req) => {
      const offersRef = collection(db, "requests", req.id, "offers");
      const q = query(offersRef, orderBy("createdAt", "desc"));

      return onSnapshot(q, (snap) => {
        const offerList = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Offer[];
        setOffers((prev) => ({ ...prev, [req.id]: offerList }));
      });
    });

    return () => unsubs.forEach((u) => u());
  }, [requests]);

  // 🔹 Trimitere nouă cerere
  const handleNewRequest = async () => {
    if (!user) return toast.error("Trebuie să fii autentificat pentru a trimite o cerere.");

    const newRequest = {
      fromCity: "București",
      toCity: "Cluj-Napoca",
      moveDate: new Date().toISOString().split("T")[0],
      details: "Mutare locuință completă, apartament 2 camere",
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "requests"), newRequest);
    toast.success("Cererea ta a fost trimisă cu succes!");
  };

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-emerald-700">Cererile mele de mutare</h1>
          <p className="mt-2 text-gray-600">
            Vizualizează cererile tale active și ofertele primite de la firme.
          </p>
          <button
            onClick={handleNewRequest}
            className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-2 font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            + Creează o cerere nouă
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="mt-10 text-center text-gray-500">
            Nu ai nicio cerere momentan.
            <br />
            <button
              onClick={handleNewRequest}
              className="mt-4 rounded-lg bg-emerald-500 px-5 py-2 font-medium text-white shadow hover:bg-emerald-600"
            >
              Adaugă prima cerere
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-emerald-700">
                        {req.fromCity} → {req.toCity}
                      </h2>
                      <p className="text-sm text-gray-600">Data mutării: {req.moveDate}</p>
                      <p className="mt-1 text-sm text-gray-500">{req.details}</p>
                    </div>
                  </div>

                  {/* === Oferte primite === */}
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">Oferte primite:</h3>
                    {offers[req.id]?.length ? (
                      <ul className="space-y-2">
                        {offers[req.id].map((offer) => (
                          <li
                            key={offer.id}
                            className="flex flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center"
                          >
                            <div>
                              <p className="font-medium text-emerald-700">{offer.companyName}</p>
                              <p className="text-sm text-gray-600">{offer.message}</p>
                            </div>
                            <p className="mt-2 text-right text-lg font-semibold text-sky-600 sm:mt-0">
                              {offer.price} RON
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Nicio ofertă momentan.</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </LayoutWrapper>
  );
}
