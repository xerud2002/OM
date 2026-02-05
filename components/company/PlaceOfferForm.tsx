"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/services/firebase";
import { doc, runTransaction, serverTimestamp, collection } from "firebase/firestore";
import { CompanyUser } from "@/components/company/RequestsView";
import { calculateRequestCost } from "@/utils/costCalculator";
import {
  PaperAirplaneIcon as Send,
  ExclamationCircleIcon as AlertCircle,
  CheckCircleIcon as CheckCircle2,
  LockClosedIcon as Lock
} from "@heroicons/react/24/outline";

type Props = {
  request: any;
  company: CompanyUser;
  onOfferPlaced: () => void;
};

export default function PlaceOfferForm({ request, company, onOfferPlaced }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [companyCredits, setCompanyCredits] = useState<number | null>(null);

  const cost = calculateRequestCost(request);

  // Fetch latest credits when form opens
  useEffect(() => {
    if (isOpen && company?.uid) {
      // In a real app, listen to this via a context or reused hook
      // For now, we'll fetch/listen locally or rely on the transaction validation
      // Let's just assume we want to show the user their balance:
      import("firebase/firestore").then(({ getDoc, doc }) => {
        getDoc(doc(db, "companies", company.uid)).then((snap) => {
          if (snap.exists()) {
            setCompanyCredits(snap.data().credits || 0);
          }
        });
      });
    }
  }, [isOpen, company?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.uid) return;

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async (transaction) => {
        const companyRef = doc(db, "companies", company.uid);
        const companyDoc = await transaction.get(companyRef);

        if (!companyDoc.exists()) {
          throw "Company profile not found.";
        }

        // 1. Check Verification
        const companyData = companyDoc.data();
        if (companyData.verificationStatus !== 'verified') {
          throw "Contul tău trebuie să fie verificat pentru a trimite oferte. Te rugăm să încarci documentele în pagina de profil.";
        }

        // 2. Check Credits
        const currentCredits = companyData.credits || 0;
        if (currentCredits < cost) {
          throw `Fonduri insuficiente. Ai nevoie de ${cost} credite, dar ai doar ${currentCredits}.`;
        }

        // 3. Deduct Credits
        transaction.update(companyRef, {
          credits: currentCredits - cost
        });

        // 4. Create Offer
        const offerRef = doc(collection(db, "requests", request.id, "offers"));
        transaction.set(offerRef, {
          requestId: request.id,
          companyId: company.uid,
          companyName: company.displayName || "Companie",
          companyPhone: companyData.phone || null,
          companyEmail: companyData.email || company.email || null,
          price: Number(price),
          message: message,
          status: "pending", // Pending acceptance by customer
          createdAt: serverTimestamp(),
          costPaid: cost
        });

        // 5. Create Transaction Record (optional, good for audit)
        const txRef = doc(collection(db, "companies", company.uid, "transactions"));
        transaction.set(txRef, {
          type: "offer_placement",
          amount: -cost,
          requestId: request.id,
          createdAt: serverTimestamp()
        });
      });

      // 6. Send email notification to customer
      const customerEmail = request.customerEmail || request.guestEmail;
      if (customerEmail) {
        try {
          const { sendEmailViaAPI } = await import("@/utils/emailHelpers");
          await sendEmailViaAPI("newOffer", {
            customerEmail,
            requestCode: request.requestCode || request.id,
            requestId: request.id,
            companyName: company.displayName || "Companie",
            companyMessage: message,
            price: Number(price),
            fromCity: request.fromCity,
            toCity: request.toCity,
            moveDate: request.moveDate || request.moveDateStart,
          });
        } catch (emailErr) {
          console.error("Failed to send offer notification email:", emailErr);
          // Don't fail the whole operation just because email failed
        }
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        onOfferPlaced();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(typeof err === 'string' ? err : "A apărut o eroare necunoscută.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h3 className="mt-2 text-lg font-bold text-emerald-700">Ofertă trimisă!</h3>
        <p className="text-emerald-600">Ai deblocat accesul la client.</p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group relative w-full overflow-hidden rounded-2xl bg-white p-1 shadow-md ring-1 shadow-slate-200/50 ring-slate-100 transition-all hover:scale-[1.01] hover:shadow-lg hover:ring-emerald-200"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-bold text-white">Deblochează Cererea</p>
              <p className="text-xs text-slate-400">Vezi datele de contact și trimite ofertă</p>
            </div>
            <div className="rounded-lg bg-emerald-500/20 px-3 py-1.5 backdrop-blur-md">
              <span className="text-sm font-bold text-emerald-400">{cost} Credite</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Trimite Ofertă</h3>
          <p className="text-sm text-slate-500">Această acțiune va costa <strong className="text-emerald-600">{cost} credite</strong>.</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
        >
          <span className="sr-only">Închide</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Prețul tău (RON)</label>
          <div className="relative">
            <input
              type="number"
              required
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-12 font-semibold text-slate-900 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Ex: 1500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">RON</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Mesaj pentru client</label>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Descrie oferta ta, disponibilitatea, etc..."
            rows={3}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-xs font-medium text-slate-500">
            Disponibil: <span className={companyCredits && companyCredits < cost ? "text-rose-500" : "text-emerald-600"}>{companyCredits ?? "..."} credite</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-70"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            Trimite Oferta
          </button>
        </div>
      </form>
    </motion.div>
  );
}


