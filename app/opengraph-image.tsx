import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Showit Site Analyzer - Free SEO, Speed & AI Visibility Tool';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0f13 0%, #18181f 60%, #1e1830 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '40px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '100px',
            padding: '6px 18px',
            marginBottom: '28px',
          }}
        >
          <span style={{ color: '#a5b4fc', fontSize: '15px', fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}>
            FREE TOOL — NO SIGNUP REQUIRED
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '28px' }}>
          <span
            style={{
              fontSize: '68px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            Showit Site Analyzer
          </span>
          <span
            style={{
              fontSize: '34px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.3,
              marginTop: '12px',
              fontFamily: 'sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            SEO · Speed · AI Visibility — in 30 seconds
          </span>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['Core Web Vitals', 'AI Visibility Score', 'Showit-Specific Fixes', 'Broken Link Check'].map((f) => (
            <div
              key={f}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '16px',
                fontFamily: 'sans-serif',
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '18px',
            fontFamily: 'sans-serif',
          }}
        >
          showitanalyzer.com
        </div>
      </div>
    ),
    { ...size }
  );
}
