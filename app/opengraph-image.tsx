import { ImageResponse } from 'next/og';
import { OgImageContent, ogImageSize, ogImageContentType } from '@/lib/og-image';

// No `runtime = 'edge'` — this content is static (never depends on the
// request), so leaving the default Node runtime lets Next.js generate it
// once at build time instead of on every request.
export const alt = 'Munib Ahmad — Frontend Architect & Shopify Developer';
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
