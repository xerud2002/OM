import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  CurrencyDollarIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminFinancial() {
  const { user, dashboardUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creditModal, setCreditModal] = useState<{ id: string; name: string; balance: number } | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditReason, setCreditReason] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/financial", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const handleCreditAdjust = async () => {
    if (!creditModal || creditAmount === 0 || creditReason.trim().length < 3) return;
    setCreditLoading(true);
    try {
      const token = await user!.getIdToken();
      const res = await fetch("/api/admin/adjust-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ companyId: creditModal.id, amount: creditAmount, reason: creditReason.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev: any) => ({
          ...prev,
          topSpenders: prev.topSpenders.map((s: any) =>
            s.id === creditModal.id ? { ...s, creditBalance: json.data.newBalance } : s
          ),
          totalCreditsInSystem: prev.totalCreditsInSystem + creditAmount,
        }));
        const name = creditModal.name;
        setCreditModal(null);
        setCreditAmount(0);
        setCreditReason("");
        setToast({ type: "success", message: `✅ ${creditAmount > 0 ? "+" : ""}${creditAmount} credite → ${name}. Sold nou: ${json.data.newBalance}` });
      } else {
        setToast({ type: "error", message: json.error });
      }
    } catch {
      setToast({ type: "error", message: "Eroare de rețea" });
    } finally {
      setCreditLoading(false);
    }
  };

  const spenderCols: Column<any>[] = [
    { key: "companyName", label: "Companie", sortable: true, render: (c) => <span className="font-medium">{c.companyName}</span> },
    { key: "creditBalance", label: "Credite", sortable: true, render: (c) => <span className="font-semibold text-purple-700">{c.creditBalance}</span> },
    {
      key: "actions" as any,
      label: "Acțiuni",
      render: (c) => (
        <button
          onClick={() => setCreditModal({ id: c.id, name: c.companyName, balance: c.creditBalance })}
          className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-200 transition"
        >
          <AdjustmentsHorizontalIcon className="h-3.5 w-3.5" /> Ajustează
        </button>
      ),
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financiar</h1>
              <p className="text-gray-500">Credite, venituri și tranzacții</p>
            </div>
            {data && <ExportButton data={data.recentTransactions || []} filename="tranzactii" />}
          </div>

          {/* Toast notification */}
          {toast && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
              <div className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl transition-all ${
                toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}>
                <span className="text-2xl">{toast.type === "success" ? "🎉" : "⚠️"}</span>
                <span className="text-base font-semibold">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-3 rounded-full p-1 hover:bg-white/20 transition">✕</button>
              </div>
            </div>
          )}

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Venituri totale" value={`${data.totalRevenue} RON`} icon={CurrencyDollarIcon} />
                <StatCard label="Credite achiziționate" value={data.totalCreditsPurchased} icon={CreditCardIcon} />
                <StatCard label="Credite utilizate" value={data.totalCreditsUsed} icon={ArrowTrendingUpIcon} />
                <StatCard label="Credite în sistem" value={data.totalCreditsInSystem} icon={BanknotesIcon} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard title="Venituri lunare" subtitle="Ultimele 6 luni">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(v) => [`${v} RON`, "Venituri"]} />
                      <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Credite achiziționate" subtitle="Ultimele 6 luni">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={data.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="credits" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Top companii după credite</h2>
                <DataTable data={data.topSpenders} columns={spenderCols} searchPlaceholder="Caută companie..." />
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Preț per credit: <span className="font-semibold text-gray-900">{data.creditPrice} RON</span></p>
              </div>
            </>
          ) : null}

          {/* Credit Adjustment Modal */}
          {creditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCreditModal(null)}>
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Ajustare credite</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {creditModal.name} — Sold curent: <span className="font-bold text-purple-700">{creditModal.balance}</span>
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adaugă rapid</label>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, 25, 50, 100].map((v) => (
                        <button
                          key={v}
                          onClick={() => setCreditAmount(v)}
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${creditAmount === v ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-600 hover:border-purple-300"}`}
                        >
                          +{v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sumă (negativ = scădere)</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCreditAmount((p) => p - 1)} className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition">
                        <MinusCircleIcon className="h-5 w-5" />
                      </button>
                      <input
                        type="number"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(Number(e.target.value))}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-bold focus:border-purple-500 focus:ring-purple-500"
                      />
                      <button onClick={() => setCreditAmount((p) => p + 1)} className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-green-50 hover:text-green-600 transition">
                        <PlusCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {creditAmount !== 0 && (
                      <p className={`mt-1 text-sm font-medium ${creditAmount > 0 ? "text-green-600" : "text-red-600"}`}>
                        Sold nou: {creditModal.balance + creditAmount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motiv *</label>
                    <input
                      type="text"
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      placeholder="ex: Bonus înregistrare, Corecție, Promoție..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => { setCreditModal(null); setCreditAmount(0); setCreditReason(""); }}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleCreditAdjust}
                    disabled={creditLoading || creditAmount === 0 || creditReason.trim().length < 3}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {creditLoading ? "Se procesează..." : `${creditAmount > 0 ? "Adaugă" : "Scade"} ${Math.abs(creditAmount)} credite`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
