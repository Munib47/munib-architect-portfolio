'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'Home',     href: '#hero'      },
  { label: 'About',    href: '#about'     },
  { label: 'Skills',   href: '#skills'    },
  { label: 'Works',    href: '#portfolio' },
  { label: 'Showcase', href: '#showcase'  },
  { label: 'Contact',  href: '#contact'   },
];

// ── Contact channel icons ─────────────────────────────────────────
function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="13" height="9" rx="1.5" />
      <path d="M1 5l6.5 4.5L14 5" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.1 1.5H3A1.5 1.5 0 0 0 1.5 3C1.5 9.6 5.4 13.5 12 13.5A1.5 1.5 0 0 0 13.5 12V9.9L10.8 8.7l-1.1 1.5C8.5 9.9 5.1 6.5 4.8 5.3L6.3 4.2 5.1 1.5z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
      <path d="M7.5 1A6.5 6.5 0 0 0 2.05 10.58L1 14l3.52-1.03A6.5 6.5 0 1 0 7.5 1zm3.54 9.12c-.15.44-.9.84-1.24.87-.31.03-.63.14-2.07-.5-1.77-.8-2.84-2.6-2.92-2.72-.08-.11-.66-.92-.63-1.74.03-.82.46-1.22.63-1.38.16-.17.36-.21.48-.21l.35.01c.1 0 .26-.04.41.34l.54 1.45c.05.14.03.3-.05.42l-.25.36c-.08.12-.16.24-.06.48.1.23.44.79.8 1.14.45.45.9.67 1.1.74.2.07.32.05.43-.05l.32-.37c.12-.16.23-.12.39-.07l1.35.7c.16.08.25.12.29.18.04.06-.01.5-.17.94z" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
      aria-hidden="true"
    >
      <path d="M2 3.5l3 3 3-3" />
    </svg>
  );
}

// ── Hire-Me dropdown channels ─────────────────────────────────────
const HIRE_CHANNELS = [
  {
    id: 'email',
    label: 'Send an Email',
    sublabel: 'munibahmad47@gmail.com',
    href: 'mailto:munibahmad47@gmail.com',
    color: '#10B981',
    Icon: IconMail,
  },
  {
    id: 'call',
    label: 'Schedule a Call',
    sublabel: '+92 344 4955231',
    href: 'tel:+923444955231',
    color: '#06B6D4',
    Icon: IconPhone,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Chat',
    sublabel: 'Typically replies fast',
    href: 'https://wa.me/923444955231',
    color: '#25D366',
    Icon: IconWhatsApp,
  },
] as const;

