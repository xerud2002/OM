import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import RequireRole from "@/components/auth/RequireRole";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { format, formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import LoadingSpinner, { LoadingContainer } from "@/components/ui/LoadingSpinner";
import {
  DocumentPlusIcon,
  InboxStackIcon,
  StarIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface ActivityEvent {
  id: string;
  type: string;
  data: any;
  ts: Date;
}

const iconMap: Record<string, any> = {
  request: DocumentPlusIcon,
  offer: InboxStackIcon,
  review: StarIcon,
  company: BuildingOfficeIcon,
  customer: UserPlusIcon,
  verification: ShieldCheckIcon,
};

const colorMap: Record<string, string> = {
  request: "bg-blue-100 text-blue-600",
  offer: "bg-purple-100 text-purple-600",
  review: "bg-yellow-100 text-yellow-600",
  company: "bg-pink-100 text-pink-600",
  customer: "bg-green-100 text-green-600",
  verification: "bg-emerald-100 text-emerald-600",
};

function getLabel(e: ActivityEvent) {
  switch (e.type) {
    case "request": return `Cerere nouă de la ${e.data.customerName || "client"} - ${e.data.from || ""} → ${e.data.to || ""}`;
    case "offer": return `Ofertă nouă de la ${e.data.companyName || "companie"} - ${e.data.price ? `${e.data.price} RON` : ""}`;
    case "review": return `Recenzie ${e.data.rating}⭐ de la ${e.data.customerName || "anonim"}`;
    case "company": return `Companie nouă: ${e.data.companyName || e.data.displayName || "-"}`;
    case "customer": return `Client nou: ${e.data.displayName || e.data.email || "-"}`;
    case "verification": return `Verificare: ${e.data.companyName || "companie"} - ${e.data.verificationStatus}`;
    default: return `Eveniment: ${e.type}`;
  }
}

export default function AdminActivity() {
  const { dashboardUser } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Listen to recent requests
    const qReqs = query(collection(db, "requests"), orderBy("createdAt", "desc"), limit(20));
    unsubs.push(onSnapshot(qReqs, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        const ts = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        return { id: `req-${d.id}`, type: "request", data, ts } as ActivityEvent;
      });
      setEvents((prev) => mergeEvents(prev.filter((e) => e.type !== "request"), items));
      setLoading(false);
    }));

    // Listen to recent offers
    const qOffers = query(collection(db, "offers"), orderBy("createdAt", "desc"), limit(20));
    unsubs.push(onSnapshot(qOffers, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        const ts = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        return { id: `off-${d.id}`, type: "offer", data, ts } as ActivityEvent;
      });
      setEvents((prev) => mergeEvents(prev.filter((e) => e.type !== "offer"), items));
    }));

    // Listen to recent reviews
    const qReviews = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(10));
    unsubs.push(onSnapshot(qReviews, (snap) => {
      const items = snap.docs.map((d) => {
        const data = d.data();
        const ts = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        return { id: `rev-${d.id}`, type: "review", data, ts } as ActivityEvent;
      });
      setEvents((prev) => mergeEvents(prev.filter((e) => e.type !== "review"), items));
    }));

    return () => unsubs.forEach((u) => u());
  }, []);

  function mergeEvents(existing: ActivityEvent[], newItems: ActivityEvent[]) {
    const all = [...existing, ...newItems];
    const unique = Array.from(new Map(all.map((e) => [e.id, e])).values());
    return unique.sort((a, b) => b.ts.getTime() - a.ts.getTime()).slice(0, 50);
  }

  return (
    <RequireRole allowedRole="admin">
      <DashboardLayout role="admin" user={dashboardUser}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activitate în timp real</h1>
            <p className="text-gray-500">Feed live cu ultimele evenimente din platformă</p>
          </div>

          {loading ? (
            <LoadingContainer><LoadingSpinner size="lg" color="purple" /></LoadingContainer>
          ) : events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-400">
              Niciun eveniment recent
            </div>
          ) : (
            <div className="space-y-1">
              {events.map((e) => {
                const Icon = iconMap[e.type] || DocumentPlusIcon;
                const color = colorMap[e.type] || "bg-gray-100 text-gray-600";
                return (
                  <div key={e.id} className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{getLabel(e)}</p>
                      <p className="text-xs text-gray-400">{formatDistanceToNow(e.ts, { addSuffix: true, locale: ro })} · {format(e.ts, "d MMM yyyy, HH:mm", { locale: ro })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
