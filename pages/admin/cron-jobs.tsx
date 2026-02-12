import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

function fmtDate(iso: string | null) {
  if (!iso) return "Niciodată";
  return format(new Date(iso), "d MMM yyyy, HH:mm", { locale: ro });
}

function statusIcon(status: string) {
  if (status === "info") return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
  if (status === "error") return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
  return <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />;
}

export default function AdminCronJobs() {
  const { user, dashboardUser } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/cron-jobs", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setJobs(json.data.jobs);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleTrigger = async (jobId: string) => {
    if (!user) return;
    setTriggering(jobId);
    try {
      const token = await user.getIdToken();
      await fetch("/api/admin/cron-jobs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      load();
    } catch {}
    finally { setTriggering(null); }
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cron Jobs</h1>
            <p className="text-gray-500">Monitorizare și management job-uri programate</p>
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <ClockIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{job.name}</h3>
                        <p className="text-sm text-gray-500">{job.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                          <span>📅 {job.schedule}</span>
                          <span>🔗 <code className="bg-gray-100 px-1 rounded">{job.endpoint}</code></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          {statusIcon(job.lastStatus)}
                          <span className={job.lastStatus === "error" ? "text-red-600 font-medium" : "text-gray-600"}>
                            {job.lastStatus === "info" ? "OK" : job.lastStatus === "error" ? "Eroare" : "Necunoscut"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{fmtDate(job.lastRun)}</p>
                      </div>
                      <button onClick={() => handleTrigger(job.id)}
                        disabled={triggering === job.id}
                        className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition">
                        <PlayIcon className="h-3.5 w-3.5" />
                        {triggering === job.id ? "..." : "Run"}
                      </button>
                    </div>
                  </div>

                  {/* Recent runs */}
                  {job.runs?.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">Ultimele execuții</h4>
                      <div className="space-y-1">
                        {job.runs.map((run: any) => (
                          <div key={run.id} className="flex items-center gap-2 text-xs text-gray-500">
                            {statusIcon(run.level)}
                            <span>{fmtDate(run.timestamp)}</span>
                            <span className="text-gray-400">—</span>
                            <span className="truncate">{run.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
