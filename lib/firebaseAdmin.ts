import admin from "firebase-admin";

// Initialize Firebase Admin SDK once per runtime
if (!admin.apps.length) {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // Private key might contain escaped newlines
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`;

  if (!projectId || !clientEmail || !privateKey || privateKey.includes("Placeholder")) {
    console.warn(
      "Firebase Admin credentials not configured. Some features may not work. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY for full functionality."
    );
    // Initialize with minimal config for development
    admin.initializeApp({
      projectId: projectId || "demo-project",
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  }


}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin;
