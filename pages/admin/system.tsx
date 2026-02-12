import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/admin/StatCard";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  ServerStackIcon,
  CircleStackIcon,
  CpuChipIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

function formatUptime(seconds: number) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function AdminSystem() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/system", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchHealth(); }, [fetchHealth]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ServerStackIcon className="h-8 w-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Stare Sistem</h1>
                <p className="text-gray-500">Monitorizare sănătate platformă</p>
              </div>
            </div>
            <button onClick={fetchHealth} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowPathIcon className="h-4 w-4" /> Refresh
            </button>
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              {/* Status banner */}
              <div className={`rounded-xl border p-4 flex items-center gap-3 ${data.status === "healthy" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                {data.status === "healthy" ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <p className={`font-bold ${data.status === "healthy" ? "text-green-800" : "text-red-800"}`}>
                    {data.status === "healthy" ? "Totul funcționează normal" : "Sistem degradat"}
                  </p>
                  <p className="text-sm text-gray-500">Ultimul check: {data.timestamp}</p>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Uptime" value={formatUptime(data.uptime)} icon={ClockIcon} />
                <StatCard label="Firestore latency" value={`${data.firestore.latencyMs}ms`} icon={CircleStackIcon} />
                <StatCard label="Heap utilizat" value={`${data.memory.heapUsed}MB`} icon={CpuChipIcon} />
                <StatCard label="API latency" value={`${data.apiLatencyMs}ms`} icon={ServerStackIcon} />
              </div>

              {/* Collections */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Colecții Firestore</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Object.entries(data.collections).map(([name, count]) => (
                    <div key={name} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs font-mono text-gray-500">{name}</p>
                      <p className="text-xl font-bold text-gray-900">{count === -1 ? "N/A" : String(count)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Memorie</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">RSS</p>
                    <p className="text-2xl font-bold text-gray-900">{data.memory.rss} MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heap utilizat</p>
                    <p className="text-2xl font-bold text-gray-900">{data.memory.heapUsed} MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heap total</p>
                    <p className="text-2xl font-bold text-gray-900">{data.memory.heapTotal} MB</p>
                  </div>
                </div>
                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-green-400 to-emerald-500"
                    style={{ width: `${Math.min((data.memory.heapUsed / data.memory.heapTotal) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-400">Node.js {data.nodeVersion}</div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
