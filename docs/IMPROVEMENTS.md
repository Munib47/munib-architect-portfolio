# Improvement Recommendations

Companion to [PROGRESS.md](./PROGRESS.md). Ordered roughly by impact-to-effort
ratio, highest first. The three items you asked about directly — domain, email
delivery, automation — are covered first in detail.

---

## 1. Domain — should you change it?

**Current:** `munib-archetect-portfolio.vercel.app`

**Recommendation: yes, move to a custom domain.** Three separate reasons:

1. **It has a typo.** "Archetect" isn't a word — "architect" is missing an `i`.
   Whether that happened when the Vercel project was named or it's just how
   it's being shared, anyone who reads it carefully will notice. That alone
   is worth fixing before this URL goes on a CV or a client proposal.
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

## 2. Email delivery — recommended: wire up Resend

`app/api/contact/route.ts` is scaffolded for this already but not connected —
the real `sendEmail()` call to Resend is written out in full as a commented
block, gated behind `process.env.RESEND_API_KEY`. Right now, without a key
set, a submitted contact form just gets validated and logged server-side and
returns success — **no email actually goes out.** That's the main functional
gap in the site: a visitor filling out the contact form has no way to
actually reach you through it yet.

**To go live (not done yet — left for you to activate when ready):**
1. Create a free account at [resend.com](https://resend.com) (100 emails/day, 3,000/month free — plenty for a portfolio contact form).
2. Generate an API key: Dashboard → API Keys → Create.
3. Uncomment the `fetch('https://api.resend.com/emails', ...)` block at the bottom of `app/api/contact/route.ts` (currently commented out under "Example Resend wiring").
4. Locally: add a git-ignored `.env.local` with `RESEND_API_KEY=re_xxx`.
5. On Vercel: Project → Settings → Environment Variables → add `RESEND_API_KEY` for Production (and Preview, if you want the contact form to send real mail from preview deploys too).
6. Redeploy.

**One thing to know about the default sender:** the code currently sends
`from: 'Portfolio Contact <onboarding@resend.dev>'`. That's Resend's shared
test address — it works instantly with zero setup, but **only delivers to the
email address on your own Resend account**. That's fine for a personal
contact form (mail lands in `munibahmad47@gmail.com`, hard-coded as the `to`
address), so you can ship with zero further config.

If you later want the "from" address to show your own domain (e.g.
`contact@munibahmad.dev` instead of `onboarding@resend.dev`) — which also
improves deliverability and avoids the mail ever landing in spam — verify that
domain in Resend (Dashboard → Domains → Add), which is a few DNS TXT/CNAME
records. Natural next step once you've done the domain move in §1, since
you'll be touching DNS anyway.

---

## 3. Automation — n8n vs Make.com

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

## 4. SEO — biggest gap after the above

- **No `sitemap.ts` / `robots.ts`.** With 27 individually-addressable
  case-study pages, this is the single highest-leverage SEO fix left — Next.js
  App Router generates both from a few lines of TypeScript
  (`app/sitemap.ts`, `app/robots.ts`), no extra dependency.
- **No OpenGraph/Twitter share image.** Right now, sharing the site link on
  LinkedIn/Twitter/Slack shows no preview image — a static 1200×630 design
  (or a dynamically generated one via `next/og`) is a quick, high-visibility win.
- **No JSON-LD structured data.** A `Person` schema on the home page (name,
  jobTitle, sameAs → GitHub/LinkedIn) helps Google show a knowledge-panel-style
  result for searches on your name.
- **No `metadataBase`** set in `app/layout.tsx` — worth adding once the custom
  domain from §1 is live, so relative OG image URLs resolve to absolute ones.

## 5. Analytics

Nothing is currently wired up — you have no visibility into who visits, which
projects get clicked, or whether the contact form converts. Two reasonable options:
- **Vercel Analytics** (`@vercel/analytics`) — one `<Analytics />` component, zero config, free tier is generous, already living on the same platform you deploy to.
- **Plausible or Umami** if you want to self-host and stay cookie-consent-free (privacy-friendly, no GDPR banner needed).

## 6. Cleanup

- **Dead code:** `components/DynamicResumeEngine.tsx`, `components/ResumePDF.tsx`, and the `@react-pdf/renderer` dependency are unused since the résumé download was removed from the nav. Either delete them or re-wire a "Download Résumé" button (Hero or Contact section) — right now it's just unshipped surface area.
- **Inline hex colors** are repeated across components instead of referencing the `@theme` tokens already defined in `globals.css` — worth centralizing so a future rebrand (or the domain-driven refresh, if you do one) is a one-file change.

## 7. Content

- The **9 GoHighLevel projects** still show the generated `AbstractMockup` instead of real screenshots — same treatment as the 18 Shopify projects would make the portfolio feel complete rather than half-finished to a careful visitor.
- Worth a pass to confirm all 27 project URLs/descriptions are still accurate — client sites get redesigned or taken down over time, and a dead link in a live case study undercuts credibility.

## 8. Testing & CI

No tests, no CI pipeline exist yet. Given the site's complexity (27 static
routes, a contact API route with validation branches, a hand-rolled Three.js
component), the highest-value starting point isn't broad unit-test coverage —
it's:
- A GitHub Action that runs `tsc --noEmit`, `next lint`, and `next build` on every push/PR, so a broken build never reaches `main` silently.
- One smoke test for `/api/contact` (valid payload → 200, invalid → 422, honeypot → 200-but-silent) since that route has real branching logic and is easy to regress.

## 9. Performance

The README notes Lighthouse hasn't actually been measured since the
performance pass — worth running `npx lighthouse http://localhost:3000 --only-categories=performance` after `npm run build && npm run start` to confirm the theoretical gains (particle scaling, `ssr:false`, pause-on-hidden) translate to a real score, especially on mobile.
