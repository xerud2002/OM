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
    ],
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Compress pages for better performance
  compress: true,

  // Performance optimizations
  poweredByHeader: false,

  // Modularize imports for tree-shaking
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
    },
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
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
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
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
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
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

export default nextConfig;
