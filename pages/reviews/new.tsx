import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  StarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { CompanyProfile } from "@/types";
import { logger } from "@/utils/logger";

type RatingCategory = {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
};

const ratingCategories: RatingCategory[] = [
  {
    key: "professionalism",
    label: "Profesionalism",
    icon: ShieldCheckIcon,
    description: "Comportamentul și atitudinea echipei",
  },
  {
    key: "punctuality",
    label: "Punctualitate",
    icon: ClockIcon,
    description: "Respectarea orei și termenelor",
  },
  {
    key: "carefulness",
    label: "Grijă pentru obiecte",
    icon: TruckIcon,
    description: "Cum au fost manipulate lucrurile tale",
  },
  {
    key: "value",
    label: "Raport calitate-preț",
    icon: CurrencyDollarIcon,
    description: "Prețul vs serviciul primit",
  },
];

function StarRatingInput({
  rating,
  onRatingChange,
  size = "lg",
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: "md" | "lg";
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = size === "lg" ? "h-10 w-10" : "h-7 w-7";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            {filled ? (
              <StarIconSolid className={`${sizeClasses} text-amber-400`} />
            ) : (
              <StarIcon
                className={`${sizeClasses} text-gray-300 hover:text-amber-200`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function NewReviewPage() {
  const router = useRouter();
  const { company: companyId, request: requestId } = router.query;

  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  // Form state
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<
    Record<string, number>
  >({});
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Fetch company data
  useEffect(() => {
    if (!companyId) return;

    const fetchCompany = async () => {
      try {
        const companyDoc = await getDoc(
          doc(db, "companies", companyId as string),
        );
        if (companyDoc.exists()) {
          setCompany({
            ...companyDoc.data(),
            uid: companyDoc.id,
          } as CompanyProfile);
        } else {
          setError("Compania nu a fost găsită");
        }

        // Check if already reviewed (if requestId provided)
        if (requestId) {
          const reviewsQuery = query(
            collection(db, "reviews"),
            where("companyId", "==", companyId),
            where("requestId", "==", requestId),
            where("status", "==", "published"),
          );
          const reviewsSnapshot = await getDocs(reviewsQuery);
          if (!reviewsSnapshot.empty) {
            setAlreadyReviewed(true);
          }
        }
      } catch (err) {
        logger.error("Error fetching company:", err);
        setError("Eroare la încărcarea datelor");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, requestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (overallRating === 0) {
      setError("Te rugăm să acorzi un rating general");
      return;
    }
    if (!customerName.trim()) {
      setError("Te rugăm să introduci numele tău");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Te rugăm să scrii o recenzie de minim 10 caractere");
      return;
    }

    setSubmitting(true);

    try {
      // Calculate average from category ratings if any
      const categoryValues = Object.values(categoryRatings).filter(
        (v) => v > 0,
      );
      const avgCategoryRating =
        categoryValues.length > 0
          ? categoryValues.reduce((a, b) => a + b, 0) / categoryValues.length
          : overallRating;

      // Create review via server API (rate-limited, validated server-side)
      const reviewData = {
        companyId: companyId as string,
        requestId: requestId || null,
        customerName: customerName.trim(),
        rating: overallRating,
        categoryRatings:
          Object.keys(categoryRatings).length > 0 ? categoryRatings : null,
        avgCategoryRating,
        comment: comment.trim(),
      };

      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Eroare la trimiterea recenziei");
      }

      setSubmitted(true);
    } catch (err) {
      logger.error("Error submitting review:", err);
      setError("Eroare la trimiterea recenziei. Te rugăm să încerci din nou.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Error state
  if (error && !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    );
  }

  // Already reviewed
  if (alreadyReviewed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircleIcon className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Recenzie deja trimisă
          </h1>
          <p className="text-gray-600 mb-6">
            Ai trimis deja o recenzie pentru această cerere de mutare. Îți
            mulțumim pentru feedback!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <>
        <Head>
          <title>Recenzie trimisă | OferteMutare.ro</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-12 w-12 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Îți mulțumim pentru recenzie!
              </h1>
              <p className="text-gray-600 mb-6">
                Feedback-ul tău ajută alți clienți să ia decizii informate și
                ajută companiile să își îmbunătățească serviciile.
              </p>
              <div className="flex items-center justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`h-8 w-8 ${
                      star <= overallRating ? "text-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <Link
                href="/"
                className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              >
                Înapoi la OferteMutare.ro
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Lasă o recenzie pentru ${company?.companyName || "companie"} | OferteMutare.ro`}</title>
        <meta
          name="description"
          content={`Lasă o recenzie pentru ${company?.companyName}. Părerea ta contează pentru comunitatea OferteMutare.ro`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-emerald-50/30">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-slate-800">Oferte</span>
              <span className="text-emerald-500">mutare</span>
              <span className="text-emerald-500 text-xs align-super">.ro</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-8 text-white text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Cum a fost experiența ta?
              </h1>
              <p className="text-emerald-100">
                Lasă o recenzie pentru{" "}
                <strong className="text-white">{company?.companyName}</strong>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
              {/* Error display */}
              {error && (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Overall Rating */}
              <div className="text-center">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Rating general *
                </label>
                <div className="flex justify-center">
                  <StarRatingInput
                    rating={overallRating}
                    onRatingChange={setOverallRating}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {overallRating === 0 && "Selectează un rating"}
                  {overallRating === 1 && "Foarte nemulțumit"}
                  {overallRating === 2 && "Nemulțumit"}
                  {overallRating === 3 && "Acceptabil"}
                  {overallRating === 4 && "Mulțumit"}
                  {overallRating === 5 && "Foarte mulțumit"}
                </p>
              </div>

              {/* Category Ratings (Optional) */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Evaluează pe categorii{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    (opțional)
                  </span>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ratingCategories.map((cat) => (
                    <div
                      key={cat.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <cat.icon className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {cat.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                      <StarRatingInput
                        rating={categoryRatings[cat.key] || 0}
                        onRatingChange={(rating) =>
                          setCategoryRatings((prev) => ({
                            ...prev,
                            [cat.key]: rating,
                          }))
                        }
                        size="md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-lg font-semibold text-gray-900 mb-2"
                >
                  Numele tău *
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ex: Maria P."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Va apărea public lângă recenzie
                </p>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-lg font-semibold text-gray-900 mb-2"
                >
                  Recenzia ta *
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Descrie experiența ta cu această companie de mutări..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  required
                  minLength={10}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minim 10 caractere • {comment.length}/500
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || overallRating === 0}
                  className="w-full bg-emerald-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Se trimite...
                    </span>
                  ) : (
                    "Trimite Recenzia"
                  )}
                </button>
              </div>

              {/* Info text */}
              <p className="text-center text-sm text-gray-500">
                Recenzia ta va fi publică și va ajuta alți clienți să ia decizii
                informate.
              </p>
            </form>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} OferteMutare.ro - Platforma #1 pentru
            mutări în România
          </p>
        </footer>
      </div>
    </>
  );
}
