'use client';

import { useState } from 'react';

// Replace PHONE_NUMBER with your WhatsApp number including country code (no + or spaces)
// Example: 14155551234 for US +1 (415) 555-1234
const WHATSAPP_NUMBER = 'YOURNUMBER';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I need help fixing my Showit website. I just ran an analysis and I'm not sure how to fix the issues."
);

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexDirection: 'row-reverse',
      }}
    >
      {/* Tooltip label */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Get expert help fixing your Showit site via WhatsApp"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#25D366',
          boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          textDecoration: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          flexShrink: 0,
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg width="26" height="26" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.347.633 4.647 1.836 6.667L2.667 29.333l6.863-1.8A13.28 13.28 0 0016.003 29.333c7.364 0 13.33-5.97 13.33-13.333 0-7.364-5.966-13.333-13.33-13.333zm0 24c-2.12 0-4.2-.57-6.02-1.647l-.43-.253-4.073 1.067 1.087-3.96-.28-.447A10.617 10.617 0 015.333 16c0-5.887 4.783-10.667 10.67-10.667S26.667 10.113 26.667 16 21.887 26.667 16.003 26.667zm5.847-7.987c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.353-.5-2.573-1.587-.953-.847-1.597-1.893-1.787-2.213-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.54-.72-.547h-.613c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.827.763.327 1.36.52 1.823.667.767.24 1.467.207 2.02.127.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
        </svg>
      </a>

      {/* Tooltip */}
      <div
        style={{
          background: '#1a1814',
          color: '#ffffff',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(8px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        Need help fixing your Showit site?
        <div style={{
          position: 'absolute',
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: '6px solid #1a1814',
        }} />
      </div>
    </div>
  );
}
