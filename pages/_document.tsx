import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ro">
      <Head>
        {/* Preconnect for faster resource loading */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />

        {/* Preload LCP image for faster rendering */}
        <link
          rel="preload"
          as="image"
          href="/pics/index.webp"
          type="image/webp"
          fetchPriority="high"
        />

        {/* Inter font is now self-hosted via next/font in _app.tsx - no Google Fonts needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
