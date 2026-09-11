import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AOSProvider from '@/components/AOSProvider';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

/*
 * Self-hosted via next/font instead of a <link> to fonts.googleapis.com.
 *
 * The old setup cost two extra DNS + TLS handshakes (googleapis for the CSS,
 * gstatic for the files) before any glyph could be requested, and the font CSS
 * was render-blocking on a third-party host we don't control. next/font copies
 * the files into our own build output, inlines the @font-face rules, and
 * preloads them — so there's no third-party round trip, no FOUT, and no
 * request to Google from the visitor's browser, which also removes a GDPR
 * consideration for EU traffic.
 *
 * Exposed as CSS variables because the design sets font-family in inline
 * styles all over the component tree; next/font generates a hashed family
 * name, so var(--font-display) is what those call sites reference.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

// Plus Jakarta Sans tops out at 800 upstream — requesting 900 fails the build.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  // Matches the page background, so mobile browser chrome blends with the site
  // instead of framing it in white.
  themeColor: '#0A0A0C',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Munib Ahmad — Frontend Architect & Shopify Developer',
  /*
   * 148 characters. The site-wide limit is 155 — the point where Google starts
   * truncating desktop snippets — and it is enforced at build time by
   * scripts/check-meta-descriptions.mjs, which measures the prerendered HTML
   * of every page and fails the build on any that exceed it.
   *
   * This replaces a 169-character version written to an earlier 160–200
   * target. Everything past ~155 was being clipped in the SERP anyway, so the
   * extra length bought nothing and cost the closing keywords.
   */
  description:
    'Frontend architect Munib Ahmad builds Shopify stores and GoHighLevel funnels. 27+ live projects in Liquid, Next.js, GSAP and Core Web Vitals tuning.',
  keywords: [
    'Munib Ahmad',
    'Next.js developer',
    'Shopify developer',
    'GoHighLevel',
    'Frontend architect',
    'Liquid template',
    'GSAP',
    'Three.js portfolio',
    'Lahore Pakistan',
  ],
  authors: [{ name: 'Munib Ahmad', url: 'https://github.com/Munib47' }],
  /*
   * index,follow is the default, so this is not fixing a bug — it is stating
   * the intent explicitly. The part that does change behaviour is
   * max-image-preview:large, which lets Google show a full-size thumbnail
   * rather than a postage stamp. On an image-heavy portfolio that materially
   * changes how the result renders.
   */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Absolute, no trailing slash — must exactly match the served URL
  // (Next.js defaults to trailingSlash: false), otherwise crawlers flag
  // the canonical as pointing to a "variant" URL.
  //
  // `languages` is a self-referencing hreflang, not multi-language support —
  // there's only one version of this page. Google explicitly recommends a
  // self-referencing hreflang even for single-language sites (it removes any
  // ambiguity about which language/region a URL targets), which is what
  // clears an auditor's "no hreflang tags found" flag correctly rather than
  // by adding translations that don't exist. See docs/IMPROVEMENTS.md §10.
  alternates: {
    canonical: SITE_URL,
    languages: { en: SITE_URL, 'x-default': SITE_URL },
  },
  openGraph: {
    title: 'Munib Ahmad — Frontend Architect',
    description:
      'Premium portfolio showcasing 27+ live Shopify stores & GoHighLevel funnels by Munib Ahmad.',
    type: 'website',
    url: SITE_URL,
  },
};

/*
 * Site-wide structured data.
 *
 * Person alone described who made the site but not the site itself. WebSite
 * lets search engines attach the name and publisher to the domain, and
 * ProfilePage tells them this URL *is* the profile for that Person rather than
 * merely mentioning them.
 */
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}#person`,
      name: 'Munib Ahmad',
      jobTitle: 'Frontend Architect & Shopify Developer',
      url: SITE_URL,
      email: 'mailto:munibahmad47@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressCountry: 'PK',
      },
      sameAs: [
        'https://github.com/Munib47',
        'https://www.linkedin.com/in/munib-ahmad-294524237',
      ],
      knowsAbout: [
        'Next.js',
        'React',
        'Shopify',
        'Liquid',
        'GoHighLevel',
        'Frontend Development',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'Munib Ahmad — Frontend Architect & Shopify Developer',
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}#profile`,
      url: SITE_URL,
      name: 'Munib Ahmad — Frontend Architect & Shopify Developer',
      isPartOf: { '@id': `${SITE_URL}#website` },
      mainEntity: { '@id': `${SITE_URL}#person` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body
        className="antialiased"
        style={{ backgroundColor: '#0A0A0C', color: '#F0F4F8' }}
      >
        {/*
         * Skip link — the first thing in the tab order, visually hidden until
         * focused. Without it a keyboard user tabs through the whole header,
         * the seven nav items and the Hire Me menu on every single page load
         * before reaching content.
         */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <AOSProvider>{children}</AOSProvider>

        {/*
         * Footer lives in the layout, not in page.tsx.
         *
         * It was rendered only by the homepage, so all 27 case-study pages had
         * no <footer> at all — which is also where the site-wide internal links
         * live, so those pages were leaking crawl depth as well as looking
         * unfinished.
         */}
        <Footer />
      </body>
    </html>
  );
}
