'use client';

import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

const STATS = [
  { value: '40+', label: 'Checks per audit' },
  { value: '6', label: 'Analysis categories' },
  { value: '~30s', label: 'Time to results' },
  { value: '100%', label: 'Free forever' },
];

const WHAT_WE_CHECK = [
  { icon: '🔍', title: 'SEO Deep Dive', desc: 'Title tags, meta descriptions, H1-H4 structure, keyword density, Open Graph, canonical URLs - every signal Google uses to rank your Showit site.' },
  { icon: '⚡', title: 'Core Web Vitals', desc: 'LCP, CLS, TBT, FCP - the exact performance metrics Google measures. We tell you what is slow and which Showit panel to fix it in.' },
  { icon: '🤖', title: 'AI Visibility', desc: 'Is ChatGPT, Perplexity, or Google AI Overview citing your competitors? We score how ready your site is to appear in AI-generated answers.' },
  { icon: '🔗', title: 'Link Health', desc: 'Broken links, empty anchors, placeholder hrefs - Showit sites are notorious for these. We catch every one.' },
  { icon: '🛠️', title: 'Technical Audit', desc: 'Schema markup, analytics setup, robots/sitemap, HTTPS, booking tools, and over 15 more technical checks specific to Showit.' },
  { icon: '🔧', title: 'Action Plan', desc: 'Not just a score dump. Quick wins ranked by effort, a SERP position estimator, and a printable fix checklist.' },
];

const SHOWIT_PROBLEMS = [
  { problem: 'Generic tools say "edit your theme file"', fix: 'Showit has no theme files. We tell you the exact panel to open.' },
  { problem: '"Install the Yoast plugin" advice', fix: 'Yoast is for WordPress. We give you Showit-native instructions.' },
  { problem: 'Raw Lighthouse scores with no context', fix: 'We translate every metric into a plain-English Showit fix.' },
  { problem: 'SEO guides written for WordPress developers', fix: 'Everything here is written for Showit\'s canvas-based editor.' },
];

