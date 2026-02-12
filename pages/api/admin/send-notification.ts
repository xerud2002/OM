import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";
import { FieldValue } from "firebase-admin/firestore";

async function requireAdmin(uid: string) {
  const snap = await adminDb.collection("admins").doc(uid).get();
  return snap.exists;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  const uid = authResult.uid;
  if (!(await requireAdmin(uid))) return res.status(403).json(apiError("Unauthorized"));

  if (req.method === "POST") {
    const { target, targetId, title, message } = req.body;
    if (!title || !message) return res.status(400).json(apiError("title and message required"));

    const notification = {
      title,
      message,
      type: "admin",
      read: false,
      createdAt: FieldValue.serverTimestamp(),
      sentBy: uid,
    };

    if (target === "all-companies") {
      const snap = await adminDb.collection("companies").get();
      const batch = adminDb.batch();
      snap.docs.forEach((d) => {
        const ref = adminDb.collection("notifications").doc();
        batch.set(ref, { ...notification, recipientId: d.id, recipientType: "company" });
      });
      await batch.commit();
      return res.status(200).json(apiSuccess({ sent: snap.size }));
    }

    if (target === "all-customers") {
      const snap = await adminDb.collection("customers").get();
      const batch = adminDb.batch();
      snap.docs.forEach((d) => {
        const ref = adminDb.collection("notifications").doc();
        batch.set(ref, { ...notification, recipientId: d.id, recipientType: "customer" });
      });
      await batch.commit();
      return res.status(200).json(apiSuccess({ sent: snap.size }));
    }

    if (target === "single" && targetId) {
      await adminDb.collection("notifications").add({
        ...notification,
        recipientId: targetId,
        recipientType: "company",
      });
      return res.status(200).json(apiSuccess({ sent: 1 }));
    }

    return res.status(400).json(apiError("Invalid target"));
  }

  if (req.method === "GET") {
    const snap = await adminDb.collection("notifications")
      .where("type", "==", "admin")
      .orderBy("createdAt", "desc")
      .limit(100)
      .get();
    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(apiSuccess({ notifications }));
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
