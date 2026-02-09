import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Cog6ToothIcon,
  CurrencyEuroIcon,
  BellIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";

interface PlatformSettings {
  creditPrice: number;
  creditsPerContact: number;
  welcomeCredits: number;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  adminEmail: string;
}

const defaultSettings: PlatformSettings = {
  creditPrice: 5,
  creditsPerContact: 1,
  welcomeCredits: 3,
  maintenanceMode: false,
  emailNotifications: true,
  adminEmail: "admin@ofertemutare.ro",
};

export default function AdminSettings() {
  const { dashboardUser } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docRef = doc(db, "meta", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() });
        }
      } catch (err) {
        logger.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "meta", "settings"), settings);
      toast.success("Setările au fost salvate!");
    } catch (err) {
      logger.error("Failed to save settings", err);
      toast.error("Eroare la salvare");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof PlatformSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setări Platformă</h1>
            <p className="text-gray-500">Configurează setările generale ale platformei</p>
          </div>

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner size="lg" color="purple" />
            </LoadingContainer>
          ) : (
            <div className="space-y-6">
              {/* Credits Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <CurrencyEuroIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Credite</h2>
                    <p className="text-sm text-gray-500">Configurare sistem de credite</p>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Preț credit (RON)
                    </label>
                    <input
                      type="number"
                      value={settings.creditPrice}
                      onChange={(e) => handleChange("creditPrice", Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Credite per contact
                    </label>
                    <input
                      type="number"
                      value={settings.creditsPerContact}
                      onChange={(e) => handleChange("creditsPerContact", Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Credite cadou (înregistrare)
                    </label>
                    <input
                      type="number"
                      value={settings.welcomeCredits}
                      onChange={(e) => handleChange("welcomeCredits", Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <BellIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Notificări</h2>
                    <p className="text-sm text-gray-500">Configurare notificări email</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notificări email</p>
                      <p className="text-sm text-gray-500">Trimite email-uri pentru evenimente importante</p>
                    </div>
                    <ToggleSwitch
                      checked={settings.emailNotifications}
                      onChange={(checked) => handleChange("emailNotifications", checked)}
                      color="purple"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      <EnvelopeIcon className="mr-2 inline h-4 w-4" />
                      Email administrator
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleChange("adminEmail", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-purple-500 focus:outline-none sm:w-96"
                    />
                  </div>
                </div>
              </div>

              {/* System Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <ShieldCheckIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Sistem</h2>
                    <p className="text-sm text-gray-500">Configurări de sistem</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                  <div>
                    <p className="font-medium text-red-900">Mod mentenanță</p>
                    <p className="text-sm text-red-700">
                      Când este activ, utilizatorii văd o pagină de mentenanță
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={settings.maintenanceMode}
                    onChange={(checked) => handleChange("maintenanceMode", checked)}
                    color="red"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 disabled:opacity-50"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  {saving ? "Se salvează..." : "Salvează setările"}
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}

