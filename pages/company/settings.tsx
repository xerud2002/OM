import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { toast } from "sonner";
import {
  Cog6ToothIcon,
  BellIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

interface CompanySettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newRequestNotifications: boolean;
  serviceAreas: string[];
  maxDistance: number;
  autoReply: boolean;
  autoReplyMessage: string;
}

const defaultSettings: CompanySettings = {
  emailNotifications: true,
  smsNotifications: false,
  newRequestNotifications: true,
  serviceAreas: [],
  maxDistance: 100,
  autoReply: false,
  autoReplyMessage: "",
};

const romanianCities = [
  "București", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", 
  "Craiova", "Brașov", "Galați", "Ploiești", "Oradea",
  "Brăila", "Arad", "Pitești", "Sibiu", "Bacău",
  "Târgu Mureș", "Baia Mare", "Buzău", "Botoșani", "Satu Mare"
];

export default function CompanySettings() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const loadSettings = async () => {
      try {
        const docRef = doc(db, "companies", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings({
            emailNotifications: data.emailNotifications ?? true,
            smsNotifications: data.smsNotifications ?? false,
            newRequestNotifications: data.newRequestNotifications ?? true,
            serviceAreas: data.serviceAreas ?? [],
            maxDistance: data.maxDistance ?? 100,
            autoReply: data.autoReply ?? false,
            autoReplyMessage: data.autoReplyMessage ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "companies", user.uid), {
        ...settings,
        updatedAt: new Date(),
      });
      toast.success("Setările au fost salvate!");
    } catch (err) {
      console.error("Failed to save settings", err);
      toast.error("Eroare la salvare");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof CompanySettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const toggleServiceArea = (city: string) => {
    setSettings((prev) => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(city)
        ? prev.serviceAreas.filter((c) => c !== city)
        : [...prev.serviceAreas, city],
    }));
  };

  return (
    <RequireRole allowedRole="company">
      <DashboardLayout role="company" user={user}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Setări</h1>
            <p className="text-gray-500">Configurează preferințele contului tău</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Notifications Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <BellIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Notificări</h2>
                    <p className="text-sm text-gray-500">Configurează cum primești notificări</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notificări email</p>
                      <p className="text-sm text-gray-500">Primește email-uri pentru cereri noi</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notificări SMS</p>
                      <p className="text-sm text-gray-500">Primește SMS-uri pentru cereri urgente</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleChange("smsNotifications", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Cereri noi</p>
                      <p className="text-sm text-gray-500">Notificare instantă când apare o cerere nouă</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={settings.newRequestNotifications}
                        onChange={(e) => handleChange("newRequestNotifications", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Service Areas Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <MapPinIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Zone de activitate</h2>
                    <p className="text-sm text-gray-500">Selectează orașele în care operezi</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {romanianCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => toggleServiceArea(city)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        settings.serviceAreas.includes(city)
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Distanța maximă de operare (km)
                  </label>
                  <input
                    type="number"
                    value={settings.maxDistance}
                    onChange={(e) => handleChange("maxDistance", Number(e.target.value))}
                    min={10}
                    max={500}
                    className="w-32 rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Auto-Reply Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <TruckIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Răspuns automat</h2>
                    <p className="text-sm text-gray-500">Trimite un mesaj automat clienților</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Activează răspuns automat</p>
                      <p className="text-sm text-gray-500">Trimite un mesaj când primești o cerere nouă</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={settings.autoReply}
                        onChange={(e) => handleChange("autoReply", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>

                  {settings.autoReply && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Mesaj automat
                      </label>
                      <textarea
                        value={settings.autoReplyMessage}
                        onChange={(e) => handleChange("autoReplyMessage", e.target.value)}
                        rows={3}
                        placeholder="Ex: Mulțumim pentru cerere! Vă vom contacta în cel mai scurt timp."
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 disabled:opacity-50"
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

