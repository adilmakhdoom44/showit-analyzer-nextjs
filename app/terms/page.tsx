import type { Metadata } from 'next';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service — Showit Site Analyzer',
  description: 'Terms of service for Showit Site Analyzer. Free, no-signup SEO and speed analysis tool for Showit website creators.',
  alternates: { canonical: 'https://showitanalyzer.com/terms' },
  robots: { index: false, follow: true },
};

const TERMS = [
  {
    heading: 'Acceptance of terms',
    body: 'By using Showit Site Analyzer ("the Tool"), you agree to these Terms of Service. If you do not agree, please do not use the Tool. These terms apply to all visitors and users.',
  },
  {
    heading: 'Description of service',
    body: 'Showit Site Analyzer is a free web-based tool that analyzes publicly accessible websites using the Google PageSpeed Insights API and server-side HTML parsing. It provides SEO, performance, and technical recommendations. The Tool is provided free of charge with no guarantee of continued availability.',
  },
  {
    heading: 'Acceptable use',
    body: 'You may use this Tool only to analyze websites you own, manage, or have permission to analyze. You may not use the Tool to analyze sites at a volume that disrupts the Google PageSpeed Insights API, to harvest competitor data at scale, or for any unlawful purpose. Automated bulk usage beyond what the Tool explicitly supports is prohibited.',
  },
  {
    heading: 'Accuracy of results',
    body: 'Results are provided for informational purposes only. Performance scores and audit data come from the Google PageSpeed Insights API and may vary between runs. SEO recommendations are based on best practices and may not guarantee improved rankings. We make no warranty, express or implied, about the accuracy or completeness of any analysis result.',
  },
  {
    heading: 'No warranties',
    body: 'The Tool is provided "as is" and "as available" without any warranties of any kind, including but not limited to fitness for a particular purpose, merchantability, or non-infringement. We do not warrant that the Tool will be uninterrupted, error-free, or free from harmful components.',
  },
  {
    heading: 'Limitation of liability',
    body: 'To the fullest extent permitted by law, Showit Site Analyzer and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of revenue, loss of data, or business interruption, arising from your use of or inability to use the Tool.',
  },
  {
    heading: 'Third-party services',
    body: 'This Tool uses the Google PageSpeed Insights API. Your use of the Tool is also subject to Google\'s Terms of Service. We are not affiliated with Showit, Google, or any other company mentioned in our analysis results.',
  },
  {
    heading: 'Intellectual property',
    body: 'The Tool, its code, content, and design are owned by Showit Site Analyzer. You may not copy, reproduce, distribute, or create derivative works without permission. Analysis results generated for your own website are yours to use freely.',
  },
  {
    heading: 'Changes to these terms',
    body: 'We may update these Terms of Service at any time. Continued use of the Tool after any changes constitutes acceptance of the new terms. The current version is always available at showitanalyzer.com/terms.',
  },
  {
    heading: 'Governing law',
    body: 'These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation before pursuing any legal remedies.',
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
      <SiteHeader />

      <main>
        <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>Legal</p>
            <h1 className="font-serif-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Terms of Service
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Last updated: January 1, 2025</p>
            <p className="text-base mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Please read these terms before using Showit Site Analyzer. By analyzing a URL, you agree to these terms.
            </p>
          </div>
        </section>

        <section className="py-14 px-4">
          <div className="max-w-3xl mx-auto space-y-10">
            {TERMS.map((s, i) => (
              <div key={s.heading} style={{ borderBottom: i < TERMS.length - 1 ? '1px solid var(--divider)' : 'none', paddingBottom: '2.5rem' }}>
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
