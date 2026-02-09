"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import {
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CurrencyDollarIcon,
  GiftIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// Romanian counties list
const COUNTIES = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași",
  "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
  "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
  "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj",
  "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"
];

type OnboardingWizardProps = {
  companyId: string;
  companyData: any;
  onComplete: () => void;
  onSkip?: () => void;
};

type Step = {
  id: number;
  title: string;
  subtitle: string;
  icon: typeof SparklesIcon;
};

const STEPS: Step[] = [
  { id: 1, title: "Bine ai venit!", subtitle: "Cum funcționează platforma", icon: SparklesIcon },
  { id: 2, title: "Profilul firmei", subtitle: "Completează informațiile", icon: BuildingOffice2Icon },
  { id: 3, title: "Zone de operare", subtitle: "Unde oferi servicii", icon: MapPinIcon },
  { id: 4, title: "Gata de start!", subtitle: "Primește cereri acum", icon: RocketLaunchIcon },
];

export default function OnboardingWizard({
  companyId,
  companyData,
  onComplete,
  onSkip,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(companyData?.onboardingStep || 1);
  const [saving, setSaving] = useState(false);

  // Form data
  const [companyName, setCompanyName] = useState(companyData?.companyName || "");
  const [phone, setPhone] = useState(companyData?.phone || "");
  const [description, setDescription] = useState(companyData?.description || "");
  const [selectedCounties, setSelectedCounties] = useState<string[]>(
    companyData?.serviceCounties || []
  );

  const credits = companyData?.credits || 50;

  const toggleCounty = (county: string) => {
    setSelectedCounties((prev) =>
      prev.includes(county)
        ? prev.filter((c) => c !== county)
        : [...prev, county]
    );
  };

  const selectAllNearby = (baseCounty: string) => {
    // Simple proximity logic for neighboring counties
    const neighbors: Record<string, string[]> = {
      "București": ["Ilfov", "Giurgiu", "Călărași", "Ialomița", "Prahova", "Dâmbovița"],
      "Cluj": ["Bistrița-Năsăud", "Maramureș", "Sălaj", "Bihor", "Alba", "Mureș"],
      "Timiș": ["Arad", "Caraș-Severin", "Hunedoara"],
      "Iași": ["Botoșani", "Suceava", "Neamț", "Bacău", "Vaslui"],
      "Constanța": ["Tulcea", "Brăila", "Ialomița", "Călărași"],
    };

    if (neighbors[baseCounty]) {
      setSelectedCounties((prev) => {
        const newSet = new Set([...prev, baseCounty, ...neighbors[baseCounty]]);
        return Array.from(newSet);
      });
    }
  };

  const saveProgress = async (step: number, data: any = {}) => {
    setSaving(true);
    try {
      const docRef = doc(db, "companies", companyId);
      await updateDoc(docRef, {
        onboardingStep: step,
        ...data,
        updatedAt: new Date(),
      });
    } catch (err) {
      logger.error("Error saving progress:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Save profile data
      if (!companyName) {
        toast.error("Te rugăm să introduci numele firmei");
        return;
      }
      await saveProgress(3, { companyName, phone, description });
    } else if (currentStep === 3) {
      // Save service counties
      if (selectedCounties.length === 0) {
        toast.error("Selectează cel puțin o zonă de operare");
        return;
      }
      await saveProgress(4, { serviceCounties: selectedCounties });
    } else {
      await saveProgress(currentStep + 1);
    }
    setCurrentStep((prev: number) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev: number) => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "companies", companyId);
      await updateDoc(docRef, {
        onboardingCompleted: true,
        onboardingStep: 4,
        serviceCounties: selectedCounties,
        updatedAt: new Date(),
      });
      toast.success("Felicitări! Ești gata să primești cereri! 🎉");
      onComplete();
    } catch (err) {
      logger.error("Error completing onboarding:", err);
      toast.error("Eroare la salvare. Încearcă din nou.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Skip button */}
        {onSkip && currentStep < 4 && (
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        {/* Progress bar */}
        <div className="flex gap-1 px-6 pt-6">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step.id <= currentStep ? "bg-emerald-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-8 px-6 pt-4 pb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id === currentStep ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  step.id < currentStep
                    ? "bg-emerald-500 text-white"
                    : step.id === currentStep
                    ? "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-500"
                    : "bg-gray-100"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckIcon className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="mt-1 hidden sm:block text-[10px] font-medium">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: "calc(90vh - 200px)" }}>
          <AnimatePresence mode="wait">
            {/* STEP 1: Welcome */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg">
                    <SparklesIcon className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Bine ai venit pe OferteMutare.ro!
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Aici vei găsi cereri reale de la clienți care caută servicii de mutări.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex gap-4 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                      <GiftIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-900">
                        {credits} credite cadou!
                      </h3>
                      <p className="text-sm text-emerald-700">
                        Ai primit {credits} credite pentru a trimite prima ta ofertă gratuit.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                      <CurrencyDollarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">Plătești doar pentru rezultate</h3>
                      <p className="text-sm text-blue-700">
                        Costul per ofertă: 30-50 credite (în funcție de zonă). 1 credit = 1 RON.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                      <ShieldCheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900">Protecție refund</h3>
                      <p className="text-sm text-amber-700">
                        Dacă clientul nu răspunde în 72h, primești creditele înapoi automat.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-600">
                    <strong>Cum funcționează:</strong> Clienții trimit cereri → Tu trimiți ofertă cu preț → Clientul acceptă → Faci jobul! 💪
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Company Profile */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">Completează profilul firmei</h2>
                  <p className="mt-1 text-gray-600">Aceste informații vor fi vizibile clienților.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Numele firmei <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ex: Transport & Mutări SRL"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Telefon de contact
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Descriere firmă
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Spune-le clienților de ce să te aleagă pe tine..."
                      rows={3}
                      className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  <strong>Sfat:</strong> Poți adăuga logo, documente și mai multe detalii din pagina de Profil după finalizare.
                </div>
              </motion.div>
            )}

            {/* STEP 3: Service Areas */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 py-4"
              >
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">Unde oferi servicii?</h2>
                  <p className="mt-1 text-gray-600">
                    Selectează județele în care vrei să primești cereri.
                  </p>
                </div>

                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => selectAllNearby("București")}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    București + Împrejurimi
                  </button>
                  <button
                    onClick={() => selectAllNearby("Cluj")}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Cluj + Împrejurimi
                  </button>
                  <button
                    onClick={() => setSelectedCounties(COUNTIES)}
                    className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 transition-colors"
                  >
                    Toată România
                  </button>
                  <button
                    onClick={() => setSelectedCounties([])}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Resetează
                  </button>
                </div>

                {/* County grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1">
                  {COUNTIES.map((county) => (
                    <button
                      key={county}
                      onClick={() => toggleCounty(county)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        selectedCounties.includes(county)
                          ? "bg-emerald-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {county}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm text-gray-600">
                    Județe selectate: <strong>{selectedCounties.length}</strong>
                  </span>
                  {selectedCounties.length > 0 && (
                    <span className="text-xs text-emerald-600">
                      ✓ Vei primi cereri din aceste zone
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Ready! */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg">
                    <RocketLaunchIcon className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Ești gata de start!</h2>
                  <p className="mt-2 text-gray-600">
                    Profilul tău este configurat. Acum poți vedea cererile și trimite oferte.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                    <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
                    <span className="font-medium text-emerald-900">
                      {credits} credite disponibile pentru prima ofertă
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                    <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                    <span className="font-medium text-blue-900">
                      {selectedCounties.length} județe configurate pentru cereri
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                    <ClockIcon className="h-6 w-6 text-amber-500" />
                    <span className="font-medium text-amber-900">
                      Verificare cont: în așteptare (poți trimite oferte după aprobare)
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-center text-white">
                  <p className="font-semibold">🎁 Ofertă prima achiziție</p>
                  <p className="text-sm opacity-90 mt-1">
                    199 RON → 300 credite (+50% bonus)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between gap-4 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium transition-colors ${
              currentStep === 1
                ? "cursor-not-allowed text-gray-300"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Înapoi
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Se salvează..." : "Continuă"}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Se finalizează..." : "Hai să începem!"}
              <SparklesIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
