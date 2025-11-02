"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, RotateCcw } from "lucide-react";

export type TourStep = {
  title: string;
  description: string;
};

export default function OnboardingTour({
  id,
  steps,
  initialOpen,
}: {
  id: string; // localStorage key suffix
  steps: TourStep[];
  initialOpen?: boolean;
}) {
  const storageKey = useMemo(() => `om_tour_${id}_completed`, [id]);
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const completed = localStorage.getItem(`om_tour_${id}_completed`) === "1";
    return !!initialOpen || !completed;
  });
  const [index, setIndex] = useState<number>(0);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  };

  const restart = () => {
    setIndex(0);
    setOpen(true);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  if (!open || steps.length === 0) return (
    <button
      onClick={restart}
      className="fixed bottom-6 right-6 z-[60] hidden items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-xs text-gray-700 shadow backdrop-blur hover:bg-white sm:flex"
      aria-label="Pornește ghidul"
    >
      <RotateCcw size={14} /> Ghid
    </button>
  );

  const step = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key={`tour-${id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed bottom-6 right-6 z-[60] max-w-sm"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-3 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Ghid</p>
              <h4 className="mt-1 text-base font-semibold text-gray-900">{step.title}</h4>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
              <p className="mt-2 text-xs text-gray-400">Pas {index + 1} din {steps.length}</p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Închide"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 p-3">
            <button
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Înapoi
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={restart}
                className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
              >
                <RotateCcw size={14} className="inline" /> Restart
              </button>
              <button
                onClick={() => (isLast ? close() : setIndex((i) => Math.min(i + 1, steps.length - 1)))}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                {isLast ? "Gata" : "Înainte"} {!isLast && <ChevronRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
