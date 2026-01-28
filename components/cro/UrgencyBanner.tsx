"use client";

import { BoltIcon as Zap } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface UrgencyBannerProps {
  city?: string;
  className?: string;
}

export default function UrgencyBanner({ city = "București", className = "" }: UrgencyBannerProps) {
  // Use stable initial values to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [requestCount, setRequestCount] = useState(23);
  const [activeUsers, setActiveUsers] = useState(84);
  const [recentAction, setRecentAction] = useState<string | null>(null);

  // Mark as mounted to enable dynamic updates
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Randomize basic stats slightly for realism
    const interval = setInterval(() => {
      setRequestCount((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
      setActiveUsers(80 + Math.floor(Math.random() * 25));
    }, 5000);

    // Simulate "live" actions
    const actionInterval = setInterval(() => {
      const actions = [
        "Cineva din Cluj tocmai a cerut o ofertă",
        "O nouă firmă s-a înregistrat",
        "3 oferte trimise în ultimele 5 minute",
        `Cineva din ${city} analizează o ofertă`,
      ];
      setRecentAction(actions[Math.floor(Math.random() * actions.length)]);
      setTimeout(() => setRecentAction(null), 4000); // Show for 4s
    }, 12000);

    return () => {
      clearInterval(interval);
      clearInterval(actionInterval);
    };
  }, [city, isMounted]);

  return (
    <div className={`relative z-20 flex flex-col items-center gap-2 ${className}`}>
      {/* Main Glass Pill - Compact & Centered */}
      <div className="flex flex-col items-center gap-3 rounded-full border border-white/40 bg-white/80 py-2 pr-6 pl-3 shadow-xl shadow-emerald-900/5 backdrop-blur-xl sm:flex-row sm:gap-6 sm:py-2.5">
        {/* Left: Active Users with Avatars */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-2 sm:border-r sm:border-b-0 sm:pr-6 sm:pb-0">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gray-200`}
              >
                <Image
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + activeUsers}`}
                  alt="User"
                  width={32}
                  height={32}
                  className="h-full w-full"
                  unoptimized
                />
              </div>
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-[10px] font-bold text-emerald-700">
              +{activeUsers - 3}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700">LIVE</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
              Utilizatori activi
            </span>
          </div>
        </div>

        {/* Right: Request Stats */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-50 p-2 text-orange-600">
            <Zap className="h-4 w-4 fill-orange-600" />
          </div>
          <div className="text-sm">
            <p className="leading-none font-bold text-slate-800">{requestCount} cereri azi</p>
            <p className="text-xs text-slate-500">în {city} și împrejurimi</p>
          </div>
        </div>
      </div>

      {/* Floating Action Toast - Appears below */}
      <AnimatePresence>
        {recentAction && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 flex items-center gap-2 rounded-lg border border-emerald-100 bg-white px-3 py-1.5 shadow-sm"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-slate-600">{recentAction}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
