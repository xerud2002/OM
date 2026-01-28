import { motion, AnimatePresence } from "framer-motion";
import { ExclamationTriangleIcon as AlertTriangle, XMarkIcon as X, TrashIcon as Trash2, ArchiveBoxIcon as Archive, ArrowPathIcon as RotateCcw, InformationCircleIcon as Info } from "@heroicons/react/24/outline";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: "trash" | "archive" | "undo" | "warning" | "info";
  isLoading?: boolean;
};

const iconMap = {
  trash: Trash2,
  archive: Archive,
  undo: RotateCcw,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles = {
  danger: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
  },
  info: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmă",
  cancelText = "Anulează",
  variant = "warning",
  icon = "warning",
  isLoading = false,
}: ConfirmModalProps) {
  const Icon = iconMap[icon];
  const styles = variantStyles[variant];

  const handleConfirm = () => {
    onConfirm();
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
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6">
                {/* Icon */}
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg}`}
                >
                  <Icon className={`h-7 w-7 ${styles.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-center text-xl font-bold text-gray-900">{title}</h3>

                {/* Message */}
                <p className="mb-6 text-center text-gray-600">{message}</p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-md disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white transition-all hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50 ${styles.button}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Se procesează...
                      </span>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
