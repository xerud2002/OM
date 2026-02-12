import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  if (!(await requireAdmin(authResult.uid))) return res.status(403).json(apiError("Unauthorized"));

  // Fetch API logs from systemLogs collection
  const snap = await adminDb
    .collection("systemLogs")
    .where("source", "==", "api")
    .orderBy("timestamp", "desc")
    .limit(5000)
    .get();

  const logs = snap.docs.map((d) => {
    const data = d.data();
    const ts = data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp?._seconds ? new Date(data.timestamp._seconds * 1000) : null;
    return {
      endpoint: data.endpoint || data.path || "",
      method: data.method || "GET",
      statusCode: data.statusCode || data.status || 200,
      responseTime: data.responseTime || data.duration || 0,
      ip: data.ip || "",
      userId: data.userId || "",
      rateLimited: !!data.rateLimited,
      timestamp: ts ? ts.toISOString() : null,
    };
  });

  // Rate limit violations from rateLimitLogs
  let rateLimitViolations: any[] = [];
  try {
    const rlSnap = await adminDb
      .collection("rateLimitLogs")
      .orderBy("timestamp", "desc")
      .limit(500)
      .get();
    rateLimitViolations = rlSnap.docs.map((d) => {
      const data = d.data();
      const ts = data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp?._seconds ? new Date(data.timestamp._seconds * 1000) : null;
      return {
        ip: data.ip || "",
        endpoint: data.endpoint || "",
        count: data.count || 1,
        timestamp: ts ? ts.toISOString() : null,
      };
    });
  } catch {
    // Collection may not exist yet
  }

  // Aggregate usage per endpoint
  const endpointMap = new Map<string, { count: number; errors: number; totalTime: number; times: number[] }>();
  for (const log of logs) {
    if (!log.endpoint) continue;
    const existing = endpointMap.get(log.endpoint) || { count: 0, errors: 0, totalTime: 0, times: [] };
    existing.count++;
    if (log.statusCode >= 400) existing.errors++;
    if (log.responseTime) {
      existing.totalTime += log.responseTime;
      existing.times.push(log.responseTime);
    }
    endpointMap.set(log.endpoint, existing);
  }

  const endpointStats = Array.from(endpointMap.entries())
    .map(([endpoint, data]) => {
      const sorted = data.times.sort((a, b) => a - b);
      const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
      const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
      const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;
      return {
        endpoint,
        requests: data.count,
        errors: data.errors,
        errorRate: data.count > 0 ? parseFloat(((data.errors / data.count) * 100).toFixed(1)) : 0,
        avgTime: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
        p50,
        p95,
        p99,
      };
    })
    .sort((a, b) => b.requests - a.requests);

  // Top consumers by IP
  const ipMap = new Map<string, number>();
  for (const log of logs) {
    if (!log.ip) continue;
    ipMap.set(log.ip, (ipMap.get(log.ip) || 0) + 1);
  }
  const topConsumers = Array.from(ipMap.entries())
    .map(([ip, count]) => ({ ip, requests: count }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 20);

  // Hourly usage heatmap (last 24h)
  const now = new Date();
  const hourlyUsage: { hour: string; count: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(now.getTime() - i * 3600000);
    const hourEnd = new Date(hourStart.getTime() + 3600000);
    const hourLabel = hourStart.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
    const count = logs.filter((l) => {
      if (!l.timestamp) return false;
      const d = new Date(l.timestamp);
      return d >= hourStart && d < hourEnd;
    }).length;
    hourlyUsage.push({ hour: hourLabel, count });
  }

  // Error breakdown
  const errorCodes = new Map<number, number>();
  for (const log of logs) {
    if (log.statusCode >= 400) {
      errorCodes.set(log.statusCode, (errorCodes.get(log.statusCode) || 0) + 1);
    }
  }
  const errorBreakdown = Array.from(errorCodes.entries())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);

  // Summary
  const totalRequests = logs.length;
  const totalErrors = logs.filter((l) => l.statusCode >= 400).length;
  const avgResponseTime = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + l.responseTime, 0) / logs.length)
    : 0;

  return res.status(200).json(apiSuccess({
    summary: {
      totalRequests,
      totalErrors,
      errorRate: totalRequests > 0 ? parseFloat(((totalErrors / totalRequests) * 100).toFixed(1)) : 0,
      avgResponseTime,
      rateLimitViolations: rateLimitViolations.length,
    },
    endpointStats,
    topConsumers,
    hourlyUsage,
    errorBreakdown,
    rateLimitViolations: rateLimitViolations.slice(0, 30),
    recentLogs: logs.slice(0, 50),
  }));
}

export default withErrorHandler(handler);
