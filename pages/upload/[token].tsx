import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LayoutWrapper from "@/components/layout/Layout";
import { ArrowUpTrayIcon as Upload, CheckCircleIcon as CheckCircle, XCircleIcon as XCircle, ArrowPathIcon as Loader2, VideoCameraIcon as FileVideo } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { storage, db, auth } from "@/services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { logger } from "@/utils/logger";

interface FileWithProgress {
  file: File;
  progress: number;
  url?: string;
  preview?: string;
  error?: string;
}

interface TokenData {
  valid: boolean;
  requestId?: string;
  customerEmail?: string;
  customerName?: string;
  reason?: string;
  message?: string;
}

export default function UploadMediaPage() {
  const router = useRouter();
  const { token } = router.query;
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [validating, setValidating] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Validate token on mount
  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const validateToken = async () => {
      try {
        const resp = await fetch(`/api/validateUploadToken?token=${token}`);
        const data = await resp.json();
        setTokenData(data);
      } catch (err) {
        logger.error("Token validation error:", err);
        setTokenData({ valid: false, message: "Eroare la validarea token-ului" });
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  // Observe auth state (require sign-in for secure upload path)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
      setAuthChecking(false);
    });
    return () => unsub();
  }, []);

  // Generate preview thumbnails
  const generatePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
        };
        video.src = URL.createObjectURL(file);
      } else {
        resolve("");
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const filesWithProgress: FileWithProgress[] = await Promise.all(
        newFiles.map(async (file) => ({
          file,
          progress: 0,
          preview: await generatePreview(file),
        }))
      );
      setFiles((prev) => [...prev, ...filesWithProgress]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Selectează cel puțin un fișier pentru upload.");
      return;
    }

    if (!tokenData?.valid || !tokenData.requestId) {
      toast.error("Token invalid. Te rugăm să accesezi link-ul din email.");
      return;
    }

    if (!currentUser) {
      toast.error("Te rugăm să te autentifici pentru a încărca fișierele.");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Upload each file to Firebase Storage
      for (let i = 0; i < files.length; i++) {
        const fileWithProgress = files[i];
        const file = fileWithProgress.file;
        const fileExtension = file.name.split(".").pop();
        const fileName = `${Date.now()}_${i}.${fileExtension}`;
        const storageRef = ref(
          storage,
          `requests/${tokenData.requestId}/customers/${currentUser.uid}/${fileName}`
        );

        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, progress } : f)));
            },
            (error) => {
              logger.error("Upload error:", error);
              setFiles((prev) =>
                prev.map((f, idx) => (idx === i ? { ...f, error: error.message } : f))
              );
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedUrls.push(downloadURL);
              setFiles((prev) =>
                prev.map((f, idx) => (idx === i ? { ...f, url: downloadURL, progress: 100 } : f))
              );
              resolve();
            }
          );
        });
      }

      // Update request document with media URLs
      const requestRef = doc(db, "requests", tokenData.requestId);
      await updateDoc(requestRef, {
        mediaUrls: arrayUnion(...uploadedUrls),
      });

      // Mark token as used via secure API (Admin SDK)
      try {
        const idToken = await auth.currentUser?.getIdToken();
        const resp = await fetch("/api/markUploadTokenUsed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ token }),
        });
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `HTTP ${resp.status}`);
        }
      } catch (e: any) {
        logger.error("Failed to mark token used:", e?.message || e);
        toast.error("Nu am putut marca link-ul ca folosit.");
      }

      // Notify companies with offers
      await notifyCompanies(tokenData.requestId);

      setUploaded(true);
      toast.success("Fișierele au fost încărcate cu succes!");
    } catch (err) {
      logger.error("Upload failed", err);
      toast.error("Eroare la încărcarea fișierelor. Te rugăm să încerci din nou.");
    } finally {
      setUploading(false);
    }
  };

  const notifyCompanies = async (requestId: string) => {
    try {
      if (!currentUser) {
        logger.warn("Cannot notify companies: user not authenticated");
        return;
      }
      const idToken = await currentUser.getIdToken();
      const resp = await fetch("/api/notifyCompaniesOnUpload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ requestId }),
      });
      if (!resp.ok) {
        throw new Error(`notifyCompaniesOnUpload failed: ${resp.status}`);
      }
    } catch (err) {
      logger.error("Failed to notify companies:", err);
    }
  };

  // Loading state while validating token
  if (validating || authChecking) {
    return (
      <LayoutWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Se verifică token-ul...</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // Invalid token state
  if (!token || !tokenData?.valid) {
    return (
      <LayoutWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-rose-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Link invalid sau expirat</h2>
            <p className="mt-2 text-gray-600">
              {tokenData?.message || "Token-ul de upload lipsește sau este invalid."}
            </p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  // Require sign-in before allowing uploads
  if (!currentUser) {
    return (
      <LayoutWrapper>
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          <XCircle className="mx-auto h-16 w-16 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Autentificare necesară</h2>
          <p className="mt-2 text-gray-600">
            Te rugăm să te autentifici cu contul care a creat cererea pentru a încărca fișierele.
          </p>
          <Link
            href="/customer/auth"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white shadow hover:bg-emerald-700"
          >
            Mergi la autentificare
          </Link>
        </section>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3 border-b border-blue-100 pb-4">
            <Upload className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Încarcă poze și video</h1>
              <p className="text-sm text-gray-600">Pentru cererea ta de mutare</p>
            </div>
          </div>

          {uploaded ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-20 w-20 text-emerald-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                Fișierele au fost încărcate!
              </h3>
              <p className="mt-2 text-gray-600">
                Mulțumim! Companiile vor avea acces la materialele tale pentru a-ți oferi cele mai
                precise oferte.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  disabled={uploading}
                />
                <label
                  htmlFor="fileInput"
                  className={uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                >
                  <Upload className="mx-auto h-16 w-16 text-blue-400" />
                  <p className="mt-4 text-lg font-medium text-gray-700">
                    Click pentru a selecta fișiere
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Poze (JPG, PNG) sau Video (MP4, MOV) - max 50MB per fișier
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Fișiere selectate ({files.length}):
                  </p>
                  {files.map((fileWithProgress, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border bg-white shadow-sm">
                      <div className="flex items-center gap-3 p-3">
                        {/* Thumbnail preview */}
                        {fileWithProgress.preview && (
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded border">
                            {fileWithProgress.file.type.startsWith("image/") ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={fileWithProgress.preview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                <FileVideo className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {fileWithProgress.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(fileWithProgress.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>

                          {/* Progress bar */}
                          {uploading && (
                            <div className="mt-2">
                              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${fileWithProgress.progress}%` }}
                                />
                              </div>
                              <p className="mt-1 text-xs text-gray-600">
                                {fileWithProgress.progress === 100 ? (
                                  <span className="flex items-center gap-1 text-emerald-600">
                                    <CheckCircle className="h-3 w-3" />
                                    Încărcat
                                  </span>
                                ) : (
                                  `${fileWithProgress.progress.toFixed(0)}%`
                                )}
                              </p>
                            </div>
                          )}

                          {fileWithProgress.error && (
                            <p className="mt-1 text-xs text-rose-600">
                              Eroare: {fileWithProgress.error}
                            </p>
                          )}
                        </div>

                        {!uploading && (
                          <button
                            onClick={() => removeFile(i)}
                            className="rounded-full p-2 text-rose-500 hover:bg-rose-50"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Se încarcă...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Încarcă fișierele
                  </>
                )}
              </button>

              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>💡 Sfat:</strong> Pentru cele mai bune oferte, include:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>• Poze cu fiecare cameră și mobilierul din ea</li>
                  <li>• Fotografii cu obiecte voluminoase sau fragile</li>
                  <li>• Video scurt cu accesul (scări, lift, intrare)</li>
                  <li>• Poze cu spații de depozitare (pivniță, pod)</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </LayoutWrapper>
  );
}
