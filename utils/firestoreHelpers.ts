import { db } from "@/services/firebase";
import {
  addDoc,
  doc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  where,
  writeBatch,
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

/** Accept a specific offer and mark others as declined */
export async function acceptOffer(requestId: string, offerId: string) {
  const batch = writeBatch(db);

  const offersRef = collection(db, "requests", requestId, "offers");
  const snapshot = await getDocs(offersRef);

  snapshot.forEach((docSnap) => {
    const offerRef = doc(db, "requests", requestId, "offers", docSnap.id);
    if (docSnap.id === offerId) {
      batch.update(offerRef, { status: "accepted" });
    } else {
      batch.update(offerRef, { status: "declined" });
    }
  });

  await batch.commit();
}
