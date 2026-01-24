// components/customer/requestForm/SurveySection.tsx
// Survey type selection (in-person, video, quick estimate)

import React from "react";
import type { FormShape } from "./types";

type SurveyType = "in-person" | "video" | "quick-estimate";

type Props = {
  form: FormShape;
  setForm: React.Dispatch<React.SetStateAction<FormShape>>;
};

const surveyOptions: { value: SurveyType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    value: "in-person",
    label: "Evaluare la fața locului",
    desc: "Un specialist vine să evalueze volumul mutării",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    value: "video",
    label: "Video-evaluare",
    desc: "Consultație video pentru estimare rapidă",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    value: "quick-estimate",
    label: "Estimare rapidă",
    desc: "Ofertă bazată pe informațiile furnizate",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

export default function SurveySection({ form, setForm }: Props) {
  return (
    <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">Tip evaluare</h4>
          <p className="text-xs text-gray-600">Cum preferi să primești oferta?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {surveyOptions.map((opt) => {
          const isSelected = form.surveyType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((s) => ({ ...s, surveyType: opt.value }))}
              className={`group flex flex-col items-center rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                isSelected
                  ? "border-orange-500 bg-orange-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"
              }`}
            >
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  isSelected
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600"
                }`}
              >
                {opt.icon}
              </div>
              <div
                className={`text-sm font-semibold ${isSelected ? "text-orange-900" : "text-gray-900"}`}
              >
                {opt.label}
              </div>
              <div className="mt-1 text-xs text-gray-500">{opt.desc}</div>
              <div
                className={`mt-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                  isSelected ? "border-orange-500 bg-orange-500" : "border-gray-300"
                }`}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
