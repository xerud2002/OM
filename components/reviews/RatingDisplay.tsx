import { Star } from "lucide-react";
import StarRating from "./StarRating";

interface RatingDisplayProps {
  averageRating: number;
  totalReviews: number;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  size?: "sm" | "md" | "lg";
}

export default function RatingDisplay({
  averageRating,
  totalReviews,
  distribution,
  size = "md",
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: {
      text: "text-3xl",
      stars: "sm" as const,
      bars: "h-2",
    },
    md: {
      text: "text-4xl",
      stars: "md" as const,
      bars: "h-3",
    },
    lg: {
      text: "text-5xl",
      stars: "lg" as const,
      bars: "h-4",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-amber-50/30 p-6 shadow-sm">
      {/* Overall Rating */}
      <div className="flex items-center gap-6 border-b border-amber-100 pb-6">
        <div className="text-center">
          <div className={`font-bold text-gray-900 ${classes.text}`}>
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={averageRating} size={classes.stars} />
          <p className="mt-2 text-sm text-gray-600">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Distribution Bars */}
        {distribution && (
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars as keyof typeof distribution];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">{stars}</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>

                  <div className="flex-1">
                    <div className={`overflow-hidden rounded-full bg-gray-200 ${classes.bars}`}>
                      <div
                        className={`bg-gradient-to-r from-amber-400 to-amber-500 ${classes.bars} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <span className="w-12 text-right text-sm text-gray-600">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-emerald-600">
            {distribution ? ((distribution[5] / totalReviews) * 100).toFixed(0) : 0}%
          </div>
          <div className="text-xs text-gray-600">5 Stele</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {distribution
              ? (((distribution[5] + distribution[4]) / totalReviews) * 100).toFixed(0)
              : 0}
            %
          </div>
          <div className="text-xs text-gray-600">4+ Stele</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-amber-600">{averageRating.toFixed(2)}</div>
          <div className="text-xs text-gray-600">Rating Mediu</div>
        </div>
      </div>
    </div>
  );
}
