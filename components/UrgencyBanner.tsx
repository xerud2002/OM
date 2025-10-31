"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type UrgencyBannerProps = {
  offerText?: string;
  expiresInHours?: number;
};

export default function UrgencyBanner({
  offerText =
    "🎁 Ofertă limitată: Bonus 50 lei la prima ofertă acceptată. Te conectăm cu firme de mutări și transportatori (van/camion) — nu prestăm serviciul direct.",
  expiresInHours = 24,
}: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  // Defer rendering to client to avoid SSR/CSR mismatch
  const [hasMounted, setHasMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Start countdown only when visible to user
  useEffect(() => {
    if (!hasMounted) return;
    const disabledPrefixes = ["/customer", "/company", "/upload"]; // dashboards & upload flow
    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const shouldShow = !disabledPrefixes.some((p) => path.startsWith(p));
    const visible = shouldShow && !dismissed;
    if (!visible) return;
    // Calculate end time (today end of day)
    const getEndTime = () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("urgency_offer_end") : null;
      if (stored) return new Date(stored);
      const endTime = new Date();
      endTime.setHours(23, 59, 59, 999);
      if (typeof window !== "undefined") {
        localStorage.setItem("urgency_offer_end", endTime.toISOString());
      }
      return endTime;
    };

    const endTime = getEndTime();
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      if (diff <= 0) {
        if (typeof window !== "undefined") localStorage.removeItem("urgency_offer_end");
        setDismissed(true);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [hasMounted, dismissed, expiresInHours]);

  // Until mounted, render nothing to avoid hydration mismatch
  if (!hasMounted) return null;

  const disabledPrefixes = ["/customer", "/company", "/upload"]; // dashboards & upload flow
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const shouldShow = !disabledPrefixes.some((p) => path.startsWith(p));
  const visible = shouldShow && !dismissed;

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed left-0 right-0 top-[80px] z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-3 text-center text-white shadow-lg"
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 text-sm font-semibold md:text-base">
          <span className="flex items-center gap-2">
            <Clock size={18} />
            {offerText}
          </span>
          <span className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
            ⏰ Expiră în:
            <span className="font-mono text-lg font-bold">
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="ml-2 rounded-full bg-white/20 px-3 py-1 text-xs transition hover:bg-white/30"
            aria-label="Închide banner"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
