// components/customer/requestForm/MediaUploadSection.tsx
// Media upload options and file picker

import React, { useRef } from "react";
import type { FormShape, MediaUpload } from "./types";

type Props = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
};

const mediaOptions: { value: MediaUpload; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: "now",
    label: "Upload acum",
    desc: "Încarcă fotografii/video imediat",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
  },
  {
    value: "later",
    label: "Primesc link pe email",
    desc: "Vei primi un link pentru upload ulterior",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    value: "none",
    label: "Nu doresc să adaug poze",
    desc: "Continui fără a trimite fotografii/video",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
];

export default function MediaUploadSection({ form, setForm }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (list: FileList | null) => {
    if (!list) return;
    const newFiles = Array.from(list);
    setForm((s) => ({
      ...s,
      mediaFiles: [...(s.mediaFiles || []), ...newFiles],
    }));
  };

  const handleRemoveFile = (idx: number) => {
    setForm((s) => ({
      ...s,
      mediaFiles: (s.mediaFiles || []).filter((_, i) => i !== idx),
    }));
  };

  const handleClearFiles = () => {
    setForm((s) => ({ ...s, mediaFiles: [] }));
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">Poze și video</h4>
          <p className="text-xs text-gray-600">Alege cum vrei să trimiți media</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Option Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mediaOptions.map((opt) => {
            const isSelected = form.mediaUpload === opt.value;
            return (
              <label
                key={opt.value}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-md"
                    : "border-blue-200 hover:border-blue-400 hover:shadow-lg"
                }`}
              >
                <input
                  type="radio"
                  name="mediaUpload"
                  value={opt.value}
                  checked={isSelected}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, mediaUpload: e.target.value as MediaUpload }))
                  }
                  className="peer sr-only"
                />
                <div className="p-5">
                  <div
                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                    }`}
                  >
                    {opt.icon}
                  </div>
                  <h5 className="mb-1 font-semibold text-gray-900">{opt.label}</h5>
                  <p className="text-xs text-gray-600">{opt.desc}</p>
                </div>
                <div
                  className={`absolute top-3 right-3 h-6 w-6 items-center justify-center rounded-full bg-blue-500 ${
                    isSelected ? "flex" : "hidden"
                  }`}
                >
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
            );
          })}
        </div>

        {/* Upload Now: File Picker */}
        {form.mediaUpload === "now" && (
          <div className="rounded-lg border-2 border-dashed border-blue-300 bg-white p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => {
                handleAddFiles(e.target.files);
                e.currentTarget.value = "";
              }}
              className="hidden"
              id="mediaUploadInput"
            />
            <label htmlFor="mediaUploadInput" className="cursor-pointer">
              <svg
                className="mx-auto h-12 w-12 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Click pentru a încărca fișiere
              </p>
              <p className="mt-1 text-xs text-gray-500">Poze sau video (max 50MB per fișier)</p>
            </label>

            {/* File List */}
            {form.mediaFiles && form.mediaFiles.length > 0 && (
              <div className="mt-4 space-y-2 text-left">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-700">Fișiere selectate:</p>
                  <button
                    type="button"
                    onClick={handleClearFiles}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Șterge toate
                  </button>
                </div>
                {form.mediaFiles.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-xs font-medium text-gray-800">{file.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(i)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Șterge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Later: Info Message */}
        {form.mediaUpload === "later" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-medium">Vei primi un email cu link personalizat</p>
                <p className="mt-1 text-xs text-blue-700">
                  După trimiterea cererii, vei primi un email cu un link securizat unde poți încărca
                  fotografii și video în următoarele 7 zile.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
