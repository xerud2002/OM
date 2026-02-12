import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable, { Column } from "@/components/admin/DataTable";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  ClockIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function AdminSLA() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/sla", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  if (loading || !data) {
    return (
      <RequireRole allowedRole="admin">
        <DashboardLayout role="admin" user={dashboardUser}>
          <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
        </DashboardLayout>
      </RequireRole>
    );
  }

  const slowCols: Column<any>[] = [
    { key: "route", label: "Rută", sortable: true, render: (d) => <span className="font-medium">{d.route}</span> },
    {
      key: "ageHours",
      label: "Vârstă",
      sortable: true,
      render: (d) => (
        <span className={`font-bold ${d.ageHours > 72 ? "text-red-600" : "text-orange-500"}`}>
          {d.ageHours}h
        </span>
      ),
    },
    { key: "id", label: "ID", render: (d) => <span className="font-mono text-xs text-gray-400">{d.id.slice(0, 8)}</span> },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">SLA Monitoring</h1>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Cereri (30 zile)" value={data.totalRequests} icon={ArrowTrendingUpIcon} />
            <StatCard label="Oferte (30 zile)" value={data.totalOffers} icon={CheckBadgeIcon} />
            <StatCard
              label="Timp medio răspuns"
              value={data.avgResponseTimeH != null ? `${data.avgResponseTimeH}h` : "N/A"}
              icon={ClockIcon}
            />
            <StatCard label="Rată completare" value={`${data.completionRate}%`} icon={CheckBadgeIcon} />
          </div>

          {/* Onboarding Funnel */}
          <ChartCard title="Funnel Onboarding (30 zile)" subtitle="De la înregistrare la prima ofertă">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.funnel} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="step" type="category" width={110} tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[0, 6, 6, 0]} name="Companii" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Weekly trends */}
          <ChartCard title="Trend săptămânal" subtitle="Cereri, oferte, acceptate">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.weeks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#6366f1" name="Cereri" strokeWidth={2} />
                <Line type="monotone" dataKey="offers" stroke="#10b981" name="Oferte" strokeWidth={2} />
                <Line type="monotone" dataKey="accepted" stroke="#f59e0b" name="Acceptate" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Slow requests */}
          {data.slowRequests.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                <h2 className="text-lg font-bold text-red-800">Cereri fără ofertă (&gt;48h)</h2>
              </div>
              <DataTable data={data.slowRequests} columns={slowCols} />
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
