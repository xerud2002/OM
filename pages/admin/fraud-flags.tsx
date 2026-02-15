// pages/admin/fraud-flags.tsx
// Admin page for reviewing multi-account fraud flags

import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/services/firebase";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  ShieldExclamationIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

interface FraudFlag {
  id: string;
  flaggedUid: string;
  flaggedEmail: string | null;
  flaggedRole: string;
  linkedAccounts: string[];
  fingerprint: string | null;
  ip: string;
  reasons: string[];
  severity: "low" | "medium" | "high";
  status: "pending" | "reviewed" | "dismissed" | "confirmed";
  reviewedBy: string | null;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string | null;
  // Enriched fields
  userEmail?: string;
  userName?: string;
  userPhotoURL?: string;
  userCreatedAt?: string;
  lastLogin?: string;
  deviceEventCount?: number;
  allIPs?: string[];
}

interface FlagStats {
  pending: number;
  confirmed: number;
  total: number;
}

type FilterStatus = "all" | "pending" | "reviewed" | "dismissed" | "confirmed";
type FilterSeverity = "all" | "low" | "medium" | "high";

export default function AdminFraudFlags() {
  const { dashboardUser } = useAuth();
  const [flags, setFlags] = useState<FraudFlag[]>([]);
  const [stats, setStats] = useState<FlagStats>({ pending: 0, confirmed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pending");
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>("all");
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterSeverity !== "all") params.set("severity", filterSeverity);

      const res = await fetch(`/api/admin/fraud-flags?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch fraud flags");
      const data = await res.json();
      setFlags(data.flags || []);
      setStats(data.stats || { pending: 0, confirmed: 0, total: 0 });
    } catch (err) {
      logger.error("Failed to load fraud flags", err);
      toast.error("Eroare la încărcarea flag-urilor de fraud");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterSeverity]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  const handleUpdateStatus = async (
    flagId: string,
    newStatus: "reviewed" | "dismissed" | "confirmed",
  ) => {
    try {
      setActionLoading(flagId);
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/fraud-flags", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flagId,
          status: newStatus,
          notes: reviewNotes[flagId] || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update flag");

      toast.success(
        newStatus === "confirmed"
          ? "Flag confirmat ca fraud!"
          : newStatus === "dismissed"
            ? "Flag respins"
            : "Flag marcat ca reviewuit",
      );
      await fetchFlags();
    } catch (err) {
      logger.error("Failed to update fraud flag", err);
      toast.error("Eroare la actualizarea flag-ului");
    } finally {
      setActionLoading(null);
    }
  };

  const severityConfig = {
    low: {
      color: "bg-yellow-100 text-yellow-800",
      icon: "⚠️",
      label: "Scăzut",
    },
    medium: {
      color: "bg-orange-100 text-orange-800",
      icon: "🔶",
      label: "Mediu",
    },
    high: {
      color: "bg-red-100 text-red-800",
      icon: "🔴",
      label: "Ridicat",
    },
  };

  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", label: "În așteptare" },
    reviewed: { color: "bg-blue-100 text-blue-800", label: "Reviewuit" },
    dismissed: { color: "bg-gray-100 text-gray-600", label: "Respins" },
    confirmed: { color: "bg-red-100 text-red-800", label: "Confirmat" },
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <ShieldExclamationIcon className="mr-2 inline h-7 w-7 text-red-500" />
                Fraud Detection
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Detectare conturi multiple de pe același device sau IP și cereri duplicate
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-sm text-yellow-600">Flag-uri în așteptare</div>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="text-2xl font-bold text-red-700">{stats.confirmed}</div>
              <div className="text-sm text-red-600">Confirmate ca fraud</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
              <div className="text-sm text-gray-500">Total flag-uri</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "reviewed", "dismissed", "confirmed"] as FilterStatus[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      filterStatus === s
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {s === "all"
                      ? "Toate"
                      : s === "pending"
                        ? "În așteptare"
                        : s === "reviewed"
                          ? "Reviewuite"
                          : s === "dismissed"
                            ? "Respinse"
                            : "Confirmate"}
                  </button>
                ),
              )}
            </div>
            <div className="mx-2 h-6 w-px bg-gray-200" />
            <div className="flex flex-wrap gap-2">
              {(["all", "low", "medium", "high"] as FilterSeverity[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSeverity(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    filterSeverity === s
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s === "all"
                    ? "Toate severitățile"
                    : severityConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Flags List */}
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : flags.length === 0 ? (
            <EmptyState
              icon={ShieldExclamationIcon}
              title="Niciun flag de fraud"
              description="Nu au fost detectate conturi suspecte cu filtrele selectate."
            />
          ) : (
            <div className="space-y-4">
              {flags.map((flag) => {
                const sev = severityConfig[flag.severity];
                const stat = statusConfig[flag.status];
                const isExpanded = expandedFlag === flag.id;

                return (
                  <div
                    key={flag.id}
                    className={`overflow-hidden rounded-xl border bg-white transition-shadow ${
                      flag.severity === "high"
                        ? "border-red-300 shadow-red-50"
                        : flag.severity === "medium"
                          ? "border-orange-200"
                          : "border-gray-200"
                    } ${isExpanded ? "shadow-lg" : "hover:shadow-md"}`}
                  >
                    {/* Flag Header */}
                    <button
                      onClick={() => setExpandedFlag(isExpanded ? null : flag.id)}
                      className="flex w-full items-center gap-4 p-4 text-left"
                    >
                      {/* Severity badge */}
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${sev.color}`}
                      >
                        {sev.icon} {sev.label}
                      </span>

                      {/* User info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold text-gray-900">
                            {flag.userEmail || flag.flaggedEmail || flag.flaggedUid}
                          </span>
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                            {flag.flaggedRole}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500">
                          {flag.reasons.join(" • ")}
                        </div>
                      </div>

                      {/* Status badge */}
                      <span
                        className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium ${stat.color}`}
                      >
                        {stat.label}
                      </span>

                      {/* Date */}
                      <span className="shrink-0 text-xs text-gray-400">
                        {flag.createdAt
                          ? format(new Date(flag.createdAt), "dd MMM yyyy HH:mm", { locale: ro })
                          : "-"}
                      </span>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {/* Device Fingerprint */}
                          <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                              <FingerPrintIcon className="h-4 w-4" />
                              Device Fingerprint
                            </div>
                            <code className="block break-all text-xs text-gray-500">
                              {flag.fingerprint || "N/A"}
                            </code>
                          </div>

                          {/* IP Addresses */}
                          <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                              <GlobeAltIcon className="h-4 w-4" />
                              Adrese IP
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs">
                                <span className="font-medium text-gray-600">Curent:</span>{" "}
                                <code className="text-gray-500">{flag.ip}</code>
                              </div>
                              {flag.allIPs && flag.allIPs.length > 1 && (
                                <div className="text-xs">
                                  <span className="font-medium text-gray-600">Toate:</span>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {flag.allIPs.map((ip, i) => (
                                      <code
                                        key={i}
                                        className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-500"
                                      >
                                        {ip}
                                      </code>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Linked Accounts / Requests */}
                          <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                              <UserGroupIcon className="h-4 w-4" />
                              {flag.flaggedUid?.startsWith("guest:") || flag.reasons.some(r => r.includes("cereri de mutare"))
                                ? `Cereri Legate (${flag.linkedAccounts.length})`
                                : `Conturi Legate (${flag.linkedAccounts.length})`}
                            </div>
                            <div className="space-y-1">
                              {flag.linkedAccounts.map((uid) => (
                                <code
                                  key={uid}
                                  className="block truncate text-xs text-gray-500"
                                >
                                  {uid}
                                </code>
                              ))}
                            </div>
                          </div>

                          {/* User Details */}
                          <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="mb-2 text-sm font-medium text-gray-700">
                              Detalii Cont
                            </div>
                            <div className="space-y-1 text-xs text-gray-500">
                              <div>
                                <span className="font-medium text-gray-600">Nume:</span>{" "}
                                {flag.userName || "-"}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Creat:</span>{" "}
                                {flag.userCreatedAt
                                  ? format(new Date(flag.userCreatedAt), "dd MMM yyyy HH:mm", {
                                      locale: ro,
                                    })
                                  : "-"}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Ultimul login:</span>{" "}
                                {flag.lastLogin
                                  ? format(new Date(flag.lastLogin), "dd MMM yyyy HH:mm", {
                                      locale: ro,
                                    })
                                  : "-"}
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Nr. events:</span>{" "}
                                {flag.deviceEventCount || 0}
                              </div>
                            </div>
                          </div>

                          {/* Reasons */}
                          <div className="rounded-lg border border-gray-200 bg-white p-3">
                            <div className="mb-2 text-sm font-medium text-gray-700">Motive</div>
                            <ul className="space-y-1">
                              {flag.reasons.map((r, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-xs text-gray-600"
                                >
                                  <ExclamationTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-400" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Notes */}
                          {flag.notes && (
                            <div className="rounded-lg border border-gray-200 bg-white p-3">
                              <div className="mb-2 text-sm font-medium text-gray-700">
                                Note Review
                              </div>
                              <p className="text-xs text-gray-500">{flag.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {flag.status === "pending" && (
                          <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-end">
                            <div className="flex-1">
                              <label className="mb-1 block text-xs font-medium text-gray-600">
                                Note (opțional)
                              </label>
                              <input
                                type="text"
                                value={reviewNotes[flag.id] || ""}
                                onChange={(e) =>
                                  setReviewNotes((prev) => ({
                                    ...prev,
                                    [flag.id]: e.target.value,
                                  }))
                                }
                                placeholder="Adaugă note despre decizia ta..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStatus(flag.id, "confirmed")}
                                disabled={actionLoading === flag.id}
                                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                              >
                                <XCircleIcon className="h-4 w-4" />
                                Confirmă Fraud
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(flag.id, "reviewed")}
                                disabled={actionLoading === flag.id}
                                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                              >
                                <EyeIcon className="h-4 w-4" />
                                Reviewuit
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(flag.id, "dismissed")}
                                disabled={actionLoading === flag.id}
                                className="flex items-center gap-1.5 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                                Respinge
                              </button>
                            </div>
                          </div>
                        )}

                        {flag.status !== "pending" && flag.reviewedAt && (
                          <div className="mt-4 border-t border-gray-200 pt-3 text-xs text-gray-400">
                            Reviewuit la{" "}
                            {format(new Date(flag.reviewedAt), "dd MMM yyyy HH:mm", {
                              locale: ro,
                            })}
                            {flag.reviewedBy && ` de ${flag.reviewedBy}`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
