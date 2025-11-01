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
};

export default nextConfig;
