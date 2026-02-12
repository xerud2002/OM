// components/admin/StatCard.tsx
// KPI card with value, trend comparison, and optional sparkline

import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg?: string; // Tailwind bg class, e.g. "bg-blue-100"
  iconColor?: string; // Tailwind text class, e.g. "text-blue-600"
  trend?: number; // percentage change vs previous period
  trendLabel?: string; // e.g. "vs luna trecută"
  sparklineData?: number[]; // optional mini chart data
  loading?: boolean;
  onClick?: () => void;
}

function MiniSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-400"
      />
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-purple-100",
  iconColor = "text-purple-600",
  trend,
  trendLabel = "vs luna trecută",
  sparklineData,
  loading = false,
  onClick,
}: StatCardProps) {
  const trendIsPositive = trend !== undefined && trend > 0;
  const trendIsNegative = trend !== undefined && trend < 0;
  const trendIsNeutral = trend !== undefined && trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all ${
        onClick ? "cursor-pointer hover:border-purple-300 hover:shadow-md" : ""
      }`}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex h-18 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-200 border-t-purple-600" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`rounded-xl ${iconBg} p-2.5`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              {sparklineData && sparklineData.length > 1 && (
                <MiniSparkline data={sparklineData} />
              )}
            </div>
          </div>
          {trend !== undefined && (
            <div className="mt-3 flex items-center gap-1.5">
              {trendIsPositive && (
                <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500" />
              )}
              {trendIsNegative && (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              {trendIsNeutral && (
                <MinusIcon className="h-4 w-4 text-gray-400" />
              )}
              <span
                className={`text-xs font-semibold ${
                  trendIsPositive
                    ? "text-emerald-600"
                    : trendIsNegative
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {trendIsPositive ? "+" : ""}
                {trend}%
              </span>
              <span className="text-xs text-gray-400">{trendLabel}</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
