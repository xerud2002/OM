import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  MapPinIcon,
  ArrowsRightLeftIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminGeography() {
  const { dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken();
        const res = await fetch("/api/admin/geography", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const routeCols: Column<any>[] = [
    { key: "route", label: "Rută", sortable: true, render: (r) => <span className="font-medium">{r.route}</span> },
    { key: "count", label: "Cereri", sortable: true, render: (r) => <span className="font-semibold text-purple-700">{r.count}</span> },
  ];

  const gapCols: Column<any>[] = [
    { key: "city", label: "Oraș", sortable: true },
    { key: "requests", label: "Cereri", sortable: true, render: (g) => <span className="font-semibold">{g.requests}</span> },
    { key: "companies", label: "Companii", sortable: true, render: (g) => <span className={g.companies === 0 ? "font-semibold text-red-600" : ""}>{g.companies}</span> },
    { key: "ratio", label: "Raport", sortable: true, render: (g) => <span className="text-orange-600 font-medium">{g.ratio.toFixed(1)}x</span> },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analiză Geografică</h1>
              <p className="text-gray-500">Orașe, rute și acoperire</p>
            </div>
            {data && <ExportButton data={data.topRoutes} filename="rute" />}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total cereri" value={data.totalRequests} icon={MapPinIcon} />
                <StatCard label="Orașe origine" value={data.uniqueOrigins} icon={MapPinIcon} />
                <StatCard label="Rute unice" value={data.uniqueRoutes} icon={ArrowsRightLeftIcon} />
                <StatCard label="Orașe acoperite" value={data.companyCoverage.length} icon={BuildingOfficeIcon} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Top orașe de plecare" subtitle="Cele mai populare origini">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topOrigins.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" fontSize={12} />
                      <YAxis dataKey="city" type="category" fontSize={11} width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Top destinații" subtitle="Cele mai populare destinații">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topDestinations.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" fontSize={12} />
                      <YAxis dataKey="city" type="category" fontSize={11} width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Top rute</h2>
                <DataTable data={data.topRoutes} columns={routeCols} searchPlaceholder="Caută rută..." />
              </div>

              {data.coverageGaps.length > 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                    <h2 className="text-lg font-bold text-gray-900">Goluri de acoperire</h2>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">Orașe cu cerere mare dar puține companii</p>
                  <DataTable data={data.coverageGaps} columns={gapCols} />
                </div>
              )}
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
