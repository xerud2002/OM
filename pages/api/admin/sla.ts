import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler, verifyAuth } from "@/lib/apiAuth";
import { apiSuccess, apiError } from "@/types/api";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Admin SDK unavailable"));
  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  const adminDoc = await adminDb.doc(`admins/${uid}`).get();
  if (!adminDoc.exists) return res.status(403).json(apiError("Forbidden"));

  const db = adminDb;
  const now = Date.now();
  const thirtyDaysAgo = Timestamp.fromMillis(now - 30 * 24 * 60 * 60 * 1000);

  // Fetch recent requests
  const reqSnap = await db.collection("requests")
    .where("createdAt", ">=", thirtyDaysAgo)
    .orderBy("createdAt", "desc")
    .limit(500)
    .get();

  const requests = reqSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

  // Fetch recent offers
  const offerSnap = await db.collection("offers")
    .where("createdAt", ">=", thirtyDaysAgo)
    .orderBy("createdAt", "desc")
    .limit(1000)
    .get();

  const offers = offerSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

  // 1. Onboarding funnel — companies
  const compSnap = await db.collection("companies")
    .where("createdAt", ">=", thirtyDaysAgo)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();
  const companies = compSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
  const registered = companies.length;
  const profileComplete = companies.filter((c: any) => c.phone && c.city).length;
  const verified = companies.filter((c: any) => c.verified).length;
  const firstOffer = new Set(offers.map((o: any) => o.companyId));
  const withFirstOffer = companies.filter((c: any) => firstOffer.has(c.id)).length;

  const funnel = [
    { step: "Înregistrare", count: registered },
    { step: "Profil complet", count: profileComplete },
    { step: "Verificat", count: verified },
    { step: "Prima ofertă", count: withFirstOffer },
  ];

  // 2. Average response time (time from request creation to first offer)
  const requestOfferTimes: number[] = [];
  const offersByRequest = new Map<string, number>();
  for (const o of offers) {
    const rid = o.requestId;
    if (!rid) continue;
    const ots = o.createdAt?._seconds ?? o.createdAt?.seconds;
    if (!ots) continue;
    const existing = offersByRequest.get(rid);
    if (!existing || ots < existing) offersByRequest.set(rid, ots);
  }

  for (const r of requests) {
    const rts = r.createdAt?._seconds ?? r.createdAt?.seconds;
    if (!rts) continue;
    const firstTs = offersByRequest.get(r.id);
    if (firstTs) {
      const diff = (firstTs - rts) / 3600; // hours
      if (diff > 0 && diff < 168) requestOfferTimes.push(diff);
    }
  }

  const avgResponseTimeH =
    requestOfferTimes.length > 0
      ? Math.round((requestOfferTimes.reduce((s, v) => s + v, 0) / requestOfferTimes.length) * 10) / 10
      : null;

  // 3. Completion rate — offers accepted / total requests with offers
  const requestsWithOffers = new Set(offers.map((o: any) => o.requestId)).size;
  const acceptedOffers = offers.filter((o: any) => o.status === "accepted").length;
  const completionRate = requestsWithOffers > 0 ? Math.round((acceptedOffers / requestsWithOffers) * 100) : 0;

  // 4. Weekly trends
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeks: { label: string; requests: number; offers: number; accepted: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = now - (i + 1) * weekMs;
    const end = now - i * weekMs;
    const wReqs = requests.filter((r: any) => {
      const ts = (r.createdAt?._seconds ?? r.createdAt?.seconds ?? 0) * 1000;
      return ts >= start && ts < end;
    });
    const wOffers = offers.filter((o: any) => {
      const ts = (o.createdAt?._seconds ?? o.createdAt?.seconds ?? 0) * 1000;
      return ts >= start && ts < end;
    });
    weeks.push({
      label: `Săpt. ${4 - i}`,
      requests: wReqs.length,
      offers: wOffers.length,
      accepted: wOffers.filter((o: any) => o.status === "accepted").length,
    });
  }

  // 5. Top slow requests (no offer after 48h)
  const cutoff48h = now - 48 * 60 * 60 * 1000;
  const slowRequests = requests
    .filter((r: any) => {
      const ts = (r.createdAt?._seconds ?? r.createdAt?.seconds ?? 0) * 1000;
      return ts < cutoff48h && !offersByRequest.has(r.id);
    })
    .slice(0, 10)
    .map((r: any) => ({
      id: r.id,
      route: `${r.from || "?"} → ${r.to || "?"}`,
      createdAt: r.createdAt,
      ageHours: Math.round((now - (r.createdAt?._seconds ?? r.createdAt?.seconds ?? 0) * 1000) / 3600000),
    }));

  return res.status(200).json(apiSuccess({
    funnel,
    avgResponseTimeH,
    completionRate,
    weeks,
    slowRequests,
    totalRequests: requests.length,
    totalOffers: offers.length,
  }));
});
