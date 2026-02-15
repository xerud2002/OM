// components/admin/AuditLogger.ts
// Utility to log admin actions to Firestore

import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export type AuditAction =
  | "approve_verification"
  | "reject_verification"
  | "approve_request"
  | "reject_request"
  | "ban_company"
  | "unban_company"
  | "update_settings"
  | "dismiss_fraud_flag"
  | "confirm_fraud_flag"
  | "manual_credit_adjustment"
  | "delete_review"
  | "update_user"
  | "export_data"
  | "other";

export interface AuditEntry {
  id?: string;
  adminUid: string;
  adminEmail: string;
  action: AuditAction;
  targetType: "company" | "customer" | "request" | "offer" | "review" | "setting" | "other";
  targetId: string;
  details?: string;
  metadata?: Record<string, any>;
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

const COLLECTION = "adminAuditLog";

/**
 * Log an admin action to Firestore
 */
export async function logAuditAction(
  entry: Omit<AuditEntry, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    // Use structured logger instead of console.error
    if (typeof window !== "undefined") {
      import("@/utils/logger").then(({ logger }) => logger.error("[AuditLogger] Failed to log action:", err));
    }
    throw err;
  }
}

/**
 * Fetch recent audit log entries
 */
export async function getRecentAuditLogs(
  count = 50,
  filters?: {
    adminUid?: string;
    action?: AuditAction;
    targetType?: string;
    since?: Date;
  }
): Promise<AuditEntry[]> {
  let q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(count)
  );

  if (filters?.adminUid) {
    q = query(q, where("adminUid", "==", filters.adminUid));
  }
  if (filters?.action) {
    q = query(q, where("action", "==", filters.action));
  }
  if (filters?.targetType) {
    q = query(q, where("targetType", "==", filters.targetType));
  }
  if (filters?.since) {
    q = query(q, where("createdAt", ">=", Timestamp.fromDate(filters.since)));
  }

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AuditEntry[];
}
