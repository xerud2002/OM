import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

const CRON_JOBS = [
  { id: "auto-refund", name: "Auto Refund", description: "Refund credite pentru oferte expirate", endpoint: "/api/cron/auto-refund", schedule: "Zilnic la 02:00" },
  { id: "detect-duplicates", name: "Detectie Duplicate", description: "Scanare cereri duplicate și spam", endpoint: "/api/admin/detect-duplicates", schedule: "La fiecare 6 ore" },
  { id: "upload-reminders", name: "Reminder Upload", description: "Reminder pentru upload media", endpoint: "/api/upload/remind", schedule: "Zilnic la 10:00" },
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  if (!(await requireAdmin(authResult.uid))) return res.status(403).json(apiError("Unauthorized"));

  if (req.method === "GET") {
    // Get last run info for each job from systemLogs
    const jobs = await Promise.all(CRON_JOBS.map(async (job) => {
      try {
        const logSnap = await adminDb.collection("systemLogs")
          .where("source", "==", job.id)
          .orderBy("timestamp", "desc")
          .limit(5)
          .get();
        const runs = logSnap.docs.map((d) => {
          const data = d.data();
          const ts = data.timestamp?._seconds ? new Date(data.timestamp._seconds * 1000) : data.timestamp?.toDate ? data.timestamp.toDate() : null;
          return {
            id: d.id,
            level: data.level || "info",
            message: data.message || "",
            timestamp: ts ? ts.toISOString() : null,
            details: data.details || null,
          };
        });
        return { ...job, lastRun: runs[0]?.timestamp || null, lastStatus: runs[0]?.level || "unknown", runs };
      } catch {
        return { ...job, lastRun: null, lastStatus: "unknown", runs: [] };
      }
    }));

    return res.status(200).json(apiSuccess({ jobs }));
  }

  if (req.method === "POST") {
    // Manual trigger
    const { jobId } = req.body;
    const job = CRON_JOBS.find((j) => j.id === jobId);
    if (!job) return res.status(400).json(apiError("Job invalid"));

    try {
      const baseUrl = `${req.headers["x-forwarded-proto"] || "http"}://${req.headers.host}`;
      const triggerRes = await fetch(`${baseUrl}${job.endpoint}`, {
        method: "POST",
        headers: {
          "x-internal-key": process.env.INTERNAL_API_SECRET || "",
          "Content-Type": "application/json",
        },
      });
      const result = await triggerRes.json();

      // Log execution
      await adminDb.collection("systemLogs").add({
        source: job.id,
        level: triggerRes.ok ? "info" : "error",
        message: `Manual trigger by admin ${authResult.uid}`,
        details: result,
        timestamp: new Date(),
      });

      return res.status(200).json(apiSuccess({ triggered: job.id, result }));
    } catch (err: any) {
      return res.status(500).json(apiError(`Eroare la trigger: ${err.message}`));
    }
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
