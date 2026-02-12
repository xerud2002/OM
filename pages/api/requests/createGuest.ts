// pages/api/requests/createGuest.ts
// Creates a request for a guest user (no authentication required)
// Links to existing customer account if email matches, or stores email for future linking

import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiSuccess, apiError } from "@/types/api";
import type { CreateGuestRequestInput } from "@/types";
import { FieldValue } from "firebase-admin/firestore";
import { logger } from "@/utils/logger";
import { sendEmail, emailTemplates } from "@/services/email";
import { buildAddressString } from "@/utils/requestHelpers";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { withErrorHandler } from "@/lib/apiAuth";

// Rate limiter: max 5 requests per minute per IP
const isRateLimited = createRateLimiter({ name: "createGuest", max: 5, windowMs: 60_000 });

// Validate phone number - at least 6 digits (mobile or landline)
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 6;
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Generate sequential request code
async function generateRequestCode(): Promise<string> {
  const countersRef = adminDb.doc("meta/counters");

  const nextSeq = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(countersRef);
    let current = 0;
    if (snap.exists) {
      const data = snap.data() || {};
      current = Number(data.requestSeq || 0);
    }
    const next = current > 0 ? current + 1 : 141000;
    tx.set(countersRef, { requestSeq: next }, { merge: true });
    return next;
  });

  return `REQ-${String(nextSeq).padStart(6, "0")}`;
}

