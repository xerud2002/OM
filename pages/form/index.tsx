"use client";
import { useState } from "react";

export default function MoveFormPage() {
  const [data, setData] = useState({
    fromCity: "",
    toCity: "",
    date: "",
    volume: "",
    extras: [] as string[],
    notes: "",
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="max-w-3xl bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 w-full">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6">
          Cere oferte pentru mutare
        </h1>
        <p className="text-gray-600 mb-4">
          Completează formularul pentru a primi oferte personalizate de la firme
          verificate.
        </p>
      </div>
    </main>
  );
}
