import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatCard from "@/components/admin/StatCard";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  ChatBubbleLeftRightIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

function fmtDate(ts: any) {
  if (!ts) return "-";
  const d = ts._seconds ? new Date(ts._seconds * 1000) : ts.toDate ? ts.toDate() : new Date(ts);
  return format(d, "d MMM yyyy, HH:mm", { locale: ro });
}

interface Chat {
  id: string;
  companyName: string;
  customerName: string;
  lastMessage: string;
  lastMessageAt: any;
  messageCount: number;
  status: string;
  requestId: string;
}

export default function AdminChats() {
  const { user, dashboardUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, todayActive: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/chats", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) {
          setChats(json.data.chats);
          setStats(json.data.stats);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const columns: Column<Chat>[] = [
    {
      key: "companyName",
      label: "Companie",
      sortable: true,
      render: (c) => <span className="font-medium text-gray-900">{c.companyName || "-"}</span>,
    },
    {
      key: "customerName",
      label: "Client",
      sortable: true,
      render: (c) => <span>{c.customerName || "-"}</span>,
    },
    {
      key: "lastMessage",
      label: "Ultimul mesaj",
      render: (c) => <p className="max-w-xs truncate text-sm text-gray-500">{c.lastMessage || "-"}</p>,
    },
    {
      key: "messageCount",
      label: "Mesaje",
      sortable: true,
      render: (c) => <span className="font-semibold">{c.messageCount}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (c) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {c.status === "active" ? "Activ" : c.status}
        </span>
      ),
    },
    {
      key: "lastMessageAt",
      label: "Ultima activitate",
      sortable: true,
      render: (c) => <span className="text-sm text-gray-500">{fmtDate(c.lastMessageAt)}</span>,
      getValue: (c) => c.lastMessageAt?._seconds || 0,
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitorizare Chat</h1>
              <p className="text-gray-500">Conversații între companii și clienți</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total conversații" value={stats.total} icon={ChatBubbleLeftRightIcon} />
            <StatCard label="Active" value={stats.active} icon={ChatBubbleLeftIcon} />
            <StatCard label="Active azi" value={stats.todayActive} icon={ClockIcon} />
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable data={chats} columns={columns} searchPlaceholder="Caută conversații..." />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
