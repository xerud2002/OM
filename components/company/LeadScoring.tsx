"use client";

// Note: capture a module-scope timestamp to avoid impure calls during render
const NOW_AT_LOAD = Date.now();
import { Flame, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Calendar, Image as ImageIcon } from "lucide-react";

type LeadScoringProps = {
  request: {
    budgetEstimate?: number;
    moveDate?: string;
    mediaUrls?: string[];
    details?: string;
    phone?: string;
    fromRooms?: string | number;
    toRooms?: string | number;
    serviceMoving?: boolean;
    servicePacking?: boolean;
    serviceDisassembly?: boolean;
    createdAt?: any;
  };
  offersCount?: number;
  isUnlocked?: boolean;
};

export default function LeadScoring({ request, offersCount = 0 }: LeadScoringProps) {
  // Calculate score (0-10) with a module-captured timestamp to preserve purity
  let score = 0;
  const factors: { label: string; points: number; icon: any; color: string }[] = [];

  // Budget specified (+2 points)
  if (request.budgetEstimate && request.budgetEstimate > 0) {
    score += 2;
    factors.push({
      label: "Buget specificat",
      points: 2,
      icon: DollarSign,
      color: "emerald",
    });
  }

  // Move date within 30 days (+2 points)
  if (request.moveDate) {
    const moveDate = new Date(request.moveDate);
    const daysUntil = Math.ceil((moveDate.getTime() - NOW_AT_LOAD) / (1000 * 60 * 60 * 24));
    if (daysUntil > 0 && daysUntil <= 30) {
      score += 2;
      factors.push({
        label: `Data confirmată (${daysUntil} zile)`,
        points: 2,
        icon: Calendar,
        color: "sky",
      });
    } else if (daysUntil > 30 && daysUntil <= 60) {
      score += 1;
      factors.push({
        label: `Data peste 30 zile`,
        points: 1,
        icon: Calendar,
        color: "amber",
      });
    }
  }

  // Media uploaded (+1.5 points)
  if (request.mediaUrls && request.mediaUrls.length > 0) {
    score += 1.5;
    factors.push({
      label: `${request.mediaUrls.length} fișiere media`,
      points: 1.5,
      icon: ImageIcon,
      color: "purple",
    });
  }

  // Detailed description (+1 point)
  if (request.details && request.details.length > 100) {
    score += 1;
    factors.push({
      label: "Descriere detaliată",
      points: 1,
      icon: CheckCircle,
      color: "emerald",
    });
  }

  // Phone provided (+0.5 points)
  if (request.phone) {
    score += 0.5;
    factors.push({
      label: "Telefon furnizat",
      points: 0.5,
      icon: CheckCircle,
      color: "emerald",
    });
  }

  // Large property (+1 point for 4+ rooms)
  const totalRooms = Number(request.fromRooms || 0) + Number(request.toRooms || 0);
  if (totalRooms >= 8) {
    score += 1;
    factors.push({
      label: "Locuință mare (4+ camere)",
      points: 1,
      icon: TrendingUp,
      color: "indigo",
    });
  }

  // Multiple services (+1 point)
  const servicesCount = [
    request.serviceMoving,
    request.servicePacking,
    request.serviceDisassembly,
  ].filter(Boolean).length;
  if (servicesCount >= 2) {
    score += 1;
    factors.push({
      label: `${servicesCount} servicii solicitate`,
      points: 1,
      icon: CheckCircle,
      color: "emerald",
    });
  }

  // Recent request (+0.5 points if < 24h old)
  if (request.createdAt) {
    const createdDate = request.createdAt.toDate ? request.createdAt.toDate() : new Date(request.createdAt);
    const hoursOld = (NOW_AT_LOAD - createdDate.getTime()) / (1000 * 60 * 60);
    if (hoursOld < 24) {
      score += 0.5;
      factors.push({
        label: "Cerere recentă (<24h)",
        points: 0.5,
        icon: Flame,
        color: "rose",
      });
    }
  }

  // Competition penalty (-1 point if > 3 offers)
  if (offersCount > 3) {
    score -= 1;
    factors.push({
      label: `Competiție: ${offersCount} oferte`,
      points: -1,
      icon: AlertTriangle,
      color: "amber",
    });
  }

  // Normalize score to 0-10
  score = Math.max(0, Math.min(10, score));

  // Determine overall rating
  const rating = score >= 8 ? "hot" : score >= 6 ? "warm" : score >= 4 ? "lukewarm" : "cold";
  const ratingConfig = {
    hot: {
      label: "🔥 Lead excelent",
      color: "from-rose-500 to-orange-500",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300",
    },
    warm: {
      label: "⭐ Lead bun",
      color: "from-emerald-500 to-teal-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-300",
    },
    lukewarm: {
      label: "💡 Lead moderat",
      color: "from-amber-500 to-yellow-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-300",
    },
    cold: {
      label: "❄️ Lead slab",
      color: "from-gray-400 to-gray-500",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-300",
    },
  }[rating];

  return (
    <div className={`rounded-xl border-2 ${ratingConfig.borderColor} ${ratingConfig.bgColor} p-4 shadow-sm`}>
      {/* Header with Score */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600">Lead Score</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{score.toFixed(1)}</p>
            <p className="text-sm font-medium text-gray-500">/10</p>
          </div>
        </div>
        <div className={`rounded-full px-4 py-2 ${ratingConfig.bgColor} border ${ratingConfig.borderColor}`}>
          <p className={`text-sm font-bold ${ratingConfig.textColor}`}>
            {ratingConfig.label}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full bg-gradient-to-r ${ratingConfig.color} transition-all duration-500`}
          style={{ width: `${score * 10}%` }}
        />
      </div>

      {/* Factors */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Factori de scor:
        </p>
        <div className="grid gap-2">
          {factors.length === 0 ? (
            <p className="text-sm italic text-gray-400">Nu există factori evaluați</p>
          ) : (
            factors.map((factor, idx) => {
              const Icon = factor.icon;
              const colorClasses = {
                emerald: "text-emerald-600",
                sky: "text-sky-600",
                purple: "text-purple-600",
                amber: "text-amber-600",
                indigo: "text-indigo-600",
                rose: "text-rose-600",
              }[factor.color];

              return (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={colorClasses} />
                    <span className="text-sm text-gray-700">{factor.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${factor.points > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {factor.points > 0 ? "+" : ""}{factor.points}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recommendations */}
      {score < 7 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <AlertTriangle size={14} />
            Sugestii pentru îmbunătățire:
          </p>
          <ul className="space-y-1 text-xs text-amber-700">
            {!request.budgetEstimate && <li>• Solicită buget estimat</li>}
            {!request.mediaUrls?.length && <li>• Încurajează upload-ul de poze</li>}
            {(!request.details || request.details.length < 100) && <li>• Cere mai multe detalii</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
