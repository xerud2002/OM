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
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from "recharts";

const PIE_COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"];

export default function AdminMarketing() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/marketing", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const sourceCols: Column<any>[] = [
    { key: "source", label: "Sursă", sortable: true, render: (r) => <span className="font-medium capitalize">{r.source}</span> },
    { key: "visits", label: "Lead-uri", sortable: true },
    { key: "offers", label: "Cu oferte", sortable: true },
    { key: "accepted", label: "Acceptate", sortable: true },
    { key: "conversionRate", label: "Conversie", sortable: true, render: (r) => (
      <span className={`font-bold ${r.conversionRate >= 10 ? "text-green-600" : r.conversionRate >= 5 ? "text-yellow-600" : "text-red-600"}`}>
        {r.conversionRate}%
      </span>
    )},
  ];

  const campaignCols: Column<any>[] = [
    { key: "campaign", label: "Campanie (source / medium / campaign)", sortable: true, render: (r) => <span className="text-sm font-medium">{r.campaign}</span> },
    { key: "leads", label: "Lead-uri", sortable: true },
    { key: "offers", label: "Cu oferte", sortable: true },
    { key: "accepted", label: "Acceptate", sortable: true },
    { key: "conversionRate", label: "Conversie", sortable: true, render: (r) => <span className="font-bold text-purple-600">{r.conversionRate}%</span> },
  ];

  const pageCols: Column<any>[] = [
    { key: "page", label: "Landing page", sortable: true, render: (r) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{r.page}</code> },
    { key: "count", label: "Lead-uri", sortable: true },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketing & SEO</h1>
              <p className="text-gray-500">Surse trafic, campanii UTM, funnel conversie</p>
            </div>
            {data && <ExportButton data={data.trafficSources} filename="marketing" />}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total lead-uri" value={data.summary.totalLeads} icon={GlobeAltIcon} />
                <StatCard label="Cu oferte" value={data.summary.totalWithOffers} icon={ArrowTrendingUpIcon} />
                <StatCard label="Acceptate" value={data.summary.totalAccepted} icon={FunnelIcon} />
                <StatCard label="Conversie" value={`${data.summary.overallConversion}%`} icon={MegaphoneIcon} />
              </div>

              {/* Funnel + Source pie */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Conversion funnel */}
                <ChartCard title="Funnel conversie" subtitle="Cereri → Oferte → Acceptate">
                  <div className="space-y-3 py-4">
                    {data.funnel.map((step: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{step.stage}</span>
                          <span className="text-gray-500">{step.count} ({step.pct}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-purple-600 h-4 rounded-full transition-all"
                            style={{ width: `${step.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                {/* Traffic source pie */}
                <ChartCard title="Surse trafic" subtitle="Distribuție lead-uri per sursă">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={data.trafficSources.slice(0, 8)}
                        dataKey="visits"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ source, visits }: any) => `${source}: ${visits}`}
                      >
                        {data.trafficSources.slice(0, 8).map((_: any, idx: number) => (
                          <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Monthly trend */}
              <ChartCard title="Trend lunar" subtitle="Cereri, oferte, acceptări - ultimele 6 luni">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#7c3aed" strokeWidth={2} name="Cereri" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="offers" stroke="#3b82f6" strokeWidth={2} name="Cu oferte" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="accepted" stroke="#10b981" strokeWidth={2} name="Acceptate" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Traffic sources table */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Surse trafic</h2>
                <DataTable data={data.trafficSources} columns={sourceCols} searchPlaceholder="Caută sursă..." />
              </div>

              {/* UTM Campaigns */}
              {data.utmCampaigns.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-gray-900">Campanii UTM</h2>
                  <DataTable data={data.utmCampaigns} columns={campaignCols} searchPlaceholder="Caută campanie..." />
                </div>
              )}

              {/* Top landing pages */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Top landing pages</h2>
                <DataTable data={data.topPages} columns={pageCols} searchPlaceholder="Caută pagină..." />
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
