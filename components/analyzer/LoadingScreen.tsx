'use client';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'motion/react';
import { Rocket, Zap, FileCode, Search, ScanLine, BarChart2 } from 'lucide-react';

const STEPS = [
  { label: 'Starting analysis',       Icon: Rocket },
  { label: 'Running speed tests',     Icon: Zap },
  { label: 'Fetching page source',    Icon: FileCode },
  { label: 'Analyzing headings & SEO',Icon: Search },
  { label: 'Scanning images & links', Icon: ScanLine },
  { label: 'Building your report',    Icon: BarChart2 },
];

function ResultSkeleton() {
  const isDark = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') !== 'classic' && document.documentElement.getAttribute('data-theme') !== 'minimal'
    : true;
  return (
    <SkeletonTheme
      baseColor={isDark ? '#0d1630' : '#e5e7eb'}
      highlightColor={isDark ? '#1a2545' : '#f3f4f6'}>
      <div className="space-y-3">
        {/* Fake header row */}
        <div className="flex gap-3 items-center">
          <Skeleton circle width={40} height={40} />
          <div className="flex-1">
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={11} style={{ marginTop: 4 }} />
          </div>
          <Skeleton width={64} height={36} borderRadius={10} />
        </div>
        {/* Fake score gauges */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton circle width={56} height={56} />
              <Skeleton width={48} height={10} />
            </div>
          ))}
        </div>
        {/* Fake metric rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3 items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <Skeleton width={20} height={20} circle />
            <Skeleton width={`${50 + i * 8}%`} height={12} />
            <Skeleton width={40} height={20} borderRadius={6} style={{ marginLeft: 'auto' }} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default function LoadingScreen({ step }: { step: number }) {
  const showSkeleton = step >= 4;

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-y-auto"
      style={{ background: 'var(--bg-body)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-xl w-full mx-4 flex flex-col gap-4 py-8 md:py-6">

        {/* Main loading card */}
        <div className="glass p-6 md:p-8 text-center">
          {/* Orbit spinner */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30" />
            <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-cyan-400 animate-spin"
              style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              {(() => { const S = STEPS[Math.max(0, step - 1)]?.Icon; return S ? <S size={20} color="#a5b4fc" /> : null; })()}
            </div>
          </div>

          <h2 className="text-lg md:text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Analyzing Your Site</h2>
          <p className="text-sm mb-4 md:mb-6" style={{ color: 'var(--text-muted)' }}>This takes about 30–45 seconds</p>

          <div className="space-y-2 md:space-y-3 text-left">
            {STEPS.map((s, i) => {
              const done = i < step - 1;
              const active = i === step - 1;
              return (
                <motion.div key={i} className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
                    style={{
                      background: done ? '#6366f1' : active ? 'rgba(99,102,241,0.25)' : 'var(--input-bg)',
                      color: done ? '#fff' : active ? '#a5b4fc' : 'var(--text-faint)',
                    }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="text-sm transition-colors" style={{
                    color: done ? 'var(--text-muted)' : active ? 'var(--text-primary)' : 'var(--text-faint)',
                    textDecoration: done ? 'line-through' : 'none',
                    fontWeight: active ? 600 : 400,
                  }}>
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 md:mt-6 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--input-bg)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.round((Math.max(step - 1, 0) / STEPS.length) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Skeleton preview - fades in after step 4, hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: showSkeleton ? 1 : 0, y: showSkeleton ? 0 : 8 }}
          transition={{ duration: 0.5 }}
          className="glass p-5 hidden md:block"
          style={{ pointerEvents: 'none' }}>
          <p className="text-xs mb-3 text-center" style={{ color: 'var(--text-faint)' }}>Preparing your report…</p>
          <ResultSkeleton />
        </motion.div>

      </div>
    </div>
  );
}
