// components/company/requestsView/PaymentForm.tsx
// Payment form to unlock full request details

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { addOffer } from "@/utils/firestoreHelpers";
import type { CompanyUser } from "./types";
import {
  Lock,
  Unlock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Shield,
  CheckCircle2,
  Sparkles,
  X,
  Zap,
  Gift,
} from "lucide-react";

type Props = {
  requestId: string;
  company: CompanyUser;
  onPaymentSuccess?: () => void;
};

export default function PaymentForm({ requestId, company, onPaymentSuccess }: Props) {
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowPayment(false);
      setPaymentSuccess(false);
    } catch (err) {
      console.error("Error processing payment:", err);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setSending(false);
    }
  };

  const benefits = [
    { icon: Phone, text: "Număr de telefon client", color: "from-blue-500 to-indigo-500" },
    { icon: Mail, text: "Adresa email completă", color: "from-violet-500 to-purple-500" },
    {
      icon: MapPin,
      text: "Adresă exactă (bloc, scară, apartament)",
      color: "from-orange-500 to-amber-500",
    },
    { icon: FileText, text: "Toate detaliile mutării", color: "from-emerald-500 to-teal-500" },
  ];

  if (showPayment) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-4 overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40 shadow-xl shadow-emerald-500/10"
        >
          {paymentSuccess ? (
            // Success message
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle2 className="h-10 w-10 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold text-emerald-700">Plată Reușită!</h4>
              <p className="mt-2 text-sm text-gray-600">
                Detaliile complete ale clientului sunt acum deblocate
              </p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyek0zNiAyMGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <button
                  onClick={() => setShowPayment(false)}
                  disabled={sending}
                  className="absolute top-3 right-3 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
                >
                  <X size={18} />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Unlock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Deblochează Detalii Complete</h4>
                    <p className="text-sm text-emerald-100">
                      Accesează toate informațiile clientului
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative mb-5 overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-5 text-center shadow-lg"
                >
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-teal-500/20 blur-2xl" />

                  {/* Limited Offer Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
                    className="absolute -top-1 -right-1 z-10"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 shadow-lg shadow-red-500/30"
                      >
                        <span className="flex items-center gap-1 text-xs font-bold text-white">
                          <Zap className="h-3 w-3" />
                          OFERTĂ LIMITATĂ
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>

                  <div className="relative pt-2">
                    <div className="mb-2 flex items-center justify-center gap-1.5">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      >
                        <Gift className="h-5 w-5 text-amber-400" />
                      </motion.div>
                      <span className="text-xs font-medium tracking-wider text-amber-400 uppercase">
                        Promoție lansare
                      </span>
                    </div>

                    {/* Price display with crossed out old price */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <span className="text-2xl font-bold text-slate-500 line-through decoration-red-500 decoration-2">
                          20 Lei
                        </span>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="flex items-baseline gap-1"
                      >
                        <span className="text-5xl font-black text-white">0</span>
                        <span className="text-xl font-bold text-emerald-400">Lei</span>
                      </motion.div>
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      GRATUIT • Acces permanent
                    </motion.p>
                  </div>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-5 space-y-2.5"
                >
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Ce primești
                  </p>
                  <div className="grid gap-2">
                    {benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${benefit.color} shadow-sm`}
                        >
                          <benefit.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <motion.button
                    onClick={handleConfirmPayment}
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.02 }}
                    whileTap={{ scale: sending ? 1 : 0.98 }}
                    className={`group relative w-full overflow-hidden rounded-xl py-4 font-bold text-white shadow-lg transition-all duration-300 ${
                      sending
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                    }`}
                  >
                    {/* Animated background pulse */}
                    {!sending && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-2">
                      {sending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                          />
                          Se procesează...
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Sparkles className="h-5 w-5" />
                          </motion.div>
                          Deblochează GRATUIT
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </>
                      )}
                    </span>
                    {!sending && (
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    )}
                  </motion.button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Plată securizată</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Acces imediat</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.form
      onSubmit={handleShowPayment}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4"
    >
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30"
      >
        {/* Animated pulse background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Limited offer badge */}
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 shadow-lg"
          >
            <span className="flex items-center gap-1 text-[10px] font-bold text-white">
              <Zap className="h-2.5 w-2.5" />
              GRATIS
            </span>
          </motion.div>
        </motion.div>

        <div className="relative flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">Vezi detalii complete client</p>
            <p className="text-xs text-emerald-100">Telefon, email, adresă exactă</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-white/60 line-through">20 Lei</span>
            <span className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
              0 Lei
            </span>
          </div>
        </div>
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      </motion.button>
    </motion.form>
  );
}
