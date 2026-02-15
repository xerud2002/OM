import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  BoltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface BulkOp {
  id: string;
  name: string;
  description: string;
  collection: string;
  filterField: string | null;
  filterValue: string | null;
}

interface ProgressState {
  running: boolean;
  operation: string;
  total: number;
  processed: number;
  success: number;
  failed: number;
  done: boolean;
}

export default function AdminBulkOperations() {
  const { user, dashboardUser } = useAuth();
  const [operations, setOperations] = useState<BulkOp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [entityIds, setEntityIds] = useState("");
  const [creditAmount, setCreditAmount] = useState(0);
  const [creditReason, setCreditReason] = useState("");
  const [notifTitle, setNotifTitle] = useState("Notificare");
  const [notifMessage, setNotifMessage] = useState("");
  const [creditCost, setCreditCost] = useState(1);
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/bulk-operations", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setOperations(json.data.operations);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const runBulk = useCallback(async () => {
    if (!user || !selected) return;
    const ids = entityIds
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (ids.length === 0) return alert("Introduceți cel puțin un ID.");
    if (ids.length > 200) return alert("Maximum 200 entități per batch.");

    let params: any = {};
    if (selected === "approve-requests") params = { creditCost };
    if (selected === "adjust-credits") {
      if (creditAmount === 0) return alert("Suma nu poate fi 0.");
      params = { amount: creditAmount, reason: creditReason || "Ajustare admin" };
    }
    if (selected === "send-notifications") {
      if (!notifMessage) return alert("Mesajul este obligatoriu.");
      params = { title: notifTitle, message: notifMessage };
    }

    setProgress({ running: true, operation: selected, total: ids.length, processed: 0, success: 0, failed: 0, done: false });

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/bulk-operations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operationType: selected, entityIds: ids, params }),
      });
      const json = await res.json();
      if (json.success) {
        setProgress({
          running: false,
          operation: selected,
          total: json.data.processed,
          processed: json.data.processed,
          success: json.data.success,
          failed: json.data.failed,
          done: true,
        });
      } else {
        setProgress((p) => p ? { ...p, running: false, done: true } : null);
        alert(json.error || "Eroare la procesare");
      }
    } catch {
      setProgress((p) => p ? { ...p, running: false, done: true } : null);
      alert("Eroare la conexiune");
    }
  }, [user, selected, entityIds, creditAmount, creditReason, notifTitle, notifMessage, creditCost]);

  const currentOp = operations.find((o) => o.id === selected);

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operațiuni în masă</h1>
            <p className="text-gray-500">Aprobare, verificare, notificare și ajustare credite batch</p>
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <>
              {/* Operation cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {operations.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => { setSelected(op.id); setProgress(null); }}
                    className={`rounded-xl border-2 p-5 text-left transition-all ${
                      selected === op.id ? "border-purple-500 bg-purple-50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <BoltIcon className={`h-6 w-6 ${selected === op.id ? "text-purple-600" : "text-gray-400"}`} />
                      <h3 className="font-bold text-gray-900">{op.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{op.description}</p>
                  </button>
                ))}
              </div>

              {/* Config panel */}
              {selected && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-gray-900">{currentOp?.name}</h2>

                  {/* Entity IDs input */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">ID-uri entități (câte unul pe linie sau separate prin virgulă)</label>
                    <textarea
                      value={entityIds}
                      onChange={(e) => setEntityIds(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                      rows={5}
                      placeholder="abc123&#10;def456&#10;ghi789"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      {entityIds.split(/[\n,]/).filter((s) => s.trim()).length} entități / max 200
                    </p>
                  </div>

                  {/* Operation-specific params */}
                  {selected === "approve-requests" && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cost credite per cerere</label>
                      <input
                        type="number"
                        min={1}
                        value={creditCost}
                        onChange={(e) => setCreditCost(parseInt(e.target.value) || 1)}
                        className="mt-1 w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  )}

                  {selected === "adjust-credits" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Suma (+ sau -)</label>
                        <input
                          type="number"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Motiv</label>
                        <input
                          type="text"
                          value={creditReason}
                          onChange={(e) => setCreditReason(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                          placeholder="Ajustare manuală..."
                        />
                      </div>
                    </div>
                  )}

                  {selected === "send-notifications" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Titlu notificare</label>
                        <input
                          type="text"
                          value={notifTitle}
                          onChange={(e) => setNotifTitle(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Mesaj</label>
                        <textarea
                          value={notifMessage}
                          onChange={(e) => setNotifMessage(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Execute button */}
                  <button
                    onClick={runBulk}
                    disabled={progress?.running}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {progress?.running ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Se procesează...
                      </>
                    ) : (
                      <>
                        <BoltIcon className="h-5 w-5" />
                        Execută operațiunea
                      </>
                    )}
                  </button>

                  {/* Progress / Results */}
                  {progress && (
                    <div className="mt-4 space-y-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${progress.done ? "bg-green-500" : "bg-purple-600 animate-pulse"}`}
                          style={{ width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="flex gap-6 text-sm">
                        <span className="text-gray-500">Total: <strong>{progress.total}</strong></span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircleIcon className="h-4 w-4" /> Succes: <strong>{progress.success}</strong>
                        </span>
                        <span className="text-red-600 flex items-center gap-1">
                          <XCircleIcon className="h-4 w-4" /> Eșuate: <strong>{progress.failed}</strong>
                        </span>
                      </div>
                      {progress.done && (
                        <p className="text-sm text-green-600 font-medium">
                          ✅ Operațiune finalizată: {progress.success}/{progress.total} procesate cu succes.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
