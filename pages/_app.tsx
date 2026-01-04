// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";
import "../globals.css";
import "react-day-picker/dist/style.css";

// Import dev error suppressor for cleaner console in development
import "@/utils/devErrorSuppressor";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";

// Lazy load non-critical components
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"), {
  ssr: false,
  loading: () => null,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      {/* Fallback meta for pages that don't set their own <Head> */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta
          name="google-site-verification"
          content="Ua-OtirGRvnE0f7Q-HiI9YB9MDcONOYn1OpQg4HdaFY"
        />
        
        {/* Preconnect for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Optimized font loading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo-square.webp" type="image/webp" sizes="64x64" />
        <title>Ofertemutare.ro — Oferte reale de la firme de mutări verificate</title>
        <meta
          name="description"
          content="Primește rapid oferte reale de la firme de mutări verificate din România. Compară prețuri și alege varianta potrivită pentru tine."
        />
      </Head>

      {/* A11y: skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-999 focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Sar peste navigare
      </a>

      <Navbar />

      {/* Offset content for the fixed navbar once, globally */}
      <main id="main-content" className="min-h-[60vh] pt-20">
        <Component {...pageProps} />
      </main>

      <Footer />

      {/* Conversion optimization widgets */}
      <FloatingCTA />

      {/* Toasts (success/error/info) from anywhere in the app */}
      <Toaster richColors position="top-right" closeButton />
    </ErrorBoundary>
  );
}
