# Improvement Recommendations

Companion to [PROGRESS.md](./PROGRESS.md). Ordered roughly by impact-to-effort
ratio, highest first. Everything that's been *done* — including items that
started here — moved to [FIXES.md](./FIXES.md) so this file stays a clean
list of what's still outstanding.

---

## 1. Domain — should you change it?

**Actual live URL:** `munib-architect-portfolio.vercel.app` (correct spelling,
matches the GitHub repo). **Note:** `munib-archetect-portfolio.vercel.app`
(the URL originally given for this doc) **does not resolve** —
`DEPLOYMENT_NOT_FOUND`. I'd built the SEO work below against the typo'd
version at first; caught it by curling the URL directly during the SEO fixes
in this session and corrected `lib/site.ts` to the real domain. Worth checking
where else that typo'd URL might be written down (resume, LinkedIn, any
client emails) since it's a dead link.

**Recommendation: yes, move to a custom domain anyway.** Three reasons:

1. **The `.vercel.app` name is fragile.** You've now got direct proof of
   why — one letter off and the "portfolio" people try to visit doesn't
   exist. A domain you register yourself doesn't have this failure mode.
2. **`*.vercel.app` reads as an unfinished project**, not a professional site.
   Clients and recruiters unconsciously discount free-subdomain URLs — it's
   the same instinct as trusting a `@gmail.com` business email less than one
   on a real domain.
3. **A `.vercel.app` domain is disposable.** If you ever move hosting (or
   Vercel changes its subdomain policy), every link you've shared — LinkedIn,
   GitHub profile, resume, past client emails — breaks. A domain you own
   redirects cleanly no matter where it's hosted.

**What to get:** Given the correct spelling and personal-brand positioning
(`munibahmad47@gmail.com` is the contact email, "Munib Ahmad" is the byline),
a name-based domain outlasts a role-based one — your title may change, your
name won't. In rough order of preference:

| Domain | Why |
|---|---|
| `munibahmad.dev` | `.dev` reads as "working developer," is HTTPS-enforced by the registry, cheap (~$12/yr), and Google itself is the registrar-of-record backing it — no brand risk. |
| `munibahmad.com` | Most universally recognized TLD; slightly better for non-technical audiences (recruiters, GHL/Shopify clients) who may subconsciously read `.dev` as "for developers only." |
| `munib.dev` | Shorter if available — worth a quick availability check. |

Avoid working "architect," "shopify," or "portfolio" into the domain itself —
you already deploy both Shopify and GoHighLevel work, and a title-based domain
ages badly if your focus shifts.

