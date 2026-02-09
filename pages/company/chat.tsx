"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { logger } from "@/utils/logger";

const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  loading: () => (
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  ),
  ssr: false,
});

type RequestData = {
  id: string;
  requestCode?: string;
  customerName?: string;
  contactName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  fromCity?: string;
  toCity?: string;
};

type OfferData = {
  id: string;
  companyName?: string;
  price?: number;
  status?: string;
};

export default function CompanyChatPage() {
  const router = useRouter();
  const { request: requestId, offer: offerId } = router.query;

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [offerData, setOfferData] = useState<OfferData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId || !offerId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch request data
        const requestRef = doc(db, "requests", requestId as string);
        const requestSnap = await getDoc(requestRef);

        if (!requestSnap.exists()) {
          setError("Cererea nu a fost găsită");
          setLoading(false);
          return;
        }

        const reqData = requestSnap.data();
        setRequestData({
          id: requestSnap.id,
          requestCode: reqData.requestCode,
          customerName: reqData.customerName || reqData.contactName || 
            (reqData.contactFirstName && reqData.contactLastName 
              ? `${reqData.contactFirstName} ${reqData.contactLastName}` 
              : "Client"),
          contactFirstName: reqData.contactFirstName,
          contactLastName: reqData.contactLastName,
          fromCity: reqData.fromCity,
          toCity: reqData.toCity,
        });

        // Fetch offer data
        const offerRef = doc(db, "requests", requestId as string, "offers", offerId as string);
        const offerSnap = await getDoc(offerRef);

        if (!offerSnap.exists()) {
          setError("Oferta nu a fost găsită");
          setLoading(false);
          return;
        }

        const offData = offerSnap.data();
        setOfferData({
          id: offerSnap.id,
          companyName: offData.companyName,
          price: offData.price,
          status: offData.status,
        });

        setLoading(false);
      } catch (err) {
        logger.error("Error fetching chat data:", err);
        setError("Eroare la încărcarea datelor");
        setLoading(false);
      }
    }

    fetchData();
  }, [requestId, offerId]);

  const customerDisplayName = requestData?.customerName || "Client";

  return (
    <RequireRole allowedRole="company">
      <DashboardLayout role="company">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {/* Back button and header */}
          <div className="mb-6">
            <Link
              href="/company/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Înapoi la Dashboard
            </Link>

            {requestData && (
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Chat - {requestData.requestCode || requestData.id.substring(0, 8)}
                </h1>
                <p className="text-sm text-gray-500">
                  {requestData.fromCity} → {requestData.toCity}
                  {offerData?.price && ` • Ofertă: ${offerData.price.toLocaleString('ro-RO')} RON`}
                  {offerData?.status && (
                    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      offerData.status === 'accepted' 
                        ? 'bg-green-100 text-green-700' 
                        : offerData.status === 'declined' || offerData.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                    }`}>
                      {offerData.status === 'accepted' ? 'Acceptată' : 
                       offerData.status === 'declined' || offerData.status === 'rejected' ? 'Refuzată' : 
                       'În așteptare'}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Chat area */}
          <div className="h-[600px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                  <p className="mt-4 text-sm text-gray-500">Se încarcă conversația...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-medium text-red-600">{error}</p>
                  <Link
                    href="/company/dashboard"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Înapoi la Dashboard
                  </Link>
                </div>
              </div>
            ) : requestId && offerId ? (
              <ChatWindow
                requestId={requestId as string}
                offerId={offerId as string}
                otherPartyName={customerDisplayName}
                currentUserRole="company"
                onClose={() => router.push("/company/dashboard")}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Parametri lipsă</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
