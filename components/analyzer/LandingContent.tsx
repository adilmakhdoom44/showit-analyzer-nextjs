'use client';

import Link from 'next/link';
import { useAnalyzer } from '@/lib/analyzer-context';
import DemoMockup from '@/components/analyzer/DemoMockup';
import { Camera, Video, Heart, Palette, Briefcase, BookOpen, Search, Zap, Bot, Link2, Wrench, Settings2, BarChart2 } from 'lucide-react';

const WHO_ITS_FOR = [
  { icon: Camera, title: 'Photographers', desc: 'Wedding, portrait, commercial, boudoir, newborn - if your site is on Showit, this was built for you.' },
  { icon: Video, title: 'Videographers', desc: 'Film and video pros who need their Showit portfolio to rank on Google and load fast on every device.' },
  { icon: Heart, title: 'Wedding Professionals', desc: 'Planners, florists, DJs, officiants - anyone in the wedding industry running a Showit site.' },
  { icon: Palette, title: 'Designers & Artists', desc: 'Brand designers, illustrators, and creative studios who use Showit to showcase their work.' },
  { icon: Briefcase, title: 'Coaches & Consultants', desc: 'Business coaches, life coaches, and strategists who need their Showit site to convert visitors.' },
  { icon: BookOpen, title: 'Bloggers & Educators', desc: 'Content creators using Showit + WordPress blog who want their posts to rank and get found.' },
];

const WHAT_WE_CHECK = [
  {
    icon: Search,
    label: 'SEO Analysis',
    items: ['Page title & meta description', 'H1–H4 heading structure', 'Keyword density & distribution', 'Open Graph & Twitter Card tags', 'Canonical URL', 'Robots meta directives'],
    color: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    icon: Zap,
    label: 'Speed & Core Web Vitals',
    items: ['Largest Contentful Paint (LCP)', 'Cumulative Layout Shift (CLS)', 'Total Blocking Time (TBT)', 'First Contentful Paint (FCP)', 'Image optimization score', 'Font loading performance'],
    color: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    icon: Bot,
    label: 'AI Visibility',
    items: ['AEO (Answer Engine) score', 'Citation readiness for ChatGPT', 'AI crawlability check', 'Structured data detection', 'E-E-A-T signal audit', 'Featured snippet readiness'],
    color: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
  },
  {
    icon: Link2,
    label: 'Link Audit',
    items: ['Broken link detection', 'Empty anchor tags', 'Internal vs external links', 'Missing link text', 'Contact link check', 'Navigation structure'],
    color: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
  },
  {
    icon: Wrench,
    label: 'Technical Audit',
    items: ['Schema / structured data', 'Analytics setup (GA4, GTM)', 'HTTPS & security', 'Booking tool detection', 'Contact form check', 'Business page essentials'],
    color: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.2)',
  },
  {
    icon: Settings2,
    label: 'Bonus Tools',
    items: ['SERP position estimator', 'Competitor comparison', 'Local SEO score', 'Bulk URL analyzer', 'Score history tracker', 'CSV / Excel export'],
    color: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.2)',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Paste your Showit URL',
    desc: 'Enter your full website address - homepage, blog, or any page you want to audit. No login, no setup.',
  },
  {
    n: '02',
    title: 'We run 40+ checks in parallel',
    desc: 'Google PageSpeed Insights data + our own HTML parser run simultaneously. Results arrive in about 30 seconds.',
  },
  {
    n: '03',
    title: 'Get Showit-specific fixes',
    desc: 'Every failing check links directly to the exact Showit dashboard setting you need to change - not generic SEO advice.',
  },
];

const WHY_SHOWIT = [
  {
    problem: 'Generic tools say "edit your theme file"',
    solution: 'Showit doesn\'t have theme files. We tell you which Showit panel to use.',
  },
  {
    problem: 'Google Search Console shows errors, no context',
    solution: 'We translate raw Lighthouse data into plain-English Showit fixes.',
  },
  {
    problem: 'Most SEO guides are written for WordPress',
    solution: 'Every recommendation here is written for Showit\'s canvas editor specifically.',
  },
  {
    problem: 'AI search tools are citing competitors',
    solution: 'Our AI Visibility tab tells you exactly what to fix to get cited in AI answers.',
  },
];

