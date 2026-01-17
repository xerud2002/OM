// Company Dashboard Analytics Component
"use client";

import { TrendingUp, Users, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
  quotesReceived: number;
  responseRate: number;
  winRate: number;
  avgResponseTime: string;
}

export default function CompanyAnalytics({ stats }: { stats?: DashboardStats }) {
  const defaultStats: DashboardStats = {
    quotesReceived: stats?.quotesReceived || 0,
    responseRate: stats?.responseRate || 0,
    winRate: stats?.winRate || 0,
    avgResponseTime: stats?.avgResponseTime || "0h",
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Quotes Received */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Cereri Primite</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {defaultStats.quotesReceived}
            </p>
          </div>
          <div className="rounded-lg bg-blue-100 p-3">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">Săptămâna aceasta</p>
      </div>

      {/* Response Rate */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rata Răspuns</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {defaultStats.responseRate}%
            </p>
          </div>
          <div className="rounded-lg bg-green-100 p-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">Ultimele 30 zile</p>
      </div>

      {/* Win Rate */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Rata Câștig</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {defaultStats.winRate}%
            </p>
          </div>
          <div className="rounded-lg bg-orange-100 p-3">
            <Users className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">Oferte acceptate</p>
      </div>

      {/* Response Time */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Timp Răspuns</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {defaultStats.avgResponseTime}
            </p>
          </div>
          <div className="rounded-lg bg-purple-100 p-3">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">Timp mediu răspuns</p>
      </div>
    </div>
  );
}
