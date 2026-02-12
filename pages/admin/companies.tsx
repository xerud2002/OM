import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { logger } from "@/utils/logger";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import {
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";

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
  averageRating?: number;
  totalReviews?: number;
  creditBalance?: number;
}

function fmtDate(ts: any) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  return format(d, "d MMM yyyy", { locale: ro });
}

export default function AdminCompanies() {
  const { dashboardUser } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending" | "rejected">("all");

  useEffect(() => {
    const q = query(collection(db, "companies"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Company));
      setCompanies(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = statusFilter === "all" ? companies : companies.filter((c) => {
    if (statusFilter === "verified") return c.verificationStatus === "verified" || c.verified;
    return c.verificationStatus === statusFilter;
  });

  const handleVerify = async (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    if (!window.confirm("Marchează ca verificat?")) return;
    try {
      await updateDoc(doc(db, "companies", companyId), {
        verificationStatus: "verified",
        verified: true,
        verifiedAt: serverTimestamp(),
      });
      try {
        const companySnap = await getDoc(doc(db, "companies", companyId));
        const data = companySnap.data();
        if (!data?.totalReviews || data.totalReviews === 0) {
          await addDoc(collection(db, "reviews"), {
            companyId,
            requestId: null,
            customerName: "Echipa Ofertemutare",
            customerId: "system",
            rating: 5,
            comment: "Vă mulțumim că v-ați înscris pe platforma noastră! Vă urăm mult succes și spor la câștiguri! 🚚",
            createdAt: serverTimestamp(),
            status: "published",
            isWelcomeReview: true,
          });
          await updateDoc(doc(db, "companies", companyId), { averageRating: 5.0, totalReviews: 1 });
        }
      } catch (reviewErr) {
        logger.warn("Could not create welcome review:", reviewErr);
      }
    } catch (err) {
      logger.error("Failed to verify", err);
      alert("Eroare la verificare");
    }
  };

  const columns: Column<Company>[] = [
    {
      key: "companyName",
      label: "Companie",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
            {(c.companyName || c.displayName || "C").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{c.companyName || c.displayName || "—"}</p>
            {c.cif && <p className="text-xs text-gray-400 font-mono">CIF: {c.cif}</p>}
          </div>
        </div>
      ),
      getValue: (c) => c.companyName || c.displayName || "",
    },
    { key: "email", label: "Email", sortable: true },
    { key: "city", label: "Oraș", sortable: true, render: (c) => <span>{c.city || "—"}</span> },
    {
      key: "verificationStatus",
      label: "Status",
      sortable: true,
      render: (c) => {
        const v = c.verificationStatus === "verified" || c.verified;
        const p = c.verificationStatus === "pending";
        return (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${v ? "bg-green-100 text-green-700" : p ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>
            {v ? "✓ Verificată" : p ? "⏳ Pending" : c.verificationStatus || "—"}
          </span>
        );
      },
      getValue: (c) => c.verificationStatus === "verified" || c.verified ? "verified" : c.verificationStatus || "none",
    },
    {
      key: "averageRating",
      label: "Rating",
      sortable: true,
      render: (c) => <span className="font-medium">{c.averageRating ? `⭐ ${c.averageRating.toFixed(1)}` : "—"}</span>,
    },
    {
      key: "createdAt",
      label: "Înregistrat",
      sortable: true,
      render: (c) => <span className="text-gray-500">{fmtDate(c.createdAt)}</span>,
      getValue: (c) => c.createdAt?.toDate ? c.createdAt.toDate().getTime() : c.createdAt?._seconds ? c.createdAt._seconds * 1000 : 0,
    },
    {
      key: "actions" as any,
      label: "Acțiuni",
      render: (c) => (
        <div className="flex items-center gap-2">
          <button onClick={() => router.push(`/admin/companies/${c.id}`)} className="rounded-lg p-1.5 text-gray-400 hover:bg-purple-50 hover:text-purple-600" title="Detalii">
            <EyeIcon className="h-4 w-4" />
          </button>
          {!(c.verificationStatus === "verified" || c.verified) && (
            <button onClick={(e) => handleVerify(e, c.id)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700">
              <CheckCircleIcon className="h-3.5 w-3.5" /> Verifică
            </button>
          )}
        </div>
      ),
    },
  ];

  const statusTabs = [
    { key: "all", label: "Toate", count: companies.length },
    { key: "verified", label: "Verificate", count: companies.filter((c) => c.verificationStatus === "verified" || c.verified).length },
    { key: "pending", label: "Pending", count: companies.filter((c) => c.verificationStatus === "pending").length },
    { key: "rejected", label: "Respinse", count: companies.filter((c) => c.verificationStatus === "rejected").length },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companii</h1>
              <p className="text-gray-500">Gestionează companiile de mutări</p>
            </div>
            <ExportButton data={filtered} filename="companii" />
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            {statusTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key as any)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${statusFilter === t.key ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable
              data={filtered}
              columns={columns}
              searchPlaceholder="Caută companii..."
              onRowClick={(c) => router.push(`/admin/companies/${c.id}`)}
            />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}


