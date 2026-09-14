# Fixes Log

Everything from [IMPROVEMENTS.md](./IMPROVEMENTS.md) (or found along the way)
that's actually been done, in the order it happened. Newest first isn't used
here — this reads top-to-bottom as it occurred, so later entries sometimes
build on or correct earlier ones (see the domain fix under SEO, second pass).

---

## SEO essentials — first pass

- `app/sitemap.ts` and `app/robots.ts` added — 27 case-study pages + home
  page are now all indexable, sourced live from `data/projects.ts`.
- `metadataBase` added to `app/layout.tsx` via a new `lib/site.ts` — one
  `SITE_URL` constant, override with `NEXT_PUBLIC_SITE_URL` once a custom
  domain goes live (see IMPROVEMENTS.md §1).
- JSON-LD `Person` schema added to the root layout.
- Per-project pages now set a canonical URL and use the project's real hero
  screenshot as `og:image` — the 18 Shopify case studies have a working
  share-image, verified against a live server.

## SEO — second pass, fixed against a site-auditor report

- **Wrong domain everywhere (the real bug behind two of the auditor's
  warnings).** `lib/site.ts` was pointing at the typo'd
  `munib-archetect-portfolio.vercel.app` — which meant the canonical tag,
  `og:url`, and every `<loc>` in the sitemap all pointed at a URL that
  404s. That's what the auditor's "canonical points to a variant URL" and
  "sitemap... not detected" warnings were actually about. Fixed by pointing
  `SITE_URL` at the real, live domain (`munib-architect-portfolio.vercel.app`)
  — verified live that canonical, `og:url`, robots.txt's `Sitemap:` line,
  and every sitemap `<loc>` now all resolve to a 200.
