"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Download } from "lucide-react";

type JobSheetModalProps = {
  request: any;
  isOpen: boolean;
  onClose: () => void;
};

export default function JobSheetModal({ request, isOpen, onClose }: JobSheetModalProps) {
  const [downloading, setDownloading] = useState(false);

  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Future: generate PDF via API
      handlePrint();
    } finally {
      setDownloading(false);
    }
  };

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
            className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[121] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <FileText size={24} className="text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Job Sheet</h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {request.requestCode || `REQ-${String(request.id).slice(0, 6).toUpperCase()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Download size={16} />
                    {downloading ? "Se descarcă..." : "Descarcă"}
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 transition-colors hover:bg-white/80"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[calc(90vh-160px)] overflow-y-auto p-10">
                <div className="space-y-8">
                  {/* Customer Info */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
                    <h3 className="mb-6 text-xl font-semibold text-gray-900">Informații Client</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nume</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">
                          {request.customerName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefon</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">
                          {request.phone || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">
                          {request.customerEmail || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data mutării</p>
                        <p className="mt-1 text-base font-semibold text-gray-900">
                          {request.moveDate
                            ? new Date(request.moveDate).toLocaleDateString("ro-RO", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8">
                    <h3 className="mb-6 text-xl font-semibold text-emerald-900">Traseu</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          📍 Plecare
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {request.fromCity || request.fromCounty}
                          {request.fromCounty && `, ${request.fromCounty}`}
                        </p>
                        {request.fromAddress && (
                          <p className="mt-1 text-sm text-gray-700">{request.fromAddress}</p>
                        )}
                        <div className="mt-3 space-y-1 text-sm">
                          {request.fromType && (
                            <p>
                              <span className="font-medium">Tip:</span>{" "}
                              {request.fromType === "house" ? "Casă" : "Apartament"}
                            </p>
                          )}
                          {request.fromFloor !== undefined && request.fromFloor !== null && (
                            <p>
                              <span className="font-medium">Etaj:</span> {request.fromFloor}
                            </p>
                          )}
                          {request.fromElevator !== undefined && (
                            <p>
                              <span className="font-medium">Lift:</span>{" "}
                              {request.fromElevator ? "Da" : "Nu"}
                            </p>
                          )}
                          {request.fromRooms && (
                            <p>
                              <span className="font-medium">Camere:</span> {request.fromRooms}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-600">
                          📍 Destinație
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {request.toCity || request.toCounty}
                          {request.toCounty && `, ${request.toCounty}`}
                        </p>
                        {request.toAddress && (
                          <p className="mt-1 text-sm text-gray-700">{request.toAddress}</p>
                        )}
                        <div className="mt-3 space-y-1 text-sm">
                          {request.toType && (
                            <p>
                              <span className="font-medium">Tip:</span>{" "}
                              {request.toType === "house" ? "Casă" : "Apartament"}
                            </p>
                          )}
                          {request.toFloor !== undefined && request.toFloor !== null && (
                            <p>
                              <span className="font-medium">Etaj:</span> {request.toFloor}
                            </p>
                          )}
                          {request.toElevator !== undefined && (
                            <p>
                              <span className="font-medium">Lift:</span>{" "}
                              {request.toElevator ? "Da" : "Nu"}
                            </p>
                          )}
                          {request.toRooms && (
                            <p>
                              <span className="font-medium">Camere:</span> {request.toRooms}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  {(request.serviceMoving ||
                    request.servicePacking ||
                    request.serviceDisassembly ||
                    request.serviceCleanout ||
                    request.serviceStorage) && (
                    <div className="rounded-xl border border-purple-200 bg-purple-50 p-8">
                      <h3 className="mb-6 text-xl font-semibold text-purple-900">
                        Servicii solicitate
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {request.serviceMoving && (
                          <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                            🚚 Transport
                          </span>
                        )}
                        {request.servicePacking && (
                          <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                            📦 Ambalare
                          </span>
                        )}
                        {request.serviceDisassembly && (
                          <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                            🔧 Demontare
                          </span>
                        )}
                        {request.serviceCleanout && (
                          <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                            🗑️ Debarasare
                          </span>
                        )}
                        {request.serviceStorage && (
                          <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700">
                            📦 Depozitare
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Details */}
                  {request.details && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8">
                      <h3 className="mb-6 text-xl font-semibold text-gray-900">
                        Detalii suplimentare
                      </h3>
                      <p className="whitespace-pre-wrap text-base text-gray-700">{request.details}</p>
                    </div>
                  )}

                  {/* Survey Type */}
                  {request.surveyType && (
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-8">
                      <h3 className="mb-6 text-xl font-semibold text-sky-900">Tip evaluare</h3>
                      <p className="text-base text-sky-800">
                        {request.surveyType === "in-person"
                          ? "📋 Vizită la fața locului"
                          : request.surveyType === "video"
                          ? "📹 Evaluare video"
                          : "⚡ Estimare rapidă"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Generat: {new Date().toLocaleDateString("ro-RO", { 
                      day: "2-digit", 
                      month: "long", 
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Închide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
