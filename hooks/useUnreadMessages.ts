import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limitToLast,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { logger } from "@/utils/logger";

const READ_TS_KEY = "om_chat_read_ts";

function getReadTimestamps(): Record<string, number> {
  try {
    const raw = localStorage.getItem(READ_TS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function markOfferAsRead(offerId: string): void {
  const ts = getReadTimestamps();
  ts[offerId] = Date.now();
  localStorage.setItem(READ_TS_KEY, JSON.stringify(ts));
}

/**
 * Hook that tracks unread messages per offer.
 * Returns a Set of offerIds that have unread messages (from the other party).
 * Uses localStorage to persist read timestamps across page refreshes.
 */
export function useUnreadMessages(
  requestIds: string[],
  offersByRequest: Record<string, { id: string }[]>,
  currentUserRole: "company" | "customer",
): { unreadOffers: Set<string>; markRead: (offerId: string) => void } {
  const [unreadOffers, setUnreadOffers] = useState<Set<string>>(new Set());

  const markRead = useCallback((offerId: string) => {
    markOfferAsRead(offerId);
    setUnreadOffers((prev) => {
      const next = new Set(prev);
      next.delete(offerId);
      return next;
    });
  }, []);

  // Stabilize dependencies to avoid lint warnings with complex expressions
  const requestKey = requestIds.join(",");
  const offersKey = JSON.stringify(
    Object.fromEntries(
      Object.entries(offersByRequest).map(([k, v]) => [
        k,
        v.map((o) => o.id),
      ]),
    ),
  );

  useEffect(() => {
    if (!auth.currentUser || requestIds.length === 0) return;

    const userId = auth.currentUser.uid;
    const unsubs: (() => void)[] = [];
    const readTs = getReadTimestamps();

    for (const requestId of requestIds) {
      const offers = offersByRequest[requestId] || [];
      for (const offer of offers) {
        const messagesRef = collection(
          db,
          "requests",
          requestId,
          "offers",
          offer.id,
          "messages",
        );
        const q = query(messagesRef, orderBy("createdAt", "asc"), limitToLast(1));

        const unsub = onSnapshot(
          q,
          (snap) => {
            if (snap.empty) return;
            const lastMsg = snap.docs[0].data();
            // If the last message was sent by someone else, it's unread
            const isFromOtherParty =
              lastMsg.senderId !== userId &&
              lastMsg.senderRole !== currentUserRole;

            // Compare message timestamp with last read timestamp
            const msgTime = lastMsg.createdAt?.toMillis?.()
              || (lastMsg.createdAt?.seconds ? lastMsg.createdAt.seconds * 1000 : 0);
            const lastRead = readTs[offer.id] || 0;

            setUnreadOffers((prev) => {
              const next = new Set(prev);
              if (isFromOtherParty && msgTime > lastRead) {
                next.add(offer.id);
              } else {
                next.delete(offer.id);
              }
              return next;
            });
          },
          (err) => {
            logger.log("Unread messages listener error:", err.message);
          },
        );

        unsubs.push(unsub);
      }
    }

    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, offersKey, currentUserRole]);

  return { unreadOffers, markRead };
}

/**
 * Returns the total number of unread chats across all offers for a given request.
 */
export function countUnreadForRequest(
  requestId: string,
  offersByRequest: Record<string, { id: string }[]>,
  unreadOffers: Set<string>,
): number {
  const offers = offersByRequest[requestId] || [];
  return offers.filter((o) => unreadOffers.has(o.id)).length;
}
