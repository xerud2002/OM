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
  ServerIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  SignalIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

export default function AdminApiAnalytics() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/api-analytics", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const endpointCols: Column<any>[] = [
    { key: "endpoint", label: "Endpoint", sortable: true, render: (r) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.endpoint}</code> },
    { key: "requests", label: "Request-uri", sortable: true },
    { key: "errors", label: "Erori", sortable: true, render: (r) => (
      <span className={r.errors > 0 ? "text-red-600 font-bold" : "text-gray-400"}>{r.errors}</span>
    )},
    { key: "errorRate", label: "% Erori", sortable: true, render: (r) => (
      <span className={`font-bold ${r.errorRate > 10 ? "text-red-600" : r.errorRate > 5 ? "text-yellow-600" : "text-green-600"}`}>
        {r.errorRate}%
      </span>
    )},
    { key: "avgTime", label: "Avg (ms)", sortable: true, render: (r) => <span className="text-sm">{r.avgTime}ms</span> },
    { key: "p95", label: "P95 (ms)", sortable: true, render: (r) => (
      <span className={`text-sm font-medium ${r.p95 > 1000 ? "text-red-600" : "text-gray-600"}`}>{r.p95}ms</span>
    )},
  ];

  const consumerCols: Column<any>[] = [
    { key: "ip", label: "IP", sortable: true, render: (r) => <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r.ip}</code> },
    { key: "requests", label: "Request-uri", sortable: true },
  ];

  const rlCols: Column<any>[] = [
    { key: "ip", label: "IP", sortable: true, render: (r) => <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r.ip}</code> },
    { key: "endpoint", label: "Endpoint", sortable: true, render: (r) => <code className="text-xs">{r.endpoint}</code> },
    { key: "count", label: "Nr. depășiri", sortable: true },
    { key: "timestamp", label: "Ultima", sortable: true, render: (r) => (
      <span className="text-sm text-gray-500">{r.timestamp ? new Date(r.timestamp).toLocaleString("ro-RO") : "-"}</span>
    )},
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">API Analytics</h1>
              <p className="text-gray-500">Usage per endpoint, response times, rate limiting</p>
            </div>
            {data && <ExportButton data={data.endpointStats} filename="api-analytics" />}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total request-uri" value={data.summary.totalRequests} icon={ServerIcon} />
                <StatCard label="Erori totale" value={data.summary.totalErrors} icon={ExclamationTriangleIcon} />
                <StatCard label="Avg response" value={`${data.summary.avgResponseTime}ms`} icon={ClockIcon} />
                <StatCard label="Rate limit hits" value={data.summary.rateLimitViolations} icon={SignalIcon} />
              </div>

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Usage ultmele 24h" subtitle="Request-uri per oră">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.hourlyUsage}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="hour" fontSize={10} interval={2} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Request-uri" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Erori per status code" subtitle="Distribuție coduri de eroare">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.errorBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" fontSize={12} />
                      <YAxis type="category" dataKey="code" fontSize={12} width={50} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} name="Erori" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Endpoint stats table */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Statistici per endpoint</h2>
                <DataTable data={data.endpointStats} columns={endpointCols} searchPlaceholder="Caută endpoint..." />
              </div>

              {/* Top consumers */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">Top consumatori (IP)</h2>
                  <DataTable data={data.topConsumers} columns={consumerCols} searchPlaceholder="Caută IP..." />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">Rate limit violations</h2>
                  {data.rateLimitViolations.length > 0 ? (
                    <DataTable data={data.rateLimitViolations} columns={rlCols} searchPlaceholder="Caută IP..." />
                  ) : (
                    <p className="text-sm text-gray-400 py-8 text-center">Nicio depășire rate limit înregistrată.</p>
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
