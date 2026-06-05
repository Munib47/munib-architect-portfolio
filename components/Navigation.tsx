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

  type ResumeStage = 'idle' | 'generating' | 'ready';
  const [resumeStage, setResumeStage] = useState<ResumeStage>('idle');
  const [progress,    setProgress]    = useState(0);
  const [pdfUrl,      setPdfUrl]      = useState<string | null>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setResumeStage('idle');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  function getProgressCopy(p: number) {
    if (p < 34) return 'Compiling fresh portfolio assets...';
    if (p < 68) return 'Formatting PDF structure...';
    return 'Finalizing downloadable document...';
  }

  const handleDownloadResume = async () => {
    setResumeStage('generating');
    setProgress(0);
    setPdfUrl(null);

    const TOTAL_MS = 3000;
    const TICK_MS  = 80;
    let elapsed = 0;

    const timer = window.setInterval(() => {
      elapsed += TICK_MS;
      setProgress(Math.min((elapsed / TOTAL_MS) * 92, 92));
      if (elapsed >= TOTAL_MS) window.clearInterval(timer);
    }, TICK_MS);

    try {
      const [reactMod, pdfMod, resumeMod] = await Promise.all([
        import('react'),
        import('@react-pdf/renderer'),
        import('@/components/DynamicResumeEngine'),
      ]);
      const profileImageUrl = `${window.location.origin}/images/profile/my-profile.jpg`;
      const blob = await (pdfMod.pdf as (d: unknown) => { toBlob(): Promise<Blob> })(
        reactMod.createElement(resumeMod.DynamicResumeEngine, { profileImageUrl }),
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.clearInterval(timer);
      setProgress(100);
      setPdfUrl(url);
      setTimeout(() => setResumeStage('ready'), 380);
    } catch {
      window.clearInterval(timer);
      setResumeStage('idle');
    }
  };

  const closeResumeModal = () => setResumeStage('idle');

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

          {/* ── Desktop CTAs — Download Résumé + Hire Me ── */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

            {/* Download Résumé button */}
            <button
              onClick={handleDownloadResume}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 0.95rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.65)',
                fontSize: '13px', fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(16,185,129,0.4)';
                el.style.color = '#10B981';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.1)';
                el.style.color = 'rgba(255,255,255,0.65)';
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5.5 1v6.5M2.5 5l3 3 3-3M1 10h9"/>
              </svg>
              Résumé
            </button>

            {/* Hire Me dropdown */}
            <div
              ref={hireMeRef}
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
          </div> {/* ← closes CTAs wrapper */}

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

          {/* Mobile — Download Résumé */}
          <button
            onClick={() => { setMenuOpen(false); handleDownloadResume(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.7rem 1.5rem',
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '12px',
              color: '#10B981',
              fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              opacity: 0, animation: 'fadeSlideIn 0.35s ease forwards',
              animationDelay: `${NAV_LINKS.length * 60 + 30}ms`,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.5 1v8.5M3 6.5l3.5 3.5L10 6.5M1 12h11"/>
            </svg>
            Download Résumé
          </button>

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

      {/* ── Resume Generation Modal ───────────────────────────────── */}
      {resumeStage !== 'idle' && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeResumeModal(); }}
        >
          <div
            style={{
              width: '100%', maxWidth: '400px',
              background: 'rgba(8,10,16,0.98)',
              border: '1px solid rgba(16,185,129,0.18)',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(16,185,129,0.05)',
              position: 'relative',
            }}
          >
            {/* Close button */}
            <button
              onClick={closeResumeModal}
              aria-label="Close"
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', fontSize: '13px',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
            >✕</button>

            {resumeStage === 'generating' ? (

              /* ── Generating state ── */
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.5rem' }}>
                  Preparing Document
                </p>

                {/* Spinner ring */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ animation: 'resume-spin 1s linear infinite' }} aria-hidden="true">
                    <circle cx="32" cy="32" r="27" stroke="rgba(16,185,129,0.1)" strokeWidth="3.5" fill="none"/>
                    <path d="M 32 5 A 27 27 0 0 1 59 32" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>

                <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.01em' }}>
                  {getProgressCopy(progress)}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '1.75rem' }}>
                  Building a fresh, text-selectable PDF resume
                </p>

                {/* Progress bar */}
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #10B981, #06B6D4)',
                    borderRadius: '2px',
                    transition: 'width 0.12s linear',
                  }}/>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, fontFamily: 'monospace' }}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

            ) : (

              /* ── Ready state ── */
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#10B981', marginBottom: '1.5rem' }}>
                  Resume Ready
                </p>

                {/* Animated checkmark */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <svg
                    width="64" height="64" viewBox="0 0 64 64"
                    style={{ animation: 'resume-scalein 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
                    aria-label="Ready"
                  >
                    <circle cx="32" cy="32" r="27" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.35)" strokeWidth="1.5"/>
                    <path d="M 18 32 L 27 41 L 46 22" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>

                <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                  Your Resume is Ready
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '1.75rem' }}>
                  Freshly compiled · All 27 projects included
                </p>

                {/* Download anchor */}
                <a
                  href={pdfUrl!}
                  download="Munib_Ahmad_Resume.pdf"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    width: '100%', padding: '0.85rem 1.5rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#ffffff', fontSize: '14px', fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 8px 32px rgba(16,185,129,0.4)',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.transform = 'translateY(-1px)';
                    el.style.boxShadow = '0 12px 40px rgba(16,185,129,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.transform = 'none';
                    el.style.boxShadow = '0 8px 32px rgba(16,185,129,0.4)';
                  }}
                  onClick={() => setTimeout(closeResumeModal, 800)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 1v9M3.5 7l3.5 3.5L10.5 7M1 13h12"/>
                  </svg>
                  Download Munib_Ahmad_Resume.pdf
                </a>

                <p style={{ marginTop: '0.75rem', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                  PDF · A4 · Text-selectable · Client-side generated
                </p>
              </div>

            )}
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
        @keyframes resume-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes resume-scalein {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
