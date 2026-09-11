// Shared visual for app/opengraph-image.tsx and app/twitter-image.tsx —
// both special Next.js files need their own default export, so this holds
// the actual JSX + size/contentType config they each import and reuse,
// rather than duplicating the design in two files.

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = 'image/png';

export function OgImageContent() {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0C',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.28), transparent 45%), ' +
          'radial-gradient(circle at 80% 75%, rgba(6,182,212,0.28), transparent 45%)',
        position: 'relative',
      }}
    >
      {/* Code-bracket mark, echoing the site favicon */}
      <div
        style={{
          display: 'flex',
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: '#111318',
          border: '1px solid rgba(16,185,129,0.35)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          fontSize: 40,
          fontWeight: 700,
          color: '#10B981',
        }}
      >
        {'</>'}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 76,
          fontWeight: 800,
          color: '#F0F4F8',
          letterSpacing: '-0.02em',
        }}
      >
        Munib Ahmad
      </div>

      <div
        style={{
          display: 'flex',
          width: 140,
          height: 5,
          borderRadius: 999,
          marginTop: 22,
          marginBottom: 26,
          backgroundImage: 'linear-gradient(90deg, #10B981, #06B6D4)',
        }}
      />

      <div
        style={{
          display: 'flex',
          fontSize: 32,
          fontWeight: 500,
          color: '#8892A4',
        }}
      >
        Frontend Architect &amp; Shopify Developer
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: 44,
          fontSize: 24,
          fontWeight: 600,
          color: '#10B981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 999,
          padding: '12px 28px',
        }}
      >
        27+ live Shopify stores &amp; GoHighLevel funnels
      </div>
    </div>
  );
}