export default function AboutPage() {

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'About Showit Site Analyzer',
            url: 'https://showitanalyzer.com/about',
            description: 'Free SEO, speed, and AI visibility analyzer built specifically for Showit website creators.',
            isPartOf: { '@type': 'WebSite', url: 'https://showitanalyzer.com', name: 'Showit Site Analyzer' },
          }),
        }}
      />

      <SiteHeader />

      <main>

        {/* ── HERO - Full-width editorial layout ── */}
        <section style={{ borderBottom: '1px solid var(--divider)', overflow: 'hidden' }}>
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[480px]">

              {/* Left: headline */}
              <div className="flex flex-col justify-center py-16 pr-0 lg:pr-16" style={{ borderRight: '1px solid var(--divider)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-faint)' }}>
                  About the tool
                </p>
                <h1
                  className="font-bold leading-none mb-6"
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                  }}
                >
                  Built for Showit.<br />
                  <span style={{ color: 'var(--text-faint)' }}>Not for everyone.</span>
                </h1>
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
                  Every generic SEO tool gives Showit creators the wrong advice. This one was built specifically for the way Showit works - so the fixes you get are ones you can actually implement.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                    style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: '1px solid var(--btn-primary-border)' }}
                  >
                    Analyze my Showit site →
                  </Link>
                  <a
                    href="https://calendly.com/adil-makhdoom44/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                    style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: '1px solid var(--btn-primary-border)' }}
                  >
                    Book a free call
                  </a>
                </div>
              </div>

              {/* Right: stat grid */}
              <div className="hidden lg:grid grid-cols-2">
                {STATS.map((s, i) => (
                  <div
                    key={s.label}
                    className="flex flex-col justify-center items-center p-10"
                    style={{
                      borderRight: i % 2 === 0 ? '1px solid var(--divider)' : 'none',
                      borderBottom: i < 2 ? '1px solid var(--divider)' : 'none',
                    }}
                  >
                    <span
                      className="font-bold mb-2 block"
                      style={{
                        fontFamily: 'var(--font-serif), Georgia, serif',
                        fontSize: '3.2rem',
                        letterSpacing: '-0.04em',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY SHOWIT NEEDS THIS ── */}
        <section className="py-20 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 mb-4">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Why this tool exists</p>
                <h2
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  Generic SEO tools give Showit creators the wrong instructions
                </h2>
              </div>
              {SHOWIT_PROBLEMS.map(p => (
                <div key={p.problem} className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                  <p className="text-xs mb-2 line-through" style={{ color: 'var(--text-faint)' }}>✗ {p.problem}</p>
                  <p className="text-sm font-semibold" style={{ color: '#10b981' }}>✓ {p.fix}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE CHECK - Card grid ── */}
        <section className="py-20 px-4" style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Full analysis</p>
              <h2
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                Everything your Showit site needs to rank
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHAT_WE_CHECK.map((item, i) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl transition-all hover:-translate-y-1"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transitionDuration: '0.2s',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: 'var(--bg-sidebar)' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENTO / PRINCIPLES GRID ── */}
        <section className="py-20 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>What makes this different</p>
              <h2
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                Designed for how Showit actually works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Big card */}
              <div
                className="md:col-span-7 p-8 rounded-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', minHeight: '280px' }}
              >
                <div className="relative z-10">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Free. Always.</p>
                  <h3 className="text-white font-bold text-2xl mb-4" style={{ fontFamily: 'var(--font-serif), Georgia, serif', letterSpacing: '-0.02em' }}>
                    No paywalls.<br />No signup required.<br />No data stored.
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed max-w-md">
                    Your analysis results live only in your browser. We do not collect your URL, store your results, or sell your data. You paste a URL, you get your report, and that is the end of the transaction.
                  </p>
                </div>
                {/* Decorative */}
                <div
                  className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full opacity-10"
                  style={{ background: 'white' }}
                />
              </div>

              {/* Small right cards */}
              <div className="md:col-span-5 flex flex-col gap-5">
                <div
                  className="flex-1 p-6 rounded-2xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                >
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Showit-specific fixes only</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Every recommendation links to the exact Showit panel — Page Settings, Site Settings, canvas editor — not generic developer advice.
                  </p>
                </div>
                <div
                  className="flex-1 p-6 rounded-2xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                >
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Results in 30 seconds</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Powered by Google PageSpeed Insights API. Real data, real scores, not simulated estimates.
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              <div
                className="md:col-span-4 p-6 rounded-2xl"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--divider)' }}
              >
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>AI search ready</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  We score your site against the exact signals ChatGPT, Perplexity, and Google AI Overview use to decide who gets cited.
                </p>
              </div>
              <div
                className="md:col-span-4 p-6 rounded-2xl"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--divider)' }}
              >
                <div className="text-3xl mb-3">📋</div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Print &amp; fix checklist</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Export a prioritized PDF fix list. Check off items as you complete them. Track your score improving over time.
                </p>
              </div>
              <div
                className="md:col-span-4 p-6 rounded-2xl"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--divider)' }}
              >
                <div className="text-3xl mb-3">👤</div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Expert help available</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Need hands-on help? Book a free 30-minute strategy call with someone who builds on Showit daily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL QUOTE / SOCIAL PROOF ── */}
        <section className="py-20 px-4" style={{ borderBottom: '1px solid var(--divider)', background: 'var(--bg-sidebar)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-8" style={{ color: 'var(--text-faint)' }}>Built for creators like you</p>

            {/* Platform pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['📷 Photographers', '🎥 Videographers', '💍 Wedding Pros', '🎨 Designers', '💼 Coaches', '✍️ Bloggers'].map(label => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}
                >
                  {label}
                </span>
              ))}
            </div>

            <blockquote className="mb-8 text-center">
              <p
                className="font-bold leading-tight mb-6"
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                }}
              >
                "If your website is on Showit and you are not ranking on Google,
                the problem is almost never your content - it is a technical fix
                that takes under 5 minutes once you know where to look."
              </p>
              <footer className="text-sm text-center" style={{ color: 'var(--text-faint)' }}>
                - The insight behind building this tool
              </footer>
            </blockquote>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-3xl p-10 md:p-16 relative overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
              {/* Decorative gradient blob */}
              <div
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-5 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
              />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2
                    className="font-bold mb-4"
                    style={{
                      fontFamily: 'var(--font-serif), Georgia, serif',
                      fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      lineHeight: 1.2,
                    }}
                  >
                    Ready to see what is holding your Showit site back?
                  </h2>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                    Paste your URL below and get a full SEO, speed, AI visibility, and technical report in about 30 seconds. Free, no signup, no data stored.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                      style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: '1px solid var(--btn-primary-border)' }}
                    >
                      Run my free analysis →
                    </Link>
                    <a
                      href="https://calendly.com/adil-makhdoom44/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                      style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: '1px solid var(--btn-primary-border)' }}
                    >
                      Book a free 30-min call
                    </a>
                  </div>
                </div>

                {/* Right: quick checklist */}
                <div className="space-y-3">
                  {[
                    'No account, no email, no credit card',
                    'Results in about 30 seconds',
                    'Fixes written for Showit specifically',
                    'Score history saved in your browser',
                    'AI visibility check included free',
                    'Export your fix checklist as PDF',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(16,185,129,0.15)' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
