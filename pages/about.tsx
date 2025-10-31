import LayoutWrapper from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <LayoutWrapper>
      <section className="mx-auto max-w-3xl px-2 py-6 text-center sm:px-4 sm:py-10">
        <h1 className="mb-4 text-3xl font-bold text-emerald-700 sm:text-4xl">
          Despre Ofertemutare.ro
        </h1>
        <p className="mx-auto max-w-prose text-base leading-relaxed text-gray-600 sm:text-lg">
          Ofertemutare.ro conectează clienții cu firme de mutări verificate din România. Simplu,
          sigur și rapid — platforma unde găsești ofertele potrivite pentru mutarea ta.
        </p>
      </section>
    </LayoutWrapper>
  );
}
