import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy - Showit Site Analyzer',
  description: 'Privacy policy for Showit Site Analyzer. We do not collect, store, or sell any personal data.',
  alternates: { canonical: 'https://showitanalyzer.com/privacy' },
};

const SECTIONS = [
  {
    heading: 'What data we collect',
    body: 'None. Showit Site Analyzer does not collect, store, log, or sell any personal data. We do not require account creation, email addresses, names, or payment information to use any part of this tool.',
  },
  {
    heading: 'URLs you analyze',
    body: 'When you enter a URL, it is sent to the Google PageSpeed Insights API (operated by Google LLC) and fetched by our server for HTML parsing. Neither we nor our server retains this URL or any data derived from it after the request completes. The result is returned directly to your browser and is never stored on our servers.',
  },
  {
    heading: 'Google PageSpeed Insights API',
    body: 'Performance scores and audit data are provided by the Google PageSpeed Insights API. When you analyze a URL, Google processes that URL according to their own terms of service and privacy policy. We recommend reviewing Google\'s Privacy Policy at policies.google.com/privacy.',
  },
  {
    heading: 'Local storage (your browser only)',
    body: 'The following data is saved in your browser\'s localStorage and never leaves your device: score history for URLs you have analyzed, fix checklist progress, and your selected theme preference. You can clear this data at any time through your browser\'s developer tools or by clearing site data.',
  },
  {
    heading: 'Cookies',
    body: 'We do not use cookies of any kind, including analytics cookies, advertising cookies, or session cookies. No tracking pixels are loaded. No third-party advertising networks are connected to this site.',
  },
  {
    heading: 'Analytics',
    body: 'This site does not use Google Analytics, Meta Pixel, or any other behavioral analytics platform. We do not track page views, sessions, clicks, or any user behavior.',
  },
  {
    heading: 'Third-party embeds',
    body: 'This site does not embed any third-party content (YouTube videos, social media widgets, ad networks) that would track you across the web.',
  },
  {
    heading: 'Children\'s privacy',
    body: 'This tool is intended for use by adults managing websites for their businesses. We do not knowingly collect data from anyone under the age of 13.',
  },
  {
    heading: 'Changes to this policy',
    body: 'If we ever change this privacy policy, we will update the date at the top of this page. Since we collect no data, changes are unlikely. The current version of this policy is always at showitanalyzer.com/privacy.',
  },
  {
    heading: 'Contact',
    body: 'Questions about this privacy policy? Reach out via the Contact page.',
  },
];

export default function PrivacyPage() {
  const lastUpdated = '2025-01-01';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
      <SiteHeader />

      <main>
        <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>Legal</p>
            <h1 className="font-serif-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Last updated: {lastUpdated}</p>
            <p className="text-base mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The short version: we collect nothing. No personal data, no analytics, no cookies, no tracking. Your analysis results live only in your own browser. Here is the full policy for those who want the details.
            </p>
          </div>
        </section>

        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            {SECTIONS.map((s, i) => (
              <div key={s.heading} style={{ borderBottom: i < SECTIONS.length - 1 ? '1px solid var(--divider)' : 'none', paddingBottom: '2.5rem' }}>
                <h2 className="font-semibold text-base mb-3" style={{ color: 'var(--text-primary)' }}>{s.heading}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
