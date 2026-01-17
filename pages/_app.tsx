// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "../globals.css";
import "react-day-picker/dist/style.css";

// Import dev error suppressor for cleaner console in development
import "@/utils/devErrorSuppressor";
import { pageView } from "@/utils/analytics";

// GA4 Measurement ID (from Firebase config)
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Self-hosted Inter font with optimal loading strategy
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load layout components to reduce initial bundle
const Navbar = dynamic(() => import("@/components/layout/Navbar"), {
  ssr: true,
  loading: () => (
    <header className="fixed top-0 left-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="text-2xl font-bold text-emerald-700">OferteMutare</div>
      </div>
    </header>
  ),
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: true,
  loading: () => <footer className="mt-10 border-t border-gray-200 bg-white py-14" />,
});

const CityLinksSection = dynamic(() => import("@/components/layout/CityLinksSection"), {
  ssr: true,
  loading: () => <section className="border-t border-gray-200 bg-slate-50 py-16" />,
});

// Lazy load non-critical components
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"), {
  ssr: false,
  loading: () => null,
});

// Defer Toaster until after hydration
const Toaster = dynamic(() => import("sonner").then((mod) => ({ default: mod.Toaster })), {
  ssr: false,
});

const ExitIntentPopup = dynamic(() => import("@/components/cro/ExitIntentPopup"), {
  ssr: false,
  loading: () => null,
});

const WhatsAppWidget = dynamic(() => import("@/components/cro/WhatsAppWidget"), {
  ssr: false,
  loading: () => null,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Track page views on route change (GA4 handles initial page view automatically)
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary>
      {/* Google Analytics 4 */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Fallback meta for pages that don't set their own <Head> */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta
          name="google-site-verification"
          content="Ua-OtirGRvnE0f7Q-HiI9YB9MDcONOYn1OpQg4HdaFY"
        />

        {/* Preconnect moved to _document.tsx */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo.webp" type="image/webp" sizes="any" />
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

      {/* Font wrapper for self-hosted Inter */}
      <div className={`${inter.variable} font-sans`}>
        <Navbar />

        {/* Offset content for the fixed navbar once, globally */}
        <main id="main-content" className="min-h-[60vh] pt-20">
          <Component {...pageProps} />
        </main>

        <CityLinksSection />
        <Footer />
      </div>

      {/* Conversion optimization widgets */}
      <FloatingCTA />
      <ExitIntentPopup />
      <WhatsAppWidget />

      {/* Toasts (success/error/info) from anywhere in the app - loaded after hydration */}
      <Toaster richColors position="top-right" closeButton />

      {/* Google Analytics 4 */}
      <GoogleAnalytics gaId="G-6624X6E5GQ" />
    </ErrorBoundary>
  );
}
