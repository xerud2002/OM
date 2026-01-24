import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ro">
      <Head>
        {/* Favicon - REQUIRED for Google search results */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon-32x32.png" />

        {/* Critical preconnects for Firebase auth chain (reduces network dependency ~500ms) */}
        <link rel="preconnect" href="https://omro-e5a88.firebaseapp.com" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href="https://identitytoolkit.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://securetoken.googleapis.com" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href="https://firebasestorage.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://apis.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Critical CSS for LCP - inline to avoid render-blocking */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              h1{font-weight:800;letter-spacing:-.025em;color:#0f172a}
              .text-emerald-600{color:#059669}
              .bg-gradient-to-br{background:linear-gradient(to bottom right,#f8fafc,#fff,rgba(236,253,245,.3))}
            `,
          }}
        />

        {/* Google Analytics - loaded via @next/third-parties in _app.tsx */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
