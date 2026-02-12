import { useEffect, useState } from "react";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import DataTable, { Column } from "@/components/admin/DataTable";
import ExportButton from "@/components/admin/ExportButton";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import { TrophyIcon, StarIcon } from "@heroicons/react/24/outline";

interface RankedCompany {
  id: string;
  companyName: string;
  city: string;
  rating: number;
  reviews: number;
  totalOffers: number;
  acceptedOffers: number;
  acceptanceRate: number;
  verified: boolean;
  score: number;
}

const medals = ["🥇", "🥈", "🥉"];

export default function AdminRankings() {
  const { user, dashboardUser } = useAuth();
  const [rankings, setRankings] = useState<RankedCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/rankings", { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setRankings(json.data.rankings);
      } catch {}
      finally { setLoading(false); }
    })();
  }, [user]);

  const columns: Column<RankedCompany>[] = [
    {
      key: "rank" as any,
      label: "#",
      render: (_: RankedCompany, i: number) => {
        return <span className="text-lg">{i < 3 ? medals[i] : `${i + 1}`}</span>;
      },
    },
    {
      key: "companyName",
      label: "Companie",
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-semibold text-gray-900">{c.companyName}</span>
          {c.verified && <span className="ml-1 text-green-600">✓</span>}
          <p className="text-xs text-gray-400">{c.city}</p>
        </div>
      ),
    },
    {
      key: "score",
      label: "Scor",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500" style={{ width: `${Math.min((c.score / 5) * 100, 100)}%` }} />
          </div>
          <span className="text-sm font-bold text-purple-700">{c.score}</span>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{c.rating ? c.rating.toFixed(1) : "—"}</span>
          <span className="text-xs text-gray-400">({c.reviews})</span>
        </div>
      ),
    },
    {
      key: "acceptanceRate",
      label: "Rată acceptare",
      sortable: true,
      render: (c) => <span className={`font-medium ${c.acceptanceRate >= 50 ? "text-green-600" : c.acceptanceRate > 0 ? "text-yellow-600" : "text-gray-400"}`}>{c.acceptanceRate}%</span>,
    },
    {
      key: "totalOffers",
      label: "Oferte",
      sortable: true,
      render: (c) => <span>{c.totalOffers} <span className="text-xs text-gray-400">({c.acceptedOffers} accept.)</span></span>,
    },
  ];

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clasament Companii</h1>
                <p className="text-gray-500">Scor = Rating(40%) + Acceptare(30%) + Volum(20%) + Verificare(10%)</p>
              </div>
            </div>
            <ExportButton data={rankings} filename="clasament" />
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : (
            <DataTable data={rankings} columns={columns} searchPlaceholder="Caută companie..." />
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
