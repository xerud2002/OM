import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, AlertCircle } from "lucide-react";
import { MovingRequest } from "../../types";
import RequestForm from "./RequestForm";

type EditRequestModalProps = {
  request: MovingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (requestId: string, updatedData: any) => Promise<void>;
};

export default function EditRequestModal({
  request,
  isOpen,
  onClose,
  onSave,
}: EditRequestModalProps) {
  const [form, setForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when modal opens
  useState(() => {
    if (request && isOpen && !form) {
      setForm({
        fromCity: request.fromCity || "",
        fromCounty: request.fromCounty || "",
        fromAddress: request.fromAddress || "",
        fromType: request.fromType || "",
        fromFloor: request.fromFloor ?? "",
        fromElevator: request.fromElevator ?? false,
        toCity: request.toCity || "",
        toCounty: request.toCounty || "",
        toAddress: request.toAddress || "",
        toType: request.toType || "",
        toFloor: request.toFloor ?? "",
        toElevator: request.toElevator ?? false,
        moveDate: request.moveDate || "",
        moveDateMode: "exact",
        moveDateStart: "",
        moveDateEnd: "",
        moveDateFlexDays: 3,
        details: request.details || "",
        rooms: request.rooms || "",
        volumeM3: request.volumeM3 || "",
        phone: request.phone || "",
        contactName: "",
        contactFirstName: "",
        contactLastName: "",
        needPacking: request.needPacking || false,
        hasElevator: request.hasElevator || false,
        budgetEstimate: request.budgetEstimate || 0,
        specialItems: request.specialItems || "",
        serviceMoving: request.serviceMoving || false,
        servicePacking: request.servicePacking || false,
        serviceDisassembly: request.serviceDisassembly || false,
        serviceCleanout: request.serviceCleanout || false,
        serviceStorage: request.serviceStorage || false,
        surveyType: request.surveyType || "quick-estimate",
        mediaUpload: "now",
        mediaFiles: [],
      });
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !form) return;

    setIsSaving(true);
    try {
      await onSave(request.id, form);
      onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!request || !form) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Modifică cererea</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Actualizează detaliile mutării tale
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-white/80"
                  disabled={isSaving}
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Warning */}
              <div className="border-b border-yellow-200 bg-yellow-50 px-6 py-3">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 shrink-0 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Notă importantă:</p>
                    <p>
                      Companiile care au trimis oferte vor fi notificate automat despre modificările
                      tale.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[calc(90vh-220px)] overflow-y-auto p-6">
                <RequestForm
                  form={form}
                  setForm={setForm}
                  onSubmit={handleSave}
                  onReset={() => {
                    onClose();
                  }}
                />
              </div>

              {/* Footer - only shown if not using form buttons */}
              <div className="hidden border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Se salvează...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Salvează modificările
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
