'use client';

import { useTheme, type Theme } from '@/lib/theme-context';
import { Sun, Moon, Circle } from 'lucide-react';

const THEMES: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'classic', label: 'Warm', icon: <Sun size={13} /> },
  { id: 'minimal', label: 'Gray', icon: <Circle size={13} /> },
  { id: 'night', label: 'Night', icon: <Moon size={13} /> },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = THEMES.find(t => t.id === theme) ?? THEMES[0];

  // On mobile: cycle through themes with one icon button
  const cycleTheme = () => {
    const idx = THEMES.findIndex(t => t.id === theme);
    setTheme(THEMES[(idx + 1) % THEMES.length].id);
  };

  return (
    <>
      {/* Mobile: single icon button */}
      <button
        onClick={cycleTheme}
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-all"
        style={{
          background: 'var(--bg-sidebar)',
          border: '1px solid var(--border-card)',
          color: 'var(--text-primary)',
        }}
        aria-label={`Theme: ${current.label}`}
        title={`Theme: ${current.label} — tap to switch`}
      >
        {current.icon}
      </button>

      {/* Desktop: full toggle */}
      <div className="hidden md:flex items-center gap-0.5 p-0.5 rounded-lg" style={{
        background: 'var(--bg-sidebar)',
        border: '1px solid var(--border-card)',
      }}>
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
            style={{
              background: theme === t.id ? 'var(--bg-card)' : 'transparent',
              color: theme === t.id ? 'var(--text-primary)' : 'var(--text-faint)',
              border: theme === t.id ? '1px solid var(--border-card)' : '1px solid transparent',
              boxShadow: theme === t.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}
