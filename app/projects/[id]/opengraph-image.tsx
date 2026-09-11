import { ImageResponse } from 'next/og';
import { projects } from '@/data/projects';

/*
 * Per-project social card, 1200x630.
 *
 * Replaces two separate failures. The 18 projects with a screenshot were
 * handing that file straight to og:image at 980x577 — under LinkedIn's 1200px
 * minimum, and with no og:image:width/height declared, so scrapers had to
 * fetch the image before they could lay anything out. The other 9 (the GHL
 * projects, which have no screenshot on disk) emitted no og:image at all, so
 * Facebook, LinkedIn and WhatsApp previews for them were text-only.
 *
 * Generating the card covers both: every project gets a correctly-sized image,
 * and because this is a file convention Next emits og:image:width, height,
 * type and alt alongside the URL without any of it being hand-maintained.
 *
 * No `runtime = 'edge'` — that would opt these into per-request rendering.
 * With generateStaticParams below they are produced once at build time.
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Case study by Munib Ahmad';

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find((p) => p.slug === id);

  // notFound() isn't available in an image route; a neutral card is the safe
  // fallback if this is ever reached with an unknown slug.
  const title = project?.title ?? 'Case Study';
  const role = project?.role ?? 'Frontend Architect';
  const accent = project?.accentHex ?? '#10B981';
  const tags = project?.tags.slice(0, 4) ?? [];
  const isShopify = project?.category === 'shopify';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0C',
          backgroundImage:
            `radial-gradient(circle at 15% 15%, ${accent}33, transparent 45%), ` +
            'radial-gradient(circle at 85% 85%, rgba(6,182,212,0.22), transparent 45%)',
          padding: '64px 72px',
        }}
      >
        {/* Platform badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#111318',
              border: `1px solid ${accent}59`,
              fontSize: 30,
              fontWeight: 700,
              color: accent,
            }}
          >
            {'</>'}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {isShopify ? 'Shopify Case Study' : 'GoHighLevel Case Study'}
          </div>
        </div>

        {/* Title + role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 24 ? 66 : 82,
              fontWeight: 800,
              color: '#F0F4F8',
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              width: 120,
              height: 5,
              borderRadius: 999,
              marginTop: 26,
              marginBottom: 24,
              backgroundImage: `linear-gradient(90deg, ${accent}, #06B6D4)`,
            }}
          />
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 500, color: '#8892A4' }}>
            {role}
          </div>
        </div>

        {/* Tech chips + byline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: 'flex',
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#8892A4',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 999,
                  padding: '10px 22px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              color: '#F0F4F8',
              whiteSpace: 'nowrap',
            }}
          >
            Munib Ahmad
          </div>
        </div>
      </div>
    ),
    size,
  );
}
