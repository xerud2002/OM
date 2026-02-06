import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
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
} from "@heroicons/react/24/outline";
import LoadingSpinner, {
  LoadingContainer,
} from "@/components/ui/LoadingSpinner";
import SearchInput from "@/components/ui/SearchInput";
import { getRequestStatusBadge } from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import type { MovingRequest } from "@/types";

export default function AdminRequests() {
  const { dashboardUser } = useAuth();
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "closed" | "paused" | "cancelled"
  >("all");

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

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (requestId: string) => {
    if (!window.confirm("Ești sigur că vrei să ștergi această cerere?")) return;
    try {
      await deleteDoc(doc(db, "requests", requestId));
    } catch (err) {
      console.error("Failed to delete request", err);
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
      console.error("Failed to update status", err);
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
                Toate cererile de mutare din platformă
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="all">Toate</option>
                <option value="active">Active</option>
                <option value="accepted">Acceptate</option>
                <option value="closed">Finalizate</option>
                <option value="paused">Pauză</option>
                <option value="cancelled">Anulate</option>
              </select>
              {/* Search */}
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Caută cereri..."
                focusColor="purple"
              />
            </div>
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
                  search || statusFilter !== "all"
                    ? "Nu s-au găsit cereri"
                    : "Nu există cereri"
                }
                description={
                  search
                    ? `Nu s-au găsit rezultate pentru "${search}"`
                    : undefined
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Rută
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Data mutare
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Cod
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            {request.serviceMoving ? (
                              <TruckIcon className="h-4 w-4" />
                            ) : (
                              <HomeIcon className="h-4 w-4" />
                            )}
                            <span className="font-medium text-gray-900">
                              {request.fromCity}
                            </span>
                            <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {request.toCity}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
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
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
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
                        <td className="whitespace-nowrap px-6 py-4">
                          {getRequestStatusBadge(request.status || "active")}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="font-mono text-sm text-gray-600">
                            {request.requestCode || "-"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
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
                            </select>
                            <button
                              onClick={() => handleDelete(request.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              title="Șterge"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Count */}
          <p className="text-sm text-gray-500">
            Total: {filteredRequests.length} cereri
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
