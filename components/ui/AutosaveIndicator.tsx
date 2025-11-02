"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Cloud } from "lucide-react";

type AutosaveIndicatorProps = {
  lastSaved?: Date;
  isSaving?: boolean;
};

export default function AutosaveIndicator({ lastSaved, isSaving = false }: AutosaveIndicatorProps) {
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    if (lastSaved) {
      // Avoid synchronous setState inside effect to satisfy lint rule; schedule asynchronously
      const showTimer = setTimeout(() => setShowSavedMessage(true), 0);
      const hideTimer = setTimeout(() => setShowSavedMessage(false), 3000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [lastSaved]);

  return (
    <AnimatePresence mode="wait">
      {isSaving ? (
        <motion.div
          key="saving"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700"
        >
          <Cloud size={14} className="animate-pulse" />
          Se salvează...
        </motion.div>
      ) : showSavedMessage && lastSaved ? (
        <motion.div
          key="saved"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 shadow-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Check size={14} />
          </motion.div>
          Salvat automat
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// Floating toast version
export function AutosaveToast({ show, onHide }: { show: boolean; onHide: () => void }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-300 bg-emerald-500 px-6 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-2 text-white">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Check size={20} />
            </motion.div>
            <span className="font-semibold">Datele tale au fost salvate!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
