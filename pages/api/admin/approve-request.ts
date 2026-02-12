// pages/api/admin/approve-request.ts
// Admin endpoint to approve a request and set its credit cost
// PATCH: { requestId, creditCost, approved? }

import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth, withErrorHandler, requireAdmin } from "@/lib/apiAuth";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { apiError, apiSuccess } from "@/types/api";
import { logger } from "@/utils/logger";
import { sendEmail, emailTemplates } from "@/services/email";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  const authResult = await verifyAuth(req);
  if (!authResult.success) {
    return res.status(authResult.status).json(apiError(authResult.error));
  }

  const isAdmin = await requireAdmin(authResult.uid);
  if (!isAdmin) {
    return res.status(403).json(apiError("Forbidden"));
  }

  const { requestId, creditCost, approved } = req.body;

  if (!requestId || typeof requestId !== "string") {
    return res.status(400).json(apiError("Missing requestId"));
  }

  const requestRef = adminDb.collection("requests").doc(requestId);
  const requestSnap = await requestRef.get();

  if (!requestSnap.exists) {
    return res.status(404).json(apiError("Request not found"));
  }

  const updates: Record<string, any> = {};

  // Set credit cost if provided
  if (creditCost !== undefined) {
    const cost = Number(creditCost);
    if (isNaN(cost) || cost < 0) {
      return res.status(400).json(apiError("creditCost must be a non-negative number"));
    }
    updates.adminCreditCost = cost;
  }

  // Set approval status
  if (approved !== undefined) {
    updates.adminApproved = Boolean(approved);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json(apiError("Nothing to update. Provide creditCost and/or approved."));
  }

  updates.updatedAt = FieldValue.serverTimestamp();
  updates.approvedBy = authResult.uid;
  updates.approvedAt = FieldValue.serverTimestamp();

  await requestRef.update(updates);

  logger.log(
    `[Admin] Request ${requestId} updated: creditCost=${updates.adminCreditCost ?? "unchanged"}, approved=${updates.adminApproved ?? "unchanged"} by ${authResult.uid}`,
  );

  // When approving, send notifications + emails to relevant companies
  if (updates.adminApproved === true) {
    const requestData = requestSnap.data() as Record<string, any>;
    const requestCode = requestData.requestCode || requestId;
    const fromCity = requestData.fromCity || "";
    const toCity = requestData.toCity || "";
    const fromCounty = requestData.fromCounty || "";
    const toCounty = requestData.toCounty || "";
    const moveDate = requestData.moveDate || "Nedefinită";
    const furniture = requestData.furniture || "Nedefinit";

    setImmediate(async () => {
      try {
        // Get all companies and filter by service zone
        const companiesSnapshot = await adminDb.collection("companies").get();
        const requestCounty = fromCounty.toLowerCase().trim();
        const requestCity = fromCity.toLowerCase().trim();

        const relevantCompanies = companiesSnapshot.docs.filter((companyDoc) => {
          const companyData = companyDoc.data();
          const serviceCounties: string[] = companyData.serviceCounties || [];
          const serviceAreas: string[] = companyData.serviceAreas || [];
          if (serviceCounties.length === 0 && serviceAreas.length === 0) return true;
          const matchesCounty = serviceCounties.some(
            (c: string) => c.toLowerCase().trim() === requestCounty,
          );
          const matchesCity = serviceAreas.some(
            (a: string) => a.toLowerCase().trim() === requestCity,
          );
          return matchesCounty || matchesCity;
        });

        // Create in-app notifications
        const batch = adminDb.batch();
        relevantCompanies.forEach((companyDoc) => {
          const notificationRef = adminDb
            .collection("companies")
            .doc(companyDoc.id)
            .collection("notifications")
            .doc();
          batch.set(notificationRef, {
            type: "new_request",
            requestId,
            requestCode,
            fromCity,
            toCity,
            read: false,
            createdAt: FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();

        // Send emails to companies
        const emailPromises = relevantCompanies.map(async (companyDoc) => {
          const companyData = companyDoc.data();
          if (!companyData.email) return;
          // Respect company notification preferences
          if (companyData.newRequestNotifications === false) return;

          await sendEmail({
            to: companyData.email,
            subject: `🚚 Cerere nouă de mutare disponibilă - ${requestCode}`,
            html: emailTemplates.newRequestNotification(
              requestCode,
              `${fromCity}, ${fromCounty}`,
              `${toCity}, ${toCounty}`,
              moveDate,
              furniture,
            ),
          });
        });

        await Promise.allSettled(emailPromises);
        logger.log(
          `[Admin] Sent ${relevantCompanies.length} company notifications for approved request ${requestCode}`,
        );
      } catch (notifError) {
        logger.error("Error sending approval notifications:", notifError);
      }
    });
  }

  return res.status(200).json(apiSuccess({
    requestId,
    ...updates,
    updatedAt: undefined, // Don't send server timestamp
    approvedAt: undefined,
  }));
});
