"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import { TicketIcon as Ticket } from "@heroicons/react/24/outline";

export default function CreditBalance({ companyId }: { companyId: string }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const unsub = onSnapshot(doc(db, "companies", companyId), (doc) => {
      if (doc.exists()) {
        setCredits(doc.data().credits ?? 0);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-400" />
        <div className="h-4 w-12 animate-pulse rounded bg-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-md transition-all hover:bg-emerald-500/20">
      <Ticket className="h-5 w-5 text-emerald-500" />
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold text-emerald-600">{credits ?? 0} Credite</span>
      </div>
    </div>
  );
}

