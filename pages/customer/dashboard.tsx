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

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "requests" | "offers">("requests");

  useEffect(() => {
    const unsubAuth = onAuthChange((u) => {
      setUser(u);
      if (!u) return;

      const q = query(
        collection(db, "requests"),
        where("customerId", "==", u.uid),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(q, (snap) => {
        const rs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Request[];
        setRequests(rs);

        // subscribe to offers for each request
        rs.forEach((r) => {
          const offersQ = query(
            collection(db, "requests", r.id, "offers"),
            orderBy("price", "asc")
          );
          onSnapshot(offersQ, (os) => {
            setOffersByRequest((prev) => ({
              ...prev,
              [r.id]: os.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
            }));
          });
        });
      });

      return () => unsub();
    });

    return () => unsubAuth();
  }, []);

  const totalOffers = useMemo(
    () => Object.values(offersByRequest).flat().length,
    [offersByRequest]
  );
  const aggregatedOffers = useMemo(() => Object.values(offersByRequest).flat(), [offersByRequest]);

  const filteredRequests = useMemo(() => {
    const s = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (s) {
        const hay =
          `${r.fromCounty ?? ""} ${r.fromCity ?? ""} ${r.toCounty ?? ""} ${r.toCity ?? ""} ${r.details ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (dateFrom && r.moveDate && new Date(r.moveDate) < new Date(dateFrom)) return false;
      if (dateTo && r.moveDate && new Date(r.moveDate) > new Date(dateTo)) return false;
      return true;
    });
  }, [requests, search, dateFrom, dateTo]);

  const exportCSV = () => {
    const rows = filteredRequests.map((r) => ({
      id: r.id,
      fromCounty: r.fromCounty ?? "",
      fromCity: r.fromCity ?? "",
      toCounty: r.toCounty ?? "",
      toCity: r.toCity ?? "",
      moveDate: r.moveDate ?? "",
      rooms: r.rooms ?? "",
      volumeM3: r.volumeM3 ?? "",
      budgetEstimate: r.budgetEstimate ?? "",
      needPacking: r.needPacking ? "Da" : "Nu",
      hasElevator: r.hasElevator ? "Da" : "Nu",
      phone: r.phone ?? "",
      details: (r.details ?? "").replace(/\n/g, " "),
    }));

    if (!rows.length) return;
    const header = Object.keys(rows[0]);
    const csv = [header.join(",")]
      .concat(
        rows.map((row) =>
          header.map((h) => `"${String((row as any)[h] ?? "").replace(/"/g, '""')}"`).join(",")
        )
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
                <div className="hidden items-center gap-3 md:flex">
                  <div className="text-sm text-gray-600">
                    Cereri: <span className="font-semibold">{requests.length}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Oferte: <span className="font-semibold">{totalOffers}</span>
                  </div>
                </div>
              </div>

              {activeTab === "requests" && (
                <>
                  {/* Dashboard header: stat cards */}
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                      <div
                        className="flex items-center justify-center rounded-md bg-emerald-50"
                        style={{ height: 48, width: 48 }}
                      >
                        <List className="text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Cereri</div>
                        <div className="text-2xl font-bold text-emerald-700">{requests.length}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                      <div
                        className="flex items-center justify-center rounded-md bg-sky-50"
                        style={{ height: 48, width: 48 }}
                      >
                        <Inbox className="text-sky-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Oferte</div>
                        <div className="text-2xl font-bold text-emerald-700">{totalOffers}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                      <div
                        className="flex items-center justify-center rounded-md bg-amber-50"
                        style={{ height: 48, width: 48 }}
                      >
                        <PlusSquare className="text-amber-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Medie oferte / cerere</div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {requests.length ? Math.round(totalOffers / requests.length) : 0}
                        </div>
                      </div>
                    </div>
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
                          className="relative overflow-hidden rounded-xl border bg-white p-4 shadow hover:shadow-md"
                        >
                          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500/60" />
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-emerald-700">
                                  {r.fromCity || r.fromCounty} → {r.toCity || r.toCounty}
                                </h3>
                                <span className="text-sm text-gray-400">{r.moveDate}</span>
                              </div>
                              <p className="mt-2 text-sm text-gray-600">{r.details}</p>

                              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                {r.rooms && (
                                  <span>
                                    Camere:{" "}
                                    <span className="font-medium text-gray-700">{r.rooms}</span>
                                  </span>
                                )}
                                {typeof r.volumeM3 !== "undefined" && (
                                  <span>
                                    Volum:{" "}
                                    <span className="font-medium text-gray-700">
                                      {r.volumeM3} m³
                                    </span>
                                  </span>
                                )}
                                {r.budgetEstimate && (
                                  <span>
                                    Buget:{" "}
                                    <span className="font-medium text-gray-700">
                                      {r.budgetEstimate} RON
                                    </span>
                                  </span>
                                )}
                                <span>
                                  Ambalare:{" "}
                                  <span className="font-medium text-gray-700">
                                    {r.needPacking ? "Da" : "Nu"}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="flex w-40 flex-col items-end gap-2">
                              <div className="text-sm text-gray-500">Oferte</div>
                              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                                {(offersByRequest[r.id] || []).length}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 border-t pt-4">
                            <h4 className="mb-2 text-sm font-semibold text-gray-700">
                              Oferte primite
                            </h4>
                            <div className="space-y-2">
                              {(offersByRequest[r.id] || []).length ? (
                                (offersByRequest[r.id] || []).map((o) => (
                                  <div
                                    key={o.id}
                                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-800">{o.companyName}</p>
                                      {o.message && (
                                        <p className="text-sm text-gray-500">{o.message}</p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-semibold text-emerald-700">
                                        {o.price} lei
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm italic text-gray-400">Nicio ofertă.</p>
                              )}
                            </div>
                          </div>
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
                <h3 className="mb-3 text-sm font-semibold text-gray-600">Trimite o cerere</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div>
                    <label className="block text-xs text-gray-600">Localitate plecare</label>
                    <input
                      value={form.fromCity}
                      onChange={(e) => setForm((s: any) => ({ ...s, fromCity: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Județ plecare</label>
                    <input
                      value={form.fromCounty}
                      onChange={(e) => setForm((s: any) => ({ ...s, fromCounty: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Localitate destinație</label>
                    <input
                      value={form.toCity}
                      onChange={(e) => setForm((s: any) => ({ ...s, toCity: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Județ destinație</label>
                    <input
                      value={form.toCounty}
                      onChange={(e) => setForm((s: any) => ({ ...s, toCounty: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Data</label>
                    <input
                      type="date"
                      value={form.moveDate}
                      onChange={(e) => setForm((s: any) => ({ ...s, moveDate: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Camere (estimare)</label>
                    <input
                      value={form.rooms}
                      onChange={(e) => setForm((s: any) => ({ ...s, rooms: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Telefon</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((s: any) => ({ ...s, phone: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Detalii</label>
                    <textarea
                      value={form.details}
                      onChange={(e) => setForm((s: any) => ({ ...s, details: e.target.value }))}
                      className="w-full rounded-md border p-2 text-sm"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-95"
                    >
                      Trimite
                    </button>
                    <button
                      type="button"
                      onClick={() =>
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
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </aside>
          </div>
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
