// ── Shared brand / contact SVG icons ─────────────────────────────────
// Used by both SocialSidebar.tsx (fixed left rail) and Contact.tsx
// (contact link cards) so the two stay visually consistent instead of
// each defining/duplicating their own icon set.
//
// All accept a className prop so Tailwind sizing utilities (w-5 h-5)
// control the rendered dimensions, and render via currentColor so the
// parent element's `color` (including hover-state color changes) drives
// the icon's color with no extra prop needed.

export function GitHubIcon({ className }: { className?: string }) {
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

export function LinkedInIcon({ className }: { className?: string }) {
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

export function MailIcon({ className }: { className?: string }) {
  return (
    // Stroked envelope — 1.5 px weight matches the design-system line standard.
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

export function PhoneIcon({ className }: { className?: string }) {
  return (
    // Stroked handset — same line weight/style as MailIcon so the two
    // generic (non-brand) contact glyphs read as one family.
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6
               19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361
               1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1
               2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
