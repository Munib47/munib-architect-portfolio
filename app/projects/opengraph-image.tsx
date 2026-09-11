import { ImageResponse } from 'next/og';
import { OgImageContent, ogImageSize, ogImageContentType } from '@/lib/og-image';

/*
 * Social card for the /projects hub.
 *
 * Needed explicitly: opengraph-image at the app root covers "/" but is not
 * picked up by this segment, so without this file /projects would be the one
 * URL in the sitemap shipping no og:image — verified by walking the rendered
 * HTML of all 29 URLs, not assumed.
 *
 * Reuses the same branded card as the homepage rather than introducing a
 * third design; the per-project cards in [id]/opengraph-image.tsx are the ones
 * that need to differ, because they name the project.
 */

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = 'Munib Ahmad — 27 live Shopify and GoHighLevel projects';

export default function Image() {
  return new ImageResponse(<OgImageContent />, size);
}
