// pages/api/fraud/track.ts
// Records device fingerprint + IP for every registration/login
// Used to detect multi-account abuse from same device/IP

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { apiError, ErrorCodes } from "@/types/api";
import { withErrorHandler } from "@/lib/apiAuth";
import { logger } from "@/utils/logger";

// ── Types ──────────────────────────────────────────────────────────────
interface TrackBody {
  fingerprint: string;
  event: "register" | "login";
  role: "customer" | "company";
}

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Extract real client IP, handling proxies (Nginx, Cloudflare, etc.)
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string") return realIp.trim();
  return req.socket?.remoteAddress || "unknown";
}

/**
 * Check if this fingerprint or IP already has accounts and flag if suspicious.
 */
async function checkAndFlag(
  uid: string,
  ip: string,
  fingerprint: string,
  role: string,
  email: string | undefined,
): Promise<{ flagged: boolean; reason?: string; linkedAccounts?: string[] }> {
  const fraudCol = adminDb.collection("deviceFingerprints");

  // Find other accounts with same fingerprint
  const fpMatches = await fraudCol
    .where("fingerprint", "==", fingerprint)
    .where("uid", "!=", uid)
    .limit(10)
    .get();

  // Find other accounts with same IP
  const ipMatches = await fraudCol
    .where("ips", "array-contains", ip)
    .where("uid", "!=", uid)
    .limit(10)
    .get();

  // Merge unique UIDs
  const linkedUids = new Set<string>();
  fpMatches.forEach((doc) => linkedUids.add(doc.data().uid));
  ipMatches.forEach((doc) => linkedUids.add(doc.data().uid));

  if (linkedUids.size === 0) {
    return { flagged: false };
  }

  const linkedAccounts = Array.from(linkedUids);
  const reasons: string[] = [];

  if (fpMatches.size > 0) {
    reasons.push(`Same device fingerprint shared with ${fpMatches.size} other account(s)`);
  }
  if (ipMatches.size > 0) {
    reasons.push(`Same IP address shared with ${ipMatches.size} other account(s)`);
  }

  // Create fraud flag
  await adminDb.collection("fraudFlags").add({
    flaggedUid: uid,
    flaggedEmail: email || null,
    flaggedRole: role,
    linkedAccounts,
    fingerprint,
    ip,
    reasons,
    severity: linkedAccounts.length >= 3 ? "high" : linkedAccounts.length >= 2 ? "medium" : "low",
    status: "pending", // pending | reviewed | dismissed | confirmed
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
    createdAt: FieldValue.serverTimestamp(),
  });

  // Also flag the linked accounts (cross-reference)
  for (const linkedUid of linkedAccounts) {
    // Check if there's already a flag for this pair
    const existingFlag = await adminDb
      .collection("fraudFlags")
      .where("flaggedUid", "==", linkedUid)
      .where("linkedAccounts", "array-contains", uid)
      .limit(1)
      .get();

    if (existingFlag.empty) {
      const linkedDoc = await fraudCol.doc(linkedUid).get();
      const linkedData = linkedDoc.data();
      await adminDb.collection("fraudFlags").add({
        flaggedUid: linkedUid,
        flaggedEmail: linkedData?.email || null,
        flaggedRole: linkedData?.role || "unknown",
        linkedAccounts: [uid],
        fingerprint: linkedData?.fingerprint || null,
        ip,
        reasons: [`Linked to new account ${email || uid} via ${fpMatches.size > 0 ? "device fingerprint" : "IP address"}`],
        severity: "low",
        status: "pending",
        reviewedBy: null,
        reviewedAt: null,
        notes: null,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  }

  return {
    flagged: true,
    reason: reasons.join("; "),
    linkedAccounts,
  };
}

// ── Handler ────────────────────────────────────────────────────────────
export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json(apiError("Method not allowed", ErrorCodes.BAD_REQUEST));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured", ErrorCodes.ADMIN_NOT_READY));
  }

  // Verify authentication
  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return res.status(authResult.status).json(apiError(authResult.error, authResult.code));
  }
  const uid = authResult.uid;

  // Parse body
  const { fingerprint, event, role } = req.body as TrackBody;

  if (!fingerprint || typeof fingerprint !== "string" || fingerprint.length < 8) {
    return res.status(400).json(apiError("Invalid fingerprint", ErrorCodes.BAD_REQUEST));
  }
  if (!event || !["register", "login"].includes(event)) {
    return res.status(400).json(apiError("Invalid event type", ErrorCodes.BAD_REQUEST));
  }

  const ip = getClientIP(req);

  // Get user email from Firebase Auth
  let email: string | undefined;
  try {
    const { adminAuth } = await import("@/lib/firebaseAdmin");
    const userRecord = await adminAuth.getUser(uid);
    email = userRecord.email || undefined;
  } catch {
    // Non-critical
  }

  const fraudCol = adminDb.collection("deviceFingerprints");
  const docRef = fraudCol.doc(uid);
  const existing = await docRef.get();

  if (existing.exists) {
    // Update: add new IP if not present, update last seen
    await docRef.update({
      fingerprint, // might change if browser updated
      lastIp: ip,
      ips: FieldValue.arrayUnion(ip),
      lastEvent: event,
      lastSeen: FieldValue.serverTimestamp(),
      eventCount: FieldValue.increment(1),
      email: email || existing.data()?.email || null,
    });
  } else {
    // New record
    await docRef.set({
      uid,
      email: email || null,
      role,
      fingerprint,
      lastIp: ip,
      ips: [ip],
      lastEvent: event,
      firstSeen: FieldValue.serverTimestamp(),
      lastSeen: FieldValue.serverTimestamp(),
      eventCount: 1,
    });
  }

  // Check for fraud only on registration (login would be too noisy)
  let flagResult = { flagged: false } as any;
  if (event === "register") {
    flagResult = await checkAndFlag(uid, ip, fingerprint, role, email);
    if (flagResult.flagged) {
      logger.warn(
        `[FRAUD] Multi-account detected for ${uid} (${email}): ${flagResult.reason}`,
      );
    }
  }

  return res.status(200).json({
    ok: true,
    tracked: true,
    ...(flagResult.flagged ? { flagged: true } : {}),
  });
});
