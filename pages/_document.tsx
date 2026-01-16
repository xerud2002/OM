import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ro">
      <Head>
        {/* Favicon - REQUIRED for Google search results */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon-32x32.png" />

        {/* Critical preconnects for Firebase (LCP improvement ~310ms) */}
        <link rel="preconnect" href="https://omro-e5a88.firebaseapp.com" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href="https://firebasestorage.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href="https://identitytoolkit.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://apis.google.com" />

        {/* Preload LCP hero image for faster rendering - mobile-optimized */}
        <link
          rel="preload"
          as="image"
          href="/pics/index.webp"
          type="image/webp"
          imageSizes="(max-width: 768px) 100vw, 600px"
        />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
                anonymize_ip: true
              });
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
