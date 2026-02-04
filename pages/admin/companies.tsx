import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

interface Company {
  id: string;
  companyName?: string;
  displayName?: string;
  email: string;
  phone?: string;
  city?: string;
  cif?: string;
  verificationStatus?: "pending" | "verified" | "rejected" | "none";
  verified?: boolean;
  createdAt?: any;
}

export default function AdminCompanies() {
  const [user, setUser] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending" | "rejected">("all");

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "companies"), orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Company));
      setCompanies(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      c.companyName?.toLowerCase().includes(searchLower) ||
      c.displayName?.toLowerCase().includes(searchLower) ||
      c.email?.toLowerCase().includes(searchLower) ||
      c.cif?.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && c.verificationStatus === "verified") ||
      (statusFilter === "pending" && c.verificationStatus === "pending") ||
      (statusFilter === "rejected" && c.verificationStatus === "rejected");

    return matchesSearch && matchesStatus;
  });

  const handleVerify = async (companyId: string) => {
    if (!window.confirm("Marchează ca verificat?")) return;
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "verified",
        verified: true,
        verifiedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to verify", err);
      alert("Eroare la verificare");
    }
  };

  const handleUnverify = async (companyId: string) => {
    if (!window.confirm("Anulează verificarea?")) return;
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "none",
        verified: false,
        verifiedAt: null,
      });
    } catch (err) {
      console.error("Failed to unverify", err);
      alert("Eroare");
    }
  };

  const getStatusBadge = (company: Company) => {
    if (company.verificationStatus === "verified" || company.verified) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckBadgeIcon className="h-4 w-4" />
          Verificat
        </span>
      );
    }
    if (company.verificationStatus === "pending") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <ClockIcon className="h-4 w-4" />
          În așteptare
        </span>
      );
    }
    if (company.verificationStatus === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
          <XCircleIcon className="h-4 w-4" />
          Respins
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
        Neverificat
      </span>
    );
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={user}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companii</h1>
              <p className="text-gray-500">Gestionează companiile de mutări</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="all">Toate</option>
                <option value="verified">Verificate</option>
                <option value="pending">În așteptare</option>
                <option value="rejected">Respinse</option>
              </select>
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Caută companii..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">
                {search || statusFilter !== "all" ? "Nu s-au găsit companii" : "Nu există companii înregistrate"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-pink-500 text-lg font-bold text-white">
                        {(company.companyName || company.displayName || "C").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {company.companyName || company.displayName || "Companie"}
                        </h3>
                        {company.cif && (
                          <p className="text-xs font-mono text-gray-500">CIF: {company.cif}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(company)}
                  </div>

                  {/* Contact info */}
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      {company.email}
                    </div>
                    {company.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <PhoneIcon className="h-4 w-4 text-gray-400" />
                        {company.phone}
                      </div>
                    )}
                    {company.city && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                        {company.city}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">
                      {company.createdAt?.toDate
                        ? format(company.createdAt.toDate(), "d MMM yyyy", { locale: ro })
                        : "N/A"}
                    </span>
                    <div className="flex gap-2">
                      {company.verificationStatus === "verified" || company.verified ? (
                        <button
                          onClick={() => handleUnverify(company.id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Anulează
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(company.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Verifică
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Count */}
          <p className="text-sm text-gray-500">
            Total: {filteredCompanies.length} companii
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}

