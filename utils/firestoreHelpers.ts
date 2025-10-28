import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export async function createRequest(data: any) {
  const docRef = await addDoc(collection(db, "requests"), {
    ...data,
    createdAt: new Date(),
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
