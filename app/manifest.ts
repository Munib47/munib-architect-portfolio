import type { MetadataRoute } from 'next';

/*
 * Web app manifest.
 *
 * The site previously had no manifest at any of the paths crawlers and
 * browsers probe (/manifest.json, /site.webmanifest), and no theme-color.
 * Next serves this at /manifest.webmanifest and injects the <link rel="manifest">
 * automatically, so the path differs from the two the audit probed but the
 * discovery mechanism — the link tag — is the one browsers actually follow.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Munib Ahmad — Frontend Architect & Shopify Developer',
    short_name: 'Munib Ahmad',
    description:
      '27+ live Shopify stores and GoHighLevel funnels built by Munib Ahmad, a frontend architect specializing in Liquid theme development and CRM automation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0C',
    theme_color: '#0A0A0C',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
