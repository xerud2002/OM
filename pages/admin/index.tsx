import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, getCountFromServer, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  
  // Stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [verifiedCompanies, setVerifiedCompanies] = useState(0);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Count customers
        const customersQ = query(collection(db, "customers"));
        const customersSnap = await getCountFromServer(customersQ);
        setTotalUsers(customersSnap.data().count);

        // Count companies
        const companiesQ = query(collection(db, "companies"));
        const companiesSnap = await getCountFromServer(companiesQ);
        setTotalCompanies(companiesSnap.data().count);

        // Count verified companies
        const verifiedQ = query(collection(db, "companies"), where("verificationStatus", "==", "verified"));
        const verifiedSnap = await getCountFromServer(verifiedQ);
        setVerifiedCompanies(verifiedSnap.data().count);

        // Count requests
        const requestsQ = query(collection(db, "requests"));
        const requestsSnap = await getCountFromServer(requestsQ);
        setTotalRequests(requestsSnap.data().count);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    loadStats();
  }, []);

  // Listen for pending verifications
  useEffect(() => {
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
        verified: true,
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
      <DashboardLayout
        role="admin"
        user={user}
      >
        <div className="space-y-8">
          {/* Quick stats cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                label: "Total Utilizatori", 
                value: totalUsers, 
                icon: UsersIcon,
                color: "bg-blue-500",
                bgLight: "bg-blue-50"
              },
              { 
                label: "Total Companii", 
                value: totalCompanies, 
                icon: BuildingOfficeIcon,
                color: "bg-purple-500",
                bgLight: "bg-purple-50"
              },
              { 
                label: "Companii Verificate", 
                value: verifiedCompanies, 
                icon: CheckCircleSolid,
                color: "bg-emerald-500",
                bgLight: "bg-emerald-50"
              },
              { 
                label: "Cereri Active", 
                value: totalRequests, 
                icon: DocumentDuplicateIcon,
                color: "bg-amber-500",
                bgLight: "bg-amber-50"
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl ${stat.bgLight} p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pending Verifications Section */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Verificări în Așteptare</h2>
                  <p className="text-sm text-gray-500">Companiile care așteaptă aprobare</p>
                </div>
              </div>
              {pendingCompanies.length > 0 && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                  {pendingCompanies.length} {pendingCompanies.length === 1 ? "cerere" : "cereri"}
                </span>
              )}
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                </div>
              ) : pendingCompanies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                    <CheckCircleSolid className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Totul e la zi!</p>
                  <p className="mt-1 text-sm text-gray-500">Nu există cereri de verificare în așteptare</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCompanies.map((company, i) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      {/* Company Header */}
                      <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-500 text-lg font-bold text-white shadow">
                            {(company.companyName || company.displayName || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {company.companyName || company.displayName || "Companie"}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              <span>{company.email}</span>
                              {company.cif && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-gray-700">{company.cif}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <span>Trimis pe </span>
                          <span className="font-medium text-gray-700">
                            {company.verificationSubmittedAt?.toDate
                              ? format(company.verificationSubmittedAt.toDate(), "d MMM yyyy, HH:mm", { locale: ro })
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Document & Actions */}
                      <div className="p-4">
                        {/* Document link */}
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                          <div className="flex-1">
                            <p className="font-medium text-blue-900">
                              {company.verificationDocName || "Document verificare"}
                            </p>
                          </div>
                          <a
                            href={company.verificationDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50"
                          >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            Vezi document
                          </a>
                        </div>

                        {/* Reject form or action buttons */}
                        {rejectingId === company.id ? (
                          <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                            <label className="block text-sm font-semibold text-red-800">
                              Motivul respingerii:
                            </label>
                            <textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Ex: CUI ilizibil, document expirat..."
                              rows={2}
                              className="w-full rounded-lg border border-red-200 p-2.5 text-sm focus:border-red-500 focus:outline-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReject(company.id)}
                                disabled={!!processingId}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                Confirmă Respingerea
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectReason("");
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Anulează
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setRejectingId(company.id)}
                              disabled={!!processingId}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircleIcon className="h-4 w-4" />
                              Respinge
                            </button>
                            <button
                              onClick={() => handleApprove(company.id)}
                              disabled={!!processingId}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                              Aprobă
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}

