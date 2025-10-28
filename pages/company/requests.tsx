"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { db } from "@/services/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { addOffer } from "@/utils/firestoreHelpers";
import { onAuthChange } from "@/utils/firebaseHelpers";


    // 🧩 Offer form component
    type OfferFormProps = {
    requestId: string;
    company: {
        uid: string;
        displayName?: string | null;
        email?: string | null;
    } | null;
    };

    function OfferForm({ requestId, company }: OfferFormProps) {
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;
        setSending(true);
        try {
        await addOffer(requestId, {
            companyId: company.uid,
            companyName: company.displayName || company.email,
            price: Number(price),
            message,
        });
        setPrice("");
        setMessage("");
        } catch (err) {
        console.error("Error sending offer:", err);
        } finally {
        setSending(false);
        }
    };

    return (
        <form
        onSubmit={handleSend}
        className="mt-3 flex flex-col gap-2 border-t pt-3 text-sm"
        >
        <input
            type="number"
            placeholder="Preț estimativ (lei)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
        />
        <textarea
            placeholder="Mesaj pentru client"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
        />
        <button
            type="submit"
            disabled={sending}
            className={`rounded-md py-2 font-semibold text-white transition-all ${
            sending
                ? "cursor-not-allowed bg-gray-400"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
        >
            {sending ? "Se trimite..." : "Trimite ofertă"}
        </button>
        </form>
    );
    }


    // 🧩 Main component
    export default function CompanyRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<any>(null);

    // Get company user
    useEffect(() => {
        const unsubAuth = onAuthChange((u) => setCompany(u));
        return () => unsubAuth();
    }, []);

    // Real-time Firestore listener
    useEffect(() => {
        const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
        setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
        });
        return () => unsub();
    }, []);

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Cereri primite de la clienți
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Se încarcă cererile...</p>
        ) : requests.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center italic text-gray-500"
          >
            Momentan nu există cereri noi. 💤
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence>
              {requests.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border bg-white/90 p-5 shadow-md backdrop-blur-md transition-all hover:shadow-lg"
                >
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-emerald-700">
                      {r.customerName || "Client anonim"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {r.fromCity} → {r.toCity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mutare: {r.moveDate || "-"}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">{r.details}</p>
                  </div>

                  {/* Only show OfferForm if company is logged in */}
                  {company ? (
                    <OfferForm requestId={r.id} company={company} />
                  ) : (
                    <p className="mt-3 text-sm italic text-gray-400">
                      Trebuie să fii autentificat pentru a trimite oferte.
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </LayoutWrapper>
  );
}
