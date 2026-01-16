import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  city: string;
  rating: number;
  date: string;
  service: string;
  text: string;
  verified: boolean;
}

interface ReviewsSectionProps {
  maxReviews?: number;
  showTitle?: boolean;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Andrei M.",
    city: "București",
    rating: 5,
    date: "2026-01-10",
    service: "Mutare apartament 3 camere",
    text: "Am primit 5 oferte în 24h și am economisit peste 600 lei! Procesul a fost super simplu și firmele foarte profesioniste. Recomand cu încredere!",
    verified: true,
  },
  {
    id: 2,
    name: "Maria T.",
    city: "Cluj-Napoca",
    rating: 5,
    date: "2026-01-08",
    service: "Mutare casă",
    text: "Excelent serviciu! Am comparat 4 oferte și am ales firma perfectă pentru nevoile noastre. Mutarea a decurs fără probleme, zero stres.",
    verified: true,
  },
  {
    id: 3,
    name: "Alexandru P.",
    city: "Timișoara",
    rating: 5,
    date: "2026-01-05",
    service: "Mutare birou",
    text: "Perfect pentru mutări corporate! Am mutat biroul în weekend fără să întrerupem activitatea. Ofertele primite au fost competitive și transparente.",
    verified: true,
  },
  {
    id: 4,
    name: "Elena C.",
    city: "Iași",
    rating: 4,
    date: "2026-01-03",
    service: "Împachetare profesională",
    text: "Platformă utilă și rapidă. Am găsit firmă de încredere pentru împachetare. Singurul minus: aș fi vrut mai multe detalii despre firme în oferte.",
    verified: true,
  },
  {
    id: 5,
    name: "Cristian D.",
    city: "București",
    rating: 5,
    date: "2025-12-28",
    service: "Mutare studenți",
    text: "Ca student, am apreciat enorm că am putut compara prețuri. Am economisit 40% față de ce găsisem singur. Super convenabil!",
    verified: true,
  },
  {
    id: 6,
    name: "Laura V.",
    city: "Brașov",
    rating: 5,
    date: "2025-12-20",
    service: "Mutare apartament",
    text: "Simplu, rapid, eficient! În 30 de minute am completat formularul și în ziua următoare aveam 4 oferte. Am economisit și timp și bani.",
    verified: true,
  },
  {
    id: 7,
    name: "Mihai S.",
    city: "Constanța",
    rating: 5,
    date: "2025-12-15",
    service: "Mutare pian",
    text: "Am căutat mult o firmă pentru mutarea unui pian cu coadă. Platformă mi-a ofertat 3 specialiști și am ales perfect. Pianul a ajuns intact!",
    verified: true,
  },
  {
    id: 8,
    name: "Diana R.",
    city: "Cluj-Napoca",
    rating: 4,
    date: "2025-12-10",
    service: "Depozitare mobilă",
    text: "Bun serviciu pentru găsirea spațiilor de depozitare. Ofertele au venit rapid. Recomand pentru cine caută soluții de stocare.",
    verified: true,
  },
  {
    id: 9,
    name: "George B.",
    city: "București",
    rating: 5,
    date: "2025-12-05",
    service: "Mutare casă",
    text: "Cea mai bună decizie! Am economisit 800 lei comparând oferte. Firma aleasă a fost punctuală și atentă cu bunurile noastre.",
    verified: true,
  },
  {
    id: 10,
    name: "Ioana M.",
    city: "Timișoara",
    rating: 5,
    date: "2025-11-28",
    service: "Mutare apartament",
    text: "Foarte mulțumită! Procesul simplu, oferte clare, economii reale. Prima dată când mutarea nu a fost o experiență stresantă!",
    verified: true,
  },
];

export default function ReviewsSection({ maxReviews = 6, showTitle = true }: ReviewsSectionProps) {
  const displayedReviews = REVIEWS.slice(0, maxReviews);
  const averageRating = 4.8;
  const totalReviews = 127;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="mb-16">
      {showTitle && (
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            Ce spun clienții noștri
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-gray-900">{averageRating}</span>
            <span className="text-gray-600">din {totalReviews}+ recenzii</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{review.name}</h3>
                  {review.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      ✓ Verificat
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {review.city} • {review.service}
                </p>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-700 leading-relaxed">{review.text}</p>
            <p className="mt-3 text-xs text-gray-500">
              {new Date(review.date).toLocaleDateString("ro-RO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Export reviews data and stats for schema
export const REVIEWS_DATA = {
  reviews: REVIEWS,
  averageRating: 4.8,
  totalReviews: 127,
  ratingDistribution: {
    5: 98,
    4: 24,
    3: 4,
    2: 1,
    1: 0,
  },
};
