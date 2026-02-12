import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function requireAdmin(uid: string) {
  const snap = await adminDb.collection("admins").doc(uid).get();
  return snap.exists;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  // Get all requests for geographic analysis
  const reqSnap = await adminDb.collection("requests").limit(1000).get();
  const requests = reqSnap.docs.map((d) => d.data());

  // City frequency
  const cityFrom: Record<string, number> = {};
  const cityTo: Record<string, number> = {};
  const routes: Record<string, number> = {};

  requests.forEach((r: any) => {
    const from = r.from || r.fromCity || "";
    const to = r.to || r.toCity || "";
    if (from) cityFrom[from] = (cityFrom[from] || 0) + 1;
    if (to) cityTo[to] = (cityTo[to] || 0) + 1;
    if (from && to) {
      const route = `${from} → ${to}`;
      routes[route] = (routes[route] || 0) + 1;
    }
  });

  // Top origins
  const topOrigins = Object.entries(cityFrom)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([city, count]) => ({ city, count }));

  // Top destinations
  const topDestinations = Object.entries(cityTo)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([city, count]) => ({ city, count }));

  // Top routes
  const topRoutes = Object.entries(routes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([route, count]) => ({ route, count }));

  // Company coverage by city
  const companiesSnap = await adminDb.collection("companies").get();
  const companyCities: Record<string, number> = {};
  companiesSnap.docs.forEach((d) => {
    const city = d.data().city;
    if (city) companyCities[city] = (companyCities[city] || 0) + 1;
  });

  const companyCoverage = Object.entries(companyCities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([city, companies]) => ({ city, companies }));

  // Coverage gaps: cities with high demand but few companies
  const gaps = topOrigins
    .map((o) => ({
      city: o.city,
      requests: o.count,
      companies: companyCities[o.city] || 0,
      ratio: o.count / (companyCities[o.city] || 1),
    }))
    .filter((g) => g.ratio > 2)
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 10);

  return res.status(200).json(apiSuccess({
    totalRequests: requests.length,
    uniqueOrigins: Object.keys(cityFrom).length,
    uniqueDestinations: Object.keys(cityTo).length,
    uniqueRoutes: Object.keys(routes).length,
    topOrigins,
    topDestinations,
    topRoutes,
    companyCoverage,
    coverageGaps: gaps,
  }));
}

export default withErrorHandler(handler);
