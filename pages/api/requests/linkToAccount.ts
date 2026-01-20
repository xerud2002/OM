// pages/api/requests/linkToAccount.ts
// Links guest requests to a newly authenticated customer account

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminAuth, adminReady } from "@/lib/firebaseAdmin";
import { apiSuccess, apiError } from "@/types/api";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  // Verify authentication
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);

  if (!match) {
    return res.status(401).json(apiError("Missing Authorization token"));
  }

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    const uid = decoded.uid;
    const userEmail = decoded.email?.toLowerCase();

    if (!userEmail) {
      return res.status(400).json(apiError("No email associated with this account"));
    }

    // Find all guest requests with this email that aren't linked to an account yet
    const guestRequestsSnapshot = await adminDb
      .collection("requests")
      .where("guestEmail", "==", userEmail)
      .get();

    if (guestRequestsSnapshot.empty) {
      return res.status(200).json(apiSuccess({ linked: 0 }));
    }

    // Get customer profile for display name
    const customerDoc = await adminDb.collection("customers").doc(uid).get();
    const customerData = customerDoc.data();
    const customerName = customerData?.displayName || userEmail.split("@")[0];

    // Link all guest requests to this customer
    const batch = adminDb.batch();
    let linkedCount = 0;

    guestRequestsSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        customerId: uid,
        customerName,
        guestEmail: FieldValue.delete(), // Remove guest marker
        updatedAt: FieldValue.serverTimestamp(),
      });
      linkedCount++;
    });

    await batch.commit();

    return res.status(200).json(apiSuccess({ linked: linkedCount }));
  } catch (error) {
    console.error("Error linking requests:", error);
    return res.status(500).json(apiError("Eroare la asocierea cererilor"));
  }
}
