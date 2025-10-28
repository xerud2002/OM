// utils/firestoreHelpers.ts
import { db } from "@/services/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";

// 🔹 Create or update a customer profile
export async function createOrUpdateCustomer(user: User) {
  const ref = doc(db, "customers", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || "",
      email: user.email,
      createdAt: serverTimestamp(),
    });
  }
}

// 🔹 Create or update a company profile
export async function createOrUpdateCompany(user: User, extraData?: Record<string, any>) {
  const ref = doc(db, "companies", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      name: user.displayName || "",
      email: user.email,
      createdAt: serverTimestamp(),
      ...extraData,
    });
  } else if (extraData) {
    await updateDoc(ref, extraData);
  }
}

// 🔹 Get all moving requests
export async function getRequests() {
  const colRef = collection(db, "requests");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// 🔹 Get requests for a specific company
export async function getCompanyLeads(uid: string) {
  const ref = doc(db, "companies", uid);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) return [];

  const data = docSnap.data();
  return data?.purchasedLeads || [];
}
