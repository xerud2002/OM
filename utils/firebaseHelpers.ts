// utils/firebaseHelpers.ts
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
// import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/services/firebase";
import { GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

// ---- Types
export type UserRole = "customer" | "company";

export type BaseProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt: any; // Firestore timestamp
  updatedAt: any;
};

export type CustomerProfile = BaseProfile & {
  phone?: string;
  city?: string;
};

export type CompanyProfile = BaseProfile & {
  companyName?: string;
  cif?: string;
  phone?: string;
  city?: string;
};

const COLLECTIONS = {
  customer: "customers",
  company: "companies",
} as const;

// ---- Auth state
export function onAuthChange(cb: (_user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function logout() {
  await signOut(auth);
}

// ---- Role-aware profile helpers
export async function ensureUserProfile(u: User, role: UserRole) {
  const col = COLLECTIONS[role];
  const profileRef = doc(db, col, u.uid);
  const snap = await getDoc(profileRef);

  if (!snap.exists()) {
    await setDoc(profileRef, {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName ?? u.email?.split("@")[0] ?? "User",
      photoURL: u.photoURL ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role,
    });
  } else {
    // Keep updatedAt fresh
    await updateDoc(profileRef, { updatedAt: serverTimestamp() });
  }
  return profileRef;
}

export async function getUserRole(u: User): Promise<UserRole | null> {
  // Try in customers first, then companies
  const customer = await getDoc(doc(db, COLLECTIONS.customer, u.uid));
  if (customer.exists()) return "customer";
  const company = await getDoc(doc(db, COLLECTIONS.company, u.uid));
  if (company.exists()) return "company";
  return null;
}

// ---- Sign in / Sign up

export async function loginWithGoogle(role: UserRole) {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(cred.user, role);
  return cred.user;
}

export async function registerWithEmail(
  role: UserRole,
  { email, password, displayName }: { email: string; password: string; displayName?: string }
) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(user, { displayName });
  }
  await ensureUserProfile(user, role);
  return user;
}

export async function loginWithEmail({ email, password }: { email: string; password: string }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  // The caller usually knows the role context (customer/company page),
  // but if you need it: await getUserRole(user)
  return user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ---- Storage upload (user-scoped)
export async function uploadUserFile(user: User, file: File | Blob, pathInUserFolder: string) {
  const objectRef = ref(storage, `users/${user.uid}/${pathInUserFolder}`);
  await uploadBytes(objectRef, file);
  return getDownloadURL(objectRef);
}
