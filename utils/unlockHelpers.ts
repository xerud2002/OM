/**
 * Utility functions for managing contact unlock functionality
 * Handles payment simulation and Firestore unlock records
 */

import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";

export type UnlockRecord = {
  requestId: string;
  companyId: string;
  unlockedAt: any; // Firestore Timestamp
  paymentSimulated: boolean;
};

/**
 * Generates a unique document ID for unlock records
 * Format: {requestId}_{companyId}
 */
const unlockDocId = (requestId: string, companyId: string) => `${requestId}_${companyId}`;

/**
 * Check if a company has unlocked contact details for a specific request
 * @param requestId - The request ID
 * @param companyId - The company ID
 * @returns Promise<boolean> - True if unlocked, false otherwise
 */
export async function isContactUnlocked(requestId: string, companyId: string): Promise<boolean> {
  const ref = doc(db, "requestUnlocks", unlockDocId(requestId, companyId));
  const snap = await getDoc(ref);
  return snap.exists();
}

/**
 * Unlock contact details for a request (simulates payment)
 * Creates a record in Firestore to track the unlock
 * @param requestId - The request ID
 * @param companyId - The company ID
 * @returns Promise<void>
 */
export async function unlockContact(requestId: string, companyId: string): Promise<void> {
  const ref = doc(db, "requestUnlocks", unlockDocId(requestId, companyId));
  await setDoc(
    ref,
    {
      requestId,
      companyId,
      unlockedAt: serverTimestamp(),
      paymentSimulated: true, // Flag for future real payment integration
    },
    { merge: true }
  );
}

/**
 * Subscribe to all unlock records for a specific company
 * Provides real-time updates when the company unlocks new requests
 * @param companyId - The company ID
 * @param callback - Function called with unlock map when data changes
 * @returns Unsubscribe function
 */
export function onCompanyUnlocks(companyId: string, callback: any) {
  const q = query(collection(db, "requestUnlocks"), where("companyId", "==", companyId));
  
  return onSnapshot(q, (snap) => {
    const unlocks: Record<string, boolean> = {};
    snap.docs.forEach((d) => {
      const data = d.data() as UnlockRecord;
      if (data.requestId) {
        unlocks[data.requestId] = true;
      }
    });
    callback(unlocks);
  });
}

/**
 * Get all unlocked request IDs for a company
 * @param companyId - The company ID
 * @returns Promise<string[]> - Array of unlocked request IDs
 */
export async function getUnlockedRequests(companyId: string): Promise<string[]> {
  const q = query(collection(db, "requestUnlocks"), where("companyId", "==", companyId));
  const snap = await getDocs(q);
  
  return snap.docs.map((d) => {
    const data = d.data() as UnlockRecord;
    return data.requestId;
  }).filter(Boolean);
}

/**
 * Placeholder for future payment integration
 * This function will handle real payment processing
 * @param requestId - The request ID
 * @param companyId - The company ID
 * @param amount - Payment amount
 * @returns Promise<{ success: boolean; transactionId?: string }>
 */
export async function processPayment(
  requestId: string,
  companyId: string,
  amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // TODO: Integrate with payment gateway (Stripe, PayPal, etc.)
  // For now, just simulate success
  console.warn("Payment simulation:", { requestId, companyId, amount });
  
  return {
    success: true,
    transactionId: `sim_${Date.now()}`,
  };
}
