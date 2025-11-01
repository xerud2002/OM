import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/services/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";

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

    // Query tokens created 3+ days ago, not used, and not expired
    const tokensRef = collection(db, "uploadTokens");
    const tokensQuery = query(
      tokensRef,
      where("used", "==", false),
      where("createdAt", "<=", Timestamp.fromDate(threeDaysAgo))
    );
    const tokensSnap = await getDocs(tokensQuery);

    const reminders: Array<{ email: string; name: string; link: string }> = [];
    const now = new Date();

    for (const tokenDoc of tokensSnap.docs) {
      const tokenData = tokenDoc.data();
      const expiresAt = new Date(tokenData.expiresAt);

      // Skip if expired
      if (now > expiresAt) continue;

      // Check if reminder already sent (optional: add reminderSent field to token)
      if (tokenData.reminderSent) continue;

      reminders.push({
        email: tokenData.customerEmail,
        name: tokenData.customerName,
        link: tokenData.uploadLink,
      });
    }

    // Return list of reminders to send (client will send via EmailJS)
    return res.status(200).json({
      ok: true,
      count: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error("Error checking upload reminders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
