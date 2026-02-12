import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import DataTable, { Column } from "@/components/admin/DataTable";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  ShieldCheckIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy", { locale: ro });
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    "super-admin": "bg-purple-100 text-purple-700",
    moderator: "bg-blue-100 text-blue-700",
    viewer: "bg-gray-100 text-gray-600",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${map[role] || "bg-gray-100 text-gray-600"}`}>{role}</span>;
}

export default function AdminRoles() {
  const { user, dashboardUser } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newUid, setNewUid] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/roles", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setAdmins(json.data.admins);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newUid.trim() || !newEmail.trim() || !user) return;
    setSaving(true);
    setMessage(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uid: newUid, email: newEmail, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage("✅ Admin adăugat");
        setNewUid("");
        setNewEmail("");
        load();
      } else setMessage(`❌ ${json.error}`);
    } catch { setMessage("❌ Eroare rețea"); }
    finally { setSaving(false); }
  };

  const handleChangeRole = async (uid: string, role: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch("/api/admin/roles", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role }),
      });
      load();
    } catch {}
  };

  const handleDelete = async (uid: string) => {
    if (!user || !confirm("Sigur vrei să elimini acest admin?")) return;
    try {
      const token = await user.getIdToken();
      await fetch("/api/admin/roles", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      load();
    } catch {}
  };

  const cols: Column<any>[] = [
    { key: "email", label: "Email", sortable: true, render: (a) => <span className="font-medium">{a.email}</span> },
    { key: "role", label: "Rol", sortable: true, render: (a) => (
      <select value={a.role || "viewer"} onChange={(e) => handleChangeRole(a.uid, e.target.value)}
        className="rounded border border-gray-200 px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-purple-500">
        <option value="super-admin">super-admin</option>
        <option value="moderator">moderator</option>
        <option value="viewer">viewer</option>
      </select>
    )},
    { key: "createdAt", label: "Adăugat", sortable: true, render: (a) => <span className="text-sm text-gray-500">{fmtDate(a.createdAt)}</span> },
    { key: "uid", label: "UID", render: (a) => <span className="text-xs text-gray-400 font-mono">{a.uid?.slice(0, 12)}...</span> },
    { key: "actions", label: "", render: (a) => (
      <button onClick={() => handleDelete(a.uid)} className="text-red-400 hover:text-red-600 transition" title="Elimină">
        <TrashIcon className="h-4 w-4" />
      </button>
    )},
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roluri Admin</h1>
            <p className="text-gray-500">Multi-admin cu roluri granulare: super-admin, moderator, viewer</p>
          </div>

          {/* Add admin form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
              <UserPlusIcon className="h-5 w-5 text-purple-500" /> Adaugă admin
            </h2>
            <div className="grid gap-4 sm:grid-cols-4">
              <input type="text" value={newUid} onChange={(e) => setNewUid(e.target.value)} placeholder="Firebase UID"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option value="super-admin">Super Admin</option>
                <option value="moderator">Moderator</option>
                <option value="viewer">Viewer</option>
              </select>
              <button onClick={handleAdd} disabled={saving}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition">
                {saving ? "Se salvează..." : "Adaugă"}
              </button>
            </div>
            {message && <p className="mt-2 text-sm font-medium">{message}</p>}
          </div>

          {/* Role descriptions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-purple-800">Super Admin</h3>
              </div>
              <p className="text-xs text-purple-600">Acces complet: setări, suspendări, ștergeri, roluri</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-blue-800">Moderator</h3>
              </div>
              <p className="text-xs text-blue-600">Review-uri, chat-uri, fraud flags, verificări companii</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
                <h3 className="font-bold text-gray-700">Viewer</h3>
              </div>
              <p className="text-xs text-gray-500">Read-only: dashboards, rapoarte, statistici</p>
            </div>
          </div>

          {/* Admin list */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Administratori activi</h2>
            {loading ? (
              <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
            ) : (
              <DataTable data={admins} columns={cols} searchPlaceholder="Caută admin..." />
            )}
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
