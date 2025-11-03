import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/lib/firebaseAdmin";

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

  // Optional: Add authentication check here (e.g., API key in headers)
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.CRON_API_KEY && process.env.NODE_ENV === "production") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Query via Admin SDK
    const tokensSnap = await adminDb.collection("uploadTokens").where("used", "==", false).get();

    const reminders: Array<{ email: string; name: string; link: string }> = [];
    const now = new Date();

    for (const tokenDoc of tokensSnap.docs) {
      const tokenData = tokenDoc.data() as any;
      const createdAt = tokenData.createdAt ? new Date(tokenData.createdAt) : null;
      const expiresAt = tokenData.expiresAt ? new Date(tokenData.expiresAt) : null;
      if (!createdAt || !expiresAt) continue;

      if (createdAt <= threeDaysAgo && now <= expiresAt && !tokenData.reminderSent) {
        reminders.push({
          email: tokenData.customerEmail,
          name: tokenData.customerName,
          link: tokenData.uploadLink,
        });
      }
    }

    return res.status(200).json({ ok: true, count: reminders.length, reminders });
  } catch (error) {
    console.error("Error checking upload reminders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
