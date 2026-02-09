// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { loadGoogleAnalytics } from "@/utils/interactionLoader";
import { hasConsent } from "@/utils/cookies";
import { CONSENT_EVENT } from "@/components/CookieConsent";
// Vercel Analytics removed - site is self-hosted on VPS, not Vercel
import "../globals.css";
import "react-day-picker/dist/style.css";

// Dev error suppressor loaded only in development (tree-shaken in production)
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/utils/devErrorSuppressor");
}
import { pageView } from "@/utils/analytics";

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
  loading: () => (
    <footer className="mt-10 border-t border-gray-200 bg-white py-14" />
  ),
});

// Lazy load non-critical components
const FloatingCTA = dynamic(() => import("@/components/FloatingCTA"), {
  ssr: false,
  loading: () => null,
});

// Defer Toaster until after hydration
const Toaster = dynamic(
  () => import("sonner").then((mod) => ({ default: mod.Toaster })),
  {
    ssr: false,
  },
);

const ExitIntentPopup = dynamic(
  () => import("@/components/cro/ExitIntentPopup"),
  {
    ssr: false,
    loading: () => null,
  },
);

const WhatsAppWidget = dynamic(
  () => import("@/components/cro/WhatsAppWidget"),
  {
    ssr: false,
    loading: () => null,
  },
);

const CookieConsentBanner = dynamic(
  () => import("@/components/CookieConsent"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Check if current route is a dashboard route (no header/footer)
  const isDashboardRoute =
    router.pathname.startsWith("/customer") ||
    router.pathname.startsWith("/company") ||
    router.pathname.startsWith("/admin");

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

  // Load Google Analytics only if user has consented to analytics cookies
  useEffect(() => {
    const GA_ID = "G-6624X6E5GQ";

    // Load now if consent already exists (returning visitor)
    if (hasConsent("analytics")) {
      loadGoogleAnalytics(GA_ID);
    }

    // Listen for consent updates (new visitor clicks accept)
    const onConsent = (e: Event) => {
      const consent = (e as CustomEvent).detail;
      if (consent?.analytics) {
        loadGoogleAnalytics(GA_ID);
      }
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

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

        {/* Preconnect moved to _document.tsx */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <link
          rel="icon"
          href="/favicon-32x32.webp"
          type="image/png"
          sizes="32x32"
        />
        <link rel="icon" href="/logo.webp" type="image/webp" sizes="any" />
        <title>
          Ofertemutare.ro | Oferte reale de la firme de mutări verificate
        </title>
        <meta
          name="description"
          content="Primește rapid oferte reale de la firme de mutări verificate din România. Compară prețuri și alege varianta potrivită pentru tine."
        />

        {/* Open Graph tags - only global defaults, pages override with their own */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OferteMutare.ro" />
        <meta property="og:locale" content="ro_RO" />
        {/* og:url, og:title, og:description are set per-page to match canonical URLs */}

        {/* Twitter Card tags - only card type, pages set their own title/description */}
        <meta name="twitter:card" content="summary_large_image" />
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
        {!isDashboardRoute && <Navbar />}

        <main
          id="main-content"
          className={isDashboardRoute ? "min-h-screen" : "min-h-[60vh] pt-20"}
        >
          <Component {...pageProps} />
        </main>

        {!isDashboardRoute && <Footer />}
      </div>

      {/* Conversion optimization widgets - only show on public pages */}
      {!isDashboardRoute && (
        <>
          <FloatingCTA />
          <ExitIntentPopup />
          <WhatsAppWidget />
        </>
      )}

      {/* GDPR Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Toasts (success/error/info) from anywhere in the app - loaded after hydration */}
      <Toaster richColors position="top-right" closeButton />
    </ErrorBoundary>
  );
}
