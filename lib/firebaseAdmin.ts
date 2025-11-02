import admin from "firebase-admin";

// Initialize Firebase Admin SDK once per runtime, but don't throw if env is missing (allow client-only dev)
let initialized = false;
try {
  if (!admin.apps.length) {
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
    const storageBucket =
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        storageBucket,
      });
      initialized = true;
    } else {
      // Soft warn; APIs should handle missing admin by returning 501 gracefully
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "Firebase Admin not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY for server-side features."
        );
      }
    }
  } else {
    initialized = true;
  }
} catch (e) {
  console.warn("Firebase Admin initialization failed:", e);
  initialized = false;
}

export const adminDb = initialized ? admin.firestore() : (null as unknown as FirebaseFirestore.Firestore);
export const adminAuth = initialized ? admin.auth() : (null as unknown as admin.auth.Auth);

export default admin;
