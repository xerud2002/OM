// components/company/requestsView/PaymentForm.tsx
// Payment form to unlock full request details - FREE limited time offer

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { addOffer } from "@/utils/firestoreHelpers";
import type { CompanyUser } from "@/types";
import {
  Lock,
  Unlock,
  Phone,
  Send,
  HandshakeIcon,
  MessageCircle,
  Shield,
  CheckCircle2,
  Sparkles,
  X,
  Zap,
  Gift,
  Clock,
  ArrowRight,
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
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const paymentRef = doc(db, `companies/${company.uid}/payments/${requestId}`);
      await setDoc(paymentRef, {
        requestId,
        companyId: company.uid,
        companyName: company.displayName || company.email || "Companie",
        amount: 0,
        currency: "RON",
        status: "completed",
        paidAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      setPaymentSuccess(true);

      try {
        await addOffer(requestId, {
          companyId: company.uid,
          companyName: company.displayName || company.email || "Companie",
          price: 0,
          message: "Acces gratuit - promoție lansare",
          status: "pending",
        });
      } catch (offerErr) {
        console.error("Offer creation skipped:", offerErr);
      }

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      setShowPayment(false);
      setPaymentSuccess(false);
    } catch (err) {
      console.error("Error:", err);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    } finally {
      setSending(false);
    }
  };

  // Action-oriented benefits
  const actions = [
    {
      icon: Phone,
      title: "Contactează clientul",
      desc: "Sună direct pentru detalii",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: Send,
      title: "Trimite o ofertă",
      desc: "Propune prețul tău",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageCircle,
      title: "Discută detaliile",
      desc: "Clarifică cerințele",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: HandshakeIcon,
      title: "Câștigă contractul",
      desc: "Finalizează mutarea",
      gradient: "from-teal-500 to-cyan-600",
    },
  ];

  if (showPayment) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-4 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 shadow-slate-200/50 ring-slate-100"
        >
          {paymentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-200"
              >
                <CheckCircle2 className="h-10 w-10 text-white" />
              </motion.div>
              <h4 className="text-2xl font-bold text-slate-800">Felicitări! 🎉</h4>
              <p className="mt-2 text-slate-500">Ai acces la datele complete ale clientului</p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-6 py-6">
                {/* Animated gradient orbs */}
                <motion.div
                  animate={{ x: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
                />
                <motion.div
                  animate={{ x: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"
                />

                {/* Close button */}
                <button
                  onClick={() => setShowPayment(false)}
                  disabled={sending}
                  className="absolute top-4 right-4 z-20 rounded-full bg-white/10 p-2 text-white/60 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white disabled:opacity-50"
                >
                  <X size={16} />
                </button>

                <div className="relative z-10">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30"
                    >
                      <Unlock className="h-7 w-7 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Deblochează Accesul</h4>
                      <p className="text-sm text-slate-300">Gratis pe perioadă limitată</p>
                    </div>
                  </div>

                  {/* Price display */}
                  <div className="mt-6 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="relative"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-xl"
                      />
                      <div className="relative flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 shadow-lg shadow-emerald-500/30">
                        <Sparkles className="h-6 w-6 text-white/80" />
                        <span className="text-3xl font-black text-white">GRATIS</span>
                        <Sparkles className="h-6 w-6 text-white/80" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="p-6">
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  <Gift className="h-4 w-4 text-emerald-500" />
                  Ce poți face după deblocare
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {actions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100 transition-all hover:shadow-lg hover:ring-slate-200"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/50 opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="relative">
                        <div
                          className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-md transition-transform group-hover:scale-110`}
                        >
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <h5 className="font-semibold text-slate-800">{action.title}</h5>
                        <p className="mt-0.5 text-xs text-slate-500">{action.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <motion.button
                    onClick={handleConfirmPayment}
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.01 }}
                    whileTap={{ scale: sending ? 1 : 0.99 }}
                    className={`group relative w-full overflow-hidden rounded-2xl py-4 text-base font-bold text-white shadow-lg transition-all duration-300 ${
                      sending
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
                    }`}
                  >
                    {!sending && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
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
                          Se activează...
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
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowRight className="h-5 w-5" />
                          </motion.div>
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Trust indicators */}
                  <div className="mt-4 flex items-center justify-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" />
                      Securizat
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-teal-500" />
                      Instant
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      Fără obligații
                    </span>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Initial compact button
  return (
    <motion.form
      onSubmit={handleShowPayment}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4"
    >
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        className="group relative w-full overflow-hidden rounded-2xl bg-white p-1 shadow-lg ring-1 shadow-slate-200/50 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:ring-emerald-200"
      >
        {/* Inner card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-5">
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative flex items-center gap-4">
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30"
            >
              <Lock className="h-7 w-7 text-white" />
            </motion.div>

            {/* Text */}
            <div className="flex-1 text-left">
              <p className="text-base font-bold text-white">Contactează clientul</p>
              <p className="text-sm text-slate-400">
                Deblochează: telefon, email și adresă, trimite-i o ofertă
              </p>
            </div>

            {/* GRATIS badge */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 shadow-md shadow-emerald-500/20"
            >
              <span className="text-lg font-black text-white">GRATIS</span>
            </motion.div>
          </div>

          {/* Bottom banner */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">
              Gratis pe perioadă limitată
            </span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </motion.div>
          </div>
        </div>
      </motion.button>
    </motion.form>
  );
}
