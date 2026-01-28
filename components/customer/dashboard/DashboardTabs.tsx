// components/customer/dashboard/DashboardTabs.tsx
// Tab navigation for the customer dashboard

import { PlusCircleIcon as PlusSquare, ListBulletIcon as List, InboxIcon as Inbox, ArchiveBoxIcon as ArchiveIcon } from "@heroicons/react/24/outline";
import type { DashboardTab } from "@/types";

type Props = {
  activeTab: DashboardTab;
  onTabChange: (_tab: DashboardTab) => void;
  totalOffers: number;
};

export default function DashboardTabs({ activeTab, onTabChange, totalOffers }: Props) {
  const tabs: { key: DashboardTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      key: "new",
      label: "Cerere Nouă",
      icon: <PlusSquare className="h-4 w-4" />,
    },
    {
      key: "offers",
      label: "Oferte",
      icon: <Inbox className="h-4 w-4" />,
      badge: totalOffers > 0 ? totalOffers : undefined,
    },
    {
      key: "requests",
      label: "Cererile mele",
      icon: <List className="h-4 w-4" />,
    },
    {
      key: "archive",
      label: "Arhivă",
      icon: <ArchiveIcon className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mb-8">
      <div className="inline-flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10"
                : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