const FAQS = [
  {
    q: 'Is this tool really free? What\'s the catch?',
    a: 'Completely free. No catch. We use the Google PageSpeed Insights API which has a generous free tier. The tool was built because Showit creators kept getting bad advice from generic SEO tools - this is the fix.',
  },
  {
    q: 'Will this work for my Showit + WordPress blog?',
    a: 'Yes. You can analyze any page - your homepage, your portfolio page, or any individual blog post. Each URL gets its own full report.',
  },
  {
    q: 'How is this different from Google PageSpeed Insights?',
    a: 'Google PageSpeed Insights gives you raw scores. We take those same scores and add Showit-specific context: which panel fixes it, why it matters for photographers specifically, and what to do first. One tool instead of five.',
  },
  {
    q: 'Does my website need to be on Showit to use this?',
    a: 'You can analyze any public website. But the fix instructions are written specifically for Showit - they reference exact Showit dashboard panels and settings. Photographers on Squarespace or WordPress will still get accurate scores, just generic fix instructions.',
  },
  {
    q: 'What is an AI Visibility score and why does it matter?',
    a: 'AI Overviews (Google), ChatGPT Search, and Perplexity now answer questions with direct citations from websites. If your Showit site isn\'t structured correctly, AI tools skip you and cite your competitors. The AI Visibility tab tells you exactly what to change.',
  },
  {
    q: 'How often should I run an analysis?',
    a: 'Run it after any major site changes - new pages, redesigns, adding a blog, or updating your services. Also worth running quarterly to catch speed regressions from new third-party scripts.',
  },
];

const STATS = [
  { value: '40+', label: 'Checks per audit' },
  { value: '6', label: 'Analysis categories' },
  { value: '~30s', label: 'Time to results' },
  { value: '100%', label: 'Free, always' },
];

