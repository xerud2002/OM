"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthChange, getUserRole, isLogoutInProgress } from "@/utils/firebaseHelpers";
import { toast } from "sonner";

type Props = {
  allowedRole: "company" | "customer" | "admin";
  children: React.ReactNode;
};

export default function RequireRole({ allowedRole, children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait for router to be ready before checking auth
    if (!router.isReady) return;

    const unsub = onAuthChange((u) => {
      (async () => {
        // Not authenticated -> send to the appropriate auth page
        if (!u) {
          // Don't show error toast if user is logging out intentionally
          if (!isLogoutInProgress()) {
            toast.error("Trebuie să fii autentificat pentru a accesa această pagină.");
          }
          router.push(allowedRole === "company" ? "/company/auth" : "/customer/auth");
          setChecking(false);
          return;
        }

        try {
          // The profile doc may be created asynchronously (esp. after OAuth sign-in).
          // Try a few times with a small delay before giving up to avoid premature redirects.
          let role: string | null = null;
          const maxAttempts = 5;
          for (let i = 0; i < maxAttempts; i++) {
            try {
              // getUserRole performs Firestore reads to detect whether a profile doc exists
              role = await getUserRole(u);
              if (role) break;
            } catch (err) {
              console.error(`Role check attempt ${i + 1} failed:`, err);
            }
            // wait a bit and retry (but not after last attempt)
            if (i < maxAttempts - 1) {
              await new Promise((res) => setTimeout(res, 400));
            }
          }

          // If we still don't have a role after all attempts, redirect to home
          if (!role) {
            toast.error("Nu am putut determina tipul contului. Te rugăm să contactezi suportul.");
            router.push("/");
            setChecking(false);
            return;
          }

          if (role !== allowedRole) {
            // If role is mismatched, redirect to the appropriate place
            if (role === "company") router.push("/company/dashboard");
            else if (role === "customer") router.push("/customer/dashboard");
            else if (role === "admin") router.push("/admin/verifications");
            else router.push("/");
          } else {
            setChecking(false);
          }
        } catch (err) {
          console.error("Role check failed:", err);
          toast.error("Eroare la verificarea contului.");
          router.push("/");
        }
      })();
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRole, router.isReady]);

  if (checking)
    return (
      // Minimal loading placeholder while we verify role - avoids flashing or aborting navigation
      <div className="flex h-full w-full items-center justify-center p-8">
        Verificare permisiuni…
      </div>
    );
  return <>{children}</>;
}
