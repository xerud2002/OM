import { useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  ShieldExclamationIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminDuplicates() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDetection = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/detect-duplicates", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {}
    finally { setLoading(false); }
  };

  const dupCols: Column<any>[] = [
    { key: "route", label: "Rută", sortable: true, render: (d) => <span className="font-medium">{d.route}</span> },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Telefon" },
    { key: "count", label: "Duplicări", sortable: true, render: (d) => <span className="font-bold text-red-600">{d.count}x</span> },
    { key: "ids", label: "ID-uri", render: (d) => <span className="text-xs font-mono text-gray-500">{d.ids.map((id: string) => id.slice(0, 6)).join(", ")}</span> },
  ];

  const ipCols: Column<any>[] = [
    { key: "ip", label: "IP", render: (d) => <span className="font-mono text-sm">{d.ip}</span> },
    { key: "count", label: "Cereri", sortable: true, render: (d) => <span className="font-bold text-orange-600">{d.count}</span> },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ShieldExclamationIcon className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detecție Duplicări & Spam</h1>
                <p className="text-gray-500">Scanează cererile din ultimele 30 zile</p>
              </div>
            </div>
            <button
              onClick={runDetection}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" color="gray" /> : <MagnifyingGlassIcon className="h-4 w-4" />}
              {loading ? "Se scanează..." : "Rulează scanare"}
            </button>
          </div>

          {data ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Cereri scanate" value={data.totalScanned} icon={DocumentDuplicateIcon} />
                <StatCard label="Duplicări" value={data.duplicates.length} icon={DocumentDuplicateIcon} />
                <StatCard label="IP-uri suspecte" value={data.suspiciousIps.length} icon={GlobeAltIcon} />
              </div>

              {data.duplicates.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-red-800">Cereri duplicate</h2>
                  <DataTable data={data.duplicates} columns={dupCols} />
                </div>
              )}

              {data.suspiciousIps.length > 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-orange-800">IP-uri suspecte (&gt;5 cereri)</h2>
                  <DataTable data={data.suspiciousIps} columns={ipCols} />
                </div>
              )}

              {data.duplicates.length === 0 && data.suspiciousIps.length === 0 && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
                  <p className="text-green-700 font-medium">Nu s-au detectat duplicări sau activitate suspectă!</p>
                </div>
              )}
            </>
          ) : !loading ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">Apasă butonul pentru a rula o scanare</p>
            </div>
          ) : (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
