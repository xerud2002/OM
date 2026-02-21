const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Target modern browsers only - removes legacy polyfills (~13KB savings)
  // Supports browsers with ES2020+ features
  transpilePackages: [],

  images: {
    // Carry over rich image config from the CJS file
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80],
    minimumCacheTTL: 31536000, // 1 year cache
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "omro-e5a88.firebasestorage.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Compress pages for better performance
  compress: true,

  // Performance optimizations
  poweredByHeader: false,

  // Modularize imports for tree-shaking
  modularizeImports: {},

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "sonner",
      "framer-motion",
      "date-fns",
      "firebase",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage",
    ],
  },

  // 301 Redirects for URL restructuring (preserve SEO)
  async redirects() {
    return [
      // Mutări - moved to /mutari/tipuri/
      {
        source: "/servicii/mutari-apartamente",
        destination: "/mutari/tipuri/apartamente",
        permanent: true,
      },
      {
        source: "/servicii/mutari-case",
        destination: "/mutari/tipuri/case",
        permanent: true,
      },
      {
        source: "/servicii/mutari-studenti",
        destination: "/mutari/tipuri/studenti",
        permanent: true,
      },
      {
        source: "/servicii/mutari-companii",
        destination: "/mutari/tipuri/birouri",
        permanent: true,
      },
      // Specializate
      {
        source: "/servicii/mutari-piane",
        destination: "/mutari/specializate/piane",
        permanent: true,
      },
      // Servicii - reorganized
      {
        source: "/servicii/impachetare-profesionala",
        destination: "/servicii/impachetare/profesionala",
        permanent: true,
      },
      {
        source: "/servicii/materiale-impachetare",
        destination: "/servicii/impachetare/materiale",
        permanent: true,
      },
      {
        source: "/servicii/demontare-montare-mobila",
        destination: "/servicii/montaj/mobila",
        permanent: true,
      },
      // Article URL path consolidation (Feb 2026)
      // Direct shortcuts to avoid redirect chains (articles → final destination)
      {
        source: "/articles/impachetare",
        destination: "/servicii/impachetare/profesionala",
        permanent: true,
      },
      {
        source: "/articles/survey",
        destination: "/articole/evaluare-mutare",
        permanent: true,
      },
      // All other /articles/ slugs → /articole/
      {
        source: "/articles/:slug",
        destination: "/articole/:slug",
        permanent: true,
      },
      {
        source: "/guides/:slug",
        destination: "/articole/:slug",
        permanent: true,
      },
      // Consolidated duplicate content (Feb 2026 - Search Console fix)
      {
        source: "/articole/impachetare",
        destination: "/servicii/impachetare/profesionala",
        permanent: true,
      },
      // Legacy URL renames
      {
        source: "/articole/survey",
        destination: "/articole/evaluare-mutare",
        permanent: true,
      },
      {
        source: "/articole/tips",
        destination: "/articole/sfaturi-mutari",
        permanent: true,
      },
    ];
  },

  // Development configuration
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Security Headers
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'" +
                (isDev ? " 'unsafe-eval'" : "") +
                " https://www.googletagmanager.com https://www.google-analytics.com https://apis.google.com https://*.firebaseio.com https://maps.googleapis.com https://analytics.ahrefs.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
              "connect-src 'self' https://*.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://apis.google.com https://*.firebaseio.com https://*.cloudfunctions.net https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.resend.com https://maps.googleapis.com wss://*.firebaseio.com",
              "worker-src 'self' blob:",
              "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
      // Prevent search engines from indexing admin and dashboard pages
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/company/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/customer/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      // Optimize font loading
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Optimize static assets (images)
      {
        source: "/pics/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Optimize JS/CSS chunks
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},

  // Webpack configuration for better development experience
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize webpack for development - disable aggressive polling
      config.watchOptions = {
        ignored: /node_modules/,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
