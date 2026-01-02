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
import { toast } from "sonner";

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

  // Normalize status to valid values
  const getStatus = (): "active" | "closed" | "paused" | "cancelled" => {
    const reqStatus = request.status;
    if (reqStatus === "active" || reqStatus === "closed" || reqStatus === "paused" || reqStatus === "cancelled") {
      return reqStatus;
    }
    return "active";
  };

  const status = getStatus();

  // Get label for status
  const getStatusLabel = () => {
    switch (status) {
      case "active": return "Activă";
      case "closed": return "Închisă";
      case "paused": return "În așteptare";
      case "cancelled": return "Anulată";
      default: return "Activă";
    }
  };

  // Get gradient class for accent bar
  const getGradientClass = () => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500";
      case "closed":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case "paused":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-500";
      default:
        return "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500";
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

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Route */}
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                status === "active" ? "bg-gradient-to-br from-emerald-500 to-teal-500" :
                status === "closed" ? "bg-gradient-to-br from-gray-400 to-gray-500" :
                status === "paused" ? "bg-gradient-to-br from-amber-500 to-orange-500" :
                "bg-gradient-to-br from-red-500 to-rose-500"
              } shadow-lg ${
                status === "active" ? "shadow-emerald-500/30" :
                status === "closed" ? "shadow-gray-500/20" :
                status === "paused" ? "shadow-amber-500/30" :
                "shadow-red-500/30"
              }`}>
                <MapPin size={20} className="text-white" />
              </div>
              <h3 className="truncate text-xl font-bold text-gray-900">
                {request.fromCity || request.fromCounty}
                <span className="mx-2 text-gray-300">→</span>
                {request.toCity || request.toCounty}
              </h3>
            </div>

            {/* Metadata badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {/* Status badge */}
              <span
                className={
                  status === "active" 
                    ? "inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm"
                    : status === "closed"
                    ? "inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm"
                    : status === "paused"
                    ? "inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 shadow-sm"
                    : "inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 shadow-sm"
                }
              >
                {status === "active" && <CheckCircle2 size={14} />}
                {status === "closed" && <XCircle size={14} />}
                {status === "paused" && <PauseCircle size={14} />}
                {status === "cancelled" && <XCircle size={14} />}
                {getStatusLabel()}
              </span>

              {/* Date badge */}
              {(() => {
                const display = formatMoveDateDisplay(request as any, { month: "short" });
                return display && display !== "-" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                    <Calendar size={14} className="text-gray-500" />
                    {display}
                  </span>
                ) : null;
              })()}

              {/* Rooms badge */}
              {request.rooms && (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                  <Package size={14} className="text-gray-500" />
                  {request.rooms} camere
                </span>
              )}
            </div>

            {/* Details */}
            {request.details && (
              <p className="line-clamp-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">{request.details}</p>
            )}

            {/* Services */}
            {(request.serviceMoving ||
              request.servicePacking ||
              request.serviceDisassembly ||
              request.serviceCleanout ||
              request.serviceStorage) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {request.serviceMoving && (
                  <span className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                    Transport
                  </span>
                )}
                {request.servicePacking && (
                  <span className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                    Ambalare
                  </span>
                )}
                {request.serviceDisassembly && (
                  <span className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                    Demontare
                  </span>
                )}
                {request.serviceCleanout && (
                  <span className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                    Debarasare
                  </span>
                )}
                {request.serviceStorage && (
                  <span className="rounded-full bg-gradient-to-r from-purple-50 to-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-200">
                    Depozitare
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right side: Offers count + Menu */}
          <div className="flex shrink-0 flex-col items-end gap-3">
            {/* Offers badge */}
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500 shadow-xl shadow-emerald-500/30">
              <div className="absolute inset-0 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{offersCount}</div>
                <div className="text-xs font-semibold text-white/90">oferte</div>
              </div>
            </div>

            {/* Action buttons - direct icons */}
            {!readOnly && (
              <div className="flex items-center gap-2">
                {/* View Details */}
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600 hover:shadow-md"
                  title="Vezi detalii cerere"
                >
                  <Eye size={18} />
                </button>

                {/* Status actions */}
                {status === "active" && (
                  <>
                    <button
                      onClick={() => onStatusChange(request.id, "closed")}
                      className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md"
                      title="Am găsit companie"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button
                      onClick={() => onStatusChange(request.id, "paused")}
                      className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 hover:shadow-md"
                      title="Nu mai primesc oferte"
                    >
                      <PauseCircle size={18} />
                    </button>
                  </>
                )}

                {/* Reopen for closed or paused */}
                {(status === "closed" || status === "paused") && (
                  <button
                    onClick={() => onStatusChange(request.id, "active")}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 hover:shadow-md"
                    title="Redeschide cererea"
                  >
                    <RotateCcw size={18} />
                  </button>
                )}

                {/* Archive */}
                <button
                  onClick={() => {
                    if (confirm("Sigur vrei să arhivezi această cerere? O vei putea vedea în secțiunea Arhivă.")) {
                      onArchive(request.id);
                    }
                  }}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700 hover:shadow-md"
                  title="Arhivează cererea"
                >
                  <Archive size={18} />
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
        onRequestEdit={async (req, updatedData) => {
          try {
            const { updateRequest } = await import("@/utils/firestoreHelpers");
            await updateRequest(req.id, updatedData);
            setShowDetailsModal(false); // Close modal to force reload with fresh data
            toast.success("Cererea a fost actualizată! Companiile interesate au fost notificate.");
          } catch (error) {
            console.error("Error updating request:", error);
            toast.error("Nu s-a putut actualiza cererea");
          }
        }}
      />
    </motion.div>
  );
});

export default MyRequestCard;
