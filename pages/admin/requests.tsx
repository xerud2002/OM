import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  TrashIcon,
  ArrowRightIcon,
  CalendarIcon,
  TruckIcon,
  HomeIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner, {
  LoadingContainer,
} from "@/components/ui/LoadingSpinner";
import SearchInput from "@/components/ui/SearchInput";
import { getRequestStatusBadge } from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import { calculateRequestCost } from "@/utils/costCalculator";
import { getChannelLabel, getChannelColor } from "@/utils/leadSource";
import { toast } from "sonner";
import type { MovingRequest } from "@/types";

export default function AdminRequests() {
  const { dashboardUser } = useAuth();
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "closed" | "paused" | "cancelled" | "accepted"
  >("all");
  const [approvalFilter, setApprovalFilter] = useState<"all" | "pending" | "approved">("all");

  // Inline editing state
  const [editingCost, setEditingCost] = useState<string | null>(null); // requestId being edited
  const [costValue, setCostValue] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as MovingRequest,
      );
      setRequests(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      r.fromCity?.toLowerCase().includes(searchLower) ||
      r.toCity?.toLowerCase().includes(searchLower) ||
      r.requestCode?.toLowerCase().includes(searchLower) ||
      r.customerName?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;

    const matchesApproval =
      approvalFilter === "all" ||
      (approvalFilter === "pending" && !r.adminApproved) ||
      (approvalFilter === "approved" && r.adminApproved);

    return matchesSearch && matchesStatus && matchesApproval;
  });

  // Counts for quick stats
  const pendingApproval = requests.filter((r) => !r.adminApproved && r.status !== "cancelled" && r.status !== "closed").length;
  const approvedCount = requests.filter((r) => r.adminApproved).length;

  const handleApproveRequest = async (requestId: string, creditCost: number) => {
    try {
      setSavingId(requestId);
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/approve-request", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId,
          creditCost,
          approved: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve");
      }

      toast.success(`Cerere aprobată cu ${creditCost} credite`);
      setEditingCost(null);
    } catch (err: any) {
      logger.error("Failed to approve request", err);
      toast.error(err.message || "Eroare la aprobare");
    } finally {
      setSavingId(null);
    }
  };

  const handleUpdateCreditCost = async (requestId: string, newCost: number) => {
    try {
      setSavingId(requestId);
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/approve-request", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId,
          creditCost: newCost,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update cost");
      }

      toast.success(`Cost actualizat la ${newCost} credite`);
      setEditingCost(null);
    } catch (err: any) {
      logger.error("Failed to update credit cost", err);
      toast.error(err.message || "Eroare la actualizare");
    } finally {
      setSavingId(null);
    }
  };

  const handleUnapprove = async (requestId: string) => {
    if (!window.confirm("Ești sigur? Cererea nu va mai fi vizibilă firmelor.")) return;
    try {
      setSavingId(requestId);
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch("/api/admin/approve-request", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId,
          approved: false,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success("Cerere retrasă din dashboard companii");
    } catch (err) {
      logger.error("Failed to unapprove", err);
      toast.error("Eroare");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această cerere?")) return;
    try {
      await deleteDoc(doc(db, "requests", requestId));
    } catch (err) {
      logger.error("Failed to delete request", err);
      alert("Eroare la ștergere");
    }
  };

  const handleStatusChange = async (
    requestId: string,
    newStatus: MovingRequest["status"],
  ) => {
    try {
      await updateDoc(doc(db, "requests", requestId), { status: newStatus });
    } catch (err) {
      logger.error("Failed to update status", err);
      alert("Eroare la actualizare");
    }
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cereri</h1>
              <p className="text-gray-500">
                Gestionează cererile și setează costul în credite
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="all">Toate statusurile</option>
                <option value="active">Active</option>
                <option value="accepted">Acceptate</option>
                <option value="closed">Finalizate</option>
                <option value="paused">Pauză</option>
                <option value="cancelled">Anulate</option>
              </select>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Caută cereri..."
                focusColor="purple"
              />
            </div>
          </div>

          {/* Approval stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-100 p-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingApproval}</p>
                  <p className="text-sm text-gray-500">Așteaptă aprobare</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                  <p className="text-sm text-gray-500">Aprobate</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <TruckIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                  <p className="text-sm text-gray-500">Total cereri</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval filter tabs */}
          <div className="flex gap-2">
            {[
              { key: "all" as const, label: "Toate" },
              { key: "pending" as const, label: `Neaprobate (${pendingApproval})` },
              { key: "approved" as const, label: `Aprobate (${approvedCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setApprovalFilter(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  approvalFilter === tab.key
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner size="lg" color="purple" />
              </LoadingContainer>
            ) : filteredRequests.length === 0 ? (
              <EmptyState
                icon={TruckIcon}
                title={
                  search || statusFilter !== "all" || approvalFilter !== "all"
                    ? "Nu s-au găsit cereri"
                    : "Nu există cereri"
                }
                description={
                  search
                    ? `Nu s-au găsit rezultate pentru "${search}"`
                    : approvalFilter === "pending"
                      ? "Nu există cereri care așteaptă aprobare"
                      : undefined
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Aprobare
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Rută
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Data mutare
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Cost credite
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Sursa
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Cod
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRequests.map((request) => {
                      const autoCost = calculateRequestCost(request);
                      const currentCost = request.adminCreditCost ?? autoCost;
                      const isEditing = editingCost === request.id;
                      const isSaving = savingId === request.id;

                      return (
                        <tr
                          key={request.id}
                          className={`hover:bg-gray-50 ${!request.adminApproved ? "bg-yellow-50/40" : ""}`}
                        >
                          {/* Approval status */}
                          <td className="whitespace-nowrap px-4 py-4">
                            {request.adminApproved ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                <CheckCircleIcon className="h-3.5 w-3.5" />
                                Aprobată
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                                ⏳ Neaprobată
                              </span>
                            )}
                          </td>

                          {/* Route */}
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center gap-2">
                              {request.serviceMoving ? (
                                <TruckIcon className="h-4 w-4 text-gray-400" />
                              ) : (
                                <HomeIcon className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="font-medium text-gray-900">
                                {request.fromCity}
                              </span>
                              <ArrowRightIcon className="h-3 w-3 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {request.toCity}
                              </span>
                            </div>
                          </td>

                          {/* Client */}
                          <td className="whitespace-nowrap px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {request.customerName ||
                                  request.contactName ||
                                  "Anonim"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {request.phone || request.customerEmail}
                              </p>
                            </div>
                          </td>

                          {/* Move date */}
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <CalendarIcon className="h-4 w-4" />
                              {request.moveDate
                                ? format(
                                    new Date(request.moveDate),
                                    "d MMM yyyy",
                                    { locale: ro },
                                  )
                                : "Flexibil"}
                            </div>
                          </td>

                          {/* Credit cost — inline editable */}
                          <td className="whitespace-nowrap px-4 py-4">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  value={costValue}
                                  onChange={(e) => setCostValue(e.target.value)}
                                  className="w-20 rounded border border-purple-300 px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const val = parseInt(costValue);
                                      if (val > 0) {
                                        if (request.adminApproved) {
                                          handleUpdateCreditCost(request.id, val);
                                        } else {
                                          handleApproveRequest(request.id, val);
                                        }
                                      }
                                    }
                                    if (e.key === "Escape") {
                                      setEditingCost(null);
                                    }
                                  }}
                                />
                                <button
                                  disabled={isSaving}
                                  onClick={() => {
                                    const val = parseInt(costValue);
                                    if (val > 0) {
                                      if (request.adminApproved) {
                                        handleUpdateCreditCost(request.id, val);
                                      } else {
                                        handleApproveRequest(request.id, val);
                                      }
                                    }
                                  }}
                                  className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 disabled:opacity-50"
                                  title={request.adminApproved ? "Salvează" : "Aprobă & Salvează"}
                                >
                                  {isSaving ? "..." : "✓"}
                                </button>
                                <button
                                  onClick={() => setEditingCost(null)}
                                  className="rounded p-1 text-gray-400 hover:text-gray-600"
                                  title="Anulează"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold ${request.adminCreditCost ? "text-purple-700" : "text-gray-400"}`}>
                                  {currentCost}
                                </span>
                                <span className="text-xs text-gray-400">cr</span>
                                {request.adminCreditCost ? (
                                  <span className="text-[10px] text-purple-500">(manual)</span>
                                ) : (
                                  <span className="text-[10px] text-gray-400">(auto)</span>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingCost(request.id);
                                    setCostValue(String(currentCost));
                                  }}
                                  className="rounded p-1 text-gray-400 hover:text-purple-600"
                                  title="Editează cost"
                                >
                                  <PencilSquareIcon className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Lead source */}
                          <td className="whitespace-nowrap px-4 py-4">
                            {request.leadSource?.channel ? (
                              <div className="flex flex-col gap-0.5">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getChannelColor(request.leadSource.channel)}`}>
                                  {getChannelLabel(request.leadSource.channel)}
                                </span>
                                {request.leadSource.utm_campaign && (
                                  <span className="text-[10px] text-gray-400 truncate max-w-30" title={request.leadSource.utm_campaign}>
                                    {request.leadSource.utm_campaign}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-4 py-4">
                            {getRequestStatusBadge(request.status || "active")}
                          </td>

                          {/* Code */}
                          <td className="whitespace-nowrap px-4 py-4">
                            <span className="font-mono text-sm text-gray-600">
                              {request.requestCode || "-"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="whitespace-nowrap px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve / Unapprove toggle */}
                              {!request.adminApproved ? (
                                <button
                                  disabled={isSaving}
                                  onClick={() => {
                                    setEditingCost(request.id);
                                    setCostValue(String(currentCost));
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                  title="Setează preț și aprobă"
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Aprobă
                                </button>
                              ) : (
                                <button
                                  disabled={isSaving}
                                  onClick={() => handleUnapprove(request.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200 disabled:opacity-50"
                                  title="Retrage aprobarea"
                                >
                                  Retrage
                                </button>
                              )}

                              {/* Status change */}
                              <select
                                value={request.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    request.id,
                                    e.target.value as any,
                                  )
                                }
                                className="rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none"
                              >
                                <option value="active">Activă</option>
                                <option value="closed">Finalizată</option>
                                <option value="paused">Pauză</option>
                                <option value="cancelled">Anulată</option>
                                <option value="accepted">Acceptată</option>
                              </select>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(request.id)}
                                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                                title="Șterge"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Count */}
          <p className="text-sm text-gray-500">
            {filteredRequests.length} cereri afișate din {requests.length} total
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
