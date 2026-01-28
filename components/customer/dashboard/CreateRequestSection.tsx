import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const RequestForm = dynamic(() => import("@/components/customer/RequestForm"), {
  loading: () => <div className="h-96 animate-pulse rounded-xl bg-gray-100" />,
  ssr: false,
});

interface CreateRequestSectionProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onReset: () => void;
  user: any;
}

export default function CreateRequestSection({
  form,
  setForm,
  onSubmit,
  onReset,
  user,
}: CreateRequestSectionProps) {
  const router = useRouter();
  const autoSubmitTriggeredRef = useRef(false);

  // Auto-submit form if coming from home page with pending request
  useEffect(() => {
    const shouldAutoSubmit = router.query.autoSubmit === "true";
    const hasHomeForm = typeof window !== "undefined" && localStorage.getItem("homeRequestForm");

    if (shouldAutoSubmit && hasHomeForm && user && !autoSubmitTriggeredRef.current) {
      autoSubmitTriggeredRef.current = true;

      // Trigger form submission after a short delay to ensure everything is loaded
      const timer = setTimeout(() => {
        // Get submit button and simulate click
        const submitBtn = document.querySelector("[data-auto-submit]");
        if (submitBtn instanceof HTMLButtonElement) {
          submitBtn.click();
        }

        // Clean up home form from localStorage after submission attempt
        localStorage.removeItem("homeRequestForm");

        // Remove autoSubmit from URL without reload
        router.replace("/customer/dashboard", undefined, { shallow: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [router.query.autoSubmit, user, router]);

  return <RequestForm form={form} setForm={setForm} onSubmit={onSubmit} onReset={onReset} />;
}
