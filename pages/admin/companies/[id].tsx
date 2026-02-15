// pages/admin/companies/[id].tsx
// Admin company detail / drill-down page

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  InboxStackIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";

function fmtDate(ts: any) {
  if (!ts) return "-";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm", { locale: ro });
}

export default function AdminCompanyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/admin/companies/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
        else setError(json.error);
      } catch { setError("Eroare de rețea"); }
      finally { setLoading(false); }
    })();
  }, [id, user]);

  const c = data?.company;
  const m = data?.metrics;

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <button onClick={() => router.push("/admin/companies")} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-4 w-4" /> Înapoi la companii
          </button>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
          ) : data ? (
            <>
              {/* Company header */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white shadow">
                    {(c.companyName || c.displayName || "C").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-bold text-gray-900">{c.companyName || c.displayName || "Companie"}</h1>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.verificationStatus === "verified" ? "bg-green-100 text-green-700" : c.verificationStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
                        {c.verificationStatus === "verified" ? "✓ Verificată" : c.verificationStatus === "pending" ? "⏳ În așteptare" : c.verificationStatus || "Neverificată"}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><EnvelopeIcon className="h-4 w-4" />{c.email}</span>
                      {c.phone && <span className="flex items-center gap-1"><PhoneIcon className="h-4 w-4" />{c.phone}</span>}
                      {c.city && <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" />{c.city}</span>}
                      {c.cif && <span className="font-mono text-gray-600">CIF: {c.cif}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <InboxStackIcon className="mx-auto h-6 w-6 text-purple-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{m.totalOffers}</p>
                  <p className="text-sm text-gray-500">Oferte</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <CheckCircleIcon className="mx-auto h-6 w-6 text-green-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{m.acceptanceRate}%</p>
                  <p className="text-sm text-gray-500">Rată acceptare</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <StarIcon className="mx-auto h-6 w-6 text-yellow-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{c.averageRating || "-"}</p>
                  <p className="text-sm text-gray-500">Rating mediu</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                  <DocumentDuplicateIcon className="mx-auto h-6 w-6 text-blue-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-900">{m.totalReviews}</p>
                  <p className="text-sm text-gray-500">Recenzii</p>
                </div>
              </div>

              {/* Offers table */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-gray-900">Oferte ({m.totalOffers})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Cerere</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Preț</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.offers.slice(0, 50).map((o: any) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 font-mono">{o.requestId?.slice(0, 8) || "-"}...</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{o.price ? `${o.price} RON` : "-"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${o.status === "accepted" || o.accepted ? "bg-green-100 text-green-700" : o.status === "declined" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                              {o.status === "accepted" || o.accepted ? "Acceptată" : o.status === "declined" ? "Refuzată" : o.status || "Trimisă"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(o.createdAt)}</td>
                        </tr>
                      ))}
                      {data.offers.length === 0 && (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">Nicio ofertă</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reviews */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-gray-900">Recenzii ({m.totalReviews})</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {data.reviews.map((r: any) => (
                    <div key={r.id} className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} className={`h-4 w-4 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{r.customerName || "Anonim"}</span>
                        <span className="text-xs text-gray-400">{fmtDate(r.createdAt)}</span>
                        {r.isWelcomeReview && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">Welcome</span>}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{r.comment || "-"}</p>
                    </div>
                  ))}
                  {data.reviews.length === 0 && (
                    <div className="px-6 py-8 text-center text-sm text-gray-400">Nicio recenzie</div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
