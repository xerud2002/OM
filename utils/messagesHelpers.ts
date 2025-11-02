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
    requestId,
    offerId,
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
 * Aggregate all messages across all offers for a request (client-side composition)
 * Subscribes to offers first, then attaches a listener per offer messages and merges them.
 */
export function onRequestMessagesAggregate(
  requestId: string,
  // eslint-disable-next-line no-unused-vars
  callback: (messages: Message[]) => void,
  // eslint-disable-next-line no-unused-vars
  onError?: (err: any) => void
) {
  // Lazy import to avoid heavy Firestore imports when unused
  let unsubscribers: Array<() => void> = [];
  const { collection, onSnapshot, orderBy, query } = require("firebase/firestore") as typeof import("firebase/firestore");

  // Listen to offers for this request
  const offersRef = collection(db, "requests", requestId, "offers");
  const unsubOffers = onSnapshot(
    offersRef,
    (offersSnap: any) => {
      // Clean previous message listeners
      unsubscribers.forEach((u) => u());
      unsubscribers = [];

      const all: Message[] = [];
      const pushAndEmit = () => {
        const sorted = all.sort((a, b) => {
          const ta = (a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt) || 0;
          const tb = (b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt) || 0;
          return ta - tb;
        });
        callback([...sorted]);
      };

      offersSnap.docs.forEach((offerDoc: any) => {
        const offerId = offerDoc.id;
        const msgsRef = collection(db, "requests", requestId, "offers", offerId, "messages");
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        const unsub = onSnapshot(
          q,
          (snap: any) => {
            // Remove existing from this offer
            for (let i = all.length - 1; i >= 0; i--) {
              if ((all[i] as any).offerId === offerId) all.splice(i, 1);
            }
            const msgs = snap.docs.map((d: any) => ({ id: d.id, offerId, requestId, ...d.data() })) as Message[];
            all.push(...msgs);
            pushAndEmit();
          },
          (err: any) => onError && onError(err)
        );
        unsubscribers.push(unsub);
      });
    },
    (err: any) => onError && onError(err)
  );

  return () => {
    try { unsubscribers.forEach((u) => u()); } catch {}
    try { unsubOffers(); } catch {}
  };
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
