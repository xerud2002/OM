import { StarIcon as Star } from "@heroicons/react/24/outline";

interface StarRatingProps {
  rating: number; // 0-5, suportă și .5 pentru half stars
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: Function;
}

export default function StarRating({
  rating,
  size = "md",
  showNumber = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => {
        const filled = index < Math.floor(rating);
        const halfFilled = index === Math.floor(rating) && rating % 1 !== 0;

        return (
          <div
            key={index}
            className={`relative ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => handleClick(index)}
          >
            {/* Background star (empty) */}
            <Star className={`${sizeClasses[size]} text-gray-300`} />

            {/* Filled star overlay */}
            {filled && (
              <Star
                className={`absolute inset-0 ${sizeClasses[size]} fill-amber-400 text-amber-400`}
              />
            )}

            {/* Half-filled star overlay */}
            {halfFilled && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className={`${sizeClasses[size]} fill-amber-400 text-amber-400`} />
              </div>
            )}
          </div>
        );
      })}

      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
