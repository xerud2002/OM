import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

type OfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
   
  onConfirm: (price: number, message: string) => Promise<void>;
  title?: string;
  isLoading?: boolean;
  offerCost?: number; // Credits cost for this offer
};

export default function OfferModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Trimite Ofertă",
  isLoading = false,
  offerCost,
}: OfferModalProps) {
  const [price, setPrice] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    try {
      await onConfirm(Number(price), message);
      setPrice("");
      setMessage("");
      onClose();
    } catch {
      // Error handled by caller; keep form open so user can retry
    }
  };

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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 ring-1 ring-blue-100">
                  <PaperAirplaneIcon className="h-7 w-7 text-blue-600" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-center text-xl font-bold text-gray-900">
                  {title}
                </h3>
                <p className="mb-4 text-center text-sm text-gray-500">
                  Introduceți prețul și un mesaj opțional pentru client.
                </p>

                {/* Cost info */}
                {offerCost && (
                  <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    <span>Cost ofertă:</span>
                    <span className="font-bold">{offerCost} credite</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Preț Ofertă (RON)
                    </label>
                    <div className="relative">
                      {!price && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-gray-400 font-medium text-sm select-none">
                            Ex: 1500
                          </span>
                        </div>
                      )}
                      <input
                        type="number"
                        required
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Mesaj pentru client (Opțional)
                    </label>
                    <div className="relative">
                      {!message && (
                        <div className="pointer-events-none absolute top-3 left-4 flex items-start">
                          <span className="text-gray-400 text-sm select-none">
                            Ex: Avem disponibilitate pentru data dorită...
                          </span>
                        </div>
                      )}
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Refund protection notice */}
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 ring-1 ring-emerald-100">
                  <ShieldCheckIcon className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <p className="text-xs text-emerald-800">
                    <strong>Protecție refund:</strong> Dacă clientul nu răspunde
                    în 72h, creditele îți sunt returnate automat.
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md disabled:opacity-50"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !price}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Se trimite..." : "Trimite Ofertă"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
