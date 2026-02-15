import { useEffect, useState, useCallback } from "react";
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
  StarIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "-";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy", { locale: ro });
}

interface Review {
  id: string;
  companyId: string;
  companyName: string;
  customerName?: string;
  rating: number;
  comment?: string;
  status?: string;
  isWelcomeReview?: boolean;
  createdAt?: any;
}

export default function AdminReviews() {
  const { user, dashboardUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, hidden: 0, welcome: 0 });
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/reviews", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) {
        setReviews(json.data.reviews);
        setStats(json.data.stats);
      }
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const apiAction = async (method: string, body: any) => {
    const token = await user?.getIdToken();
    await fetch("/api/admin/reviews", {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchReviews();
  };

  const handleToggle = (r: Review) => {
    const action = r.status === "published" ? "hide" : "publish";
    apiAction("PATCH", { reviewId: r.id, action });
  };

  const handleDelete = (r: Review) => {
    if (!window.confirm("Șterge recenzia?")) return;
    apiAction("DELETE", { reviewId: r.id });
  };

  const columns: Column<Review>[] = [
    {
      key: "companyName",
      label: "Companie",
      sortable: true,
      render: (r) => <span className="font-medium text-gray-900">{r.companyName}</span>,
    },
    {
      key: "customerName",
      label: "Client",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1">
          <span>{r.customerName || "Anonim"}</span>
          {r.isWelcomeReview && <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-600">Welcome</span>}
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} className={`h-4 w-4 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
          ))}
        </div>
      ),
    },
    {
      key: "comment",
      label: "Comentariu",
      render: (r) => <p className="max-w-xs truncate text-sm text-gray-600">{r.comment || "-"}</p>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (r) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {r.status === "published" ? "Publicat" : r.status || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Data",
      sortable: true,
      render: (r) => <span className="text-sm text-gray-500">{fmtDate(r.createdAt)}</span>,
      getValue: (r) => r.createdAt?._seconds || 0,
    },
    {
      key: "actions" as any,
      label: "Acțiuni",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleToggle(r)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title={r.status === "published" ? "Ascunde" : "Publică"}>
            {r.status === "published" ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
          <button onClick={() => handleDelete(r)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Șterge">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recenzii</h1>
              <p className="text-gray-500">Moderarea recenziilor</p>
            </div>
            <ExportButton data={reviews} filename="recenzii" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total" value={stats.total} icon={ChatBubbleLeftIcon} />
            <StatCard label="Publicate" value={stats.published} icon={EyeIcon} />
            <StatCard label="Ascunse" value={stats.hidden} icon={EyeSlashIcon} />
            <StatCard label="Welcome" value={stats.welcome} icon={StarIcon} />
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable data={reviews} columns={columns} searchPlaceholder="Caută recenzii..." />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
