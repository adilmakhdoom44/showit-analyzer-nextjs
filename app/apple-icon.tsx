import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a2e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing orb */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)',
          }}
        />
        {/* Letter S */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
            fontFamily: 'serif',
            letterSpacing: '-4px',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 0 60px rgba(139,92,246,0.9)',
          }}
        >
          S
        </div>
        {/* Accent dot */}
        <div
          style={{
            position: 'absolute',
            bottom: 26,
            right: 26,
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a78bfa, #6366f1)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