- **Meta description** shortened from 139 → 114 characters and rewritten to
  lead with the main value ("27+ live Shopify stores & GoHighLevel
  funnels...") instead of "Premium portfolio of..." — won't truncate in
  search results now.
- **HSTS header** added via `next.config.ts`
  (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`)
  — verified present on live responses.
- **Favicon** added (`app/icon.svg` — Next.js file-convention icon) —
  previously the site had none at all. First pass used an "M" monogram.
- **Keyword density** ("shopify" 99×/2738 words, 3.6%) — confirmed with the
  auditor's own report as informational, not an error; no fix needed.

## Favicon redesign + hreflang

- **Favicon redesigned** from the "M" monogram into a `</>` code-bracket
  glyph (`app/icon.svg`, geometric paths rather than a font so it stays
  crisp at 16px favicon size) in the brand emerald→cyan gradient — reads as
  "developer" rather than "initial," per request.
- **Hreflang** — added a self-referencing `en` + `x-default` hreflang tag
  (home page and every project page, via `alternates.languages`). Not
  multi-language support — there's still only one version of each page —
  but a self-referencing hreflang is Google's own recommended practice for
  single-language sites, and it's what actually clears an auditor's "no
  hreflang tags found" flag honestly (see IMPROVEMENTS.md §9 for why the
  site isn't getting real Arabic/Urdu/Hindi versions).

## SocialSidebar icon/label spacing fix

- Fixed the GitHub/LinkedIn/Email pill in the fixed left rail
  (`components/SocialSidebar.tsx`): icon and label now sit a consistent,
  correctly-padded gap apart instead of the layout re-centering unevenly on
  hover.
- **Root cause, worth knowing about elsewhere in the codebase:**
  `app/globals.css` has a base reset —
  `*, *::before, *::after { margin: 0; padding: 0; }` — written as plain
  CSS, not wrapped in `@layer base`. Tailwind v4 ships its utilities inside
  `@layer utilities`, and CSS cascade layers give *any* unlayered rule
  priority over *every* layered rule regardless of selector specificity or
  source order — so every Tailwind spacing utility (`p-*`, `m-*`, `px-*`,
  `py-*`, `mx-*`, `my-*`, `space-x-*`/`space-y-*`) silently resolves to `0`
  everywhere in this codebase. (`gap-*` and `w-*`/`h-*` are unaffected.)
  Fixed locally by using inline `style` for spacing on the sidebar's `<a>`
  tags, matching the pattern already used elsewhere in this file. The
  root-cause fix (wrap the reset in `@layer base`) is a bigger, deliberate
  change — tracked as still open in IMPROVEMENTS.md §5.

## npm install-script warnings fixed

- Vercel build logs showed `npm warn allow-scripts` for `sharp` (pulled in
  by `next`, used by `next/image` optimization) and `unrs-resolver` (pulled
  in by `eslint-config-next`, lint-only). npm 11+ blocks install scripts
  from any dependency not explicitly trusted, as a supply-chain-attack
  defense. Ran `npm approve-scripts --all`, which added a small
  `allowScripts` allowlist to `package.json` pinned to the exact versions
  (`sharp@0.34.5`, `unrs-resolver@1.12.2`). Verified `tsc --noEmit` and
  `next build` still pass clean, and a fresh `npm install` shows no more
  warnings.

## Resend email delivery activated

- `app/api/contact/route.ts` had the real Resend `fetch` call written out
  but commented out ("scaffold mode" — validated and logged messages
  without ever sending mail). Activated it: uncommented the call, added
  HTML-escaping for the name/email/message fields going into the email
  body.
- User created a Resend account and API key (Sending-access permission,
  not Full access — least-privilege for a key that only needs to send).
  Added `RESEND_API_KEY` to `.env.local` (git-ignored, confirmed it never
  reaches the repo).
- **Verified live** — submitted a real test payload to `/api/contact`
  locally; confirmed via the server log that it took the real Resend send
  path (not the scaffold/log-only branch); user confirmed the email
  arrived in their primary inbox (not spam) at `munibahmad47@gmail.com`.
- **Still open, not urgent:** the `from` address is Resend's shared
  `onboarding@resend.dev` sender, which only delivers to the Resend
  account owner's own inbox — fine for this form since everything goes to
  the owner anyway. Switching to a `from` address on a verified custom
  domain (e.g. `contact@munibahmad.dev`) improves deliverability and is a
  natural next step once the domain move in IMPROVEMENTS.md §1 happens,
  since it's a few DNS records added while already touching DNS.
- **Still needed for production:** `RESEND_API_KEY` must also be added in
  Vercel (Project → Settings → Environment Variables, marked **Sensitive**)
  and the project redeployed — the key only exists locally until then.

## Contact card icons: emoji → SVG

- `components/Contact.tsx`'s contact-link cards (Email/Phone/LinkedIn/
  GitHub) were using raw emoji characters (✉️ 📞 💼 ⬡) as icons, which
  render inconsistently across platforms/fonts and don't match the brand's
  visual language.
- Extracted the SVG icon set into a new shared file,
  `components/icons/SocialIcons.tsx` (`GitHubIcon`, `LinkedInIcon`,
  `MailIcon`, plus a new `PhoneIcon` in the same stroked style as the mail
  glyph), and refactored `SocialSidebar.tsx` to import from it too instead
  of duplicating the definitions — so the fixed left rail and the contact
  cards now render the exact same icons.
- Verified visually with a live render: all four cards show proper SVG
  icons (envelope, phone handset, LinkedIn "in" mark, GitHub octocat),
  each correctly colored via `currentColor` to match its card's accent.

## Home page OG/Twitter share image

- The home page had no `og:image`/`twitter:image` — sharing the link on
  LinkedIn/Twitter/Slack showed no preview. Project case-study pages already
  had one (their hero screenshot); the home page didn't.
- Used Next.js's file-convention image generation (`app/opengraph-image.tsx`,
  `app/twitter-image.tsx`, both built on `next/og`'s `ImageResponse`) instead
  of a static designed asset — a 1200×630 branded card (dark background,
  brand emerald→cyan accents, the same `</>` glyph as the favicon, name,
  title, and the "27+ live Shopify stores & GoHighLevel funnels" line),
  generated from JSX/CSS so there's no image file to keep in sync with the
  brand if colors ever change. Shared the actual visual between both files
  via `lib/og-image.tsx` rather than duplicating it.
- Removed the initially-added `runtime = 'edge'` export — it forced the
  image to regenerate on every request (shows as dynamic `ƒ` in the build
  output) for content that never changes; without it, Next.js generates the
  image once at build time (`○` static) instead.
- Verified against a real production build: fetched `/opengraph-image`
  directly and confirmed the rendered PNG looks correct, then confirmed the
  home page emits fully-formed `og:image`/`twitter:image` meta tags
  (absolute URL, correct dimensions, alt text) with zero manual metadata
  config needed — Next.js wires it up automatically from these files.

## Skills section icons: emoji → SVG, one shared renderer

- The Skills & Expertise section (`components/Skills.tsx`) used raw emoji
  (⚡ 🎬 🛒 🚀 for categories; ▲ ⚛️ 🌐 🎨 💧 🌅 📈 🤖 📧 🔌 📅 etc. for
  individual skills — 33 icons total) instead of SVG, same underlying issue
  as the earlier Contact card fix.
- Built one reusable renderer, `components/icons/TechIcon.tsx` — every icon
  is a data entry (`{ viewBox, mode: 'fill' | 'stroke', shapes: [...] }`)
  rendered through this single component, not a bespoke component per icon.
  `shapes` are simple primitives (`path`/`rect`/`circle`/`line`), so
  multi-part icons (calendar, envelope, cart) don't need one hand-encoded
  compound path.
- Path data lives in `lib/tech-icons.ts`, keyed by icon name:
  - **Brand logos** (`mode: 'fill'`) — Next.js, React, TypeScript,
    JavaScript, HTML5, Tailwind CSS, Bootstrap, MUI, GSAP, Three.js,
    Shopify, Framer, Swiper. Path data sourced from the `simple-icons`
    project's SVG data for accuracy (temporarily installed with `--no-save`
    purely to copy the exact path strings, then removed — confirmed via
    `git status` that `package.json`/`package-lock.json` were never
    touched; it's not a runtime dependency).
  - **Generic concept icons** (`mode: 'stroke'`) — calendar, funnel, cart,
    plug, link, envelope, sliders, sunrise, package, trending-up, etc. —
    hand-built from simple primitives since there's no official mark to
    match for concepts like "Webhook Integrations" or "Booking Calendars."
- `data/skills.ts`'s `icon` fields now hold these string keys (e.g.
  `'nextjs'`, `'funnel'`) instead of emoji characters; `Skills.tsx` looks
  each key up in `TECH_ICONS` and renders it via `<TechIcon>`.
- Verified visually with a live render (screenshots, including zoomed
  crops): every category and skill icon renders as a crisp, correctly
  colored SVG — brand marks are recognizable (Next.js, React, TypeScript,
  Shopify, etc.), generic icons read clearly at the small size used.

## HTML5/CSS3 split into two icons, plus a full-project emoji audit

- The "HTML5 / CSS3" skill row showed one HTML5 icon for two technologies.
  Added an optional `parts` field to the `Skill` type
  (`{ icon: string; label: string }[]`) for skills that bundle more than
  one technology under one bar — `Skills.tsx` now renders each part with
  its own icon before its own label when `parts` is set, joined by "/",
  instead of a single icon for the whole line. Added the CSS3 brand icon
  to `lib/tech-icons.ts` (same `simple-icons` sourcing as the others) to
  fill the second slot. Currently the only skill using `parts`.
- Ran a full-codebase scan (`app/`, `components/`, `data/`, `lib/`,
  `types/`) for any remaining pictographic emoji used as icons. Found two:
  a plain "✓" checkmark in `Contact.tsx`'s success message and the
  "Message Sent" button label. Added a `check` icon to `lib/tech-icons.ts`
  and replaced both. See [ICON_AUDIT.md](./ICON_AUDIT.md) for the full
  scan results — nothing else found, nothing left outstanding, nothing
  was too difficult to replace.
- Verified live: screenshotted the HTML5/CSS3 row (shows both icons
  correctly), and submitted a real test contact-form entry to confirm the
  checkmark renders correctly in both the success banner and the button.

## CSS3 icon swapped for the classic shield mark

- The CSS3 icon initially used the newer flat "CSS" wordmark logo (from
  `simple-icons`), which reads ambiguously at 14px next to the HTML5 icon.
  Swapped it for the classic single-tone "shield with a 3" mark instead
  (sourced from Font Awesome's `css3-alt`, matching the official W3C-style
  badge everyone recognizes) — same sourcing approach as the other brand
  icons: temporarily installed `@fortawesome/fontawesome-free` with
  `--no-save` to copy the exact path, then removed it (confirmed via
  `git status` that `package.json`/`package-lock.json` were never touched).
- Verified the path data by rendering it standalone at full size (120×160)
  before trusting it in the small in-context icon — confirmed it's the
  correct shield-and-3 shape, with `fill-rule="evenodd"` (the default in
  `TechIcon`) rendering identically to the unset default, so no risk there.

## Added 4 skills: Shopify Polaris, Sass, Less, Anime.js

- Added to `data/skills.ts` — Polaris, Sass, Less under Frontend Development
  (per request), Anime.js under Animation & 3D. Icon paths for Sass, Less,
  and Anime.js sourced from `simple-icons` (same temp-install-then-remove
  approach as every other brand icon here). Polaris has no `simple-icons`
  brand mark (it's Shopify's internal design system, not independently
  catalogued), so it uses a generic compass icon instead — a deliberate,
  thematically-apt choice ("Polaris" = north star / navigation), not a
  placeholder standing in for a missing accurate mark.
- Proficiency percentages (Polaris 85%, Sass 88%, Less 82%, Anime.js 80%)
  are placeholder defaults, explicitly requested as such — roughly matched
  to comparable existing skills, not a claim of verified real numbers.
  Update these directly in `data/skills.ts` whenever exact levels are known.
- Verified visually with a live render — all four show correct, recognizable icons.

## Added WordPress, ClickFunnels, Unbounce + equal-height skill cards

**Skills added** (placeholder proficiency %, same as above — correct them in
`data/skills.ts` anytime):
- **WordPress** → Frontend Development. That card is the general
  "web platforms/tooling" bucket; none of the other three categories fit a CMS.
  Uses its real `simple-icons` brand mark.
- **ClickFunnels** and **Unbounce** → GoHighLevel & CRM. That category was
  already general funnel/marketing-automation work (Funnel Building, Webhook
  Integrations, Booking Calendars), not GHL-branded things only. Neither has a
  `simple-icons` entry, so both use deliberate generic icons: a cursor for
  ClickFunnels (echoes "Click", and stays visually distinct from the `funnel`
  icon two rows above it) and a page-layout icon for Unbounce.

**Card height/layout** — the cards were already equal height (CSS Grid
stretches items in a row by default), but the *content* was lopsided: one
group had 12 skills and another had 7, leaving the shorter cards mostly empty.
Fixed by capping each card at `VISIBLE_SKILLS = 7` rows at rest — the size of
the smallest group — so all four render identical row counts and the shared
row height is tight instead of padded out with dead space. Measured live:
all four cards land at exactly the same height (453px collapsed, 666px when
one is expanded).

- Cards with more than 7 skills get an underlined **"Show N more"** toggle,
  pinned to the card's bottom edge (`marginTop: auto` on a flex column) so the
  button line stays aligned across cards.
- **Click, not hover.** Hover-to-expand was considered and rejected: touch
  devices have no hover state, so the extra skills would be permanently
  unreachable on mobile. Verified the button renders and is tappable at 390px
  with no horizontal overflow.
- Newly revealed bars pass a new `immediate` prop to `SkillBar`, which skips
  the scroll-triggered `IntersectionObserver` reveal. Without it, rows that
  land below the fold on expand sit at 0% with an empty bar until the user
  scrolls — caught this in a live screenshot (WordPress rendered 0%), since
  the user explicitly asked to see those rows by clicking.

**Follow-up — only the clicked card expands.** The first pass left the grid
on its default `align-items: stretch`, so expanding one card stretched all
four to match, filling the other three with dead space. Switched the grid to
`align-items: start` so each card sizes to its own content.

- That alone would have broken the rest-state alignment, since only two of
  the four cards have a "Show N more" button (a 16px difference, measured).
  Rather than hardcode a matching pixel height, cards without a toggle render
  an invisible `<span>` carrying the button's exact typography via a shared
  `TOGGLE_TEXT_STYLE` constant — so the two stay in lockstep automatically if
  the type is ever changed. It's `aria-hidden` and non-focusable, purely spacing.
- Measured live across all three states: **at rest** all four cards are 454px;
  **expanded** only the clicked card grows (668px) while the other three stay
  454px; **collapsed again** all four return to 454px.

## Meta descriptions normalized to 160–200 characters

- Home page rewritten to 169 characters (`app/layout.tsx`).
- Audited all 28 indexable pages by reading the meta description actually
  rendered by the dev server (not by parsing source), which found 4 project
  descriptions under 160 (145–159) and 4 over 200 (203–259). Rewrote those 8
  in `data/projects.ts`. Re-ran the audit: **28/28 now in range.**
- Note these project strings do double duty — they're the meta description
  *and* the visible blurb on the project card and case-study page, so the
  rewrites are user-facing copy changes too, not just metadata.
- ⚠️ **This contradicts the earlier SEO-auditor pass.** That tool flagged the
  139-character description as too long and asked for "135 characters or
  less," which is why it was cut to 114. The 160–200 target was requested
  afterwards. Worth knowing that Google truncates desktop snippets at roughly
  155–160 characters, so everything past that point won't display in search
  results — the value proposition is front-loaded in each rewrite for that
  reason. If that auditor gets re-run, expect it to flag these again; decide
  which guidance wins rather than ping-ponging between the two.

## Skill bars replay their animation on every scroll-in

- The bar fill and the percentage count-up used to be one-shot: the
  `IntersectionObserver` called `obs.disconnect()` on first intersection, so
  the animation ran once per page load and never again. Now the observer
  stays connected — leaving the section in **either** direction resets the bar
  to empty and the counter to 0, so scrolling back to Skills replays both.
- Removed the `immediate` prop added in the previous pass. It existed so
  expand-revealed rows below the fold wouldn't sit at 0% forever, but with
  replay-on-scroll that's no longer a stuck state — it's just "not revealed
  yet", consistent with every other bar. Keeping it would have fought the
  observer (an `immediate` bar below the fold would be reset to 0 anyway).
- **Bug found and fixed while testing this:** the counter briefly rendered a
  *negative* percentage (`-4%` captured live). `requestAnimationFrame` passes
  the timestamp of when the frame's work began, which can predate the
  `performance.now()` captured moments earlier when scheduling it — so
  `(now - start) / DURATION` went slightly negative, and easeOutCubic
  (`1 - (1-p)³`) amplified that into a negative result. Progress is now
  clamped at both ends, not just the top. This bug predates this change; it
  was simply invisible while the animation only ran once.
- Verified live: replay series reads `0 → 8 → 37 → 61 → 75 → 86 → 91 → 94 →
  95%` with no negative frame, resets correctly when scrolling away both
  downward and upward, and under `prefers-reduced-motion` the bars hold their
  real value with no reset cycling at all.

---

## Live-audit remediation (P0 → P3)

A full live audit (console, network, per-page SEO, interaction testing) turned
up 25 findings. All 25 are addressed below. Verification was done by walking
the rendered HTML of all 29 sitemap URLs and by driving the real page in
Chromium — not by reading the source and assuming.

### P0 — functional bugs

- **Carousel prev/next was non-deterministic** — `components/SwiperShowcase.tsx`.
  The audit's diagnosis (a `Math.random()` shuffle re-deriving the slide array
  each render) was wrong: `featuredProjects` is a fixed `[1, 9, 13, 22, 23, 26]`
  lookup and has always been stable. The real cause was
  `autoplay.disableOnInteraction: false` — autoplay kept firing on its 4.8s
  timer after the user took over, so a click on Next raced the timer, and Prev
  then walked back from wherever autoplay had left you. Set to `true`.
  Verified: `#01 -> next -> #09 -> prev -> #01`, and the slide holds for 6s
  idle after an interaction.
- **"Hire Me" did nothing on click** — `components/Navigation.tsx`. The button
  already had an `onClick` toggle, but the wrapper's `onMouseEnter` set the
  menu open the instant the pointer arrived, so the click toggled it straight
  back shut. Replaced with a real disclosure: a `hirePinned` flag means a click
  always resolves to "open and pin" and only closes when already pinned. Added
  Escape (with focus restored to the trigger), outside-click, arrow-key /
  Home / End roving focus, `aria-haspopup="menu"`, `aria-expanded`,
  `aria-controls`, `role="menu"` / `role="menuitem"`, and `inert` on the
  closed panel so its links leave the tab order.
- **Two `<h3>` per project card** — `components/Portfolio/ProjectCard.tsx`.
  Both faces of the flip card are always in the DOM (`backface-visibility`
  only hides them visually), so each card contributed two identical headings.
  The back face's identity block is now `aria-hidden` with a `<p>` instead of
  an `<h3>`; the two action links sit outside it and carry their own
  `aria-label`s. Verified: 27 cards, exactly one `<h3>` each.
- **Scroll spy** — `components/Navigation.tsx`. Rewritten to resolve a single
  section by construction (walk in document order, keep the last one whose top
  has cleared the header), with the final section pinned at page bottom since
  it is shorter than the viewport. Also switched from `offsetTop` (measured
  against the offset *parent* — wrong inside any positioned wrapper) to
  `getBoundingClientRect()`, rAF-coalesced, plus `aria-current`.
  Note: the reported "two nav items active at once" could not be reproduced —
  `active` is a single string, so two simultaneous winners are not reachable
  from that code. The rewrite still lands the real improvements (correct
  measurement, bottom-of-page handling, `aria-current`). Verified: exactly one
  active item at 0/20/40/60/80/100% scroll.
- **Summary reprinted as the bullet list** — `app/projects/[id]/page.tsx`.
  "Key Development Areas" was the `description` chopped on sentence
  boundaries — literally the paragraph above it — on all 27 pages. Replaced
  with authored `highlights` in the new `data/case-studies.ts`. Verified: 0 of
  27 pages now reprint the summary.
- **Nav items were `<button>`s** — now `<a href="#...">` with `preventDefault`
  and smooth scroll that honours `prefers-reduced-motion`, and modifier-clicks
  left alone so ctrl/cmd-click still opens a new tab. Hero's "View My Work"
  too. Label/id mismatch resolved by renaming the label "Works" to "Portfolio"
  to match the existing `#portfolio` id — renaming the id would have broken
  every `/#portfolio` link already in the case-study pages. The orphan
  `#experience` section got a nav entry.
- **No footer on project pages** — `components/Footer.tsx` moved from
  `app/page.tsx` into `app/layout.tsx`, so all 29 routes get it. Added an
  "All Projects" link, which is what gives the case studies a site-wide
  internal link back to the hub.
- **Stock Next.js 404** — `app/not-found.tsx` added, on-brand, with links to
  home, the projects hub and contact.

### P1 — SEO

- **og:image missing on 9 GHL projects, and 980x577 on the other 18** — added
  `app/projects/[id]/opengraph-image.tsx`, a generated 1200x630 card per
  project (title, role, tech chips, byline). Because it is a file convention,
  Next emits `og:image:width`, `height`, `type` and `alt` automatically. The
  hand-set `openGraph.images` was removed so it cannot override the generated
  card. `app/projects/opengraph-image.tsx` added for the hub, which does *not*
  inherit the root one. Verified: 29/29 URLs have og:image at 1200x630.
- **Meta descriptions over the SERP limit** — new `seoDescription` field, 155
  chars max, front-loaded with brand + keyword, kept separate from the visible
  `description`. Verified: every project page is at or under 155.
  **Note:** this partly reverses the previous section of this log. The
  homepage stays at 169 chars per the explicit 160–200 instruction, and this
  audit did not flag it; project pages now follow this audit's 155 limit.
  Worth settling on one rule.
- **Double-separator titles** — the old template put an em dash next to names
  that already contain one ("Image 1993 — Pakistan"). Now
  "{Name} Case Study | Munib Ahmad". Verified: longest title 56 chars.
- **No page-level structured data** — `CreativeWork` + `BreadcrumbList` per
  project page; `WebSite` + `ProfilePage` alongside `Person` on the root;
  `CollectionPage` + `BreadcrumbList` on the hub.
- **Thin, near-duplicate content** — `data/case-studies.ts` adds four authored
  sections per project (the problem / what I built / the outcome / why this
  stack) plus a "Related Projects" block picking three same-category
  neighbours. Verified: main content is now 421–520 words per page (was ~142),
  and internal links inside `<main>` went from 4 to at least 7.
- **/projects returned 404** — `app/projects/page.tsx` added: a real indexable
  hub with its own title, description, canonical and OG card, grouped by
  platform, linked from the mobile nav, the footer and every case study. Added
  to the sitemap.
- **Heading noise** — carousel slide titles demoted from `<h3>` to `<p>` (they
  already exist as headings in the Works grid, and `loop` cloning tripled
  them), non-active slides marked `aria-hidden` + `inert`. The `<h1>` now
  carries the role line as well as the name — the role `<p>` that sat directly
  below was absorbed into the heading, so it is keyword-bearing without moving
  a pixel. The section heading follows the active filter ("9 Live GHL Funnels")
  instead of being hard-coded "27 Live Projects". Verified: homepage headings
  83 -> 50, duplicate heading strings 29 -> 1 (the remaining one is two genuine
  "Senior Frontend Developer" roles in the experience timeline).
- **Missing icon / PWA files** — `app/favicon.ico` and `app/apple-icon.png`
  (180x180) generated from `app/icon.svg` via sharp; `app/manifest.ts` added;
  `themeColor` in a `viewport` export. Note that Next serves the manifest at
  `/manifest.webmanifest`, not `/manifest.json` — the `<link rel="manifest">`
  tag is the discovery mechanism browsers actually follow.
- **Sitemap lastmod** — was the build timestamp on all 28 URLs, which is the
  same as having none. Now per-project `updatedAt`. `changefreq` and
  `priority` dropped (Google ignores both). Verified: 27 distinct lastmod
  values. **These dates are best estimates — correct any that are wrong.**
- **No robots meta** — added explicitly, with `max-image-preview: large`,
  which is the part that actually changes how an image-heavy result renders.

### P2 — performance

- **Slow cold-start hero** — `components/Hero.tsx`. The sequence ran to ~2.1s
  of offsets and started *every* element at `autoAlpha: 0`, including the H1 —
  so on a cold cache the hero was blank until GSAP downloaded and then spent
  two more seconds revealing itself. The sequence now completes in ~800ms, the
  H1 is never animated on opacity (transform only, so it is legible from first
  paint whether or not the JS lands), and a `prefers-reduced-motion` branch
  skips the entrance entirely. Nothing waits on the WebGL canvas.
- **WebGL canvas** — `components/ThreeBackground.tsx`. Visibility and
  IntersectionObserver pausing and the reduced-motion guard were already in
  place. Added: window blur/focus pausing (`visibilitychange` does not fire
  when you switch to another *application*, so the loop was burning GPU behind
  other windows), a 30fps cap on low-power devices and machines with 4 or
  fewer cores, and the DPR cap lowered from 2.0 to 1.5 everywhere — it scales
  quadratically, so a 4K display was rendering four times the pixels of a
  1080p one for a background.
- **Google Fonts via external `<link>`** — migrated to `next/font/google`.
  Self-hosted, preloaded, no third-party round trip and no request to Google
  from the visitor's browser. Exposed as `--font-body` / `--font-display`
  because the design sets `font-family` inline in ~26 places; those now
  reference `var(--font-stack-display)` / `var(--font-stack-body)`. Verified:
  zero third-party hosts requested on page load.
- **Images without intrinsic sizing** — audited all 64; every one has either
  explicit width/height or a positioned, sized `fill` parent. CLS measured
  0.0000.

### P3 — security headers and accessibility

- **Zero security headers** — `next.config.ts` now sets HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` and a CSP. **The CSP ships as `Report-Only`
  deliberately** — the site inlines JSON-LD and `<style>` blocks and Next
  injects inline bootstrap scripts, so enforcing it without nonces would risk
  a blank page. To enforce: confirm the console is clean on the homepage, a
  case study and /projects, then rename the header and replace
  `'unsafe-inline'` on `script-src` with a nonce. Verified: all six headers
  present on the HTML response.
- **Accessibility** — `aria-hidden` and `role="presentation"` on the WebGL
  canvas element itself, not just its wrapper; a skip link as the first
  focusable element with `<main id="main">` on all three page types; carousel
  dots rebuilt as real `<button>`s with `aria-label` and `aria-current`
  (Swiper's own pagination renders `<span>`s that can carry neither); and a
  `:focus-visible` ring, since several controls set `border: none` inline and
  left keyboard users with no visible focus on the dark theme.

### Not changed

- **Contact form delivery** could not be confirmed end-to-end here — that
  needs the Vercel function logs. Locally the validation path is live (empty
  body returns 422) and `RESEND_API_KEY` is set in `.env.local`. **Production
  still needs `RESEND_API_KEY` added to the Vercel environment variables**
  (marked Sensitive) and a redeploy, or the deployed form runs in scaffold
  mode.
- **ESLint is not configured** — `npm run lint` calls `next lint`, which was
  removed in Next 16, and there is no `eslint.config.js`. Type checking runs
  and passes via `next build`. Worth wiring up separately.

---

## AIOSEO follow-up audit — 5 items

Two of the five were real, two were tool false positives, and one was real but
much smaller than reported. Evidence for each is recorded so the false
positives don't get "fixed" again next time the tool runs.

### 1. Meta description policy — REAL, fixed, and now enforced

Policy settled at **155 characters everywhere**, homepage included. The
homepage was 169, written to an earlier 160–200 target; it is now 148 and still
carries all four primary keywords (Shopify, GoHighLevel, Next.js, frontend
architect). Anything past ~155 was being truncated in the SERP anyway, so the
extra length was costing the closing keywords for nothing.

To stop it regressing, `scripts/check-meta-descriptions.mjs` now runs as part
of `npm run build` and exits non-zero if any page exceeds the limit.

It measures the **prerendered HTML**, not the source, because descriptions come
from three different places — the static export in `app/layout.tsx`,
`generateMetadata()` in `app/projects/[id]/page.tsx` (via
`data/case-studies.ts`), and the interpolated export in `app/projects/page.tsx`.
A source grep would have to understand all three and would still miss anything
computed. It also decodes HTML entities first: `&amp;` is five bytes in markup
but one character in the string Google measures.

Proven to actually fail, not just pass: injecting a 200-char description into
the built HTML produced `✗ ... 200 index.html` and exit code 1. Two real issues
surfaced while building it — `_global-error.html` legitimately has no
description (allowlisted alongside `_not-found`), and the failure output was
printing `undefined` for the filename (fixed).

Current state: 31 pages checked, longest 148.

### 2. Internal vs external link ratio — REAL, fixed

AIOSEO reported 28 internal / 34 external on the homepage. Measured directly
from the rendered HTML it was **38 internal / 55 external** (the tool almost
certainly excludes `mailto:`/`tel:`, of which there are 9). Either way the
direction was the same and the homepage was the only page failing.

The external links are inherent to the site: 27 "Visit Live Site" buttons, the
carousel's outbound links, socials and mailto/tel. They can't be removed —
they're the portfolio's evidence. So the balance had to come from real internal
links, not from deleting outbound ones:

- **Carousel slides now link to the case study** as well as the live site.
  Each slide previously offered exactly one link and it pointed off-site, so
  six of the strongest projects — tripled by loop cloning — contributed a dozen
  outbound links and no path deeper into the site.
- **Footer section nav** (`components/Footer.tsx`) — renders on all 29 routes,
  so every case study now links to each homepage section instead of
  dead-ending. Highest-leverage single change.
- **Hub link from the Portfolio CTA strip, the hero CTA row, and the main nav**
  ("All Projects").
- **In-content links**, which carry the most weight: "27+ live projects" in the
  hero paragraph, "See them in production" in the Skills intro, and a line
  under each case study's tech stack pointing at `/#skills`, `/#experience`
  and `/projects`.

Result: homepage **38/55 → 56/55**, and **0 of 29 pages** now have more
external than internal links (project pages 19/7, hub 37/3). Counting the way
AIOSEO likely does — excluding mailto/tel — the homepage is 56/46.

While verifying this at multiple widths, a **pre-existing layout bug** surfaced:
the horizontal nav never fitted between 768px and 1023px. Logo + seven links +
the Hire Me button already measured ~890px at 820px wide, so Hire Me was being
pushed off the right edge and `html{overflow-x:hidden}` was silently clipping
it. Adding the eighth link made it visible. The hamburger breakpoint moved from
768px to 1023px, which also matches the breakpoint the social sidebar already
used in `globals.css`.

### 3. www / non-www redirect — FALSE POSITIVE, confirmed, no change made

`www.munib-architect-portfolio.vercel.app` does resolve in DNS (64.29.17.131)
— but only because `*.vercel.app` is a wildcard record. It does not serve the
site:

    curl https://www.munib-architect-portfolio.vercel.app/
    → schannel: SNI or certificate check failed:
      SEC_E_WRONG_PRINCIPAL (0x80090322)   [curl exit 60]

Vercel's wildcard certificate covers `*.vercel.app`, which matches exactly one
label. `www.munib-architect-portfolio.vercel.app` has two labels before
`.vercel.app`, so the certificate does not cover it and TLS fails before any
HTTP request is made. No duplicate content can exist at that hostname because
no browser can reach it.

A redirect would also be unimplementable here: a Next `redirects()` rule only
runs for requests that reach the app, and these never complete the TLS
handshake. The rule would be dead code.

Worth noting the scheme half of this finding is **already handled** —
`http://munib-architect-portfolio.vercel.app/` returns `308` to the https
canonical, which Vercel does at the edge automatically.

**When a custom domain is added**, this becomes real: set the canonical host in
Vercel's domain settings (Vercel then issues the 308 from the other variant
automatically), and update `NEXT_PUBLIC_SITE_URL` so `lib/site.ts` emits the
matching canonical tag.

### 4. JS minification — FALSE POSITIVE, confirmed, no change made

AIOSEO named `/_next/static/chunks/2cya-h6pss2j9.js`. That exact file is in the
build output, and it is minified:

    222 KB, 1 line, average line length 227,314 chars, 1.8% whitespace

Its first bytes are
`(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document...` —
Yoda comparisons, `!0` for `true`, `void 0` for `undefined`, single-character
identifiers. A 222 KB file on one line cannot be anything but minified.

All 12 chunks were measured; every one is minified. `next.config.ts` contains no
minification override, so Turbopack's production default is in effect.

AIOSEO is flagging the absence of `.min.` in the filename. Next.js content-
hashes chunk names and never uses that convention, so this warning will fire on
every Next.js build forever. **Nothing to fix — ignore it.**

(The second file it named, `42g32qkaqq2-o.js`, isn't in the current build.
Chunk names are content-hashed, so they change whenever the code does.)

### 5. Request count — PARTLY REAL, one genuine fix

Measured against a real production build (`next start`), not the dev server.

**The 47 figure counts images that never load on arrival.** The homepage makes
**31 requests on initial load** (11 JS, 10 images, 5 fetch, 2 fonts, 2 CSS, 1
document). It reaches 61 only after scrolling the entire page. Of 55 `<img>` in
the DOM, **50 are lazy** and 0 are eager — the 5 non-lazy ones carry next/image
`priority`, which is correct for the hero and first row. AIOSEO's "33 images"
is the post-scroll total. No fix needed.

**Three.js is already correctly split — the hypothesis was wrong.** Mapping
chunks to routes shows the 506 KB Three.js chunk (`1374nds6yghm4.js`) loads on
the homepage only:

    chunk              size    home  case study  hub
    1374nds6yghm4.js   506KB    Y        ·        ·

Total JS is 1392 KB on the homepage vs **886 KB on case studies and the hub** —
a 506 KB difference, exactly the Three.js chunk. The
`dynamic(() => import('./ThreeBackground'), { ssr: false })` wrapper is doing
its job. No fix needed.

**The real finding was on /projects.** It was making 63 requests, of which
**29 were RSC prefetches** — Next prefetching all 27 case-study payloads as
their cards scrolled into view. On a browsable index whose entire purpose is to
pick one project, that is bandwidth spent on 26 wrong guesses. Setting
`prefetch={false}` on the hub's grid links (hover/touch prefetch still applies,
so the one actually clicked is still warmed):

    /projects:  63 → 38 requests   (fetch 29 → 4)

