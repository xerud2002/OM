import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm:ss", { locale: ro });
}

interface AuditEntry {
  id: string;
  action: string;
  adminUid?: string;
  adminEmail?: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  timestamp?: any;
}

const actionColors: Record<string, string> = {
  verify: "bg-green-100 text-green-700",
  delete: "bg-red-100 text-red-700",
  update: "bg-blue-100 text-blue-700",
  create: "bg-purple-100 text-purple-700",
  suspend: "bg-orange-100 text-orange-700",
  approve: "bg-emerald-100 text-emerald-700",
  reject: "bg-red-100 text-red-700",
};

export default function AdminAuditLog() {
  const { dashboardUser } = useAuth();
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAuth().currentUser?.getIdToken();
        const res = await fetch("/api/admin/audit", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setLogs(json.data.logs);
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const columns: Column<AuditEntry>[] = [
    {
      key: "timestamp",
      label: "Data",
      sortable: true,
      render: (e) => <span className="text-sm text-gray-500 whitespace-nowrap">{fmtDate(e.timestamp)}</span>,
      getValue: (e) => e.timestamp?._seconds || 0,
    },
    {
      key: "action",
      label: "Acțiune",
      sortable: true,
      render: (e) => {
        const base = e.action?.split("_")[0] || "";
        const color = actionColors[base] || "bg-gray-100 text-gray-600";
        return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>{e.action}</span>;
      },
    },
    {
      key: "adminEmail",
      label: "Admin",
      sortable: true,
      render: (e) => <span className="text-sm">{e.adminEmail || e.adminUid?.slice(0, 8) || "—"}</span>,
    },
    {
      key: "targetType",
      label: "Tip țintă",
      sortable: true,
      render: (e) => <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{e.targetType || "—"}</span>,
    },
    {
      key: "targetId",
      label: "ID țintă",
      render: (e) => <span className="text-xs font-mono text-gray-500">{e.targetId ? `${e.targetId.slice(0, 12)}...` : "—"}</span>,
    },
    {
      key: "details" as any,
      label: "Detalii",
      render: (e) => {
        if (!e.details) return <span className="text-gray-400">—</span>;
        const str = typeof e.details === "string" ? e.details : JSON.stringify(e.details);
        return <span className="max-w-xs truncate text-xs text-gray-500">{str.slice(0, 80)}</span>;
      },
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-gray-500">Istoric acțiuni admin</p>
              </div>
            </div>
            <ExportButton data={logs} filename="audit-log" />
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable data={logs} columns={columns} searchPlaceholder="Caută în audit log..." />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
