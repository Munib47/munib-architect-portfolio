'use client';

import { useRef, useEffect } from 'react';
import type { JSX } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Types ────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  company: string;
  companyUrl: string;
  role: string;
  period: string;
  duration: string;
  impacts: string[];
  accent: string;
  isCurrent: boolean;
}

// ── Data (strict ascending chronological order) ───────────────────────────────

const EXPERIENCES: ExperienceEntry[] = [
  {
    company: 'Adex360',
    companyUrl: 'https://adex360.com/',
    role: 'Management Trainee Officer — React JS',
    period: 'May 2022 – Jul 2023',
    duration: '1 yr 2 mos',
    impacts: [
      'Mastered core React.js fundamentals through structured corporate training and live project delivery.',
      'Engineered custom user interfaces for internal Shopify Apps using the official Polaris component library.',
    ],
    accent: '#10B981',
    isCurrent: false,
  },
  {
    company: 'Adex360',
    companyUrl: 'https://adex360.com/',
    role: 'Frontend Developer',
    period: 'Jul 2023 – Apr 2025',
    duration: '1 yr 9 mos',
    impacts: [
      'Advanced into full-scale Shopify theme customization using Liquid, HTML, CSS, and JavaScript.',
      'Successfully configured, launched, and optimized baseline storefront operations across multiple live client accounts.',
    ],
    accent: '#06B6D4',
    isCurrent: false,
  },
  {
    company: 'Adex360',
    companyUrl: 'https://adex360.com/',
    role: 'Senior Frontend Developer',
    period: 'Apr 2025 – Present',
    duration: 'Current',
    impacts: [
      'Spearheaded front-end optimization architectures for premium, high-volume Shopify storefronts.',
      'Engineered customized workflows and performance pipelines for enterprise-level Shopify Plus merchants.',
    ],
    accent: '#818CF8',
    isCurrent: true,
  },
  {
    company: 'Beta Web Sol',
    companyUrl: 'https://betawebsol.net/',
    role: 'Senior Frontend Developer',
    period: 'Jul 2025 – Jan 2026',
    duration: '7 mos',
    impacts: [
      'Owned end-to-end frontend production across multiple concurrent client projects.',
      'Developed high-converting WordPress sites using Elementor; built performance-optimized GHL landing pages and sales funnels.',
    ],
    accent: '#F59E0B',
    isCurrent: false,
  },
  {
    company: 'Savvy Programmers',
    companyUrl: 'https://www.savvyprogrammers.com/',
    role: 'Shopify Storefront Developer',
    period: 'Feb 2026',
    duration: '1 mo',
    impacts: [
      'Executed intricate core theme customizations and advanced Shopify app integrations.',
      'Translated pixel-perfect Figma and Adobe XD prototypes into scalable, production-ready Liquid layouts.',
    ],
    accent: '#EC4899',
    isCurrent: false,
  },
  {
    company: 'Beta Web Sol',
    companyUrl: 'https://betawebsol.net/',
    role: 'Developer Manager',
    period: 'Feb 2026 – Present',
    duration: 'Current',
    impacts: [
      'Leading engineering squads and cross-platform architecture across WordPress, GHL, and Shopify ecosystems.',
      'Managing full GHL Funnels, backend Automations, Lead Pipelines, and critical GHL A2P 10DLC verification protocols.',
      'Supervising technical development across WordPress (Elementor, WP Bakery) and advanced Shopify Plus implementations.',
    ],
    accent: '#4ADE80',
    isCurrent: true,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExperienceTimeline(): JSX.Element {
  const sectionRef   = useRef<HTMLDivElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !spineFillRef.current) return;

    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      // ── Spine fill: scrubs linearly with scroll progress ──
      gsap.fromTo(
        spineFillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
            end: 'bottom 88%',
            scrub: 1.2,
          },
        },
      );

      // ── Card reveals: slide + fade + scale pop ──
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const isLeft  = i % 2 === 0;
        const xOffset = isMobile ? 24 : isLeft ? -30 : 30;

        gsap.fromTo(
          card,
          { x: xOffset, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.78,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
              once: true,
            },
          },
        );
      });

      // ── Node dot reveals: scale pop ──
      dotRefs.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: 'back.out(2.2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 86%',
              once: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '1250px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Section Header ── */}
        <div
          style={{ marginBottom: '4.5rem', textAlign: 'center' }}
          data-aos="fade-up"
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            ◈ Career Journey
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            Professional{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Experience
            </span>
          </h2>
          <p
            style={{
              color: '#ffffff',
              fontSize: '15px',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            A chronological record of every role, company, and impact — from first-year
            trainee to engineering manager across 4+ years of continuous delivery.
          </p>
        </div>

        {/* ── Timeline ── */}
        <div ref={sectionRef} style={{ position: 'relative' }}>

          {/* Spine */}
          <div className="et-spine">
            {/* Top cap dot */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                boxShadow: '0 0 10px rgba(16,185,129,0.7)',
                zIndex: 3,
              }}
            />
            {/* Ghost track */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.06)',
              }}
            />
            {/* Gradient fill — scaleY-animated by GSAP */}
            <div
              ref={spineFillRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '2px',
                background: 'linear-gradient(to bottom, #10B981 0%, #06B6D4 100%)',
                transform: 'scaleY(0)',
                transformOrigin: 'top center',
                boxShadow: '0 0 8px rgba(16,185,129,0.35)',
              }}
            />
          </div>

          {/* Experience rows */}
          {EXPERIENCES.map((exp, i) => {
            const isLeft = i % 2 === 0;

            return (
              <div
                key={`${exp.company}-${i}`}
                className={`et-row ${isLeft ? 'et-row--left' : 'et-row--right'}`}
              >

                {/* ── Experience Card ── */}
                <div
                  className="et-card-wrapper"
                  ref={(el) => { cardRefs.current[i] = el; }}
                >
                  <div
                    className="et-card"
                    style={{
                      background: '#0F1117',
                      border: `1px solid ${exp.accent}25`,
                      borderRadius: '16px',
                      padding: '1.6rem',
                      position: 'relative',
                      overflow: 'hidden',
                      transition:
                        'border-color 0.3s ease, box-shadow 0.4s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = `${exp.accent}55`;
                      el.style.boxShadow   = `0 8px 32px ${exp.accent}22, 0 20px 64px ${exp.accent}0e`;
                      el.style.transform   = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = `${exp.accent}25`;
                      el.style.boxShadow   = 'none';
                      el.style.transform   = 'translateY(0)';
                    }}
                  >
                    {/* Corner glow */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        top: '-35px',
                        right: '-35px',
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${exp.accent}28 0%, transparent 70%)`,
                        pointerEvents: 'none',
                      }}
                    />

                    {/* CURRENT badge */}
                    {exp.isCurrent && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.18rem 0.55rem',
                          borderRadius: '100px',
                          background: `${exp.accent}16`,
                          border: `1px solid ${exp.accent}45`,
                          fontSize: '10px',
                          fontWeight: 700,
                          color: exp.accent,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          zIndex: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: exp.accent,
                            boxShadow: `0 0 5px ${exp.accent}`,
                            flexShrink: 0,
                            animation: 'et-pulse 2s ease-in-out infinite',
                          }}
                        />
                        Current
                      </span>
                    )}

                    {/* Company link */}
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: exp.accent,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        marginBottom: '0.4rem',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.textDecoration      = 'underline';
                        el.style.textUnderlineOffset = '3px';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.textDecoration = 'none';
                      }}
                    >
                      {exp.company} ↗
                    </a>

                    {/* Role title */}
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.3,
                        marginBottom: '0.75rem',
                        paddingRight: exp.isCurrent ? '5.5rem' : 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {exp.role}
                    </h3>

                    {/* Period + duration pill */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1.1rem',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: exp.accent,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {exp.period}
                      </span>
                      <span
                        style={{
                          padding: '0.12rem 0.48rem',
                          borderRadius: '100px',
                          background: `${exp.accent}14`,
                          border: `1px solid ${exp.accent}32`,
                          fontSize: '10px',
                          fontWeight: 600,
                          color: exp.accent,
                          letterSpacing: '0.04em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {exp.duration}
                      </span>
                    </div>

                    {/* Impact bullets */}
                    <ul
                      style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {exp.impacts.map((impact, ii) => (
                        <li
                          key={ii}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            fontSize: '13px',
                            color: '#ffffff',
                            lineHeight: 1.65,
                          }}
                        >
                          <span
                            style={{
                              color: exp.accent,
                              fontSize: '9px',
                              marginTop: '0.38rem',
                              flexShrink: 0,
                            }}
                          >
                            ▸
                          </span>
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Node Dot ── */}
                <div className="et-center-col">
                  <div
                    ref={(el) => { dotRefs.current[i] = el; }}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: `2px solid ${exp.accent}`,
                      background: '#0A0A0C',
                      boxShadow: `0 0 14px ${exp.accent}65, 0 0 0 5px ${exp.accent}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: exp.accent,
                        boxShadow: `0 0 8px ${exp.accent}`,
                      }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ── Responsive + animation styles ── */}
      <style>{`

        /* ── Spine ── */
        .et-spine {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          bottom: 0;
          width: 2px;
          z-index: 0;
        }

        /* ── Row base ── */
        .et-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          margin-bottom: 3.25rem;
          z-index: 1;
        }

        /* ── Desktop: left card → column 1 ── */
        .et-row--left .et-card-wrapper {
          grid-column: 1;
          grid-row: 1;
          padding-right: 2.75rem;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
        }

        /* ── Desktop: right card → column 3 ── */
        .et-row--right .et-card-wrapper {
          grid-column: 3;
          grid-row: 1;
          padding-left: 2.75rem;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
        }

        /* ── Center dot column ── */
        .et-center-col {
          grid-column: 2;
          grid-row: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 1.4rem;
        }

        /* ── Card fills its wrapper ── */
        .et-card {
          width: 100%;
        }

        /* ── Tablet ── */
        @media (max-width: 1023px) {
          .et-row {
            grid-template-columns: 1fr 64px 1fr;
            margin-bottom: 2.75rem;
          }
          .et-row--left .et-card-wrapper {
            padding-right: 2rem;
          }
          .et-row--right .et-card-wrapper {
            padding-left: 2rem;
          }
        }

        /* ── Mobile: spine shifts left, all cards stack right ── */
        @media (max-width: 767px) {
          .et-spine {
            left: 20px;
            transform: none;
          }

          .et-row {
            grid-template-columns: 48px 1fr;
            margin-bottom: 2.25rem;
          }

          /* Both left and right cards go to column 2 on mobile */
          .et-row--left .et-card-wrapper,
          .et-row--right .et-card-wrapper {
            grid-column: 2;
            grid-row: 1;
            padding-left: 1rem;
            padding-right: 0;
            justify-content: flex-start;
          }

          /* Dot column 1 on mobile */
          .et-row--left .et-center-col,
          .et-row--right .et-center-col {
            grid-column: 1;
            grid-row: 1;
            padding-top: 1.4rem;
            justify-content: center;
          }
        }

        /* ── Small mobile ── */
        @media (max-width: 479px) {
          .et-row {
            grid-template-columns: 40px 1fr;
          }
          .et-spine {
            left: 16px;
          }
        }

        /* ── Current badge pulse ── */
        @keyframes et-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
