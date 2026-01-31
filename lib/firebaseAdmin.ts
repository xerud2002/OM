import admin from "firebase-admin";

// Load .env file explicitly (PM2 doesn't load it automatically)
// This runs at module load time, before any Firebase operations
if (typeof window === "undefined") {
  // Server-side only
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config();
  } catch {
    // dotenv not available or already loaded - continue
  }
}

// Use global to persist state across hot-reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _firebaseAdminHasCredentials: boolean | undefined;
}

// Initialize Firebase Admin SDK once per runtime
if (!admin.apps.length) {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
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
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

  const looksPlaceholderEmail = clientEmail.toLowerCase().includes("placeholder");
  const missingEssentials = !projectId || !clientEmail || !privateKey;
  const hasValidKeyFormat =
    privateKey.includes("-----BEGIN") && privateKey.includes("PRIVATE KEY-----");

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
      console.warn(
        `Firebase Admin not configured (${reason}). Guest requests will fall back to client-side.`
      );
      // Initialize with minimal config for development
      admin.initializeApp({
        projectId: projectId || "demo-project",
      });
      globalThis._firebaseAdminHasCredentials = false;
    }
  } catch (e) {
    console.warn("Firebase Admin initialization failed; falling back to minimal config.", e);
    admin.initializeApp({
      projectId: projectId || "demo-project",
    });
    globalThis._firebaseAdminHasCredentials = false;
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminReady = globalThis._firebaseAdminHasCredentials ?? false;

export default admin;
