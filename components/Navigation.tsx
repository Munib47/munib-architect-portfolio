'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/*
 * Label and fragment are deliberately the same word now. The nav used to say
 * "Works" while the section id was `portfolio`, which meant the visible label,
 * the URL fragment and the anchor could never agree. "Experience" was the
 * opposite problem: a section id with no nav entry pointing at it. Both are
 * reconciled here rather than by renaming ids, so every /#portfolio link that
 * already exists (the case-study pages all use one) keeps working.
 */
const NAV_LINKS = [
  { label: 'Home',       href: '#hero'       },
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Portfolio',  href: '#portfolio'  },
  { label: 'Experience', href: '#experience' },
  { label: 'Showcase',   href: '#showcase'   },
  { label: 'Contact',    href: '#contact'    },
];

// Height of the fixed header, plus a little breathing room. A section counts
// as "current" once its top has passed under the bar.
const HEADER_OFFSET = 88;

/** Smooth-scroll to a fragment, honouring the user's motion preference. */
export function scrollToSection(href: string) {
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

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
  // Tracks whether the dropdown was opened deliberately (click / keyboard)
  // rather than by the pointer merely passing over it. A pinned menu ignores
  // mouseleave, so it behaves like a real disclosure instead of a tooltip.
  const [hirePinned,  setHirePinned]  = useState(false);
  const hireMeRef = useRef<HTMLDivElement>(null);
  const hireBtnRef = useRef<HTMLButtonElement>(null);
  const hireItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  /*
   * Scroll spy.
   *
   * Resolves to exactly one section by construction: walk the list in document
   * order and keep the last one whose top has passed under the header, so there
   * is a single winner rather than a set of "active" candidates. The previous
   * version read el.offsetTop, which is measured against the offset *parent* —
   * wrong for any section inside a positioned or transformed wrapper.
   *
   * The final section is pinned at the bottom of the page: it is shorter than
   * the viewport, so scrolling can run out before its top ever clears the
   * header and it would otherwise never light up.
   */
  const syncActive = useCallback(() => {
    setScrolled(window.scrollY > 50);

    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) {
      setActive(ids[ids.length - 1]);
      return;
    }

    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= HEADER_OFFSET) current = id;
    }
    setActive(current);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      // Coalesce to one measurement per frame — syncActive reads layout.
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; syncActive(); });
    };
    syncActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [syncActive]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeHireMe = useCallback((restoreFocus = false) => {
    setHireMeOpen(false);
    setHirePinned(false);
    if (restoreFocus) hireBtnRef.current?.focus();
  }, []);

  /*
   * Click used to fight hover. The wrapper's onMouseEnter set open=true the
   * instant the pointer arrived, so by the time the click landed the menu was
   * already open and the toggle closed it again — the button looked dead.
   * Now a click always resolves to "open and pin", and only closes when the
   * menu was already pinned.
   */
  const toggleHireMe = useCallback(() => {
    if (hireMeOpen && hirePinned) {
      closeHireMe();
    } else {
      setHireMeOpen(true);
      setHirePinned(true);
    }
  }, [hireMeOpen, hirePinned, closeHireMe]);

  // Close on outside click and on Escape (Escape returns focus to the trigger).
  useEffect(() => {
    if (!hireMeOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (hireMeRef.current && !hireMeRef.current.contains(e.target as Node)) {
        closeHireMe();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeHireMe(true); }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [hireMeOpen, closeHireMe]);

  /** Roving focus across the menu items with the arrow keys / Home / End. */
  const onHireMenuKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const items = hireItemsRef.current.filter(Boolean) as HTMLAnchorElement[];
    if (items.length === 0) return;
    const go = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') go(index + 1);
    else if (e.key === 'ArrowUp') go(index - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Tab') closeHireMe();
  }, [closeHireMe]);

  /** Enter/Space/ArrowDown on the trigger opens the menu and focuses item 1. */
  const onHireTriggerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setHireMeOpen(true);
      setHirePinned(true);
      requestAnimationFrame(() => hireItemsRef.current[0]?.focus());
    }
  }, []);

  // ── Mobile menu: focus trap + Escape + scroll lock + focus restore ──
  useEffect(() => {
    if (!menuOpen) return;
    const menuEl = menuRef.current;
    if (!menuEl) return;

    const focusable = () =>
      Array.from(
        menuEl.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

    // Move focus into the dialog.
    focusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last  = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (current === first || !menuEl.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !menuEl.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      hamburgerRef.current?.focus();   // restore focus to the trigger
    };
  }, [menuOpen]);

  /*
   * Anchors, not buttons — so the sections are crawlable, shareable and
   * deep-linkable. preventDefault only suppresses the instant jump; the href
   * is still a real URL, and middle-click / ctrl-click still behave normally
   * because those don't produce a plain left-click event here.
   */
  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    scrollToSection(href);
    // Reflect the destination in the URL without pushing a history entry per click.
    window.history.replaceState(null, '', href);
    setActive(href.slice(1));
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
          <a
            href="#hero"
            onClick={(e) => onNavClick(e, '#hero')}
            aria-label="Munib Ahmad — back to top"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: 0, textDecoration: 'none' }}
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
              style={{ fontFamily: 'var(--font-stack-display)', fontWeight: 700, fontSize: '16px', color: '#ffffff', letterSpacing: '-0.3px' }}
            >
              Munib<span style={{ color: '#10B981' }}>.</span>
            </span>
          </a>

          {/* ── Desktop Nav links ── */}
          <nav aria-label="Main" style={{ display: 'flex', gap: '0.25rem' }} className="nav-desktop">
            {NAV_LINKS.map((link) => {
              const id       = link.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => onNavClick(e, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`filter-tab ${isActive ? 'active' : ''}`}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.5rem 0.9rem', fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#10B981' : '#ffffff',
                    transition: 'color 0.25s', letterSpacing: '0.02em',
                    fontFamily: 'var(--font-stack-body)',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* ── Desktop CTA — Hire Me ── */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

            {/* Hire Me dropdown */}
            <div
              ref={hireMeRef}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHireMeOpen(true)}
              onMouseLeave={() => { if (!hirePinned) setHireMeOpen(false); }}
            >
            {/* Trigger button */}
            <button
              ref={hireBtnRef}
              type="button"
              onClick={toggleHireMe}
              onKeyDown={onHireTriggerKeyDown}
              aria-haspopup="menu"
              aria-expanded={hireMeOpen}
              aria-controls="hire-me-menu"
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                border: '1px solid rgba(16,185,129,0.4)',
                color: '#10B981', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em',
                fontFamily: 'var(--font-stack-body)',
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
                id="hire-me-menu"
                role="menu"
                aria-label="Get in touch"
                /* Kept mounted for the open/close transition, so it must be
                   hidden from AT and from the tab order while closed. */
                aria-hidden={!hireMeOpen}
                inert={!hireMeOpen}
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
                {HIRE_CHANNELS.map(({ id, label, sublabel, href, color, Icon }, i) => (
                  <a
                    key={id}
                    ref={(el) => { hireItemsRef.current[i] = el; }}
                    href={href}
                    role="menuitem"
                    target={id === 'whatsapp' ? '_blank' : undefined}
                    rel={id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                    onClick={() => closeHireMe()}
                    onKeyDown={(e) => onHireMenuKeyDown(e, i)}
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
            ref={hamburgerRef}
            className="nav-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(10,10,12,0.97)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '1.15rem',
            // 8 entries plus the contact block overflows a short phone screen,
            // so the sheet scrolls rather than clipping its last items.
            overflowY: 'auto', padding: '4.5rem 1.5rem 2.5rem',
          }}
        >
          <p style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            tap anywhere to close
          </p>

          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => onNavClick(e, link.href)}
              aria-current={active === link.href.slice(1) ? 'true' : undefined}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.9rem', fontWeight: 800,
                fontFamily: 'var(--font-stack-display)',
                color: active === link.href.slice(1) ? '#10B981' : '#FFFFFF',
                letterSpacing: '-0.5px', transition: 'color 0.2s',
                textDecoration: 'none',
                opacity: 0, animation: 'fadeSlideIn 0.35s ease forwards',
                animationDelay: `${i * 60}ms`,
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Hub page — a real route, not a fragment. */}
          <Link
            href="/projects"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: '1.9rem', fontWeight: 800,
              fontFamily: 'var(--font-stack-display)',
              color: '#FFFFFF', letterSpacing: '-0.5px',
              textDecoration: 'none',
              opacity: 0, animation: 'fadeSlideIn 0.35s ease forwards',
              animationDelay: `${NAV_LINKS.length * 60}ms`,
            }}
          >
            All Projects
          </Link>

          {/* Mobile contact channels */}
          <div
            style={{
              display: 'flex', flexDirection: 'column', gap: '0.6rem',
              marginTop: '0.25rem', width: '100%', maxWidth: '260px',
              opacity: 0, animation: 'fadeSlideIn 0.35s ease forwards',
              animationDelay: `${(NAV_LINKS.length + 1) * 60}ms`,
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
