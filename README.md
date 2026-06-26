# Munib Ahmad — Portfolio

A premium, animated developer portfolio for **Munib Ahmad** — Frontend Architect, Shopify
theme engineer, and GoHighLevel automation specialist. Showcases **27 live projects**
(18 Shopify storefronts + 9 GoHighLevel funnels) with a 3D particle background, GSAP
motion, per-project case-study pages, and a client-side generated PDF résumé.

> **Status:** Active build. TypeScript passes clean (`tsc --noEmit` → 0 errors).
> Core site is feature-complete; remaining work is polish, real assets, SEO, and cleanup
> (see [What's Left To Do](#-whats-left-to-do)).

---

## 🧱 Tech Stack

| Area            | Choice                                                          |
| --------------- | -------------------------------------------------------------- |
| Framework       | **Next.js 16** (App Router, React 19, TypeScript 6)            |
| Styling         | **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config`) |
| 3D / Background  | **Three.js 0.184** (custom particle shader field)             |
| Animation       | **GSAP 3.15**, **AOS 2.3.4**                                    |
| Carousels       | **Swiper 12** (`EffectCreative`)                               |
| PDF résumé      | **@react-pdf/renderer 4** (generated in-browser)               |
| Fonts           | Inter + Plus Jakarta Sans (Google Fonts)                       |

### Important build conventions
- Tailwind v4 uses `@import "tailwindcss"` + `@theme {}` inside [globals.css](app/globals.css) — **there is no `tailwind.config.ts`**.
- PostCSS plugin is `@tailwindcss/postcss` (see [postcss.config.mjs](postcss.config.mjs)).
- `@react-pdf/renderer` is listed under `serverExternalPackages` in [next.config.ts](next.config.ts); it is imported **dynamically, client-side only**.
- Three.js renders only on the client via [ThreeBackgroundWrapper.tsx](components/ThreeBackgroundWrapper.tsx) (`dynamic(..., { ssr: false })`).
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

---

## 🗂️ Project Structure

```
app/
  layout.tsx              # Metadata, Google Fonts, AOSProvider
  page.tsx                # Home — composes all sections
  globals.css             # Tailwind v4 config + custom animations + design tokens
  projects/[id]/page.tsx  # Dynamic per-project case-study pages (SSG via generateStaticParams)

components/
  ThreeBackground.tsx         # Particle field (shader material, mouse parallax)
  ThreeBackgroundWrapper.tsx  # Client wrapper for the dynamic, ssr:false import
  Navigation.tsx              # Sticky nav, active-section tracking, mobile menu, résumé modal
  SocialSidebar.tsx           # Fixed left rail — GitHub / LinkedIn / Email expanding pills
  Hero.tsx                    # GSAP timeline entrance, stats row
  About.tsx                   # Info cards + personal quote
  Skills.tsx                  # IntersectionObserver animated skill bars + badge cloud
  Portfolio/
    index.tsx                 # GSAP filter transitions, 3-column project grid
    ProjectCard.tsx           # Card linking to /projects/[slug]
    AbstractMockup.tsx        # Generated SVG/gradient "screenshot" per project
    ExperienceTimeline.tsx    # Work-history timeline section
  SwiperShowcase.tsx          # EffectCreative slider — 6 featured projects
  Contact.tsx                 # mailto form + contact link cards
  Footer.tsx                  # Minimal branded footer
  AOSProvider.tsx             # AOS.init client wrapper
  DynamicResumeEngine.tsx     # ✅ ACTIVE résumé PDF (photo, all skills, all 27 projects)
  ResumePDF.tsx               # ⚠️ LEGACY/unused earlier résumé version (see cleanup TODO)

data/
  projects.ts             # All 27 projects (slug, url, tags, gradients, accent colors)
  skills.ts               # Skill groups + tech badge cloud
  experience.ts           # Work history (feeds résumé + timeline)

types/
  resume.ts               # WorkExperience / ResumeRole types

public/images/            # profile photos + 2 category images (shopify.webp, ghl.jpg)
```

---

## ✅ What's Been Done

### Pages & Sections
- [x] **Home page** composing all sections over a fixed Three.js particle canvas.
- [x] **Hero** with GSAP timeline entrance animation and a live-stats row.
- [x] **About**, **Skills** (animated bars via IntersectionObserver), **Experience Timeline**.
- [x] **Portfolio grid** with GSAP-animated `All / Shopify / GoHighLevel` filtering.
- [x] **Swiper showcase** of 6 featured projects (`EffectCreative`).
- [x] **Contact** section (mailto form + link cards) and branded **Footer**.

### Per-Project Case Studies
- [x] Dynamic route `/projects/[id]` statically generated for all 27 projects via `generateStaticParams`.
- [x] Per-project `generateMetadata` (title, description, OpenGraph).
- [x] Hero, overview, derived feature bullets, full tech-stack tags, prev/next navigation, CTA.
- [x] `AbstractMockup` generates a unique gradient "browser preview" per project.

### Résumé Generator
- [x] **Client-side PDF generation** via `@react-pdf/renderer` — no server, no static file.
- [x] Lazy-loaded on demand (`import('@/components/DynamicResumeEngine')`) to keep the bundle small.
- [x] Animated "generating → ready" modal with progress copy and download button.
- [x] Output includes profile photo, summary, all skill groups, full work history, and **all 27 projects** in a two-column A4 layout with a fixed footer.

### Data & Content
- [x] All 27 projects modeled in [data/projects.ts](data/projects.ts) with slugs, live URLs, roles, tags, and per-project gradient/accent tokens.
- [x] Skills ([data/skills.ts](data/skills.ts)) and work experience ([data/experience.ts](data/experience.ts)) centralized and reused by both the site and the résumé.

### Foundation
- [x] SEO metadata + OpenGraph on the home layout.
- [x] Tailwind v4 CSS-first theme and design tokens (emerald `#10B981` / cyan `#06B6D4` on near-black).
- [x] Responsive nav with active-section tracking and a mobile menu.
- [x] Fixed social sidebar engineered to stay clickable across every page fold.
- [x] `tsc --noEmit` passes with **0 type errors**.

---

## 📋 What's Left To Do

### 🔴 Cleanup / Correctness
- [ ] **Remove dead résumé code** — the résumé download was removed from the header nav, so both [DynamicResumeEngine.tsx](components/DynamicResumeEngine.tsx) and [ResumePDF.tsx](components/ResumePDF.tsx) are now unused and the `@react-pdf/renderer` dependency can be dropped — *unless* the résumé download is relocated (e.g. Hero or Contact).
- [ ] Run `npm run build` end-to-end and confirm the production build (not just `tsc`) is clean.
- [ ] Audit duplicated design tokens — colors are redeclared per-file as inline hex; consider centralizing.

### 🟠 Content & Assets
- [ ] Replace `AbstractMockup` placeholders with **real project screenshots** (or OG thumbnails) for the portfolio grid and case-study pages.
- [ ] Add a proper **OpenGraph / Twitter share image** (currently OG has no `images`).
- [ ] Verify all 27 project URLs, roles, and descriptions are accurate and up to date.

### 🟡 SEO & Performance
- [ ] Add `sitemap.ts` and `robots.ts` (App Router conventions) — important for 27 indexable case-study pages.
- [ ] Add JSON-LD structured data (`Person` / `CreativeWork`) for richer search results.
- [ ] Lighthouse / Core Web Vitals pass (the portfolio itself markets CWV expertise — it should score top-tier).
- [ ] Consider `prefers-reduced-motion` handling for GSAP / AOS / Three.js animations (accessibility + battery).

### 🟢 Features & Enhancements
- [ ] Replace the `mailto` contact form with a real submission backend (e.g. a Route Handler + email/CRM webhook — fitting given the GHL skillset).
- [ ] Add form validation + success/error states to Contact.
- [ ] Optional: light/dark theme toggle (currently dark-only).
- [ ] Optional: blog / writing section.

### 🔵 Quality & Tooling
- [ ] Add tests (at minimum a smoke/render test for pages and the data layer).
- [ ] Set up CI (typecheck + lint + build on push).
- [ ] Document the deployment target (Vercel assumed) and add any required env/config.
- [ ] Accessibility audit — keyboard nav, focus states, color contrast, `aria` coverage on the résumé modal and sidebar.

---

## 👤 Author

**Munib Ahmad** — Frontend Architect · Shopify & GoHighLevel Developer · Lahore, Pakistan
[GitHub](https://github.com/Munib47/) · [LinkedIn](https://www.linkedin.com/in/munib-ahmad-294524237)