Code-splitting was **not** sacrificed to chase a request-count target. The 11
JS chunks on the homepage are route- and vendor-split and were left alone: the
AIOSEO "20 requests" guideline predates HTTP/2 multiplexing, and merging chunks
would trade a smaller request count for a larger download and worse caching.

Final: homepage 31 on load / 65 fully scrolled, case study 25, hub 38.

### Note on git

`origin/main` was found level with local `HEAD`, meaning the previous round of
work was committed *and pushed* without being asked for in this session. That
matches the auto-sync behaviour noticed earlier (most likely VS Code's Source
Control auto-fetch/push). Worth turning off if pushes should stay manual.

---

## Project screenshots — dead fallback removed, and the add-a-screenshot process

### The 404s in the dev terminal — REAL, fixed

`components/Portfolio/ProjectCard.tsx` resolved its thumbnail as:

    const imgSrc = project.image ?? `/images/portfolio/${imgSlug(project.title)}.jpg`;

Only 18 of 27 projects carry an `image` field, so the 9 GHL cards fell through
to the title-derived path — and `public/images/portfolio/` only ever contained
`ghl.jpg` and `shopify.webp`, the two category badges. The fallback therefore
resolved for **nothing**: every GHL card fired a request that 404'd, logged
`The requested resource isn't a valid image ... received null`, and only then
degraded to the `AbstractMockup` wireframe that was already rendered underneath
it as the base layer.

