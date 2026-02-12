// pages/admin/users/[id].tsx
// Admin user detail / drill-down page

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import Link from "next/link";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  InboxStackIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm", { locale: ro });
}

export default function AdminUserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken();
        const res = await fetch(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
        else setError(json.error);
      } catch { setError("Eroare de rețea"); }
      finally { setLoading(false); }
    })();
  }, [id]);

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <button onClick={() => router.push("/admin/users")} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-4 w-4" /> Înapoi la utilizatori
          </button>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
          ) : data ? (
            <>
              {/* Profile card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white">
                    {(data.user.displayName || data.user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{data.user.displayName || "Anonim"}</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><EnvelopeIcon className="h-4 w-4" />{data.user.email}</span>
                      {data.user.phone && <span className="flex items-center gap-1"><PhoneIcon className="h-4 w-4" />{data.user.phone}</span>}
                      <span className="flex items-center gap-1"><CalendarIcon className="h-4 w-4" />Înregistrat: {fmtDate(data.user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <DocumentDuplicateIcon className="mx-auto h-6 w-6 text-blue-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{data.requests.length}</p>
                  <p className="text-sm text-gray-500">Cereri</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <InboxStackIcon className="mx-auto h-6 w-6 text-purple-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{data.offers.length}</p>
                  <p className="text-sm text-gray-500">Oferte primite</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <DocumentDuplicateIcon className="mx-auto h-6 w-6 text-emerald-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{data.offers.filter((o: any) => o.status === "accepted" || o.accepted).length}</p>
                  <p className="text-sm text-gray-500">Oferte acceptate</p>
                </div>
              </div>

              {/* Requests table */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-gray-900">Cereri ({data.requests.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Rută</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Serviciu</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Oferte</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.requests.map((r: any) => {
                        const offerCount = data.offers.filter((o: any) => o.requestId === r.id).length;
                        return (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{r.orasOrigin || r.cityFrom || "—"} → {r.orasDestinatie || r.cityTo || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{r.serviceType || r.tipServiciu || "—"}</td>
                            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${r.adminApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.adminApproved ? "Aprobată" : "Neaprobată"}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(r.createdAt)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-purple-600">{offerCount}</td>
                          </tr>
                        );
                      })}
                      {data.requests.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Nicio cerere</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
