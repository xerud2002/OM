"use client";

import { motion } from "framer-motion";

export default function TypingDots({ label = "Tastează..." }: { label?: string }) {
  const dot = {
    initial: { y: 0, opacity: 0.4 },
    animate: (i: number) => ({
      y: [0, -3, 0],
      opacity: [0.4, 1, 0.4],
      transition: { repeat: Infinity, duration: 0.8, delay: i * 0.15 },
    }),
  };

  return (
    <div className="inline-flex items-center gap-2 text-xs text-gray-500">
      <span>{label}</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400"
            variants={dot}
            initial="initial"
            animate={"animate" as any}
            custom={i}
          />
        ))}
      </div>
    </div>
  );
}
