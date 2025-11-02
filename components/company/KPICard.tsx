"use client";

import { motion } from "framer-motion";

export default function KPICard({
  title,
  value,
  from = "from-emerald-500",
  to = "to-emerald-600",
  delay = 0,
}: {
  title: string;
  value: string | number;
  from?: string;
  to?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${from} ${to} p-6 text-white shadow-lg transition-transform hover:scale-105`}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/10" />
      <div className="relative">
        <p className="mb-1 text-sm font-medium text-white/80">{title}</p>
        <p className="text-4xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