Nine wasted round-trips per homepage load for a result identical to rendering
nothing. Fixed by gating on `project.image` so no request is made when there is
no screenshot; `imgSlug()` was deleted with it. The `imgError` state stays —
it still covers a screenshot file going missing later.

Verified: 0 failing image requests on a full homepage scroll, all 27 cards
still rendering.

### Adding a screenshot for a project

Screenshots are captured from the live site rather than cropped from a shared
image — it is sharper, correctly framed, and matches the existing files.
Convention is **980x577 JPEG** in `public/images/projects/<slug>.jpg`.

1. **Capture** at 2x device scale, then downscale (crisper than shooting at
   980 directly):

       viewport 1470x866, deviceScaleFactor 2
       page.goto(url, { waitUntil: 'load' })

   Use `'load'`, **not** `'networkidle'` — GHL funnels hold tracking/polling
   connections open indefinitely, so networkidle never fires and the capture
   times out at 60s. Scroll to ~300px and back before shooting to trigger lazy
   hero imagery, then wait ~4s for webfonts.

2. **Resize** with sharp: `.resize(980, 577, { fit: 'cover', position: 'top' })`
   at `quality: 82` — `position: 'top'` keeps the header and hero rather than
   centre-cropping into the page body.

3. **Wire it up**: add `image: '/images/projects/<slug>.jpg'` to that project in
   `data/projects.ts`. Nothing else needs touching — the card, the case-study
   hero and the `/projects` hub all read the same field.

