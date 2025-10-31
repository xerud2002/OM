import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Package,
  MoreVertical,
  CheckCircle2,
  PauseCircle,
  Trash2,
  XCircle,
  Eye,
} from "lucide-react";
import { MovingRequest } from "../../types";

type MyRequestCardProps = {
  request: MovingRequest;
  offersCount: number;
  // eslint-disable-next-line no-unused-vars
  onStatusChange: (requestId: string, newStatus: "active" | "closed" | "paused") => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (requestId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onViewDetails: (requestId: string) => void;
};

export default function MyRequestCard({
  request,
  offersCount,
  onStatusChange,
  onDelete,
  onViewDetails,
}: MyRequestCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const status = request.status || "active";

  const statusConfig = {
    active: {
      label: "Activă",
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      gradient: "from-emerald-500 to-sky-500",
    },
    closed: {
      label: "Închisă",
      color: "gray",
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      gradient: "from-gray-400 to-gray-500",
    },
    paused: {
      label: "În așteptare",
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      gradient: "from-amber-500 to-orange-500",
    },
    cancelled: {
      label: "Anulată",
      color: "red",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      gradient: "from-red-500 to-rose-500",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-sm transition-all hover:shadow-lg"
    >
      {/* Gradient accent bar */}
      <div className={`h-1.5 w-full overflow-hidden rounded-t-2xl bg-gradient-to-r ${currentStatus.gradient}`} />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Route */}
            <div className="mb-3 flex items-center gap-2">
              <MapPin size={20} className={`shrink-0 ${currentStatus.text}`} />
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
                className={`inline-flex items-center gap-1.5 rounded-lg ${currentStatus.bg} ${currentStatus.border} border px-3 py-1.5 text-sm font-semibold ${currentStatus.text}`}
              >
                {status === "active" && <CheckCircle2 size={14} />}
                {status === "closed" && <XCircle size={14} />}
                {status === "paused" && <PauseCircle size={14} />}
                {status === "cancelled" && <XCircle size={14} />}
                {currentStatus.label}
              </span>

              {/* Date badge */}
              {request.moveDate && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                  <Calendar size={14} />
                  {request.moveDate}
                </span>
              )}

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
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>

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
                            onViewDetails(request.id);
                            setShowMenu(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                        >
                          <Eye size={16} />
                          Vezi detalii și oferte
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

                        {(status === "closed" || status === "paused") && (
                          <button
                            onClick={() => {
                              onStatusChange(request.id, "active");
                              setShowMenu(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <CheckCircle2 size={16} />
                            Reactivează cererea
                          </button>
                        )}

                        <div className="my-1 h-px bg-gray-100" />

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Sigur vrei să ștergi această cerere? Această acțiune este permanentă."
                              )
                            ) {
                              onDelete(request.id);
                              setShowMenu(false);
                            }
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Șterge cererea
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
    </motion.div>
  );
}
