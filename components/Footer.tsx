'use client';

import Image from 'next/image';
import Link from 'next/link';

const FOOTER_LINK_STYLE: React.CSSProperties = {
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'all 0.25s',
  letterSpacing: '0.03em',
};

/*
 * Root-relative, not bare fragments — the footer renders on /projects and on
 * all 27 case studies, where "#about" would resolve against the current page
 * and go nowhere.
 */
const SECTION_LINKS = [
  { href: '/',            label: 'Home'       },
  { href: '/#about',      label: 'About'      },
  { href: '/#skills',     label: 'Skills'     },
  { href: '/#portfolio',  label: 'Portfolio'  },
  { href: '/#experience', label: 'Experience' },
  { href: '/#showcase',   label: 'Showcase'   },
  // /projects is deliberately absent here — it already has its own button in
  // the links row below, and pointing at the same URL twice in one footer is
  // noise, not an extra signal.
  { href: '/#contact',    label: 'Contact'    },
];

const SOCIAL_LINKS = [
  { href: 'https://github.com/Munib47/',                        label: 'GitHub'   },
  { href: 'https://www.linkedin.com/in/munib-ahmad-294524237', label: 'LinkedIn' },
  { href: 'mailto:munibahmad47@gmail.com',                     label: 'Email'    },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(16,185,129,0.1)',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/*
          * Footer section nav.
          *
          * Standard practice, and the single highest-leverage internal-linking
          * change available: the footer renders on all 29 routes, so every
          * case study now carries a link to each homepage section instead of
          * dead-ending. It is also what tips the homepage's internal/external
          * link ratio, which was 38/55 against — the 27 "Visit Live Site"
          * buttons and the social/mailto links are all outbound by nature, so
          * the balance has to come from somewhere.
          */}
        <nav
          aria-label="Footer"
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.35rem 1.25rem',
            paddingBottom: '1.75rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {SECTION_LINKS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#8892A4',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#10B981'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#8892A4'; }}
            >
              {s.label}
            </Link>
          ))}
        </nav>

        {/* Logo / name — circular avatar matching nav style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '2px solid #10B981',
              boxShadow: '0 0 10px rgba(16,185,129,0.45), 0 0 0 1px rgba(16,185,129,0.15)',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'block',
              position: 'relative',
            }}
          >
            <Image
              src="/images/profile/avatar.png"
              alt="Munib Ahmad"
              fill
              sizes="34px"
              style={{ objectFit: 'cover' }}
            />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-stack-display)',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            Munib Ahmad
          </span>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '13px', color: '#ffffff', textAlign: 'center' }}>
          © {year} Munib Ahmad. Crafted with{' '}
          <span style={{ color: '#10B981' }}>Next.js</span>,{' '}
          <span style={{ color: '#88CE02' }}>GSAP</span>,{' '}
          <span style={{ color: '#06B6D4' }}>Three.js</span> &amp;{' '}
          <span style={{ color: '#96BF48' }}>Shopify</span>.
        </p>

        {/* Site links + socials. The footer renders on every route now, so the
            hub link here is what gives the 27 case studies a site-wide
            internal link back into the index. */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/projects" style={FOOTER_LINK_STYLE}>
            All Projects
          </Link>
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.25s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color       = '#10B981';
                el.style.borderColor = 'rgba(16,185,129,0.45)';
                el.style.background  = 'rgba(16,185,129,0.07)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color       = '#ffffff';
                el.style.borderColor = 'rgba(255,255,255,0.1)';
                el.style.background  = 'transparent';
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