Note the per-project OG card in `app/projects/[id]/opengraph-image.tsx` is
generated and does **not** use this screenshot, so social previews were already
correct for the projects that had none.

### Remaining

8 of 27 still have no screenshot, all GHL:

    strong-refuge-pool-funnel       https://go.strongrefugepool.com/
    strong-refuge-pool-compliance   https://comp.strongrefugepool.com/
    strong-refuge-pool-equipment    https://equip.strongrefugepool.com/
    wingman-aero-uft                https://uft.wingmanaero.com/
    beyond-remedy-ny-injectables    https://go.beyondremedyny.com/brinjectablespromo
    beyond-remedy-co-main           https://go.beyondremedyco.com/
    swoon-learning-start            https://start.swoonlearning.com/
    my-injury-case-help             https://myinjurycasehelp.com/

These render the AbstractMockup wireframe, which is a deliberate fallback and
costs no failed request.

---

## All 27 project screenshots + GHL case-study corrections

### Screenshots

All 9 GHL projects were captured from their live sites and wired into
`data/projects.ts`; `qoffah.jpg` was re-captured to replace a stale 10KB file.
**27 of 27 projects now have a real screenshot** (was 18), and the
AbstractMockup wireframe is no longer reached on the homepage grid.

Process is in the previous section. One addition learned here: `waitUntil:
'networkidle'` times out on every GHL funnel — they hold tracking/polling
connections open indefinitely — so captures use `waitUntil: 'load'` plus a
fixed settle.

