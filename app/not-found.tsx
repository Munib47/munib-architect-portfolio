import Link from 'next/link';
import { projects } from '@/data/projects';

/*
 * Custom 404.
 *
 * Next's stock not-found page is an unstyled black screen with no header, no
 * navigation and no branding — which is what /projects and every mistyped URL
 * used to render. The status code and `noindex` were already correct; this is
 * purely about not dead-ending the visitor.
 */

export const metadata = {
  title: 'Page Not Found | Munib Ahmad',
  // Explicit rather than relying on Next's default for the not-found route.
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/',          label: 'Home',           hint: 'Portfolio, skills and contact' },
  { href: '/projects',  label: 'All Projects',   hint: `${projects.length} live case studies` },
  { href: '/#contact',  label: 'Get in Touch',   hint: 'Start a conversation about a build' },
];

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0C',
        color: '#F0F4F8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <main style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#111318',
            border: '1px solid rgba(16,185,129,0.35)',
            color: '#10B981',
            fontSize: '26px',
            fontWeight: 700,
            marginBottom: '1.75rem',
          }}
        >
          {'</>'}
        </div>

        <p
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#10B981',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '0.9rem',
          }}
        >
          Error 404
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-stack-display)',
            fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1rem',
          }}
        >
          This page doesn&apos;t exist
        </h1>

        <p style={{ fontSize: '15px', color: '#8892A4', lineHeight: 1.8, marginBottom: '2.25rem' }}>
          The link may be out of date, or the address may have a typo in it.
          Everything below is still where you&apos;d expect.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
          {LINKS.map(({ href, label, hint }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
              }}
            >
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#F0F4F8' }}>{label}</span>
                <span style={{ fontSize: '12px', color: '#6B7A8D' }}>{hint}</span>
              </span>
              <span aria-hidden="true" style={{ color: '#10B981', fontSize: '18px', flexShrink: 0 }}>
                →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
