'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { projects, type Category } from '@/data/projects';
import ProjectCard from './ProjectCard';

const FILTERS: { label: string; value: Category; count: number }[] = [
  { label: 'All Projects',      value: 'all',     count: projects.length },
  { label: 'Shopify Stores',    value: 'shopify',  count: projects.filter((p) => p.category === 'shopify').length },
  { label: 'GHL Landing Pages', value: 'ghl',      count: projects.filter((p) => p.category === 'ghl').length },
];

export default function Portfolio() {
  const [active, setActive] = useState<Category>('all');
  const gridRef   = useRef<HTMLDivElement>(null);
  const mounted   = useRef(false);

  const filtered = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  // Run entrance animation only on initial mount, not on every filter change
  // (filter changes are animated inside handleFilter)
  useEffect(() => {
    if (mounted.current || !gridRef.current) return;
    mounted.current = true;
    gsap.fromTo(
      Array.from(gridRef.current.children),
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
    );
  }, [filtered]);

  const handleFilter = (val: Category) => {
    if (val === active || !gridRef.current) { setActive(val); return; }

    gsap.to(Array.from(gridRef.current.children), {
      autoAlpha: 0,
      y: 15,
      scale: 0.97,
      duration: 0.22,
      stagger: 0.02,
      ease: 'power2.in',
      onComplete: () => {
        setActive(val);
        requestAnimationFrame(() => {
          if (!gridRef.current) return;
          gsap.fromTo(
            Array.from(gridRef.current.children),
            { autoAlpha: 0, y: 22, scale: 0.97 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.04, ease: 'power3.out' },
          );
        });
      },
    });
  };

  return (
    <section
      id="portfolio"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Section Header ── */}
        <div
          data-aos="fade-up"
          style={{
            marginBottom: '3rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
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
              ◈ Selected Works
            </span>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              27 Live{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Projects
              </span>
            </h2>
          </div>

          {/* Count badge */}
          <div
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '100px',
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.2)',
              fontSize: '13px',
              color: '#10B981',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Showing {filtered.length} of {projects.length}
          </div>
        </div>

        {/* ── Filter Tabs ── */}
        <div
          data-aos="fade-up"
          data-aos-delay="80"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '3rem',
            padding: '0.35rem',
            background: '#0F1117',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
            width: 'fit-content',
          }}
        >
          {FILTERS.map((f) => {
            const isActive = active === f.value;
            return (
              <button
                key={f.value}
                onClick={() => handleFilter(f.value)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#0A0A0C' : '#ffffff',
                  background: isActive
                    ? 'linear-gradient(135deg, #10B981, #06B6D4)'
                    : 'transparent',
                  transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? '0 4px 16px rgba(16,185,129,0.3)' : 'none',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.color      = '#ffffff';
                    el.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.color      = '#ffffff';
                    el.style.background = 'transparent';
                  }
                }}
              >
                {f.label}
                <span
                  style={{
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    fontWeight: 700,
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Projects Grid ── */}
        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* ── Bottom CTA Strip ── */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          style={{
            marginTop: '4rem',
            padding: '2rem 2.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 100%)',
            border: '1px solid rgba(16,185,129,0.15)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '15px', color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.65 }}>
            Each project is live and deployed. View them in production or{' '}
            <strong style={{ color: '#ffffff' }}>reach out to discuss your next build.</strong>
          </p>
          <a
            href="mailto:munibahmad47@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.6rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981, #06B6D4)',
              color: '#0A0A0C',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 8px 28px rgba(16,185,129,0.45)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = 'none';
              el.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)';
            }}
          >
            Start a Project →
          </a>
        </div>
      </div>
    </section>
  );
}
