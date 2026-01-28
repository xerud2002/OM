import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon as X, CheckIcon as Save, ExclamationCircleIcon as AlertCircle, TrashIcon as Trash2, PhotoIcon as ImageIcon, ArrowUpTrayIcon as Upload } from "@heroicons/react/24/outline";
import { MovingRequest } from "../../types";
import RequestForm from "./RequestForm";
import Image from "next/image";

type EditRequestModalProps = {
  request: MovingRequest | null;
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (requestId: string, updatedData: any) => Promise<void>;
};

export default function EditRequestModal({
  request,
  isOpen,
  onClose,
  onSave,
}: EditRequestModalProps) {
  const [form, setForm] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>([]);
  const [deletedMediaUrls, setDeletedMediaUrls] = useState<string[]>([]);

  // Initialize/refresh form values when opening or when request changes
  useEffect(() => {
    if (request && isOpen) {
      setForm({
        fromCity: request.fromCity || "",
        fromCounty: request.fromCounty || "",
        fromAddress: request.fromAddress || "",
        fromStreet: request.fromStreet || "",
        fromNumber: request.fromNumber || "",
        fromBloc: request.fromBloc || "",
        fromStaircase: request.fromStaircase || "",
        fromApartment: request.fromApartment || "",
        fromType: request.fromType || "",
        fromFloor: request.fromFloor ?? "",
        fromElevator: request.fromElevator ?? false,
        toCity: request.toCity || "",
        toCounty: request.toCounty || "",
        toAddress: request.toAddress || "",
        toStreet: request.toStreet || "",
        toNumber: request.toNumber || "",
        toBloc: request.toBloc || "",
        toStaircase: request.toStaircase || "",
        toApartment: request.toApartment || "",
        toType: request.toType || "",
        toFloor: request.toFloor ?? "",
        toElevator: request.toElevator ?? false,
        moveDate: request.moveDate || "",
        moveDateMode: "exact",
        moveDateStart: "",
        moveDateEnd: "",
        moveDateFlexDays: 3,
        details: request.details || "",
        fromRooms: (request as any).fromRooms ?? request.rooms ?? "",
        toRooms: (request as any).toRooms ?? request.rooms ?? "",
        rooms: request.rooms || "",
        volumeM3: request.volumeM3 || "",
        phone: request.phone || "",
        contactName: "",
        contactFirstName: "",
        contactLastName: "",
        needPacking: request.needPacking || false,
        hasElevator: request.hasElevator || false,
        budgetEstimate: request.budgetEstimate || 0,
        specialItems: request.specialItems || "",
        serviceMoving: request.serviceMoving || false,
        servicePacking: request.servicePacking || false,
        serviceDisassembly: request.serviceDisassembly || false,
        serviceCleanout: request.serviceCleanout || false,
        serviceStorage: request.serviceStorage || false,
        surveyType: request.surveyType || "quick-estimate",
        mediaUpload: "now",
        mediaFiles: [],
      });
      setExistingMediaUrls(request.mediaUrls || []);
      setDeletedMediaUrls([]);
    }
  }, [request, isOpen]);

  const handleDeleteMedia = (url: string) => {
    setExistingMediaUrls((prev) => prev.filter((u) => u !== url));
    setDeletedMediaUrls((prev) => [...prev, url]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request || !form) return;

    setIsSaving(true);
    const { toast } = await import("sonner");

    try {
      // Upload new media files if any
      const newMediaUrls: string[] = [];
      if (form.mediaFiles && form.mediaFiles.length > 0) {
        // Check auth before attempting upload
        const { auth } = await import("@/services/firebase");
        const currentUser = auth.currentUser;

        if (!currentUser) {
          toast.error("Trebuie să fii autentificat pentru a încărca fișiere");
          throw new Error("User not authenticated");
        }

        // Verify user owns this request
        if (currentUser.uid !== request.customerId) {
          toast.error("Nu ai permisiunea să modifici această cerere");
          console.error(`Auth mismatch: user ${currentUser.uid} != customer ${request.customerId}`);
          throw new Error("Permission denied: user does not own this request");
        }

        toast.info(`Se încarcă ${form.mediaFiles.length} fișier(e)...`);

        const { ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
        const { storage } = await import("@/services/firebase");

        for (const file of Array.from(form.mediaFiles) as File[]) {
          try {
            const fileName = `${Date.now()}_${file.name}`;
            const storagePath = `requests/${request.id}/customers/${request.customerId}/${fileName}`;
            const storageRef = ref(storage, storagePath);

            // Upload file
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Wait for upload to complete
            await new Promise((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                null,
                (error) => reject(error),
                async () => {
                  try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    newMediaUrls.push(downloadURL);
                    resolve(downloadURL);
                  } catch (error) {
                    reject(error);
                  }
                }
              );
            });
          } catch (uploadError) {
            console.error(`Failed to upload ${file.name}:`, uploadError);
            console.error("Upload error details:", {
              code: (uploadError as any)?.code,
              message: (uploadError as any)?.message,
              serverResponse: (uploadError as any)?.serverResponse,
            });
            toast.error(`Nu s-a putut încărca fișierul ${file.name}`);
            throw uploadError;
          }
        }
      }

      // Note: We don't physically delete files from Storage here
      // Files are just removed from the mediaUrls array in Firestore
      // This avoids issues with signed URLs and path extraction
      // Storage cleanup can be done via Cloud Functions or manual admin process

      if (deletedMediaUrls.length > 0) {
        console.warn(`Marking ${deletedMediaUrls.length} file(s) as removed from request`);
      }

      // Combine existing (not deleted) + new URLs
      const finalMediaUrls = [...existingMediaUrls, ...newMediaUrls];

      const updatedData = {
        ...form,
        // keep legacy rooms field updated for UI that still reads it
        rooms: form.toRooms || form.fromRooms || form.rooms || "",
        mediaUrls: finalMediaUrls,
      };

      await onSave(request.id, updatedData);
      toast.success("Cererea a fost actualizată cu succes!");
      onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
      const errorMessage = error instanceof Error ? error.message : "Eroare necunoscută";
      toast.error(`Eroare la actualizare: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!request || !form) return null;

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
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-sky-50 px-6 py-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Modifică cererea</h2>
                  <p className="mt-1 text-sm text-gray-600">Actualizează detaliile mutării tale</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-white/80"
                  disabled={isSaving}
                  aria-label="Închide"
                  title="Închide"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Warning */}
              <div className="border-b border-yellow-200 bg-yellow-50 px-6 py-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0 text-yellow-600" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold">Notă importantă:</p>
                    <p>
                      Companiile care au trimis oferte vor fi notificate automat despre modificările
                      tale.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[calc(90vh-220px)] overflow-y-auto p-6">
                {isSaving && form.mediaFiles && form.mediaFiles.length > 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-4 text-sm text-gray-600">
                      Se încarcă fișierele ({form.mediaFiles.length})...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Media Management Section */}
                    {(existingMediaUrls.length > 0 ||
                      (form.mediaFiles && form.mediaFiles.length > 0)) && (
                      <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-amber-600" />
                          <h3 className="text-lg font-semibold text-gray-900">Poze și video</h3>
                        </div>

                        {/* Existing Media */}
                        {existingMediaUrls.length > 0 && (
                          <div className="mb-4">
                            <p className="mb-3 text-sm font-medium text-gray-700">
                              Fișiere existente ({existingMediaUrls.length})
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                              {existingMediaUrls.map((url, index) => (
                                <div
                                  key={url}
                                  className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                                >
                                  <Image
                                    src={url}
                                    alt={`Media ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 45vw, (max-width: 768px) 25vw, 150px"
                                    className="object-cover"
                                    loading="lazy"
                                    quality={75}
                                  />
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                                  >
                                    <span className="text-xs font-medium text-white">Vezi</span>
                                  </a>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteMedia(url);
                                    }}
                                    className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                    title="Șterge"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New Files Preview */}
                        {form.mediaFiles && form.mediaFiles.length > 0 && (
                          <div>
                            <p className="mb-3 text-sm font-medium text-emerald-700">
                              Fișiere noi de încărcat ({form.mediaFiles.length})
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                              {(Array.from(form.mediaFiles) as File[]).map((file, index) => (
                                <div
                                  key={index}
                                  className="group relative aspect-square overflow-hidden rounded-lg border-2 border-emerald-200 bg-emerald-50"
                                >
                                  {file.type.startsWith("image/") ? (
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      fill
                                      sizes="(max-width: 640px) 45vw, (max-width: 768px) 25vw, 150px"
                                      className="object-cover"
                                      quality={75}
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center">
                                      <Upload className="h-8 w-8 text-emerald-600" />
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      const newFiles = (
                                        Array.from(form.mediaFiles) as File[]
                                      ).filter((_, i) => i !== index);
                                      setForm((s: any) => ({ ...s, mediaFiles: newFiles }));
                                    }}
                                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                    title="Șterge"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <RequestForm
                      form={form}
                      setForm={setForm}
                      onSubmit={handleSave}
                      onReset={() => {
                        onClose();
                      }}
                    />
                  </>
                )}
              </div>

              {/* Footer - only shown if not using form buttons */}
              <div className="hidden border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Se salvează...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Salvează modificările
                      </>
                    )}
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
