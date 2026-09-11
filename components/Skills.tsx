'use client';

import { useEffect, useRef, useState } from 'react';
import { skillGroups, techBadges } from '@/data/skills';
import { TechIcon } from '@/components/icons/TechIcon';
import { TECH_ICONS } from '@/lib/tech-icons';

// Tracks the user's reduced-motion preference (reactively).
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function SkillBar({
  name, level, icon, color, index, parts,
}: {
  name: string; level: number; icon: string; color: string; index: number;
  parts?: { icon: string; label: string }[];
}) {
  const reduced = usePrefersReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  // `shown` gates the reveal; once true the bar/label rest at the REAL value.
  const [shown, setShown] = useState(false);
  const [display, setDisplay] = useState(0);

  // Replays every time the bar enters the viewport, not just the first
  // time: leaving the section in EITHER direction resets the bar to empty
  // and the counter to 0, so scrolling back to Skills re-runs the fill and
  // the count-up. (The observer therefore stays connected for the life of
  // the component rather than disconnecting on first intersection.)
  //
  // With reduced motion, or no IntersectionObserver, skip all of it and
  // rest at the real value permanently.
  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const el = barRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
        } else {
          // Reset so the next entry animates from empty rather than
          // snapping straight to the previous resting value.
          setShown(false);
          setDisplay(0);
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  // Count the percentage label up to the real value, guaranteeing the
  // final number is exactly `level`. Reduced motion jumps straight there.
  useEffect(() => {
    if (!shown) return;
    if (reduced) { setDisplay(level); return; }

    let raf = 0;
    const DURATION = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      // Clamped at BOTH ends. The rAF timestamp is the time the frame's
      // work began, which can predate the `performance.now()` captured a
      // moment earlier — leaving `now - start` slightly negative, which
      // easeOutCubic then amplifies into a negative percentage (a brief
      // "-4%" flash, seen live once the animation started replaying).
      const p = Math.min(Math.max((now - start) / DURATION, 0), 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(level * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(level); // exact final value
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, reduced, level]);

  return (
    <div ref={barRef} style={{ marginBottom: '0.85rem' }}>
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
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 500,
          }}
        >
          {parts ? (
            parts.map((part, i) => (
              <span key={part.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>}
                <TechIcon def={TECH_ICONS[part.icon]} className="w-3.5 h-3.5" />
                {part.label}
              </span>
            ))
          ) : (
            <>
              <TechIcon def={TECH_ICONS[icon]} className="w-3.5 h-3.5" />
              {name}
            </>
          )}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 700, color }}>
          {display}%
        </span>
      </div>

      <div
        style={{
          height: '4px',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            // Resting width is always the real level once revealed; never 0%.
            width: shown ? `${level}%` : '0%',
            transition: reduced
              ? 'none'
              : `width 1.2s cubic-bezier(0.34,1.56,0.64,1) ${index * 60}ms`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

// How many skills each card shows before the "Show more" toggle. Set to
// the size of the smallest group so every card renders the same number of
// rows at rest — the grid then lays them out at a matching height with no
// large empty gap in the shorter cards, which is what made the row look
// ragged when one group had 12 skills and another had 7.
const VISIBLE_SKILLS = 7;

// Shared by the real toggle and its invisible spacer twin, so both occupy
// exactly the same box no matter how the type is tweaked later.
const TOGGLE_TEXT_STYLE: React.CSSProperties = {
  display: 'inline-block',
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'inherit',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  letterSpacing: '0.01em',
};

function SkillGroupCard({
  group, index,
}: {
  group: (typeof skillGroups)[number]; index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = group.skills.length - VISIBLE_SKILLS;
  const hasMore = hiddenCount > 0;
  const visible = expanded || !hasMore ? group.skills : group.skills.slice(0, VISIBLE_SKILLS);

  return (
    <div
      className="card-lift"
      data-aos="fade-up"
      data-aos-delay={index * 100}
      style={{
        background: '#0F1117',
        border: `1px solid ${group.color}18`,
        borderRadius: '16px',
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        // Column layout so the toggle can be pinned to the card's bottom
        // edge (marginTop:auto) rather than floating right under the last
        // bar — keeps the button line aligned across cards.
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow   = `0 20px 60px ${group.color}30, 0 4px 20px rgba(0,0,0,0.5)`;
        el.style.borderColor = `${group.color}50`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow   = '';
        el.style.borderColor = `${group.color}18`;
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
            color: group.color,
            flexShrink: 0,
          }}
        >
          <TechIcon def={TECH_ICONS[group.icon]} className="w-5 h-5" />
        </div>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: group.color,
            letterSpacing: '-0.01em',
          }}
        >
          {group.category}
        </h3>
      </div>

      {/* Skill bars */}
      {visible.map((skill, si) => (
        <SkillBar
          key={skill.name}
          {...skill}
          color={group.color}
          index={si}
        />
      ))}

      {/*
       * Footer slot always renders, even with no button, so all four cards
       * reserve identical height at rest now that the grid no longer
       * stretches them to a common height. The empty case uses a hidden
       * copy of the button's own text rather than a hardcoded height, so
       * the two stay in lockstep if the type ever changes.
       *
       * Click (not hover) to expand — hover would leave the extra skills
       * permanently unreachable on touch devices, which have no hover state.
       */}
      <div style={{ marginTop: 'auto', paddingTop: '0.6rem' }}>
        {hasMore ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            style={{ ...TOGGLE_TEXT_STYLE, color: group.color, cursor: 'pointer' }}
          >
            {expanded ? 'Show less' : `Show ${hiddenCount} more`}
          </button>
        ) : (
          <span aria-hidden="true" style={{ ...TOGGLE_TEXT_STYLE, visibility: 'hidden' }}>
            Show more
          </span>
        )}
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
              fontFamily: 'var(--font-stack-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
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
          <p style={{ color: '#ffffff', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            A curated stack built through real-world delivery — from pixel-perfect storefronts
            to high-converting automation pipelines.
          </p>
        </div>

        {/* ── Skill Groups Grid — 4-column single row on desktop ── */}
        {/*
         * alignItems:'start' — without it, Grid stretches every card in a
         * row to match the tallest, so expanding one card would inflate the
         * other three with dead space. Each card sizes to its own content
         * instead; they still line up at rest because every card renders the
         * same 7 rows plus a fixed-height footer slot (see SkillGroupCard).
         */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ marginBottom: '4rem', alignItems: 'start' }}
        >
          {skillGroups.map((group, gi) => (
            <SkillGroupCard key={group.category} group={group} index={gi} />
          ))}
        </div>

        {/* ── Tech Badge Cloud ── */}
        <div data-aos="fade-up" data-aos-delay="100">
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
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
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#ffffff',
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
                  el.style.borderColor = 'rgba(255,255,255,0.1)';
                  el.style.color       = '#ffffff';
                  el.style.background  = 'rgba(255,255,255,0.04)';
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
