'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { scrollToSection } from './Navigation';

const TECH_BADGES = [
  { label: 'Next.js',      color: '#ffffff' },
  { label: 'Shopify',      color: '#96BF48' },
  { label: 'GoHighLevel',  color: '#F97316' },
  { label: 'GSAP',         color: '#88CE02' },
  { label: 'Three.js',     color: '#06B6D4' },
  { label: 'Tailwind CSS', color: '#38BDF8' },
];

// Total professional experience, counted from the actual career start
// (May 2022) — not from data/experience.ts, whose per-role dates are
// separate and correct as-is for the timeline itself. Recompute/bump this
// manually as time passes (next bump to '5+' is due ~May 2027).
const STATS = [
  { value: '27+', label: 'Live Projects'  },
  { value: '18',  label: 'Shopify Stores' },
  { value: '9',   label: 'GHL Funnels'   },
  { value: '4+',  label: 'Years Exp.'    },
];

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const greetRef    = useRef<HTMLDivElement>(null);
  const nameRef     = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const badgesRef   = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /*
     * Entrance timing.
     *
     * The old sequence ran to 2.1s of staggered offsets before the stats row
     * landed, and every element — the H1 included — started at autoAlpha 0.
     * On a warm cache that reads as a polished reveal. On a cold first visit,
     * where GSAP itself is still downloading, it means the hero is blank until
     * the library arrives and *then* spends two more seconds revealing itself:
     * the availability badge was showing up around 5s and the H1 around 8s.
     *
     * Two changes fix that. The whole sequence now completes in ~800ms, and
     * the H1 is never animated on opacity — it is painted at full opacity by
     * the server and GSAP only slides it, so the single most important element
     * on the page is legible from first paint no matter when (or whether) the
     * JavaScript lands. Nothing here waits on the WebGL canvas.
     */
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Reduced motion: land everything in its final state, no entrance at all.
      if (reduced) {
        gsap.set(
          [greetRef.current, nameRef.current, subtitleRef.current, descRef.current,
           badgesRef.current, ctaRef.current, statsRef.current, imageRef.current],
          { autoAlpha: 1, x: 0, y: 0 },
        );
        gsap.set(glowRef.current, { scale: 1, autoAlpha: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // nameRef is deliberately absent from this list — the H1 must never be
      // hidden, only moved.
      gsap.set(
        [greetRef.current, subtitleRef.current, descRef.current,
         badgesRef.current, ctaRef.current, statsRef.current],
        { autoAlpha: 0, y: 16 },
      );
      gsap.set(glowRef.current,  { scale: 0.6, autoAlpha: 0 });
      gsap.set(imageRef.current, { autoAlpha: 0, x: 40 });

      tl
        .to(glowRef.current,     { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'power2.out' }, 0)
        .to(greetRef.current,    { autoAlpha: 1, y: 0, duration: 0.35 }, 0)
        // Transform only. No autoAlpha, no fromTo that would start it hidden.
        .fromTo(nameRef.current,
          { y: 22 },
          { y: 0, duration: 0.45 },
          0.05,
        )
        .to(imageRef.current,    { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.1)
        .to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.15)
        .to(descRef.current,     { autoAlpha: 1, y: 0, duration: 0.35 }, 0.25)
        .to(badgesRef.current,   { autoAlpha: 1, y: 0, duration: 0.35 }, 0.32)
        .to(ctaRef.current,      { autoAlpha: 1, y: 0, duration: 0.35 }, 0.40)
        .to(statsRef.current,    { autoAlpha: 1, y: 0, duration: 0.35 }, 0.45);
        // → last tween ends at 0.80s.

      if (badgesRef.current) {
        gsap.from(badgesRef.current.children, {
          autoAlpha: 0,
          y: 14,
          scale: 0.88,
          stagger: 0.035,
          duration: 0.3,
          ease: 'back.out(1.7)',
          delay: 0.34,
        });
      }

      // Ambient float, starting after the entrance has settled.
      gsap.to(glowRef.current, {
        y: -14,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1,
      });

      gsap.to(imageRef.current, {
        y: -14,
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onWorkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    scrollToSection('#portfolio');
    window.history.replaceState(null, '', '#portfolio');
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 1.5rem',
      }}
    >
      {/* Floating glow blob */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '15%',
          right: '-8%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 40%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform',
        }}
      />

      {/* Second ambient glow (bottom-left) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          // maxWidth: '1280px',
          maxWidth: '1235px',
          margin: '0 auto',
          width: '100%',
          paddingTop: '110px',
          paddingBottom: '90px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ── Two-column hero layout ──────────────────────────────── */}
        <div className="hero-layout">

          {/* ── Left: Text Block ─────────────────────────────────── */}
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>

            {/* Availability tag */}
            <div
              ref={greetRef}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '100px',
                border: '1px solid rgba(16,185,129,0.3)',
                background: 'rgba(16,185,129,0.07)',
                marginBottom: '1.75rem',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                  animation: 'hero-pulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  color: '#10B981',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Available for New Projects
              </span>
            </div>

            {/*
              * The H1 now carries the role line as well as the name.
              *
              * It used to read simply "Munib Ahmad" — the single strongest
              * on-page signal spent entirely on a proper noun that nobody
              * searches for unless they already know it. The role line was
              * right underneath it in its own <p>, so absorbing that <p> into
              * the heading makes the H1 keyword-bearing without moving a single
              * pixel: same two lines, same sizes, same split-colour treatment.
              *
              * The visual `/` separators stay hidden from the a11y tree, with a
              * clean comma-separated version for screen readers — otherwise the
              * accessible name runs together as "Frontend ArchitectShopify…".
              */}
            <h1 style={{ marginBottom: '1.5rem' }}>
              <span
                ref={nameRef}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-stack-display)',
                  fontSize: 'clamp(3rem, 7.5vw, 5.75rem)',
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  marginBottom: '1.25rem',
                }}
              >
                Munib{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 55%, #14B8A6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Ahmad
                </span>
              </span>

              {/*
                * Only the `/` glyphs are hidden from AT, not the roles — an
                * sr-only copy of the same three roles alongside an aria-hidden
                * visible copy would put the whole phrase in the H1's text
                * content twice, which reads as keyword stuffing to a crawler
                * (it sees rendered text; it does not honour aria-hidden).
                *
                * The explicit {' '} either side of each separator is load-
                * bearing: accessible-name computation concatenates inline
                * children without inserting whitespace, so without them the
                * name comes out as "Frontend ArchitectShopify Theme Engineer".
                * Separator margin is trimmed to 0.35rem to absorb the width of
                * those spaces, so the rendered spacing is unchanged.
                */}
              <span
                ref={subtitleRef}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-stack-display)',
                  fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
                  fontWeight: 600,
                  color: '#ffffff',
                  letterSpacing: '0.01em',
                  lineHeight: 1.5,
                }}
              >
                Frontend Architect{' '}
                <span aria-hidden="true" style={{ color: 'rgba(16,185,129,0.5)', margin: '0 0.35rem', fontWeight: 300 }}>/</span>
                {' '}Shopify Theme Engineer{' '}
                <span aria-hidden="true" style={{ color: 'rgba(16,185,129,0.5)', margin: '0 0.35rem', fontWeight: 300 }}>/</span>
                {' '}GHL Automation Specialist
              </span>
            </h1>

            {/* Description */}
            <p
              ref={descRef}
              style={{
                fontSize: '1rem',
                lineHeight: 1.85,
                color: '#ffffff',
                maxWidth: '580px',
                marginBottom: '2rem',
              }}
            >
              BSCS graduate from the University of the Punjab, Lahore — building
              high-performance digital storefronts, premium landing funnels, and
              cinematic web experiences. 27+ live projects across Shopify,
              GoHighLevel, Next.js, and modern animation stacks.
            </p>

            {/* Tech badges */}
            <div
              ref={badgesRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.55rem',
                marginBottom: '2.5rem',
              }}
            >
              {TECH_BADGES.map((b) => (
                <span
                  key={b.label}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${b.color}30`,
                    background: `${b.color}0D`,
                    color: b.color,
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s',
                    cursor: 'default',
                    opacity: 1,
                    visibility: 'visible',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLSpanElement;
                    el.style.background  = `${b.color}22`;
                    el.style.boxShadow   = `0 0 16px ${b.color}30`;
                    el.style.borderColor = `${b.color}60`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLSpanElement;
                    el.style.background  = `${b.color}0D`;
                    el.style.boxShadow   = 'none';
                    el.style.borderColor = `${b.color}30`;
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              ref={ctaRef}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
            >
              {/* An anchor, not a button — #portfolio is a real destination,
                  so this should be shareable and open in a new tab on
                  ctrl/cmd-click like any other link. */}
              <a
                href="#portfolio"
                onClick={onWorkClick}
                style={{
                  padding: '0.8rem 2rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                  color: '#0A0A0C',
                  fontSize: '15px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 24px rgba(16,185,129,0.35)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform  = 'translateY(-2px)';
                  el.style.boxShadow  = '0 8px 32px rgba(16,185,129,0.5)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.transform = 'none';
                  el.style.boxShadow = '0 4px 24px rgba(16,185,129,0.35)';
                }}
              >
                View My Work →
              </a>
              <a
                href="mailto:munibahmad47@gmail.com"
                style={{
                  padding: '0.8rem 2rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  background: 'transparent',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background  = 'rgba(16,185,129,0.08)';
                  el.style.borderColor = 'rgba(16,185,129,0.6)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background  = 'transparent';
                  el.style.borderColor = 'rgba(16,185,129,0.3)';
                }}
              >
                Get In Touch
              </a>
            </div>

            {/* Stats row */}
            <div
              ref={statsRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2.5rem',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(16,185,129,0.1)',
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: 'var(--font-stack-display)',
                      fontSize: '2.1rem',
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      lineHeight: 1.1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#ffffff',
                      marginTop: '0.25rem',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Profile Image Card ─────────────────────────── */}
          <div
            ref={imageRef}
            className="hero-profile-card"
            style={{ willChange: 'transform' }}
          >
            <div style={{ position: 'relative' }}>

              {/* Glow aura behind the card */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-28px',
                  borderRadius: '56px',
                  background: 'radial-gradient(circle at 50% 55%, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.09) 45%, transparent 70%)',
                  filter: 'blur(28px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />

              {/* Gradient border ring */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: '3px',
                  borderRadius: '28px',
                  background: 'linear-gradient(160deg, rgba(16,185,129,0.75) 0%, rgba(6,182,212,0.4) 45%, rgba(16,185,129,0.12) 100%)',
                  boxShadow: '0 32px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.08)',
                }}
              >
                {/* Glassmorphism inner card */}
                <div
                  style={{
                    borderRadius: '26px',
                    overflow: 'hidden',
                    background: '#0F1117',
                    position: 'relative',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                >
                  <Image
                    src="/images/profile/my-profile.jpg"
                    alt="Munib Ahmad — Frontend Architect"
                    width={380}
                    height={460}
                    priority
                    style={{ objectFit: 'cover', display: 'block', width: '100%', height: 'auto' }}
                  />

                  {/* Bottom gradient overlay */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '48%',
                      background: 'linear-gradient(to top, rgba(10,10,12,0.88) 0%, rgba(16,185,129,0.05) 60%, transparent 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Name label overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1.5rem',
                      left: '1.5rem',
                      right: '1.5rem',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-stack-display)',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.01em',
                        marginBottom: '0.2rem',
                      }}
                    >
                      Munib Ahmad
                    </p>
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#10B981',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Frontend Architect
                    </p>
                  </div>
                </div>
              </div>

              {/* Top-right accent dot */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 14px #10B981, 0 0 28px rgba(16,185,129,0.4)',
                  zIndex: 2,
                }}
              />

              {/* Bottom-left accent dot */}
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '-8px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#06B6D4',
                  boxShadow: '0 0 10px #06B6D4, 0 0 20px rgba(6,182,212,0.4)',
                  zIndex: 2,
                }}
              />
            </div>
          </div>

        </div>
        {/* ── End two-column layout ─────────────────────────────── */}

        {/* ── Scroll Indicator ─────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 1,
          }}
        >
          <span style={{ fontSize: '10px', color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <div
            style={{
              width: '20px',
              height: '32px',
              border: '1.5px solid rgba(16,185,129,0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '5px',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '7px',
                background: '#10B981',
                borderRadius: '2px',
                animation: 'scroll-dot 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #10B981; }
          50%       { opacity: 0.55; box-shadow: 0 0 4px #10B981; }
        }
        @keyframes scroll-dot {
          0%   { transform: translateY(0);    opacity: 1; }
          75%  { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 0; }
        }
        .hero-layout {
          display: flex;
          align-items: center;
          gap: 4rem;
        }
        .hero-profile-card {
          flex-shrink: 0;
          width: 380px;
        }
        @media (max-width: 1023px) {
          /* Stack with the TEXT BLOCK FIRST (it's first in the DOM), image below.
             column-reverse previously hoisted the image above the headline and
             pushed the primary CTA below the fold on tablet. */
          .hero-layout {
            flex-direction: column;
            align-items: center;
            gap: 2.25rem;
          }
          .hero-layout > div:first-child { width: 100%; }
          .hero-profile-card {
            width: 240px;
            order: 2;
          }
        }
        @media (max-width: 767px) {
          .hero-profile-card { display: none !important; }
        }
      `}</style>
    </section>
  );
}
