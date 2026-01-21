import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  runTransaction,
  getDoc,
} from "firebase/firestore";

// Helper: Build full address string from components
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

// Helper: Build move date fields from data
function buildMoveDateFields(data: any): Record<string, any> {
  const fields: Record<string, any> = {};

  if (data.moveDateMode) {
    fields.moveDateMode = data.moveDateMode;

    if (data.moveDateMode === "exact" && data.moveDateStart) {
      fields.moveDate = data.moveDateStart;
      fields.moveDateStart = data.moveDateStart;
    } else if (data.moveDateMode === "range" && data.moveDateStart && data.moveDateEnd) {
      fields.moveDate = data.moveDateStart; // For backward compatibility
      fields.moveDateStart = data.moveDateStart;
      fields.moveDateEnd = data.moveDateEnd;
    } else if (data.moveDateMode === "flexible" && data.moveDateStart && data.moveDateFlexDays) {
      fields.moveDate = data.moveDateStart;
      fields.moveDateStart = data.moveDateStart;
      fields.moveDateFlexDays = data.moveDateFlexDays;
    }
  }

  return fields;
}

// Generate a human-friendly sequential request code like REQ-141629
async function generateRequestCode(): Promise<string> {
  const countersRef = doc(db, "meta", "counters");
  const nextSeq = await runTransaction(db, async (tx) => {
    const snap = await tx.get(countersRef);
    let current = 0;
    if (snap.exists()) {
      const data: any = snap.data() || {};
      current = Number(data.requestSeq || 0);
    }
    // Start from a pleasant baseline if first time; choose 141000
    const next = current > 0 ? current + 1 : 141000;
    tx.set(countersRef, { requestSeq: next }, { merge: true });
    return next;
  });
  const six = String(nextSeq).padStart(6, "0");
  return `REQ-${six}`;
}

// Helper: Clean and prepare request data
function prepareRequestData(data: any): Record<string, any> {
  // Remove any undefined fields and non-serializable fields (File objects, etc.)
  const excludeFields = [
    "mediaFiles",
    "contactName",
    "contactFirstName",
    "contactLastName",
    "moveDateMode",
    "moveDateStart",
    "moveDateEnd",
    "moveDateFlexDays",
    "mediaUpload",
  ];
  const clean: Record<string, any> = Object.fromEntries(
    Object.entries(data).filter(([key, v]) => v !== undefined && !excludeFields.includes(key))
  );

  // Handle move date logic using helper
  const moveDateFields = buildMoveDateFields(data);
  Object.assign(clean, moveDateFields);

  // Build full address strings using helper
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

  return clean;
}

/**
 * Create a guest request (no authentication required).
 * Requires updated Firestore rules that allow unauthenticated writes with guestEmail.
 */
export async function createGuestRequest(
  data: any
): Promise<{ requestId: string; requestCode: string }> {
  const clean = prepareRequestData(data);

  // Ensure guest request fields
  const guestEmail = (data.email || data.customerEmail || "").toLowerCase().trim();
  if (!guestEmail) {
    throw new Error("Email este obligatoriu");
  }

  // Compute legacy rooms field (prefer destination, then pickup)
  const rooms = data.toRooms || data.fromRooms || clean.rooms || "";

  // Generate friendly code for this request
  const requestCode = await generateRequestCode();

  const docRef = await addDoc(collection(db, "requests"), {
    ...clean,
    rooms, // Store aggregated rooms for backward compatibility
    requestCode,
    guestEmail,
    customerId: null,
    customerName: `${data.contactFirstName || ""} ${data.contactLastName || ""}`.trim(),
    customerEmail: guestEmail,
    status: "active",
    archived: false,
    createdAt: serverTimestamp(),
  });

  return { requestId: docRef.id, requestCode };
}

