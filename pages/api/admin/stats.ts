// pages/api/admin/stats.ts
// Aggregated dashboard statistics endpoint for admin overview
// GET: Returns KPIs, trends, and chart data

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiError, apiSuccess } from "@/types/api";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return res.status(authResult.status).json(apiError(authResult.error));
  }

  const isAdmin = await requireAdmin(authResult.uid);
  if (!isAdmin) {
    return res.status(403).json(apiError("Forbidden"));
  }

  // ── Date boundaries ──
  const now = new Date();
  const thirtyDaysAgo = daysAgo(30);
  const sixtyDaysAgo = daysAgo(60);
  const sevenDaysAgo = daysAgo(7);

  // ── Parallel queries for KPIs ──
  const [
    customersSnap,
    companiesSnap,
    verifiedSnap,
    pendingSnap,
    requestsSnap,
    offersSnap,
    reviewsSnap,
    fraudSnap,
  ] = await Promise.all([
    adminDb.collection("customers").get(),
    adminDb.collection("companies").get(),
    adminDb.collection("companies").where("verificationStatus", "==", "verified").get(),
    adminDb.collection("companies").where("verificationStatus", "==", "pending").get(),
    adminDb.collection("requests").get(),
    adminDb.collectionGroup("offers").get(),
    adminDb.collection("reviews").get(),
    adminDb.collection("fraudFlags").where("status", "==", "pending").get(),
  ]);

  const totalCustomers = customersSnap.size;
  const totalCompanies = companiesSnap.size;
  const verifiedCompanies = verifiedSnap.size;
  const pendingVerifications = pendingSnap.size;
  const totalRequests = requestsSnap.size;
  const totalOffers = offersSnap.size;
  const totalReviews = reviewsSnap.size;
  const pendingFraudFlags = fraudSnap.size;

  // ── Trend computation: last 30d vs previous 30d ──
  let requests30d = 0;
  let requestsPrev30d = 0;
  let offers30d = 0;
  let customers30d = 0;
  let customersPrev30d = 0;

  requestsSnap.forEach((doc) => {
    const created = doc.data().createdAt?.toDate?.();
    if (created) {
      if (created >= thirtyDaysAgo) requests30d++;
      else if (created >= sixtyDaysAgo) requestsPrev30d++;
    }
  });

  offersSnap.forEach((doc) => {
    const created = doc.data().createdAt?.toDate?.();
    if (created && created >= thirtyDaysAgo) offers30d++;
  });

  customersSnap.forEach((doc) => {
    const created = doc.data().createdAt?.toDate?.();
    if (created) {
      if (created >= thirtyDaysAgo) customers30d++;
      else if (created >= sixtyDaysAgo) customersPrev30d++;
    }
  });

  // Percentage change helper
  const pctChange = (cur: number, prev: number) => {
    if (prev === 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - prev) / prev) * 100);
  };

  // ── Chart data: Requests per day (last 30 days) ──
  const requestsByDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    requestsByDay[key] = 0;
  }

  requestsSnap.forEach((doc) => {
    const created = doc.data().createdAt?.toDate?.();
    if (created && created >= thirtyDaysAgo) {
      const key = created.toISOString().slice(0, 10);
      if (requestsByDay[key] !== undefined) {
        requestsByDay[key]++;
      }
    }
  });

  const requestsTimeline = Object.entries(requestsByDay).map(([date, count]) => ({
    date,
    count,
  }));

  // ── Chart data: Service type distribution ──
  const serviceTypes: Record<string, number> = {};
  requestsSnap.forEach((doc) => {
    const type = doc.data().serviceType || doc.data().tipServiciu || "Necunoscut";
    serviceTypes[type] = (serviceTypes[type] || 0) + 1;
  });

  const serviceDistribution = Object.entries(serviceTypes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // ── Chart data: Top routes ──
  const routeMap: Record<string, number> = {};
  requestsSnap.forEach((doc) => {
    const data = doc.data();
    const from = data.orasOrigin || data.cityFrom || "";
    const to = data.orasDestinatie || data.cityTo || "";
    if (from && to) {
      const key = `${from} → ${to}`;
      routeMap[key] = (routeMap[key] || 0) + 1;
    }
  });

  const topRoutes = Object.entries(routeMap)
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // ── Conversion funnel ──
  const requestsWithOffers = new Set<string>();
  const acceptedOffers = new Set<string>();

  offersSnap.forEach((doc) => {
    const data = doc.data();
    requestsWithOffers.add(data.requestId);
    if (data.status === "accepted" || data.accepted === true) {
      acceptedOffers.add(data.requestId);
    }
  });

  const funnel = [
    { stage: "Cereri", count: totalRequests },
    { stage: "Cu oferte", count: requestsWithOffers.size },
    { stage: "Acceptate", count: acceptedOffers.size },
  ];

  // ── Recent activity (last 7 days summary) ──
  let recentRequests = 0;
  let recentOffers = 0;
  let recentReviews = 0;

  requestsSnap.forEach((doc) => {
    const c = doc.data().createdAt?.toDate?.();
    if (c && c >= sevenDaysAgo) recentRequests++;
  });

  offersSnap.forEach((doc) => {
    const c = doc.data().createdAt?.toDate?.();
    if (c && c >= sevenDaysAgo) recentOffers++;
  });

  reviewsSnap.forEach((doc) => {
    const c = doc.data().createdAt?.toDate?.();
    if (c && c >= sevenDaysAgo) recentReviews++;
  });

  // ── Average review rating ──
  let ratingSum = 0;
  let ratingCount = 0;
  reviewsSnap.forEach((doc) => {
    const r = doc.data().rating;
    if (typeof r === "number") {
      ratingSum += r;
      ratingCount++;
    }
  });
  const avgRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;

  // ── Acceptance rate ──
  const acceptanceRate =
    totalOffers > 0
      ? Math.round((acceptedOffers.size / totalOffers) * 100)
      : 0;

  return res.status(200).json(
    apiSuccess({
      kpis: {
        totalCustomers,
        totalCompanies,
        verifiedCompanies,
        pendingVerifications,
        totalRequests,
        totalOffers,
        totalReviews,
        pendingFraudFlags,
        avgRating,
        acceptanceRate,
      },
      trends: {
        requests: pctChange(requests30d, requestsPrev30d),
        customers: pctChange(customers30d, customersPrev30d),
        offers30d,
        requests30d,
      },
      charts: {
        requestsTimeline,
        serviceDistribution,
        topRoutes,
        funnel,
      },
      recent: {
        requests: recentRequests,
        offers: recentOffers,
        reviews: recentReviews,
      },
    })
  );
});
