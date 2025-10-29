"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthChange, getUserRole } from "@/utils/firebaseHelpers";
import { toast } from "sonner";

type Props = {
  allowedRole: "company" | "customer";
  children: React.ReactNode;
};

export default function RequireRole({ allowedRole, children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      (async () => {
        // Not authenticated -> send to the appropriate auth page
        if (!u) {
          toast.error("Trebuie să fii autentificat pentru a accesa această pagină.");
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
            // getUserRole performs Firestore reads to detect whether a profile doc exists
            role = await getUserRole(u);
            if (role) break;
            // wait a bit and retry
            await new Promise((res) => setTimeout(res, 400));
          }

          if (role !== allowedRole) {
            // If role is null or mismatched, redirect to the appropriate place
            toast.error("Acces nepermis pentru acest cont.");
            if (role === "company") router.push("/company/dashboard");
            else if (role === "customer") router.push("/customer/dashboard");
            else router.push("/");
          } else {
            setChecking(false);
          }
        } catch (err) {
          console.error("Role check failed:", err);
          router.push("/");
        }
      })();
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedRole]);

  if (checking)
    return (
      // Minimal loading placeholder while we verify role — avoids flashing or aborting navigation
      <div className="flex h-full w-full items-center justify-center p-8">
        Verificare permisiuni…
      </div>
    );
  return <>{children}</>;
}
