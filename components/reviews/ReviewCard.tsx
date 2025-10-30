import { User, Calendar } from "lucide-react";
import StarRating from "./StarRating";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  compact?: boolean;
}

export default function ReviewCard({ review, compact = false }: ReviewCardProps) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (compact) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-900">{review.customerName}</p>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700">{review.comment}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
            <div className="mt-1 flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" showNumber />
              <span className="text-sm text-gray-500">•</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="leading-relaxed text-gray-700">{review.comment}</p>
      </div>

      {/* Optional: Helpful votes (pentru viitor) */}
      {review.helpful !== undefined && review.helpful > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <span>👍</span>
          <span>{review.helpful} persoane consideră acest review util</span>
        </div>
      )}
    </div>
  );
}
