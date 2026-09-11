'use client';

import type { ComponentType } from 'react';
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons/SocialIcons';

// ── Data ───────────────────────────────────────────────────────────
type SidebarLink = {
  href:  string;
  label: string;
  Icon:  ComponentType<{ className?: string }>;
};

const LINKS: SidebarLink[] = [
  {
    href:  'https://github.com/Munib47/',
    label: 'GitHub',
    Icon:  GitHubIcon,
  },
  {
    href:  'https://www.linkedin.com/in/munib-ahmad-294524237',
    label: 'LinkedIn',
    Icon:  LinkedInIcon,
  },
  {
    href:  'mailto:munibahmad47@gmail.com',
    label: 'Email',
    Icon:  MailIcon,
  },
];

// ── Component ──────────────────────────────────────────────────────
export default function SocialSidebar() {
  return (
    <>
      {/*
       * Fixed shell — pointer-events: none so the container never intercepts
       * clicks on page content beneath it.
       *
       * alignItems: flex-start pins every pill to the left edge so the
       * rightward expansion causes zero CLS and never shifts siblings.
       */}
      <div
        className="social-sidebar"
        aria-label="Social profile links"
        style={{
          position:       'fixed',
          left:           '0.5rem',
          top:            0,
          bottom:         0,
          zIndex:         50,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'flex-start',
          justifyContent: 'flex-end',
          paddingBottom:  '7.5rem',
          pointerEvents:  'none',
        }}
      >
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'flex-start',
            gap:           '0.625rem',
            pointerEvents: 'auto',
          }}
        >
          {LINKS.map(({ href, label, Icon }) => (
            /*
             * Layout: flex row, left-aligned icon + fading label.
             *
             * `group`          — enables group-hover: on children.
             * `w-12 hover:w-36`— expands from 48 px → 144 px. Tailwind's
             *                    transition-all animates this smoothly.
             * `overflow-hidden`— clips the label while the pill is narrow;
             *                    the label is revealed as the pill grows.
             *
             * Padding, gap, and flex alignment are set via inline `style`
             * below rather than Tailwind's `px-3.5`/`gap-3`/`justify-*`
             * utilities. Those utilities compile correctly but are always
             * overridden to 0 by the global `*, ::before, ::after { margin:
             * 0; padding: 0; }` reset in globals.css — that reset is plain
             * (unlayered) CSS, and CSS cascade layers give ANY unlayered
             * rule priority over ALL of Tailwind's utilities (which ship
             * inside `@layer utilities`), regardless of selector
             * specificity or source order. This bit precisely when
             * switching from `justify-center` (masked it — a single
             * flex child centers without needing padding) to left-aligned
             * (exposed it — the icon sat flush against the border with no
             * padding). Inline styles aren't layered, so they aren't
             * affected. The rest of this component already uses inline
             * styles for layout for the same underlying reason.
             *
             * Visual styles (border, background, backdrop-filter, glow) live
             * in .sidebar-link below.
             */
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className={[
                'sidebar-link group',
                'w-12 h-12 rounded-xl overflow-hidden',
                'transition-all duration-300 ease-in-out',
                'hover:w-36',
              ].join(' ')}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'flex-start',
                gap:            '0.75rem',
                paddingLeft:    '0.875rem',
                paddingRight:   '0.875rem',
              }}
            >
              {/*
               * Brand icon — shrink-0 locks it at w-5 h-5 (20 × 20 px)
               * regardless of the pill's animated width. Always visible;
               * never fades. currentColor picks up the parent's color
               * transition (white → emerald on hover).
               */}
              <Icon className="w-5 h-5 shrink-0" />

              {/*
               * Text label — display:none keeps it fully out of layout
               * and inaccessible while the pill is collapsed.
               * .sidebar-link:hover triggers display:block + a keyframe
               * that slides the text in from the left after 150 ms
               * (letting the pill expand ~half-way first so the text
               * is never clipped mid-entrance).
               *
               * whitespace-nowrap is mandatory — without it text wraps
               * inside the narrow pill mid-animation.
               */}
              <span
                className="sidebar-label leading-none whitespace-nowrap text-xs font-semibold"
                style={{ letterSpacing: '0.02em', fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </span>
            </a>
          ))}

          {/*
           * Vertical accent line. The 48 px (w-12) wrapper mirrors the
           * compact pill width so the line stays centred under the icon
           * column at all times, even as pills expand to the right.
           */}
          <div
            aria-hidden="true"
            style={{
              width:          '48px',
              display:        'flex',
              justifyContent: 'center',
              marginTop:      '0.25rem',
            }}
          >
            <div
              style={{
                width:      '1px',
                height:     '60px',
                background: 'linear-gradient(to bottom, rgba(16,185,129,0.4), transparent)',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        /*
         * Only properties that Tailwind utilities cannot express cleanly:
         * border, background, backdrop-filter, box-shadow, and color.
         *
         * Width, height, radius, overflow, and all transition mechanics
         * are handled by the Tailwind classes on the anchor element above.
         * Tailwind's transition-all covers width, color, background, and
         * box-shadow in a single unified animation curve.
         */
        .sidebar-link {
          border: 1px solid rgba(16,185,129,0.18);
          background: rgba(10,10,12,0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.78);
          text-decoration: none;
        }
        .sidebar-link:hover {
          border-color: rgba(16,185,129,0.5);
          background: rgba(16,185,129,0.08);
          box-shadow:
            0 0 20px rgba(16,185,129,0.15),
            inset 0 0 14px rgba(16,185,129,0.05);
          color: #10B981;
        }

        /* Label: hidden by default, revealed via keyframe on hover */
        .sidebar-label {
          display: none;
        }
        .sidebar-link:hover .sidebar-label {
          display: block;
          animation: labelSlideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0.15s both;
        }
        @keyframes labelSlideIn {
          from { transform: translateX(-8px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
