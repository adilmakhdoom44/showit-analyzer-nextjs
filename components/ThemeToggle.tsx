'use client';

import { useTheme, type Theme } from '@/lib/theme-context';

const THEMES: { id: Theme; label: string }[] = [
  { id: 'classic', label: 'Warm' },
  { id: 'minimal', label: 'Gray' },
  { id: 'night', label: 'Night' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{
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
  );
}
