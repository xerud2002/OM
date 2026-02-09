// hooks/useFirestoreQuery.ts
// Shared hook for Firestore real-time subscriptions with cleanup
import { useEffect, useState } from "react";
import {
  type Query,
  type DocumentData,
  onSnapshot,
  type FirestoreError,
} from "firebase/firestore";
import { logger } from "@/utils/logger";

type UseFirestoreQueryResult<T> = {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
};

/**
 * Hook for subscribing to a Firestore query with automatic cleanup.
 * Standardizes the auth→onSnapshot→cleanup pattern used across dashboards.
 *
 * @param query - Firestore query to subscribe to, or null to skip
 * @param transform - Transform function for each document (receives id + data)
 *
 * @example
 * const q = useMemo(() => user ? query(collection(db, "requests"), where("customerId", "==", user.uid)) : null, [user]);
 * const { data: requests, loading } = useFirestoreQuery<MovingRequest>(q, (id, d) => ({ id, ...d }));
 */
export function useFirestoreQuery<T>(
  firestoreQuery: Query<DocumentData> | null,
  transform: (id: string, data: DocumentData) => T
): UseFirestoreQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestoreQuery) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsub = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => transform(doc.id, doc.data()));
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        logger.error("useFirestoreQuery error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  // We use a ref-stable check. If query changes identity, re-subscribe.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestoreQuery]);

  return { data, loading, error };
}
