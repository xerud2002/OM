"use client";

export default function ActivityList({ offers }: { offers: any[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Activitate recentă</h3>
      <ul className="space-y-3">
        {offers.slice(0, 6).map((o) => {
          const ts: any = (o.createdAt as any) || null;
          const d: Date | null = ts?.toDate ? ts.toDate() : (typeof ts === "number" ? new Date(ts) : null);
          return (
            <li key={o.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{o.requestCode ? o.requestCode : (o.requestId ? `REQ-${String(o.requestId).slice(0, 6).toUpperCase()}` : "—")}</p>
                <p className="text-xs text-gray-500">{d ? d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" }) : "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                {typeof o.price === "number" && (
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{new Intl.NumberFormat("ro-RO").format(o.price)} lei</span>
                )}
                <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                  o.status === "accepted"
                    ? "bg-emerald-100 text-emerald-700"
                    : o.status === "rejected" || o.status === "declined"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-700"
                }`}>
                  {o.status ?? "pending"}
                </span>
              </div>
            </li>
          );
        })}
        {offers.length === 0 && (
          <li className="text-sm text-gray-500">Nu există activitate recentă.</li>
        )}
      </ul>
    </div>
  );
}
