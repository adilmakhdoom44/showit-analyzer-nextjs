import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
      <SiteHeader />
      <main className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <p className="font-serif-display text-8xl font-bold mb-4" style={{ color: 'var(--text-faint)' }}>404</p>
        <h1 className="font-serif-display text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p className="text-base mb-8 max-w-md" style={{ color: 'var(--text-muted)' }}>
          The page you are looking for does not exist or has moved. Try analyzing your Showit site instead.
        </p>
        <Link
          href="/"
          className="px-7 py-3 rounded-lg text-sm font-semibold no-underline transition-opacity hover:opacity-80 inline-block"
          style={{
            background: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            border: '1px solid var(--btn-primary-border)',
          }}
        >
          Go back home →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
