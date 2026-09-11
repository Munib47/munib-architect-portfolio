import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { SITE_URL } from '@/lib/site';

/*
 * The projects hub.
 *
 * /projects returned a 404 until now: all 27 case studies were reachable only
 * from the homepage grid, the sitemap had no hub URL, and the breadcrumb trail
 * on each case study pointed at a page that did not exist. A real indexable
 * listing gives the case studies a second entry point and somewhere for the
 * BreadcrumbList middle step to actually land.
 *
 * Deliberately a server component with no client-side filter state — this page
 * exists to be crawled. The interactive filtering already lives on the
 * homepage grid; duplicating it here would cost JavaScript for no SEO gain.
 */

const shopifyCount = projects.filter((p) => p.category === 'shopify').length;
const ghlCount = projects.filter((p) => p.category === 'ghl').length;

export const metadata: Metadata = {
  // 53 chars. The fuller "Projects — 27 Live Shopify & GoHighLevel Builds |
  // Munib Ahmad" came to 61 and would have been clipped in the SERP.
  title: 'All 27 Projects — Shopify & GoHighLevel | Munib Ahmad',
  description:
    `All ${projects.length} live projects by Munib Ahmad: ${shopifyCount} Shopify storefronts and ${ghlCount} GoHighLevel funnels, each with a full case study.`,
  alternates: {
    canonical: '/projects',
    languages: { en: '/projects', 'x-default': '/projects' },
  },
  openGraph: {
    title: 'Projects — 27 Live Shopify & GoHighLevel Builds',
    description: `${shopifyCount} Shopify storefronts and ${ghlCount} GoHighLevel funnels, each with a full case study.`,
    type: 'website',
    url: '/projects',
  },
};

const GROUPS = [
  {
    key: 'shopify' as const,
    label: 'Shopify Storefronts',
    blurb:
      'Theme engineering, Liquid development and Core Web Vitals work on live e-commerce stores.',
  },
  {
    key: 'ghl' as const,
    label: 'GoHighLevel Funnels',
    blurb:
      'Lead acquisition funnels, multi-step intake forms and CRM automation built in GoHighLevel.',
  },
];

export default function ProjectsIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/projects`,
        name: 'Projects',
        description: `All ${projects.length} live projects by Munib Ahmad.`,
        url: `${SITE_URL}/projects`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
        ],
      },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0C', color: '#F0F4F8' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Sticky top bar ── */}
      <nav
        aria-label="Breadcrumb"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(10,10,12,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 1.5rem',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '13px',
            fontWeight: 600,
            color: '#8892A4',
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>

        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #10B981, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Munib Ahmad
        </span>
      </nav>

      <main id="main" style={{ maxWidth: '1160px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
        <header style={{ marginBottom: '3.5rem', maxWidth: '720px' }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.9rem',
            }}
          >
            Project Index
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-stack-display)',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '1.1rem',
            }}
          >
            {projects.length} Live{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Projects
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: '#A0AEC0', lineHeight: 1.8 }}>
            {shopifyCount} Shopify storefronts and {ghlCount} GoHighLevel funnels, all in
            production. Each one has a full case study covering the problem, the build and
            what changed as a result.
          </p>
        </header>

        {GROUPS.map((group) => {
          const groupProjects = projects.filter((p) => p.category === group.key);
          return (
            <section key={group.key} style={{ marginBottom: '4rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-stack-display)',
                  fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  marginBottom: '0.5rem',
                }}
              >
                {group.label}{' '}
                <span style={{ color: '#6B7A8D', fontWeight: 600, fontSize: '0.7em' }}>
                  ({groupProjects.length})
                </span>
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7A8D', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                {group.blurb}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1rem',
                }}
              >
                {groupProjects.map((project) => {
                  return (
                    <li key={project.slug}>
                      <Link
                        href={`/projects/${project.slug}`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          background: '#0F1117',
                          border: `1px solid ${project.accentHex}22`,
                          textDecoration: 'none',
                        }}
                      >
                        {project.image && (
                          <div
                            style={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '980 / 577',
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={project.image}
                              alt={`${project.title} storefront screenshot`}
                              fill
                              sizes="(max-width: 700px) 100vw, 33vw"
                              style={{ objectFit: 'cover', objectPosition: 'top center' }}
                            />
                          </div>
                        )}

                        <div style={{ padding: '1.1rem 1.2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: project.accentHex,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            #{String(project.id).padStart(2, '0')} · {project.role}
                          </span>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.3 }}>
                            {project.title}
                          </h3>
                          {/* project.description, not seoDescription — the
                              latter is meta-only copy that ends "…by Munib
                              Ahmad", which reads as a byline on a card. */}
                          <p
                            style={{
                              fontSize: '12.5px',
                              color: '#8892A4',
                              lineHeight: 1.65,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {project.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}
