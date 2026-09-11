import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  serverExternalPackages: ['@react-pdf/renderer'],
  experimental: {
    optimizePackageImports: ['gsap', 'three', 'swiper'],
  },
  async headers() {
    return [
      {
        // Vercel serves everything over HTTPS already; this header tells
        // browsers to enforce it on future visits too (and is required
        // before submitting the domain to the HSTS preload list).
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
