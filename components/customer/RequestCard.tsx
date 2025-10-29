import React from "react";
import OfferItem from "@/components/customer/OfferItem";

type Offer = {
  id?: string;
  companyName?: string;
  price?: number;
  message?: string;
};

type Request = {
  id?: string;
  fromCity?: string;
  toCity?: string;
  moveDate?: string;
  details?: string;
  rooms?: number | string;
  volumeM3?: number;
  budgetEstimate?: number;
  needPacking?: boolean;
};

export default function RequestCard({ r, offers }: { r: Request; offers?: Offer[] }) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-white p-4 shadow hover:shadow-md">
      <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500/60" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-emerald-700">
              {r.fromCity} → {r.toCity}
            </h3>
            <span className="text-sm text-gray-400">{r.moveDate}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{r.details}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            {r.rooms && (
              <span>
                Camere: <span className="font-medium text-gray-700">{r.rooms}</span>
              </span>
            )}
            {typeof r.volumeM3 !== "undefined" && (
              <span>
                Volum: <span className="font-medium text-gray-700">{r.volumeM3} m³</span>
              </span>
            )}
            {r.budgetEstimate && (
              <span>
                Buget: <span className="font-medium text-gray-700">{r.budgetEstimate} RON</span>
              </span>
            )}
            <span>
              Ambalare:{" "}
              <span className="font-medium text-gray-700">{r.needPacking ? "Da" : "Nu"}</span>
            </span>
          </div>
        </div>

        <div className="flex w-40 flex-col items-end gap-2">
          <div className="text-sm text-gray-500">Oferte</div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {offers?.length ?? 0}
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Oferte primite</h4>
        <div className="space-y-2">
          {offers && offers.length ? (
            offers.map((o) => <OfferItem key={o.id} offer={o} />)
          ) : (
            <p className="text-sm italic text-gray-400">Nicio ofertă.</p>
          )}
        </div>
      </div>
    </div>
  );
}
