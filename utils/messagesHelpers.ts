/**
 * Utility functions for managing messages between companies and customers
 * Messages are stored in Firestore subcollections under offers
 */

import { db } from "@/services/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";

export type Message = {
  id: string;
  senderType: "company" | "customer";
  senderId: string;
  senderName?: string;
  text: string;
  createdAt: any; // Firestore Timestamp
  read?: boolean;
};

/**
 * Send a message related to an offer
 * Messages are stored under /requests/{requestId}/offers/{offerId}/messages
 * @param requestId - The request ID
 * @param offerId - The offer ID
 * @param senderType - Who is sending: "company" or "customer"
 * @param senderId - The sender's user ID
 * @param text - Message content
 * @param senderName - Optional sender name for display
 * @returns Promise<string> - The message ID
 */
export async function sendOfferMessage(
  requestId: string,
  offerId: string,
  senderType: "company" | "customer",
  senderId: string,
  text: string,
  senderName?: string
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Mesajul nu poate fi gol");
  }

  const messagesRef = collection(db, "requests", requestId, "offers", offerId, "messages");
  const docRef = await addDoc(messagesRef, {
    senderType,
    senderId,
    senderName: senderName || undefined,
    text: trimmed,
    createdAt: serverTimestamp(),
    read: false,
  });

  return docRef.id;
}

/**
 * Subscribe to messages for a specific offer
 * Provides real-time updates when new messages are added
 * @param requestId - The request ID
 * @param offerId - The offer ID
 * @param callback - Function called with messages array when data changes
 * @returns Unsubscribe function
 */
export function onOfferMessages(
  requestId: string,
  offerId: string,
  callback: Function,
  onError?: Function
) {
  const messagesRef = collection(db, "requests", requestId, "offers", offerId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      callback(messages);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

/**
 * Get all messages for an offer (one-time fetch)
 * @param requestId - The request ID
 * @param offerId - The offer ID
 * @returns Promise<Message[]>
 */
export async function getOfferMessages(requestId: string, offerId: string): Promise<Message[]> {
  const messagesRef = collection(db, "requests", requestId, "offers", offerId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Message[];
}

/**
 * Get unread message count for an offer
 * @param requestId - The request ID
 * @param offerId - The offer ID
 * @param userId - The user ID to check unread messages for
 * @returns Promise<number>
 */
export async function getUnreadCount(
  requestId: string,
  offerId: string,
  userId: string
): Promise<number> {
  const messages = await getOfferMessages(requestId, offerId);
  return messages.filter((m) => !m.read && m.senderId !== userId).length;
}
