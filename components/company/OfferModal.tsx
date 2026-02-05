import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type OfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onConfirm: (price: number, message: string) => Promise<void>;
  title?: string;
  isLoading?: boolean;
};

export default function OfferModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Trimite Ofertă",
  isLoading = false,
}: OfferModalProps) {
  const [price, setPrice] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price) return;
    await onConfirm(Number(price), message);
    setPrice("");
    setMessage("");
    onClose();
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
                <h3 className="mb-2 text-center text-xl font-bold text-gray-900">{title}</h3>
                <p className="mb-6 text-center text-sm text-gray-500">
                  Introduceți prețul și un mesaj opțional pentru client.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Preț Ofertă (RON)</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                         <span className="text-gray-400 font-medium text-sm select-none">RON</span>
                      </div>
                      <input
                        type="number"
                        required
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-16 pr-4 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">Mesaj pentru client (Opțional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Ex: Avem disponibilitate pentru data dorită..."
                      className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex gap-3">
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
