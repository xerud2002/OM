import Head from "next/head";
import SavingsCalculator from "@/components/cro/SavingsCalculator";
import LayoutWrapper from "@/components/layout/Layout";
import CTASection from "@/components/home/CTASection";

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>Calculator Preț Mutare 2026 - Vezi Cât Economisești | OferteMutare.ro</title>
        <meta
          name="description"
          content="Folosește calculatorul nostru gratuit pentru a estima costul mutării tale și vezi cât poți economisi comparând oferte. Prețuri actualizate 2026."
        />
      </Head>

      <LayoutWrapper>
        <div className="bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <h1 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Calculator Economii Mutare
            </h1>
            <p className="mb-12 text-center text-lg text-gray-600">
              Vezi instant cât poți economisi alegând firma potrivită prin platforma noastră.
            </p>

            <SavingsCalculator />

            <div className="mt-16 text-center">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Cum funcționează estimarea?
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 text-3xl">📊</div>
                  <h3 className="mb-2 font-bold">Date Reale</h3>
                  <p className="text-gray-600">
                    Analizăm prețurile medii din piață versus ofertele companiilor partenere.
                  </p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 text-3xl">🏘️</div>
                  <h3 className="mb-2 font-bold">Specific orașului</h3>
                  <p className="text-gray-600">
                    Luăm în calcul diferențele de cost dintre orașe (București vs provincie).
                  </p>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 text-3xl">🏷️</div>
                  <h3 className="mb-2 font-bold">Fără comisioane</h3>
                  <p className="text-gray-600">
                    Platforma este 100% gratuită pentru tine. Plătești doar serviciul firmei.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CTASection />
      </LayoutWrapper>
    </>
  );
}