export async function createRequest(data: any) {
  const clean = prepareRequestData(data);

  // Generate friendly code for this request
  const requestCode = await generateRequestCode();

  const docRef = await addDoc(collection(db, "requests"), {
    ...clean,
    requestCode,
    // Use serverTimestamp for consistent server-side timestamps
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCustomerRequests(customerId: string) {
  const q = query(
    collection(db, "requests"),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getAllRequests() {
  const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
export async function addOffer(requestId: string, data: any) {
  // Persist requestId and requestCode on the subdocument so collectionGroup queries can reference it later
  let requestCode: string | undefined = undefined;
  try {
    const reqRef = doc(db, "requests", requestId);
    const snap = await getDoc(reqRef);
    requestCode = (snap.exists() ? (snap.data() as any).requestCode : undefined) as
      | string
      | undefined;
  } catch {}

  await addDoc(collection(db, "requests", requestId, "offers"), {
    ...data,
    requestId,
    ...(requestCode ? { requestCode } : {}),
    createdAt: serverTimestamp(),
  });
}

export async function getOffers(requestId: string) {
  const q = query(collection(db, "requests", requestId, "offers"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---- Archiving helpers
// moved below: archive/unarchive helpers implemented with dynamic imports for consistency

export async function updateRequestStatus(
  requestId: string,
  status: "active" | "closed" | "paused" | "cancelled"
) {
  const { doc, updateDoc } = await import("firebase/firestore");
  const requestRef = doc(db, "requests", requestId);
  await updateDoc(requestRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRequest(requestId: string) {
  const { doc, deleteDoc, getDocs, collection } = await import("firebase/firestore");

  // Delete all offers in the subcollection first
  const offersSnapshot = await getDocs(collection(db, "requests", requestId, "offers"));
  const deletePromises = offersSnapshot.docs.map((offerDoc) => deleteDoc(offerDoc.ref));
  await Promise.all(deletePromises);

  // Delete the request document
  const requestRef = doc(db, "requests", requestId);
  await deleteDoc(requestRef);
}

export async function archiveRequest(requestId: string) {
  const { doc, updateDoc } = await import("firebase/firestore");
  const requestRef = doc(db, "requests", requestId);
  await updateDoc(requestRef, {
    archived: true,
    updatedAt: serverTimestamp(),
  });
}

export async function unarchiveRequest(requestId: string) {
  const { doc, updateDoc } = await import("firebase/firestore");
  const requestRef = doc(db, "requests", requestId);
  await updateDoc(requestRef, {
    archived: false,
    updatedAt: serverTimestamp(),
  });
}

export async function updateRequest(requestId: string, data: any) {
  const { doc, updateDoc, getDocs, collection, addDoc } = await import("firebase/firestore");

  // Remove any undefined fields and non-serializable fields (File objects, etc.)
  // Note: mediaUrls is allowed (it's an array of strings/URLs)
  const excludeFields = [
    "mediaFiles",
    "contactName",
    "contactFirstName",
    "contactLastName",
    "moveDateMode",
    "moveDateStart",
    "moveDateEnd",
    "moveDateFlexDays",
    "mediaUpload",
  ];
  const clean: Record<string, any> = Object.fromEntries(
    Object.entries(data).filter(([key, v]) => v !== undefined && !excludeFields.includes(key))
  );

  // Handle move date logic using helper
  const moveDateFields = buildMoveDateFields(data);
  Object.assign(clean, moveDateFields);

  // Build full address strings using helper
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

  const requestRef = doc(db, "requests", requestId);
  await updateDoc(requestRef, {
    ...clean,
    updatedAt: serverTimestamp(),
  });

  // Get all companies that have submitted offers for this request
  const offersSnapshot = await getDocs(collection(db, "requests", requestId, "offers"));
  const companyIds = new Set<string>();

  offersSnapshot.docs.forEach((offerDoc) => {
    const offerData = offerDoc.data();
    if (offerData.companyId) {
      companyIds.add(offerData.companyId);
    }
  });

  // Create notifications for each company
  const notificationPromises = Array.from(companyIds).map(async (companyId) => {
    await addDoc(collection(db, "companies", companyId, "notifications"), {
      type: "request_updated",
      requestId,
      message:
        "Clientul a modificat detaliile cererii. Te rugăm să revizuiești cererea actualizată.",
      title: "Cerere actualizată",
      read: false,
      createdAt: serverTimestamp(),
    });
  });

  await Promise.all(notificationPromises);
}
