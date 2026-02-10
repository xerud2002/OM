import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RequireRole from "@/components/auth/RequireRole";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { auth, db, storage } from "@/services/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { logger } from "@/utils/logger";
import Image from "next/image";
import {
  DocumentTextIcon,
  DocumentPlusIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CameraIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Cererile Mele", href: "/customer/dashboard", icon: DocumentTextIcon },
  { name: "Cerere Nouă", href: "/customer/cerere-noua", icon: DocumentPlusIcon },
  { name: "Setări", href: "/customer/settings", icon: Cog6ToothIcon },
];

export default function CustomerSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    phone: "",
    city: "",
  });
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    emailOnNewOffer: true,
    emailOnNewMessage: true,
  });

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Toast helper
  const showToast = async (message: string, type: "success" | "error" = "success") => {
    const { toast } = await import("sonner");
    if (type === "success") { toast.success(message); } else { toast.error(message); }
  };

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (!u) { setLoading(false); return; }

      // Check if user uses email/password auth
      setIsEmailUser(u.providerData?.some((p: any) => p.providerId === "password") || false);
      setPhotoURL(u.photoURL || null);

      const customerRef = doc(db, "customers", u.uid);
      const snap = await getDoc(customerRef);
      const data = snap.data() as any;
      setForm({
        displayName: u.displayName || data?.displayName || "",
        phone: data?.phone || "",
        city: data?.city || "",
      });
      if (data?.notificationPreferences) {
        setNotifPrefs({
          emailOnNewOffer: data.notificationPreferences.emailOnNewOffer ?? true,
          emailOnNewMessage: data.notificationPreferences.emailOnNewMessage ?? true,
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Save profile
  const onSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const customerRef = doc(db, "customers", user.uid);
      await updateDoc(customerRef, {
        displayName: form.displayName,
        phone: form.phone,
        city: form.city,
        updatedAt: serverTimestamp(),
      });
      // Also update Firebase Auth displayName
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: form.displayName });
      }
      await showToast("Profilul a fost salvat!");
    } catch (err) {
      logger.error("Save profile error:", err);
      await showToast("Eroare la salvare", "error");
    } finally {
      setSaving(false);
    }
  };

  // Upload photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      await showToast("Imaginea trebuie să fie mai mică de 2MB", "error");
      return;
    }
    setUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `customers/${user.uid}/avatar`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
      }
      await updateDoc(doc(db, "customers", user.uid), {
        photoURL: url,
        updatedAt: serverTimestamp(),
      });
      setPhotoURL(url);
      await showToast("Fotografia a fost actualizată!");
    } catch (err) {
      logger.error("Photo upload error:", err);
      await showToast("Eroare la încărcarea fotografiei", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Toggle notification preference
  const toggleNotifPref = async (key: keyof typeof notifPrefs, value: boolean) => {
    if (!user) return;
    const updated = { ...notifPrefs, [key]: value };
    setNotifPrefs(updated);
    try {
      await updateDoc(doc(db, "customers", user.uid), {
        notificationPreferences: updated,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      logger.error("Notification pref error:", err);
      setNotifPrefs(notifPrefs); // revert
      await showToast("Eroare la salvarea preferinței", "error");
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !isEmailUser) return;
    if (passwordForm.newPassword.length < 6) {
      await showToast("Parola trebuie să aibă minim 6 caractere", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      await showToast("Parolele nu se potrivesc", "error");
      return;
    }
    setChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        passwordForm.currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      await showToast("Parola a fost schimbată cu succes!");
    } catch (err: any) {
      logger.error("Password change error:", err);
      if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") {
        await showToast("Parola curentă este incorectă", "error");
      } else {
        await showToast("Eroare la schimbarea parolei", "error");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    setDeletingAccount(true);
    try {
      if (isEmailUser && deletePassword) {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email!,
          deletePassword,
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      }
      await deleteUser(auth.currentUser);
      window.location.href = "/";
    } catch (err: any) {
      logger.error("Delete account error:", err);
      if (err?.code === "auth/wrong-password" || err?.code === "auth/invalid-credential") {
        await showToast("Parola este incorectă", "error");
      } else if (err?.code === "auth/requires-recent-login") {
        await showToast("Reautentifică-te și încearcă din nou", "error");
      } else {
        await showToast("Eroare la ștergerea contului", "error");
      }
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  return (
    <RequireRole allowedRole="customer">
      <DashboardLayout role="customer" user={user} navigation={navigation}>
        <section className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-10">
          <h1 className="text-2xl font-bold text-slate-900">
            Setări{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              profil
            </span>
          </h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>
          ) : (
            <>
              {/* ═══ SECTION: Profile Info ═══ */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                    <UserCircleIcon className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Informații profil</h2>
                    <p className="text-xs text-gray-500">Datele tale personale</p>
                  </div>
                </div>
                <form onSubmit={onSubmitProfile} className="space-y-4 p-5">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {photoURL ? (
                        <Image src={photoURL} alt="Avatar" width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-2 ring-emerald-200" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-600 ring-2 ring-emerald-200">
                          {form.displayName?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="absolute -bottom-1 -right-1 rounded-full bg-emerald-600 p-1.5 text-white shadow-lg transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CameraIcon className="h-3.5 w-3.5" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{form.displayName || "Utilizator"}</p>
                      <p className="text-gray-500">{user?.email}</p>
                      {uploadingPhoto && <p className="text-xs text-emerald-600">Se încarcă...</p>}
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Email</label>
                    <input
                      value={user?.email || ""}
                      disabled
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Display name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Nume afișat</label>
                    <input
                      value={form.displayName}
                      onChange={(e) => setForm((s) => ({ ...s, displayName: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      placeholder="Numele tău"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Telefon</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      placeholder="07xx xxx xxx"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Oraș</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      placeholder="București"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60"
                  >
                    {saving ? "Se salvează…" : "Salvează profilul"}
                  </button>
                </form>
              </div>

              {/* ═══ SECTION: Notification Preferences ═══ */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                    <BellIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Notificări</h2>
                    <p className="text-xs text-gray-500">Preferințe pentru notificări email</p>
                  </div>
                </div>
                <div className="divide-y divide-gray-100 p-5">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Ofertă nouă</p>
                      <p className="text-xs text-gray-500">Primește email când primești o ofertă nouă</p>
                    </div>
                    <ToggleSwitch
                      checked={notifPrefs.emailOnNewOffer}
                      onChange={(v) => toggleNotifPref("emailOnNewOffer", v)}
                      color="emerald"
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Mesaj nou</p>
                      <p className="text-xs text-gray-500">Primește email când o firmă îți trimite un mesaj</p>
                    </div>
                    <ToggleSwitch
                      checked={notifPrefs.emailOnNewMessage}
                      onChange={(v) => toggleNotifPref("emailOnNewMessage", v)}
                      color="emerald"
                    />
                  </div>
                </div>
              </div>

              {/* ═══ SECTION: Security ═══ */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                    <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Securitate</h2>
                    <p className="text-xs text-gray-500">Parola și contul tău</p>
                  </div>
                </div>
                <div className="space-y-6 p-5">
                  {/* Change password (only for email/password users) */}
                  {isEmailUser ? (
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">Schimbă parola</h3>
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-600">Parola curentă</label>
                        <div className="relative mt-1">
                          <input
                            type={showCurrentPw ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm((s) => ({ ...s, currentPassword: e.target.value }))}
                            className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(!showCurrentPw)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPw ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-600">Parola nouă</label>
                        <div className="relative mt-1">
                          <input
                            type={showNewPw ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm((s) => ({ ...s, newPassword: e.target.value }))}
                            className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                            minLength={6}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw(!showNewPw)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPw ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Confirmă parola nouă</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm((s) => ({ ...s, confirmPassword: e.target.value }))}
                          className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                          minLength={6}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60"
                      >
                        {changingPassword ? "Se schimbă…" : "Schimbă parola"}
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <p className="text-sm text-gray-600">
                        Contul tău folosește autentificarea Google. Parola se gestionează din contul Google.
                      </p>
                    </div>
                  )}

                  {/* Delete account */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-red-600">Zonă periculoasă</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Ștergerea contului este permanentă și nu poate fi anulată. Toate datele vor fi pierdute.
                    </p>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:bg-red-100"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      Șterge contul
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Delete account modal with password input */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Șterge contul</h3>
              <p className="mt-2 text-sm text-gray-600">
                Această acțiune este ireversibilă. Toate datele asociate contului tău vor fi șterse.
              </p>
              {isEmailUser && (
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600">Confirmă cu parola ta</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/20"
                    placeholder="Parola curentă"
                  />
                </div>
              )}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  Anulează
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount || (isEmailUser && !deletePassword)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingAccount ? "Se șterge…" : "Șterge definitiv"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </RequireRole>
  );
}