"use client";

import { memo } from "react";

function Sparkline({ data, width = 320, height = 64, stroke = "#10b981" }: { data: number[]; width?: number; height?: number; stroke?: string }) {
  const max = Math.max(1, ...data);
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points.join(" ")} />
    </svg>
  );
}

export default memo(function OffersPerformance({ dailyCounts, dailyRevenue, avgOfferValue }: { dailyCounts: number[]; dailyRevenue: number[]; avgOfferValue: number; }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Performanță (7 zile)</h3>
        <div className="text-xs text-gray-500">Media ofertelor: {new Intl.NumberFormat("ro-RO").format(avgOfferValue)} lei</div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Număr oferte/zi</p>
          <Sparkline data={dailyCounts} width={320} height={64} stroke="#0ea5e9" />
          <div className="mt-2 text-xs text-gray-500">{dailyCounts.join("  •  ")}</div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">Venit acceptat/zi (lei)</p>
          <Sparkline data={dailyRevenue} width={320} height={64} stroke="#10b981" />
          <div className="mt-2 text-xs text-gray-500">{dailyRevenue.map((v) => Math.round(v)).join("  •  ")}</div>
        </div>
      </div>
    </div>
  );
});
