'use client';

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
        {/* Logo / name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '12px',
              color: '#0A0A0C',
              letterSpacing: '-0.3px',
              flexShrink: 0,
            }}
          >
            MA
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 700,
              color: '#F0F4F8',
            }}
          >
            Munib Ahmad
          </span>
        </div>

        {/* Copyright */}
        <p style={{ fontSize: '13px', color: '#4B5563', textAlign: 'center' }}>
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
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#6B7A8D',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.25s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color       = '#10B981';
                el.style.borderColor = 'rgba(16,185,129,0.35)';
                el.style.background  = 'rgba(16,185,129,0.05)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color       = '#6B7A8D';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
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
