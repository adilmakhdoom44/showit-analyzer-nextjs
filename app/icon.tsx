import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: 'linear-gradient(145deg, #0f0f0f 0%, #1a1a2e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing background orb */}
        <div
          style={{
            position: 'absolute',
            top: -4,
            left: -4,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)',
          }}
        />
        {/* Letter S — bold serif-style */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
            fontFamily: 'serif',
            letterSpacing: '-1px',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 0 12px rgba(139,92,246,0.9)',
          }}
        >
          S
        </div>
        {/* Accent dot — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 5,
            right: 5,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a78bfa, #6366f1)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
