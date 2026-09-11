import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import { getCaseStudy } from '@/data/case-studies';
import { SITE_URL } from '@/lib/site';
import AbstractMockup from '@/components/Portfolio/AbstractMockup';

type PageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((proj) => proj.slug === id);
  if (!p) return { title: 'Project Not Found | Munib Ahmad' };
  const cs = getCaseStudy(p.slug);

  return {
    /*
     * "{Name} Case Study | Munib Ahmad" — one structural separator, not two.
     * Several project names already contain an em dash ("Image 1993 —
     * Pakistan"), so the old "{Name} — Case Study | Munib Ahmad" template
     * produced titles with a dash doing two different jobs in the same string.
     * Dropping the second dash also keeps every title inside 60 characters.
     */
    title: `${p.title} Case Study | Munib Ahmad`,
    /*
     * seoDescription, not description. `description` is visible page copy and
     * runs 170–260 characters on most projects, which Google truncates. This
     * field exists purely for the SERP snippet and is capped at 155.
     */
    description: cs?.seoDescription ?? p.description,
    alternates: {
      canonical: `/projects/${p.slug}`,
      languages: {
        en: `/projects/${p.slug}`,
        'x-default': `/projects/${p.slug}`,
      },
    },
    openGraph: {
      title: `${p.title} — Case Study`,
      description: cs?.seoDescription ?? p.description,
      type: 'article',
      url: `/projects/${p.slug}`,
      /*
       * No `images` here on purpose. opengraph-image.tsx in this same segment
       * generates a 1200x630 card and Next emits og:image plus its width,
       * height, type and alt automatically. Setting `images` as well would
       * override that with the raw screenshot — which is 980x577 (under
       * LinkedIn's minimum) on the 18 projects that have one, and absent
       * entirely on the 9 GHL projects that don't. Deferring to the generated
       * card is what gives all 27 pages an image of the right size.
       */
    },
  };
}

