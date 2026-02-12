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
  CurrencyDollarIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminFinancial() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/financial", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const spenderCols: Column<any>[] = [
    { key: "companyName", label: "Companie", sortable: true, render: (c) => <span className="font-medium">{c.companyName}</span> },
    { key: "creditBalance", label: "Credite", sortable: true, render: (c) => <span className="font-semibold text-purple-700">{c.creditBalance}</span> },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financiar</h1>
              <p className="text-gray-500">Credite, venituri și tranzacții</p>
            </div>
            {data && <ExportButton data={data.recentTransactions || []} filename="tranzactii" />}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Venituri totale" value={`${data.totalRevenue} RON`} icon={CurrencyDollarIcon} />
                <StatCard label="Credite achiziționate" value={data.totalCreditsPurchased} icon={CreditCardIcon} />
                <StatCard label="Credite utilizate" value={data.totalCreditsUsed} icon={ArrowTrendingUpIcon} />
                <StatCard label="Credite în sistem" value={data.totalCreditsInSystem} icon={BanknotesIcon} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Venituri lunare" subtitle="Ultimele 6 luni">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(v) => [`${v} RON`, "Venituri"]} />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Credite achiziționate" subtitle="Ultimele 6 luni">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="credits" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Top companii după credite</h2>
                <DataTable data={data.topSpenders} columns={spenderCols} searchPlaceholder="Caută companie..." />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Preț per credit: <span className="font-semibold text-gray-900">{data.creditPrice} RON</span></p>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
