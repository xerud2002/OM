import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { apiError, apiSuccess } from "@/types/api";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminReady) return res.status(503).json(apiError("Firebase not ready"));

  const authResult = await verifyAuth(req);
  if (!authResult.success) return res.status(authResult.status).json(apiError(authResult.error));
  if (!(await requireAdmin(authResult.uid))) return res.status(403).json(apiError("Unauthorized"));

  if (req.method === "GET") {
    // List all admin roles
    const snap = await adminDb.collection("admins").get();
    const admins = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    return res.status(200).json(apiSuccess({ admins }));
  }

  if (req.method === "POST") {
    // Add new admin
    const { uid, email, role } = req.body;
    if (!uid || !email || !role) return res.status(400).json(apiError("uid, email și role sunt obligatorii"));
    if (!["super-admin", "moderator", "viewer"].includes(role)) {
      return res.status(400).json(apiError("Rol invalid. Valori permise: super-admin, moderator, viewer"));
    }

    await adminDb.collection("admins").doc(uid).set({
      email,
      role,
      grantedBy: authResult.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    return res.status(200).json(apiSuccess({ uid, email, role }));
  }

  if (req.method === "PATCH") {
    // Update role
    const { uid, role } = req.body;
    if (!uid || !role) return res.status(400).json(apiError("uid și role sunt obligatorii"));
    if (!["super-admin", "moderator", "viewer"].includes(role)) {
      return res.status(400).json(apiError("Rol invalid"));
    }

    await adminDb.collection("admins").doc(uid).update({ role, updatedAt: new Date(), updatedBy: authResult.uid });
    return res.status(200).json(apiSuccess({ uid, role }));
  }

  if (req.method === "DELETE") {
    const { uid } = req.body;
    if (!uid) return res.status(400).json(apiError("uid este obligatoriu"));
    if (uid === authResult.uid) return res.status(400).json(apiError("Nu poți șterge propriul cont de admin"));

    await adminDb.collection("admins").doc(uid).delete();
    return res.status(200).json(apiSuccess({ deleted: uid }));
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
