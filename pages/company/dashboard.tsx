"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import RequireRole from "@/components/auth/RequireRole";
import RequestsView from "@/components/company/RequestsView";
import NotificationBell from "@/components/company/NotificationBell";
import { db } from "@/services/firebase";
import { onAuthChange } from "@/utils/firebaseHelpers";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  TrendingUp,
  User,
  Settings,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronRight,
  Sparkles,
  BarChart3,
  Bell,
} from "lucide-react";

export default function CompanyDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "accepted" | "pending" | "rejected" | "declined"
  >("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"offers" | "requests">("requests");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // Track logged-in company
  useEffect(() => {
    const unsub = onAuthChange((user) => setCompany(user));
    return () => unsub();
  }, []);

  // Real-time offers listener
  useEffect(() => {
    if (!company?.uid) {
      return;
    }

    const q = query(
      collectionGroup(db, "offers"),
      where("companyId", "==", company.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          requestId: doc.ref.parent.parent?.id,
          ...doc.data() 
        }));
        setOffers(data);
        setLoading(false);
      },
      (err) => {
        console.warn("Error loading offers (this might be normal for new companies):", err);
        // Set empty array instead of error state for better UX
        setOffers([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [company?.uid]);

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const statusOk = statusFilter === "all" ? true : (o.status ?? "pending") === statusFilter;
      const q = search.toLowerCase();
      const text = `${o.message || ""} ${o.requestId || ""}`.toLowerCase();
      return statusOk && (!q || text.includes(q));
    });
  }, [offers, statusFilter, search]);

  // Counts
  const total = offers.length;
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const pending = offers.filter((o) => !o.status || o.status === "pending").length;
  const rejected = offers.filter((o) => o.status === "rejected" || o.status === "declined").length;

  // Edit/delete actions for an offer
  async function updateOffer(offer: any, fields: Partial<any>) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await updateDoc(offerRef, fields);
    } catch (e) {
      console.error("Failed to update offer", e);
    }
  }

  async function removeOffer(offer: any) {
    try {
      if (!offer?.requestId || !offer?.id) return;
      const offerRef = doc(db, "requests", offer.requestId, "offers", offer.id);
      await deleteDoc(offerRef);
    } catch (e) {
      console.error("Failed to delete offer", e);
    }
  }

  return (
    <RequireRole allowedRole="company">
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Hero Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-28 pb-16 sm:pt-32 sm:pb-20">
          {/* Background elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-sky-500/10 blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Panou Companie</span>
                </div>
                <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Bine ai revenit,{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {company?.displayName || "Partener"}
                  </span>
                </h1>
                <p className="max-w-xl text-slate-400">
                  Gestionează cererile clienților și ofertele tale într-un singur loc
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-3"
              >
                {company && <NotificationBell companyId={company.uid} />}
                <button
                  onClick={() => router.push("/company/profile")}
                  className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-3 font-medium text-white backdrop-blur-sm transition-all hover:border-emerald-500/50 hover:bg-slate-800"
                >
                  <Settings className="h-5 w-5 text-slate-400 transition-colors group-hover:text-emerald-400" />
                  <span>Setări profil</span>
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
              <button
                onClick={() => setActiveTab("requests")}
                className={`relative flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  activeTab === "requests"
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeTab === "requests" && (
                  <motion.div
                    layoutId="activeCompanyTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <FileText className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Cereri clienți</span>
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                className={`relative flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  activeTab === "offers"
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {activeTab === "offers" && (
                  <motion.div
                    layoutId="activeCompanyTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Send className="relative z-10 h-4 w-4" />
                <span className="relative z-10">Ofertele mele</span>
                {total > 0 && (
                  <span className="relative z-10 ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
                    {total}
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {activeTab === "requests" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {company ? (
                <RequestsView companyFromParent={company} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  <p className="mt-4 text-sm font-medium text-slate-600">
                    Se încarcă utilizatorul...
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "offers" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Stats Cards */}
              <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  {
                    label: "Total oferte",
                    value: total,
                    icon: BarChart3,
                    gradient: "from-slate-600 to-slate-700",
                    iconBg: "bg-slate-500/20",
                    iconColor: "text-slate-300",
                  },
                  {
                    label: "Acceptate",
                    value: accepted,
                    icon: CheckCircle2,
                    gradient: "from-emerald-500 to-teal-600",
                    iconBg: "bg-emerald-400/20",
                    iconColor: "text-emerald-300",
                  },
                  {
                    label: "În așteptare",
                    value: pending,
                    icon: Clock,
                    gradient: "from-amber-500 to-orange-600",
                    iconBg: "bg-amber-400/20",
                    iconColor: "text-amber-300",
                  },
                  {
                    label: "Respinse",
                    value: rejected,
                    icon: XCircle,
                    gradient: "from-rose-500 to-pink-600",
                    iconBg: "bg-rose-400/20",
                    iconColor: "text-rose-300",
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div
                      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white shadow-lg transition-transform hover:scale-[1.02]`}
                    >
                      {/* Background decoration */}
                      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
                      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

                      <div className="relative flex items-start justify-between">
                        <div>
                          <p className="mb-1 text-sm font-medium text-white/70">{stat.label}</p>
                          <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
                        </div>
                        <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                          <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Send className="h-5 w-5 text-emerald-600" />
                    Ofertele mele
                  </h2>
                </div>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 sm:max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Caută după mesaj sau ID cerere..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="all">Toate statusurile</option>
                      <option value="pending">În așteptare</option>
                      <option value="accepted">Acceptate</option>
                      <option value="declined">Declinate</option>
                      <option value="rejected">Respinse</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Offers List */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                  <p className="mt-4 text-sm font-medium text-slate-600">Se încarcă datele...</p>
                </div>
              ) : Array.isArray(filteredOffers) && filteredOffers.length > 0 ? (
                <div className="space-y-4">
                  {filteredOffers.map((offer, i) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg"
                    >
                      <div className="flex">
                        {/* Color accent bar */}
                        <div
                          className={`w-1.5 ${
                            offer.status === "accepted"
                              ? "bg-gradient-to-b from-emerald-500 to-teal-500"
                              : offer.status === "rejected" || offer.status === "declined"
                                ? "bg-gradient-to-b from-rose-500 to-pink-500"
                                : "bg-gradient-to-b from-amber-500 to-orange-500"
                          }`}
                        />

                        <div className="flex-1 p-5">
                          {/* Header */}
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="mb-2 flex items-center gap-2">
                                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                                  {offer.requestCode
                                    ? offer.requestCode
                                    : offer.requestId
                                      ? `REQ-${String(offer.requestId).slice(0, 6).toUpperCase()}`
                                      : "—"}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                                    offer.status === "accepted"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : offer.status === "rejected" || offer.status === "declined"
                                        ? "bg-rose-100 text-rose-700"
                                        : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {offer.status === "accepted" && (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  )}
                                  {(offer.status === "rejected" || offer.status === "declined") && (
                                    <XCircle className="h-3.5 w-3.5" />
                                  )}
                                  {(!offer.status || offer.status === "pending") && (
                                    <Clock className="h-3.5 w-3.5" />
                                  )}
                                  {offer.status === "accepted"
                                    ? "Acceptată"
                                    : offer.status === "rejected"
                                      ? "Respinsă"
                                      : offer.status === "declined"
                                        ? "Declinată"
                                        : "În așteptare"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2">
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                              <span className="text-lg font-bold text-emerald-700">
                                {offer.price ?? "—"} lei
                              </span>
                            </div>
                          </div>

                          {/* Message preview */}
                          {offer.message && (
                            <p className="mb-4 line-clamp-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                              {offer.message}
                            </p>
                          )}

                          {/* Action buttons */}
                          {offer.companyId === company?.uid && (
                            <div className="border-t border-slate-100 pt-4">
                              {editingId === offer.id ? (
                                <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
                                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                                    <div>
                                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Preț (lei)
                                      </label>
                                      <input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Preț (lei)"
                                      />
                                    </div>
                                    <div>
                                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                                        Mesaj
                                      </label>
                                      <textarea
                                        value={editMessage}
                                        onChange={(e) => setEditMessage(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        placeholder="Mesaj"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        setSavingId(offer.id);
                                        await updateOffer(offer, {
                                          price: Number(editPrice),
                                          message: editMessage,
                                        });
                                        setSavingId(null);
                                        setEditingId(null);
                                      }}
                                      disabled={savingId === offer.id}
                                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-xl disabled:opacity-60"
                                    >
                                      <Save className="h-4 w-4" />
                                      {savingId === offer.id ? "Se salvează..." : "Salvează"}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(null);
                                      }}
                                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                      <X className="h-4 w-4" />
                                      Anulează
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm("Ești sigur că vrei să retragi această ofertă?"))
                                          removeOffer(offer);
                                      }}
                                      className="inline-flex items-center gap-2 rounded-xl border-2 border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Retrage
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(offer.id);
                                      setEditPrice(String(offer.price ?? ""));
                                      setEditMessage(offer.message ?? "");
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                    Editează
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm("Ești sigur că vrei să retragi această ofertă?"))
                                        removeOffer(offer);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Retrage
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <Send className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700">Nu există oferte de afișat</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Trimite oferte la cererile clienților pentru a le vedea aici
                  </p>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
                  >
                    <FileText className="h-5 w-5" />
                    Vezi cererile disponibile
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </RequireRole>
  );
}
