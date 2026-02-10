import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RequireRole from "@/components/auth/RequireRole";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { db, auth, storage } from "@/services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { motion } from "framer-motion";
import StarRating from "@/components/reviews/StarRating";
import { toast } from "sonner";
import { logger } from "@/utils/logger";
import VerificationSection from "@/components/company/VerificationSection";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, EnvelopeIcon, UserIcon, StarIcon, CameraIcon } from "@heroicons/react/24/outline";

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
  
  // Logo upload
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company?.uid) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Te rugăm să încarci o imagine (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imaginea trebuie să fie mai mică de 5MB");
      return;
    }

    setUploadingLogo(true);
    try {
      // Create storage reference
      const ext = file.name.split(".").pop() || "jpg";
      const storageRef = ref(storage, `companies/${company.uid}/logo.${ext}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Firestore document
      const docRef = doc(db, "companies", company.uid);
      await updateDoc(docRef, {
        logoUrl: downloadURL,
        updatedAt: new Date(),
      });
      
      // Reload profile
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
      
      toast.success("Logo actualizat cu succes!");
    } catch (err) {
      logger.error("Error uploading logo:", err);
      toast.error("Eroare la încărcarea logo-ului. Încearcă din nou.");
    } finally {
      setUploadingLogo(false);
      // Reset input
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

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
        logger.error("Error loading profile:", err);
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
      logger.error("Error saving profile:", err);
      alert("A apărut o eroare la salvarea profilului. Te rugăm să încerci din nou.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RequireRole allowedRole="company">
        <DashboardLayout role="company" user={company}>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="mt-4 text-sm font-medium text-gray-600">Se încarcă profilul...</p>
            </div>
          </div>
        </DashboardLayout>
      </RequireRole>
    );
  }

  return (
    <RequireRole allowedRole="company">
      <DashboardLayout role="company" user={company}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Companie</h1>
            <p className="text-gray-500">Gestionează informațiile companiei tale</p>
          </div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Header Section with Avatar */}
            <div className="relative bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-600 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Logo/Avatar with upload button */}
                  <div className="relative group">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/20 text-xl font-bold text-white backdrop-blur-sm sm:h-20 sm:w-20 sm:text-2xl">
                      {profile?.logoUrl ? (
                        <Image
                          src={profile.logoUrl}
                          alt="Logo companie"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (profile?.companyName || company?.displayName || "C").charAt(0).toUpperCase()
                      )}
                    </div>
                    {/* Upload button overlay */}
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                      title="Schimbă logo"
                    >
                      {uploadingLogo ? (
                        <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <CameraIcon className="h-6 w-6 text-white" />
                      )}
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                      {profile?.companyName || company?.displayName || "Companie"}
                    </h2>
                    <p className="truncate text-sm text-emerald-100 sm:text-base">
                      {profile?.email || company?.email}
                    </p>
                    <p className="mt-1 text-xs text-white/60 sm:hidden">
                      Atingeți logo-ul pentru a-l schimba
                    </p>
                  </div>
                </div>

                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 sm:w-auto sm:text-base"
                  >
                    ✏️ Editează
                  </button>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="border-b border-gray-200 bg-gray-50 p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Rating Companie</h3>
                  <p className="text-xs text-gray-600 sm:text-sm">Evaluările clienților tăi</p>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-0">
                  <div className="flex items-center gap-2">
                    <StarRating rating={profile?.averageRating || 0} size="md" />
                    <span className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {profile?.averageRating ? profile.averageRating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 sm:mt-1 sm:text-sm">
                    {profile?.totalReviews || 0}{" "}
                    {(profile?.totalReviews || 0) === 1 ? "recenzie" : "recenzii"}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-4 sm:p-6">
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
                      <label className="mb-1 block text-sm font-medium text-gray-700">CIF</label>
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
                      <label className="mb-1 block text-sm font-medium text-gray-700">Județ</label>
                      <input
                        type="text"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-3 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Ex: București"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Oraș</label>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8"
          >
            {profile && (
              <VerificationSection 
                company={profile} 
                onUpdate={async () => {
                   // Refresh profile logic
                   if (!company?.uid) return;
                   import("firebase/firestore").then(async ({ getDoc, doc }) => {
                      const snap = await getDoc(doc(db, "companies", company.uid));
                      if (snap.exists()) setProfile(snap.data());
                   });
                   toast.success("Document trimis cu succes!");
                }} 
              />
            )}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
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
                <p className="mt-4 text-lg font-semibold text-gray-700">Încă nu ai recenzii</p>
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
          <Transition appear show={showRequestReview} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => !sendingReview && setShowRequestReview(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                      {/* Header */}
                      <div className="relative bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-5">
                        <button
                          onClick={() => setShowRequestReview(false)}
                          disabled={sendingReview}
                          className="absolute right-4 top-4 rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                            <StarIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <Dialog.Title className="text-lg font-bold text-white">
                              Cere Review de la Client
                            </Dialog.Title>
                            <p className="text-sm text-emerald-100">
                              Crește-ți reputația cu recenzii autentice
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                              Nume Client
                            </label>
                            <input
                              type="text"
                              value={reviewCustomerName}
                              onChange={(e) => setReviewCustomerName(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="Ex: Ion Popescu"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                              Email Client
                            </label>
                            <input
                              type="email"
                              value={reviewEmail}
                              onChange={(e) => setReviewEmail(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              placeholder="Ex: client@email.com"
                            />
                          </div>

                          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                              <EnvelopeIcon className="h-4 w-4 text-emerald-600" />
                            </div>
                            <p className="text-sm text-emerald-800">
                              Clientul va primi un email personalizat cu un link pentru a lăsa o recenzie despre serviciile tale.
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={async () => {
                              if (!reviewEmail || !reviewCustomerName) {
                                toast.error("Te rugăm să completezi toate câmpurile");
                                return;
                              }

                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (!emailRegex.test(reviewEmail)) {
                                toast.error("Adresa de email nu este validă");
                                return;
                              }

                              setSendingReview(true);
                              try {
                                const response = await fetch('/api/send-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    type: 'reviewRequest',
                                    data: {
                                      customerEmail: reviewEmail,
                                      customerName: reviewCustomerName,
                                      companyName: profile?.companyName || "Compania noastră",
                                      reviewUrl: `${window.location.origin}/reviews/new?company=${auth.currentUser?.uid}`,
                                    },
                                  }),
                                });
                                if (!response.ok) {
                                  const err = await response.json();
                                  throw new Error(err.error || 'Email sending failed');
                                }

                                toast.success(`✅ Email trimis către ${reviewCustomerName}`);
                                setShowRequestReview(false);
                                setReviewEmail("");
                                setReviewCustomerName("");
                              } catch (error) {
                                logger.error("Error sending review request:", error);
                                toast.error("A apărut o eroare. Te rugăm să încerci din nou.");
                              } finally {
                                setSendingReview(false);
                              }
                            }}
                            disabled={sendingReview || !reviewEmail || !reviewCustomerName}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {sendingReview ? (
                              <>
                                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Se trimite...
                              </>
                            ) : (
                              <>
                                <EnvelopeIcon className="h-5 w-5" />
                                Trimite Cerere
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowRequestReview(false);
                              setReviewEmail("");
                              setReviewCustomerName("");
                            }}
                            disabled={sendingReview}
                            className="rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                          >
                            Anulează
                          </button>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}


