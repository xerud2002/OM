// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import "../globals.css";
import "react-day-picker/dist/style.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import FloatingCTA from "@/components/FloatingCTA";
import UrgencyBanner from "@/components/UrgencyBanner";
import LiveActivityPopup from "@/components/LiveActivityPopup";
import LiveChatWidget from "@/components/LiveChatWidget";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { initAnalytics, trackPageview } from "@/utils/analytics";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Initialize analytics and track page views
  useEffect(() => {
    initAnalytics();
    
    const handleRouteChange = (url: string) => {
      trackPageview(url);
    };

    // Track initial page load
    trackPageview(router.asPath);

    // Track subsequent navigation
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    // Initialize analytics on mount
    initAnalytics();
  }, []);
  // Feature flags (default disabled). Toggle with NEXT_PUBLIC_ENABLE_URGENCY_BANNER / NEXT_PUBLIC_ENABLE_LIVE_POPUP
  const enableUrgencyBanner = process.env.NEXT_PUBLIC_ENABLE_URGENCY_BANNER === "true";
  const enableLiveActivityPopup = process.env.NEXT_PUBLIC_ENABLE_LIVE_POPUP === "true";
  return (
    <div className={`${inter.variable} font-sans`}>
      <ErrorBoundary>
        {/* Fallback meta for pages that don't set their own <Head> */}
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link rel="icon" href="/logo.png" type="image/png" />
          
          {/* Resource hints for external domains */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://firebase.googleapis.com" />
          <link rel="preconnect" href="https://firestore.googleapis.com" />
          <link rel="preconnect" href="https://storage.googleapis.com" />
          <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
          <link rel="dns-prefetch" href="https://securetoken.googleapis.com" />
          <link rel="dns-prefetch" href="https://accounts.google.com" />
          <link rel="dns-prefetch" href="https://api.emailjs.com" />
          
          <title>Ofertemutare.ro — Oferte reale de la firme de mutări verificate</title>
          <meta
            name="description"
            content="Primești rapid oferte reale de la firme de mutări verificate din România. Compară prețuri și alege varianta potrivită pentru tine."
          />
        </Head>

      {/* A11y: skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[999] focus:rounded-lg focus:bg-emerald-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Sar peste navigare
      </a>

      <Navbar />

      {/* Urgency banner - limited time offer (feature-flagged) */}
      {enableUrgencyBanner && <UrgencyBanner />}

      {/* Offset content for the fixed navbar once, globally */}
      <main id="main-content" className="min-h-[60vh] pt-[80px]">
        <Component {...pageProps} />
      </main>

      <Footer />

      {/* Conversion optimization widgets */}
      <FloatingCTA />
      {/* Live activity popup (feature-flagged) */}
      {enableLiveActivityPopup && <LiveActivityPopup />}
      <LiveChatWidget />

        {/* Toasts (success/error/info) from anywhere in the app */}
        <Toaster richColors position="top-right" closeButton />
      </ErrorBoundary>
    </div>
  );
}