**How to set it up (10 minutes once purchased):**
1. Buy the domain (Namecheap, Cloudflare Registrar at-cost pricing, or Porkbun — avoid GoDaddy's renewal pricing).
2. In the Vercel dashboard → Project → Settings → Domains → add the domain.
3. Add the DNS records Vercel shows you at your registrar (usually one `A`/`ALIAS` + one `CNAME` for `www`).
4. Keep the `.vercel.app` URL alive — Vercel auto-redirects it, so old links (already-sent resumes, etc.) keep working.
5. Update `metadataBase` in `app/layout.tsx` once the domain is live, so relative OG/canonical URLs resolve correctly (see SEO section below).

---

## 2. Automation — n8n vs Make.com

Right now, a contact-form submission does exactly one thing: sends you one
email. Worth asking what else should happen automatically when someone
reaches out — log it somewhere durable (so you never lose a lead to a missed
email), notify you somewhere faster than email (Slack/Telegram/SMS), maybe
even auto-tag the lead by project type.

**Recommendation: n8n, self-hosted, over Make.com.** Reasoning specific to
your situation, not generic advice:

| | n8n | Make.com |
|---|---|---|
| Cost at your scale | **Free** if self-hosted (a $5–6/mo VPS, or a free-tier host like Railway/Render's hobby plan runs it fine — contact-form volume is tiny) | Free tier is capped at 1,000 ops/month, but pricing climbs fast once you add more automations (CRM sync, social posting, invoicing, etc.) |
| Fit for your skill set | You're a developer who already ships JS/TS, Liquid, and webhook-based integrations for clients — n8n's node editor plus optional custom-code (JS) nodes plays directly to that | Make's visual-only builder is friendlier for non-technical users, which undersells what you already know how to do |
| GoHighLevel integration | n8n has a community GHL node **and** you can hit the GHL REST API directly with an HTTP node — meaningful since you already run client automations in GHL for work | Make has a GHL integration too, but you'd be paying per-operation for something you could otherwise run through infrastructure you control |
| Ownership | Self-hosted = your data, your uptime, no vendor lock-in — good to demonstrate to *clients* evaluating you for automation work, since it's literally the product you'd be advising them on | Fully hosted, zero maintenance, but you don't own the pipeline |
| Ceiling | Higher — open source, extensible with custom nodes, no artificial operation caps once self-hosted | Simpler for one-off zaps, but you'll outgrow the free tier if this portfolio starts generating real lead volume |

**Concretely, what to build first:** a single n8n workflow triggered by a
webhook that `/api/contact` calls (in parallel with, or instead of, sending
email directly from the route handler):
1. Webhook receives `{ name, email, subject, message }`.
2. Node 1 — log the lead to a Google Sheet or Airtable (durable record, survives even if email delivery ever fails).
3. Node 2 — post a formatted message to a Slack/Telegram channel you actually check in real time (email gets buried; a phone ping doesn't).
4. Node 3 (optional, given your GHL expertise) — create/update a contact in your own GHL sub-account, so inbound leads land in the same pipeline you build for clients — useful both practically and as a live demo of your own automation work if a prospective client asks "can you show me something you've built?"

This is a genuinely small addition (one webhook call from the existing route
handler, one n8n workflow) and it turns the contact form from "sends an
email" into "captures a lead reliably, with a record you can't lose."

---

## 3. SEO — still open

Most SEO work is done — sitemap, robots.txt, metadataBase, JSON-LD, hreflang,
canonical/OG tags, HSTS, favicon, meta description length. See
[FIXES.md](./FIXES.md) for the full account. What's left:

- **No sitewide OpenGraph/Twitter share image for the home page itself.** Project pages now have one (their hero screenshot); the home page's `openGraph` still has no `images` — a static 1200×630 design (or a dynamic one via `next/og`) is the next quick win here.
- Once the domain from §1 is purchased, set `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables to the new domain (no code change needed — `lib/site.ts` reads it automatically).

## 4. Analytics

Nothing is currently wired up — you have no visibility into who visits, which
projects get clicked, or whether the contact form converts. Two reasonable options:
- **Vercel Analytics** (`@vercel/analytics`) — one `<Analytics />` component, zero config, free tier is generous, already living on the same platform you deploy to.
- **Plausible or Umami** if you want to self-host and stay cookie-consent-free (privacy-friendly, no GDPR banner needed).

## 5. Cleanup

- **Dead code:** `components/DynamicResumeEngine.tsx`, `components/ResumePDF.tsx`, and the `@react-pdf/renderer` dependency are unused since the résumé download was removed from the nav. Either delete them or re-wire a "Download Résumé" button (Hero or Contact section) — right now it's just unshipped surface area.
- **Inline hex colors** are repeated across components instead of referencing the `@theme` tokens already defined in `globals.css` — worth centralizing so a future rebrand (or the domain-driven refresh, if you do one) is a one-file change.
- **CSS reset silently defeats Tailwind's spacing utilities sitewide.** Found
  while fixing the social sidebar (see [FIXES.md](./FIXES.md)) —
  `app/globals.css`'s base reset (`*, *::before, *::after { margin: 0;
  padding: 0; }`) is plain, unlayered CSS, and CSS cascade layers give any
  unlayered rule priority over Tailwind's `@layer utilities`, regardless of
  specificity. The practical effect: every `p-*`/`m-*`/`px-*`/`py-*`/
  `mx-*`/`my-*`/`space-x-*`/`space-y-*` Tailwind class silently resolves to
  `0` everywhere in this codebase (`gap-*` and `w-*`/`h-*` are unaffected).
  Individual usages have been worked around locally with inline `style` as
  they're found — the root-cause fix (wrap the reset in `@layer base { ... }`
  in `globals.css`) is bigger and riskier: a global CSS change that could
  shift layout anywhere in the site that happens to use a Tailwind spacing
  class today expecting it to be inert. Worth doing as its own deliberate
  pass (grep the codebase for `\b[pm][xytrbl]?-[0-9]` Tailwind classes first,
  check each usage, then flip the layer and fix any that break) — not a
  change to make casually alongside unrelated work.

## 6. Content

- The **9 GoHighLevel projects** still show the generated `AbstractMockup` instead of real screenshots — same treatment as the 18 Shopify projects would make the portfolio feel complete rather than half-finished to a careful visitor.
- Worth a pass to confirm all 27 project URLs/descriptions are still accurate — client sites get redesigned or taken down over time, and a dead link in a live case study undercuts credibility.

## 7. Testing & CI

No tests, no CI pipeline exist yet. Given the site's complexity (27 static
routes, a contact API route with validation branches, a hand-rolled Three.js
component), the highest-value starting point isn't broad unit-test coverage —
it's:
- A GitHub Action that runs `tsc --noEmit`, `next lint`, and `next build` on every push/PR, so a broken build never reaches `main` silently.
- One smoke test for `/api/contact` (valid payload → 200, invalid → 422, honeypot → 200-but-silent) since that route has real branching logic and is easy to regress.

## 8. Performance

The README notes Lighthouse hasn't actually been measured since the
performance pass — worth running `npx lighthouse http://localhost:3000 --only-categories=performance` after `npm run build && npm run start` to confirm the theoretical gains (particle scaling, `ssr:false`, pause-on-hidden) translate to a real score, especially on mobile.

## 9. Geo-based auto language switching (Arabic/Urdu/Hindi) — recommendation: don't

You asked about detecting a visitor's location and auto-switching the site
into Arabic, Urdu, or Hindi for those regions, defaulting to English
elsewhere. **My recommendation is no — keep the site English-only.** Not
because it's technically hard (it's a solved problem: `next-intl`/`next-i18next`
+ a `middleware.ts` that reads `Accept-Language` or a geo header), but because
it's a poor fit for what this specific site is:

1. **The audience reads English regardless of location.** This isn't a
   consumer storefront where a local-language UI increases conversion —
   it's a developer/agency portfolio. Clients and recruiters evaluating a
   Next.js/Shopify/GoHighLevel specialist — including ones based in Pakistan,
   the Gulf, or India — read case studies and job listings in English as a
   matter of professional norm. Auto-switching to Urdu for a Lahore-based IP
   doesn't match how the people actually hiring for this work browse.
2. **Arabic and Urdu are RTL — this site's layout isn't built for it.** The
   fixed left `SocialSidebar`, the GSAP entrance timelines, the Three.js
   pointer-parallax math, Swiper's `EffectCreative` slider — all of it is
   built assuming LTR, with hardcoded left/right positioning throughout.
   Making it RTL-correct isn't a translation task, it's close to a redesign,
   and a half-mirrored layout would look broken, not international.
3. **Auto-translating 27 case studies (or the whole site) is a real content
   project, not a config flag.** Either you write and maintain three more
   full copies of every section by hand, or you machine-translate — and
   machine-translated technical content (Shopify, Liquid, GoHighLevel, "AJAX
   cart drawer mechanics") tends to read awkwardly or wrong in exactly the
   audience-facing copy meant to demonstrate craftsmanship.
4. **Geo-IP language redirects are also an SEO risk if mishandled** — Google
   can index the "wrong" language version for a given URL, VPN/traveling
   users get served a language they didn't ask for, and hreflang tags (which
   *should* exist once you do have real alternate-language pages) add
   another thing to keep in sync. The auditor's "0 hreflang tags" note isn't
   a problem to fix here — it's correctly reporting a single-language site
   as a single-language site.

**When this would flip:** if you start taking on clients specifically in
Arabic/Urdu/Hindi-speaking markets and want a *separate*, purpose-built
landing page in that language to pitch them directly — not an auto-switched
mirror of the whole portfolio — that's a reasonable, much smaller project
worth doing on its own terms.
