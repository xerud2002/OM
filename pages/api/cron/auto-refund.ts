import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import type {
  QueryDocumentSnapshot,
  DocumentData,
  Transaction,
} from "firebase-admin/firestore";

/**
 * Auto-refund cron job
 *
 * This endpoint processes offers that are 72+ hours old with no customer response.
 * For each qualifying offer:
 * 1. Refunds the credits to the company
 * 2. Marks the offer as "refunded"
 * 3. Creates a transaction record
 *
 * Should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
 * Protected by CRON_SECRET header
 */

const REFUND_WINDOW_HOURS = 72;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify cron secret
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if Firebase Admin is ready
  if (!adminReady) {
    return res.status(500).json({ error: "Firebase Admin not configured" });
  }

  try {
    const db = adminDb;
    const now = Date.now();
    const refundCutoff = new Date(now - REFUND_WINDOW_HOURS * 60 * 60 * 1000);

    // Find all offers that are eligible for refund
    // Conditions:
    // - Status is "pending" (no customer action)
    // - Created more than 72 hours ago
    // - Not already refunded
    // - Has costPaid recorded
    const offersQueryAll = await db
      .collectionGroup("offers")
      .where("status", "==", "pending")
      .where("createdAt", "<", refundCutoff)
      .get();

    // Filter out already-refunded offers in code
    // (Firestore can't query for "field does not exist", so we filter here)
    const allOffers = new Map<string, QueryDocumentSnapshot<DocumentData>>();
    offersQueryAll.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      if (data.refunded !== true) {
        allOffers.set(doc.id, doc);
      }
    });

    const refundResults: {
      offerId: string;
      companyId: string;
      amount: number;
      success: boolean;
    }[] = [];

    // Process each offer
    for (const [offerId, offerDoc] of Array.from(allOffers)) {
      const offer = offerDoc.data();
      const companyId = offer.companyId;
      const costPaid = offer.costPaid || 0;

      // Skip if no cost was paid or no company ID
      if (!costPaid || !companyId) {
        continue;
      }

      // Skip if already refunded
      if (offer.refunded === true) {
        continue;
      }

      try {
        // Use transaction to ensure atomicity
        await db.runTransaction(async (transaction: Transaction) => {
          // Get company doc
          const companyRef = db.collection("companies").doc(companyId);
          const companyDoc = await transaction.get(companyRef);

          if (!companyDoc.exists) {
            throw new Error(`Company ${companyId} not found`);
          }

          const companyData = companyDoc.data()!;
          const currentCredits = companyData.credits || 0;

          // Refund credits
          transaction.update(companyRef, {
            credits: currentCredits + costPaid,
          });

          // Mark offer as refunded
          transaction.update(offerDoc.ref, {
            refunded: true,
            refundedAt: new Date(),
            refundReason: "no_customer_response_72h",
          });

          // Create refund transaction record
          const txRef = db
            .collection("companies")
            .doc(companyId)
            .collection("transactions")
            .doc();
          transaction.set(txRef, {
            type: "refund",
            amount: costPaid,
            requestId: offer.requestId || null,
            description: `Refund automat - client fără răspuns (72h)`,
            offerId: offerId,
            createdAt: new Date(),
          });
        });

        refundResults.push({
          offerId,
          companyId,
          amount: costPaid,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to refund offer ${offerId}:`, error);
        refundResults.push({
          offerId,
          companyId,
          amount: costPaid,
          success: false,
        });
      }
    }

    const successCount = refundResults.filter((r) => r.success).length;
    const totalRefunded = refundResults
      .filter((r) => r.success)
      .reduce((sum, r) => sum + r.amount, 0);

    return res.status(200).json({
      processed: refundResults.length,
      successful: successCount,
      failed: refundResults.length - successCount,
      totalCreditsRefunded: totalRefunded,
      results: refundResults,
    });
  } catch (error) {
    console.error("Auto-refund cron error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
