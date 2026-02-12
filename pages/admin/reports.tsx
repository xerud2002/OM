import { useState } from "react";
import { getAuth } from "firebase/auth";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
  UsersIcon,
  DocumentTextIcon,
  InboxStackIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const reportTypes = [
  { key: "companies", label: "Companii", icon: BuildingOfficeIcon, description: "Export complet companii cu rating, credite, verificare" },
  { key: "customers", label: "Clienți", icon: UsersIcon, description: "Lista clienților înregistrați" },
  { key: "requests", label: "Cereri", icon: DocumentTextIcon, description: "Toate cererile de mutare" },
  { key: "offers", label: "Oferte", icon: InboxStackIcon, description: "Toate ofertele trimise" },
  { key: "reviews", label: "Recenzii", icon: StarIcon, description: "Toate recenziile din platformă" },
];

export default function AdminReports() {
  const { dashboardUser } = useAuth();
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const generateReport = async (type: string) => {
    setLoadingType(type);
    setReportData(null);
    setActiveType(null);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch(`/api/admin/reports/${type}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) {
        setReportData(json.data.report);
        setActiveType(type);
      }
    } catch {}
    finally { setLoadingType(null); }
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <DocumentArrowDownIcon className="h-8 w-8 text-purple-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rapoarte & Export</h1>
              <p className="text-gray-500">Generează și descarcă rapoarte în CSV sau JSON</p>
            </div>
          </div>

          {/* Report cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map(({ key, label, icon: Icon, description }) => (
              <div key={key} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">{label}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
                <button
                  onClick={() => generateReport(key)}
                  disabled={loadingType === key}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {loadingType === key ? <LoadingSpinner size="sm" color="gray" /> : <DocumentArrowDownIcon className="h-4 w-4" />}
                  Generează
                </button>
              </div>
            ))}
          </div>

          {/* Report preview + download */}
          {reportData && activeType && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Raport: {reportTypes.find((r) => r.key === activeType)?.label} ({reportData.length} înregistrări)
                </h2>
                <ExportButton data={reportData} filename={`raport-${activeType}`} />
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {reportData.length > 0 && Object.keys(reportData[0]).map((k) => (
                        <th key={k} className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reportData.slice(0, 20).map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {Object.values(row).map((v: any, j) => (
                          <td key={j} className="px-3 py-2 text-gray-700 max-w-xs truncate">{String(v ?? "—")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reportData.length > 20 && (
                  <p className="mt-2 text-sm text-gray-400">Afișate primele 20 / {reportData.length} rânduri. Descarcă CSV/JSON pentru toate.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
