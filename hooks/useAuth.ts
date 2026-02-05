import { useEffect, useState } from "react";
import { onAuthChange } from "@/utils/firebaseHelpers";
import type { User } from "firebase/auth";

// Type compatible with DashboardLayout's user prop
interface DashboardUser {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}

interface UseAuthReturn {
  user: User | null;
  /** User object formatted for DashboardLayout compatibility */
  dashboardUser: DashboardUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

/**
 * Custom hook to manage Firebase authentication state.
 * Replaces the repetitive pattern used across dashboard pages:
 * 
 * ```tsx
 * const [user, setUser] = useState<any>(null);
 * useEffect(() => {
 *   const unsub = onAuthChange((u) => setUser(u));
 *   return () => unsub();
 * }, []);
 * ```
 * 
 * @returns {UseAuthReturn} - The current user, loading state, and authentication status
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Transform Firebase User to DashboardLayout-compatible type
  const dashboardUser: DashboardUser | null = user
    ? {
        uid: user.uid,
        displayName: user.displayName || undefined,
        email: user.email || undefined,
        photoURL: user.photoURL || undefined,
      }
    : null;

  return {
    user,
    dashboardUser,
    loading,
    isAuthenticated: !!user,
  };
}

export default useAuth;
