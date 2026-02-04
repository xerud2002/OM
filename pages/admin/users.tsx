import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onAuthChange } from "@/utils/firebaseHelpers";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  EnvelopeIcon,
  CalendarIcon,
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
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "customers"), orderBy("createdAt", "desc"));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Customer));
      setCustomers(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const searchLower = search.toLowerCase();
    return (
      c.email?.toLowerCase().includes(searchLower) ||
      c.displayName?.toLowerCase().includes(searchLower) ||
      c.phone?.includes(search)
    );
  });

  const handleDelete = async (customerId: string) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest utilizator?")) return;
    try {
      await deleteDoc(doc(db, "customers", customerId));
    } catch (err) {
      console.error("Failed to delete customer", err);
      alert("Eroare la ștergere");
    }
  };

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={user}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Utilizatori</h1>
              <p className="text-gray-500">Gestionează utilizatorii platformei</p>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Caută utilizatori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <UserIcon className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">
                  {search ? "Nu s-au găsit utilizatori" : "Nu există utilizatori înregistrați"}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Utilizator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Înregistrat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                            {(customer.displayName || customer.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {customer.displayName || "Fără nume"}
                            </p>
                            <p className="text-sm text-gray-500">{customer.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <EnvelopeIcon className="h-4 w-4" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4" />
                          {customer.createdAt?.toDate
                            ? format(customer.createdAt.toDate(), "d MMM yyyy", { locale: ro })
                            : "N/A"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Șterge"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Count */}
          <p className="text-sm text-gray-500">
            Total: {filteredCustomers.length} utilizatori
          </p>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}

