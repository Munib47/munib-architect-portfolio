'use client';

import { useState, useEffect, useCallback } from 'react';

const NAV_LINKS = [
  { label: 'Home',     href: '#hero'      },
  { label: 'About',    href: '#about'     },
  { label: 'Skills',   href: '#skills'    },
  { label: 'Works',    href: '#portfolio' },
  { label: 'Showcase', href: '#showcase'  },
  { label: 'Contact',  href: '#contact'   },
];

export default function Navigation() {
  const [scrolled,  setScrolled]  = useState(false);
  const [active,    setActive]    = useState('hero');
  const [menuOpen,  setMenuOpen]  = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
    const sections = NAV_LINKS.map((l) => l.href.slice(1));
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && window.scrollY >= el.offsetTop - 160) {
        setActive(sections[i]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on resize above 768px
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className="nav-blur"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          background: scrolled
            ? 'rgba(10,10,12,0.92)'
            : 'rgba(10,10,12,0.4)',
          borderBottom: scrolled
            ? '1px solid rgba(16,185,129,0.15)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: 0,
            }}
          >
            <span
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                color: '#0A0A0C',
                letterSpacing: '-0.5px',
                flexShrink: 0,
              }}
            >
              MA
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#F0F4F8',
                letterSpacing: '-0.3px',
              }}
            >
              Munib<span style={{ color: '#10B981' }}>.</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav
            style={{ display: 'flex', gap: '0.25rem' }}
            className="nav-desktop"
          >
            {NAV_LINKS.map((link) => {
              const id       = link.href.slice(1);
              const isActive = active === id;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`filter-tab ${isActive ? 'active' : ''}`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.9rem',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#10B981' : '#8892A4',
                    transition: 'color 0.25s',
                    letterSpacing: '0.02em',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <a
            href="mailto:munibahmad47@gmail.com"
            className="nav-desktop"
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: '8px',
              border: '1px solid rgba(16,185,129,0.4)',
              color: '#10B981',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.25s',
              background: 'rgba(16,185,129,0.05)',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background  = 'rgba(16,185,129,0.15)';
              el.style.boxShadow   = '0 0 20px rgba(16,185,129,0.2)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'rgba(16,185,129,0.05)';
              el.style.boxShadow  = 'none';
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            Hire Me
          </a>

          {/* Mobile Hamburger */}
          <button
            className="nav-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background: menuOpen ? '#10B981' : '#F0F4F8',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transformOrigin: 'center',
                  transform:
                    menuOpen && i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : menuOpen && i === 1 ? 'scaleX(0)'
                    : menuOpen && i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(10,10,12,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.75rem',
          }}
        >
          {/* Close hint */}
          <p style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '12px', color: '#4B5563', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            tap anywhere to close
          </p>

          {NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '2.2rem',
                fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: active === link.href.slice(1) ? '#10B981' : '#F0F4F8',
                letterSpacing: '-0.5px',
                transition: 'color 0.2s',
                opacity: 0,
                animation: `fadeSlideIn 0.35s ease forwards`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              {link.label}
            </button>
          ))}

          <a
            href="mailto:munibahmad47@gmail.com"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: '0.5rem',
              padding: '0.8rem 2.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              color: '#0A0A0C',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '1rem',
              letterSpacing: '0.02em',
              opacity: 0,
              animation: 'fadeSlideIn 0.35s ease forwards',
              animationDelay: `${NAV_LINKS.length * 60}ms`,
            }}
          >
            Hire Me →
          </a>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #10B981; }
          50%       { opacity: 0.5; box-shadow: 0 0 4px #10B981; }
        }
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile  { display: none  !important; }
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none  !important; }
          .nav-mobile  { display: flex  !important; }
        }
      `}</style>
    </>
  );
}
