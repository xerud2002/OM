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

  // Get platform settings for credit price
  const settingsSnap = await adminDb.collection("meta").doc("settings").get();
  const settings = settingsSnap.data() || {};
  const creditPrice = settings.creditPrice || 5;

  // Get all credit transactions
  const txSnap = await adminDb.collection("creditTransactions").orderBy("createdAt", "desc").limit(500).get();
  const transactions = txSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Get all companies with credit balances
  const companiesSnap = await adminDb.collection("companies").get();
  const companies = companiesSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      companyName: data.companyName || data.displayName || d.id,
      creditBalance: data.creditBalance || data.credits || 0,
    };
  });

  // Calculate totals
  const totalCreditsInSystem = companies.reduce((sum, c: any) => sum + c.creditBalance, 0);
  const purchaseTransactions = transactions.filter((t: any) => t.type === "purchase" || t.type === "buy");
  const totalCreditsPurchased = purchaseTransactions.reduce((sum, t: any) => sum + (t.amount || t.credits || 0), 0);
  const totalRevenue = totalCreditsPurchased * creditPrice;

  // Usage transactions
  const usageTransactions = transactions.filter((t: any) => t.type === "usage" || t.type === "use" || t.type === "spend" || t.type === "contact");
  const totalCreditsUsed = usageTransactions.reduce((sum, t: any) => sum + Math.abs(t.amount || t.credits || 0), 0);

  // Monthly revenue (last 6 months)
  const now = new Date();
  const monthlyRevenue: { month: string; revenue: number; credits: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthTx = purchaseTransactions.filter((t: any) => {
      const ts = t.createdAt?._seconds ? new Date(t.createdAt._seconds * 1000) : null;
      return ts && ts >= d && ts <= end;
    });
    const credits = monthTx.reduce((s, t: any) => s + (t.amount || t.credits || 0), 0);
    monthlyRevenue.push({
      month: d.toLocaleDateString("ro-RO", { month: "short", year: "numeric" }),
      revenue: credits * creditPrice,
      credits,
    });
  }

  // Top spending companies
  const topSpenders = [...companies].sort((a: any, b: any) => b.creditBalance - a.creditBalance).slice(0, 10);

  return res.status(200).json(apiSuccess({
    creditPrice,
    totalCreditsInSystem,
    totalCreditsPurchased,
    totalCreditsUsed,
    totalRevenue,
    monthlyRevenue,
    topSpenders,
    recentTransactions: transactions.slice(0, 50),
    companyCount: companies.length,
  }));
}

export default withErrorHandler(handler);
