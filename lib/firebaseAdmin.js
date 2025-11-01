import admin from "firebase-admin";

// Initialize Firebase Admin SDK once per runtime
if (!admin.apps.length) {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private key might contain escaped newlines
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin;
