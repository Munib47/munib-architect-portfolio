'use client';

import type { ComponentType } from 'react';

// ── Brand SVG icons ────────────────────────────────────────────────
// All accept a className prop so Tailwind sizing utilities (w-5 h-5)
// control the rendered dimensions rather than hardcoded width/height.

function GitHubIcon({ className }: { className?: string }) {
  return (
    // Official GitHub mark — 16 × 16 viewBox, single filled path.
    // Renders crisply at our 20 px (w-5 h-5) display size.
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
               0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
               -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
               .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
               -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
               .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
               .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
               0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8
               c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    // Official LinkedIn 'in' lettermark — no background box so it adapts
    // cleanly to our currentColor theme (white default → emerald on hover).
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4
               v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    // Stroked envelope — 1.5 px weight matches the design-system line standard.
    // viewBox="0 0 16 16" keeps proportions identical to the previous version.
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
      <path d="M1.5 5.5l6.5 4 6.5-4" />
    </svg>
  );
}

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
          left:           '1.5rem',
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
             * `px-3.5`        — 14 px side padding keeps the icon from
             *                    sitting flush against the border.
             *
             * Visual styles (border, background, backdrop-filter, glow) live
             * in .sidebar-link below; Tailwind handles sizing + layout.
             */
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className={[
                'sidebar-link group',
                'flex items-center justify-start',
                'px-3.5 w-12 h-12 rounded-xl overflow-hidden',
                'transition-all duration-300 ease-in-out',
                'hover:w-36',
              ].join(' ')}
            >
              {/*
               * Brand icon — shrink-0 locks it at w-5 h-5 (20 × 20 px)
               * regardless of the pill's animated width. Always visible;
               * never fades. currentColor picks up the parent's color
               * transition (white → emerald on hover).
               */}
              <Icon className="w-5 h-5 shrink-0" />

              {/*
               * Text label — starts opacity-0 so it's invisible while
               * the pill is narrow (overflow-hidden also hides it).
               * delay-150 means the fade begins only after the pill has
               * already expanded ~50 % of the way, preventing the text
               * from being visible while still clipped.
               *
               * whitespace-nowrap is mandatory: without it, text wraps
               * inside the narrow pill mid-animation → the "inkedIn"
               * artefact the user reported.
               */}
              <span
                className={[
                  'opacity-0 ml-3 whitespace-nowrap',
                  'text-xs font-semibold',
                  'transition-opacity duration-200 delay-150',
                  'group-hover:opacity-100',
                ].join(' ')}
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
      `}</style>
    </>
  );
}
