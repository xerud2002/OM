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
    // Return available bulk operations and their status
    return res.status(200).json(apiSuccess({
      operations: [
        {
          id: "approve-requests",
          name: "Aprobare cereri în masă",
          description: "Aprobă cereri în așteptare cu preț uniform de credite",
          collection: "requests",
          filterField: "status",
          filterValue: "pending",
        },
        {
          id: "verify-companies",
          name: "Verificare companii în masă",
          description: "Verifică companiile cu documente complete",
          collection: "companies",
          filterField: "verificationStatus",
          filterValue: "pending",
        },
        {
          id: "adjust-credits",
          name: "Ajustare credite în masă",
          description: "Adaugă sau scade credite pentru companii selectate",
          collection: "companies",
          filterField: null,
          filterValue: null,
        },
        {
          id: "send-notifications",
          name: "Notificare în masă",
          description: "Trimite notificări in-app către segmentul selectat",
          collection: "users",
          filterField: null,
          filterValue: null,
        },
      ],
    }));
  }

  if (req.method === "POST") {
    const { operationType, entityIds, params } = req.body;

    if (!operationType || !Array.isArray(entityIds) || entityIds.length === 0) {
      return res.status(400).json(apiError("operationType and entityIds[] required"));
    }

    if (entityIds.length > 200) {
      return res.status(400).json(apiError("Maximum 200 entities per batch"));
    }

    const results: { id: string; success: boolean; error?: string }[] = [];
    const batch = adminDb.batch();
    let batchCount = 0;

    try {
      switch (operationType) {
        case "approve-requests": {
          const creditCost = params?.creditCost || 1;
          for (const id of entityIds) {
            const ref = adminDb.collection("requests").doc(id);
            batch.update(ref, {
              status: "approved",
              creditCost,
              approvedAt: new Date(),
              approvedBy: authResult.uid,
            });
            batchCount++;
            results.push({ id, success: true });
          }
          break;
        }

        case "verify-companies": {
          for (const id of entityIds) {
            const ref = adminDb.collection("companies").doc(id);
            batch.update(ref, {
              verificationStatus: "verified",
              verifiedAt: new Date(),
              verifiedBy: authResult.uid,
            });
            batchCount++;
            results.push({ id, success: true });
          }
          break;
        }

        case "adjust-credits": {
          const amount = params?.amount || 0;
          const reason = params?.reason || "Ajustare admin bulk";
          if (amount === 0) return res.status(400).json(apiError("amount is required"));

          for (const id of entityIds) {
            const ref = adminDb.collection("companies").doc(id);
            const doc = await ref.get();
            if (!doc.exists) {
              results.push({ id, success: false, error: "Company not found" });
              continue;
            }
            const currentCredits = doc.data()?.credits || 0;
            batch.update(ref, { credits: currentCredits + amount });

            // Log transaction
            const txRef = adminDb.collection("creditTransactions").doc();
            batch.set(txRef, {
              companyId: id,
              companyName: doc.data()?.name || "",
              type: amount > 0 ? "adjustment-add" : "adjustment-sub",
              amount: Math.abs(amount),
              balanceAfter: currentCredits + amount,
              reason,
              adminUid: authResult.uid,
              createdAt: new Date(),
            });
            batchCount += 2;
            results.push({ id, success: true });
          }
          break;
        }

        case "send-notifications": {
          const message = params?.message || "";
          const title = params?.title || "Notificare";
          if (!message) return res.status(400).json(apiError("message is required"));

          for (const id of entityIds) {
            const notifRef = adminDb.collection("notifications").doc();
            batch.set(notifRef, {
              userId: id,
              title,
              message,
              read: false,
              type: "admin-bulk",
              createdAt: new Date(),
            });
            batchCount++;
            results.push({ id, success: true });
          }
          break;
        }

        default:
          return res.status(400).json(apiError(`Unknown operationType: ${operationType}`));
      }

      if (batchCount > 0) await batch.commit();

      // Log the bulk operation
      await adminDb.collection("adminAuditLog").add({
        adminUid: authResult.uid,
        action: `bulk-${operationType}`,
        targetCollection: "bulk",
        targetId: `${entityIds.length} entities`,
        details: { operationType, count: entityIds.length, params },
        timestamp: new Date(),
      });

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      return res.status(200).json(apiSuccess({
        processed: results.length,
        success: successCount,
        failed: failCount,
        results,
      }));
    } catch (err: any) {
      return res.status(500).json(apiError(`Bulk operation failed: ${err.message}`));
    }
  }

  return res.status(405).json(apiError("Method not allowed"));
}

export default withErrorHandler(handler);
