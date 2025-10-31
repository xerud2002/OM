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
import { sendEmail } from "@/utils/emailHelpers";
import RequestCard from "@/components/customer/RequestCard";
import OfferComparison from "@/components/customer/OfferComparison";
import RequestForm from "@/components/customer/RequestForm";
import { useDebouncedValue } from "@/utils/hooks";

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
    moveDateMode: "exact",
    moveDateStart: "",
    moveDateEnd: "",
    moveDateFlexDays: 3,
    details: "",
    rooms: "",
    volumeM3: "",
    phone: "",
    contactName: "",
    needPacking: false,
    hasElevator: false,
    budgetEstimate: 0,
    specialItems: "",
    serviceMoving: false,
    servicePacking: false,
    serviceDisassembly: false,
    serviceCleanout: false,
    serviceStorage: false,
    surveyType: "quick-estimate",
    mediaUpload: "later",
    mediaFiles: [],
  });

  const [search, setSearch] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "requests" | "offers">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customerActiveTab");
      if (saved === "new" || saved === "requests" || saved === "offers") return saved;
    }
    return "requests";
  });
  // Two-column layout: we render selected content on the right; no modal needed
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "offers-desc" | "offers-asc">(
    "date-desc"
  );

  const totalOffers = useMemo(
    () => Object.values(offersByRequest).flat().length,
    [offersByRequest]
  );
  const aggregatedOffers = useMemo(() => Object.values(offersByRequest).flat(), [offersByRequest]);

  // Handlers to accept/decline from aggregated view
  const acceptFromAggregated = async (requestId: string, offerId: string) => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }
      toast.success("Oferta a fost acceptată!");
    } catch (err) {
      console.error("Failed to accept offer", err);
      toast.error("Eroare la acceptarea ofertei");
    }
  };

  const declineFromAggregated = async (requestId: string, offerId: string) => {
    const { toast } = await import("sonner");
    try {
      if (!user) {
        toast.error("Trebuie să fii autentificat");
        return;
      }
      const token = await user.getIdToken();
      const resp = await fetch("/api/offers/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, offerId }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${resp.status}`);
      }
      toast.success("Oferta a fost refuzată");
    } catch (err) {
      console.error("Failed to decline offer", err);
      toast.error("Eroare la refuzarea ofertei");
    }
  };

  const debouncedSearch = useDebouncedValue(search, 250);

  const filteredRequests = useMemo(() => {
    let list = requests;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
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
  }, [requests, debouncedSearch, dateFrom, dateTo]);

  const sortedRequests = useMemo(() => {
    const list = [...filteredRequests];
    const getCreated = (r: any) =>
      r.createdAt?.toMillis ? r.createdAt.toMillis() : r.createdAt || 0;
    const getOffers = (r: any) => offersByRequest[r.id]?.length ?? 0;
    switch (sortBy) {
      case "date-asc":
        return list.sort((a: any, b: any) => getCreated(a) - getCreated(b));
      case "offers-desc":
        return list.sort((a: any, b: any) => getOffers(b) - getOffers(a));
      case "offers-asc":
        return list.sort((a: any, b: any) => getOffers(a) - getOffers(b));
      case "date-desc":
      default:
        return list.sort((a: any, b: any) => getCreated(b) - getCreated(a));
    }
  }, [filteredRequests, sortBy, offersByRequest]);

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
        setLoading(false);
      });
      return () => unsub();
    });
    return () => unsubAuth();
  }, []);

  // Real-time offers listener for all user requests
  useEffect(() => {
    if (requests.length === 0) return;

    const unsubscribers: Array<() => void> = [];

    requests.forEach((r) => {
      const offersQuery = query(
        collection(db, "requests", r.id, "offers"),
        orderBy("createdAt", "desc")
      );
      const unsub = onSnapshot(offersQuery, (snap) => {
        const offersList = snap.docs.map((d) => ({
          id: d.id,
          requestId: r.id,
          ...(d.data() as any),
        }));
        setOffersByRequest((prev) => ({ ...prev, [r.id]: offersList }));
      });
      unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [requests]);

  // Persist activeTab across sessions
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("customerActiveTab", activeTab);
    }
  }, [activeTab]);

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

    const { toast } = await import("sonner");

    try {
      // Create request in Firestore
      const requestId = await createRequestHelper({
        ...form,
        customerId: user.uid,
        customerName: user.displayName || user.email,
        customerEmail: user.email,
        createdAt: serverTimestamp(),
      } as any);

      // If user chose "later" for media upload, generate upload link and send email
      if (form.mediaUpload === "later") {
        try {
          const resp = await fetch("/api/generateUploadLink", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId,
              customerEmail: user.email,
              customerName: user.displayName || user.email,
            }),
          });
          const result = await resp.json();

          if (result.ok && result.uploadLink) {
            const emailParams = {
              to_email: result.customerEmail,
              to_name: result.customerName || "Client",
              upload_link: result.uploadLink,
            };
            try {
              await sendEmail(emailParams);
              toast.success(
                "Cererea a fost trimisă! Vei primi un email cu link pentru upload poze."
              );
            } catch (emailError) {
              console.error("Email send error:", emailError);
              toast.warning("Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis.");
            }
          } else {
            toast.warning("Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis.");
          }
        } catch (err) {
          console.warn("Failed to generate upload link", err);
          toast.warning("Cererea a fost trimisă, dar emailul cu link nu a putut fi trimis.");
        }
      } else {
        toast.success("Cererea a fost trimisă cu succes!");
      }

      setForm({
        fromCity: "",
        fromCounty: "",
        toCity: "",
        toCounty: "",
        moveDate: "",
        moveDateMode: "exact",
        moveDateStart: "",
        moveDateEnd: "",
        moveDateFlexDays: 3,
        details: "",
        rooms: "",
        volumeM3: "",
        phone: "",
        contactName: "",
        needPacking: false,
        hasElevator: false,
        budgetEstimate: 0,
        specialItems: "",
        serviceMoving: false,
        servicePacking: false,
        serviceDisassembly: false,
        serviceCleanout: false,
        serviceStorage: false,
        surveyType: "quick-estimate",
        mediaUpload: "later",
        mediaFiles: [],
      });
      setActiveTab("requests");
    } catch (err) {
      console.error("Failed to submit request", err);
      toast.error("Eroare la trimiterea cererii. Te rugăm să încerci din nou.");
    }
  };

  const resetForm = () =>
    setForm({
      fromCity: "",
      fromCounty: "",
      toCity: "",
      toCounty: "",
      moveDate: "",
      moveDateMode: "exact",
      moveDateStart: "",
      moveDateEnd: "",
      moveDateFlexDays: 3,
      details: "",
      rooms: "",
      volumeM3: "",
      phone: "",
      contactName: "",
      needPacking: false,
      hasElevator: false,
      budgetEstimate: 0,
      specialItems: "",
      serviceMoving: false,
      servicePacking: false,
      serviceDisassembly: false,
      serviceCleanout: false,
      serviceStorage: false,
      surveyType: "quick-estimate",
      mediaUpload: "later",
      mediaFiles: [],
    });

  return (
    <RequireRole allowedRole="customer">
      <LayoutWrapper>
        <section className="mx-auto max-w-[1400px] px-4 py-8">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bună, {user?.displayName || "Client"}!
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestionează cererile tale de mutare și ofertele primite
                </p>
              </div>
              <button
                onClick={() => setActiveTab("new")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
              >
                <PlusSquare size={20} />
                Cerere nouă
              </button>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600">Cereri active</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{requests.length}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-100 p-3">
                    <List size={24} className="text-emerald-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-emerald-100 opacity-20" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-sky-600">Oferte primite</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{totalOffers}</p>
                  </div>
                  <div className="rounded-xl bg-sky-100 p-3">
                    <Inbox size={24} className="text-sky-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-sky-100 opacity-20" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Medie oferte</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {requests.length ? (totalOffers / requests.length).toFixed(1) : "0"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-amber-100 p-3">
                    <PlusSquare size={24} className="text-amber-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 h-24 w-24 rounded-full bg-amber-100 opacity-20" />
              </motion.div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("requests")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "requests" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <List size={18} />
                <span>Cererile mele</span>
              </div>
              {activeTab === "requests" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("offers")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "offers" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox size={18} />
                <span>Oferte</span>
                {totalOffers > 0 && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    {totalOffers}
                  </span>
                )}
              </div>
              {activeTab === "offers" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("new")}
              className={`relative px-6 py-3 font-medium transition-colors ${
                activeTab === "new" ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <PlusSquare size={18} />
                <span>Cerere nouă</span>
              </div>
              {activeTab === "new" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                />
              )}
            </button>
          </div>

          {activeTab === "requests" && (
            <>
              {/* Filters & Search */}
              <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Caută după oraș sau detalii..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition-all hover:border-gray-300"
                  >
                    <option value="date-desc">Cele mai noi</option>
                    <option value="date-asc">Cele mai vechi</option>
                    <option value="offers-desc">Cele mai multe oferte</option>
                    <option value="offers-asc">Cele mai puține oferte</option>
                  </select>
                  <input
                    type="date"
                    value={dateFrom ?? ""}
                    onChange={(e) => setDateFrom(e.target.value || null)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all hover:border-gray-300"
                  />
                  <input
                    type="date"
                    value={dateTo ?? ""}
                    onChange={(e) => setDateTo(e.target.value || null)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all hover:border-gray-300"
                  />
                  <button
                    onClick={exportCSV}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800"
                  >
                    <Download size={16} /> Export
                  </button>
                  <button
                    onClick={() => {
                      setSearch("");
                      setDateFrom(null);
                      setDateTo(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition-all hover:border-gray-300"
                  >
                    <Filter size={16} /> Reset
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-4 text-sm text-gray-500">Se încarcă cererile...</p>
                  </div>
                </div>
              ) : sortedRequests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
                >
                  <div className="rounded-full bg-emerald-100 p-4">
                    <List size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Nicio cerere încă</h3>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Creează prima ta cerere de mutare și primește oferte de la firme verificate
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <PlusSquare size={20} />
                    Creează prima cerere
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {sortedRequests.map((r, index) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <RequestCard r={r} offers={offersByRequest[r.id] || []} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "new" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg"
            >
              <RequestForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onReset={resetForm}
              />
            </motion.div>
          )}

          {activeTab === "offers" && (
            <div className="space-y-6">
              {aggregatedOffers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center"
                >
                  <div className="rounded-full bg-sky-100 p-4">
                    <Inbox size={32} className="text-sky-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Nicio ofertă primită</h3>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Ofertele vor apărea aici după ce firmele de mutări vor răspunde la cererile tale
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Toate ofertele</h3>
                    <div className="space-y-3">
                      {aggregatedOffers.map((o, index) => (
                        <motion.div
                          key={o.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4 transition-all hover:shadow-md"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{o.companyName}</p>
                            {o.message && <p className="mt-1 text-sm text-gray-500">{o.message}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">{o.price} lei</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Compară oferte</h3>
                    <OfferComparison
                      offers={(aggregatedOffers as any[]).map((o) => ({
                        id: o.id,
                        requestId: (o as any).requestId,
                        companyName: (o as any).companyName,
                        price: (o as any).price,
                        message: (o as any).message,
                        status: (o as any).status,
                        createdAt: (o as any).createdAt,
                        favorite: false,
                      }))}
                      onAccept={acceptFromAggregated}
                      onDecline={declineFromAggregated}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
