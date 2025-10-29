import React from "react";

type Offer = {
  id?: string;
  companyName?: string;
  price?: number;
  message?: string;
};

export default function OfferItem({ offer }: { offer: Offer }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-3">
      <div>
        <p className="font-medium text-gray-800">{offer.companyName}</p>
        {offer.message && <p className="text-sm text-gray-500">{offer.message}</p>}
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-emerald-700">{offer.price} lei</p>
      </div>
    </div>
  );
}
