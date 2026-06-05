'use client';

import { useState } from 'react';

// ── SVG Icon Components ──────────────────────────────────────────────────────

type IconProps = { color: string };

function IconEducation({ color }: IconProps): JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="12,4 21.5,8.5 12,13 2.5,8.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7 11V16C7 18.2 9.2 20 12 20C14.8 20 17 18.2 17 16V11"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <line
        x1="21.5" y1="8.5" x2="21.5" y2="14.5"
        stroke={color} strokeWidth="1.4" strokeLinecap="round"
      />
      <circle cx="21.5" cy="15.8" r="1.3" fill={color} />
    </svg>
  );
}

function IconLanguages({ color }: IconProps): JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.4" />
      <path d="M3 12h18" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M5.5 7.5C7.8 6.5 10 6 12 6C14 6 16.2 6.5 18.5 7.5"
        stroke={color} strokeWidth="0.9" strokeLinecap="round"
      />
      <path
        d="M5.5 16.5C7.8 17.5 10 18 12 18C14 18 16.2 17.5 18.5 16.5"
        stroke={color} strokeWidth="0.9" strokeLinecap="round"
      />
      <path d="M12 3C9.5 6.2 9.5 17.8 12 21" stroke={color} strokeWidth="1.2" />
      <path d="M12 3C14.5 6.2 14.5 17.8 12 21" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

function IconLocation({ color }: IconProps): JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5C8.96 2.5 6.5 4.96 6.5 8C6.5 12.8 12 21.5 12 21.5C12 21.5 17.5 12.8 17.5 8C17.5 4.96 15.04 2.5 12 2.5Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="8" r="2.5" stroke={color} strokeWidth="1.3" />
      <circle cx="12" cy="8" r="0.8" fill={color} />
    </svg>
  );
}

function IconInterests({ color }: IconProps): JSX.Element {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="18" rx="3" stroke={color} strokeWidth="1.4" />
      <line x1="2" y1="9" x2="22" y2="9" stroke={color} strokeWidth="1.1" />
      <circle cx="5.5" cy="6" r="0.85" fill={color} fillOpacity="0.65" />
      <circle cx="8.5" cy="6" r="0.85" fill={color} fillOpacity="0.65" />
      <path
        d="M6.5 12.5L10 14.5L6.5 16.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12" y1="14.5" x2="17.5" y2="14.5"
        stroke={color} strokeWidth="1.4" strokeLinecap="round"
      />
      <line
        x1="6.5" y1="18.5" x2="13.5" y2="18.5"
        stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.35"
      />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

type InfoCard = {
  Icon: (props: IconProps) => JSX.Element;
  title: string;
  items: string[];
  accent: string;
};

const INFO_CARDS: InfoCard[] = [
  {
    Icon: IconEducation,
    title: 'Education',
    items: [
      'BSc Computer Science',
      'University of the Punjab',
      'Lahore, Pakistan',
    ],
    accent: '#10B981',
  },
  {
    Icon: IconLanguages,
    title: 'Languages',
    items: [
      'Punjabi — Native',
      'Urdu — Fluent',
      'English — Intermediate',
    ],
    accent: '#06B6D4',
  },
  {
    Icon: IconLocation,
    title: 'Location',
    items: [
      'Lahore, Pakistan',
      'Remote · Available Worldwide',
      '+92 344 4955231',
    ],
    accent: '#8B5CF6',
  },
  {
    Icon: IconInterests,
    title: 'Interests',
    items: [
      'Reading Books',
      'Gardening',
      'Open-Source Projects',
    ],
    accent: '#4ADE80',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function About(): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="about"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Section Header ── */}
        <div
          style={{ marginBottom: '4rem', maxWidth: '640px' }}
          data-aos="fade-up"
          data-aos-duration="700"
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
            ◈ About Me
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Crafting Digital{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Experiences
            </span>
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: 1.85, color: '#ffffff' }}>
            I&apos;m Munib Ahmad, a frontend architect and digital commerce specialist from
            Lahore, Pakistan. I blend deep technical Shopify and GoHighLevel expertise with
            modern React/Next.js engineering — creating stores and funnels that don&apos;t
            just look premium, they convert.
          </p>
        </div>

        {/* ── Info Cards Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {INFO_CARDS.map((card, i) => {
            const isHovered = hoveredIndex === i;
            const { Icon } = card;

            return (
              <div
                key={card.title}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: '#0F1117',
                  border: `1px solid ${card.accent}${isHovered ? '55' : '22'}`,
                  borderRadius: '16px',
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: isHovered
                    ? `0 0 0 1px ${card.accent}18, 0 8px 32px ${card.accent}28, 0 24px 72px ${card.accent}10`
                    : '0 4px 24px rgba(0,0,0,0.25)',
                  transition:
                    'border-color 0.3s ease, box-shadow 0.4s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  cursor: 'default',
                }}
              >
                {/* Top-right corner radial glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '170px',
                    height: '170px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${card.accent}38 0%, transparent 70%)`,
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0.4,
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Bottom-left ambient glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${card.accent}22 0%, transparent 70%)`,
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                />

                {/* Icon badge */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: isHovered ? `${card.accent}20` : `${card.accent}12`,
                    border: `1px solid ${card.accent}${isHovered ? '48' : '28'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.1rem',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'background 0.3s ease, border-color 0.3s ease',
                  }}
                >
                  <Icon color={card.accent} />
                </div>

                {/* Card title */}
                <h3
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: card.accent,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.85rem',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {card.title}
                </h3>

                {/* Item list */}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative', zIndex: 1 }}>
                  {card.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: '14px',
                        color: '#ffffff',
                        paddingBottom: '0.45rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <span
                        style={{
                          color: card.accent,
                          fontSize: '9px',
                          flexShrink: 0,
                          opacity: isHovered ? 1 : 0.55,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        ▸
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── Personal Quote Band ── */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          style={{
            marginTop: '3rem',
            padding: '2rem 2.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid rgba(16,185,129,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: '#0A0A0C',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            MA
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <p style={{ fontSize: '15px', color: '#ffffff', lineHeight: 1.75, fontStyle: 'italic' }}>
              &ldquo;I believe every pixel on screen has a purpose — whether it&apos;s a Shopify
              storefront serving thousands of customers daily or a landing funnel converting a
              prospect into a client in under 8 seconds.&rdquo;
            </p>
            <p style={{ marginTop: '0.6rem', fontSize: '13px', color: '#10B981', fontWeight: 600 }}>
              — Munib Ahmad · munibahmad47@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
