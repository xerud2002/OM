import { useEffect, useState, useCallback } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import DataTable, { Column } from "@/components/admin/DataTable";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm", { locale: ro });
}

const templates: Record<string, { subject: string; body: string }> = {
  update: {
    subject: "🚀 Update platformă Ofertemutare.ro",
    body: `<h2>Noutăți pe Ofertemutare.ro!</h2><p>Vă informăm despre ultimele îmbunătățiri aduse platformei noastre.</p><p>Detalii...</p>`,
  },
  feature: {
    subject: "✨ Funcționalitate nouă pe Ofertemutare.ro",
    body: `<h2>Funcționalitate nouă!</h2><p>Am adăugat o nouă funcționalitate care vă va ajuta...</p>`,
  },
  maintenance: {
    subject: "🔧 Mentenanță programată - Ofertemutare.ro",
    body: `<h2>Mentenanță programată</h2><p>Vă informăm că pe data de ... platforma va fi indisponibilă pentru scurt timp.</p>`,
  },
  offer: {
    subject: "🎉 Ofertă specială - Ofertemutare.ro",
    body: `<h2>Ofertă specială!</h2><p>Profitați de oferta noastră limitată...</p>`,
  },
};

export default function AdminEmailCampaign() {
  const { user, dashboardUser } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [audience, setAudience] = useState("all-companies");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/email-campaign", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setCampaigns(json.data.campaigns);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleTemplate = (key: string) => {
    const t = templates[key];
    if (t) { setSubject(t.subject); setBody(t.body); }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || !user) return;
    setSending(true);
    setResult(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/email-campaign", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, audience }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(`✅ Trimis ${json.data.sent} emailuri (${json.data.failed} eșuate)`);
        setSubject("");
        setBody("");
        fetchCampaigns();
      } else {
        setResult(`❌ ${json.error}`);
      }
    } catch {
      setResult("❌ Eroare de rețea");
    } finally {
      setSending(false);
    }
  };

  const campaignCols: Column<any>[] = [
    { key: "createdAt", label: "Data", sortable: true, render: (c) => <span className="text-sm text-gray-500">{fmtDate(c.createdAt)}</span> },
    { key: "subject", label: "Subiect", sortable: true, render: (c) => <span className="font-medium">{c.subject}</span> },
    { key: "audience", label: "Audiență", sortable: true, render: (c) => (
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
        {c.audience === "all-companies" ? "Companii" : c.audience === "verified-companies" ? "Verificate" : "Clienți"}
      </span>
    )},
    { key: "sent", label: "Trimiși", sortable: true, render: (c) => (
      <span className="flex items-center gap-1">
        <CheckCircleIcon className="h-4 w-4 text-green-500" />{c.sent}
        {c.failed > 0 && <><XCircleIcon className="ml-2 h-4 w-4 text-red-500" />{c.failed}</>}
      </span>
    )},
  ];

  const audiences = [
    { key: "all-companies", label: "Toate companiile" },
    { key: "verified-companies", label: "Companii verificate" },
    { key: "all-customers", label: "Toți clienții" },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campanii Email</h1>
            <p className="text-gray-500">Template builder, segmentare audiență, trimitere email</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-purple-500" /> Compune campanie
            </h2>

            {/* Templates */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Template rapid</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(templates).map(([k, v]) => (
                  <button key={k} onClick={() => handleTemplate(k)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 transition">
                    {k === "update" ? "Update" : k === "feature" ? "Feature" : k === "maintenance" ? "Mentenanță" : "Ofertă"}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Audiență</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                {audiences.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
              </select>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Subiect</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subiect email..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Body */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">Conținut HTML</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="<h2>Mesaj...</h2>"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Preview toggle */}
            {body && (
              <div className="mb-4">
                <button onClick={() => setShowPreview(!showPreview)} className="text-sm text-purple-600 hover:underline">
                  {showPreview ? "Ascunde preview" : "Arată preview"}
                </button>
                {showPreview && (
                  <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4" dangerouslySetInnerHTML={{ __html: body }} />
                )}
              </div>
            )}

            {/* Send */}
            <button onClick={handleSend} disabled={sending || !subject.trim() || !body.trim()}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition">
              <PaperAirplaneIcon className="h-4 w-4" />
              {sending ? "Se trimite..." : "Trimite campanie"}
            </button>

            {result && <p className="mt-3 text-sm font-medium">{result}</p>}
          </div>

          {/* Campaign history */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-gray-400" /> Istoric campanii
            </h2>
            {loading ? (
              <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
            ) : (
              <DataTable data={campaigns} columns={campaignCols} searchPlaceholder="Caută campanie..." />
            )}
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
