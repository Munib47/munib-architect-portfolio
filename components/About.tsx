'use client';

const INFO_CARDS = [
  {
    icon: '🎓',
    title: 'Education',
    items: [
      'BSc Computer Science',
      'University of the Punjab',
      'Lahore, Pakistan',
    ],
    accent: '#10B981',
  },
  {
    icon: '🌐',
    title: 'Languages',
    items: [
      'Punjabi — Native',
      'Urdu — Fluent',
      'English — Intermediate',
    ],
    accent: '#06B6D4',
  },
  {
    icon: '📍',
    title: 'Location',
    items: [
      'Lahore, Pakistan',
      'Remote · Available Worldwide',
      '+92 344 4955231',
    ],
    accent: '#8B5CF6',
  },
  {
    icon: '🌱',
    title: 'Interests',
    items: [
      'Reading Books',
      'Gardening',
      'Open-Source Projects',
    ],
    accent: '#4ADE80',
  },
];

export default function About() {
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
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.85,
              color: '#ffffff',
            }}
          >
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
          {INFO_CARDS.map((card, i) => (
            <div
              key={card.title}
              className="card-lift"
              data-aos="fade-up"
              data-aos-delay={i * 80}
              style={{
                background: '#0F1117',
                border: `1px solid ${card.accent}22`,
                borderRadius: '16px',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner glow */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${card.accent}20 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Icon badge */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${card.accent}15`,
                  border: `1px solid ${card.accent}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '1rem',
                }}
              >
                {card.icon}
              </div>

              <h3
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: card.accent,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                {card.title}
              </h3>

              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {card.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: '14px',
                      color: '#ffffff',
                      paddingBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span style={{ color: card.accent, fontSize: '10px', flexShrink: 0 }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          {/* Avatar */}
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
            <p
              style={{
                fontSize: '15px',
                color: '#ffffff',
                lineHeight: 1.75,
                fontStyle: 'italic',
              }}
            >
              &ldquo;I believe every pixel on screen has a purpose — whether it&apos;s a Shopify
              storefront serving thousands of customers daily or a landing funnel converting a
              prospect into a client in under 8 seconds.&rdquo;
            </p>
            <p
              style={{
                marginTop: '0.6rem',
                fontSize: '13px',
                color: '#10B981',
                fontWeight: 600,
              }}
            >
              — Munib Ahmad · munibahmad47@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