### Case-study corrections — the descriptions had drifted from reality

Capturing the sites surfaced that most GHL copy described something other than
what is now live. Each was rewritten against the actual page content (headings,
form fields and CTAs extracted from the live DOM), not from memory:

- **#18 "Community" was a misreading of the subdomain.** `comm.` is
  *commercial*. The page is a B2B commercial pool services quote funnel, not a
  "community recruitment landing page". Display title corrected to
  "Strong Refuge Pool — Commercial"; **the slug stays
  `strong-refuge-pool-community`** so the indexed URL keeps resolving. Worth
  deciding whether to change the slug and add a redirect.
- **#19 Funnel** — is a residential pool *cover* estimate funnel (address
  autocomplete, cover type, financing), not generic lead gen with booking
  calendars.
- **#20 Compliance** — is a commercial compliance *assessment* funnel led by
  inspection risk, not "legal disclosure and evaluation templates".
- **#21 Equipment** — described as an *internal* logistics/procurement portal;
  it is a public-facing equipment **repair** funnel with symptom-led routing.
  This was the largest mismatch.
- **#22 Wingman Aero** — is specifically a $299 discovery-flight booking offer,
  not a general multi-step application system.
- **#23 Beyond Remedy NY** — now physician-supervised **peptide therapy**
  consultation booking, not a med-spa flash sale. URL is still
  `/brinjectablespromo`.
- **#24 Beyond Remedy Co** — is a **longevity** programme ($250/mo, blood
  panel, DEXA, MRI), not general wellness intake.
- **#25 Swoon Learning** — is a **free 30-minute session** booking funnel built
  around parent objections; it has no pricing blocks, which the old copy
  claimed.
- **#26 My Injury Case Help** — was broadly right; refined with the real
  staged qualification, four service tracks and TCPA SMS consent.

`role`, `description` and `tags` updated in `data/projects.ts`;
`seoDescription`, `highlights` and all four narrative sections rewritten in
`data/case-studies.ts`. `updatedAt` set to 2026-09-12 for the nine, since the
page content genuinely changed that day.

**Not touched: Qoffah's copy.** Only its screenshot was requested. The live
site currently renders English/USD, while the description claims RTL and Arabic
multilingual handling — that may still be true behind a locale switcher, but it
was not verified, so nothing was rewritten on a guess.
