import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export async function createRequest(data: any) {
  // Remove any undefined fields because Firestore rejects undefined values.
  const clean: Record<string, any> = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

  const docRef = await addDoc(collection(db, "requests"), {
    ...clean,
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
  // Persist requestId on the subdocument so collectionGroup queries can reference it later
  await addDoc(collection(db, "requests", requestId, "offers"), {
    ...data,
    requestId,
    createdAt: serverTimestamp(),
  });
}

export async function getOffers(requestId: string) {
  const q = query(collection(db, "requests", requestId, "offers"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

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

export async function updateRequest(requestId: string, data: any) {
  const { doc, updateDoc, getDocs, collection, addDoc } = await import("firebase/firestore");
  
  // Remove any undefined fields
  const clean: Record<string, any> = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

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
      message: "Clientul a modificat detaliile cererii. Te rugăm să revizuiești cererea actualizată.",
      title: "Cerere actualizată",
      read: false,
      createdAt: serverTimestamp(),
    });
  });

  await Promise.all(notificationPromises);
}
