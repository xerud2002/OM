// components/customer/requestForm/MediaSection.tsx
// Media upload preference (now, later, none)

import React from "react";
import type { FormShape } from "./types";

type MediaUpload = "now" | "later" | "none";

type Props = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
};

const mediaOptions: { value: MediaUpload; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: "now",
    label: "Încarcă acum",
    desc: "Adaugă fotografii sau video imediat",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    value: "later",
    label: "Primește link",
    desc: "Vei primi un email cu link de încărcare",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    value: "none",
    label: "Fără materiale",
    desc: "Preferă să nu adauge imagini/video",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
    ),
  },
];

export default function MediaSection({ form, setForm }: Props) {
  return (
    <div className="rounded-xl border border-pink-200 bg-linear-to-br from-pink-50 to-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-pink-600 shadow-lg">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">Fotografii / Video</h4>
          <p className="text-xs text-gray-600">Ajută firmele să-ți facă oferte mai precise</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {mediaOptions.map((opt) => {
          const isSelected = form.mediaUpload === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((s) => ({ ...s, mediaUpload: opt.value }))}
              className={`group flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                isSelected
                  ? "border-pink-500 bg-pink-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/50"
              }`}
            >
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-500 group-hover:bg-pink-100 group-hover:text-pink-600"
                }`}
              >
                {opt.icon}
              </div>
              <div
                className={`text-sm font-semibold ${isSelected ? "text-pink-900" : "text-gray-900"}`}
              >
                {opt.label}
              </div>
              <div className="mt-1 text-xs text-gray-500">{opt.desc}</div>
              <div
                className={`mt-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected ? "border-pink-500 bg-pink-500" : "border-gray-300"
                }`}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Fotografiile ajută firmele să estimeze mai exact volumul și costul mutării.
      </p>
    </div>
  );
}
