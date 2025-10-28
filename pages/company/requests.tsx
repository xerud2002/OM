"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import { getAllRequests } from "@/utils/firestoreHelpers";

export default function CompanyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    getAllRequests().then(setRequests);
  }, []);

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl py-10">
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Cereri primite de la clienți
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {requests.map((r) => (
            <div key={r.id} className="rounded-lg border bg-white p-4 shadow">
              <h3 className="mb-1 font-semibold text-emerald-700">
                {r.customerName}
              </h3>
              <p className="mb-1 text-sm text-gray-600">
                {r.fromCity} → {r.toCity}
              </p>
              <p className="text-sm text-gray-500">Mutare: {r.moveDate}</p>
              <p className="mt-2 text-gray-600">{r.details}</p>
            </div>
          ))}
        </div>
      </section>
    </LayoutWrapper>
  );
}
