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

  // Get recent chats / conversations
  const chatsSnap = await adminDb.collection("chats").orderBy("lastMessageAt", "desc").limit(100).get();

  const chats = chatsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      participants: data.participants || [],
      companyId: data.companyId || "",
      companyName: data.companyName || "",
      customerId: data.customerId || "",
      customerName: data.customerName || "",
      lastMessage: data.lastMessage || "",
      lastMessageAt: data.lastMessageAt,
      messageCount: data.messageCount || 0,
      requestId: data.requestId || "",
      status: data.status || "active",
    };
  });

  // Stats
  const total = chats.length;
  const active = chats.filter((c) => c.status === "active").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayChats = chats.filter((c) => {
    const ts = c.lastMessageAt?._seconds ? new Date(c.lastMessageAt._seconds * 1000) : null;
    return ts && ts >= today;
  }).length;

  return res.status(200).json(apiSuccess({
    chats,
    stats: { total, active, todayActive: todayChats },
  }));
}

export default withErrorHandler(handler);
