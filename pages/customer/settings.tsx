"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { db } from "@/services/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function CustomerSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      const ref = doc(db, "customers", u.uid);
      const snap = await getDoc(ref);
      const data = snap.data() as any;
      setForm({
        displayName: u.displayName || data?.displayName || "",
        phone: data?.phone || "",
        city: data?.city || "",
      });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const ref = doc(db, "customers", user.uid);
      await updateDoc(ref, {
        displayName: form.displayName,
        phone: form.phone,
        city: form.city,
        updatedAt: serverTimestamp(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireRole allowedRole="customer">
      <LayoutWrapper>
        <section className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="mb-6 text-2xl font-bold text-emerald-700">Setări profil</h1>
          {loading ? (
            <p className="italic text-gray-500">Se încarcă…</p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div>
                <label className="block text-xs text-gray-600">Nume afișat</label>
                <input
                  value={form.displayName}
                  onChange={(e) => setForm((s) => ({ ...s, displayName: e.target.value }))}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Telefon</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Oraș</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "Se salvează…" : "Salvează"}
                </button>
              </div>
            </form>
          )}
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
