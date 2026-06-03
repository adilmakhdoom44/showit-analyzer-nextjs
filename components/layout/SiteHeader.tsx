'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'var(--bg-header)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-header)',
      }}
    >
      <div className="flex items-center gap-4 px-4 md:px-8 py-3 max-w-6xl mx-auto">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline hover:opacity-80 transition-opacity"
        >
          <span
            className="font-semibold text-sm"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-serif), Georgia, serif',
            }}
          >
            Showit Analyzer
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map(n => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors no-underline"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: active ? 'var(--bg-sidebar)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-sidebar)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)', color: 'var(--text-primary)' }}
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: 'var(--bg-header)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid var(--border-header)',
            padding: '8px 16px 16px',
          }}
        >
          {NAV.map(n => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium no-underline transition-colors"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--bg-sidebar)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  marginBottom: 4,
                }}
              >
                {n.label}
              </Link>
            );
          })}

          {/* CTA */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold no-underline mt-2"
            style={{
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              border: '1px solid var(--btn-primary-border)',
            }}
          >
            Analyze my site →
          </Link>
        </div>
      )}
    </header>
  );
}
