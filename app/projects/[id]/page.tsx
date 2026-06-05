import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import AbstractMockup from '@/components/Portfolio/AbstractMockup';

type PageProps = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((proj) => proj.slug === id);
  if (!p) return { title: 'Project Not Found | Munib Ahmad' };
  return {
    title: `${p.title} — Case Study | Munib Ahmad`,
    description: p.description,
    openGraph: {
      title: `${p.title} — Case Study`,
      description: p.description,
      type: 'article',
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

  // Derive feature bullet points from description sentences
  const featureSentences = project.description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const displayUrl = project.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0C', color: '#F0F4F8' }}>

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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
              href="/#portfolio"
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

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>

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
                { label: 'Project', value: `#${String(project.id).padStart(2, '0')} of 27` },
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
        {featureSentences.length > 0 && (
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
              {featureSentences.map((sentence, i) => (
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
        </div>

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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
