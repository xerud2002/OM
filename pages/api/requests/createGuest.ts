// pages/api/requests/createGuest.ts
// Creates a request for a guest user (no authentication required)
// Links to existing customer account if email matches, or stores email for future linking

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb, adminReady } from "@/lib/firebaseAdmin";
import { apiSuccess, apiError } from "@/types/api";
import { FieldValue } from "firebase-admin/firestore";
import { logger } from "@/utils/logger";

// Validate Romanian phone number format
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "");
  return /^07\d{8}$/.test(cleaned);
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Build full address string from components
function buildAddressString(
  street?: string,
  number?: string,
  type?: "house" | "flat",
  bloc?: string,
  staircase?: string,
  apartment?: string
): string {
  const parts = [street, number];
  if (type === "flat") {
    if (bloc) parts.push(`Bl. ${bloc}`);
    if (staircase) parts.push(`Sc. ${staircase}`);
    if (apartment) parts.push(`Ap. ${apartment}`);
  }
  return parts.filter(Boolean).join(", ");
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json(apiError("Method not allowed"));
  }

  if (!adminReady) {
    return res.status(503).json(apiError("Admin not configured"));
  }

  try {
    const data = req.body;

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
      errors.push("Format telefon invalid (07xxxxxxxx)");
    }

    if (data.email && !isValidEmail(data.email)) {
      errors.push("Format email invalid");
    }

    if (errors.length > 0) {
      return res.status(400).json(apiError(`Câmpuri lipsă: ${errors.join(", ")}`));
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
      } else if (data.moveDateMode === "range" && data.moveDateStart && data.moveDateEnd) {
        clean.moveDate = data.moveDateStart;
        clean.moveDateStart = data.moveDateStart;
        clean.moveDateEnd = data.moveDateEnd;
      } else if (data.moveDateMode === "flexible" && data.moveDateStart && data.moveDateFlexDays) {
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
        clean.fromApartment
      );
    }

    if (clean.toStreet || clean.toNumber) {
      clean.toAddress = buildAddressString(
        clean.toStreet,
        clean.toNumber,
        clean.toType,
        clean.toBloc,
        clean.toStaircase,
        clean.toApartment
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

    // Notify companies about the new request (create notifications)
    // Get all verified companies
    const companiesSnapshot = await adminDb.collection("companies").get();
    const batch = adminDb.batch();

    companiesSnapshot.docs.forEach((companyDoc) => {
      const notificationRef = adminDb
        .collection("companies")
        .doc(companyDoc.id)
        .collection("notifications")
        .doc();

      batch.set(notificationRef, {
        type: "new_request",
        requestId: requestRef.id,
        requestCode,
        fromCity: clean.fromCity,
        toCity: clean.toCity,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Send email notifications to all companies (async, don't wait)
    // Run in background to avoid slowing down request creation
    setImmediate(async () => {
      try {
        const emailPromises = companiesSnapshot.docs.map(async (companyDoc) => {
          const companyData = companyDoc.data();
          if (!companyData.email) return; // Skip if no email

          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'newRequestNotification',
              data: {
                companyEmail: companyData.email,
                requestCode,
                from: `${clean.fromCity}, ${clean.fromCounty}`,
                to: `${clean.toCity}, ${clean.toCounty}`,
                movingDate: clean.movingDate || 'Nedefinită',
                furniture: clean.furniture || 'Nedefinit'
              }
            })
          });
        });

        await Promise.allSettled(emailPromises);
        logger.log(`Sent email notifications to ${companiesSnapshot.docs.length} companies for ${requestCode}`);
      } catch (emailError) {
        logger.error('Error sending email notifications:', emailError);
        // Don't fail the request if emails fail
      }
    });

    return res.status(200).json(
      apiSuccess({
        requestId: requestRef.id,
        requestCode,
        linked: !!customerId,
      })
    );
  } catch (error) {
    logger.error("Error creating guest request:", error);
    return res.status(500).json(apiError("Eroare la crearea cererii"));
  }
}
