import { memo } from "react";

import {
  CalendarIcon as Calendar,
  MapPinIcon as MapPin,
  CubeIcon as Package,
  CheckCircleIcon as CheckCircle2,
  DocumentTextIcon as FileText,
  UserIcon as User,
  PhoneIcon as Phone,
} from "@heroicons/react/24/outline";
import { MovingRequest } from "../../types";
import { formatMoveDateDisplay } from "@/utils/date";

type MyRequestCardProps = {
  request: MovingRequest;
  offersCount: number;

  onStatusChange: (requestId: string, newStatus: "active" | "closed" | "paused") => void;
};

const MyRequestCard = memo(function MyRequestCard({
  request,
  offersCount,
  onStatusChange,
}: MyRequestCardProps) {

  // Normalize status to valid values
  const getStatus = (): "active" | "closed" | "paused" | "cancelled" => {
    const reqStatus = request.status;
    if (
      reqStatus === "active" ||
      reqStatus === "closed" ||
      reqStatus === "paused" ||
      reqStatus === "cancelled"
    ) {
      return reqStatus;
    }
    return "active";
  };

  const status = getStatus();

  // Get label for status
  const getStatusLabel = () => {
    switch (status) {
      case "active":
        return "Activă";
      case "closed":
        return "Închisă";
      case "paused":
        return "În așteptare";
      case "cancelled":
        return "Anulată";
      default:
        return "Activă";
    }
  };

  // Get gradient class for accent bar
  const getGradientClass = () => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500 via-blue-500 to-blue-600";
      case "closed":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case "paused":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-500";
      default:
        return "bg-gradient-to-r from-green-500 via-blue-500 to-blue-600";
    }
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Gradient accent bar */}
      <div className={`h-1.5 w-full ${getGradientClass()}`} />

      <div className="p-4 sm:p-6">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col gap-4">

          {/* Header Row: Route + Status */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              {/* Route */}
              <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg ${status === "active" ? "bg-gradient-to-br from-emerald-500 to-blue-500 shadow-emerald-500/30" :
                    status === "closed" ? "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/20" :
                      status === "paused" ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30" :
                        "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30"
                    }`}
                >
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {request.fromCity || "Oraș Plecare"}
                    <span className="mx-2 text-gray-300">→</span>
                    {request.toCity || "Oraș Destinație"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.fromCounty === request.toCounty ? `Județul ${request.fromCounty}` : `${request.fromCounty} -> ${request.toCounty}`}
                  </p>
                </div>
              </div>

              {/* Badges Row */}
              <div className="flex flex-wrap gap-2">
                {/* Status */}
                <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${status === "active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" :
                  status === "closed" ? "bg-gray-100 text-gray-600 ring-1 ring-gray-200" :
                    status === "paused" ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" :
                      "bg-red-50 text-red-700 ring-1 ring-red-200"
                  }`}>
                  {getStatusLabel()}
                </span>

                {/* Date */}
                {(() => {
                  const d = formatMoveDateDisplay(request as any);
                  return d && d !== '-' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                      <Calendar className="h-3.5 w-3.5" />
                      {d}
                    </span>
                  ) : null;
                })()}

                {/* Rooms */}
                {request.rooms && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
                    <Package className="h-3.5 w-3.5" />
                    {request.rooms} camere
                  </span>
                )}
              </div>
            </div>

            {/* Right: Offers & Actions */}
            <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-2xl font-bold text-gray-900 leading-none">{offersCount}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Oferte</p>
                </div>

                {/* Mobile Offer Badge */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-lg sm:hidden">
                  <span className="font-bold">{offersCount}</span>
                </div>

                <div className="flex gap-1">
                  {status === 'active' && (
                    <button
                      onClick={() => onStatusChange(request.id, 'closed')}
                      className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md"
                      title="Închide Cererea"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Content Body: Details & Contact (NEW) */}
          <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Description */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <FileText className="h-3 w-3" />
                  Detalii Mobilă
                </h4>
                <p className="text-sm leading-relaxed text-gray-700 line-clamp-3">
                  {request.details || <span className="italic text-gray-400">Nu ai furnizat o listă detaliată de obiecte.</span>}
                </p>
              </div>

              {/* Contact Info Preview */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  <User className="h-3 w-3" />
                  Date Contact
                </h4>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {request.customerName || "Nume nespecificat"}
                  </p>
                  {request.phone && (
                    <p className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5 text-emerald-500" />
                      {request.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

export default MyRequestCard;


