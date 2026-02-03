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
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/services/firebase";
import type { UserRole, CustomerProfile, CompanyProfile } from "@/types";
import {
  setUserId,
  setUserProperties,
  clearUserId,
  trackSignUp,
  trackLogin,
} from "@/utils/analytics";
import { logger } from "@/utils/logger";

// Re-export types for backward compatibility
export type { UserRole, CustomerProfile, CompanyProfile };
export type BaseProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt: any; // Firestore timestamp
  updatedAt: any;
};

const COLLECTIONS = {
  customer: "customers",
  company: "companies",
  admin: "admins",
} as const;

// ---- Auth state
// The parameter name inside the function type is only used for clarity in the type
// and can be incorrectly flagged by ESLint's no-unused-vars. Disable that rule
// for this single line to keep the type annotation while avoiding a warning.
// eslint-disable-next-line no-unused-vars
export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Set user ID in GA4 for returning users
      setUserId(user.uid);
      const role = await getUserRole(user);
      if (role) {
        setUserProperties({ user_role: role });
      }
    }
    cb(user);
  });
}

// Track if logout is in progress to avoid showing error messages
let isLoggingOut = false;

export async function logout() {
  isLoggingOut = true;
  clearUserId(); // Clear GA4 user tracking
  await signOut(auth);
  // Reset after a longer delay to ensure all auth state changes propagate
  setTimeout(() => {
    isLoggingOut = false;
  }, 2000);
}

export function isLogoutInProgress() {
  return isLoggingOut;
}

// ---- Role-aware profile helpers
export async function ensureUserProfile(u: User, role: UserRole) {
  const col = COLLECTIONS[role];
  const profileRef = doc(db, col, u.uid);
  const snap = await getDoc(profileRef);

  // Prevent creating a second role for the same user: if the opposite role doc exists,
  // do not create the requested profile and surface a clear error so callers can redirect.
  const otherRole: UserRole = role === "customer" ? "company" : "customer";
  const otherRef = doc(db, COLLECTIONS[otherRole], u.uid);
  const otherSnap = await getDoc(otherRef);

  if (otherSnap.exists() && !snap.exists()) {
    const err: any = new Error(`Account already registered as ${otherRole}`);
    err.code = "ROLE_CONFLICT";
    throw err;
  }

  if (!snap.exists()) {
    await setDoc(profileRef, {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName ?? u.email?.split("@")[0] ?? "User",
      photoURL: u.photoURL ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role,
      // Initialize with 200 credits for companies
      ...(role === "company" ? { 
        credits: 200,
        verificationStatus: 'pending' // pending | verified | rejected
      } : {}),
    });
  } else {
    // Keep updatedAt fresh
    await updateDoc(profileRef, { updatedAt: serverTimestamp() });
  }
  return profileRef;
}

export async function getUserRole(u: User): Promise<UserRole | "admin" | null> {
  // Check admin first
  try {
    const admin = await getDoc(doc(db, COLLECTIONS.admin, u.uid));
    if (admin.exists()) return "admin";
  } catch (err) {
    // If permission denied (e.g. rules not updated yet), ignore and proceed
    // This prevents the app from crashing/showing error toast just for checking admin
  }

  // Try in customers first, then companies
  const customer = await getDoc(doc(db, COLLECTIONS.customer, u.uid));
  if (customer.exists()) return "customer";
  const company = await getDoc(doc(db, COLLECTIONS.company, u.uid));
  if (company.exists()) return "company";
  return null;
}

// ---- Sign in / Sign up

export async function loginWithGoogle(role: UserRole) {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    await ensureUserProfile(cred.user, role);

    setUserId(cred.user.uid);
    setUserProperties({ user_role: role });
    trackLogin("google", role);

    return cred.user;
  } catch (error: any) {
    if (error?.code === "auth/popup-blocked" || error?.code === "auth/popup-closed-by-user") {
      logger.warn("Google sign-in popup was blocked or cancelled");
      return null;
    }

    // Handle account exists with different credential - show helpful message
    if (error?.code === "auth/account-exists-with-different-credential") {
      const email = error.customData?.email;
      if (email) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes("password")) {
          const err: any = new Error(
            "Acest email are deja un cont cu parolă. Te rugăm să te autentifici cu email și parolă."
          );
          err.code = "NEEDS_PASSWORD";
          throw err;
        }
      }
    }

    throw error;
  }
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

  // Track new user in GA4
  setUserId(user.uid);
  setUserProperties({ user_role: role as any });
  trackSignUp("email", role as any);

  return user;
}

export async function loginWithEmail(
  { email, password }: { email: string; password: string },
  role?: UserRole
) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  // Track user in GA4
  setUserId(user.uid);
  const detectedRole = role || (await getUserRole(user));
  if (detectedRole) {
    setUserProperties({ user_role: detectedRole as any });
    trackLogin("email", detectedRole as any);
  }

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
