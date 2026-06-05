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
};

export default nextConfig;
