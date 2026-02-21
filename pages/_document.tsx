import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ro">
      <Head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NN2XXQVV');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Theme color for mobile browser chrome */}
        <meta name="theme-color" content="#059669" />
        <meta
          name="theme-color"
          content="#059669"
          media="(prefers-color-scheme: light)"
        />

        {/* Favicon - REQUIRED for Google search results */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.webp"
        />
        <link rel="apple-touch-icon" href="/favicon-32x32.webp" />

        {/* DNS prefetch for Firebase (loaded on interaction, not critical path) */}
        <link rel="dns-prefetch" href="https://omro-e5a88.firebaseapp.com" />
        <link
          rel="dns-prefetch"
          href="https://identitytoolkit.googleapis.com"
        />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Critical CSS for LCP - inline to avoid render-blocking */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              h1{font-weight:800;letter-spacing:-.025em;color:#0f172a}
              .text-emerald-600{color:#059669}
              .bg-linear-to-br{background:linear-gradient(to bottom right,#f8fafc,#fff,rgba(236,253,245,.3))}
            `,
          }}
        />

        {/* Google Analytics - loaded via @next/third-parties in _app.tsx */}

        {/* Ahrefs Web Analytics */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="qq/hQQbdCPHs3jKxFxfMkg"
          async
        />
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NN2XXQVV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
