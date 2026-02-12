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

  const { companyId, type, limit: limitParam } = req.query;
  const docLimit = Math.min(Number(limitParam) || 500, 1000);

  // Get all credit transactions
  let q = adminDb.collection("creditTransactions").orderBy("createdAt", "desc").limit(docLimit);

  const txSnap = await q.get();
  let transactions = txSnap.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000) : data.createdAt?.toDate ? data.createdAt.toDate() : null;
    return {
      id: d.id,
      companyId: data.companyId || "",
      companyName: data.companyName || "",
      type: data.type || "unknown",
      amount: data.amount || data.credits || 0,
      description: data.description || data.reason || "",
      createdAt: ts ? ts.toISOString() : null,
    };
  });

  // Client-side filters
  if (companyId && typeof companyId === "string") {
    transactions = transactions.filter((t) => t.companyId === companyId);
  }
  if (type && typeof type === "string") {
    transactions = transactions.filter((t) => t.type === type);
  }

  // Summary stats
  const purchased = transactions.filter((t) => t.type === "purchase" || t.type === "buy");
  const used = transactions.filter((t) => t.type === "usage" || t.type === "use" || t.type === "spend" || t.type === "contact");
  const refunded = transactions.filter((t) => t.type === "refund");
  const adjusted = transactions.filter((t) => t.type === "adjustment" || t.type === "admin_adjust");

  const summary = {
    totalPurchased: purchased.reduce((s, t) => s + Math.abs(t.amount), 0),
    totalUsed: used.reduce((s, t) => s + Math.abs(t.amount), 0),
    totalRefunded: refunded.reduce((s, t) => s + Math.abs(t.amount), 0),
    totalAdjusted: adjusted.reduce((s, t) => s + t.amount, 0),
    transactionCount: transactions.length,
  };

  return res.status(200).json(apiSuccess({ transactions, summary }));
}

export default withErrorHandler(handler);
