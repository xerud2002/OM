// pages/api/requests/linkToAccount.ts
// Links guest requests to a newly authenticated customer account

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { apiSuccess, apiError } from "@/types/api";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAuth, sendAuthError, withErrorHandler } from "@/lib/apiAuth";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";

const isRateLimited = createRateLimiter({ name: "linkToAccount", max: 5, windowMs: 60_000 });

export default withErrorHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json(apiError("Prea multe cereri. Încearcă din nou în curând."));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return sendAuthError(res, authResult);
  }
  const uid = authResult.uid;

  // Get user email from Firebase Auth
  const { adminAuth } = await import("@/lib/firebaseAdmin");
  const userRecord = await adminAuth.getUser(uid);
  const userEmail = userRecord.email?.toLowerCase();

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
});
