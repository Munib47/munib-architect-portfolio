'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import type { Project } from '@/data/projects';
import AbstractMockup from './AbstractMockup';

interface Props {
  project: Project;
  index: number;
}

function imgSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ── Shared inline-style shorthand types ──────────────────────────
type CSSProp = React.CSSProperties;

const FACE_BASE: CSSProp = {
  position: 'absolute',
  inset: 0,
  borderRadius: '16px',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  overflow: 'hidden',
};

export default function ProjectCard({ project, index }: Props) {
  const router     = useRouter();
  const articleRef = useRef<HTMLElement>(null);
  const innerRef   = useRef<HTMLDivElement>(null);
  const flipTween  = useRef<gsap.core.Tween | null>(null);
  const [imgError, setImgError] = useState(false);

  const isShopify     = project.category === 'shopify';
  const categoryLabel = isShopify ? 'Shopify' : 'GoHighLevel';
  const categoryColor = isShopify ? '#96BF48' : '#F97316';
  const imgSrc        = `/images/portfolio/${imgSlug(project.title)}.jpg`;
  const casePath      = `/projects/${project.slug}`;

  // Kill active tween on unmount to avoid state updates on dead element
  useEffect(() => () => { flipTween.current?.kill(); }, []);

  const handleMouseEnter = () => {
    flipTween.current?.kill();
    flipTween.current = gsap.to(innerRef.current, {
      rotationY: 180,
      duration: 0.55,
      ease: 'power2.out',
    });
    if (articleRef.current) {
      articleRef.current.style.boxShadow = `0 0 0 1px ${project.accentHex}60, 0 8px 32px ${project.accentHex}55, 0 24px 80px ${project.accentHex}35`;
    }
  };

  const handleMouseLeave = () => {
    flipTween.current?.kill();
    flipTween.current = gsap.to(innerRef.current, {
      rotationY: 0,
      duration: 0.55,
      ease: 'power2.out',
    });
    if (articleRef.current) {
      articleRef.current.style.boxShadow = '0 0 0 1px transparent, 0 8px 32px transparent, 0 24px 80px transparent';
    }
  };

  return (
    /*
     * Outermost wrapper:
     *   - card-lift  →  CSS :hover applies translateY(-6px) scale(1.01) to THIS element
     *   - perspective →  establishes the 3-D context for the flip child below
     *   - onClick    →  fires router.push for the whole card surface
     *
     * GSAP targets innerRef (a *child* div), so the CSS transform on this
     * element and the GSAP rotationY on the child are completely independent.
     */
    <article
      ref={articleRef}
      className="card-lift"
      data-aos="fade-up"
      data-aos-delay={(index % 3) * 80}
      onClick={() => router.push(casePath)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        height: '455px',
        cursor: 'pointer',
        borderRadius: '16px',
      }}
    >
      {/* ── Inner flip wrapper ───────────────────────────────────── */}
      {/*
       * transformStyle: preserve-3d is mandatory — without it the browser
       * flattens the child faces into 2-D and backfaceVisibility has no effect.
       * GSAP animates rotationY on this element only.
       */}
      <div
        ref={innerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          borderRadius: '16px',
        }}
      >

        {/* ══════════════════════════════════════════════════════════
            FRONT FACE  —  rotationY: 0° (visible at rest)
            No action buttons — purely informational / decorative.
        ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            ...FACE_BASE,
            background: '#0F1117',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* ── Thumbnail ─────────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              height: '195px',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {/* Abstract SVG wireframe — always rendered as base layer */}
            <AbstractMockup project={project} idPrefix={`front-${project.id}`} />

            {/* Real screenshot overlays SVG when available */}
            {!imgError && (
              <Image
                src={imgSrc}
                alt={`Screenshot of ${project.title}`}
                fill
                style={{ objectFit: 'cover' }}
                onError={() => setImgError(true)}
                priority={index < 3}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            )}

            {/* Browser chrome bar */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '48px',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                borderRadius: '7px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                zIndex: 2,
              }}
            >
              {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                <div
                  key={c}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: c,
                    flexShrink: 0,
                  }}
                />
              ))}
              <span
                style={{
                  flex: 1,
                  textAlign: 'center',
                  fontSize: '9.5px',
                  color: '#ffffff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                }}
              >
                {project.url.replace(/^https?:\/\//, '')}
              </span>
            </div>

            {/* Category badge — brand logo image */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 3 }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `1px solid ${categoryColor}35`,
                  flexShrink: 0,
                }}
              >
                <Image
                  src={isShopify ? '/images/portfolio/shopify.webp' : '/images/portfolio/ghl.jpg'}
                  alt={categoryLabel}
                  width={28}
                  height={28}
                  style={{ objectFit: 'cover', display: 'block', width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {/* Ambient accent glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '120px',
                height: '38px',
                borderRadius: '50%',
                background: project.accentHex + '40',
                filter: 'blur(16px)',
                opacity: 0.55,
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* ── Content ───────────────────────────────────────── */}
          <div
            style={{
              padding: '1.1rem 1.2rem 1.2rem',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* #ID badge + title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: '0.45rem',
              }}
            >
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: project.accentHex,
                  background: project.accentHex + '15',
                  border: `1px solid ${project.accentHex}30`,
                  borderRadius: '4px',
                  padding: '0.12rem 0.38rem',
                  flexShrink: 0,
                  marginTop: '2px',
                  letterSpacing: '0.01em',
                }}
              >
                #{String(project.id).padStart(2, '0')}
              </span>
              <h3
                style={{
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.28,
                  letterSpacing: '-0.015em',
                }}
              >
                {project.title}
              </h3>
            </div>

            {/* Role */}
            <p
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: project.accentHex,
                marginBottom: '0.5rem',
                letterSpacing: '0.02em',
              }}
            >
              {project.role}
            </p>

            {/* Description — 3-line clamp */}
            <p
              style={{
                fontSize: '12.5px',
                color: '#ffffff',
                lineHeight: 1.65,
                flex: 1,
                marginBottom: '0.85rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {project.description}
            </p>

            {/* Tech stack tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.32rem', marginBottom: '0.75rem' }}>
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.14rem 0.48rem',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '10.5px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span
                  style={{
                    padding: '0.14rem 0.48rem',
                    borderRadius: '4px',
                    background: project.accentHex + '12',
                    border: `1px solid ${project.accentHex}28`,
                    color: project.accentHex,
                    fontSize: '10.5px',
                    fontWeight: 600,
                  }}
                >
                  +{project.tags.length - 4}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            BACK FACE  —  initial rotationY: 180° (hidden at rest)
            Contains both action buttons + glassmorphism treatment.
        ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            ...FACE_BASE,
            /*
             * This face starts at rotateY(180deg) — it faces away from the viewer.
             * When GSAP animates innerRef to rotationY: 180, this face rotates to 0deg
             * (facing the viewer) while the front face rotates to 180deg (hidden).
             */
            transform: 'rotateY(180deg)',
            background: 'rgba(8, 10, 16, 0.92)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border: `1px solid ${project.accentHex}28`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.75rem',
          }}
        >
          {/* Radial accent glow — purely decorative */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at 50% 28%, ${project.accentHex}16 0%, transparent 60%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Subtle dot-grid pattern */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                radial-gradient(#ffffff 1px, transparent 1px)
              `,
              backgroundSize: '22px 22px',
              maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 78%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Back face content (z-indexed above decorative layers) ── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.6rem',
            }}
          >
            {/* Project identity block */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.55rem',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  padding: '0.22rem 0.7rem',
                  borderRadius: '20px',
                  background: project.accentHex + '1E',
                  border: `1px solid ${project.accentHex}3C`,
                  color: project.accentHex,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                #{String(project.id).padStart(2, '0')} · {categoryLabel}
              </span>

              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '16.5px',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.22,
                  letterSpacing: '-0.02em',
                }}
              >
                {project.title}
              </h3>

              <p
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: project.accentHex,
                  opacity: 0.85,
                  letterSpacing: '0.015em',
                }}
              >
                {project.role}
              </p>
            </div>

            {/* Gradient rule */}
            <div
              aria-hidden="true"
              style={{
                width: '100%',
                height: '1px',
                background: `linear-gradient(90deg, transparent 0%, ${project.accentHex}50 50%, transparent 100%)`,
              }}
            />

            {/* ── Action buttons ─────────────────────────────── */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
              }}
            >
              {/*
               * Action A — internal case study page.
               * e.stopPropagation() prevents the article's onClick from
               * firing a redundant router.push to the same URL.
               */}
              <Link
                href={casePath}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.82rem 1.5rem',
                  borderRadius: '10px',
                  backgroundImage: `linear-gradient(90deg, ${project.accentHex} 0%, ${project.accentHex} 35%, rgba(255,255,255,0.32) 50%, ${project.accentHex} 65%, ${project.accentHex} 100%)`,
                  backgroundSize: '300% 100%',
                  backgroundPosition: 'right center',
                  color: '#0A0A0C',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  boxShadow: 'none',
                  transition: 'background-position 0.55s ease, box-shadow 0.25s ease, transform 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundPosition = 'left center';
                  el.style.boxShadow          = `0 10px 32px ${project.accentHex}70`;
                  el.style.transform          = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundPosition = 'right center';
                  el.style.boxShadow          = 'none';
                  el.style.transform          = 'translateY(0)';
                }}
              >
                View Case Study
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 7h10M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/*
               * Action B — external live site.
               * e.stopPropagation() is essential here: without it the article's
               * onClick fires immediately after, pushing the user to the case
               * study page before the new tab has time to open.
               */}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: `1.5px solid ${project.accentHex}4A`,
                  color: project.accentHex,
                  fontWeight: 600,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  letterSpacing: '0.01em',
                  transition: 'background 0.18s ease, border-color 0.18s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background   = project.accentHex + '14';
                  el.style.borderColor  = project.accentHex + '80';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background   = 'transparent';
                  el.style.borderColor  = project.accentHex + '4A';
                }}
              >
                Visit Live Site
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M2 11 11 2M4.5 2H11v6.5" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Floating tag cloud on back face */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.32rem',
              }}
            >
              {project.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.14rem 0.48rem',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    fontSize: '10.5px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
