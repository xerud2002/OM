import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Package,
  MoreVertical,
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

export default function MyRequestCard({
  request,
  offersCount,
  readOnly = false,
  onStatusChange,
  onArchive,
}: MyRequestCardProps) {
  const [showMenu, setShowMenu] = useState(false);
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
        return "bg-gradient-to-r from-emerald-500 to-sky-500";
      case "closed":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case "paused":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-500";
      default:
        return "bg-gradient-to-r from-emerald-500 to-sky-500";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-sm transition-all hover:shadow-lg"
    >
      {/* Gradient accent bar */}
      <div className={`h-1.5 w-full overflow-hidden rounded-t-2xl ${getGradientClass()}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Route */}
            <div className="mb-3 flex items-center gap-2">
              <MapPin 
                size={20} 
                className={
                  status === "active" ? "shrink-0 text-emerald-700" :
                  status === "closed" ? "shrink-0 text-gray-700" :
                  status === "paused" ? "shrink-0 text-amber-700" :
                  "shrink-0 text-red-700"
                }
              />
              <h3 className="truncate text-xl font-bold text-gray-900">
                {request.fromCity || request.fromCounty}
                <span className="mx-2 text-gray-400">→</span>
                {request.toCity || request.toCounty}
              </h3>
            </div>

            {/* Metadata badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {/* Status badge */}
              <span
                className={
                  status === "active" 
                    ? "inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700"
                    : status === "closed"
                    ? "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-700"
                    : status === "paused"
                    ? "inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700"
                    : "inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700"
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
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                    <Calendar size={14} />
                    {display}
                  </span>
                ) : null;
              })()}

              {/* Rooms badge */}
              {request.rooms && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                  <Package size={14} />
                  {request.rooms} camere
                </span>
              )}
            </div>

            {/* Details */}
            {request.details && (
              <p className="line-clamp-2 text-sm text-gray-600">{request.details}</p>
            )}

            {/* Services */}
            {(request.serviceMoving ||
              request.servicePacking ||
              request.serviceDisassembly ||
              request.serviceCleanout ||
              request.serviceStorage) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {request.serviceMoving && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    Transport
                  </span>
                )}
                {request.servicePacking && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    Ambalare
                  </span>
                )}
                {request.serviceDisassembly && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    Demontare
                  </span>
                )}
                {request.serviceCleanout && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    Debarasare
                  </span>
                )}
                {request.serviceStorage && (
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                    Depozitare
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right side: Offers count + Menu */}
          <div className="flex shrink-0 flex-col items-end gap-3">
            {/* Offers badge */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{offersCount}</div>
                <div className="text-[10px] font-medium text-white/90">oferte</div>
              </div>
            </div>

            {/* Menu dropdown */}
            <div className="relative z-30">
              {/* Show menu for active, closed, or paused requests (not cancelled, not read-only) */}
              {!readOnly && (status === "active" || status === "closed" || status === "paused") && (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              )}

              <AnimatePresence>
                {showMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                    >
                      <div className="p-1">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setShowDetailsModal(true);
                            setShowMenu(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          <Eye size={16} />
                          Vezi detalii cerere
                        </button>

                        <div className="my-1 h-px bg-gray-100" />

                        {/* Status actions */}
                        {status === "active" && (
                          <>
                            <button
                              onClick={() => {
                                onStatusChange(request.id, "closed");
                                setShowMenu(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <CheckCircle2 size={16} />
                              Am găsit companie
                            </button>
                            <button
                              onClick={() => {
                                onStatusChange(request.id, "paused");
                                setShowMenu(false);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-700"
                            >
                              <PauseCircle size={16} />
                              Nu mai primesc oferte
                            </button>
                          </>
                        )}

                        {/* Reopen closed or paused requests */}
                        {(status === "closed" || status === "paused") && (
                          <button
                            onClick={() => {
                              onStatusChange(request.id, "active");
                              setShowMenu(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <RotateCcw size={16} />
                            Redeschide cererea
                          </button>
                        )}

                        <div className="my-1 h-px bg-gray-100" />

                        {/* Archive */}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Sigur vrei să arhivezi această cerere? O vei putea vedea în secțiunea Arhivă."
                              )
                            ) {
                              onArchive(request.id);
                              setShowMenu(false);
                            }
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          <Archive size={16} />
                          Arhivează cererea
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
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
}
