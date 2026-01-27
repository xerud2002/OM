import { useState, memo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Package,
  CheckCircle2,
  PauseCircle,
  Archive,
  XCircle,
  Eye,
  RotateCcw,
} from "lucide-react";
import { MovingRequest } from "../../types";
import { formatMoveDateDisplay } from "@/utils/date";
import RequestDetailsModal from "./RequestDetailsModal";
import ConfirmModal from "@/components/ConfirmModal";

type MyRequestCardProps = {
  request: MovingRequest;
  offersCount: number;
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars
  onStatusChange: (requestId: string, newStatus: "active" | "closed" | "paused") => void;
  // eslint-disable-next-line no-unused-vars
  onArchive: (requestId: string) => void;
};

const MyRequestCard = memo(function MyRequestCard({
  request,
  offersCount,
  readOnly = false,
  onStatusChange,
  onArchive,
}: MyRequestCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);

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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* Gradient accent bar */}
      <div className={`h-1.5 w-full ${getGradientClass()}`} />

      <div className="p-4 sm:p-6">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Route - smaller on mobile */}
            <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
              <div
                style={
                  status === "active"
                    ? { background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)" }
                    : status === "closed"
                      ? { background: "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" }
                      : status === "paused"
                        ? { background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }
                        : { background: "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)" }
                }
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-lg sm:h-10 sm:w-10 sm:rounded-xl ${status === "active"
                  ? "shadow-green-500/30"
                  : status === "closed"
                    ? "shadow-gray-500/20"
                    : status === "paused"
                      ? "shadow-amber-500/30"
                      : "shadow-red-500/30"
                  }`}
              >
                <MapPin size={16} className="text-white sm:hidden" />
                <MapPin size={20} className="hidden text-white sm:block" />
              </div>
              <h3 className="truncate text-base font-bold text-gray-900 sm:text-xl">
                {request.fromCity || request.fromCounty}
                <span className="mx-1.5 text-gray-300 sm:mx-2">→</span>
                {request.toCity || request.toCounty}
              </h3>
            </div>

            {/* Request Code */}
            {(request as any).requestCode && (
              <div className="mb-3 sm:mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-700">
                  <svg
                    className="h-3.5 w-3.5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  {(request as any).requestCode}
                </span>
              </div>
            )}

            {/* Metadata badges - horizontal scroll on mobile */}
            <div className="mb-3 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:mb-4 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {/* Status badge */}
              <span
                className={`shrink-0 ${status === "active"
                  ? "inline-flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 shadow-sm sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm"
                  : status === "closed"
                    ? "inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm"
                    : status === "paused"
                      ? "inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 shadow-sm sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm"
                      : "inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm"
                  }`}
              >
                {status === "active" && <CheckCircle2 size={12} className="sm:hidden" />}
                {status === "active" && <CheckCircle2 size={14} className="hidden sm:block" />}
                {status === "closed" && <XCircle size={12} className="sm:hidden" />}
                {status === "closed" && <XCircle size={14} className="hidden sm:block" />}
                {status === "paused" && <PauseCircle size={12} className="sm:hidden" />}
                {status === "paused" && <PauseCircle size={14} className="hidden sm:block" />}
                {status === "cancelled" && <XCircle size={12} className="sm:hidden" />}
                {status === "cancelled" && <XCircle size={14} className="hidden sm:block" />}
                {getStatusLabel()}
              </span>

              {/* Date badge */}
              {(() => {
                const display = formatMoveDateDisplay(request as any, { month: "short" });
                return display && display !== "-" ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm">
                    <Calendar size={12} className="text-gray-500 sm:hidden" />
                    <Calendar size={14} className="hidden text-gray-500 sm:block" />
                    {display}
                  </span>
                ) : null;
              })()}

              {/* Rooms badge */}
              {request.rooms && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm">
                  <Package size={12} className="text-gray-500 sm:hidden" />
                  <Package size={14} className="hidden text-gray-500 sm:block" />
                  {request.rooms} cam.
                </span>
              )}
            </div>

            {/* Services - horizontal scroll on mobile */}
            {(request.serviceMoving ||
              request.servicePacking ||
              request.serviceDisassembly ||
              request.serviceCleanout ||
              request.serviceStorage) && (
                <div className="mt-3 flex flex-nowrap gap-1.5 overflow-x-auto pb-1 sm:mt-4 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pb-0">
                  {request.serviceMoving && (
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-200 sm:px-3 sm:py-1 sm:text-xs">
                      Transport
                    </span>
                  )}
                  {request.servicePacking && (
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-200 sm:px-3 sm:py-1 sm:text-xs">
                      Ambalare
                    </span>
                  )}
                  {request.serviceDisassembly && (
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-200 sm:px-3 sm:py-1 sm:text-xs">
                      Demontare
                    </span>
                  )}
                  {request.serviceCleanout && (
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-200 sm:px-3 sm:py-1 sm:text-xs">
                      Debarasare
                    </span>
                  )}
                  {request.serviceStorage && (
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-purple-200 sm:px-3 sm:py-1 sm:text-xs">
                      Depozitare
                    </span>
                  )}
                </div>
              )}
          </div>

          {/* Right side: Offers count + Menu - row on mobile, column on desktop */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
            {/* Offers badge - smaller on mobile */}
            <div
              style={{ background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #2563eb 100%)" }}
              className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-green-500/30 sm:h-20 sm:w-20 sm:rounded-2xl sm:shadow-xl"
            >
              <div className="absolute inset-0 bg-white/10" />
              <div className="text-center">
                <div className="text-xl font-bold text-white sm:text-3xl">{offersCount}</div>
                <div className="text-[10px] font-semibold text-white/90 sm:text-xs">oferte</div>
              </div>
            </div>

            {/* Action buttons - horizontal row */}
            {!readOnly && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* View Details */}
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="group flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md sm:h-10 sm:w-10 sm:rounded-xl"
                  title="Vezi detalii cerere"
                >
                  <Eye size={16} className="sm:hidden" />
                  <Eye size={18} className="hidden sm:block" />
                </button>

                {/* Status actions */}
                {status === "active" && (
                  <button
                    onClick={() => onStatusChange(request.id, "closed")}
                    className="group flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md sm:h-10 sm:w-10 sm:rounded-xl"
                    title="Am găsit companie"
                  >
                    <CheckCircle2 size={16} className="sm:hidden" />
                    <CheckCircle2 size={18} className="hidden sm:block" />
                  </button>
                )}

                {/* Reopen for closed or paused */}
                {(status === "closed" || status === "paused") && (
                  <button
                    onClick={() => onStatusChange(request.id, "active")}
                    className="group flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md sm:h-10 sm:w-10 sm:rounded-xl"
                    title="Redeschide cererea"
                  >
                    <RotateCcw size={16} className="sm:hidden" />
                    <RotateCcw size={18} className="hidden sm:block" />
                  </button>
                )}

                {/* Archive */}
                <button
                  onClick={() => setShowArchiveModal(true)}
                  className="group flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700 hover:shadow-md sm:h-10 sm:w-10 sm:rounded-xl"
                  title="Arhivează cererea"
                >
                  <Archive size={16} className="sm:hidden" />
                  <Archive size={18} className="hidden sm:block" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <RequestDetailsModal
        request={request}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      {/* Archive Confirm Modal */}
      <ConfirmModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={() => onArchive(request.id)}
        title="Arhivează cererea"
        message="Sigur vrei să arhivezi această cerere? O vei putea vedea în secțiunea Arhivă."
        confirmText="Arhivează"
        cancelText="Anulează"
        variant="warning"
        icon="archive"
      />
    </motion.div>
  );
});

export default MyRequestCard;
