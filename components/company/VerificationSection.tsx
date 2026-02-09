"use client";

import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/services/firebase";
import { uploadUserFile } from "@/utils/firebaseHelpers";
import { logger } from "@/utils/logger";
import {
  CheckBadgeIcon as Verified,
  ClockIcon as Pending,
  ExclamationTriangleIcon as Alert,
  DocumentArrowUpIcon as UploadIcon,
  XCircleIcon as Rejected,
} from "@heroicons/react/24/outline";

type Props = {
  company: any; // Firestore document data
  onUpdate: () => void;
};

export default function VerificationSection({ company, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = company?.verificationStatus || "unverified"; // unverified | pending | verified | rejected
  const hasDocument = !!company?.verificationDocUrl;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Fișierul este prea mare (max 5MB).");
      return;
    }

    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setError("Format invalid. Te rugăm să încarci PDF, JPG sau PNG.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not authenticated");

      // 1. Upload File
      const downloadUrl = await uploadUserFile(
        currentUser,
        file,
        `verification/CUI_${Date.now()}_${file.name}`,
      );

      // 2. Update Profile
      const companyRef = doc(db, "companies", currentUser.uid);
      await updateDoc(companyRef, {
        verificationStatus: "pending",
        verificationDocUrl: downloadUrl,
        verificationDocName: file.name,
        verificationSubmittedAt: serverTimestamp(),
        rejectionReason: null, // Clear previous rejection reason
      });

      onUpdate();
    } catch (err) {
      logger.error("[VerificationSection] Upload error:", err);
      setError("A apărut o eroare la încărcare. Te rugăm să încerci din nou.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Verificare Companie
          </h3>
          <p className="text-sm text-gray-600">
            Pentru a câștiga încrederea clienților, încarcă certificatul de
            înregistrare (CUI).
          </p>
        </div>
        <div className="shrink-0">
          {status === "verified" && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
              <Verified className="h-5 w-5" /> Verificat
            </span>
          )}
          {status === "pending" && hasDocument && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
              <Pending className="h-5 w-5" /> În curs
            </span>
          )}
          {(status === "unverified" ||
            (status === "pending" && !hasDocument)) && (
            <span className="flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
              <Rejected className="h-5 w-5" /> Respins
            </span>
          )}
          {status === "unverified" && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
              Neverificat
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        {status === "verified" ? (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
            <Verified className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">
                Felicitări! Contul tău este verificat.
              </p>
              <p className="text-sm text-emerald-700">
                Acum poți trimite oferte nelimitate clienților.
              </p>
            </div>
          </div>
        ) : status === "pending" && hasDocument ? (
          <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
            <Pending className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">
                Document trimis spre verificare.
              </p>
              <p className="text-sm text-amber-700">
                Un administrator va analiza documentul în scurt timp.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {status === "rejected" && company.rejectionReason && (
              <div className="mb-4 flex items-start gap-3 rounded-xl bg-rose-50 p-4">
                <Alert className="h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-semibold text-rose-900">
                    Documentul a fost respins
                  </p>
                  <p className="text-sm text-rose-700">
                    Motiv: {company.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-6 text-center border-2 border-dashed border-slate-300 transition-all hover:bg-slate-100 hover:border-emerald-400">
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="doc-upload" className="cursor-pointer">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                    <span className="text-sm font-medium text-slate-600">
                      Se încarcă...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadIcon className="mb-3 h-10 w-10 text-slate-400" />
                    <span className="text-base font-semibold text-slate-700">
                      Încarcă Certificatul (CUI)
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      PDF, JPG sau PNG (max 5MB)
                    </span>
                    <span className="mt-4 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                      Alege fișier
                    </span>
                  </div>
                )}
              </label>
            </div>
            {error && (
              <p className="text-center text-sm font-medium text-rose-600">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
