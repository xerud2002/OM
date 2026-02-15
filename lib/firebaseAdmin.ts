import admin from "firebase-admin";
import { logger } from "@/utils/logger";
// import "dotenv/config"; // Load .env file (handled by Next.js automatically)

// Use global to persist state across hot-reloads in development
declare global {
  var _firebaseAdminHasCredentials: boolean | undefined;
}

// Initialize Firebase Admin SDK once per runtime
if (!admin.apps.length) {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
  // Private key might contain escaped newlines - handle multiple formats
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  // Replace literal \n with actual newlines, and handle JSON-escaped format
  let privateKey = privateKeyRaw.replace(/\\n/g, "\n").replace(/\\\\n/g, "\n");

  // If wrapped in quotes, remove them
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1).replace(/\\n/g, "\n");
  }

  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${projectId}.appspot.com`;

  const looksPlaceholderEmail = clientEmail
    .toLowerCase()
    .includes("placeholder");
  const missingEssentials = !projectId || !clientEmail || !privateKey;
  const hasValidKeyFormat =
    privateKey.includes("-----BEGIN") &&
    privateKey.includes("PRIVATE KEY-----");

  logger.log("[firebaseAdmin] Initialization check:");
  logger.log("  - projectId:", projectId ? "set" : "MISSING");
  logger.log("  - clientEmail:", clientEmail ? "set" : "MISSING");
  logger.log(
    "  - privateKey:",
    privateKey.length > 0 ? `${privateKey.length} chars` : "MISSING",
  );
  logger.log("  - hasValidKeyFormat:", hasValidKeyFormat);

  try {
    if (!missingEssentials && !looksPlaceholderEmail && hasValidKeyFormat) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId as string,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
      globalThis._firebaseAdminHasCredentials = true;
    } else {
      const reason = missingEssentials
        ? "missing credentials"
        : looksPlaceholderEmail
          ? "placeholder email"
          : !hasValidKeyFormat
            ? "invalid private key format"
            : "unknown";
      logger.warn(
        `Firebase Admin not configured (${reason}). Guest requests will fall back to client-side.`,
      );
      // Initialize with minimal config for development
      admin.initializeApp({
        projectId: projectId || "demo-project",
      });
      globalThis._firebaseAdminHasCredentials = false;
    }
  } catch (e) {
    logger.warn(
      "Firebase Admin initialization failed; falling back to minimal config.",
      e,
    );
    admin.initializeApp({
      projectId: projectId || "demo-project",
    });
    globalThis._firebaseAdminHasCredentials = false;
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminReady = globalThis._firebaseAdminHasCredentials ?? false;

/** Fetch aggregate review stats for SEO schema. Safe to call at build time. */
export async function getReviewStats(): Promise<{ ratingValue: number; reviewCount: number }> {
  if (!adminReady) return { ratingValue: 0, reviewCount: 0 };
  try {
    const snap = await adminDb.collection("reviews").where("status", "==", "published").get();
    if (snap.empty) return { ratingValue: 0, reviewCount: 0 };

    let total = 0;
    let count = 0;
    snap.docs.forEach((doc) => {
      const rating = Number(doc.data().rating);
      if (rating >= 1 && rating <= 5) { total += rating; count++; }
    });

    return {
      ratingValue: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
      reviewCount: count,
    };
  } catch {
    return { ratingValue: 0, reviewCount: 0 };
  }
}

export default admin;
