import React from "react";

type Props = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
};

export default function StatCard({ title, value, icon }: Props) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-50">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-emerald-700">{value}</div>
      </div>
    </div>
  );
}
