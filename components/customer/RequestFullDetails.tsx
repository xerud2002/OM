import { useState, useEffect } from "react";
import {
  MapPinIcon,
  CalendarIcon,
  CubeIcon,
  UserIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  TrashIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  PlayIcon,
  PhotoIcon,
  ArchiveBoxIcon,
  InboxStackIcon,
  ScissorsIcon,
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

      // Use server-side API route instead of client-side Firestore write
      const { getAuth } = await import("firebase/auth");
      const token = await getAuth().currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/requests/updateMedia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: request.id, mediaUrls: updated }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update media");
      }

      toast.success("Fișierul a fost șters din cerere");
    } catch (err) {
      logger.error("Failed to delete media", err);
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
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
            <MapPinIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Traseu & Logistică</h3>
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
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm font-medium text-gray-700">
                    {request.fromType === "house" ? <HomeIcon className="h-4 w-4 text-gray-500" /> : <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />}
                    {request.fromType === "house" ? "Casă" : "Apartament"}
                  </span>
                )}
                {request.fromFloor !== undefined && request.fromFloor !== null && request.fromFloor !== "" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700">
                    <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                    Etaj {request.fromFloor}
                  </span>
                )}
                {request.fromElevator !== undefined && (
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium ${request.fromElevator
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-600"
                    }`}>
                    {request.fromElevator ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                    {request.fromElevator ? "Cu lift" : "Fără lift"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Arrow / Divider */}
          <div className="relative flex items-center justify-center">
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
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm font-medium text-gray-700">
                    {request.toType === "house" ? <HomeIcon className="h-4 w-4 text-gray-500" /> : <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />}
                    {request.toType === "house" ? "Casă" : "Apartament"}
                  </span>
                )}
                {request.toFloor !== undefined && request.toFloor !== null && request.toFloor !== "" && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700">
                    <ArrowUpIcon className="h-4 w-4 text-gray-500" />
                    Etaj {request.toFloor}
                  </span>
                )}
                {request.toElevator !== undefined && (
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium ${request.toElevator
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-600"
                    }`}>
                    {request.toElevator ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                    {request.toElevator ? "Cu lift" : "Fără lift"}
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
            <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
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
          <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50">
              <CubeIcon className="h-5 w-5 text-purple-600" />
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
          <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
              <UserIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Persoană Contact</h4>
              <p className="mt-1 text-base font-semibold text-gray-900">{request.contactName}</p>
              {request.phone && <p className="text-sm text-gray-500">{request.phone}</p>}
            </div>
          </div>
        )}

        {/* Survey section removed */}
      </div>

      {/* Services */}
      {(request.serviceMoving || request.serviceTransportOnly || request.servicePacking || request.serviceAssembly || request.serviceDisposal || request.servicePackingMaterials) && (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <WrenchScrewdriverIcon className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Tip Serviciu</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                { key: "serviceMoving" as const, label: "Mutare completă", icon: TruckIcon, color: "blue" },
                { key: "serviceTransportOnly" as const, label: "Doar câteva lucruri", icon: ArchiveBoxIcon, color: "gray" },
                { key: "servicePacking" as const, label: "Împachetare lucruri", icon: InboxStackIcon, color: "purple" },
                { key: "serviceAssembly" as const, label: "Montaj / Demontare", icon: WrenchScrewdriverIcon, color: "orange" },
                { key: "serviceDisposal" as const, label: "Debarasare", icon: TrashIcon, color: "red" },
                { key: "servicePackingMaterials" as const, label: "Materiale împachetare", icon: ScissorsIcon, color: "green" },
              ] as const)
                .filter((s) => request[s.key])
                .map((s) => {
                  const colors: Record<string, string> = {
                    blue: "border-blue-200 bg-blue-50 text-blue-700",
                    gray: "border-gray-200 bg-gray-50 text-gray-700",
                    purple: "border-purple-200 bg-purple-50 text-purple-700",
                    orange: "border-orange-200 bg-orange-50 text-orange-700",
                    red: "border-red-200 bg-red-50 text-red-700",
                    green: "border-green-200 bg-green-50 text-green-700",
                  };
                  return (
                    <span key={s.key} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${colors[s.color]}`}>
                      <s.icon className="h-4 w-4" />
                      {s.label}
                    </span>
                  );
                })}
            </div>
          </div>
        )}

      {/* Additional Details */}
      {request.details && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Alte detalii</h3>
          </div>
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
            {request.details}
          </p>
        </div>
      )}

      {/* Media Gallery */}
      {localMediaUrls && localMediaUrls.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <PhotoIcon className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Poze & Video ({localMediaUrls.length})</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {localMediaUrls.map((url, index) => {
              const isVideo = /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url) || url.includes("%2F") && /\.(mp4|mov|webm|avi|mkv)(%|&|$)/i.test(url);

              return (
                <div
                  key={url}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-all hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100"
                >
                  {isVideo ? (
                    <>
                      <video
                        src={url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity group-hover:opacity-0">
                          <PlayIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={url}
                      alt={`Media ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      quality={75}
                    />
                  )}

                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                    aria-label={`Deschide ${isVideo ? "video" : "imagine"} ${index + 1}`}
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
                      title="Șterge fișier"
                      className="absolute top-2 right-2 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-500 hover:text-white group-hover:flex disabled:cursor-wait"
                    >
                      {deletingUrl === url ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
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

