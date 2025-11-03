/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Carry over rich image config from the CJS file
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'omro-e5a88.firebasestorage.app',
        pathname: '/**',
      },
    ],
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Compress pages for better performance
  compress: true,

  // Performance optimizations
  poweredByHeader: false,

  // Development configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },

  // Development configuration for CORS
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      serverComponentsExternalPackages: [],
    },
    // Allow dev origins for cross-origin requests
    allowedDevOrigins: ['127.0.0.1:*', 'localhost:*'],
  }),
};

export default nextConfig;
