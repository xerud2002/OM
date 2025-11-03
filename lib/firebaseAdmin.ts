import admin from "firebase-admin";

let adminHasCredentials = false;

// Initialize Firebase Admin SDK once per runtime
if (!admin.apps.length) {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "";
  // Private key might contain escaped newlines
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

  const looksPlaceholderEmail = clientEmail.toLowerCase().includes("placeholder");
  const missingEssentials = !projectId || !clientEmail || !privateKey;

  try {
    if (!missingEssentials && !looksPlaceholderEmail) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId as string,
          clientEmail,
          privateKey,
        }),
        storageBucket,
      });
      adminHasCredentials = true;
    } else {
      console.warn(
        "Firebase Admin credentials not configured (development fallback). Some features may not work. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY for full functionality."
      );
      // Initialize with minimal config for development
      admin.initializeApp({
        projectId: projectId || "demo-project",
      });
      adminHasCredentials = false;
    }
  } catch (e) {
    console.warn("Firebase Admin initialization failed; falling back to minimal config.", e);
    admin.initializeApp({
      projectId: projectId || "demo-project",
    });
    adminHasCredentials = false;
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminReady = adminHasCredentials;

export default admin;
