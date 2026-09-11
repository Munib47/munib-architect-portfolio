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
