// Central source of truth for the site's canonical origin — used by
// sitemap.ts, robots.ts, metadataBase, and JSON-LD.
//
// Override with NEXT_PUBLIC_SITE_URL once a custom domain is live (see
// docs/IMPROVEMENTS.md §1); falls back to the current Vercel URL so
// everything works with zero config in the meantime.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://munib-archetect-portfolio.vercel.app';
