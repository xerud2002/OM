import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import DataTable, { Column } from "@/components/admin/DataTable";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { BellAlertIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm", { locale: ro });
}

export default function AdminNotifications() {
  const { dashboardUser } = useAuth();
  const [target, setTarget] = useState<"all-companies" | "all-customers" | "single">("all-companies");
  const [targetId, setTargetId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/send-notification", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setHistory(json.data.notifications);
    } catch {}
    finally { setLoadingHistory(false); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch("/api/admin/send-notification", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ target, targetId, title, message }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(`Trimis cu succes la ${json.data.sent} destinatari`);
        setTitle("");
        setMessage("");
        fetchHistory();
      } else {
        setResult(`Eroare: ${json.error}`);
      }
    } catch { setResult("Eroare de rețea"); }
    finally { setSending(false); }
  };

  const historyCols: Column<any>[] = [
    { key: "title", label: "Titlu", sortable: true, render: (n) => <span className="font-medium">{n.title}</span> },
    { key: "message", label: "Mesaj", render: (n) => <span className="max-w-xs truncate text-sm text-gray-500">{n.message}</span> },
    { key: "recipientType", label: "Tip", sortable: true, render: (n) => <span className="text-xs capitalize">{n.recipientType || "—"}</span> },
    { key: "createdAt", label: "Data", sortable: true, render: (n) => <span className="text-sm text-gray-500">{fmtDate(n.createdAt)}</span>, getValue: (n) => n.createdAt?._seconds || 0 },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <BellAlertIcon className="h-8 w-8 text-purple-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notificări</h1>
              <p className="text-gray-500">Trimite notificări in-app</p>
            </div>
          </div>

          {/* Compose */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Compune notificare</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destinatar</label>
              <select value={target} onChange={(e) => setTarget(e.target.value as any)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none">
                <option value="all-companies">Toate companiile</option>
                <option value="all-customers">Toți clienții</option>
                <option value="single">Companie specifică (ID)</option>
              </select>
            </div>

            {target === "single" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID companie</label>
                <input value={targetId} onChange={(e) => setTargetId(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" placeholder="ID-ul companiei..." />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titlu</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" placeholder="Titlul notificării..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" placeholder="Conținutul mesajului..." />
            </div>

            <div className="flex items-center gap-4">
              <button onClick={handleSend} disabled={sending || !title.trim() || !message.trim()} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-700 disabled:opacity-50">
                <PaperAirplaneIcon className="h-4 w-4" />
                {sending ? "Se trimite..." : "Trimite"}
              </button>
              {result && <p className={`text-sm ${result.startsWith("Eroare") ? "text-red-600" : "text-green-600"}`}>{result}</p>}
            </div>
          </div>

          {/* History */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Istoric notificări trimise</h2>
            {loadingHistory ? (
              <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
            ) : (
              <DataTable data={history} columns={historyCols} searchPlaceholder="Caută notificări..." />
            )}
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