export default function LandingContent() {
  const { analyze } = useAnalyzer();

  return (
    <div style={{ background: 'var(--bg-body)' }}>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)', background: 'var(--bg-sidebar)' }}>
        <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="font-serif-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Who it's for ──────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Built for</p>
            <h2 className="font-serif-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Showit creators who are tired of<br className="hidden md:block" /> guessing what's wrong
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Whether you're a photographer, coach, wedding professional, or creative entrepreneur - if your website runs on Showit, this tool was made for you.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {WHO_ITS_FOR.map(w => (
              <div key={w.title} className="glass rounded-xl p-5" style={{ border: '1px solid var(--border-card)' }}>
                <div className="mb-3" style={{ color: 'var(--text-primary)' }}><w.icon size={22} /></div>
                <h3 className="font-semibold text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>{w.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The problem with generic tools ────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)', background: 'var(--bg-sidebar)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="md:grid md:grid-cols-2 md:gap-16 md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Why we built this</p>
              <h2 className="font-serif-display text-3xl font-bold mb-5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Generic SEO tools give Showit creators the wrong instructions
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Showit builds websites differently from WordPress or Squarespace. Its canvas-based architecture means that heading tags, meta descriptions, and image alt text are set in completely different places - and most SEO tools don't know that.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                When a photographer runs their Showit site through a generic SEO checker, they get advice like "edit your functions.php" or "install the Yoast plugin." None of that applies. This tool speaks Showit fluently.
              </p>
            </div>
            <div className="mt-8 md:mt-0 space-y-3">
              {WHY_SHOWIT.map(w => (
                <div key={w.problem} className="glass rounded-xl p-4" style={{ border: '1px solid var(--border-card)' }}>
                  <p className="text-xs mb-1.5 line-through" style={{ color: 'var(--text-faint)' }}>✗ {w.problem}</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>✓ {w.solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo Mockup ── */}
      <DemoMockup />

      {/* ── What we check ─────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Full analysis</p>
            <h2 className="font-serif-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Everything your Showit site needs to rank
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Six complete analysis categories. Over 40 individual checks. Every result explained in plain English with a Showit-specific fix.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_WE_CHECK.map(c => (
              <div key={c.label} className="rounded-xl p-5" style={{ background: c.color, border: `1px solid ${c.border}` }}>
                <div className="mb-3" style={{ color: 'var(--text-primary)' }}><c.icon size={22} /></div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>{c.label}</h3>
                <ul className="space-y-1.5">
                  {c.items.map(item => (
                    <li key={item} className="text-xs flex gap-2" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)', background: 'var(--bg-sidebar)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Simple process</p>
            <h2 className="font-serif-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Results in three steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px" style={{ background: 'var(--divider)', zIndex: 0, width: 'calc(100% - 3rem)', left: '100%' }} />
                )}
                <div className="font-serif-display text-4xl font-bold mb-4" style={{ color: 'var(--text-faint)' }}>{step.n}</div>
                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO for photographers block ───────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Showit SEO explained</p>
            <h2 className="font-serif-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              What "good SEO" actually means<br className="hidden md:block" /> for a Showit website
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                heading: 'Photographer SEO is local and visual',
                body: 'Photographers rank best when their site mentions their city, specialty, and ideal client - not just generic keywords like "photography." We check whether your Showit pages include the right local signals, proper alt text on portfolio images, and a heading structure Google can follow.',
              },
              {
                heading: 'Speed is a ranking factor - and Showit sites vary wildly',
                body: 'A Showit site with unoptimized images, too many third-party scripts, or heavy font loads can score under 40 on Google\'s mobile speed test. We break down exactly which files are slowing you down and how to fix them inside Showit\'s asset manager.',
              },
              {
                heading: 'AI search is changing how clients find photographers',
                body: 'When someone asks ChatGPT or Google\'s AI Overviews "who is the best wedding photographer in Austin," AI tools pull answers from structured, well-organized websites. We check whether your Showit site is structured to be cited - including schema markup, FAQ content, and E-E-A-T signals.',
              },
              {
                heading: 'Your Showit blog needs different SEO than your main site',
                body: 'Showit blogs run on WordPress, which means blog posts have different SEO rules than your canvas pages. We can analyze individual blog post URLs and give you both the Showit and WordPress-level fixes side by side.',
              },
            ].map(item => (
              <div key={item.heading}>
                <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{item.heading}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mid-page CTA ──────────────────────────────────────── */}
      <section className="py-14 px-4" style={{ borderBottom: '1px solid var(--divider)', background: 'var(--bg-sidebar)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif-display text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Curious how your Showit site scores?
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Paste your URL above or click below. Free, takes 30 seconds, no account needed.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-7 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              border: '1px solid var(--btn-primary-border)',
              cursor: 'pointer',
            }}
          >
            Run a free analysis →
          </button>
        </div>
      </section>

      {/* ── What you get in the report ────────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>Inside your report</p>
            <h2 className="font-serif-display text-3xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              A complete Showit website audit - not just a score
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: BarChart2, title: 'Overview & grade', desc: 'An overall site health grade (A–F) based on performance, SEO, accessibility, and best practices. Pinpoints your biggest wins and your biggest problems.' },
              { icon: Search, title: 'SEO deep-dive', desc: 'Title tag, meta description, headings, keywords, Open Graph, canonical URL, indexed pages - with exact Showit settings to fix each issue.' },
              { icon: Zap, title: 'Speed breakdown', desc: 'Mobile and desktop scores with drill-down into exactly which images, fonts, or scripts are hurting your load time.' },
              { icon: Bot, title: 'AI Visibility score', desc: 'How ready your site is to be cited in AI-generated answers. Checks AEO signals, structured data, E-E-A-T, and AI crawlability.' },
              { icon: Link2, title: 'Full link audit', desc: 'Every link on your page - broken ones, empty ones, internal vs external - sorted so you can fix the most important ones first.' },
              { icon: Settings2, title: 'Bonus tools', desc: 'SERP position estimator, competitor comparison side-by-side, local SEO score, score history over time, and CSV export.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-4 glass rounded-xl" style={{ border: '1px solid var(--border-card)' }}>
                <div className="flex-shrink-0" style={{ color: 'var(--text-primary)' }}><item.icon size={22} /></div>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)', background: 'var(--bg-sidebar)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-faint)' }}>FAQ</p>
            <h2 className="font-serif-display text-3xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-0">
            {FAQS.map((faq, i) => (
              <div
                key={faq.q}
                className="py-5"
                style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--divider)' : 'none' }}
              >
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              More questions?{' '}
              <Link href="/about" className="text-indigo-500 hover:underline">Read the full About page</Link>
              {' '}or{' '}
              <Link href="/contact" className="text-indigo-500 hover:underline">get in touch</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Your Showit site deserves<br /> to be found.
          </h2>
          <p className="text-base mb-2" style={{ color: 'var(--text-muted)' }}>
            Photographers, coaches, designers, and wedding professionals use this tool to find exactly what's holding their Showit site back - and fix it in an afternoon.
          </p>
          <p className="text-sm mb-8" style={{ color: 'var(--text-faint)' }}>
            Free. No signup. No data stored. Just your results.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              border: '1px solid var(--btn-primary-border)',
              cursor: 'pointer',
            }}
          >
            Analyze my Showit site - it&apos;s free →
          </button>
        </div>
      </section>

    </div>
  );
}
