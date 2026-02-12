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

  if (req.method === "GET") {
    const snap = await adminDb.collection("articles").orderBy("createdAt", "desc").limit(200).get();
    const articles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(apiSuccess({ articles }));
  }

  if (req.method === "POST") {
    const { title, slug, excerpt, content, status, category, tags } = req.body;
    if (!title || !slug) return res.status(400).json(apiError("title and slug required"));

    const ref = await adminDb.collection("articles").add({
      title,
      slug,
      excerpt: excerpt || "",
      content: content || "",
      status: status || "draft",
      category: category || "",
      tags: tags || [],
      authorUid: uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ id: ref.id }));
  }

  if (req.method === "PATCH") {
    const { articleId, ...updates } = req.body;
    if (!articleId) return res.status(400).json(apiError("articleId required"));

    await adminDb.collection("articles").doc(articleId).update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json(apiSuccess({ updated: true }));
  }

  if (req.method === "DELETE") {
    const { articleId } = req.body;
    if (!articleId) return res.status(400).json(apiError("articleId required"));
    await adminDb.collection("articles").doc(articleId).delete();
    return res.status(200).json(apiSuccess({ deleted: true }));
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
