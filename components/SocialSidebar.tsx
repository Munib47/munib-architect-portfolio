'use client';

const LINKS = [
  {
    href:  'https://github.com/Munib47/',
    label: 'GitHub',
    icon:  'GH',
  },
  {
    href:  'https://www.linkedin.com/in/munib-ahmad-294524237',
    label: 'LinkedIn',
    icon:  'in',
  },
  {
    href:  'mailto:munibahmad47@gmail.com',
    label: 'Email',
    icon:  '@',
  },
] as const;

export default function SocialSidebar() {
  return (
    /*
     * Full-viewport fixed shell — pointer-events: none ensures this container
     * never intercepts clicks intended for page content beneath it as the user
     * scrolls. The shell is purely a positioning context.
     *
     * z-index: 50 puts it above every page section (zIndex 1) and the
     * Three.js canvas (zIndex 0), but below the navigation (zIndex 100).
     *
     * Critically this element lives outside <main> and outside <Hero>, so
     * the Hero section's overflow:hidden boundary can never clip its hit area.
     */
    <div
      className="social-sidebar"
      aria-label="Social profile links"
      style={{
        position:      'fixed',
        left:          '1.5rem',
        top:           0,
        bottom:        0,
        zIndex:        50,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        justifyContent:'flex-end',
        paddingBottom: '7.5rem',
        pointerEvents: 'none',  /* shell never eats clicks */
      }}
    >
      {/* Inner group — pointer-events: auto re-enables clicks on the links */}
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '0.75rem',
          pointerEvents: 'auto',
        }}
      >
        {LINKS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            title={s.label}
            style={{
              width:          '36px',
              height:         '36px',
              borderRadius:   '8px',
              border:         '1px solid rgba(16,185,129,0.2)',
              background:     'rgba(10,10,12,0.8)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#FFFFFF',
              fontSize:       '11px',
              fontWeight:     700,
              textDecoration: 'none',
              transition:     'color 0.25s, border-color 0.25s, background 0.25s, transform 0.25s',
              letterSpacing:  '0',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color        = '#10B981';
              el.style.borderColor  = 'rgba(16,185,129,0.5)';
              el.style.background   = 'rgba(16,185,129,0.1)';
              el.style.transform    = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color        = '#FFFFFF';
              el.style.borderColor  = 'rgba(16,185,129,0.2)';
              el.style.background   = 'rgba(10,10,12,0.8)';
              el.style.transform    = 'none';
            }}
          >
            {s.icon}
          </a>
        ))}

        {/* Vertical accent line below the icons */}
        <div
          aria-hidden="true"
          style={{
            width:      '1px',
            height:     '60px',
            background: 'linear-gradient(to bottom, rgba(16,185,129,0.4), transparent)',
            marginTop:  '0.25rem',
          }}
        />
      </div>
    </div>
  );
}
