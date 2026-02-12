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

  // Get all surveys
  const snap = await adminDb.collection("surveys").orderBy("createdAt", "desc").limit(500).get();
  const surveys = snap.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000) : data.createdAt?.toDate ? data.createdAt.toDate() : null;
    return {
      id: d.id,
      requestId: data.requestId || "",
      companyId: data.companyId || "",
      companyName: data.companyName || "",
      userId: data.userId || "",
      userName: data.userName || "",
      npsScore: typeof data.npsScore === "number" ? data.npsScore : null,
      csatScore: typeof data.csatScore === "number" ? data.csatScore : null,
      comment: data.comment || "",
      createdAt: ts ? ts.toISOString() : null,
    };
  });

  // NPS calculation
  const npsScores = surveys.filter((s) => s.npsScore !== null);
  const promoters = npsScores.filter((s) => s.npsScore! >= 9).length;
  const passives = npsScores.filter((s) => s.npsScore! >= 7 && s.npsScore! <= 8).length;
  const detractors = npsScores.filter((s) => s.npsScore! <= 6).length;
  const npsTotal = npsScores.length || 1;
  const npsScore = Math.round(((promoters - detractors) / npsTotal) * 100);

  // CSAT calculation
  const csatScores = surveys.filter((s) => s.csatScore !== null);
  const avgCsat = csatScores.length > 0
    ? (csatScores.reduce((sum, s) => sum + s.csatScore!, 0) / csatScores.length).toFixed(1)
    : "0";

  // Per company CSAT
  const companyMap = new Map<string, { name: string; scores: number[]; count: number }>();
  for (const s of csatScores) {
    if (!s.companyId) continue;
    const existing = companyMap.get(s.companyId);
    if (existing) {
      existing.scores.push(s.csatScore!);
      existing.count++;
    } else {
      companyMap.set(s.companyId, { name: s.companyName, scores: [s.csatScore!], count: 1 });
    }
  }
  const companyCsat = Array.from(companyMap.entries()).map(([id, data]) => ({
    companyId: id,
    companyName: data.name,
    avgCsat: (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1),
    count: data.count,
  })).sort((a, b) => parseFloat(b.avgCsat) - parseFloat(a.avgCsat));

  // Monthly NPS trend (last 6 months)
  const now = new Date();
  const monthlyTrend: { month: string; nps: number; csat: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthSurveys = surveys.filter((s) => {
      if (!s.createdAt) return false;
      const d = new Date(s.createdAt);
      return d >= start && d <= end;
    });
    const mNps = monthSurveys.filter((s) => s.npsScore !== null);
    const mProm = mNps.filter((s) => s.npsScore! >= 9).length;
    const mDet = mNps.filter((s) => s.npsScore! <= 6).length;
    const mTotal = mNps.length || 1;
    const mCsat = monthSurveys.filter((s) => s.csatScore !== null);
    const mAvgCsat = mCsat.length > 0 ? mCsat.reduce((s, x) => s + x.csatScore!, 0) / mCsat.length : 0;

    monthlyTrend.push({
      month: start.toLocaleDateString("ro-RO", { month: "short", year: "numeric" }),
      nps: Math.round(((mProm - mDet) / mTotal) * 100),
      csat: parseFloat(mAvgCsat.toFixed(1)),
      count: monthSurveys.length,
    });
  }

  return res.status(200).json(apiSuccess({
    nps: { score: npsScore, promoters, passives, detractors, total: npsScores.length },
    csat: { average: parseFloat(avgCsat as string), total: csatScores.length },
    companyCsat,
    monthlyTrend,
    surveys: surveys.slice(0, 50),
  }));
}

export default withErrorHandler(handler);