// ── Component ─────────────────────────────────────────────────────
export default function Navigation() {
  const [scrolled,    setScrolled]    = useState(false);
  const [active,      setActive]      = useState('hero');
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [hireMeOpen,  setHireMeOpen]  = useState(false);
  const hireMeRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close hire-me dropdown when clicking outside (covers mobile tap-away)
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (hireMeRef.current && !hireMeRef.current.contains(e.target as Node)) {
        setHireMeOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
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
          background: scrolled ? 'rgba(10,10,12,0.92)' : 'rgba(10,10,12,0.4)',
          borderBottom: scrolled ? '1px solid rgba(16,185,129,0.15)' : '1px solid transparent',
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

          {/* ── Logo ── */}
          <button
            onClick={() => scrollTo('#hero')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: 0 }}
          >
            <span
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                border: '2px solid #10B981',
                boxShadow: '0 0 12px rgba(16,185,129,0.55), 0 0 0 1px rgba(16,185,129,0.18)',
                overflow: 'hidden', flexShrink: 0, display: 'block', position: 'relative',
              }}
            >
              <Image src="/images/profile/avatar.png" alt="Munib Ahmad" fill sizes="38px" style={{ objectFit: 'cover' }} priority />
            </span>
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.3px' }}
            >
              Munib<span style={{ color: '#10B981' }}>.</span>
            </span>
          </button>

          {/* ── Desktop Nav links ── */}
          <nav style={{ display: 'flex', gap: '0.25rem' }} className="nav-desktop">
            {NAV_LINKS.map((link) => {
              const id       = link.href.slice(1);
              const isActive = active === id;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`filter-tab ${isActive ? 'active' : ''}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.5rem 0.9rem', fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#10B981' : '#ffffff',
                    transition: 'color 0.25s', letterSpacing: '0.02em',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ── Desktop CTA — Hire Me dropdown ── */}
          <div
            ref={hireMeRef}
            className="nav-desktop"
            style={{ position: 'relative' }}
            onMouseEnter={() => setHireMeOpen(true)}
            onMouseLeave={() => setHireMeOpen(false)}
          >
            {/* Trigger button */}
            <button
              onClick={() => setHireMeOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={hireMeOpen}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#10B981', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em',
                fontFamily: "'Inter', sans-serif",
                background: hireMeOpen ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.05)',
                boxShadow: hireMeOpen ? '0 0 20px rgba(16,185,129,0.2)' : 'none',
                transition: 'background 0.25s, box-shadow 0.25s',
              }}
            >
              <span
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#10B981', flexShrink: 0,
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              Hire Me
              <IconChevron open={hireMeOpen} />
            </button>

            {/*
             * Outer wrapper: position: absolute + paddingTop bridges the 8px visual
             * gap between the button and panel — mouse never leaves the hover zone
             * while traversing that gap, so the dropdown stays open.
             */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                paddingTop: '8px',
                zIndex: 200,
                pointerEvents: hireMeOpen ? 'auto' : 'none',
              }}
            >
              {/* Visible panel */}
              <div
                style={{
                  minWidth: '248px',
                  background: 'rgba(8,10,16,0.97)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '0.45rem',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(16,185,129,0.07)',
                  opacity: hireMeOpen ? 1 : 0,
                  transform: hireMeOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)',
                  transformOrigin: 'top right',
                  transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                }}
              >
                {/* Header label */}
                <p
                  style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                    padding: '0.35rem 0.75rem 0.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '0.35rem',
                  }}
                >
                  Get in Touch
                </p>

                {/* Channel items */}
                {HIRE_CHANNELS.map(({ id, label, sublabel, href, color, Icon }) => (
                  <a
                    key={id}
                    href={href}
                    target={id === 'whatsapp' ? '_blank' : undefined}
                    rel={id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                    onClick={() => setHireMeOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '9px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = `${color}12`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    }}
                  >
                    {/* Icon box */}
                    <span
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color, flexShrink: 0,
                      }}
                    >
                      <Icon />
                    </span>

                    {/* Text */}
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                        {label}
                      </span>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                        {sublabel}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="nav-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '5px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block', width: '22px', height: '2px',
                  background: menuOpen ? '#10B981' : '#ffffff',
                  borderRadius: '2px', transition: 'all 0.3s ease',
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

      {/* ── Mobile Fullscreen Menu ── */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(10,10,12,0.97)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '1.75rem',
          }}
        >
          <p style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            tap anywhere to close
          </p>

          {NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '2.2rem', fontWeight: 800,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: active === link.href.slice(1) ? '#10B981' : '#FFFFFF',
                letterSpacing: '-0.5px', transition: 'color 0.2s',
                opacity: 0, animation: 'fadeSlideIn 0.35s ease forwards',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Mobile contact channels */}
          <div
            style={{
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
              marginTop: '0.25rem', width: '100%', maxWidth: '260px',
              opacity: 0, animation: 'fadeSlideIn 0.35s ease forwards',
              animationDelay: `${NAV_LINKS.length * 60}ms`,
            }}
          >
            <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>
              Get in Touch
            </p>
            {HIRE_CHANNELS.map(({ id, label, href, color, Icon }) => (
              <a
                key={id}
                href={href}
                target={id === 'whatsapp' ? '_blank' : undefined}
                rel={id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '12px',
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  textDecoration: 'none', color,
                  fontSize: '14px', fontWeight: 600, letterSpacing: '0.01em',
                }}
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
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
