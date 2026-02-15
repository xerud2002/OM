import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/admin/StatCard";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  CurrencyDollarIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  return format(new Date(iso), "d MMM yyyy, HH:mm", { locale: ro });
}

function typeBadge(type: string) {
  const map: Record<string, { label: string; cls: string }> = {
    purchase: { label: "Achiziție", cls: "bg-green-100 text-green-700" },
    buy: { label: "Achiziție", cls: "bg-green-100 text-green-700" },
    usage: { label: "Consum", cls: "bg-blue-100 text-blue-700" },
    use: { label: "Consum", cls: "bg-blue-100 text-blue-700" },
    spend: { label: "Consum", cls: "bg-blue-100 text-blue-700" },
    contact: { label: "Contact", cls: "bg-purple-100 text-purple-700" },
    refund: { label: "Refund", cls: "bg-orange-100 text-orange-700" },
    adjustment: { label: "Ajustare", cls: "bg-gray-100 text-gray-700" },
    admin_adjust: { label: "Ajustare admin", cls: "bg-gray-100 text-gray-700" },
  };
  const m = map[type] || { label: type, cls: "bg-gray-100 text-gray-600" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${m.cls}`}>{m.label}</span>;
}

export default function AdminTransactions() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/transactions", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const filtered = data?.transactions?.filter((t: any) => {
    if (filter === "all") return true;
    if (filter === "purchase") return t.type === "purchase" || t.type === "buy";
    if (filter === "usage") return t.type === "usage" || t.type === "use" || t.type === "spend" || t.type === "contact";
    if (filter === "refund") return t.type === "refund";
    return true;
  }) || [];

  const cols: Column<any>[] = [
    { key: "createdAt", label: "Data", sortable: true, render: (r) => <span className="text-sm text-gray-500">{fmtDate(r.createdAt)}</span> },
    { key: "companyName", label: "Companie", sortable: true, render: (r) => <span className="font-medium text-gray-900">{r.companyName || r.companyId || "-"}</span> },
    { key: "type", label: "Tip", sortable: true, render: (r) => typeBadge(r.type) },
    { key: "amount", label: "Suma", sortable: true, render: (r) => {
      const positive = r.type === "purchase" || r.type === "buy" || r.type === "refund" || r.type === "adjustment";
      return <span className={`font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>{positive ? "+" : "−"}{Math.abs(r.amount)}</span>;
    }},
    { key: "description", label: "Descriere", render: (r) => <span className="text-sm text-gray-500">{r.description || "-"}</span> },
  ];

  const tabs = [
    { key: "all", label: "Toate" },
    { key: "purchase", label: "Achiziții" },
    { key: "usage", label: "Consum" },
    { key: "refund", label: "Refund-uri" },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tranzacții</h1>
              <p className="text-gray-500">Istoric complet credite: achiziții, consum, refund-uri</p>
            </div>
            {data && <ExportButton data={filtered} filename="tranzactii" />}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Credite achiziționate" value={data.summary.totalPurchased} icon={ArrowUpCircleIcon} />
                <StatCard label="Credite consumate" value={data.summary.totalUsed} icon={ArrowDownCircleIcon} />
                <StatCard label="Credite refundate" value={data.summary.totalRefunded} icon={ArrowPathIcon} />
                <StatCard label="Total tranzacții" value={data.summary.transactionCount} icon={CurrencyDollarIcon} />
              </div>

              <div className="flex gap-2">
                {tabs.map((t) => (
                  <button key={t.key} onClick={() => setFilter(t.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${filter === t.key ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <DataTable data={filtered} columns={cols} searchPlaceholder="Caută companie sau descriere..." />
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