export default withErrorHandler(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res
      .status(429)
      .json(apiError("Prea multe cereri. Încercați din nou peste un minut."));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  try {
    const data: CreateGuestRequestInput = req.body;

    // Validate required fields
    const errors: string[] = [];

    if (!data.fromCounty) errors.push("Județ plecare");
    if (!data.fromCity) errors.push("Localitate plecare");
    if (!data.fromRooms) errors.push("Camere plecare");
    if (!data.toCounty) errors.push("Județ destinație");
    if (!data.toCity) errors.push("Localitate destinație");
    if (!data.toRooms) errors.push("Camere destinație");
    if (!data.contactFirstName) errors.push("Prenume");
    if (!data.contactLastName) errors.push("Nume");
    if (!data.phone) errors.push("Telefon");
    if (!data.email) errors.push("Email");
    if (!data.acceptedTerms) errors.push("Acceptă termenii");

    if (data.phone && !isValidPhone(data.phone)) {
      errors.push("Număr de telefon prea scurt");
    }

    if (data.email && !isValidEmail(data.email)) {
      errors.push("Format email invalid");
    }

    // T17: Input length limits to prevent abuse
    if (data.contactFirstName && data.contactFirstName.length > 100) errors.push("Prenumele este prea lung (max 100)");
    if (data.contactLastName && data.contactLastName.length > 100) errors.push("Numele este prea lung (max 100)");
    if (data.email && data.email.length > 254) errors.push("Email-ul este prea lung");
    if (data.details && data.details.length > 5000) errors.push("Detaliile sunt prea lungi (max 5000)");
    if (data.fromStreet && data.fromStreet.length > 200) errors.push("Adresa plecare prea lungă (max 200)");
    if (data.toStreet && data.toStreet.length > 200) errors.push("Adresa destinație prea lungă (max 200)");

    if (errors.length > 0) {
      return res
        .status(400)
        .json(apiError(`Câmpuri lipsă: ${errors.join(", ")}`));
    }

    const email = data.email.toLowerCase().trim();

    // Check if there's an existing customer with this email
    let customerId: string | null = null;
    let customerName = `${data.contactFirstName} ${data.contactLastName}`;

    // Search for existing customer by email
    const customersSnapshot = await adminDb
      .collection("customers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!customersSnapshot.empty) {
      // Found existing customer - link request to them
      const customerDoc = customersSnapshot.docs[0];
      customerId = customerDoc.id;
      const customerData = customerDoc.data();
      customerName = customerData.displayName || customerName;
    }

    // Build the request document
    const excludeFields = [
      "mediaFiles",
      "moveDateMode",
      "moveDateStart",
      "moveDateEnd",
      "moveDateFlexDays",
      "mediaUpload",
      "acceptedTerms",
      "fromCityManual",
      "toCityManual",
    ];

    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== "" && !excludeFields.includes(key)) {
        clean[key] = value;
      }
    }

    // Handle move date fields
    if (data.moveDateMode) {
      clean.moveDateMode = data.moveDateMode;
      if (data.moveDateMode === "exact" && data.moveDateStart) {
        clean.moveDate = data.moveDateStart;
        clean.moveDateStart = data.moveDateStart;
      } else if (
        data.moveDateMode === "range" &&
        data.moveDateStart &&
        data.moveDateEnd
      ) {
        clean.moveDate = data.moveDateStart;
        clean.moveDateStart = data.moveDateStart;
        clean.moveDateEnd = data.moveDateEnd;
      } else if (
        data.moveDateMode === "flexible" &&
        data.moveDateStart &&
        data.moveDateFlexDays
      ) {
        clean.moveDate = data.moveDateStart;
        clean.moveDateStart = data.moveDateStart;
        clean.moveDateFlexDays = data.moveDateFlexDays;
      }
    }

    // Build address strings
    if (clean.fromStreet || clean.fromNumber) {
      clean.fromAddress = buildAddressString(
        clean.fromStreet,
        clean.fromNumber,
        clean.fromType,
        clean.fromBloc,
        clean.fromStaircase,
        clean.fromApartment,
      );
    }

    if (clean.toStreet || clean.toNumber) {
      clean.toAddress = buildAddressString(
        clean.toStreet,
        clean.toNumber,
        clean.toType,
        clean.toBloc,
        clean.toStaircase,
        clean.toApartment,
      );
    }

    // Compute legacy rooms field (prefer destination, then pickup)
    const rooms = clean.toRooms || clean.fromRooms || "";

    // Generate request code
    const requestCode = await generateRequestCode();

    // Create the request document
    const requestData = {
      ...clean,
      rooms, // Store aggregated rooms for backward compatibility
      requestCode,
      customerName,
      customerEmail: email,
      // If we found an existing customer, link to them; otherwise mark as guest
      customerId: customerId || null,
      guestEmail: customerId ? null : email, // Used for future account linking
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    };

    const requestRef = await adminDb.collection("requests").add(requestData);

    // NOTE: Company notifications (in-app + email) are deferred until admin approval
    // See /api/admin/approve-request.ts

    // If user chose "later" for media upload, generate token & send upload link email
    if (data.mediaUpload === "later") {
      try {
        const uploadToken = randomBytes(32).toString("hex");
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ofertemutare.ro";
        const uploadLink = `${appUrl}/upload/${uploadToken}`;

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await adminDb.doc(`uploadTokens/${uploadToken}`).set({
          requestId: requestRef.id,
          customerEmail: email,
          customerName,
          uploadLink,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString(),
          used: false,
          uploadedAt: null,
        });

        await adminDb.doc(`requests/${requestRef.id}`).set(
          { mediaUploadToken: uploadToken },
          { merge: true },
        );

        // Send upload link email (fire-and-forget)
        sendEmail({
          to: email,
          subject: `📸 Încarcă fotografii pentru cererea #${requestCode}`,
          html: emailTemplates.mediaUploadLink(
            data.contactFirstName,
            requestCode,
            uploadLink,
          ),
        }).then((r) => {
          if (r.success) {
            logger.log(`Sent upload link email to ${email} for ${requestCode}`);
          } else {
            logger.error(`Failed to send upload link email to ${email}:`, r.error);
          }
        });
      } catch (uploadErr) {
        logger.error("Error generating upload link:", uploadErr);
        // Don't fail the request if upload link generation fails
      }
    }

    // Send confirmation email to customer (async, don't wait)
    setImmediate(async () => {
      try {
        const confirmResult = await sendEmail({
          to: email,
          subject: `✅ Cererea ta de mutare #${requestCode} a fost înregistrată`,
          html: emailTemplates.guestRequestConfirmation(
            requestCode,
            data.contactFirstName,
            `${clean.fromCity}, ${clean.fromCounty}`,
            `${clean.toCity}, ${clean.toCounty}`,
            clean.moveDate || "Nedefinită",
          ),
        });
        if (confirmResult.success) {
          logger.log(
            `Sent confirmation email to customer ${email} for ${requestCode}`,
          );
        } else {
          logger.error(
            `Failed to send confirmation email to ${email}:`,
            confirmResult.error,
          );
        }
      } catch (emailError) {
        logger.error("Error sending confirmation email:", emailError);
      }
    });

    return res.status(200).json(
      apiSuccess({
        requestId: requestRef.id,
        requestCode,
        linked: !!customerId,
      }),
    );
  } catch (error) {
    logger.error("Error creating guest request:", error);
    return res.status(500).json(apiError("Eroare la crearea cererii"));
  }
});
