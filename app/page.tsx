'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAnalyzer } from '@/lib/analyzer-context';
import HeroSection from '@/components/analyzer/HeroSection';
import DemoMockup from '@/components/analyzer/DemoMockup';
import LandingContent from '@/components/analyzer/LandingContent';
import LoadingScreen from '@/components/analyzer/LoadingScreen';
import ResultsDashboard from '@/components/analyzer/ResultsDashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/ThemeToggle';
import HomeSchema from '@/components/HomeSchema';

export default function HomePage() {
  const { result, loading, loadingStep, error, analyze, reset } = useAnalyzer();
  const [headerUrl, setHeaderUrl] = useState('');

  const handleHeaderAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerUrl.trim()) {
      analyze(headerUrl.trim());
      setHeaderUrl('');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
      <HomeSchema />

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40"
        style={{
          background: 'var(--bg-header)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-header)',
        }}>

        {/* Top nav bar */}
        <div className="flex items-center gap-4 px-4 md:px-8 py-3">
          {/* Logo */}
          <button
            onClick={reset}
            className="flex items-center gap-2 flex-shrink-0 no-underline bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity p-0"
          >
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif), Georgia, serif' }}>
              Showit Analyzer
            </span>
          </button>

          {/* Nav links - hidden on small screens */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {[
              { href: '/', label: 'Home', isReset: true },
              { href: '/about', label: 'About', isReset: false },
              { href: '/contact', label: 'Contact', isReset: false },
            ].map(n => n.isReset ? (
              <button key={n.href}
                onClick={reset}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border-none bg-transparent cursor-pointer hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-sidebar)')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}>
                {n.label}
              </button>
            ) : (
              <Link key={n.href} href={n.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors no-underline hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sidebar)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Compact search - only when results are showing */}
          {(result || error) && !loading && (
            <form onSubmit={handleHeaderAnalyze} className="flex-1 flex gap-2 max-w-xl mx-4">
              <Input
                value={headerUrl}
                onChange={e => setHeaderUrl(e.target.value)}
                placeholder="Analyze another URL…"
                className="h-9 text-sm"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text-primary)',
                }}
              />
              <Button type="submit" size="sm" className="h-9 px-4 flex-shrink-0 text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                Analyze
              </Button>
            </form>
          )}

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {result && !loading && (
              <button
                onClick={reset}
                className="text-xs transition-colors hidden sm:block"
                style={{ color: 'var(--text-muted)' }}>
                ← New Analysis
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      {loading && <LoadingScreen step={loadingStep} />}
      {!result && !loading && (
        <>
          <HeroSection />
          <LandingContent />
        </>
      )}

      {error && !loading && (
        <div className="max-w-xl mx-auto mt-20 px-4 text-center">
          <div className="glass p-8 rounded-2xl">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Analysis Failed</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <p className="text-xs mb-6" style={{ color: 'var(--text-faint)' }}>Make sure the URL is correct and publicly accessible.</p>
            <Button onClick={reset}
              style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white' }}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {result && !loading && <ResultsDashboard result={result} />}

      {/* ── Footer ── */}
      {!loading && (
        <footer style={{ borderTop: '1px solid var(--border-footer)', background: 'var(--bg-body)' }} className="mt-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

              {/* Brand column */}
              <div className="md:col-span-2">
                <div className="mb-3">
                  <span className="font-bold text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif), Georgia, serif', letterSpacing: '-0.02em' }}>Showit Site Analyzer</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  The free SEO, speed, and accessibility analyzer built specifically for Showit creators.
                  Get actionable Showit-specific fixes in seconds - no signup required.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)', border: '1px solid var(--badge-green-border)' }}>
                    ✓ 100% Free
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
                    ✓ No Signup
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
                    ✓ No Data Stored
                  </span>
                </div>
              </div>

              {/* Tool links */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-faint)' }}>Tool</h3>
                <ul className="space-y-2">
                  {[
                    { label: 'Analyze a Site', href: '/' },
                    { label: 'AI Visibility Score', href: '/' },
                    { label: 'SERP Estimator', href: '/' },
                    { label: 'Bulk URL Analyzer', href: '/' },
                  ].map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm no-underline transition-colors hover:text-indigo-400"
                        style={{ color: 'var(--text-muted)' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company links */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-faint)' }}>Company</h3>
                <ul className="space-y-2">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                  ].map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm no-underline transition-colors hover:text-indigo-400"
                        style={{ color: 'var(--text-muted)' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderTop: '1px solid var(--border-footer)' }}>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                © {new Date().getFullYear()} Showit Site Analyzer · Built for Showit Creators
              </p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                Powered by{' '}
                <a href="https://developers.google.com/speed/docs/insights/v5/about"
                  target="_blank" rel="noopener noreferrer"
                  className="text-indigo-500 hover:text-indigo-400 transition-colors">
                  Google PageSpeed Insights API
                </a>
              </p>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
