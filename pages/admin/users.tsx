import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { useRouter } from "next/router";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import {
  TrashIcon,
  EyeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface Customer {
  id: string;
  email: string;
  displayName?: string;
  phone?: string;
  createdAt?: any;
}

export default function AdminUsers() {
  const { dashboardUser } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Customer)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (customerId: string) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest utilizator?")) return;
    try {
      await deleteDoc(doc(db, "customers", customerId));
    } catch (err) {
      logger.error("Failed to delete customer", err);
      alert("Eroare la ștergere");
    }
  };

  const columns: Column<Customer>[] = [
    {
      key: "displayName",
      label: "Utilizator",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {(row.displayName || row.email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.displayName || "Fără nume"}</p>
            <p className="text-xs text-gray-400">{row.id.slice(0, 8)}...</p>
          </div>
        </div>
      ),
    },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Telefon", render: (row) => <span className="text-gray-600">{row.phone || "—"}</span> },
    {
      key: "createdAt",
      label: "Înregistrat",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-500">
          {row.createdAt?.toDate ? format(row.createdAt.toDate(), "d MMM yyyy", { locale: ro }) : "N/A"}
        </span>
      ),
      getValue: (row) => row.createdAt?.toDate?.()?.getTime() || 0,
    },
    {
      key: "actions",
      label: "Acțiuni",
      width: "100px",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => router.push(`/admin/users/${row.id}`)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50" title="Vezi profil">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" title="Șterge">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Utilizatori</h1>
              <p className="text-gray-500">{customers.length} utilizatori înregistrați</p>
            </div>
            <ExportButton data={customers.map((c) => ({ id: c.id, email: c.email, name: c.displayName || "", phone: c.phone || "" }))} filename="utilizatori" />
          </div>

          <DataTable
            data={customers}
            columns={columns}
            searchKeys={["email", "displayName", "phone"]}
            searchPlaceholder="Caută utilizatori..."
            loading={loading}
            emptyIcon={UserIcon}
            emptyMessage="Nu există utilizatori"
            onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
            pageSize={20}
          />
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}

