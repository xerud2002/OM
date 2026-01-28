import { motion } from "framer-motion";
import { ChartBarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface StatCardData {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

interface StatsCardsProps {
  total: number;
  accepted: number;
  pending: number;
  rejected: number;
}

export default function StatsCards({ total, accepted, pending, rejected }: StatsCardsProps) {
  const stats: StatCardData[] = [
    {
      label: "Total oferte",
      value: total,
      icon: ChartBarIcon,
      gradient: "from-slate-600 to-slate-700",
      iconBg: "bg-slate-500/20",
      iconColor: "text-slate-300",
    },
    {
      label: "Acceptate",
      value: accepted,
      icon: CheckCircleIcon,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-400/20",
      iconColor: "text-emerald-300",
    },
    {
      label: "În așteptare",
      value: pending,
      icon: ClockIcon,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-400/20",
      iconColor: "text-amber-300",
    },
    {
      label: "Respinse",
      value: rejected,
      icon: XCircleIcon,
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-rose-400/20",
      iconColor: "text-rose-300",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <div
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 text-white shadow-lg`}
          >
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-white/70">{stat.label}</p>
                <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
              </div>
              <div className={`rounded-xl ${stat.iconBg} p-2.5`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
