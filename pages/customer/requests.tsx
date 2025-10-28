import LayoutWrapper from "@/components/layout/Layout";

export default function CustomerRequestsPage() {
  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-emerald-700">
          Cererile tale de mutare
        </h1>
        <p className="text-gray-600">
          Aici poți vedea cererile tale și ofertele primite de la firme.
        </p>
      </section>
    </LayoutWrapper>
  );
}
