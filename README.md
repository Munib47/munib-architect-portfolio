# Munib Ahmad — Portfolio

A premium, animated developer portfolio for **Munib Ahmad** — Frontend Architect, Shopify
theme engineer, and GoHighLevel automation specialist. Showcases **26 live projects**
(17 Shopify storefronts + 9 GoHighLevel funnels) with a 3D particle background, GSAP
motion, per-project case-study pages, and a working contact form.

> **Status:** Active build. `tsc --noEmit` **and** `next build` both pass clean.
> A senior-QA hardening pass (contact form, skill-bar animation, horizontal-overflow,
> hero layout, fixed overlays, performance, accessibility) is complete — see
> [QA Hardening Pass](#-qa-hardening-pass-jun-2026). Remaining work is polish, real
> assets, and SEO (see [What's Left To Do](#-whats-left-to-do)).

---

## 🧱 Tech Stack

| Area            | Choice                                                          |
| --------------- | -------------------------------------------------------------- |
| Framework       | **Next.js 16** (App Router, React 19, TypeScript 6)            |
| Styling         | **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config`) |
| 3D / Background  | **Three.js 0.184** (particle field, perf-gated render loop)   |
| Animation       | **GSAP 3.15**, **AOS 2.3.4**                                    |
| Carousels       | **Swiper 12** (`EffectCreative`)                               |
| Fonts           | Inter + Plus Jakarta Sans (Google Fonts)                       |

> `@react-pdf/renderer` is still installed but currently **unwired** — see the résumé
> note under [Cleanup](#-cleanup--correctness).

### Important build conventions
- Tailwind v4 uses `@import "tailwindcss"` + `@theme {}` inside [globals.css](app/globals.css) — **there is no `tailwind.config.ts`**.
- PostCSS plugin is `@tailwindcss/postcss` (see [postcss.config.mjs](postcss.config.mjs)).
- Three.js renders only on the client via [ThreeBackgroundWrapper.tsx](components/ThreeBackgroundWrapper.tsx) (`dynamic(..., { ssr: false })`) so it never blocks first paint.
- Every interactive component is marked `'use client'`. Do **not** add `"type": "commonjs"` to `package.json` (must stay ESM).

---

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script          | Action                          |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the dev server            |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Run ESLint (`eslint-config-next`)|

### Environment

The contact form posts to a Route Handler at `/api/contact`. Email delivery is
**scaffolded** — without a key it validates and logs the message (dev-friendly). To send
real mail, add a key to `.env.local` (git-ignored) and finish the `sendEmail` TODO in
[app/api/contact/route.ts](app/api/contact/route.ts):

```bash
RESEND_API_KEY=your_key_here
```

---

## 🗂️ Project Structure

```
app/
  layout.tsx              # Metadata, Google Fonts, AOSProvider
  page.tsx                # Home — composes all sections (<main> is overflow-x: clip)
  globals.css             # Tailwind v4 config + animations + design tokens + overflow guards
  projects/[id]/page.tsx  # Dynamic per-project case-study pages (SSG via generateStaticParams)
  api/contact/route.ts    # POST contact endpoint — validates, returns JSON, email TODO

components/
  ThreeBackground.tsx         # 3D THREE.Points cloud — auto-rotation + pointer parallax;
                              #   tunable constants; all perf guards (see Background Animation)
  ThreeBackgroundWrapper.tsx  # Client wrapper for the dynamic, ssr:false import
  Navigation.tsx              # Sticky nav, active-section tracking; a11y mobile menu
                              #   (focus trap, aria-expanded, Esc-to-close, scroll lock)
  SocialSidebar.tsx           # Fixed left rail (lg+ only) — GitHub / LinkedIn / Email
  Hero.tsx                    # GSAP entrance; text-first stacking on tablet/mobile
  About.tsx                   # Info cards + personal quote
  Skills.tsx                  # Per-element animated skill bars (reduced-motion safe) + badges
  Portfolio/
    index.tsx                 # GSAP filter transitions, 3-column project grid
    ProjectCard.tsx           # Card linking to /projects/[slug]
    AbstractMockup.tsx        # Generated SVG/gradient "screenshot" per project
    ExperienceTimeline.tsx    # Work-history timeline + fixed back-to-top button
  SwiperShowcase.tsx          # EffectCreative slider — 6 featured projects
  Contact.tsx                 # Controlled form → POST /api/contact + contact link cards
  Footer.tsx                  # Minimal branded footer
  AOSProvider.tsx             # AOS.init + refresh on layout change; disabled on reduced-motion
  DynamicResumeEngine.tsx     # ⚠️ Unused — résumé PDF (download removed from nav)
  ResumePDF.tsx               # ⚠️ Unused — legacy résumé version

data/
  projects.ts             # All 26 projects (slug, url, tags, gradients, accent colors)
  skills.ts               # Skill groups + tech badge cloud
  experience.ts           # Work history (feeds timeline)

types/
  resume.ts               # WorkExperience / ResumeRole types

public/images/            # profile photos + 2 category images (shopify.webp, ghl.jpg)
```

---

## 🌌 Background Animation

The fixed full-viewport background is a **3D Three.js point cloud**
([ThreeBackground.tsx](components/ThreeBackground.tsx)), loaded client-only via
[ThreeBackgroundWrapper.tsx](components/ThreeBackgroundWrapper.tsx). It's a `THREE.Points`
cloud built from a `BufferGeometry` of N vertices spread across a 3D volume (40 × 30 × 24).
Depth is felt three ways: `sizeAttenuation` (nearer points render larger), slow
auto-rotation, and **pointer-driven parallax** — the cloud sits in a `THREE.Group` that
tilts toward the cursor while the camera pans, so near points swing more than far ones.

### Tunable constants
All live at the top of [ThreeBackground.tsx](components/ThreeBackground.tsx) as named,
commented module constants:

| Constant | Value | Role |
| --- | --- | --- |
| `EASING` | `0.18` | Cursor-follow lerp factor — higher tracks the pointer faster (was `0.025`, the source of the old sluggishness). |
| `DRIFT_SPEED` | `0.006` | Autonomous movement — per-particle drift + auto-rotation speed (was `0.004`). |
| `MOUSE_RADIUS` | `0.5` | Pointer interaction reach, normalized to half the viewport (smaller = full strength nearer centre). |
| `MOUSE_FORCE` | `0.6` | Parallax strength — camera-pan + cloud-tilt amplitude. |
| `PARTICLE_COUNT` | `2200` | Desktop base count; scaled down per device at runtime. |

### Performance guards (all required, all present)
- **Dynamic import, `ssr:false`** — the wrapper defers Three.js entirely, so it never blocks first paint.
- **Fewer particles on mobile/touch/low-DPR** — `pointer: coarse` + `devicePixelRatio < 1.5` + small viewport drop the count to ~30% of base (~660); the 768–1279px tier uses ~68% (~1500).
- **Pixel-ratio cap** — `renderer.setPixelRatio(Math.min(dpr, 1.5–2))`.
- **Off-screen / hidden-tab pause** — an `IntersectionObserver` and `visibilitychange` gate the rAF loop; it only runs when on-screen *and* the tab is visible.
- **Reduced-motion fallback** — `prefers-reduced-motion: reduce` returns early before any WebGL is created; the div's CSS gradient is the static fallback.
- **Disposal** — geometry, material, texture, and renderer are disposed and all listeners/observers removed on unmount (no WebGL context leaks).

### Dependencies
**None added** — reuses the `three` already in the project (no `@react-three/fiber`/`drei`).

### Measured numbers
> ⚠️ Frame-rate and Lighthouse can't be captured in the headless build environment used to
> author these changes — run them locally with the snippets below. The values are reasoned,
> not fabricated:

| Metric | Before | After | Notes |
| --- | --- | --- | --- |
| Cursor-follow lerp | `0.025` | `0.18` | ~7× snappier; settles in <0.1s vs ~2s. |
| Desktop frame rate | ~60fps target | unchanged by construction | Stage 1 changed only multiply constants (identical per-frame work). Stage 2 keeps the desktop count (2200) and adds only 4 eased lerps + a `lookAt` per frame — negligible. |
| First paint (FCP) | ~5.8s (QA report) | not regressed | Background is `ssr:false` (off the critical path); same/fewer particles than before. |

Confirm locally:
```bash
# Frame rate — paste in DevTools console:
let f=0,t=performance.now();(function l(n){f++;if(n-t>=1000){console.log('fps',f);f=0;t=n}requestAnimationFrame(l)})(t);

# Lighthouse performance:
npm run build && npm run start
npx -y lighthouse http://localhost:3000 --only-categories=performance --view
```

---

## ✅ What's Been Done

### Pages & Sections
- [x] **Home page** composing all sections over a fixed Three.js particle canvas.
- [x] **Hero** with GSAP timeline entrance animation and a live-stats row.
- [x] **About**, **Skills** (per-element animated bars), **Experience Timeline**.
- [x] **Portfolio grid** with GSAP-animated `All / Shopify / GoHighLevel` filtering.
- [x] **Swiper showcase** of 6 featured projects (`EffectCreative`).
- [x] **Contact** section (working form + link cards) and branded **Footer**.

### Per-Project Case Studies
- [x] Dynamic route `/projects/[id]` statically generated for all 26 projects via `generateStaticParams`.
- [x] Per-project `generateMetadata` (title, description, OpenGraph).
- [x] Hero, overview, derived feature bullets, full tech-stack tags, prev/next navigation, CTA.
- [x] `AbstractMockup` generates a unique gradient "browser preview" per project.

### Data & Content
- [x] All 26 projects modeled in [data/projects.ts](data/projects.ts) with slugs, live URLs, roles, tags, and per-project gradient/accent tokens.
- [x] Skills ([data/skills.ts](data/skills.ts)) and work experience ([data/experience.ts](data/experience.ts)) centralized.

### Foundation
- [x] SEO metadata + OpenGraph on the home layout.
- [x] Tailwind v4 CSS-first theme and design tokens (emerald `#10B981` / cyan `#06B6D4` on near-black).
- [x] Responsive nav with active-section tracking and an accessible mobile menu.
- [x] `tsc --noEmit` and `next build` both pass clean.

---

## 🛠️ QA Hardening Pass (Jun 2026)

A senior-QA review found and fixed the following. All verified against `tsc` + `next build`;
the contact API was exercised live (200 / 422 / 405).

1. **Contact form — now sends.** Rewrote [Contact.tsx](components/Contact.tsx) as a controlled
   form that POSTs JSON to the new [/api/contact](app/api/contact/route.ts) Route Handler.
   Loading / success / error states, per-field validation, disabled-while-submitting, honeypot.
   Email delivery is scaffolded with a clear `RESEND_API_KEY` TODO.
2. **Skill bars never stuck at 0%.** [Skills.tsx](components/Skills.tsx) uses a per-element,
   one-shot `IntersectionObserver` with a guaranteed count-up; the resting value is always the
   real `level`, and `prefers-reduced-motion` reveals it instantly.
3. **Horizontal overflow fixed.** Removed the `translateX(100px)` AOS source (Contact now uses
   vertical reveals), added `AOS.refresh()` on layout/resize, and added overflow guards
   (`overflow-x: hidden` on html/body, `overflow-x: clip` on `<main>`).
4. **Hero stacks text-first** on tablet/mobile (`column`, not `column-reverse`) so the primary
   CTA stays above the fold on 375×667 and 768×1024.
5. **Fixed overlays.** Left social rail hidden below `lg` (1024px); back-to-top keeps a `2rem`
   safe margin.
6. **Performance.** Three.js render loop pauses on `visibilitychange` (tab hidden) and via
   `IntersectionObserver`; particle count scales 2200→1500→900 by viewport (600 + single static
   frame on reduced-motion); DPR capped to 1.5 on mobile; AOS set to `once` + disabled on
   reduced-motion. (Background was already `ssr:false`, so it never blocks FCP.)
7. **Accessibility.** Hero role list gets a clean `sr-only` label (visual `/` separators are
   `aria-hidden`); mobile menu has `aria-expanded`/`aria-controls`, a focus trap, Esc-to-close,
   scroll lock, and focus restore.

---

## 📋 What's Left To Do

### 🔴 Cleanup / Correctness
- [ ] **Remove dead résumé code** — the résumé download was removed from the nav, so both [DynamicResumeEngine.tsx](components/DynamicResumeEngine.tsx) and [ResumePDF.tsx](components/ResumePDF.tsx) are unused and `@react-pdf/renderer` can be dropped — *unless* the download is relocated (e.g. Hero or Contact).
- [ ] **Wire real email delivery** — finish the `sendEmail` TODO in [/api/contact](app/api/contact/route.ts) (Resend via `fetch`) and set `RESEND_API_KEY`.
- [ ] Audit duplicated design tokens — colors are redeclared per-file as inline hex; consider centralizing.

### 🟠 Content & Assets
- [ ] Replace `AbstractMockup` placeholders with **real project screenshots** (or OG thumbnails).
- [ ] Add a proper **OpenGraph / Twitter share image** (currently OG has no `images`).
- [ ] Verify all 26 project URLs, roles, and descriptions are accurate and up to date.

### 🟡 SEO & Performance
- [ ] Add `sitemap.ts` and `robots.ts` (App Router conventions) — important for 26 indexable case-study pages.
- [ ] Add JSON-LD structured data (`Person` / `CreativeWork`).
- [ ] **Confirm the Lighthouse number** — run `npx lighthouse http://localhost:3000 --only-categories=performance` after `npm run build && npm run start`. (Before this pass: FCP ~5.8s reported; the perf fixes target < 2s but the score still needs a real headless run.)

### 🟢 Features & Enhancements
- [x] ~~Replace the `mailto` contact form with a real submission backend~~ — done (`/api/contact`; email delivery scaffolded).
- [x] ~~Add form validation + success/error states to Contact~~ — done.
- [x] ~~`prefers-reduced-motion` handling for GSAP / AOS / Three.js~~ — done.
- [ ] Optional: light/dark theme toggle (currently dark-only).
- [ ] Optional: blog / writing section.

### 🔵 Quality & Tooling
- [ ] Add tests (at minimum a smoke/render test for pages and the data layer).
- [ ] Set up CI (typecheck + lint + build on push).
- [ ] Document the deployment target (Vercel assumed) and add any required env/config.
- [ ] Finish the accessibility audit — color contrast, remaining focus states, and the social rail.

---

## 👤 Author

**Munib Ahmad** — Frontend Architect · Shopify & GoHighLevel Developer · Lahore, Pakistan
[GitHub](https://github.com/Munib47/) · [LinkedIn](https://www.linkedin.com/in/munib-ahmad-294524237)
