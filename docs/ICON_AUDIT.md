# Emoji → SVG Icon Audit

A full-codebase scan for emoji used as icons (`app/`, `components/`, `data/`,
`lib/`, `types/`), run after converting the Contact cards, SocialSidebar, and
Skills section. Scope: pictographic emoji glyphs used as visual icons — not
plain arrow characters (`→` `←` `↗`) used inline in button/link text or code
comments, which are standard typography, render consistently everywhere, and
aren't the "looks unprofessional across platforms" problem emoji actually
have.

## Result: everything found has been replaced. Nothing is outstanding.

| Location | Was | Now |
|---|---|---|
| `components/SocialSidebar.tsx` (GitHub/LinkedIn/Email pills) | Already SVG | — (built first, no emoji ever) |
| `components/Contact.tsx` (4 contact link cards) | ✉️ 📞 💼 ⬡ | `GitHubIcon`/`LinkedInIcon`/`MailIcon`/`PhoneIcon` from `components/icons/SocialIcons.tsx` |
| `components/Skills.tsx` (4 category icons + 29 skill icons) | ⚡ 🎬 🛒 🚀 ▲ ⚛️ 🌐 🎨 🅱️ 💎 🟢 🔷 📜 🔄 ✨ 🎭 💧 🌅 🛍️ 📦 📈 🎯 🤖 🔗 📧 🔌 📅 | `TechIcon` component + `lib/tech-icons.ts` data table |
| `components/Contact.tsx` (success message, success button label) | ✓ (plain dingbat checkmark) | `TechIcon` with the `check` icon |

## Icons that were "difficult" to replace

**None.** Every emoji found in this codebase mapped cleanly to either:
- An accurate brand logo (sourced from the `simple-icons` project's SVG path
  data — Next.js, React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS,
  Bootstrap, MUI, GSAP, Three.js, Shopify, Framer, Swiper), or
- A simple hand-built generic icon for concepts with no official mark
  (funnel, calendar, cart, plug, link, envelope, sliders, sunrise, package,
  trending-up, checkmark, etc.)

If a future icon genuinely can't be sourced or drawn cleanly (e.g. a very
new or obscure brand with no `simple-icons` entry and no obvious generic
equivalent), list it here with:
- The file/line where it's needed.
- What it currently shows (emoji, placeholder, or nothing).
- Why it's difficult (no source data, ambiguous concept, etc.).

Nothing currently meets that bar.

## How the icon system works

See [FIXES.md](./FIXES.md) ("Contact card icons: emoji → SVG" and "Skills
section icons: emoji → SVG, one shared renderer") for the full account of
how this was built — in short:
- `components/icons/TechIcon.tsx` — one reusable renderer, not a component per icon.
- `lib/tech-icons.ts` — the data table (`viewBox`, `fill`/`stroke` mode, and simple shape primitives) that `TechIcon` renders.
- `components/icons/SocialIcons.tsx` — a small, separate set for the four contact-method brand icons (GitHub/LinkedIn/Mail/Phone), shared between `SocialSidebar.tsx` and `Contact.tsx`.

Adding a new icon anywhere in the project going forward should mean adding
one entry to one of these data tables — never a new bespoke icon component.
