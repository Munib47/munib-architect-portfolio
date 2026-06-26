# Munib Ahmad — Portfolio

A premium, animated developer portfolio for **Munib Ahmad** — Frontend Architect, Shopify
theme engineer, and GoHighLevel automation specialist. Showcases **27 live projects**
(18 Shopify storefronts + 9 GoHighLevel funnels) with a 3D particle background, GSAP
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
  ThreeBackground.tsx         # Particle field; render loop pauses off-screen/tab-hidden,
                              #   scales particles to device, static frame on reduced-motion
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
  projects.ts             # All 27 projects (slug, url, tags, gradients, accent colors)
  skills.ts               # Skill groups + tech badge cloud
  experience.ts           # Work history (feeds timeline)

types/
  resume.ts               # WorkExperience / ResumeRole types

public/images/            # profile photos + 2 category images (shopify.webp, ghl.jpg)
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
- [x] Dynamic route `/projects/[id]` statically generated for all 27 projects via `generateStaticParams`.
- [x] Per-project `generateMetadata` (title, description, OpenGraph).
- [x] Hero, overview, derived feature bullets, full tech-stack tags, prev/next navigation, CTA.
- [x] `AbstractMockup` generates a unique gradient "browser preview" per project.

### Data & Content
- [x] All 27 projects modeled in [data/projects.ts](data/projects.ts) with slugs, live URLs, roles, tags, and per-project gradient/accent tokens.
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
- [ ] Verify all 27 project URLs, roles, and descriptions are accurate and up to date.

### 🟡 SEO & Performance
- [ ] Add `sitemap.ts` and `robots.ts` (App Router conventions) — important for 27 indexable case-study pages.
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
