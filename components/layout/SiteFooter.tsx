import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer
      style={{ borderTop: '1px solid var(--border-footer)', background: 'var(--bg-body)' }}
      className="mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-3">
              <span
                className="font-bold text-base"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  letterSpacing: '-0.02em',
                }}
              >
                Showit Site Analyzer
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              The free SEO, speed, and accessibility analyzer built specifically for Showit creators.
              Get actionable Showit-specific fixes in seconds - no signup required.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)', border: '1px solid var(--badge-green-border)' }}>
                ✓ 100% Free
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
                ✓ No Signup
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', border: '1px solid var(--badge-border)' }}>
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
                  <Link href={l.href}
                    className="text-sm no-underline transition-colors hover:text-indigo-400"
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
                  <Link href={l.href}
                    className="text-sm no-underline transition-colors hover:text-indigo-400"
                    style={{ color: 'var(--text-muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-footer)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            © {new Date().getFullYear()} Showit Site Analyzer · Built for Showit Creators
          </p>
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            Powered by{' '}
            <a
              href="https://developers.google.com/speed/docs/insights/v5/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-400 transition-colors"
            >
              Google PageSpeed Insights API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
