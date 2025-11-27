import { db } from "@/services/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import type { Review } from "@/types";

/**
 * Adaugă un review pentru o companie
 */
export async function addReview(params: {
  companyId: string;
  customerId: string;
  customerName: string;
  requestId: string;
  rating: number;
  comment: string;
}): Promise<string> {
  const { companyId, customerId, customerName, requestId, rating, comment } = params;

  // Validare rating
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Verifică dacă user-ul mai are deja review pentru acest request
  const existingReview = await hasUserReviewedRequest(customerId, requestId);
  if (existingReview) {
    throw new Error("You have already reviewed this company for this request");
  }

  // Transaction pentru a adăuga review și a actualiza company stats
  const reviewId = await runTransaction(db, async (transaction) => {
    const companyRef = doc(db, "companies", companyId);
    const companySnap = await transaction.get(companyRef);

    if (!companySnap.exists()) {
      throw new Error("Company not found");
    }

    const companyData = companySnap.data();
    const currentTotal = companyData.totalReviews || 0;
    const currentAverage = companyData.averageRating || 0;

    // Calculează noul average
    const newTotal = currentTotal + 1;
    const newAverage = (currentAverage * currentTotal + rating) / newTotal;

    // Adaugă review în subcollection
    const reviewsRef = collection(db, "companies", companyId, "reviews");
    const newReviewRef = doc(reviewsRef);

    transaction.set(newReviewRef, {
      companyId,
      customerId,
      customerName,
      requestId,
      rating,
      comment,
      createdAt: Timestamp.now(),
      helpful: 0,
    });

    // Update company cu noul average și total
    transaction.update(companyRef, {
      averageRating: parseFloat(newAverage.toFixed(2)),
      totalReviews: newTotal,
    });

    return newReviewRef.id;
  });

  return reviewId;
}

/**
 * Obține toate review-urile unei companii
 */
export async function getCompanyReviews(companyId: string): Promise<Review[]> {
  const reviewsRef = collection(db, "companies", companyId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}

/**
 * Verifică dacă un user poate lăsa review pentru un request
 * Condiții: request completed + accepted offer de la companie + no review yet
 */
export async function canUserReview(
  customerId: string,
  requestId: string,
  companyId: string
): Promise<boolean> {
  // Check dacă request-ul există și e completed
  const requestRef = doc(db, "requests", requestId);
  const requestSnap = await getDoc(requestRef);

  if (!requestSnap.exists() || requestSnap.data().status !== "completed") {
    return false;
  }

  // Check dacă există ofertă acceptată de la această companie
  const offersRef = collection(db, "requests", requestId, "offers");
  const q = query(
    offersRef,
    where("companyId", "==", companyId),
    where("status", "==", "accepted")
  );
  const offersSnap = await getDocs(q);

  if (offersSnap.empty) {
    return false;
  }

  // Check dacă user-ul nu are deja review pentru acest request
  const hasReview = await hasUserReviewedRequest(customerId, requestId);

  return !hasReview;
}

/**
 * Verifică dacă user-ul a lăsat deja review pentru un request
 */
export async function hasUserReviewedRequest(
  customerId: string,
  requestId: string
): Promise<boolean> {
  // Query all companies reviews pentru acest customer + request
  // Note: For better performance at scale, consider migrating to a root-level
  // "reviews" collection with compound index on customerId + requestId

  // Pentru simplitate, căutăm în toate companiile (nu e scalabil la 1000+ companii)

  const companiesRef = collection(db, "companies");
  const companiesSnap = await getDocs(companiesRef);

  for (const companyDoc of companiesSnap.docs) {
    const reviewsRef = collection(db, "companies", companyDoc.id, "reviews");
    const q = query(
      reviewsRef,
      where("customerId", "==", customerId),
      where("requestId", "==", requestId)
    );
    const reviewsSnap = await getDocs(q);

    if (!reviewsSnap.empty) {
      return true;
    }
  }

  return false;
}

/**
 * Obține distribuția rating-urilor pentru o companie (pentru grafic)
 */
export async function getRatingDistribution(companyId: string): Promise<{
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}> {
  const reviews = await getCompanyReviews(companyId);

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    distribution[rating]++;
  });

  return distribution;
}

/**
 * Obține review-ul unui customer pentru un request specific
 */
export async function getCustomerReviewForRequest(
  customerId: string,
  requestId: string
): Promise<Review | null> {
  const companiesRef = collection(db, "companies");
  const companiesSnap = await getDocs(companiesRef);

  for (const companyDoc of companiesSnap.docs) {
    const reviewsRef = collection(db, "companies", companyDoc.id, "reviews");
    const q = query(
      reviewsRef,
      where("customerId", "==", customerId),
      where("requestId", "==", requestId)
    );
    const reviewsSnap = await getDocs(q);

    if (!reviewsSnap.empty) {
      const reviewDoc = reviewsSnap.docs[0];
      return {
        id: reviewDoc.id,
        ...reviewDoc.data(),
      } as Review;
    }
  }

  return null;
}
