"use client";

import { useEffect, useState } from "react";
import LayoutWrapper from "@/components/layout/Layout";
import RequireRole from "@/components/auth/RequireRole";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { db, auth } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import StarRating from "@/components/reviews/StarRating";
import { sendEmail } from "@/utils/emailHelpers";
import { toast } from "sonner";

export default function CompanyProfile() {
  const [company, setCompany] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRequestReview, setShowRequestReview] = useState(false);
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewCustomerName, setReviewCustomerName] = useState("");
  const [sendingReview, setSendingReview] = useState(false);
  
  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [cif, setCif] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [description, setDescription] = useState("");

  // Track logged-in company
  useEffect(() => {
    const unsub = onAuthChange((user) => setCompany(user));
    return () => unsub();
  }, []);

  // Load company profile
  useEffect(() => {
    if (!company?.uid) return;
    
    const loadProfile = async () => {
      try {
        const docRef = doc(db, "companies", company.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setCompanyName(data.companyName || "");
          setCif(data.cif || "");
          setPhone(data.phone || "");
          setCity(data.city || "");
          setCounty(data.county || "");
          setDescription(data.description || "");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [company?.uid]);

  const handleSave = async () => {
    if (!company?.uid) return;
    setSaving(true);
    
    try {
      const docRef = doc(db, "companies", company.uid);
      await updateDoc(docRef, {
        companyName,
        cif,
        phone,
        city,
        county,
        description,
        updatedAt: new Date(),
      });
      
      // Reload profile
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      
      setEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("A apărut o eroare la salvarea profilului. Te rugăm să încerci din nou.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RequireRole allowedRole="company">
        <LayoutWrapper>
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="mt-4 text-sm font-medium text-gray-600">Se încarcă profilul...</p>
            </div>
          </div>
        </LayoutWrapper>
      </RequireRole>
    );
  }

  return (
    <RequireRole allowedRole="company">
      <LayoutWrapper>
        <section className="mx-auto max-w-4xl px-4 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Profil{" "}
              <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Companie
              </span>
            </h1>
            <p className="mt-2 text-gray-600">Gestionează informațiile companiei tale</p>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white shadow-lg"
          >
            {/* Header Section with Avatar */}
            <div className="border-b border-gray-200 bg-linear-to-br from-emerald-500 to-sky-600 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur-sm">
                    {(profile?.companyName || company?.displayName || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {profile?.companyName || company?.displayName || "Companie"}
                    </h2>
                    <p className="text-emerald-100">{profile?.email || company?.email}</p>
                  </div>
                </div>
                
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="rounded-lg bg-white/20 px-4 py-2 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
                  >
                    ✏️ Editează
                  </button>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="border-b border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Rating Companie</h3>
                  <p className="text-sm text-gray-600">Evaluările clienților tăi</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <StarRating rating={profile?.averageRating || 0} size="lg" />
                    <span className="text-3xl font-bold text-gray-900">
                      {profile?.averageRating ? profile.averageRating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {profile?.totalReviews || 0} {(profile?.totalReviews || 0) === 1 ? "recenzie" : "recenzii"}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nume Companie *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Ex: Transport & Mutări SRL"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        CIF
                      </label>
                      <input
                        type="text"
                        value={cif}
                        onChange={(e) => setCif(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Ex: RO12345678"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Ex: 0721234567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Județ
                      </label>
                      <input
                        type="text"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Ex: București"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Oraș
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Ex: București"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Descriere Companie
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Descrie serviciile oferite de compania ta..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving || !companyName}
                      className="flex-1 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {saving ? "Se salvează..." : "💾 Salvează"}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        // Reset to original values
                        setCompanyName(profile?.companyName || "");
                        setCif(profile?.cif || "");
                        setPhone(profile?.phone || "");
                        setCity(profile?.city || "");
                        setCounty(profile?.county || "");
                        setDescription(profile?.description || "");
                      }}
                      disabled={saving}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anulează
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nume Companie</p>
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {profile?.companyName || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">CIF</p>
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {profile?.cif || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {profile?.phone || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Locație</p>
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {profile?.city && profile?.county
                          ? `${profile.city}, ${profile.county}`
                          : profile?.city || profile?.county || "—"}
                      </p>
                    </div>
                  </div>

                  {profile?.description && (
                    <div className="pt-4">
                      <p className="text-sm font-medium text-gray-500">Descriere</p>
                      <p className="mt-2 text-base text-gray-700">{profile.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recenzii Clienți</h3>
              <button
                onClick={() => setShowRequestReview(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Cere Review
              </button>
            </div>
            
            {!profile?.totalReviews || profile.totalReviews === 0 ? (
              <div className="rounded-lg bg-gray-50 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <p className="mt-4 text-lg font-semibold text-gray-700">
                  Încă nu ai recenzii
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Recenziile de la clienți vor apărea aici după finalizarea mutărilor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Funcționalitatea de afișare recenzii va fi implementată în curând
                </p>
              </div>
            )}
          </motion.div>

          {/* Request Review Modal */}
          {showRequestReview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRequestReview(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              >
                <h3 className="mb-4 text-xl font-bold text-gray-900">📧 Cere Review de la Client</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Trimite un email unui client pentru a te evalua serviciile tale
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Nume Client
                    </label>
                    <input
                      type="text"
                      value={reviewCustomerName}
                      onChange={(e) => setReviewCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Ex: Ion Popescu"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email Client
                    </label>
                    <input
                      type="email"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Ex: client@email.com"
                    />
                  </div>

                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-blue-800">
                      💡 Clientul va primi un email cu un link pentru a lăsa un review despre serviciile tale
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={async () => {
                        if (!reviewEmail || !reviewCustomerName) {
                          toast.error("Te rugăm să completezi toate câmpurile");
                          return;
                        }
                        
                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(reviewEmail)) {
                          toast.error("Adresa de email nu este validă");
                          return;
                        }
                        
                        setSendingReview(true);
                        try {
                          // Send review request email via EmailJS
                          await sendEmail(
                            {
                              to_email: reviewEmail,
                              to_name: reviewCustomerName,
                              company_name: profile?.name || "Compania noastră",
                              review_link: `${window.location.origin}/company/profile?id=${auth.currentUser?.uid}`,
                            },
                            "template_review_request" // You'll need to create this template in EmailJS
                          );
                          
                          toast.success(`✅ Email trimis către ${reviewCustomerName}`);
                          setShowRequestReview(false);
                          setReviewEmail("");
                          setReviewCustomerName("");
                        } catch (error) {
                          console.error("Error sending review request:", error);
                          toast.error("A apărut o eroare. Te rugăm să încerci din nou.");
                        } finally {
                          setSendingReview(false);
                        }
                      }}
                      disabled={sendingReview}
                      className="flex-1 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {sendingReview ? "Se trimite..." : "📤 Trimite Cerere"}
                    </button>
                    <button
                      onClick={() => {
                        setShowRequestReview(false);
                        setReviewEmail("");
                        setReviewCustomerName("");
                      }}
                      disabled={sendingReview}
                      className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anulează
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </section>
      </LayoutWrapper>
    </RequireRole>
  );
}
