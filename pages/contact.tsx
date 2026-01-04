import LayoutWrapper from "@/components/layout/Layout";
import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <LayoutWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 inline-flex rounded-full bg-linear-to-r from-emerald-100 to-teal-100 p-4 shadow-sm">
          <MessageCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mb-6 text-3xl font-bold sm:text-4xl">
          <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Contactează-ne
          </span>
        </h1>
        <p className="mb-8 max-w-md text-gray-600">
          Dacă ai întrebări despre platforma ofertemutare.ro sau ai nevoie de suport, suntem aici
          pentru tine!
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
            <h2 className="mb-2 font-semibold text-gray-800">Pentru Clienți</h2>
            <a
              href="mailto:contact@ofertemutare.ro"
              className="text-emerald-600 underline hover:text-emerald-700"
            >
              contact@ofertemutare.ro
            </a>
          </div>

          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-blue-600" />
            <h2 className="mb-2 font-semibold text-gray-800">Pentru Companii Partenere</h2>
            <a
              href="mailto:partener@ofertemutare.ro"
              className="text-blue-600 underline hover:text-blue-700"
            >
              partener@ofertemutare.ro
            </a>
          </div>
        </div>
      </main>
    </LayoutWrapper>
  );
}
