import Head from "next/head";
import Link from "next/link";
import LayoutWrapper from "@/components/layout/Layout";
import {
  HomeIcon,
  TruckIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Pagina nu a fost găsită | OferteMutare.ro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <LayoutWrapper>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
          {/* Icon */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
            <MagnifyingGlassIcon className="h-12 w-12 text-emerald-500" />
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            404
          </h1>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            Pagina nu a fost găsită
          </p>
          <p className="mb-10 max-w-md text-slate-500">
            Ne pare rău, pagina pe care o cauți nu există sau a fost mutată. Te
            invităm să explorezi una dintre opțiunile de mai jos.
          </p>

          {/* Quick Links */}
          <div className="grid w-full max-w-lg gap-3 sm:grid-cols-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
            >
              <HomeIcon className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">
                Acasă
              </span>
            </Link>
            <Link
              href="/mutari"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
            >
              <TruckIcon className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">
                Mutări
              </span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
            >
              <PhoneIcon className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">
                Contact
              </span>
            </Link>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
}
