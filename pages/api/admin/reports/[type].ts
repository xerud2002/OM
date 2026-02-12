import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json(apiError("Method not allowed"));
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  const { type } = req.query;

  if (type === "companies") {
    const snap = await adminDb.collection("companies").get();
    const data = snap.docs.map((d) => {
      const c = d.data();
      return {
        id: d.id,
        companyName: c.companyName || c.displayName || "",
        email: c.email || "",
        phone: c.phone || "",
        city: c.city || "",
        cif: c.cif || "",
        verificationStatus: c.verificationStatus || "",
        averageRating: c.averageRating || 0,
        totalReviews: c.totalReviews || 0,
        creditBalance: c.creditBalance || c.credits || 0,
      };
    });
    return res.status(200).json(apiSuccess({ report: data, type: "companies" }));
  }

  if (type === "customers") {
    const snap = await adminDb.collection("customers").limit(500).get();
    const data = snap.docs.map((d) => {
      const c = d.data();
      return {
        id: d.id,
        displayName: c.displayName || "",
        email: c.email || "",
        phone: c.phone || "",
        requestCount: c.requestCount || 0,
      };
    });
    return res.status(200).json(apiSuccess({ report: data, type: "customers" }));
  }

  if (type === "requests") {
    const snap = await adminDb.collection("requests").orderBy("createdAt", "desc").limit(500).get();
    const data = snap.docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        from: r.from || r.fromCity || "",
        to: r.to || r.toCity || "",
        serviceType: r.serviceType || "",
        status: r.status || "",
        offerCount: r.offerCount || 0,
        createdAt: r.createdAt?._seconds ? new Date(r.createdAt._seconds * 1000).toISOString() : "",
      };
    });
    return res.status(200).json(apiSuccess({ report: data, type: "requests" }));
  }

  if (type === "offers") {
    const snap = await adminDb.collectionGroup("offers").limit(500).get();
    const sortedDocs = snap.docs.sort((a, b) => (b.data().createdAt?._seconds || 0) - (a.data().createdAt?._seconds || 0));
    const data = sortedDocs.map((d) => {
      const o = d.data();
      return {
        id: d.id,
        companyId: o.companyId || "",
        requestId: o.requestId || "",
        price: o.price || 0,
        status: o.status || "",
        accepted: o.accepted || false,
        createdAt: o.createdAt?._seconds ? new Date(o.createdAt._seconds * 1000).toISOString() : "",
      };
    });
    return res.status(200).json(apiSuccess({ report: data, type: "offers" }));
  }

  if (type === "reviews") {
    const snap = await adminDb.collection("reviews").orderBy("createdAt", "desc").limit(500).get();
    const data = snap.docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        companyId: r.companyId || "",
        customerName: r.customerName || "",
        rating: r.rating || 0,
        comment: r.comment || "",
        status: r.status || "",
        isWelcomeReview: r.isWelcomeReview || false,
      };
    });
    return res.status(200).json(apiSuccess({ report: data, type: "reviews" }));
  }

  return res.status(400).json(apiError("Invalid report type. Use: companies, customers, requests, offers, reviews"));
}

export default withErrorHandler(handler);
