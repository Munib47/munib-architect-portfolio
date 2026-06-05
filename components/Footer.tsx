'use client';

import Image from 'next/image';

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
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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

        {/* Social links */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
