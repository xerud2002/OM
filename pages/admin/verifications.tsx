import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default function AdminVerifications() {
  const [user, setUser] = useState<any>(null);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    // Listen for pending verifications
    const q = query(
      collection(db, "companies"),
      where("verificationStatus", "==", "pending"),
      orderBy("verificationSubmittedAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const companies = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPendingCompanies(companies);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleApprove = async (companyId: string) => {
    if (!window.confirm("Confirm aprovare?")) return;
    setProcessingId(companyId);
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "verified",
        verified: true, // Legacy flag
        verifiedAt: serverTimestamp(),
        rejectionReason: null
      });
    } catch (e) {
      console.error(e);
      alert("Eroare la aprovare");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (companyId: string) => {
    if (!rejectReason.trim()) {
      alert("Introduceți motivul respingerii");
      return;
    }
    setProcessingId(companyId);
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "rejected",
        verified: false,
        rejectionReason: rejectReason,
        rejectedAt: serverTimestamp()
      });
      setRejectingId(null);
      setRejectReason("");
    } catch (e) {
      console.error(e);
      alert("Eroare la respingere");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={user}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verificări Documente</h1>
              <p className="text-gray-500">Gestionează cererile de verificare ale companiilor</p>
            </div>
            <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200">
              <span className="font-bold text-emerald-600">{pendingCompanies.length}</span> cereri în așteptare
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
          ) : pendingCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-20">
              <CheckCircleIcon className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-600">Nu există cereri în așteptare</p>
              <p className="text-gray-400">Toate companiile sunt la zi</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {pendingCompanies.map((company) => (
                <div key={company.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col border-b border-gray-100 bg-gray-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow">
                        {(company.companyName || company.displayName || "C").substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{company.companyName || company.displayName || "Companie Fără Nume"}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <a href={`mailto:${company.email}`} className="hover:text-purple-600 hover:underline">{company.email}</a>
                          <span>•</span>
                          <span>{company.phone || "Fără telefon"}</span>
                          {company.cif && (
                            <>
                              <span>•</span>
                              <span className="font-mono font-medium text-gray-700">{company.cif}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 sm:mt-0 sm:text-right">
                      <p>Trimis pe:</p>
                      <p className="font-medium text-gray-700">
                        {company.verificationSubmittedAt?.toDate
                          ? format(company.verificationSubmittedAt.toDate(), "d MMM yyyy, HH:mm", { locale: ro })
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-6 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900">Document Atașat</p>
                        <p className="text-sm text-blue-700">{company.verificationDocName || "Document.pdf"}</p>
                      </div>
                      <a
                        href={company.verificationDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4" />
                        Vizualizează
                      </a>
                    </div>

                    {rejectingId === company.id ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <label className="mb-2 block text-sm font-semibold text-red-800">Motivul respingerii:</label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full rounded-lg border border-red-200 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                          placeholder="Ex: CUI ilizibil, document expirat..."
                          rows={2}
                        />
                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={() => handleReject(company.id)}
                            disabled={!!processingId}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Confirmă Respingerea
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason("");
                            }}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                          >
                            Anulează
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setRejectingId(company.id)}
                          disabled={!!processingId}
                          className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircleIcon className="h-5 w-5" />
                          Respinge
                        </button>
                        <button
                          onClick={() => handleApprove(company.id)}
                          disabled={!!processingId}
                          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 hover:shadow-emerald-500/30 disabled:opacity-50"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          Aprobă Documentele
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}


