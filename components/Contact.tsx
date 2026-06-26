'use client';

import { useState } from 'react';

const CONTACT_LINKS = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'munibahmad47@gmail.com',
    href: 'mailto:munibahmad47@gmail.com',
    color: '#10B981',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+92 344 4955231',
    href: 'tel:+923444955231',
    color: '#06B6D4',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'munib-ahmad-294524237',
    href: 'https://www.linkedin.com/in/munib-ahmad-294524237',
    color: '#0A66C2',
  },
  {
    icon: '⬡',
    label: 'GitHub',
    value: 'github.com/Munib47',
    href: 'https://github.com/Munib47/',
    color: '#ffffff',
  },
];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.72rem 1rem',
  borderRadius: '8px',
  background: '#161B27',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#ffffff',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.25s',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#ffffff',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
};

const ERROR_TEXT_STYLE: React.CSSProperties = {
  display: 'block',
  marginTop: '0.35rem',
  fontSize: '12px',
  color: '#f87171',
  fontWeight: 500,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';
type Fields = { name: string; email: string; subject: string; message: string };

const EMPTY: Fields = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [company, setCompany] = useState('');              // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  const submitting = status === 'submitting';

  const update =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      // Clear a field's error as soon as the user edits it.
      setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setStatus('submitting');
    setFormError('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, company }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data?.ok) {
        setStatus('success');
        setFields(EMPTY);
        setCompany('');
      } else {
        setStatus('error');
        setFieldErrors(data?.fields ?? {});
        setFormError(data?.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setFormError(
        'Network error — please check your connection, or email me directly at munibahmad47@gmail.com.',
      );
    }
  };

  const fieldBorder = (key: keyof Fields): React.CSSProperties =>
    fieldErrors[key]
      ? { ...INPUT_STYLE, borderColor: 'rgba(248,113,113,0.65)' }
      : INPUT_STYLE;

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1, overflowX: 'hidden' }}
    >
      <div className="section-divider" style={{ marginBottom: '5rem' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} data-aos="fade-up">
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#10B981',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            ◈ Get In Touch
          </span>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            Let&apos;s Build Something{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Together
            </span>
          </h2>
          <p style={{ color: '#ffffff', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Whether you need a high-performance Shopify store, a converting GHL funnel, or a
            custom Next.js web application — let&apos;s talk.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* ── Left: contact info ── */}
          <div data-aos="fade-up">
            <div style={{ marginBottom: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Munib Ahmad
              </h3>
              <p style={{ fontSize: '14px', color: '#ffffff', lineHeight: 1.65 }}>
                Son of Nadeem Sadiq · Based in Lahore, Pakistan
                <br />
                BSc Computer Science, University of the Punjab
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={
                    link.href.startsWith('mailto') || link.href.startsWith('tel')
                      ? undefined
                      : '_blank'
                  }
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    background: '#0F1117',
                    border: `1px solid ${link.color}20`,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = link.color + '55';
                    el.style.background  = link.color + '0A';
                    el.style.transform   = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = link.color + '20';
                    el.style.background  = '#0F1117';
                    el.style.transform   = 'none';
                  }}
                >
                  {/* Icon box */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: link.color + '15',
                      border: `1px solid ${link.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {link.icon}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <p
                      style={{
                        fontSize: '11px',
                        color: link.color,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '2px',
                      }}
                    >
                      {link.label}
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#ffffff',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {link.value}
                    </p>
                  </div>

                  <span style={{ marginLeft: 'auto', color: link.color, fontSize: '14px', opacity: 0.6, flexShrink: 0 }}>
                    →
                  </span>
                </a>
              ))}
            </div>

            {/* Availability badge */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '0.8rem 1rem',
                borderRadius: '10px',
                background: 'rgba(16,185,129,0.07)',
                border: '1px solid rgba(16,185,129,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                  flexShrink: 0,
                  animation: 'contact-pulse 2s ease-in-out infinite',
                }}
              />
              <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 600 }}>
                Currently open to new projects &amp; freelance work
              </span>
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div data-aos="fade-up" data-aos-delay="100">
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={submitting}
              style={{
                background: '#0F1117',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Send a Message
              </h3>

              {/* Honeypot — visually hidden, off the a11y tree, not tab-reachable */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: 0,
                  margin: '-1px',
                  overflow: 'hidden',
                  clip: 'rect(0,0,0,0)',
                  border: 0,
                }}
              />

              {/* Name */}
              <div>
                <label htmlFor="name" style={LABEL_STYLE}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={fields.name}
                  onChange={update('name')}
                  disabled={submitting}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  style={fieldBorder('name')}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = fieldErrors.name ? 'rgba(248,113,113,0.65)' : 'rgba(255,255,255,0.12)')}
                />
                {fieldErrors.name && <span id="name-error" style={ERROR_TEXT_STYLE}>{fieldErrors.name}</span>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" style={LABEL_STYLE}>Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={fields.email}
                  onChange={update('email')}
                  disabled={submitting}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  style={fieldBorder('email')}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = fieldErrors.email ? 'rgba(248,113,113,0.65)' : 'rgba(255,255,255,0.12)')}
                />
                {fieldErrors.email && <span id="email-error" style={ERROR_TEXT_STYLE}>{fieldErrors.email}</span>}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" style={LABEL_STYLE}>Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Project Inquiry"
                  required
                  value={fields.subject}
                  onChange={update('subject')}
                  disabled={submitting}
                  aria-invalid={!!fieldErrors.subject}
                  aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                  style={fieldBorder('subject')}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = fieldErrors.subject ? 'rgba(248,113,113,0.65)' : 'rgba(255,255,255,0.12)')}
                />
                {fieldErrors.subject && <span id="subject-error" style={ERROR_TEXT_STYLE}>{fieldErrors.subject}</span>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" style={LABEL_STYLE}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project..."
                  value={fields.message}
                  onChange={update('message')}
                  disabled={submitting}
                  aria-invalid={!!fieldErrors.message}
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                  style={{ ...fieldBorder('message'), resize: 'vertical', minHeight: '110px' }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = fieldErrors.message ? 'rgba(248,113,113,0.65)' : 'rgba(255,255,255,0.12)')}
                />
                {fieldErrors.message && <span id="message-error" style={ERROR_TEXT_STYLE}>{fieldErrors.message}</span>}
              </div>

              {/* Live status region for screen readers + visible feedback */}
              <div aria-live="polite" role="status">
                {status === 'success' && (
                  <div
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      color: '#10B981',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    ✓ Thanks — your message has been sent. I&apos;ll get back to you shortly.
                  </div>
                )}
                {status === 'error' && formError && (
                  <div
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(248,113,113,0.1)',
                      border: '1px solid rgba(248,113,113,0.35)',
                      color: '#f87171',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {formError}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '0.8rem',
                  borderRadius: '10px',
                  background:
                    status === 'success'
                      ? 'linear-gradient(135deg, #059669, #0891b2)'
                      : 'linear-gradient(135deg, #10B981, #06B6D4)',
                  color: '#0A0A0C',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  letterSpacing: '0.02em',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.boxShadow = '0 6px 28px rgba(16,185,129,0.5)';
                    el.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.boxShadow = '0 4px 20px rgba(16,185,129,0.3)';
                  el.style.transform = 'none';
                }}
              >
                {submitting && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: '2px solid rgba(10,10,12,0.35)',
                      borderTopColor: '#0A0A0C',
                      display: 'inline-block',
                      animation: 'contact-spin 0.7s linear infinite',
                    }}
                  />
                )}
                {submitting
                  ? 'Sending…'
                  : status === 'success'
                    ? '✓ Message Sent'
                    : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes contact-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #10B981; }
          50%       { opacity: 0.55; box-shadow: 0 0 4px #10B981; }
        }
        @keyframes contact-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
