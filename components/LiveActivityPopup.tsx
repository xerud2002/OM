"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const activities = [
  { city: "București", name: "Maria P.", action: "a primit 5 oferte", time: 3 },
  { city: "Cluj-Napoca", name: "Ion M.", action: "a economisit 430 lei", time: 7 },
  { city: "Brașov", name: "Elena S.", action: "a rezervat o mutare", time: 5 },
  { city: "Timișoara", name: "Andrei T.", action: "a primit 4 oferte", time: 2 },
  { city: "Iași", name: "Diana C.", action: "a economisit 380 lei", time: 9 },
  { city: "Constanța", name: "Mihai R.", action: "a rezervat o mutare", time: 4 },
  { city: "Craiova", name: "Laura B.", action: "a primit 6 oferte", time: 6 },
  { city: "Galați", name: "Cristian V.", action: "a economisit 520 lei", time: 8 },
];

export default function LiveActivityPopup() {
  const [currentActivity, setCurrentActivity] = useState(activities[0]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => setShow(true), 3000);

    // Rotate activities every 8 seconds
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setCurrentActivity(randomActivity);
        setShow(true);
      }, 500);
    }, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-24 left-4 z-50 max-w-xs rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl md:bottom-6 md:left-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {currentActivity.name} din {currentActivity.city}
              </p>
              <p className="text-xs text-gray-600">{currentActivity.action}</p>
              <p className="mt-1 text-xs text-emerald-600">Acum {currentActivity.time} minute</p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 transition hover:text-gray-600"
              aria-label="Închide notificarea"
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
