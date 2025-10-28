"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { getCustomerRequests, createRequest } from "@/utils/firestoreHelpers";
import { motion } from "framer-motion";

export default function CustomerRequestsPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    moveDate: "",
    details: "",
  });

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        const data = await getCustomerRequests(u.uid);
        setRequests(data);
      }
    });
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await createRequest({
      ...form,
      customerId: user.uid,
      customerName: user.displayName || user.email,
      customerEmail: user.email,
    });
    const data = await getCustomerRequests(user.uid);
    setRequests(data);
    setForm({ fromCity: "", toCity: "", moveDate: "", details: "" });
  };

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-4xl py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Cererile tale de mutare
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-2"
        >
          <input
            placeholder="De la oraș"
            value={form.fromCity}
            onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
            className="rounded border p-2"
            required
          />
          <input
            placeholder="Spre oraș"
            value={form.toCity}
            onChange={(e) => setForm({ ...form, toCity: e.target.value })}
            className="rounded border p-2"
            required
          />
          <input
            type="date"
            value={form.moveDate}
            onChange={(e) => setForm({ ...form, moveDate: e.target.value })}
            className="rounded border p-2"
            required
          />
          <textarea
            placeholder="Detalii"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="rounded border p-2 md:col-span-2"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="rounded bg-emerald-600 py-2 font-semibold text-white md:col-span-2"
          >
            Trimite cererea
          </motion.button>
        </form>

        <h2 className="mb-3 text-2xl font-semibold text-gray-800">
          Istoric cereri
        </h2>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="font-medium text-emerald-700">
                {r.fromCity} → {r.toCity}
              </p>
              <p className="text-sm text-gray-600">Mutare: {r.moveDate}</p>
              <p className="mt-1 text-sm text-gray-500">{r.details}</p>
            </div>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}
