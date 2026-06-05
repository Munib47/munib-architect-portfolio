'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

import { featuredProjects } from '@/data/projects';

export default function SwiperShowcase() {
  return (
    <section
      id="showcase"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Header ── */}
        <div
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
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
            ◈ Case Studies
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#F0F4F8',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            Featured{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Showcase
            </span>
          </h2>
          <p style={{ color: '#6B7A8D', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Swipe through hand-picked highlights — stores, funnels, and digital experiences
            built from the ground up.
          </p>
        </div>

        {/* ── Swiper ── */}
        <div data-aos="fade-up" data-aos-delay="100">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCreative]}
            effect="creative"
            creativeEffect={{
              prev: { shadow: true, translate: ['-120%', 0, -500] },
              next: { translate: ['100%', 0, 0] },
            }}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            grabCursor
            speed={700}
            style={{ borderRadius: '20px', overflow: 'hidden' }}
          >
            {featuredProjects.map((project) => (
              <SwiperSlide key={project.id}>
                <div
                  style={{
                    minHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${project.gradientFrom} 0%, ${project.gradientVia} 50%, ${project.gradientTo} 100%)`,
                  }}
                >
                  {/* Dot-pattern background */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `radial-gradient(${project.accentHex}18 1px, transparent 1px)`,
                      backgroundSize: '28px 28px',
                      opacity: 0.7,
                    }}
                  />

                  {/* Accent glow blob */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '-60px',
                      right: '-60px',
                      width: '340px',
                      height: '340px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${project.accentHex}22 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Bottom left glow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '-40px',
                      left: '-40px',
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${project.accentHex}12 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '500px' }}>

                    {/* Top bar */}
                    <div
                      style={{
                        padding: '1.5rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${project.accentHex}20`,
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: project.accentHex + '18',
                            border: `1px solid ${project.accentHex}35`,
                            flexShrink: 0,
                          }}
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            {project.category === 'shopify' ? (
                              /* Shopify bag icon */
                              <>
                                <path d="M6.5 8.5V6.5C6.5 4.567 8.067 3 10 3s3.5 1.567 3.5 3.5V8.5" stroke={project.accentHex} strokeWidth="1.5" strokeLinecap="round" />
                                <rect x="3.5" y="8" width="13" height="9" rx="2" stroke={project.accentHex} strokeWidth="1.5" />
                              </>
                            ) : (
                              /* GHL funnel icon */
                              <>
                                <path d="M3 4h14l-5.5 7v5l-3-1.5V11L3 4z" stroke={project.accentHex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </>
                            )}
                          </svg>
                        </span>
                        <div>
                          <p
                            style={{
                              fontSize: '11px',
                              color: project.accentHex,
                              fontWeight: 700,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              marginBottom: '3px',
                            }}
                          >
                            #{String(project.id).padStart(2, '0')} ·{' '}
                            {project.category === 'shopify' ? 'Shopify' : 'GoHighLevel'}
                          </p>
                          <h3
                            style={{
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                              fontWeight: 800,
                              color: '#F0F4F8',
                              letterSpacing: '-0.02em',
                              lineHeight: 1.2,
                            }}
                          >
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.5rem 1.1rem',
                          borderRadius: '8px',
                          background: project.accentHex,
                          color: '#0A0A0C',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          boxShadow: `0 4px 18px ${project.accentHex}55`,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.transform  = 'translateY(-1px)';
                          el.style.boxShadow  = `0 6px 24px ${project.accentHex}70`;
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.transform = 'none';
                          el.style.boxShadow = `0 4px 18px ${project.accentHex}55`;
                        }}
                      >
                        Live ↗
                      </a>
                    </div>

                    {/* Body — two columns */}
                    <div
                      style={{
                        flex: 1,
                        padding: '2rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        alignContent: 'start',
                      }}
                    >
                      {/* Left: role + description */}
                      <div>
                        <p
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: project.accentHex,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '0.6rem',
                          }}
                        >
                          Role
                        </p>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#D1D9E6',
                            marginBottom: '1.25rem',
                            lineHeight: 1.45,
                          }}
                        >
                          {project.role}
                        </p>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#8892A4',
                            lineHeight: 1.75,
                          }}
                        >
                          {project.description}
                        </p>
                      </div>

                      {/* Right: tags + URL */}
                      <div>
                        <p
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: project.accentHex,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '0.6rem',
                          }}
                        >
                          Technologies
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                padding: '0.28rem 0.65rem',
                                borderRadius: '6px',
                                background: project.accentHex + '15',
                                border: `1px solid ${project.accentHex}30`,
                                color: project.accentHex,
                                fontSize: '12px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* URL strip */}
                        <div
                          style={{
                            marginTop: '1.5rem',
                            padding: '0.6rem 0.9rem',
                            borderRadius: '8px',
                            background: 'rgba(0,0,0,0.35)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.55rem',
                          }}
                        >
                          <div
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#27c93f',
                              flexShrink: 0,
                              boxShadow: '0 0 6px #27c93f',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '12px',
                              color: '#6B7A8D',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {project.url}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
