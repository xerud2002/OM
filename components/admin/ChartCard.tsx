// components/admin/ChartCard.tsx
// Wrapper for Recharts charts with title, subtitle, and loading state

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  loading?: boolean;
  height?: number; // chart height in px
  actions?: ReactNode; // optional top-right actions (dropdown, etc.)
  className?: string;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  loading = false,
  height = 300,
  actions,
  className = "",
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="p-6" style={{ minHeight: height }}>
        {loading ? (
          <div
            className="flex items-center justify-center"
            style={{ height }}
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
