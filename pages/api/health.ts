// pages/api/health.ts
// Health check endpoint for PM2/Nginx/monitoring

import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";

const startedAt = Date.now();

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  if (_req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const mem = process.memoryUsage();

  const checks = {
    firebaseAdmin: admin.apps.length > 0,
    resendConfigured: !!process.env.RESEND_API_KEY,
    internalSecret: !!process.env.INTERNAL_API_SECRET,
    cronKey: !!process.env.CRON_API_KEY,
  };

  const healthy = checks.firebaseAdmin && checks.resendConfigured;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
    checks,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
    },
    version: process.env.npm_package_version || "1.0.0",
    node: process.version,
  });
}
