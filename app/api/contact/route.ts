import { NextResponse } from 'next/server';

// ── Contact form endpoint ──────────────────────────────────────────
// POST /api/contact  { name, email, subject, message }
//
// Validates the payload server-side and returns a JSON result the
// client form uses to drive its loading / success / error states.
//
// Email delivery goes through Resend (https://api.resend.com/emails) via
// `fetch` — no extra npm dependency. Without RESEND_API_KEY set, the route
// runs in "scaffold" mode: it validates and logs the message, then returns
// `{ ok: true }`, so the form stays fully functional with no secrets in dev.
//
// The key lives in `.env.local` (git-ignored) locally, and must also be set
// as an environment variable in the Vercel project (Settings → Environment
// Variables → RESEND_API_KEY) for it to work in production.
// ───────────────────────────────────────────────────────────────────

export const runtime = 'nodejs';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  // Honeypot — real users never fill this; bots often do.
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  // Honeypot: silently accept (so bots think they succeeded) but do nothing.
  if (asTrimmedString(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const name    = asTrimmedString(body.name);
  const email   = asTrimmedString(body.email);
  const subject = asTrimmedString(body.subject);
  const message = asTrimmedString(body.message);

  // ── Validation ──────────────────────────────────────────────────
  const errors: Record<string, string> = {};
  if (name.length < 2)       errors.name    = 'Please enter your name.';
  if (!EMAIL_RE.test(email))  errors.email   = 'Please enter a valid email address.';
  if (subject.length < 2)     errors.subject = 'Please add a subject.';
  if (message.length < 10)    errors.message = 'Please write at least 10 characters.';

  // Guard against oversized payloads.
  if (name.length > 100 || email.length > 200 || subject.length > 150 || message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: 'One or more fields are too long.' },
      { status: 422 },
    );
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, error: 'Please fix the highlighted fields.', fields: errors },
      { status: 422 },
    );
  }

  // ── Send (TODO: wire an email provider) ─────────────────────────
  try {
    await sendEmail({ name, email, subject, message });
  } catch (err) {
    console.error('[contact] delivery failed:', err);
    return NextResponse.json(
      { ok: false, error: 'Could not send your message right now. Please email me directly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

// Reject non-POST verbs cleanly.
export function GET() {
  return NextResponse.json({ ok: false, error: 'Method not allowed.' }, { status: 405 });
}

// ── Email delivery ─────────────────────────────────────────────────
// TODO: replace the placeholder below with a real provider call.
async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  // No key configured → run in "scaffold" mode: log and succeed so the
  // form is fully functional in development without secrets.
  if (!apiKey) {
    console.info('[contact] (scaffold mode — no RESEND_API_KEY set) message received:', {
      ...data,
      message: data.message.slice(0, 280),
    });
    return;
  }

  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Resend's shared test sender — works with zero setup, but only delivers
      // to the account owner's own inbox. Once a domain is verified in Resend,
      // switch this to e.g. "Portfolio Contact <contact@munibahmad.dev>".
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'munibahmad47@gmail.com',
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      html: `<p><strong>${escapeHtml(data.name)}</strong> (${escapeHtml(data.email)}) wrote:</p>`
          + `<p>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</p>`,
    }),
  });

  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}
