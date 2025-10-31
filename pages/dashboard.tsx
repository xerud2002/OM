import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LayoutWrapper from "@/components/layout/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { onAuthChange, getUserRole } from "@/utils/firebaseHelpers";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        toast.info("Te rugăm să te autentifici pentru a accesa panoul.");
        router.push("/customer/auth");
        return;
      }
      try {
        const role = await getUserRole(user);
        if (role === "company") {
          router.push("/company/dashboard");
        } else if (role === "customer") {
          router.push("/customer/dashboard");
        } else {
          // No role yet: default to auth chooser; product policy: avoid dual-role
          toast.info("Alege tipul de cont pentru a continua.");
          router.push("/customer/auth");
        }
      } catch (err) {
        console.error("Role resolution error", err);
        toast.error("Nu am putut determina tipul contului. Reîncearcă.");
        router.push("/customer/auth");
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <LayoutWrapper>
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <LoadingSpinner />
        <p className="text-sm text-gray-500">Se încarcă panoul tău personalizat…</p>
      </div>
    </LayoutWrapper>
  );
}
