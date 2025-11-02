"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/services/firebase";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RequestsSnapshot({ onViewRequests }: { onViewRequests?: () => void }) {
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const router = useRouter();

  const { todayStart, weekStart } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - 6); // last 7 days including today
    return { todayStart: startOfToday, weekStart: startOfWeek };
  }, []);

  useEffect(() => {
    const col = collection(db, "requests");

    // Today
    const unsubToday = onSnapshot(
      query(col, where("createdAt", ">=", Timestamp.fromDate(todayStart))),
      (snap) => {
        const cnt = snap.docs
          .map((d) => d.data() as any)
          .filter((r) => (!r.status || r.status === "active") && !r.archived).length;
        setTodayCount(cnt);
      },
      () => setTodayCount(0)
    );

    // Week
    const unsubWeek = onSnapshot(
      query(col, where("createdAt", ">=", Timestamp.fromDate(weekStart))),
      (snap) => {
        const cnt = snap.docs
          .map((d) => d.data() as any)
          .filter((r) => (!r.status || r.status === "active") && !r.archived).length;
        setWeekCount(cnt);
      },
      () => setWeekCount(0)
    );

    // Total active (approx.)
    const unsubActive = onSnapshot(
      col,
      (snap) => {
        const cnt = snap.docs
          .map((d) => d.data() as any)
          .filter((r) => (!r.status || r.status === "active") && !r.archived).length;
        setActiveCount(cnt);
      },
      () => setActiveCount(0)
    );

    return () => {
      unsubToday();
      unsubWeek();
      unsubActive();
    };
  }, [todayStart, weekStart]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Cereri noi</h3>
        <span className="text-xs text-gray-500">Activ / 7z</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center">
          <p className="text-xs font-medium text-emerald-700">Astăzi</p>
          <p className="text-2xl font-bold text-emerald-700">{todayCount}</p>
        </div>
        <div className="rounded-xl bg-sky-50 px-4 py-3 text-center">
          <p className="text-xs font-medium text-sky-700">Ultimele 7 zile</p>
          <p className="text-2xl font-bold text-sky-700">{weekCount}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 px-4 py-3 text-center">
          <p className="text-xs font-medium text-indigo-700">Active</p>
          <p className="text-2xl font-bold text-indigo-700">{activeCount}</p>
        </div>
      </div>
      <button
        onClick={() => (onViewRequests ? onViewRequests() : router.push("/company/requests"))}
        className="mt-4 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-sky-500 py-2 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Vezi cererile
      </button>
    </div>
  );
}
