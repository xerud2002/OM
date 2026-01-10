import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Package, Phone, User, FileText, Wrench, Trash2 } from "lucide-react";
import { MovingRequest } from "../../types";
import { formatMoveDateDisplay } from "@/utils/date";
import Image from "next/image";

type RequestDetailsModalProps = {
  request: MovingRequest | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function RequestDetailsModal({
  request,
  isOpen,
  onClose,
}: RequestDetailsModalProps) {
  const [localMediaUrls, setLocalMediaUrls] = useState<string[]>(request?.mediaUrls || []);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  // Sync local media when modal opens or request changes
  useEffect(() => {
    if (request) setLocalMediaUrls(request.mediaUrls || []);
  }, [request, isOpen]);

  // Determine if current user owns the request
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { auth } = await import("@/services/firebase");
        const uid = auth.currentUser?.uid;
        if (!mounted) return;
        if (!request) {
          setIsOwner(false);
        } else {
          setIsOwner(!!uid && uid === request.customerId);
        }
      } catch {
        setIsOwner(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [request, isOpen]);

  const handleDeleteMedia = async (url: string) => {
    if (!isOwner || !request) return;
    const { toast } = await import("sonner");
    const confirmed = window.confirm("Ștergi acest fișier din cerere?");
    if (!confirmed) return;
    try {
      setDeletingUrl(url);

      // Logical delete: just remove from Firestore mediaUrls array
      // Physical file remains in Storage (for backup/audit purposes)
      // This avoids permission issues and complex URL parsing

      const updated = localMediaUrls.filter((u) => u !== url);
      setLocalMediaUrls(updated); // optimistic UI

      const { updateRequest } = await import("@/utils/firestoreHelpers");
      await updateRequest(request.id, { mediaUrls: updated });
      toast.success("Fișierul a fost șters din cerere");
    } catch (err) {
      console.error("Failed to delete media", err);
      const { toast } = await import("sonner");
      toast.error("Nu s-a putut șterge fișierul");
    } finally {
      setDeletingUrl(null);
    }
  };

  if (!request) return null;

  // Use portal to render modal at document body level (above all stacking contexts)
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-4 pt-4 sm:pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative mb-4 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-emerald-50 to-sky-50 px-6 py-4">
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
                <div className="mb-6 rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Traseu</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
                    {/* DE LA */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
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

                    {/* Arrow */}
                    <div className="flex items-center justify-center md:mt-6">
                      <span className="text-2xl text-emerald-500 md:mx-4">→</span>
                    </div>

                    {/* CĂTRE */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
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
                  {(() => {
                    const display = formatMoveDateDisplay(request as any, { month: "short" });
                    return display && display !== "-" ? (
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Calendar size={18} className="text-sky-600" />
                          <h4 className="font-semibold text-gray-900">Data mutării</h4>
                        </div>
                        <p className="text-lg font-medium text-gray-700">{display}</p>
                      </div>
                    ) : null;
                  })()}

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
                  <div className="mb-6 rounded-xl border border-purple-100 bg-linear-to-br from-purple-50 to-white p-5">
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
                {localMediaUrls && localMediaUrls.length > 0 && (
                  <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Package size={20} className="text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Media încărcată</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {localMediaUrls.map((url, index) => (
                        <div
                          key={url}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-emerald-300 hover:shadow-md"
                        >
                          <Image
                            src={url}
                            alt={`Media ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0"
                            aria-label={`Deschide media ${index + 1}`}
                          />
                          {isOwner && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleDeleteMedia(url);
                              }}
                              disabled={deletingUrl === url}
                              title="Șterge"
                              className="absolute top-2 right-2 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition group-hover:flex hover:bg-red-600 disabled:cursor-wait"
                            >
                              {deletingUrl === url ? (
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          )}
                        </div>
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
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
