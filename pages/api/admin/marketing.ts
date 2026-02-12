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

  // Fetch requests for lead source analysis
  const reqSnap = await adminDb.collection("requests").orderBy("createdAt", "desc").limit(2000).get();
  const requests = reqSnap.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000) : null;
    return {
      id: d.id,
      source: (typeof data.leadSource === "object" && data.leadSource?.channel)
        ? data.leadSource.channel
        : (typeof data.leadSource === "string" ? data.leadSource : null)
          || data.source || "direct",
      utmSource: data.utmSource || "",
      utmMedium: data.utmMedium || "",
      utmCampaign: data.utmCampaign || "",
      landingPage: (typeof data.leadSource === "object" && data.leadSource?.landingPage)
        ? data.leadSource.landingPage
        : (data.landingPage || data.referrer || ""),
      status: data.status || "",
      hasOffer: !!data.offersCount || data.status === "offered" || data.status === "accepted",
      isAccepted: data.status === "accepted" || data.status === "completed",
      createdAt: ts ? ts.toISOString() : null,
    };
  });

  // Traffic sources breakdown
  const sourceMap = new Map<string, { count: number; offers: number; accepted: number }>();
  for (const r of requests) {
    const src = r.source || "direct";
    const existing = sourceMap.get(src) || { count: 0, offers: 0, accepted: 0 };
    existing.count++;
    if (r.hasOffer) existing.offers++;
    if (r.isAccepted) existing.accepted++;
    sourceMap.set(src, existing);
  }
  const trafficSources = Array.from(sourceMap.entries())
    .map(([source, data]) => ({
      source,
      visits: data.count,
      offers: data.offers,
      accepted: data.accepted,
      conversionRate: data.count > 0 ? parseFloat(((data.accepted / data.count) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.visits - a.visits);

  // UTM campaigns
  const campaignMap = new Map<string, { count: number; offers: number; accepted: number }>();
  for (const r of requests) {
    if (!r.utmCampaign) continue;
    const key = `${r.utmSource || "?"} / ${r.utmMedium || "?"} / ${r.utmCampaign}`;
    const existing = campaignMap.get(key) || { count: 0, offers: 0, accepted: 0 };
    existing.count++;
    if (r.hasOffer) existing.offers++;
    if (r.isAccepted) existing.accepted++;
    campaignMap.set(key, existing);
  }
  const utmCampaigns = Array.from(campaignMap.entries())
    .map(([campaign, data]) => ({
      campaign,
      leads: data.count,
      offers: data.offers,
      accepted: data.accepted,
      conversionRate: data.count > 0 ? parseFloat(((data.accepted / data.count) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.leads - a.leads);

  // Conversion funnel
  const totalRequests = requests.length;
  const withOffers = requests.filter((r) => r.hasOffer).length;
  const acceptedOffers = requests.filter((r) => r.isAccepted).length;
  const funnel = [
    { stage: "Cereri", count: totalRequests, pct: 100 },
    { stage: "Cu oferte", count: withOffers, pct: totalRequests > 0 ? parseFloat(((withOffers / totalRequests) * 100).toFixed(1)) : 0 },
    { stage: "Acceptate", count: acceptedOffers, pct: totalRequests > 0 ? parseFloat(((acceptedOffers / totalRequests) * 100).toFixed(1)) : 0 },
  ];

  // Top landing pages
  const pageMap = new Map<string, number>();
  for (const r of requests) {
    if (!r.landingPage) continue;
    const page = r.landingPage.replace(/https?:\/\/[^/]+/, "").split("?")[0] || "/";
    pageMap.set(page, (pageMap.get(page) || 0) + 1);
  }
  const topPages = Array.from(pageMap.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Monthly trend
  const now = new Date();
  const monthlyTrend: { month: string; requests: number; offers: number; accepted: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthReqs = requests.filter((r) => {
      if (!r.createdAt) return false;
      const d = new Date(r.createdAt);
      return d >= start && d <= end;
    });
    monthlyTrend.push({
      month: start.toLocaleDateString("ro-RO", { month: "short", year: "numeric" }),
      requests: monthReqs.length,
      offers: monthReqs.filter((r) => r.hasOffer).length,
      accepted: monthReqs.filter((r) => r.isAccepted).length,
    });
  }

  return res.status(200).json(apiSuccess({
    trafficSources,
    utmCampaigns,
    funnel,
    topPages,
    monthlyTrend,
    summary: {
      totalLeads: totalRequests,
      totalWithOffers: withOffers,
      totalAccepted: acceptedOffers,
      overallConversion: totalRequests > 0 ? parseFloat(((acceptedOffers / totalRequests) * 100).toFixed(1)) : 0,
    },
  }));
}

export default withErrorHandler(handler);
