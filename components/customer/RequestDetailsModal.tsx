import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, MapPin, Calendar, Package, Phone, User, FileText, Wrench } from "lucide-react";
import { MovingRequest } from "../../types";
import { formatDateRO } from "@/utils/date";
import Image from "next/image";

type RequestDetailsModalProps = {
  request: MovingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onRequestEdit: (request: MovingRequest) => void;
};

export default function RequestDetailsModal({
  request,
  isOpen,
  onClose,
  onRequestEdit,
}: RequestDetailsModalProps) {
  if (!request) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalii cerere</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Informații complete despre mutarea ta
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-white/80"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
                {/* Route Section */}
                <div className="mb-6 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Traseu</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        De la
                      </p>
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {request.fromCity || request.fromCounty}
                        {request.fromCounty && `, ${request.fromCounty}`}
                      </p>
                      {request.fromAddress && (
                        <p className="mt-1 text-sm text-gray-600">{request.fromAddress}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {request.fromType && (
                          <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">
                            {request.fromType === "house" ? "Casă" : "Apartament"}
                          </span>
                        )}
                        {request.fromFloor !== undefined && request.fromFloor !== null && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
                            Etaj {request.fromFloor}
                          </span>
                        )}
                        {request.fromElevator !== undefined && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
                            {request.fromElevator ? "Cu lift" : "Fără lift"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                      <span className="mx-4 text-2xl text-emerald-500">→</span>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Către
                      </p>
                      <p className="mt-1 text-base font-semibold text-gray-900">
                        {request.toCity || request.toCounty}
                        {request.toCounty && `, ${request.toCounty}`}
                      </p>
                      {request.toAddress && (
                        <p className="mt-1 text-sm text-gray-600">{request.toAddress}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {request.toType && (
                          <span className="rounded-md bg-emerald-100 px-2 py-1 text-emerald-700">
                            {request.toType === "house" ? "Casă" : "Apartament"}
                          </span>
                        )}
                        {request.toFloor !== undefined && request.toFloor !== null && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
                            Etaj {request.toFloor}
                          </span>
                        )}
                        {request.toElevator !== undefined && (
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-gray-700">
                            {request.toElevator ? "Cu lift" : "Fără lift"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  {/* Date */}
                  {request.moveDate && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar size={18} className="text-sky-600" />
                        <h4 className="font-semibold text-gray-900">Data mutării</h4>
                      </div>
                      <p className="text-lg font-medium text-gray-700">
                        {formatDateRO(request.moveDate, { month: "short" })}
                      </p>
                    </div>
                  )}

                  {/* Rooms */}
                  {request.rooms && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Package size={18} className="text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Camere</h4>
                      </div>
                      <p className="text-lg font-medium text-gray-700">{request.rooms} camere</p>
                    </div>
                  )}

                  {/* Phone */}
                  {request.phone && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Phone size={18} className="text-emerald-600" />
                        <h4 className="font-semibold text-gray-900">Telefon</h4>
                      </div>
                      <p className="text-lg font-medium text-gray-700">{request.phone}</p>
                    </div>
                  )}

                  {/* Customer Name */}
                  {request.customerName && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <User size={18} className="text-indigo-600" />
                        <h4 className="font-semibold text-gray-900">Client</h4>
                      </div>
                      <p className="text-lg font-medium text-gray-700">{request.customerName}</p>
                    </div>
                  )}
                </div>

                {/* Services */}
                {(request.serviceMoving ||
                  request.servicePacking ||
                  request.serviceDisassembly ||
                  request.serviceCleanout ||
                  request.serviceStorage) && (
                  <div className="mb-6 rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Wrench size={20} className="text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Servicii solicitate</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {request.serviceMoving && (
                        <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                          Transport
                        </span>
                      )}
                      {request.servicePacking && (
                        <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                          Ambalare
                        </span>
                      )}
                      {request.serviceDisassembly && (
                        <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                          Demontare
                        </span>
                      )}
                      {request.serviceCleanout && (
                        <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                          Debarasare
                        </span>
                      )}
                      {request.serviceStorage && (
                        <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                          Depozitare
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Survey Type */}
                {request.surveyType && (
                  <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText size={20} className="text-sky-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Tip evaluare</h3>
                    </div>
                    <p className="text-gray-700">
                      {request.surveyType === "in-person"
                        ? "Vizită la fața locului"
                        : request.surveyType === "video"
                        ? "Evaluare video"
                        : "Estimare rapidă"}
                    </p>
                  </div>
                )}

                {/* Details/Notes */}
                {request.details && (
                  <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText size={20} className="text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Detalii suplimentare</h3>
                    </div>
                    <p className="whitespace-pre-wrap text-gray-700">{request.details}</p>
                  </div>
                )}

                {/* Media URLs */}
                {request.mediaUrls && request.mediaUrls.length > 0 && (
                  <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Package size={20} className="text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Media încărcată</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {request.mediaUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-emerald-300 hover:shadow-md"
                        >
                          <Image
                            src={url}
                            alt={`Media ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Închide
                </button>
                <button
                  onClick={() => {
                    onRequestEdit(request);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Edit2 size={18} />
                  Cere modificare cerere
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
