"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  startAfter,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { addOffer } from "@/utils/firestoreHelpers";
import { formatMoveDateDisplay } from "@/utils/date";
import { onAuthChange } from "@/utils/firebaseHelpers";

// Types
export type MovingRequest = {
  id: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  fromCity: string;
  toCity: string;
  moveDate?: string;
  details?: string;
  createdAt?: any;
};

export type CompanyUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
} | null;

export type Offer = {
  id: string;
  companyId: string;
  companyName: string;
  price: number;
  message: string;
  status?: "pending" | "accepted" | "declined" | "rejected";
  createdAt?: any;
};

function OfferForm({ requestId, company, onPaymentSuccess }: { requestId: string; company: CompanyUser; onPaymentSuccess?: () => void }) {
  const [showPayment, setShowPayment] = useState(false);
  const [sending, setSending] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleShowPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!company) return;
    setSending(true);
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save payment to Firestore (companies/{companyId}/payments/{requestId})
      const paymentRef = doc(db, `companies/${company.uid}/payments/${requestId}`);
      await setDoc(paymentRef, {
        requestId,
        companyId: company.uid,
        companyName: company.displayName || company.email || "Companie",
        amount: 20,
        currency: "RON",
        status: "completed",
        paidAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      
      // Simulate successful payment
      setPaymentSuccess(true);
      
      // Try to create offer (optional - for tracking)
      try {
        await addOffer(requestId, {
          companyId: company.uid,
          companyName: company.displayName || company.email || "Companie",
          price: 20,
          message: "Acces detalii complete achiziționate",
          status: "pending",
        });
      } catch (offerErr) {
        console.error("Offer creation skipped (permissions):", offerErr);
        // Continue anyway - payment succeeded
      }
      
      // Notify parent component
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      
      // Wait a moment to show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPayment(false);
      setPaymentSuccess(false);
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setSending(false);
    }
  };

  if (showPayment) {
    return (
      <div className="mt-3 space-y-3 rounded-lg border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-sky-50 p-4">
        {paymentSuccess ? (
          // Success message
          <div className="text-center">
            <div className="mb-3 text-5xl">✅</div>
            <h4 className="text-lg font-bold text-emerald-700">Plată Reușită!</h4>
            <p className="mt-2 text-sm text-gray-600">
              Detaliile complete ale clientului sunt acum deblocate
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h4 className="text-lg font-bold text-emerald-700">🔓 Deblochează Detalii Complete</h4>
              <p className="mt-1 text-sm text-gray-600">
                Pentru a vedea datele complete de contact ale clientului (telefon, email, adresă exactă)
              </p>
            </div>

            <div className="rounded-lg bg-white p-4 text-center shadow-sm">
              <p className="text-sm text-gray-500">Cost per cerere</p>
              <p className="text-3xl font-bold text-emerald-600">20 Lei</p>
              <p className="mt-1 text-xs text-gray-500">Plată unică pentru accesul la această cerere</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Ce primești:</p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>✅ Număr de telefon client</li>
                <li>✅ Adresa email</li>
                <li>✅ Adresă exactă (număr, bloc, scară, apartament)</li>
                <li>✅ Toate detaliile mutării</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmPayment}
                disabled={sending}
                className={`flex-1 rounded-md py-3 font-semibold text-white transition-all ${
                  sending
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {sending ? "Se procesează..." : "💳 Plătește 20 Lei"}
              </button>
              <button
                onClick={() => setShowPayment(false)}
                disabled={sending}
                className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anulează
              </button>
            </div>

            <p className="text-center text-xs text-gray-500">
              🔒 Plată securizată • Acces imediat după confirmare
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleShowPayment} className="mt-3 flex flex-col gap-2 border-t pt-3 text-sm">
      <button
        type="submit"
        className="rounded-md bg-emerald-600 py-2 font-semibold text-white transition-all hover:bg-emerald-700"
      >
        Vezi detalii complete client
      </button>
    </form>
  );
}

// Compact request card with expand/collapse functionality
function RequestCardCompact({ 
  request, 
  company, 
  hasMine,
  onUpdateHasMine 
}: { 
  request: MovingRequest; 
  company: CompanyUser;
  hasMine?: boolean;
  // eslint-disable-next-line no-unused-vars
  onUpdateHasMine?: (arg: boolean) => void;
}) {
  const [paidAccess, setPaidAccess] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const r = request;

  // Check if company has already paid for this request
  useEffect(() => {
    const checkPayment = async () => {
      if (!company?.uid || !r.id) {
        setCheckingPayment(false);
        return;
      }
      
      try {
        const paymentRef = doc(db, `companies/${company.uid}/payments/${r.id}`);
        const paymentSnap = await getDoc(paymentRef);
        
        if (paymentSnap.exists() && paymentSnap.data()?.status === "completed") {
          setPaidAccess(true);
          if (onUpdateHasMine) {
            onUpdateHasMine(true);
          }
        }
      } catch (err) {
        console.error("Error checking payment:", err);
      } finally {
        setCheckingPayment(false);
      }
    };
    
    checkPayment();
  }, [company?.uid, r.id, onUpdateHasMine]);

  const handlePaymentSuccess = () => {
    setPaidAccess(true);
    if (onUpdateHasMine) {
      onUpdateHasMine(true);
    }
  };

  const handlePrint = () => {
    // Get the current request element
    const printContent = document.getElementById(`request-${r.id}`);
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Write the HTML structure with styles
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cerere ${(r as any).requestCode || r.id.substring(0, 8)}</title>
          <link rel="stylesheet" href="/_next/static/css/de5116d32dc2f3ee.css">
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              color: black;
              background: white;
              padding: 20px;
            }
            * {
              box-shadow: none !important;
              animation: none !important;
              transition: none !important;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div id={`request-${r.id}`} className="space-y-3 print:break-inside-avoid">
      {/* Compact view - always visible */}
      <div className="space-y-2 print:space-y-1">
        {/* Header */}
        <div className="flex items-start justify-between print:mb-2">
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 print:text-base print:text-black">
              {(r as any).requestCode || r.id.substring(0, 8)}
            </h3>
            <p className="text-xs text-gray-500 print:text-[10px] print:text-gray-700">
              Cerere client: {r.customerName?.split(" ")[0] || "Client"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(r as any).rooms && (
              <span className="rounded-lg bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 print:bg-gray-100 print:px-2 print:py-0.5 print:text-[10px] print:text-black">
                {(r as any).rooms} {Number((r as any).rooms) === 1 ? "cameră" : "camere"}
              </span>
            )}
            <button
              onClick={handlePrint}
              className="rounded-lg border border-emerald-600 bg-white px-3 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 print:hidden"
              title="Printează"
            >
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Quick summary */}
        <div className="flex items-center gap-3 text-sm text-gray-600 print:text-[11px] print:text-black">
          <span>📦 {(r as any).fromCounty || r.fromCity}</span>
          <span>→</span>
          <span>🚚 {(r as any).toCounty || r.toCity}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 print:space-y-2">
            {/* Contact Info - Only show if paid/has access */}
            {(paidAccess || hasMine) && (
              <div className="space-y-2 rounded-lg border-2 border-emerald-200 bg-white p-3 shadow-sm print:border print:border-black print:bg-white print:p-2 print:shadow-none">
                <div className="mb-2 flex items-center gap-2 text-emerald-700 print:mb-1 print:text-black">
                  <span className="text-lg print:text-sm">✅</span>
                  <h4 className="text-sm font-bold print:text-[11px]">Date de Contact</h4>
                </div>
                
                {(r as any).phone && (
                  <div className="flex items-center gap-2 print:gap-1">
                    <span className="text-lg print:text-sm">📞</span>
                    <div>
                      <p className="text-xs text-gray-500 print:text-[9px] print:text-gray-700">Telefon</p>
                      <p className="font-semibold text-gray-800 print:text-[11px] print:text-black">{(r as any).phone}</p>
                    </div>
                  </div>
                )}
                
                {r.customerEmail && (
                  <div className={`flex items-center gap-2 print:gap-1 ${(r as any).phone ? 'border-t pt-2 print:pt-1' : ''}`}>
                    <span className="text-lg print:text-sm">📧</span>
                    <div>
                      <p className="text-xs text-gray-500 print:text-[9px] print:text-gray-700">Email</p>
                      <p className="font-semibold text-gray-800 print:text-[11px] print:text-black">{r.customerEmail}</p>
                    </div>
                  </div>
                )}
                
                {r.customerName && (
                  <div className={`flex items-center gap-2 print:gap-1 ${((r as any).phone || r.customerEmail) ? 'border-t pt-2 print:pt-1' : ''}`}>
                    <span className="text-lg print:text-sm">👤</span>
                    <div>
                      <p className="text-xs text-gray-500 print:text-[9px] print:text-gray-700">Nume complet</p>
                      <p className="font-semibold text-gray-800 print:text-[11px] print:text-black">{r.customerName}</p>
                    </div>
                  </div>
                )}

                {((r as any).contactFirstName || (r as any).contactLastName) && !r.customerName && (
                  <div className={`flex items-center gap-2 print:gap-1 ${((r as any).phone || r.customerEmail) ? 'border-t pt-2 print:pt-1' : ''}`}>
                    <span className="text-lg print:text-sm">👤</span>
                    <div>
                      <p className="text-xs text-gray-500 print:text-[9px] print:text-gray-700">Nume</p>
                      <p className="font-semibold text-gray-800 print:text-[11px] print:text-black">
                        {(r as any).contactFirstName} {(r as any).contactLastName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location details - Enhanced with full details if paid */}
            <div className="space-y-2 rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 p-3 print:border print:border-black print:bg-white print:p-2">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 print:text-[10px] print:text-black">📦 Adresă Colectare:</p>
                <p className="text-sm font-medium text-gray-800 print:text-[11px] print:text-black">
                  {(r as any).fromCounty || ""}{(r as any).fromCounty && ", "}{r.fromCity}
                </p>
                {(paidAccess || hasMine) ? (
                  // Full address with all details if paid
                  <>
                    {((r as any).fromStreet || (r as any).fromAddress) && (
                      <p className="text-sm text-gray-700 print:text-[11px] print:text-black">
                        {(r as any).fromStreet && `Str. ${(r as any).fromStreet}`}
                        {!(r as any).fromStreet && (r as any).fromAddress && (r as any).fromAddress}
                        {(r as any).fromNumber && ` nr. ${(r as any).fromNumber}`}
                        {(r as any).fromBloc && `, Bl. ${(r as any).fromBloc}`}
                        {(r as any).fromStaircase && `, Sc. ${(r as any).fromStaircase}`}
                        {(r as any).fromApartment && `, Ap. ${(r as any).fromApartment}`}
                      </p>
                    )}
                  </>
                ) : (
                  // Basic street only if not paid
                  <>
                    {((r as any).fromStreet || (r as any).fromAddress) && (
                      <p className="text-sm text-gray-600 print:text-[11px] print:text-black">
                        {(r as any).fromStreet && `Str. ${(r as any).fromStreet}`}
                        {!(r as any).fromStreet && (r as any).fromAddress}
                      </p>
                    )}
                  </>
                )}
                <div className="mt-1 flex flex-wrap gap-2 text-xs print:gap-1 print:text-[9px]">
                  {(r as any).fromType && (
                    <span className="rounded bg-white/80 px-2 py-0.5 print:border print:border-gray-400 print:bg-white print:px-1 print:text-black">
                      {(r as any).fromType === "house" ? "🏠 Casă" : "🏢 Apartament"}
                    </span>
                  )}
                  {(r as any).fromFloor !== undefined && (
                    <span className="rounded bg-white/80 px-2 py-0.5 print:border print:border-gray-400 print:bg-white print:px-1 print:text-black">
                      Etaj {(r as any).fromFloor}
                    </span>
                  )}
                  {(r as any).fromElevator !== undefined && (
                    <span className="rounded bg-white/80 px-2 py-0.5 print:border print:border-gray-400 print:bg-white print:px-1 print:text-black">
                      {(r as any).fromElevator ? "✅ Lift" : "❌ Fără lift"}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-emerald-200 pt-2 print:border-gray-400 print:pt-1">
                <p className="text-xs font-semibold uppercase text-gray-500 print:text-[10px] print:text-black">🚚 Adresă Livrare:</p>
                <p className="text-sm font-medium text-gray-800 print:text-[11px] print:text-black">
                  {(r as any).toCounty || ""}{(r as any).toCounty && ", "}{r.toCity}
                </p>
                {(paidAccess || hasMine) ? (
                  // Full address with all details if paid
                  <>
                    {((r as any).toStreet || (r as any).toAddress) && (
                      <p className="text-sm text-gray-700 print:text-[11px] print:text-black">
                        {(r as any).toStreet && `Str. ${(r as any).toStreet}`}
                        {!(r as any).toStreet && (r as any).toAddress && (r as any).toAddress}
                        {(r as any).toNumber && ` nr. ${(r as any).toNumber}`}
                        {(r as any).toBloc && `, Bl. ${(r as any).toBloc}`}
                        {(r as any).toStaircase && `, Sc. ${(r as any).toStaircase}`}
                        {(r as any).toApartment && `, Ap. ${(r as any).toApartment}`}
                      </p>
                    )}
                  </>
                ) : (
                  // Basic street only if not paid
                  <>
                    {((r as any).toStreet || (r as any).toAddress) && (
                      <p className="text-sm text-gray-600 print:text-[11px] print:text-black">
                        {(r as any).toStreet && `Str. ${(r as any).toStreet}`}
                        {!(r as any).toStreet && (r as any).toAddress}
                      </p>
                    )}
                  </>
                )}
                <div className="mt-1 flex flex-wrap gap-2 text-xs print:gap-1 print:text-[9px]">
                  {(r as any).toType && (
                    <span className="rounded bg-white/80 px-2 py-0.5 print:border print:border-gray-400 print:bg-white print:px-1 print:text-black">
                      {(r as any).toType === "house" ? "🏠 Casă" : "Apartament"}
                    </span>
                  )}
                  {(r as any).toFloor !== undefined && (
                    <span className="rounded bg-white/80 px-2 py-0.5 print:border print:border-gray-400 print:bg-white print:px-1 print:text-black">
                      Etaj {(r as any).toFloor}
                    </span>
                  )}
                  {(r as any).toElevator !== undefined && (
                    <span className="rounded bg-white/80 px-2 py-0.5 print:border print:border-gray-400 print:bg-white print:px-1 print:text-black">
                      {(r as any).toElevator ? "✅ Lift" : "❌ Fără lift"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Move date */}
            <div className="rounded-lg bg-amber-50 p-3 print:border print:border-black print:bg-white print:p-2">
              <p className="text-xs font-semibold uppercase text-gray-500 print:text-[10px] print:text-black">📅 Data mutării:</p>
              <p className="text-sm font-medium text-gray-800 print:text-[11px] print:text-black">
                {(() => {
                  const d = formatMoveDateDisplay(r as any, { month: "short" });
                  return d && d !== "-" ? d : "Flexibilă";
                })()}
              </p>
            </div>

            {/* Services requested */}
            {((r as any).serviceMoving || (r as any).servicePacking || (r as any).serviceDisassembly || 
              (r as any).serviceCleanout || (r as any).serviceStorage) && (
              <div className="rounded-lg bg-purple-50 p-3 print:border print:border-black print:bg-white print:p-2">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500 print:mb-1 print:text-[10px] print:text-black">🛠️ Servicii solicitate:</p>
                <div className="flex flex-wrap gap-2 print:gap-1">
                  {(r as any).serviceMoving && (
                    <span className="rounded-full bg-purple-200 px-2.5 py-1 text-xs font-medium text-purple-800 print:rounded print:border print:border-gray-400 print:bg-white print:px-1.5 print:py-0.5 print:text-[9px] print:text-black">
                      🚚 Transport
                    </span>
                  )}
                  {(r as any).servicePacking && (
                    <span className="rounded-full bg-purple-200 px-2.5 py-1 text-xs font-medium text-purple-800 print:rounded print:border print:border-gray-400 print:bg-white print:px-1.5 print:py-0.5 print:text-[9px] print:text-black">
                      📦 Ambalare
                    </span>
                  )}
                  {(r as any).serviceDisassembly && (
                    <span className="rounded-full bg-purple-200 px-2.5 py-1 text-xs font-medium text-purple-800 print:rounded print:border print:border-gray-400 print:bg-white print:px-1.5 print:py-0.5 print:text-[9px] print:text-black">
                      🔧 Demontare/Montare
                    </span>
                  )}
                  {(r as any).serviceCleanout && (
                    <span className="rounded-full bg-purple-200 px-2.5 py-1 text-xs font-medium text-purple-800 print:rounded print:border print:border-gray-400 print:bg-white print:px-1.5 print:py-0.5 print:text-[9px] print:text-black">
                      🧹 Debarasare
                    </span>
                  )}
                  {(r as any).serviceStorage && (
                    <span className="rounded-full bg-purple-200 px-2.5 py-1 text-xs font-medium text-purple-800 print:rounded print:border print:border-gray-400 print:bg-white print:px-1.5 print:py-0.5 print:text-[9px] print:text-black">
                      🏪 Depozitare
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Survey type */}
            {(r as any).surveyType && (
              <div className="rounded-lg bg-rose-50 p-3 print:border print:border-black print:bg-white print:p-2">
                <p className="text-xs font-semibold uppercase text-gray-500 print:text-[10px] print:text-black">📋 Tip evaluare:</p>
                <p className="text-sm font-medium text-gray-800 print:text-[11px] print:text-black">
                  {(r as any).surveyType === "in-person" && "👤 La fața locului"}
                  {(r as any).surveyType === "video" && "📹 Video call"}
                  {(r as any).surveyType === "quick-estimate" && "⚡ Estimare rapidă (fără vizită)"}
                </p>
              </div>
            )}

            {/* Details/notes */}
            {r.details && (
              <div className="rounded-lg border-l-4 border-emerald-500 bg-gray-50 p-3 print:border print:border-l-2 print:border-black print:bg-white print:p-2">
                <p className="text-xs font-semibold uppercase text-gray-500 print:text-[10px] print:text-black">💬 Detalii suplimentare:</p>
                <p className="mt-1 text-sm text-gray-700 print:text-[11px] print:text-black">{r.details}</p>
              </div>
            )}

            {/* Media indicator */}
            {(r as any).mediaUrls && (r as any).mediaUrls.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 print:text-[11px] print:text-black">
                <span>📸</span>
                <span className="font-medium">{(r as any).mediaUrls.length} fotografii/video-uri încărcate</span>
              </div>
            )}
      </div>

      {/* Action button */}
      {company ? (
        <>
          {checkingPayment ? (
            <div className="mt-3 flex items-center justify-center rounded-lg bg-gray-50 p-4 print:hidden">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <span>Verificare acces...</span>
              </div>
            </div>
          ) : !hasMine && !paidAccess ? (
            <div className="print:hidden">
              <OfferForm requestId={r.id} company={company} onPaymentSuccess={handlePaymentSuccess} />
            </div>
          ) : (
            <div className="mt-3 rounded-lg border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-3 text-center print:hidden">
              <p className="text-sm font-medium text-emerald-700">
                ✅ Ai acces complet la toate detaliile acestei cereri
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm italic text-gray-400 print:hidden">
          Trebuie să fii autentificat pentru a trimite oferte.
        </p>
      )}
    </div>
  );
}

export default function RequestsView({ companyFromParent }: { companyFromParent?: CompanyUser }) {
  const [company, setCompany] = useState<CompanyUser>(companyFromParent ?? null);
  const PAGE_SIZE = 10;
  const [firstPage, setFirstPage] = useState<MovingRequest[]>([]);
  const [extra, setExtra] = useState<MovingRequest[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasMineMap, setHasMineMap] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Auth (if not provided by parent)
  useEffect(() => {
    if (companyFromParent) return;
    const unsubAuth = onAuthChange((u) => setCompany(u));
    return () => unsubAuth();
  }, [companyFromParent]);

  useEffect(() => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
          .filter((req) => {
            // Show requests that are not closed, cancelled, or archived
            const isVisible =
              !req.status ||
              req.status === "active" ||
              req.status === "accepted" ||
              req.status === "pending";
            const notArchived = !req.archived;
            return isVisible && notArchived;
          });
        setFirstPage(list);
        setLoading(false);
        const last = snapshot.docs[snapshot.docs.length - 1] || null;
        setLastDoc(last);
        setHasMore(snapshot.size === PAGE_SIZE);
      },
      (error) => {
        console.warn("Error loading requests (this might be normal for new companies):", error);
        // Set empty state instead of error for better UX
        setFirstPage([]);
        setLoading(false);
        setHasMore(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    try {
      const q2 = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q2);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as any)
        .filter((req: any) => {
          const isVisible =
            !req.status ||
            req.status === "active" ||
            req.status === "accepted" ||
            req.status === "pending";
          const notArchived = !req.archived;
          return isVisible && notArchived;
        });
      setExtra((prev) => {
        const seen = new Set(prev.map((p) => p.id).concat(firstPage.map((p) => p.id)));
        return [...prev, ...list.filter((x) => !seen.has(x.id))];
      });
      const last = snap.docs[snap.docs.length - 1] || null;
      setLastDoc(last);
      setHasMore(snap.size === PAGE_SIZE);
    } catch (error) {
      console.warn("Error loading more requests:", error);
      // Stop trying to load more if there are permission errors
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [lastDoc, firstPage]);

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !loadingMore) {
            loadMore();
          }
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  const combinedRequests = useMemo(() => {
    // Ensure uniqueness when combining pages
    const map = new Map<string, MovingRequest>();
    [...firstPage, ...extra].forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [firstPage, extra]);

  const sortedRequests = useMemo(() => {
    const arr = [...combinedRequests];
    const getTime = (r: MovingRequest) =>
      r.createdAt?.toMillis ? r.createdAt.toMillis() : r.createdAt || 0;
    return sortBy === "date-desc"
      ? arr.sort((a, b) => getTime(b) - getTime(a))
      : arr.sort((a, b) => getTime(a) - getTime(b));
  }, [combinedRequests, sortBy]);

  const getTimeAgo = useMemo(
    () => (createdAt: any) => {
      if (!createdAt) return "";
      const ms = createdAt.toMillis ? createdAt.toMillis() : createdAt;
      const diff = currentTime - ms;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      return "Nou!";
    },
    [currentTime]
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Total cereri: <span className="font-semibold">{sortedRequests.length}</span>
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="date-desc">Cele mai noi</option>
          <option value="date-asc">Cele mai vechi</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Se încarcă cererile...</p>
      ) : sortedRequests.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center italic text-gray-500"
        >
          Momentan nu există cereri noi. 💤
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence>
            {sortedRequests.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border bg-white/90 p-5 shadow-md backdrop-blur-md transition-all hover:shadow-lg"
              >
                {r.createdAt && (
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        getTimeAgo(r.createdAt) === "Nou!"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getTimeAgo(r.createdAt)}
                    </span>
                  </div>
                )}

                <RequestCardCompact request={r} company={company} hasMine={hasMineMap[r.id]} onUpdateHasMine={(has: boolean) => setHasMineMap((prev) => ({ ...prev, [r.id]: has }))} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div ref={sentinelRef} />
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            disabled={loadingMore || !lastDoc}
            onClick={loadMore}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loadingMore ? "Se încarcă..." : "Încarcă mai multe"}
          </button>
        </div>
      )}
    </div>
  );
}
