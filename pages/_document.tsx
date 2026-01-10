import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ro">
      <Head>
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

        {/* Preload LCP hero image for faster rendering */}
        <link rel="preload" as="image" href="/pics/index.webp" type="image/webp" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
