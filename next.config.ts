import type { NextConfig } from 'next';

/*
 * Content Security Policy.
 *
 * Report-Only for now, deliberately. The site inlines JSON-LD and a number of
 * <style> blocks, and Next itself injects inline bootstrap scripts, so a
 * blocking policy would need nonces threaded through all of it. Shipping this
 * in report mode first means violations show up in the browser console and any
 * configured report collector without risking a blank page in production.
 *
 * To enforce it later: rename the header to 'Content-Security-Policy' *after*
 * confirming the console is clean on the homepage, a case study and /projects.
 * 'unsafe-inline' on script-src is what should be replaced with a nonce at that
 * point — it is the directive doing the least work here.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // 'unsafe-inline' + 'unsafe-eval' cover Next's inline bootstrap and the
  // dev-mode refresh runtime. 'unsafe-eval' can be dropped once verified.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Inline <style> blocks and style attributes are used throughout the design.
  "style-src 'self' 'unsafe-inline'",
  // Fonts are self-hosted via next/font now, so no fonts.gstatic.com entry.
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = [
  {
    // Vercel serves everything over HTTPS already; this header tells
    // browsers to enforce it on future visits too (and is required
    // before submitting the domain to the HSTS preload list).
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Stops browsers second-guessing a declared Content-Type, which is how a
    // served asset ends up being executed as something it isn't.
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Full URL to same-origin, origin only to cross-origin, nothing on a
    // downgrade — so outbound links can't leak the path being read.
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Legacy counterpart to CSP frame-ancestors, for browsers that predate it.
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    // The site asks for none of these, so denying them outright means a
    // compromised third-party script can't ask on our behalf.
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: CSP_REPORT_ONLY,
  },
];

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
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
