'use client';

import { useEffect, useRef, useState } from 'react';
import { skillGroups, techBadges } from '@/data/skills';

function SkillBar({
  name, level, icon, color, index,
}: {
  name: string; level: number; icon: string; color: string; index: number;
}) {
  const [animated, setAnimated] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 },
    );
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={barRef} style={{ marginBottom: '0.85rem' }}>
      {/* Label + percentage */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.35rem',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            color: '#B0BBC8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: '11px' }}>{icon}</span>
          {name}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 700, color }}>
          {animated ? level : 0}%
        </span>
      </div>

      {/* Bar track */}
      <div
        style={{
          height: '4px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            width: animated ? `${level}%` : '0%',
            transition: `width 1.2s cubic-bezier(0.34,1.56,0.64,1) ${index * 60}ms`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Header ── */}
        <div
          style={{ marginBottom: '4rem', textAlign: 'center' }}
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
            ◈ Technical Arsenal
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#F0F4F8',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            Skills &amp;{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Expertise
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            A curated stack built through real-world delivery — from pixel-perfect storefronts
            to high-converting automation pipelines.
          </p>
        </div>

        {/* ── Skill Groups Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          {skillGroups.map((group, gi) => (
            <div
              key={group.category}
              className="card-lift"
              data-aos="fade-up"
              data-aos-delay={gi * 100}
              style={{
                background: '#0F1117',
                border: `1px solid ${group.color}18`,
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
                  top: 0,
                  right: 0,
                  width: '130px',
                  height: '130px',
                  background: `radial-gradient(circle at top right, ${group.color}15, transparent 60%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Group header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${group.color}18`,
                    border: `1px solid ${group.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}
                >
                  {group.icon}
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#F0F4F8',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {group.category}
                </h3>
              </div>

              {/* Skill bars */}
              {group.skills.map((skill, si) => (
                <SkillBar
                  key={skill.name}
                  {...skill}
                  color={group.color}
                  index={si}
                />
              ))}
            </div>
          ))}
        </div>

        {/* ── Tech Badge Cloud ── */}
        <div data-aos="fade-up" data-aos-delay="100">
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            Also worked with
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              justifyContent: 'center',
            }}
          >
            {techBadges.map((badge, i) => (
              <span
                key={badge}
                data-aos="zoom-in"
                data-aos-delay={i * 30}
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.62)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  transition: 'all 0.25s',
                  cursor: 'default',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.borderColor = 'rgba(16,185,129,0.4)';
                  el.style.color       = '#10B981';
                  el.style.background  = 'rgba(16,185,129,0.07)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLSpanElement;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.color       = 'rgba(255,255,255,0.62)';
                  el.style.background  = 'rgba(255,255,255,0.03)';
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
