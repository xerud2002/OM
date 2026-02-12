import { useState, useEffect, useCallback, useRef } from "react";
import type { User } from "firebase/auth";

const POLL_INTERVAL = 30_000; // 30s

/**
 * Hook that polls /api/admin/sidebar-badges every 30s
 * Returns a map of sidebar href → unread count
 * Only active when role === "admin".
 */
export function useAdminBadges(role: string, user: User | null): Record<string, number> {
  const [badges, setBadges] = useState<Record<string, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const fetchBadges = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/sidebar-badges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        setBadges(json.data.badges);
      }
    } catch {
      // Silently fail — badge is non-critical
    }
  }, [user]);

  useEffect(() => {
    if (role !== "admin" || !user) return;

    // Initial fetch
    fetchBadges();

    // Poll every 30s
    timerRef.current = setInterval(fetchBadges, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [role, user, fetchBadges]);

  return badges;
}
