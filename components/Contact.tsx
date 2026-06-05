'use client';

import { useRef, useState } from 'react';

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
    color: 'rgba(255,255,255,0.82)',
  },
];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '0.72rem 1rem',
  borderRadius: '8px',
  background: '#161B27',
  border: '1px solid rgba(255,255,255,0.07)',
  color: '#F0F4F8',
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
  color: 'rgba(255,255,255,0.55)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '0.4rem',
};

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const mailto =
      `mailto:munibahmad47@gmail.com` +
      `?subject=${encodeURIComponent((data.get('subject') as string) || 'Project Inquiry')}` +
      `&body=${encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`,
      )}`;
    window.location.href = mailto;
    setStatus('sent');
    setTimeout(() => setStatus('idle'), 4500);
  };

  return (
    <section
      id="contact"
      className="section-padding"
      style={{ position: 'relative', zIndex: 1 }}
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
              color: '#F0F4F8',
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
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
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
          <div data-aos="fade-right">
            <div style={{ marginBottom: '2.5rem' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#F0F4F8',
                  marginBottom: '0.5rem',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Munib Ahmad
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
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
                        color: '#B0BBC8',
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
          <div data-aos="fade-left">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{
                background: '#0F1117',
                border: '1px solid rgba(255,255,255,0.06)',
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
                  color: '#F0F4F8',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Send a Message
              </h3>

              {/* Name */}
              <div>
                <label htmlFor="name" style={LABEL_STYLE}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
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
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
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
                  style={INPUT_STYLE}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
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
                  style={{
                    ...INPUT_STYLE,
                    resize: 'vertical',
                    minHeight: '110px',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  padding: '0.8rem',
                  borderRadius: '10px',
                  background:
                    status === 'sent'
                      ? 'linear-gradient(135deg, #059669, #0891b2)'
                      : 'linear-gradient(135deg, #10B981, #06B6D4)',
                  color: '#0A0A0C',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                }}
                onMouseEnter={(e) => {
                  if (status === 'idle') {
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
                {status === 'sent' ? '✓ Message Ready — Opening Mail Client' : 'Send Message →'}
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
      `}</style>
    </section>
  );
}
