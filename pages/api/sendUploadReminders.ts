import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";
import { logger } from "@/utils/logger";

/**
 * API pentru verificarea token-urilor nefolosite și trimiterea reminder-elor
 * Rulează periodic (cron job) pentru a verifica token-uri create acum 3+ zile și nefolosite
 *
 * USAGE:
 * - Setează un cron job care apelează: GET /api/sendUploadReminders
 * - Sau rulează manual pentru testare
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Auth: Check API key for production security
  const apiKey = req.headers["x-api-key"];
  if (process.env.NODE_ENV === "production" && process.env.CRON_API_KEY) {
    if (apiKey !== process.env.CRON_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Query via Admin SDK
    const tokensSnap = await adminDb.collection("uploadTokens").where("used", "==", false).get();

    const reminders: Array<{ email: string; name: string; link: string }> = [];
    const now = new Date();
    let sentCount = 0;
    let failedCount = 0;

    for (const tokenDoc of tokensSnap.docs) {
      const tokenData = tokenDoc.data() as any;
      const createdAt = tokenData.createdAt ? new Date(tokenData.createdAt) : null;
      const expiresAt = tokenData.expiresAt ? new Date(tokenData.expiresAt) : null;
      if (!createdAt || !expiresAt) continue;

      if (createdAt <= threeDaysAgo && now <= expiresAt && !tokenData.reminderSent) {
        const reminderInfo = {
          email: tokenData.customerEmail,
          name: tokenData.customerName,
          link: tokenData.uploadLink,
        };
        reminders.push(reminderInfo);

        // Send reminder email via new API
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'uploadReminder',
              data: {
                email: tokenData.customerEmail,
                name: tokenData.customerName,
                requestCode: tokenData.requestId || "cererea ta",
                uploadUrl: tokenData.uploadLink,
              },
            }),
          });

          if (!response.ok) {
            throw new Error('Email API returned error');
          }

          // Mark reminder as sent
          await adminDb.collection("uploadTokens").doc(tokenDoc.id).update({
            reminderSent: true,
            reminderSentAt: new Date().toISOString(),
          });

          sentCount++;
        } catch (emailError) {
          logger.error(`Failed to send reminder to ${tokenData.customerEmail}:`, emailError);
          failedCount++;
        }
      }
    }

    return res.status(200).json({
      ok: true,
      total: reminders.length,
      sent: sentCount,
      failed: failedCount,
      reminders,
    });
  } catch (error) {
    logger.error("Error checking upload reminders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
