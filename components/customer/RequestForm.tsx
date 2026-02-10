import React, { useState, useEffect, useRef } from "react";
import {
  MapPinIcon,
  HomeIcon,
  TruckIcon,
  CalendarIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CubeIcon,
  UserIcon,
  LockClosedIcon,
  VideoCameraIcon,
  BoltIcon,
  CloudArrowUpIcon,
  EnvelopeIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import counties from "@/counties";
import cities from "@/cities";

// Types (kept inline or imported)
export type FormShape = {
  fromCounty?: string;
  fromCity?: string;
  fromCityManual?: boolean;
  fromStreet?: string;
  fromNumber?: string;
  toCounty?: string;
  toCity?: string;
  toCityManual?: boolean;
  toStreet?: string;
  toNumber?: string;
  moveDate?: string;
  fromType?: "house" | "flat" | "office";
  fromFloor?: string;
  fromElevator?: boolean;
  toType?: "house" | "flat" | "office";
  toFloor?: string;
  toElevator?: boolean;
  fromRooms?: string | number;
  toRooms?: string | number;
  phone?: string;
  email?: string;
  details?: string;
  serviceMoving?: boolean;
  servicePacking?: boolean;
  serviceDisassembly?: boolean;
  serviceCleanout?: boolean;
  serviceStorage?: boolean;
  serviceTransportOnly?: boolean;

  servicePiano?: boolean; // Added
  serviceFewItems?: boolean; // Added
  mediaUpload?: "now" | "later" | "none" | "list"; // Added list option
  mediaFiles?: File[];
  moveDateMode?: "exact" | "range" | "none" | "flexible" | "urgent";
  moveDateStart?: string;
  moveDateEnd?: string;
  moveDateFlexDays?: number;
  contactName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  acceptedTerms?: boolean;
  itemsList?: string; // Added for HomeRequestForm
  surveyType?: "in-person" | "video" | "quick-estimate";
};

type Props = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
  onSubmit: React.FormEventHandler;
  onReset: () => void;
};

// Steps Configuration
const STEPS = [
  { id: 1, title: "Plecare", icon: MapPinIcon, desc: "De unde pleci?" },
  { id: 2, title: "Destinație", icon: HomeIcon, desc: "Unde te muți?" },
  { id: 3, title: "Servicii", icon: CheckCircleIcon, desc: "Ce ai nevoie?" },
  { id: 4, title: "Detalii", icon: CalendarIcon, desc: "Dată și obiecte" },
  { id: 5, title: "Contact", icon: UserIcon, desc: "Datele tale" },
];

