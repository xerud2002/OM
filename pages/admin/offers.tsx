import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import StatCard from "@/components/admin/StatCard";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  InboxStackIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm", { locale: ro });
}

interface Offer {
  id: string;
  companyId: string;
  companyName: string;
  requestId: string;
  requestRoute: { from: string; to: string; serviceType: string } | null;
  price?: number;
  status?: string;
  accepted?: boolean;
  createdAt?: any;
  message?: string;
}

export default function AdminOffers() {
  const { user, dashboardUser } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, declined: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "accepted" | "declined" | "pending">("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/offers", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) {
          setOffers(json.data.offers);
          setStats(json.data.stats);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const filtered = statusFilter === "all" ? offers : offers.filter((o) => {
    if (statusFilter === "accepted") return o.status === "accepted" || o.accepted;
    if (statusFilter === "declined") return o.status === "declined";
    return o.status !== "accepted" && !o.accepted && o.status !== "declined";
  });

  const columns: Column<Offer>[] = [
    {
      key: "companyName",
      label: "Companie",
      sortable: true,
      render: (o) => <span className="font-medium text-gray-900">{o.companyName}</span>,
    },
    {
      key: "requestRoute" as any,
      label: "Rută",
      render: (o) => o.requestRoute ? (
        <span className="text-sm">{o.requestRoute.from} → {o.requestRoute.to}</span>
      ) : <span className="text-gray-400">—</span>,
      getValue: (o) => o.requestRoute ? `${o.requestRoute.from} ${o.requestRoute.to}` : "",
    },
    {
      key: "price",
      label: "Preț",
      sortable: true,
      render: (o) => <span className="font-semibold">{o.price ? `${o.price} RON` : "—"}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (o) => {
        const a = o.status === "accepted" || o.accepted;
        const d = o.status === "declined";
        return (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${a ? "bg-green-100 text-green-700" : d ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
            {a ? "Acceptată" : d ? "Refuzată" : "Trimisă"}
          </span>
        );
      },
      getValue: (o) => o.status === "accepted" || o.accepted ? "accepted" : o.status || "sent",
    },
    {
      key: "createdAt",
      label: "Data",
      sortable: true,
      render: (o) => <span className="text-sm text-gray-500">{fmtDate(o.createdAt)}</span>,
      getValue: (o) => o.createdAt?._seconds || 0,
    },
  ];

  const statusTabs = [
    { key: "all", label: "Toate", count: stats.total },
    { key: "accepted", label: "Acceptate", count: stats.accepted },
    { key: "declined", label: "Refuzate", count: stats.declined },
    { key: "pending", label: "Trimise", count: stats.pending },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Oferte</h1>
              <p className="text-gray-500">Toate ofertele din platformă</p>
            </div>
            <ExportButton data={filtered} filename="oferte" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total" value={stats.total} icon={InboxStackIcon} />
            <StatCard label="Acceptate" value={stats.accepted} icon={CheckCircleIcon} />
            <StatCard label="Refuzate" value={stats.declined} icon={XCircleIcon} />
            <StatCard label="Trimise" value={stats.pending} icon={ClockIcon} />
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key as any)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${statusFilter === t.key ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable data={filtered} columns={columns} searchPlaceholder="Caută oferte..." />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
