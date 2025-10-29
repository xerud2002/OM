"use client";

import { useEffect, useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import { db } from "@/services/firebase";
import { collection, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { createRequest as createRequestHelper } from "@/utils/firestoreHelpers";
import { Search, Download, Filter, PlusSquare, List, Inbox } from "lucide-react";
import StatCard from "@/components/customer/StatCard";
import RequestCard from "@/components/customer/RequestCard";
import RequestForm from "@/components/customer/RequestForm";

type Request = {
  id: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
  details?: string;
  fromCounty?: string;
  toCounty?: string;
  rooms?: number | string;
  volumeM3?: number;
  phone?: string;
  budgetEstimate?: number;
  needPacking?: boolean;
  hasElevator?: boolean;
  specialItems?: string;
  customerName?: string | null;
  customerEmail?: string | null;
};

type Offer = {
  id: string;
  companyName?: string;
  price?: number;
  message?: string;
  status?: "pending" | "accepted" | "declined";
};

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [offersByRequest, setOffersByRequest] = useState<Record<string, Offer[]>>({});

  const [form, setForm] = useState<any>({
    fromCity: "",
    fromCounty: "",
    toCity: "",
    toCounty: "",
    moveDate: "",
    details: "",
    rooms: "",
    volumeM3: "",
    phone: "",
  });

  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "requests" | "offers">("requests");
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);

  const totalOffers = useMemo(
    () => Object.values(offersByRequest).flat().length,
    [offersByRequest]
  );
  const aggregatedOffers = useMemo(() => Object.values(offersByRequest).flat(), [offersByRequest]);

  const filteredRequests = useMemo(() => {
    let list = requests;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => {
        return (
          (r.fromCity || "").toLowerCase().includes(q) ||
          (r.toCity || "").toLowerCase().includes(q) ||
          (r.details || "").toLowerCase().includes(q)
        );
      });
    }
    if (dateFrom) list = list.filter((r) => r.moveDate && r.moveDate >= dateFrom);
    if (dateTo) list = list.filter((r) => r.moveDate && r.moveDate <= dateTo);
    return list;
  }, [requests, search, dateFrom, dateTo]);

  useEffect(() => {
    const unsubAuth = onAuthChange((u: any) => {
      setUser(u);
      if (!u) return;
      const q = query(
        collection(db, "requests"),
        where("customerId", "==", u.uid),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setRequests(docs);
        setOffersByRequest({});
      });
      return () => unsub();
    });
    return () => unsubAuth();
  }, []);

  const exportCSV = () => {
    try {
      const headers = ["from", "to", "moveDate", "details", "offersCount"];
      const rows = requests.map((r) => [
        r.fromCity || r.fromCounty || "",
        r.toCity || r.toCounty || "",
        r.moveDate || "",
        (offersByRequest[r.id] || []).length,
      ]);
      const csv = [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `requests.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await createRequestHelper({
      ...form,
      customerId: user.uid,
      customerName: user.displayName || user.email,
      customerEmail: user.email,
      createdAt: serverTimestamp(),
    } as any);
    setForm({
      fromCity: "",
      fromCounty: "",
      toCity: "",
      toCounty: "",
      moveDate: "",
      details: "",
      rooms: "",
      volumeM3: "",
      phone: "",
    });
    setActiveTab("requests");
  };

  const resetForm = () =>
    setForm({
      fromCity: "",
      fromCounty: "",
      toCity: "",
      toCounty: "",
      moveDate: "",
      details: "",
      rooms: "",
      volumeM3: "",
      phone: "",
    });

  return (
    <RequireRole allowedRole="customer">
      <LayoutWrapper>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 md:col-span-3">
              <div className="sticky top-28 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-600">Meniu</h3>
                <nav className="flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab("new")}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "new" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50"}`}
                  >
                    <PlusSquare size={16} /> Cerere nouă
                  </button>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "requests" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50"}`}
                  >
                    <List size={16} /> Cererile mele
                  </button>
                  <button
                    onClick={() => setActiveTab("offers")}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${activeTab === "offers" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50"}`}
                  >
                    <Inbox size={16} /> Oferte ({totalOffers})
                  </button>
                </nav>

                <div className="mt-6 border-t pt-4">
                  <p className="text-xs text-gray-500">Scurtaturi</p>
                  <div className="mt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSearch("");
                        setDateFrom(null);
                        setDateTo(null);
                      }}
                      className="text-left text-sm text-gray-600 hover:text-gray-800"
                    >
                      Reset filtre
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <main className="col-span-12 md:col-span-6">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-emerald-700">Panou clienti</h1>
                <div className="flex items-center gap-3">
                  {/* mobile: open modal for new request */}
                  <button
                    onClick={() => setIsFormModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white md:hidden"
                  >
                    <PlusSquare size={14} /> Cerere nouă
                  </button>

                  <div className="hidden items-center gap-3 md:flex">
                    <div className="text-sm text-gray-600">
                      Cereri: <span className="font-semibold">{requests.length}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Oferte: <span className="font-semibold">{totalOffers}</span>
                    </div>
                  </div>
                </div>
              </div>

              {activeTab === "requests" && (
                <>
                  {/* Dashboard header: stat cards */}
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                      title="Cereri"
                      value={requests.length}
                      icon={<List className="text-emerald-600" />}
                    />
                    <StatCard
                      title="Oferte"
                      value={totalOffers}
                      icon={<Inbox className="text-sky-600" />}
                    />
                    <StatCard
                      title="Medie oferte / cerere"
                      value={requests.length ? Math.round(totalOffers / requests.length) : 0}
                      icon={<PlusSquare className="text-amber-600" />}
                    />
                  </div>

                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 text-gray-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Caută oraș, detalii..."
                        className="w-full rounded-lg border border-gray-200 bg-white px-10 py-2 text-sm outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateFrom ?? ""}
                        onChange={(e) => setDateFrom(e.target.value || null)}
                        className="rounded-lg border p-2 text-sm"
                      />
                      <input
                        type="date"
                        value={dateTo ?? ""}
                        onChange={(e) => setDateTo(e.target.value || null)}
                        className="rounded-lg border p-2 text-sm"
                      />
                      <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                      >
                        <Download size={14} /> Export CSV
                      </button>
                      <button
                        onClick={() => {
                          setSearch("");
                          setDateFrom(null);
                          setDateTo(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                      >
                        <Filter size={14} /> Reset
                      </button>
                    </div>
                  </div>

                  {filteredRequests.length === 0 ? (
                    <p className="text-center italic text-gray-500">Nu ai nicio cerere activă.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredRequests.map((r) => (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <RequestCard r={r} offers={offersByRequest[r.id] || []} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "offers" && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Toate ofertele</h3>
                  {aggregatedOffers.length === 0 ? (
                    <p className="text-sm italic text-gray-500">Nu există oferte.</p>
                  ) : (
                    <div className="space-y-3">
                      {aggregatedOffers.map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center justify-between rounded-md border bg-white p-3 shadow-sm"
                        >
                          <div>
                            <p className="font-medium">{o.companyName}</p>
                            {o.message && <p className="text-sm text-gray-500">{o.message}</p>}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-emerald-700">{o.price} lei</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>

            <aside className="col-span-12 md:col-span-3">
              <div className="sticky top-28 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <RequestForm
                  form={form}
                  setForm={setForm}
                  onSubmit={handleSubmit}
                  onReset={resetForm}
                />
              </div>
            </aside>
          </div>
        </section>
      </LayoutWrapper>
      {/* Mobile modal for new request */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFormModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full rounded-t-2xl bg-white p-4 shadow-lg sm:max-w-md sm:rounded-2xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Cerere nouă</h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Închide"
              >
                ✕
              </button>
            </div>
            <RequestForm
              form={form}
              setForm={setForm}
              onSubmit={(e) => {
                handleSubmit(e);
                setIsFormModalOpen(false);
              }}
              onReset={resetForm}
            />
          </div>
        </div>
      )}
    </RequireRole>
  );
}