export default function RequestForm({ form, setForm, onSubmit }: Props) {
  // Logic:
  // - currentStep: The "highest" step currently unlocked/active.
  // - We render ALL steps in a vertical list.
  // - Steps > currentStep are "locked" (opacity, pointer-events-none).
  // - User can scroll back up to edit previous steps.

  const [currentStep, setCurrentStep] = useState(1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to new step when it unlocks
  useEffect(() => {
    if (currentStep > 1) {
      const target = stepRefs.current[currentStep - 1];
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep]);

  const getCityOptions = (county?: string) => {
    if (county === "București") {
      return ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"];
    }
    return county && (cities as any)[county] ? (cities as any)[county] : [];
  };

  const handleNext = (stepId: number) => {
    // Validate Step 1
    if (stepId === 1) {
      if (!form.fromCounty || !form.fromCity || !form.fromRooms) {
        toast.error("Completează câmpurile obligatorii (Județ, Localitate, Camere)");
        return;
      }
    }
    // Validate Step 2
    if (stepId === 2) {
      if (!form.toCounty || !form.toCity || !form.toRooms) {
        toast.error("Completează câmpurile obligatorii (Județ, Localitate, Camere)");
        return;
      }
    }

    // Unlock next step
    if (stepId >= currentStep && stepId < STEPS.length) {
      setCurrentStep(stepId + 1);
    }
  };

  // Jump to step (only if unlocked) - disabled, kept for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleJumpToStep = (stepId: number) => {
    if (stepId <= currentStep) {
      const target = stepRefs.current[stepId - 1];
      // Determine offset based on screen size (stikcy header etc) - rudimentary
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // --- RENDER HELPERS ---

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "locked";
  };

  // Step 1: Origin
  const renderOrigin = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Județ <span className="text-red-500">*</span></label>
          <select
            value={form.fromCounty || ""}
            onChange={(e) => setForm((s) => ({ ...s, fromCounty: e.target.value, fromCity: "", fromCityManual: false }))}
            className="w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Selectează județ</option>
            {counties.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Localitate <span className="text-red-500">*</span></label>
          {!form.fromCityManual ? (
            <select
              disabled={!form.fromCounty}
              value={form.fromCity || ""}
              onChange={(e) => e.target.value === "__other__" ? setForm(s => ({ ...s, fromCity: "", fromCityManual: true })) : setForm(s => ({ ...s, fromCity: e.target.value }))}
              className="w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50"
            >
              <option value="">{form.fromCounty ? "Selectează localitate" : "Alege județ"}</option>
              {getCityOptions(form.fromCounty).map((c: string) => <option key={c} value={c}>{c}</option>)}
              <option value="__other__">Altă localitate...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                value={form.fromCity || ""}
                onChange={e => setForm(s => ({ ...s, fromCity: e.target.value }))}
                className="w-full rounded-xl border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500"
                placeholder="Introdu localitatea"
              />
              <button type="button" onClick={() => setForm(s => ({ ...s, fromCity: "", fromCityManual: false }))} className="rounded-xl border px-3 text-xs">Listă</button>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Stradă (Opțional)</label>
          <input value={form.fromStreet || ""} onChange={e => setForm(s => ({ ...s, fromStreet: e.target.value }))} className="w-full rounded-xl border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-emerald-500" placeholder="ex: Str. Principală nr. 10" />
        </div>
      </div>

      {/* Property Details */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
        <h5 className="mb-3 text-sm font-semibold text-gray-900">Detalii Imobil</h5>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tip</label>
            <select value={form.fromType || "flat"} onChange={e => setForm(s => ({ ...s, fromType: e.target.value as any }))} className="w-full rounded-lg border-gray-200 text-sm">
              <option value="flat">Apartament</option>
              <option value="house">Casă</option>
              <option value="office">Birou</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Camere <span className="text-red-500">*</span></label>
            <input type="number" value={form.fromRooms || ""} onChange={e => setForm(s => ({ ...s, fromRooms: e.target.value }))} className="w-full rounded-lg border-gray-200 text-sm" placeholder="2" />
          </div>
          {form.fromType !== 'house' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Lift</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(s => ({ ...s, fromElevator: true }))} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${form.fromElevator ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white text-gray-600'}`}>DA</button>
                <button type="button" onClick={() => setForm(s => ({ ...s, fromElevator: false }))} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${!form.fromElevator ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-white text-gray-600'}`}>NU</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Step 2: Destination
  const renderDestination = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Județ <span className="text-red-500">*</span></label>
          <select
            value={form.toCounty || ""}
            onChange={(e) => setForm((s) => ({ ...s, toCounty: e.target.value, toCity: "", toCityManual: false }))}
            className="w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selectează județ</option>
            {counties.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Localitate <span className="text-red-500">*</span></label>
          {!form.toCityManual ? (
            <select
              disabled={!form.toCounty}
              value={form.toCity || ""}
              onChange={(e) => e.target.value === "__other__" ? setForm(s => ({ ...s, toCity: "", toCityManual: true })) : setForm(s => ({ ...s, toCity: e.target.value }))}
              className="w-full rounded-xl border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">{form.toCounty ? "Selectează localitate" : "Alege județ"}</option>
              {getCityOptions(form.toCounty).map((c: string) => <option key={c} value={c}>{c}</option>)}
              <option value="__other__">Altă localitate...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                value={form.toCity || ""}
                onChange={e => setForm(s => ({ ...s, toCity: e.target.value }))}
                className="w-full rounded-xl border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-blue-500"
                placeholder="Introdu localitatea"
              />
              <button type="button" onClick={() => setForm(s => ({ ...s, toCity: "", toCityManual: false }))} className="rounded-xl border px-3 text-xs">Listă</button>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Stradă (Opțional)</label>
          <input value={form.toStreet || ""} onChange={e => setForm(s => ({ ...s, toStreet: e.target.value }))} className="w-full rounded-xl border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-blue-500" placeholder="ex: Str. Libertății nr. 5" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
        <h5 className="mb-3 text-sm font-semibold text-gray-900">Detalii Destinație</h5>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Tip</label>
            <select value={form.toType || "flat"} onChange={e => setForm(s => ({ ...s, toType: e.target.value as any }))} className="w-full rounded-lg border-gray-200 text-sm">
              <option value="flat">Apartament</option>
              <option value="house">Casă</option>
              <option value="office">Birou</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Camere <span className="text-red-500">*</span></label>
            <input type="number" value={form.toRooms || ""} onChange={e => setForm(s => ({ ...s, toRooms: e.target.value }))} className="w-full rounded-lg border-gray-200 text-sm" placeholder="3" />
          </div>
          {form.toType !== 'house' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Lift</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm(s => ({ ...s, toElevator: true }))} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${form.toElevator ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white text-gray-600'}`}>DA</button>
                <button type="button" onClick={() => setForm(s => ({ ...s, toElevator: false }))} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${!form.toElevator ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-white text-gray-600'}`}>NU</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Step 3: Services
  const renderServices = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
        <label className="mb-3 block text-sm font-semibold text-gray-900">Servicii căutate <span className="text-red-500">*</span></label>
        <p className="mb-3 text-xs text-gray-500">Selectează serviciile de care ai nevoie</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { id: 'serviceMoving', label: 'Mutare', icon: TruckIcon },
            { id: 'servicePacking', label: 'Împachetare', icon: CubeIcon },
            { id: 'serviceDisassembly', label: 'Demontare', icon: CubeIcon },
            { id: 'serviceCleanout', label: 'Debarasare', icon: CheckCircleIcon }, // Added Cleanout
            { id: 'serviceStorage', label: 'Depozitare', icon: HomeIcon },
            { id: 'serviceTransportOnly', label: 'Doar Transport', icon: TruckIcon },
          ].map(s => (
            <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${(form as any)[s.id] ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}>
              <input type="checkbox" className="sr-only" checked={!!(form as any)[s.id]} onChange={e => setForm(prev => ({ ...prev, [s.id]: e.target.checked }))} />
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${(form as any)[s.id] ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                <s.icon className="h-4 w-4" />
              </div>
              <span className={`text-sm font-medium ${(form as any)[s.id] ? 'text-purple-900' : 'text-gray-700'}`}>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Survey Type */}
      <div className="rounded-xl border border-yellow-100 bg-yellow-50/50 p-4">
        <label className="mb-3 block text-sm font-semibold text-gray-900">Survey și estimare <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setForm(s => ({ ...s, surveyType: 'in-person' }))}
            className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all ${form.surveyType === 'in-person'
              ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500'
              : 'border-gray-200 bg-white hover:border-yellow-300'
              }`}
          >
            <div className={`rounded-lg p-2 ${form.surveyType === 'in-person' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
              <UserIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Survey la fața locului</p>
              <p className="text-xs text-gray-500">Un reprezentant va veni să evalueze bunurile</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setForm(s => ({ ...s, surveyType: 'video' }))}
            className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all ${form.surveyType === 'video'
              ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500'
              : 'border-gray-200 bg-white hover:border-yellow-300'
              }`}
          >
            <div className={`rounded-lg p-2 ${form.surveyType === 'video' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
              <VideoCameraIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Survey video</p>
              <p className="text-xs text-gray-500">Evaluare online rapidă</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setForm(s => ({ ...s, surveyType: 'quick-estimate' }))}
            className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all ${form.surveyType === 'quick-estimate'
              ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500'
              : 'border-gray-200 bg-white hover:border-yellow-300'
              }`}
          >
            <div className={`rounded-lg p-2 ${form.surveyType === 'quick-estimate' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
              <BoltIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Estimare rapidă</p>
              <p className="text-xs text-gray-500">Ofertă estimativă pe baza informațiilor</p>
            </div>
          </button>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-yellow-100 p-3 text-xs text-yellow-800">
          <CheckCircleSolid className="h-5 w-5 shrink-0 text-yellow-600" />
          <p>Recomandăm un survey pentru o ofertă precisă. Un survey ne ajută să determinăm mărimea vehiculului necesar și numărul de oameni pentru mutare.</p>
        </div>
      </div>

      {/* Media Upload */}
      <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
        <label className="mb-3 block text-sm font-semibold text-gray-900">Poze și video <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setForm(s => ({ ...s, mediaUpload: 'now' }))}
            className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all ${form.mediaUpload === 'now'
              ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
              : 'border-gray-200 bg-white hover:border-sky-300'
              }`}
          >
            <div className={`rounded-lg p-2 ${form.mediaUpload === 'now' ? 'bg-sky-200 text-sky-800' : 'bg-gray-100 text-gray-500'}`}>
              <CloudArrowUpIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Upload acum</p>
              <p className="text-xs text-gray-500">Încarcă fotografii/video imediat</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setForm(s => ({ ...s, mediaUpload: 'later' }))}
            className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all ${form.mediaUpload === 'later'
              ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
              : 'border-gray-200 bg-white hover:border-sky-300'
              }`}
          >
            <div className={`rounded-lg p-2 ${form.mediaUpload === 'later' ? 'bg-sky-200 text-sky-800' : 'bg-gray-100 text-gray-500'}`}>
              <EnvelopeIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Primesc link pe email</p>
              <p className="text-xs text-gray-500">Voi primi un link pentru upload ulterior</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setForm(s => ({ ...s, mediaUpload: 'none' }))}
            className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 transition-all ${form.mediaUpload === 'none'
              ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
              : 'border-gray-200 bg-white hover:border-sky-300'
              }`}
          >
            <div className={`rounded-lg p-2 ${form.mediaUpload === 'none' ? 'bg-sky-200 text-sky-800' : 'bg-gray-100 text-gray-500'}`}>
              <XMarkIcon className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Nu doresc să adaug poze</p>
              <p className="text-xs text-gray-500">Continui fără a trimite fotografii/video</p>
            </div>
          </button>
        </div>

        {form.mediaUpload === 'now' && (
          <div className="mt-4 rounded-xl border border-dashed border-sky-300 bg-white p-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500">
              <CloudArrowUpIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Click pentru a încărca fișiere</p>
            <p className="text-xs text-gray-500">Poze sau video (max 50MB per fișier)</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setForm(s => ({ ...s, mediaFiles: files }));
                toast.success(`${files.length} fișiere selectate`);
              }}
            />
            {form.mediaFiles && form.mediaFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {form.mediaFiles.map((f, i) => (
                  <span key={i} className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
                    {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Step 4: Date & Details
  const renderDetails = () => (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-900">Perioada Estimată</label>
        <div className="flex flex-wrap gap-2">
          {['exact', 'flexible', 'none'].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setForm(s => ({ ...s, moveDateMode: mode as any }))}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${form.moveDateMode === mode
                ? 'border-amber-500 bg-amber-100 text-amber-900'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              {mode === 'exact' ? 'Dată Fixă' : mode === 'flexible' ? 'Flexibil' : 'Nu știu încă'}
            </button>
          ))}
        </div>
        {form.moveDateMode === 'exact' && (
          <input type="date" value={form.moveDate || ''} onChange={e => setForm(s => ({ ...s, moveDate: e.target.value }))} className="mt-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
        )}
        {form.moveDateMode === 'flexible' && (
          <div className="mt-3 flex gap-3">
            <input type="date" placeholder="De la" value={form.moveDateStart || ''} onChange={e => setForm(s => ({ ...s, moveDateStart: e.target.value }))} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500" />
            <input type="date" placeholder="Până la" value={form.moveDateEnd || ''} onChange={e => setForm(s => ({ ...s, moveDateEnd: e.target.value }))} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500" />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">Ce obiecte muți?</label>
        <textarea
          rows={4}
          className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-emerald-500 focus:bg-white focus:ring-emerald-500"
          placeholder="Ex: Canapea, pat, frigider, 20 cutii..."
          value={form.details || ''}
          onChange={e => setForm(s => ({ ...s, details: e.target.value }))}
        />
      </div>
    </div>
  );

  // Step 5: Contact
  const renderContact = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Prenume</label>
          <input value={form.contactFirstName || ''} onChange={e => setForm(s => ({ ...s, contactFirstName: e.target.value }))} className="w-full rounded-xl border-gray-200 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nume</label>
          <input value={form.contactLastName || ''} onChange={e => setForm(s => ({ ...s, contactLastName: e.target.value }))} className="w-full rounded-xl border-gray-200 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Telefon</label>
        <input value={form.phone || ''} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} className="w-full rounded-xl border-gray-200 py-3 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 p-4">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" checked={!!form.acceptedTerms} onChange={e => setForm(s => ({ ...s, acceptedTerms: e.target.checked }))} />
          <span className="text-sm text-gray-600">Sunt de acord cu <a href="#" className="font-medium text-emerald-600 underline">Termenii și Condițiile</a></span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* --- CONTENT STACK --- */}
      <div className="min-w-0 w-full space-y-6">
        {STEPS.map((step, index) => {
          // Status for this specific card
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLocked = step.id > currentStep;

          return (
            <div
              key={step.id}
              ref={(el) => { if (el) stepRefs.current[index] = el; }} // Note: index matches step.id-1
              className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 ${isCurrent ? 'border-emerald-500 ring-4 ring-emerald-500/10' :
                isCompleted ? 'border-gray-200 opacity-80 hover:opacity-100' :
                  'border-gray-100 opacity-40 grayscale'
                }`}
            >
              {/* Card Header */}
              <div className={`flex items-center justify-between border-b border-gray-100 px-6 py-4 ${isCurrent ? 'bg-emerald-50/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${isCurrent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                    isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {step.id}
                  </div>
                  <h3 className={`font-bold ${isCurrent ? 'text-lg text-emerald-950' : 'text-base text-gray-700'}`}>{step.title}</h3>
                </div>
                {isCompleted && (
                  <button onClick={() => setCurrentStep(step.id)} className="text-xs font-semibold text-emerald-600 hover:underline">Editează</button>
                )}
                {isLocked && <LockClosedIcon className="h-5 w-5 text-gray-300" />}
              </div>

              {/* Card Body */}
              <div className={`p-6 ${isLocked ? 'pointer-events-none select-none blur-[1px]' : ''}`}>
                {step.id === 1 && renderOrigin()}
                {step.id === 2 && renderDestination()}
                {step.id === 3 && renderServices()}
                {step.id === 4 && renderDetails()}
                {step.id === 5 && renderContact()}
              </div>

              {/* Card Footer (Actions) */}
              {!isLocked && (
                <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                  {step.id < 5 ? (
                    <button
                      type="button"
                      onClick={() => handleNext(step.id)}
                      className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/40"
                    >
                      Continuă
                      <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); onSubmit(e); }}
                      className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
                    >
                      Trimite Cererea
                      <CheckCircleSolid className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


