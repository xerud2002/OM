import { useState } from "react";
import { useRouter } from "next/router";
import LayoutWrapper from "@/components/layout/Layout";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function UploadMediaPage() {
  const router = useRouter();
  const { token } = router.query;
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
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

    setUploading(true);
    try {
      // In a real implementation, you would upload files to Firebase Storage
      // and then update the request document with the URLs
      
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setUploaded(true);
      toast.success("Fișierele au fost încărcate cu succes!");
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([]);
      }, 3000);
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Eroare la încărcarea fișierelor. Te rugăm să încerci din nou.");
    } finally {
      setUploading(false);
    }
  };

  if (!token) {
    return (
      <LayoutWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <XCircle className="mx-auto h-16 w-16 text-rose-500" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Link invalid</h2>
            <p className="mt-2 text-gray-600">Token-ul de upload lipsește sau este invalid.</p>
          </div>
        </div>
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
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Fișierele au fost încărcate!</h3>
              <p className="mt-2 text-gray-600">
                Mulțumim! Companiile vor avea acces la materialele tale pentru a-ți oferi cele mai precise oferte.
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
                />
                <label htmlFor="fileInput" className="cursor-pointer">
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
                <div className="mb-6 space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Fișiere selectate ({files.length}):
                  </p>
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border bg-white p-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="rounded-full p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
