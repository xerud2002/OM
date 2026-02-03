import { useState, useEffect } from "react";
import {
  MapPinIcon as MapPin,
  CalendarIcon as Calendar,
  CubeIcon as Package,
  UserIcon as User,
  DocumentTextIcon as FileText,
  WrenchScrewdriverIcon as Wrench,
  TrashIcon as Trash2
} from "@heroicons/react/24/outline";
import { MovingRequest } from "../../types";
import { formatMoveDateDisplay } from "@/utils/date";
import Image from "next/image";
import ConfirmModal from "@/components/ConfirmModal";
import { logger } from "@/utils/logger";

type RequestFullDetailsProps = {
  request: MovingRequest;
  isOwner: boolean;
};

export default function RequestFullDetails({
  request,
  isOwner,
}: RequestFullDetailsProps) {
  const [localMediaUrls, setLocalMediaUrls] = useState<string[]>(request.mediaUrls || []);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [deleteMediaUrl, setDeleteMediaUrl] = useState<string | null>(null);

  // Sync local media when request changes
  useEffect(() => {
    setLocalMediaUrls(request.mediaUrls || []);
  }, [request]);

  const handleDeleteMedia = async (url: string) => {
    if (!isOwner) return;
    const { toast } = await import("sonner");
    try {
      setDeletingUrl(url);

      const updated = localMediaUrls.filter((u) => u !== url);
      setLocalMediaUrls(updated); // optimistic UI

      const { updateRequest } = await import("@/utils/firestoreHelpers");
      await updateRequest(request.id, { mediaUrls: updated });
      toast.success("Fișierul a fost șters din cerere");
    } catch (err) {
      logger.error("Failed to delete media", err);
      const { toast } = await import("sonner");
      toast.error("Nu s-a putut șterge fișierul");
      // Revert optimistic update
      setLocalMediaUrls(request.mediaUrls || []);
    } finally {
      setDeletingUrl(null);
      setDeleteMediaUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Detalii Complete</h2>
        <div className="h-px flex-1 bg-gray-100"></div>
      </div>

      {/* Route Section */}
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Traseu & Logistică</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr]">
          {/* DE LA */}
          <div className="relative">
            <div className="absolute -left-3 top-2 bottom-0 w-0.5 bg-gray-100 md:hidden"></div>

            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 ring-2 ring-white">A</span>
              <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">Punct de plecare</p>
            </div>

            <div className="pl-8 md:pl-0">
              <p className="text-lg font-bold text-gray-900">
                {request.fromCity || request.fromCounty}
                {request.fromCounty && request.fromCity && `, ${request.fromCounty}`}
              </p>
              {request.fromAddress && (
                <p className="mt-1 text-sm text-gray-600">{request.fromAddress}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {request.fromType && (
                  <span className="inline-flex items-center rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                    {request.fromType === "house" ? "🏠 Casă" : "🏢 Apartament"}
                  </span>
                )}
                {request.fromFloor !== undefined && request.fromFloor !== null && request.fromFloor !== "" && (
                  <span className="inline-flex items-center rounded-md border border-gray-100 bg-white px-2.5 py-1 font-medium text-gray-600 shadow-sm">
                    Etaj {request.fromFloor}
                  </span>
                )}
                {request.fromElevator !== undefined && (
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-1 font-medium shadow-sm ${request.fromElevator
                      ? "border-green-100 bg-green-50 text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-500"
                    }`}>
                    {request.fromElevator ? "✅ Cu lift" : "❌ Fără lift"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arrow / Divider */}
          <div className="flex items-center justify-center">
            <div className="hidden h-full w-px bg-gray-200 md:block"></div>
            <div className="hidden md:flex flex-col items-center justify-center absolute bg-white p-2 rounded-full border border-gray-100 shadow-sm z-10">
              <span className="text-gray-300">→</span>
            </div>
          </div>

          {/* CĂTRE */}
          <div className="relative">
            <div className="absolute -left-3 top-2 bottom-0 w-0.5 bg-gray-100 md:hidden"></div>

            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 ring-2 ring-white">B</span>
              <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">Destinație</p>
            </div>

            <div className="pl-8 md:pl-0">
              <p className="text-lg font-bold text-gray-900">
                {request.toCity || request.toCounty}
                {request.toCounty && request.toCity && `, ${request.toCounty}`}
              </p>
              {request.toAddress && (
                <p className="mt-1 text-sm text-gray-600">{request.toAddress}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {request.toType && (
                  <span className="inline-flex items-center rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                    {request.toType === "house" ? "🏠 Casă" : "🏢 Apartament"}
                  </span>
                )}
                {request.toFloor !== undefined && request.toFloor !== null && request.toFloor !== "" && (
                  <span className="inline-flex items-center rounded-md border border-gray-100 bg-white px-2.5 py-1 font-medium text-gray-600 shadow-sm">
                    Etaj {request.toFloor}
                  </span>
                )}
                {request.toElevator !== undefined && (
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-1 font-medium shadow-sm ${request.toElevator
                      ? "border-green-100 bg-green-50 text-green-700"
                      : "border-gray-100 bg-gray-50 text-gray-500"
                    }`}>
                    {request.toElevator ? "✅ Cu lift" : "❌ Fără lift"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date */}
        {(() => {
          const display = formatMoveDateDisplay(request as any, { month: "short" });
          return display && display !== "-" ? (
            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Data mutării</h4>
                <p className="mt-1 text-base font-semibold text-gray-900">{display}</p>
              </div>
            </div>
          ) : null;
        })()}

        {/* Rooms / Volume */}
        {(request.rooms || request.volumeM3) && (
          <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Volum / Camere</h4>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {request.rooms ? `${request.rooms} camere` : ""}
                {request.rooms && request.volumeM3 ? " • " : ""}
                {request.volumeM3 ? `${request.volumeM3} m³` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Contact */}
        {request.contactName && (
          <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Persoană Contact</h4>
              <p className="mt-1 text-base font-semibold text-gray-900">{request.contactName}</p>
              {request.phone && <p className="text-sm text-gray-500">{request.phone}</p>}
            </div>
          </div>
        )}

        {/* Survey */}
        {request.surveyType && (
          <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Evaluare</h4>
              <p className="mt-1 text-base font-semibold text-gray-900">
                {request.surveyType === "in-person"
                  ? "Vizită la fața locului"
                  : request.surveyType === "video"
                    ? "Evaluare video"
                    : "Estimare rapidă"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Services */}
      {(request.serviceMoving ||
        request.servicePacking ||
        request.serviceDisassembly ||
        request.serviceCleanout ||
        request.serviceStorage) && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Wrench className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Servicii Solicitate</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {request.serviceMoving && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  🚛 Transport
                </span>
              )}
              {request.servicePacking && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  📦 Ambalare
                </span>
              )}
              {request.serviceDisassembly && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  🔧 Demontare/Montare
                </span>
              )}
              {request.serviceCleanout && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  🧹 Debarasare
                </span>
              )}
              {request.serviceStorage && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  🏭 Depozitare
                </span>
              )}
            </div>
          </div>
        )}

      {/* Additional Details */}
      {request.details && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Alte detalii</h3>
          </div>
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            {request.details}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {localMediaUrls && localMediaUrls.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Poze & Video ({localMediaUrls.length})</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {localMediaUrls.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-all hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100"
              >
                <Image
                  src={url}
                  alt={`Media ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  quality={75}
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

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
                      setDeleteMediaUrl(url);
                    }}
                    disabled={deletingUrl === url}
                    title="Șterge imagine"
                    className="absolute top-2 right-2 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-500 hover:text-white group-hover:flex disabled:cursor-wait"
                  >
                    {deletingUrl === url ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Media Confirmation */}
      <ConfirmModal
        isOpen={!!deleteMediaUrl}
        onClose={() => setDeleteMediaUrl(null)}
        onConfirm={() => deleteMediaUrl && handleDeleteMedia(deleteMediaUrl)}
        title="Șterge fișier"
        message="Sigur vrei să ștergi acest fișier din cerere? Acțiunea nu poate fi anulată."
        confirmText="Șterge"
        cancelText="Anulează"
        variant="danger"
        icon="trash"
      />
    </div>
  );
}
