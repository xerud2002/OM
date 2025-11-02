import Head from "next/head";
import LayoutWrapper from "@/components/layout/Layout";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact - Ofertemutare.ro</title>
        <meta
          name="description"
          content="Ai întrebări despre platforma ofertemutare.ro sau ai nevoie de suport? Contactează-ne la contact@ofertemutare.ro pentru ajutor rapid."
        />
        <link rel="canonical" href="https://ofertemutare.ro/contact" />
      </Head>
      
      <LayoutWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-4 text-3xl font-bold text-emerald-700">Contactează-ne</h1>
        <p className="max-w-md text-gray-600">
          Dacă ai întrebări despre platforma ofertemutare.ro sau ai nevoie de suport, scrie-ne la{" "}
          <a href="mailto:contact@ofertemutare.ro" className="text-emerald-500 underline">
            contact@ofertemutare.ro
          </a>
          .
        </p>
      </main>
    </LayoutWrapper>
    </>
  );
}