export default async function ProjectCasePage({ params }: PageProps) {
  const { id } = await params;
  const idx = projects.findIndex((p) => p.slug === id);
  if (idx === -1) notFound();

  const project     = projects[idx];
  const nextProject = projects[(idx + 1) % projects.length];
  const prevProject = projects[(idx - 1 + projects.length) % projects.length];

  const isShopify     = project.category === 'shopify';
  const categoryLabel = isShopify ? 'Shopify' : 'GoHighLevel';
  const categoryColor = isShopify ? '#96BF48' : '#F97316';

  const caseStudy = getCaseStudy(project.slug);

  /*
   * Highlights are authored content now.
   *
   * This used to be `project.description.split(/(?<=[.!?])\s+/)` — the summary
   * chopped on sentence boundaries. That printed the exact paragraph shown
   * under "About This Project" a second time as the bullets under "Key
   * Development Areas", word for word, on all 27 pages. The fallback keeps the
   * page rendering if a project ever ships without case-study content.
   */
  const highlights = caseStudy?.highlights ?? [];

  /*
   * Related projects — same category, nearest neighbours by position, wrapping
   * around the list so projects at either end still get three. Prev/next alone
   * gave each case study only two internal links, which is thin for 27 pages
   * that are otherwise reachable only from the homepage grid.
   */
  const sameCategory = projects.filter(
    (p) => p.category === project.category && p.slug !== project.slug,
  );
  const startAt = sameCategory.findIndex((p) => p.id > project.id);
  const rotated = startAt === -1
    ? sameCategory
    : [...sameCategory.slice(startAt), ...sameCategory.slice(0, startAt)];
  const relatedProjects = rotated.slice(0, 3);

  const displayUrl = project.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const pageUrl = `${SITE_URL}/projects/${project.slug}`;

  /*
   * Page-level structured data. Project pages previously inherited only the
   * root Person schema, so nothing described the work itself, and with no
   * /projects hub there was no breadcrumb trail to emit either.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${pageUrl}#work`,
        name: project.title,
        headline: `${project.title} Case Study`,
        description: caseStudy?.seoDescription ?? project.description,
        url: pageUrl,
        image: `${pageUrl}/opengraph-image`,
        ...(caseStudy?.updatedAt ? { dateModified: caseStudy.updatedAt } : {}),
        keywords: project.tags.join(', '),
        creator: {
          '@type': 'Person',
          name: 'Munib Ahmad',
          url: SITE_URL,
        },
        about: {
          '@type': 'WebSite',
          name: project.title,
          url: project.url,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/projects` },
          { '@type': 'ListItem', position: 3, name: project.title, item: pageUrl },
        ],
      },
    ],
  };

  /** The four narrative sections that make each case study unique. */
  const narrative = caseStudy
    ? [
        { heading: 'The Problem',       body: caseStudy.problem  },
        { heading: 'What I Built',      body: caseStudy.approach },
        { heading: 'The Outcome',       body: caseStudy.outcome  },
        { heading: 'Why This Stack',    body: caseStudy.stackRationale },
      ]
    : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0C', color: '#F0F4F8' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Sticky Top Nav ───────────────────────────────────────── */}
      <nav
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
          href="/#portfolio"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '13px',
            fontWeight: 600,
            color: '#8892A4',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Portfolio
        </Link>

        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #10B981, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.01em',
          }}
        >
          Munib Ahmad
        </span>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(3.5rem, 9vw, 7rem)',
        }}
      >
        {/* Background gradient layer */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse at 70% 50%, ${project.accentHex}12 0%, transparent 55%),
              radial-gradient(ellipse at 20% 80%, ${project.gradientVia}20 0%, transparent 50%),
              linear-gradient(180deg, ${project.gradientFrom}40 0%, #0A0A0C 100%)
            `,
          }}
        />
        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          }}
        />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>

          {/* Category + project number row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: '6px',
                background: categoryColor + '22',
                border: `1px solid ${categoryColor}44`,
                color: categoryColor,
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {categoryLabel}
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: project.accentHex,
                background: project.accentHex + '15',
                border: `1px solid ${project.accentHex}30`,
                borderRadius: '6px',
                padding: '0.25rem 0.65rem',
              }}
            >
              Project #{String(project.id).padStart(2, '0')}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-stack-display)',
              fontSize: 'clamp(2rem, 5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#F0F4F8',
              marginBottom: '1rem',
            }}
          >
            {project.title}
          </h1>

          {/* Role subtitle */}
          <p
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              fontWeight: 500,
              color: project.accentHex,
              marginBottom: '2.25rem',
              letterSpacing: '0.01em',
            }}
          >
            {project.role}
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.65rem',
                borderRadius: '10px',
                background: project.accentHex,
                color: '#0A0A0C',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: `0 6px 28px ${project.accentHex}50`,
                letterSpacing: '0.01em',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M2 12L12 2M4 2h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Visit Live Site
            </a>

            <Link
              href="/projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#8892A4',
                fontWeight: 600,
                fontSize: '14px',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              All Projects
            </Link>
          </div>
        </div>
      </header>

      {/* ── Full-width hero screenshot (only when project.image is set) ── */}
      {project.image && (
        <section
          aria-label={`${project.title} live store preview`}
          style={{ width: '100%', padding: '0 1.5rem', marginBottom: '4rem' }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '980 / 577',
                maxHeight: '420px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: `1px solid ${project.accentHex}25`,
                boxShadow: `0 24px 70px ${project.accentHex}22`,
              }}
            >
              <Image
                src={project.image}
                alt={`${project.title} live store screenshot`}
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
              />
            </div>

            {/* Visit Live Store CTA */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.75rem',
                  borderRadius: '10px',
                  background: project.accentHex,
                  color: '#0A0A0C',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: `0 6px 28px ${project.accentHex}50`,
                  letterSpacing: '0.01em',
                }}
              >
                Visit Live Store
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 12L12 2M4 2h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main id="main" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>

        {/* ── Overview: 2-column grid ─────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Left: description prose */}
          <div>
            <h2
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#10B981',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.1rem',
              }}
            >
              About This Project
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: '#A0AEC0',
                lineHeight: 1.8,
                marginBottom: '1.75rem',
              }}
            >
              {project.description}
            </p>

            {/* Live URL row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B98180',
                  flexShrink: 0,
                }}
              />
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '13px',
                  color: project.accentHex,
                  textDecoration: 'none',
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  wordBreak: 'break-all',
                }}
              >
                {displayUrl}
              </a>
            </div>
          </div>

          {/* Right: abstract mockup + metadata */}
          <div>
            {/* Mockup preview */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '62%',
                borderRadius: '12px',
                overflow: 'hidden',
                border: `1px solid ${project.accentHex}25`,
                marginBottom: '1.25rem',
                boxShadow: `0 16px 48px ${project.accentHex}15`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0 }}>
                <AbstractMockup project={project} idPrefix="cs" />
              </div>
              {/* Browser chrome top bar */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                  <div key={c} style={{ width: '6px', height: '6px', borderRadius: '50%', background: c }} />
                ))}
                <span
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '9px',
                    color: 'rgba(255,255,255,0.35)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayUrl}
                </span>
              </div>
            </div>

            {/* Key metadata grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}
            >
              {[
                { label: 'Platform', value: categoryLabel },
                { label: 'Status', value: 'Live' },
                { label: 'Category', value: isShopify ? 'E-Commerce' : 'Marketing Funnel' },
                { label: 'Project', value: `#${String(project.id).padStart(2, '0')} of ${projects.length}` },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '9px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#6B7A8D', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4F8' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Key Development Areas ────────────────────────────── */}
        {highlights.length > 0 && (
          <div
            style={{
              marginBottom: '4rem',
              padding: '2rem 2.25rem',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${project.accentHex}08 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${project.accentHex}20`,
            }}
          >
            <h2
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#10B981',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              Key Development Areas
            </h2>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {highlights.map((sentence, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    fontSize: '14px',
                    color: '#A0AEC0',
                    lineHeight: 1.65,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: project.accentHex + '20',
                      border: `1px solid ${project.accentHex}40`,
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 5l2.5 2.5L8 2.5" stroke={project.accentHex} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {sentence}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Case study narrative ─────────────────────────────── */}
        {/*
          * The substance of the page. Every project used to render the same
          * ~140-word skeleton — 27 near-identical pages, which is the textbook
          * thin-content pattern. These four sections are written per project.
          */}
        {narrative.length > 0 && (
          <div style={{ marginBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {narrative.map(({ heading, body }) => (
              <section key={heading}>
                <h2
                  style={{
                    fontFamily: 'var(--font-stack-display)',
                    fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
                    fontWeight: 800,
                    color: '#F0F4F8',
                    letterSpacing: '-0.02em',
                    marginBottom: '0.9rem',
                    paddingLeft: '0.9rem',
                    borderLeft: `3px solid ${project.accentHex}`,
                    lineHeight: 1.25,
                  }}
                >
                  {heading}
                </h2>
                <p style={{ fontSize: '15px', color: '#A0AEC0', lineHeight: 1.85 }}>
                  {body}
                </p>
              </section>
            ))}
          </div>
        )}

        {/* ── Full Tech Stack ──────────────────────────────────── */}
        <div style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            Full Technology Stack
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  background: project.accentHex + '12',
                  border: `1px solid ${project.accentHex}28`,
                  color: project.accentHex,
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/*
            * Contextual links back into the homepage sections this build draws
            * on. Case studies previously pointed outward (the live site) and
            * sideways (prev/next) but never back up into the site's own
            * topical sections, which is where a crawler establishes that the
            * stack listed above is a claimed skill and not just a tag.
            */}
          <p style={{ fontSize: '13px', color: '#6B7A8D', lineHeight: 1.8, marginTop: '1.25rem' }}>
            These are the tools behind this build — see the{' '}
            <Link href="/#skills" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>
              full skills breakdown
            </Link>
            , the{' '}
            <Link href="/#experience" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>
              work history behind them
            </Link>
            , or{' '}
            <Link href="/projects" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 600 }}>
              all {projects.length} case studies
            </Link>
            .
          </p>
        </div>

        {/* ── Related Projects ─────────────────────────────────── */}
        {relatedProjects.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#10B981',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Related {isShopify ? 'Shopify Builds' : 'GoHighLevel Funnels'}
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              {relatedProjects.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/projects/${rel.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    padding: '1.1rem 1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${rel.accentHex}22`,
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: rel.accentHex,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    #{String(rel.id).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.3 }}>
                    {rel.title}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7A8D', lineHeight: 1.5 }}>
                    {rel.role}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Project Navigation ───────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <Link
            href={`/projects/${prevProject.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              padding: '1.1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              textDecoration: 'none',
              transition: 'border-color 0.25s, background 0.25s',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B7A8D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ← Previous
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.3 }}>
              {prevProject.title}
            </span>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.35rem',
              padding: '1.1rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              textDecoration: 'none',
              transition: 'border-color 0.25s, background 0.25s',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B7A8D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Next →
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#F0F4F8', lineHeight: 1.3, textAlign: 'right' }}>
              {nextProject.title}
            </span>
          </Link>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────── */}
        <div
          style={{
            padding: '2.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid rgba(16,185,129,0.18)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            ◈ Ready to build something premium?
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-stack-display)',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 800,
              color: '#F0F4F8',
              marginBottom: '0.75rem',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Let&apos;s build your next project.
          </h3>
          <p style={{ fontSize: '14px', color: '#6B7A8D', marginBottom: '1.75rem', lineHeight: 1.65 }}>
            I specialize in{' '}
            <span style={{ color: '#F0F4F8', fontWeight: 600 }}>Shopify theme engineering</span>,{' '}
            <span style={{ color: '#F0F4F8', fontWeight: 600 }}>GoHighLevel funnel builds</span>, and{' '}
            <span style={{ color: '#F0F4F8', fontWeight: 600 }}>performance optimization</span>.
          </p>
          <a
            href="mailto:munibahmad47@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.75rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              color: '#0A0A0C',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 6px 24px rgba(16,185,129,0.35)',
              letterSpacing: '0.01em',
            }}
          >
            Start a Project →
          </a>
        </div>
      </main>
    </div>
  );
}
