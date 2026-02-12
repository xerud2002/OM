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

  // Messages are stored at requests/{rid}/offers/{oid}/messages/
  // Use collectionGroup to query all messages across the hierarchy
  const messagesSnap = await adminDb
    .collectionGroup("messages")
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  // Group messages into conversations by their parent offer path
  const conversationMap = new Map<string, any>();
  for (const doc of messagesSnap.docs) {
    const data = doc.data();
    // Path: requests/{rid}/offers/{oid}/messages/{mid}
    const pathParts = doc.ref.path.split("/");
    const requestId = pathParts[1] || "";
    const offerId = pathParts[3] || "";
    const conversationKey = `${requestId}_${offerId}`;

    if (!conversationMap.has(conversationKey)) {
      conversationMap.set(conversationKey, {
        id: conversationKey,
        requestId,
        offerId,
        companyId: data.companyId || "",
        companyName: data.companyName || "",
        customerId: data.customerId || "",
        customerName: data.customerName || "",
        lastMessage: data.text || data.message || "",
        lastMessageAt: data.createdAt,
        messageCount: 0,
        status: "active",
      });
    }
    conversationMap.get(conversationKey).messageCount++;
  }

  const chats = Array.from(conversationMap.values());

  // Stats
  const total = chats.length;
  const active = chats.filter((c: any) => c.status === "active").length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayChats = chats.filter((c: any) => {
    const ts = c.lastMessageAt?._seconds ? new Date(c.lastMessageAt._seconds * 1000) : null;
    return ts && ts >= today;
  }).length;

  return res.status(200).json(apiSuccess({
    chats,
    stats: { total, active, todayActive: todayChats },
  }));
}

export default withErrorHandler(handler);
