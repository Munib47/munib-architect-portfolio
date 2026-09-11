# Progress Log — What's Been Done

A snapshot of the portfolio's current state, for future reference. See the main
[README.md](../README.md) for the up-to-date, maintained version of this
information (structure, tunables, full checklist) — this file is a point-in-time
summary of everything built so far. For a chronological log of every fix and
improvement applied since, see [FIXES.md](./FIXES.md); for what's still
outstanding, see [IMPROVEMENTS.md](./IMPROVEMENTS.md).

**Live site:** munib-architect-portfolio.vercel.app (note the spelling —
`munib-archetect-portfolio.vercel.app`, missing an `i`, does not resolve; see
IMPROVEMENTS.md §1)
**Last updated:** 2026-09-11

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 6 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.ts`) |
| 3D background | Three.js 0.184 — hand-rolled `THREE.Points` cloud, no react-three-fiber |
| Animation | GSAP 3.15, AOS 2.3.4 |
| Carousel | Swiper 12 (`EffectCreative`) |
| Fonts | Inter + Plus Jakarta Sans (Google Fonts) |
| Hosting | Vercel |

`@react-pdf/renderer` is installed but unused (résumé download was removed from
the nav — see Known Issues below).

## Pages & routes

- `/` — home page (`app/page.tsx`), composes all sections over the fixed 3D background.
- `/projects/[id]` — 27 statically-generated case-study pages (`generateStaticParams`),
  each with its own `generateMetadata` (title/description/OpenGraph).
- `/api/contact` — POST route handler for the contact form.

## Sections on the home page

Hero, About, Skills (animated bars), Experience Timeline, Portfolio grid
(filterable All / Shopify / GoHighLevel), Swiper showcase of 6 featured
projects, Contact form + link cards, Footer. A fixed `SocialSidebar` (GitHub /
LinkedIn / Email) runs down the left edge on large screens.

## Content

- **27 projects** in [data/projects.ts](../data/projects.ts): 18 Shopify
  storefronts + 9 GoHighLevel funnels, each with slug, live URL, role,
  description, tags, and a per-project gradient/accent color pair.
- All **18 Shopify** projects have real hero screenshots served from
  [public/images/projects/](../public/images/projects/) (stored as `.jpg`
  regardless of original format, for correct `Content-Type`). The **9
  GoHighLevel** funnels have no screenshot yet and fall back to a generated
  `AbstractMockup` (an SVG/gradient "browser preview").
- Skills and work experience are centralized in
  [data/skills.ts](../data/skills.ts) and [data/experience.ts](../data/experience.ts).

## The 3D background

[components/ThreeBackground.tsx](../components/ThreeBackground.tsx) is a
`THREE.Points` cloud (~2200 particles on desktop, scaled down on mobile/low-DPR
devices) with:
- Slow auto-rotation + pointer-driven parallax (cloud tilts, camera pans toward cursor).
- **Per-particle 3D orbital motion** (newest feature) — each dot orbits its own
  anchor along an elliptical path in its own randomly-tilted plane, giving the
  field organic per-particle depth rather than a uniform spin or drift.
- Full performance guarding: client-only dynamic import (`ssr:false`), particle
  count scaled by device, pixel-ratio cap, render loop paused when off-screen or
  the tab is hidden, full fallback (static CSS gradient, no WebGL) under
  `prefers-reduced-motion`, and proper disposal on unmount.

## Contact form

`components/Contact.tsx` is a controlled form that POSTs JSON to
`/api/contact` ([app/api/contact/route.ts](../app/api/contact/route.ts)).
Server-side validation (name/email/subject/message), a honeypot field against
bots, loading/success/error UI states. The four contact-link cards
(Email/Phone/LinkedIn/GitHub) render brand SVG icons from
[components/icons/SocialIcons.tsx](../components/icons/SocialIcons.tsx),
shared with `SocialSidebar.tsx`.

**Email delivery is live**, via Resend — a submitted form sends a real email
to `munibahmad47@gmail.com`, verified end-to-end with a real test submission.
`RESEND_API_KEY` is set locally; it still needs to be added to Vercel's
environment variables (marked Sensitive) for production to send mail — see
[FIXES.md](./FIXES.md).

## Quality / accessibility work already done

- `tsc --noEmit` and `next build` both pass clean.
- Mobile nav: focus trap, `aria-expanded`/`aria-controls`, Esc-to-close, scroll lock, focus restore.
- Skill bars: per-element `IntersectionObserver`, no stuck-at-0% bug, instant reveal on reduced-motion.
- Horizontal-overflow guards (`overflow-x: clip` on `<main>`), hero stacks text-first on mobile/tablet.
- `prefers-reduced-motion` respected across GSAP, AOS, and Three.js.

## Known gaps / unfinished work

These are tracked in more detail in the README's "What's Left To Do" section:

- No sitewide OpenGraph/Twitter share image for the home page itself (project
  pages now have one from their hero screenshot; the home page's `openGraph`
  still has no `images`).
- No analytics of any kind wired up.
- Dead code: `DynamicResumeEngine.tsx` and `ResumePDF.tsx` are unused since the
  résumé download was removed from the nav; `@react-pdf/renderer` could be
  dropped unless the download is relocated.
- No automated tests, no CI.
- The 9 GoHighLevel projects still use the generated `AbstractMockup` instead of real screenshots.
- Lighthouse performance score hasn't been measured in a real (non-headless) run since the perf pass.

For recommendations on all of the above, plus domain and automation tooling,
see [IMPROVEMENTS.md](./IMPROVEMENTS.md).
