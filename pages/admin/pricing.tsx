import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import {
  CurrencyDollarIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface PricingTier {
  name: string;
  credits: number;
  price: number;
  discount: number;
}

export default function AdminPricing() {
  const { user, dashboardUser } = useAuth();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [basePrice, setBasePrice] = useState(5);
  const [bulkDiscountEnabled, setBulkDiscountEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/pricing-config", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) {
          setTiers(json.data.tiers || []);
          setBasePrice(json.data.basePrice || 5);
          setBulkDiscountEnabled(json.data.bulkDiscountEnabled ?? true);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/admin/pricing-config", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tiers, basePrice, bulkDiscountEnabled }),
      });
      const json = await res.json();
      if (json.success) toast.success("Prețurile au fost salvate!");
      else toast.error("Eroare la salvare");
    } catch { toast.error("Eroare de rețea"); }
    finally { setSaving(false); }
  };

  const addTier = () => {
    setTiers([...tiers, { name: "", credits: 10, price: 0, discount: 0 }]);
  };

  const removeTier = (idx: number) => {
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const updateTier = (idx: number, field: keyof PricingTier, value: any) => {
    const updated = [...tiers];
    updated[idx] = { ...updated[idx], [field]: value };
    setTiers(updated);
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prețuri Dinamice</h1>
              <p className="text-gray-500">Configurează pachete și prețuri credite</p>
            </div>
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <>
              {/* Base price */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Preț de bază</h2>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preț per credit (RON)</label>
                    <input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className="w-32 rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Discount bulk activ</span>
                    <ToggleSwitch checked={bulkDiscountEnabled} onChange={setBulkDiscountEnabled} color="purple" />
                  </div>
                </div>
              </div>

              {/* Tiers */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Pachete de credite</h2>
                  <button onClick={addTier} className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700">
                    <PlusIcon className="h-4 w-4" /> Adaugă pachet
                  </button>
                </div>

                <div className="space-y-3">
                  {tiers.map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <input
                        value={tier.name}
                        onChange={(e) => updateTier(idx, "name", e.target.value)}
                        className="w-32 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-purple-500 focus:outline-none"
                        placeholder="Nume"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tier.credits}
                          onChange={(e) => updateTier(idx, "credits", Number(e.target.value))}
                          className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-purple-500 focus:outline-none"
                        />
                        <span className="text-xs text-gray-500">credite</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => updateTier(idx, "price", Number(e.target.value))}
                          className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-purple-500 focus:outline-none"
                        />
                        <span className="text-xs text-gray-500">RON</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tier.discount}
                          onChange={(e) => updateTier(idx, "discount", Number(e.target.value))}
                          className="w-16 rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-purple-500 focus:outline-none"
                        />
                        <span className="text-xs text-gray-500">% disc.</span>
                      </div>
                      <div className="ml-auto text-sm text-gray-500">
                        {tier.credits > 0 ? `${(tier.price / tier.credits).toFixed(1)} RON/credit` : "—"}
                      </div>
                      <button onClick={() => removeTier(idx)} className="rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {tiers.length === 0 && (
                    <p className="py-8 text-center text-gray-400">Niciun pachet configurat</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow hover:bg-purple-700 disabled:opacity-50">
                  {saving ? "Se salvează..." : "Salvează prețurile"}
                </button>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
