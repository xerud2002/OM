import { useEffect, useState, useCallback } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/services/firebaseHelpers";
import { logger } from "@/utils/logger";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  FunnelChart, Funnel, LabelList,
} from "recharts";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  StarIcon,
  ArrowPathIcon,
  InboxStackIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import Link from "next/link";

const PIE_COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#6366f1"];

interface DashboardStats {
  kpis: {
    totalCustomers: number;
    totalCompanies: number;
    verifiedCompanies: number;
    pendingVerifications: number;
    totalRequests: number;
    totalOffers: number;
    totalReviews: number;
    pendingFraudFlags: number;
    avgRating: number;
    acceptanceRate: number;
  };
  trends: {
    requests: number;
    customers: number;
    offers30d: number;
    requests30d: number;
  };
  charts: {
    requestsTimeline: { date: string; count: number }[];
    serviceDistribution: { name: string; value: number }[];
    topRoutes: { route: string; count: number }[];
    funnel: { stage: string; count: number }[];
  };
  recent: {
    requests: number;
    offers: number;
    reviews: number;
  };
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  // Fetch stats from API
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    try {
      if (!user) return;
      const token = await user.getIdToken();
      if (!token) return;

      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      } else {
        setStatsError(json.error || "Eroare la încărcarea statisticilor");
      }
    } catch (err) {
      logger.error("Failed to fetch stats", err);
      setStatsError("Eroare de rețea");
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user, fetchStats]);

  // Listen for pending verifications
  useEffect(() => {
    const q = query(
      collection(db, "companies"),
      where("verificationStatus", "==", "pending"),
      orderBy("verificationSubmittedAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const companies = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPendingCompanies(companies);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleApprove = async (companyId: string) => {
    if (!window.confirm("Confirm aprovare?")) return;
    setProcessingId(companyId);
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "verified",
        verified: true,
        verifiedAt: serverTimestamp(),
        rejectionReason: null
      });
    } catch (e) {
      logger.error(e);
      alert("Eroare la aprovare");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (companyId: string) => {
    if (!rejectReason.trim()) {
      alert("Introduceți motivul respingerii");
      return;
    }
    setProcessingId(companyId);
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "rejected",
        verified: false,
        rejectionReason: rejectReason,
        rejectedAt: serverTimestamp()
      });
      setRejectingId(null);
      setRejectReason("");
    } catch (e) {
      logger.error(e);
      alert("Eroare la respingere");
    } finally {
      setProcessingId(null);
    }
  };

  const k = stats?.kpis;
  const t = stats?.trends;
  const c = stats?.charts;

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={user}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="mt-1 text-sm text-gray-500">
                Prezentare generală a platformei Ofertemutare.ro
              </p>
            </div>
            <button
              onClick={fetchStats}
              disabled={statsLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} />
              Actualizare
            </button>
          </div>

          {statsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {statsError}
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Utilizatori"
              value={k?.totalCustomers ?? 0}
              icon={UsersIcon}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              trend={t?.customers}
              trendLabel="vs luna trecută"
              loading={statsLoading}
            />
            <StatCard
              label="Total Companii"
              value={k?.totalCompanies ?? 0}
              icon={BuildingOfficeIcon}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              loading={statsLoading}
            />
            <StatCard
              label="Companii Verificate"
              value={k?.verifiedCompanies ?? 0}
              icon={CheckCircleSolid}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
              loading={statsLoading}
            />
            <StatCard
              label="Total Cereri"
              value={k?.totalRequests ?? 0}
              icon={DocumentDuplicateIcon}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              trend={t?.requests}
              trendLabel="vs luna trecută"
              loading={statsLoading}
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              label="Oferte (30 zile)"
              value={t?.offers30d ?? 0}
              icon={InboxStackIcon}
              iconBg="bg-cyan-100"
              iconColor="text-cyan-600"
              loading={statsLoading}
            />
            <StatCard
              label="Rată Acceptare"
              value={`${k?.acceptanceRate ?? 0}%`}
              icon={CheckCircleIcon}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              loading={statsLoading}
            />
            <StatCard
              label="Rating Mediu"
              value={k?.avgRating ?? 0}
              icon={StarIcon}
              iconBg="bg-yellow-100"
              iconColor="text-yellow-600"
              loading={statsLoading}
            />
            <StatCard
              label="Fraud Flags"
              value={k?.pendingFraudFlags ?? 0}
              icon={ShieldExclamationIcon}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              loading={statsLoading}
              onClick={() => window.location.href = "/admin/fraud-flags"}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Requests Timeline */}
            <ChartCard title="Cereri / zi" subtitle="Ultimele 30 zile" loading={statsLoading}>
              {c?.requestsTimeline && (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={c.requestsTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
                      labelFormatter={(v) => format(new Date(String(v)), "d MMM yyyy", { locale: ro })}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Cereri"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Service Type Distribution */}
            <ChartCard title="Distribuție Servicii" subtitle="Toate cererile" loading={statsLoading}>
              {c?.serviceDistribution && (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={c.serviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {c.serviceDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Legend */}
              {c?.serviceDistribution && (
                <div className="mt-2 flex flex-wrap justify-center gap-3 px-4">
                  {c.serviceDistribution.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              )}
            </ChartCard>

            {/* Top Routes */}
            <ChartCard title="Top Rute" subtitle="Cele mai populare trasee" loading={statsLoading}>
              {c?.topRoutes && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={c.topRoutes} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="route"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 13 }}
                    />
                    <Bar dataKey="count" name="Cereri" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Conversion Funnel */}
            <ChartCard title="Funnel Conversie" subtitle="Cereri → Oferte → Acceptări" loading={statsLoading}>
              {c?.funnel && (
                <div className="space-y-4 px-4 py-6">
                  {c.funnel.map((step, i) => {
                    const maxCount = c.funnel[0]?.count || 1;
                    const pct = Math.round((step.count / maxCount) * 100);
                    return (
                      <div key={step.stage}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{step.stage}</span>
                          <span className="text-gray-500">{step.count} ({pct}%)</span>
                        </div>
                        <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            className="flex h-full items-center rounded-lg px-3 text-xs font-bold text-white"
                            style={{ backgroundColor: PIE_COLORS[i] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartCard>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Acțiuni Rapide</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Verificări", href: "/admin/verifications", icon: ShieldCheckIcon, count: k?.pendingVerifications, color: "bg-amber-50 text-amber-700 border-amber-200" },
                { label: "Fraud Flags", href: "/admin/fraud-flags", icon: ShieldExclamationIcon, count: k?.pendingFraudFlags, color: "bg-red-50 text-red-700 border-red-200" },
                { label: "Companii", href: "/admin/companies", icon: BuildingOfficeIcon, count: k?.totalCompanies, color: "bg-purple-50 text-purple-700 border-purple-200" },
                { label: "Cereri", href: "/admin/requests", icon: DocumentDuplicateIcon, count: k?.totalRequests, color: "bg-blue-50 text-blue-700 border-blue-200" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:shadow-md ${action.color}`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-semibold">{action.label}</span>
                  {typeof action.count === "number" && (
                    <span className="text-lg font-bold">{action.count}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* 7-day activity summary */}
          {stats?.recent && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Activitate Ultimele 7 Zile</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-2xl font-bold text-blue-700">{stats.recent.requests}</p>
                  <p className="mt-1 text-sm text-blue-600">Cereri noi</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-2xl font-bold text-purple-700">{stats.recent.offers}</p>
                  <p className="mt-1 text-sm text-purple-600">Oferte noi</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-2xl font-bold text-emerald-700">{stats.recent.reviews}</p>
                  <p className="mt-1 text-sm text-emerald-600">Recenzii noi</p>
                </div>
              </div>
            </div>
          )}

          {/* Pending Verifications Section */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Verificări în Așteptare</h2>
                  <p className="text-sm text-gray-500">Companiile care așteaptă aprobare</p>
                </div>
              </div>
              {pendingCompanies.length > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                  {pendingCompanies.length} {pendingCompanies.length === 1 ? "cerere" : "cereri"}
                </span>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                </div>
              ) : pendingCompanies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                    <CheckCircleSolid className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Totul e la zi!</p>
                  <p className="mt-1 text-sm text-gray-500">Nu există cereri de verificare în așteptare</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCompanies.map((company, i) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      {/* Company Header */}
                      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-500 text-lg font-bold text-white shadow">
                            {(company.companyName || company.displayName || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {company.companyName || company.displayName || "Companie"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              <span>{company.email}</span>
                              {company.cif && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-gray-700">{company.cif}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span>Trimis pe </span>
                          <span className="font-medium text-gray-700">
                            {company.verificationSubmittedAt?.toDate
                              ? format(company.verificationSubmittedAt.toDate(), "d MMM yyyy, HH:mm", { locale: ro })
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Document & Actions */}
                      <div className="p-4">
                        {/* Document link */}
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium text-blue-900">
                              {company.verificationDocName || "Document verificare"}
                            </p>
                          </div>
                          <a
                            href={company.verificationDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"
                          >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            Vezi document
                          </a>
                        </div>

                        {/* Reject form or action buttons */}
                        {rejectingId === company.id ? (
                          <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                            <label className="block text-sm font-semibold text-red-800">
                              Motivul respingerii:
                            </label>
                            <textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Ex: CUI ilizibil, document expirat..."
                              rows={2}
                              className="w-full rounded-lg border border-red-200 p-2.5 text-sm focus:border-red-500 focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReject(company.id)}
                                disabled={!!processingId}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                Confirmă Respingerea
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectReason("");
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Anulează
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setRejectingId(company.id)}
                              disabled={!!processingId}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircleIcon className="h-4 w-4" />
                              Respinge
                            </button>
                            <button
                              onClick={() => handleApprove(company.id)}
                              disabled={!!processingId}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                              Aprobă
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}


