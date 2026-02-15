import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "-";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy", { locale: ro });
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  status?: string;
  category?: string;
  tags?: string[];
  createdAt?: any;
  updatedAt?: any;
}

export default function AdminArticles() {
  const { user, dashboardUser } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", status: "draft", category: "" });

  const fetchArticles = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/articles", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setArticles(json.data.articles);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const apiCall = async (method: string, body: any) => {
    const token = await user?.getIdToken();
    const res = await fetch("/api/admin/articles", {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const handleSave = async () => {
    if (editing) {
      await apiCall("PATCH", { articleId: editing.id, ...form });
    } else {
      await apiCall("POST", form);
    }
    setEditing(null);
    setCreating(false);
    setForm({ title: "", slug: "", excerpt: "", content: "", status: "draft", category: "" });
    fetchArticles();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Șterge articolul?")) return;
    await apiCall("DELETE", { articleId: id });
    fetchArticles();
  };

  const handleEdit = (a: Article) => {
    setEditing(a);
    setCreating(true);
    setForm({ title: a.title, slug: a.slug, excerpt: a.excerpt || "", content: a.content || "", status: a.status || "draft", category: a.category || "" });
  };

  const handleToggleStatus = async (a: Article) => {
    const newStatus = a.status === "published" ? "draft" : "published";
    await apiCall("PATCH", { articleId: a.id, status: newStatus });
    fetchArticles();
  };

  const columns: Column<Article>[] = [
    { key: "title", label: "Titlu", sortable: true, render: (a) => <span className="font-medium text-gray-900">{a.title}</span> },
    { key: "slug", label: "Slug", render: (a) => <span className="text-xs font-mono text-gray-500">{a.slug}</span> },
    { key: "category", label: "Categorie", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (a) => (
        <button onClick={() => handleToggleStatus(a)} className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${a.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {a.status === "published" ? "Publicat" : "Draft"}
        </button>
      ),
    },
    {
      key: "createdAt",
      label: "Creat",
      sortable: true,
      render: (a) => <span className="text-sm text-gray-500">{fmtDate(a.createdAt)}</span>,
      getValue: (a) => a.createdAt?._seconds || 0,
    },
    {
      key: "actions" as any,
      label: "Acțiuni",
      render: (a) => (
        <div className="flex items-center gap-1">
          <button onClick={() => handleEdit(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="Editează">
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <a href={`/blog/${a.slug}`} target="_blank" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Vizualizează">
            <EyeIcon className="h-4 w-4" />
          </a>
          <button onClick={() => handleDelete(a.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Șterge">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Articole Blog</h1>
                <p className="text-gray-500">Gestionează conținutul blog-ului</p>
              </div>
            </div>
            <div className="flex gap-2">
              <ExportButton data={articles} filename="articole" />
              <button onClick={() => { setCreating(true); setEditing(null); setForm({ title: "", slug: "", excerpt: "", content: "", status: "draft", category: "" }); }} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-700">
                <PlusIcon className="h-4 w-4" /> Articol nou
              </button>
            </div>
          </div>

          {/* Create/Edit form */}
          {creating && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold">{editing ? "Editează articol" : "Articol nou"}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titlu</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "") })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Publicat</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conținut (HTML/Markdown)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-purple-500 focus:outline-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={!form.title || !form.slug} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
                  {editing ? "Salvează" : "Creează"}
                </button>
                <button onClick={() => { setCreating(false); setEditing(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Anulează
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable data={articles} columns={columns} searchPlaceholder="Caută articole..." />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
