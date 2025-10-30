"use client";

import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import RequestsView from "@/components/company/RequestsView";

export default function CompanyRequestsPage() {
  return (
    <RequireRole allowedRole="company">
      <LayoutWrapper>
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
            Cereri primite de la clienți
          </h1>
          <RequestsView />
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
