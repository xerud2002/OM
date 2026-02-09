import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limitToLast,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { logger } from "@/utils/logger";

/**
 * Hook that tracks unread messages per offer.
 * Returns a Set of offerIds that have unread messages (from the other party).
 *
 * It subscribes to the last message in each offer's messages subcollection
 * and checks if the sender is someone other than the current user.
 */
export function useUnreadMessages(
  requestIds: string[],
  offersByRequest: Record<string, { id: string }[]>,
  currentUserRole: "company" | "customer",
  /** Set of offer IDs that the user has opened the chat for (clears unread) */
  readOfferIds?: Set<string>,
): Set<string> {
  const [unreadOffers, setUnreadOffers] = useState<Set<string>>(new Set());

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
  const readKey = readOfferIds ? Array.from(readOfferIds).join(",") : "";

  useEffect(() => {
    if (!auth.currentUser || requestIds.length === 0) return;

    const userId = auth.currentUser.uid;
    const unsubs: (() => void)[] = [];

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

            setUnreadOffers((prev) => {
              const next = new Set(prev);
              if (isFromOtherParty && !readOfferIds?.has(offer.id)) {
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
  }, [requestKey, offersKey, currentUserRole, readKey]);

  return unreadOffers;
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
