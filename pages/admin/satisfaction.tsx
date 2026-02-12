import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  FaceSmileIcon,
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "d MMM yyyy", { locale: ro });
}

export default function AdminSatisfaction() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/satisfaction", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const surveyCols: Column<any>[] = [
    { key: "createdAt", label: "Data", sortable: true, render: (r) => <span className="text-sm text-gray-500">{fmtDate(r.createdAt)}</span> },
    { key: "userName", label: "Client", sortable: true, render: (r) => <span className="font-medium">{r.userName || "—"}</span> },
    { key: "companyName", label: "Companie", sortable: true, render: (r) => <span className="text-sm">{r.companyName || "—"}</span> },
    { key: "npsScore", label: "NPS", sortable: true, render: (r) => {
      if (r.npsScore === null) return <span className="text-gray-400">—</span>;
      const color = r.npsScore >= 9 ? "text-green-600" : r.npsScore >= 7 ? "text-yellow-600" : "text-red-600";
      return <span className={`font-bold ${color}`}>{r.npsScore}</span>;
    }},
    { key: "csatScore", label: "CSAT", sortable: true, render: (r) => {
      if (r.csatScore === null) return <span className="text-gray-400">—</span>;
      return <span className="font-bold text-purple-600">{r.csatScore} ⭐</span>;
    }},
    { key: "comment", label: "Comentariu", render: (r) => <span className="text-sm text-gray-500 truncate max-w-xs block">{r.comment || "—"}</span> },
  ];

  const companyCols: Column<any>[] = [
    { key: "companyName", label: "Companie", sortable: true, render: (r) => <span className="font-medium">{r.companyName}</span> },
    { key: "avgCsat", label: "CSAT mediu", sortable: true, render: (r) => <span className="font-bold text-purple-600">{r.avgCsat} ⭐</span> },
    { key: "count", label: "Răspunsuri", sortable: true, render: (r) => <span className="text-sm text-gray-500">{r.count}</span> },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Satisfacție Clienți</h1>
              <p className="text-gray-500">NPS score, CSAT per companie, trend-uri</p>
            </div>
            {data && <ExportButton data={data.surveys} filename="satisfactie" />}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="NPS Score" value={data.nps.score} icon={FaceSmileIcon} />
                <StatCard label="CSAT mediu" value={`${data.csat.average} / 5`} icon={StarIcon} />
                <StatCard label="Promoteri" value={data.nps.promoters} icon={HandThumbUpIcon} />
                <StatCard label="Detractori" value={data.nps.detractors} icon={HandThumbDownIcon} />
              </div>

              {/* NPS breakdown */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{data.nps.promoters}</p>
                  <p className="text-xs text-green-700">Promoteri (9-10)</p>
                </div>
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{data.nps.passives}</p>
                  <p className="text-xs text-yellow-700">Pasivi (7-8)</p>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{data.nps.detractors}</p>
                  <p className="text-xs text-red-700">Detractori (0-6)</p>
                </div>
              </div>

              {/* Trend charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Trend NPS" subtitle="Ultimele 6 luni">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} domain={[-100, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="nps" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="NPS" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Trend CSAT" subtitle="Ultimele 6 luni">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="csat" fill="#10b981" radius={[4, 4, 0, 0]} name="CSAT" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Company CSAT ranking */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">CSAT per companie</h2>
                <DataTable data={data.companyCsat} columns={companyCols} searchPlaceholder="Caută companie..." />
              </div>

              {/* Recent surveys */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Răspunsuri recente</h2>
                <DataTable data={data.surveys} columns={surveyCols} searchPlaceholder="Caută..." />
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
