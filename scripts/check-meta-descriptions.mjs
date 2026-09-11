#!/usr/bin/env node
/*
 * Build gate: no page may ship a meta description longer than MAX_LEN.
 *
 * Why it reads the built HTML rather than the source:
 *
 * Descriptions come from three different places — the static `metadata` export
 * in app/layout.tsx, the async `generateMetadata()` in app/projects/[id]/page.tsx
 * (which pulls from data/case-studies.ts), and the `metadata` export on
 * app/projects/page.tsx (which interpolates counts at module scope). A source
 * grep would have to understand all three, and would still miss anything
 * computed. The prerendered HTML is the only place the final string exists, so
 * that is what gets measured.
 *
 * Entities are decoded first: "&amp;" occupies five bytes in the markup but is
 * one character in the description Google actually measures.
 *
 * Run automatically as part of `npm run build`. Running `next build` directly
 * skips it.
 */

import { readFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const MAX_LEN = 155;
// Mirrors `distDir` in next.config.ts so the check follows a build that was
// redirected with NEXT_DIST_DIR.
const BUILD_DIR = join(process.env.NEXT_DIST_DIR || '.next', 'server/app');

/*
 * Routes that legitimately ship without a description: the 404 (intentionally
 * noindex) and Next's built-in global error boundary, which is a runtime
 * fallback and never crawled. Anything else missing one is a real problem and
 * fails the build.
 */
const NO_DESCRIPTION_OK = [/_not-found/, /_global-error/];

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    // &amp; must be last, or "&amp;lt;" would double-decode.
    .replace(/&amp;/g, '&');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

if (!existsSync(BUILD_DIR)) {
  console.error(`✗ meta-description check: ${BUILD_DIR} not found — run \`next build\` first.`);
  process.exit(1);
}

const tooLong = [];
const missing = [];
let checked = 0;
let longest = { len: 0, file: '', text: '' };

for await (const file of walk(BUILD_DIR)) {
  const html = readFileSync(file, 'utf8');
  const m = html.match(/<meta name="description" content="([^"]*)"/);
  const rel = relative(BUILD_DIR, file).replace(/\\/g, '/');
  checked++;

  if (!m) {
    if (!NO_DESCRIPTION_OK.some((re) => re.test(rel))) missing.push(rel);
    continue;
  }

  const text = decode(m[1]);
  if (text.length > longest.len) longest = { len: text.length, file: rel, text };
  if (text.length > MAX_LEN) tooLong.push({ rel, len: text.length, text });
}

const pad = (n) => String(n).padStart(3);

if (tooLong.length === 0 && missing.length === 0) {
  console.log(
    `✓ meta descriptions: ${checked} pages checked, all ≤ ${MAX_LEN} chars ` +
      `(longest ${longest.len} — ${longest.file})`,
  );
  process.exit(0);
}

console.error(`\n✗ meta-description check failed (limit ${MAX_LEN} chars)\n`);

if (tooLong.length) {
  console.error(`  ${tooLong.length} page(s) over the limit:`);
  for (const t of tooLong) {
    console.error(`    ${pad(t.len)}  ${t.rel}`);
    console.error(`         "${t.text.slice(0, 100)}…"`);
  }
}

if (missing.length) {
  console.error(`\n  ${missing.length} page(s) with no meta description:`);
  for (const f of missing) console.error(`    ${f}`);
}

console.error(
  '\n  Descriptions are set in app/layout.tsx (home), app/projects/page.tsx (hub),\n' +
    '  and data/case-studies.ts → seoDescription (per project).\n',
);
process.exit(1);
