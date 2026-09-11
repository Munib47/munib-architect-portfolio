import { ImageResponse } from 'next/og';
import { OgImageContent, ogImageSize, ogImageContentType } from '@/lib/og-image';

// No `runtime = 'edge'` — see app/opengraph-image.tsx for why.
export const alt = 'Munib Ahmad — Frontend Architect & Shopify Developer';
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
