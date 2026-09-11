# Progress Log — What's Been Done

A snapshot of the portfolio's current state, for future reference. See the main
[README.md](../README.md) for the up-to-date, maintained version of this
information (structure, tunables, full checklist) — this file is a point-in-time
summary of everything built so far.

**Live site:** munib-archetect-portfolio.vercel.app (see
[IMPROVEMENTS.md](./IMPROVEMENTS.md) for a note on this domain)
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
bots, loading/success/error UI states.

**Email delivery is scaffolded but not yet wired.** The real Resend `fetch`
call is written out in `app/api/contact/route.ts` but left commented, gated
behind `RESEND_API_KEY`. Without the key set, the route runs in "scaffold"
mode — it validates and logs the message and returns success, so the form
stays fully functional with zero secrets configured, but no email is actually
sent. See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for the activation steps.

## Quality / accessibility work already done

- `tsc --noEmit` and `next build` both pass clean.
- Mobile nav: focus trap, `aria-expanded`/`aria-controls`, Esc-to-close, scroll lock, focus restore.
- Skill bars: per-element `IntersectionObserver`, no stuck-at-0% bug, instant reveal on reduced-motion.
- Horizontal-overflow guards (`overflow-x: clip` on `<main>`), hero stacks text-first on mobile/tablet.
- `prefers-reduced-motion` respected across GSAP, AOS, and Three.js.

## Known gaps / unfinished work

These are tracked in more detail in the README's "What's Left To Do" section:

- No `sitemap.ts` / `robots.ts` yet (App Router conventions) — matters for 27 indexable pages.
- No OpenGraph/Twitter share image (`openGraph.images` is empty in `app/layout.tsx`).
- No JSON-LD structured data (`Person` / `CreativeWork`).
- No analytics of any kind wired up.
- Dead code: `DynamicResumeEngine.tsx` and `ResumePDF.tsx` are unused since the
  résumé download was removed from the nav; `@react-pdf/renderer` could be
  dropped unless the download is relocated.
- No automated tests, no CI.
- The 9 GoHighLevel projects still use the generated `AbstractMockup` instead of real screenshots.
- Lighthouse performance score hasn't been measured in a real (non-headless) run since the perf pass.

For recommendations on all of the above, plus domain, email delivery activation,
and automation tooling, see [IMPROVEMENTS.md](./IMPROVEMENTS.md).
