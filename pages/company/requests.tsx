import LayoutWrapper from "@/components/layout/Layout";

export default function CompanyRequestsPage() {
  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-5xl py-10 text-center">
        <h1 className="mb-4 text-3xl font-bold text-emerald-700">
          Cereri de mutare primite
        </h1>
        <p className="text-gray-600">
          Aici vor apărea cererile de mutare trimise de clienți.
        </p>
      </section>
    </LayoutWrapper>
  );
}
