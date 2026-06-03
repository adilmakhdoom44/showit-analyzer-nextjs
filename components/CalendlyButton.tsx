'use client';

import { useState } from 'react';

// Replace with your Calendly link — e.g. https://calendly.com/yourname/showit-audit
const CALENDLY_URL = 'https://calendly.com/adil-makhdoom44/30min';

export default function CalendlyButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexDirection: 'row-reverse',
      }}
    >
      {/* Button */}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Book a free Showit strategy call"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '11px 18px',
          borderRadius: '100px',
          background: 'var(--btn-primary-bg)',
          color: 'var(--btn-primary-text)',
          border: '1px solid var(--btn-primary-border)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 6px 20px rgba(0,0,0,0.18)'
            : '0 2px 12px rgba(0,0,0,0.12)',
          whiteSpace: 'nowrap',
        } as React.CSSProperties}
      >
        {/* Calendar icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="5.5" cy="10.5" r="1" fill="currentColor"/>
          <circle cx="8" cy="10.5" r="1" fill="currentColor"/>
          <circle cx="10.5" cy="10.5" r="1" fill="currentColor"/>
        </svg>
        Book a free strategy call
      </a>
    </div>
  );
}
