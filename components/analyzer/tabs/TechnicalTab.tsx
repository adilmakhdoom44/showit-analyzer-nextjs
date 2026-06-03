'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { checkBusinessEssentials } from '@/lib/analysis-helpers';
import type { AnalysisResult } from '@/types/analyzer';

function CheckRow({ label, found, icon, good = true, detail }: {
  label: string; found: boolean; icon: string; good?: boolean; detail?: string;
}) {
  const ok = good ? found : !found;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <span className="text-sm text-slate-300">{label}</span>
        {detail && <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{detail}</div>}
      </div>
      <span className="text-xs font-medium" style={{ color: ok ? '#10b981' : '#ef4444' }}>
        {ok ? '✓ Found' : '✗ Missing'}
      </span>
    </div>
  );
}

const a11yFixes: Record<string, string> = {
  'color-contrast': 'In Showit: Select the text element → change text or background color to meet 4.5:1 ratio.',
  'image-alt': 'In Showit: Click any image → right panel → Alt Text field.',
  'button-name': 'Add descriptive text or ARIA labels to buttons.',
  'link-name': 'Ensure all linked text is descriptive (not just "click here").',
  'aria-roles': 'Review custom code blocks for invalid ARIA role attributes.',
  'label': 'Ensure all form inputs have visible label text.',
  'aria-required-attr': 'Add required ARIA attributes to interactive elements.',
};

export default function TechnicalTab({ result }: { result: AnalysisResult }) {
  const { pageData, mobile, url } = result;
  const audits = mobile.lighthouseResult?.audits ?? mobile.audits ?? {};
  const analytics = pageData?.analytics;
  const businessChecks = checkBusinessEssentials(pageData ?? null);

  const accessibilityAudits = Object.values(audits).filter(a =>
    ['color-contrast','image-alt','button-name','link-name','aria-roles','label','aria-required-attr'].includes(a.id)
    && a.score !== null && a.score < 0.9
  );

  const techAudits = Object.values(audits).filter(a =>
    ['is-on-https','redirects-http','uses-http2','canonical','robots-txt','viewport'].includes(a.id)
  );

  // AI/AEO score - heuristic based on available signals
  const aeoSignals = [
    { label: 'Clear page title', ok: (pageData?.title?.length ?? 0) > 0, tip: 'In Showit: Site Settings → SEO → Page Title. Keep it under 60 chars.' },
    { label: 'Meta description present', ok: (pageData?.metaDesc?.length ?? 0) > 0, tip: 'In Showit: Site Settings → SEO → Meta Description. ~155 chars.' },
    { label: 'Structured H1 heading', ok: pageData?.headings?.some(h => h.tag === 'H1') ?? false, tip: 'In Showit: Select a text element → Format → Heading 1 (H1).' },
    { label: 'Schema / structured data', ok: (pageData?.schema ?? 0) > 0, tip: 'Add schema via Site Settings → SEO → Custom Code. Use schema.org/LocalBusiness.' },
    { label: 'HTTPS secure connection', ok: audits['is-on-https']?.score === 1, tip: 'Enable in Showit Dashboard → Site Settings → SSL Certificate.' },
    { label: '300+ word content', ok: (pageData?.wordCount ?? 0) >= 300, tip: 'Add more text content blocks to your pages in the Showit canvas.' },
    { label: 'Language declared', ok: !!pageData?.lang, tip: 'In Showit: Site Settings → Advanced → Language attribute.' },
  ];
  const aeoScore = Math.round((aeoSignals.filter(s => s.ok).length / aeoSignals.length) * 100);

  // E-E-A-T signals
  const eeatSignals = [
    { label: 'About / team page', ok: /about|our story|meet the team/i.test(pageData?.bodyText ?? ''), tip: 'Add an About page in Showit via Pages panel → Add Page.' },
    { label: 'Contact information', ok: !!(pageData?.hasMailto || pageData?.hasTel || (pageData?.forms ?? 0) > 0), tip: 'Add email/phone text or a contact form via Showit\'s form widget.' },
    { label: 'Privacy policy link', ok: !!pageData?.privacyLink, tip: 'Create a Privacy Policy page and link it in your footer.' },
    { label: 'Terms of service', ok: !!pageData?.termsLink, tip: 'Create a Terms page and link it in your footer.' },
    { label: 'Testimonials / reviews', ok: /testimonial|review|what.*say/i.test(pageData?.bodyText ?? ''), tip: 'Add a Testimonials section - Showit has dedicated testimonial blocks.' },
    { label: 'Schema markup', ok: (pageData?.schema ?? 0) > 0, tip: 'Add LocalBusiness or Person schema in Site Settings → SEO → Custom Code.' },
  ];
  const eeatScore = Math.round((eeatSignals.filter(s => s.ok).length / eeatSignals.length) * 100);

  // Security audits
  const securityAudits = [
    { id: 'is-on-https', label: 'HTTPS Enabled', desc: 'All traffic is encrypted' },
    { id: 'no-vulnerable-libraries', label: 'No Vulnerable JS Libraries', desc: 'No known-vulnerable dependencies' },
    { id: 'csp-xss', label: 'Content Security Policy', desc: 'XSS protection headers' },
  ].map(s => ({ ...s, score: audits[s.id]?.score }));

  // Derive robots.txt and sitemap URLs
  let rootUrl = url;
  try { const u = new URL(url); rootUrl = `${u.protocol}//${u.host}`; } catch {}

  const passedBusiness = businessChecks.filter(c => c.found).length;

  // Word count color
  const wc = pageData?.wordCount ?? 0;
  const wcColor = wc >= 600 ? '#10b981' : wc >= 300 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6">

      {/* Analytics */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-white text-base">📊 Analytics &amp; Tracking</CardTitle></CardHeader>
        <CardContent>
          <CheckRow label="Google Analytics 4 (GA4)" found={!!analytics?.ga4} icon="📈" />
          <CheckRow label="Google Tag Manager (GTM)" found={!!analytics?.gtm} icon="🏷️" />
          <CheckRow label="Universal Analytics (UA - legacy)" found={!!analytics?.ua} icon="📉" />
          <CheckRow label="Meta Pixel (Facebook)" found={!!analytics?.metaPixel} icon="👥" />
          <CheckRow label="Hotjar" found={!!analytics?.hotjar} icon="🔥" />
          {(!analytics?.ga4 && !analytics?.gtm) && (
            <div className="mt-3 p-3 rounded-lg text-xs text-indigo-300" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              💡 Add GA4 or GTM in Showit: <strong className="text-white">Site Settings → Integrations → Google Analytics</strong> or paste the GTM snippet in <strong className="text-white">Site Settings → SEO → Custom Code (Head)</strong>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Page Essentials */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">🏢 Business Page Essentials</CardTitle>
            <span className="text-xs" style={{ color: passedBusiness >= 6 ? '#10b981' : passedBusiness >= 4 ? '#f59e0b' : '#ef4444' }}>
              {passedBusiness}/{businessChecks.length} found
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {businessChecks.map((c, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl"
                style={{
                  background: c.found ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${c.found ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.12)'}`,
                }}>
                <span>{c.icon}</span>
                <span className="flex-1 text-xs text-slate-300">{c.label}</span>
                <span className="text-xs font-bold" style={{ color: c.found ? '#10b981' : '#ef4444' }}>
                  {c.found ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
          {passedBusiness < 5 && (
            <div className="mt-3 p-3 rounded-lg text-xs text-amber-300"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              💡 Showit creators with more page types (portfolio, pricing, testimonials) convert significantly more visitors into inquiries.
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI / AEO Score */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">🤖 AI &amp; Answer Engine Optimization (AEO)</CardTitle>
            <div className="text-2xl font-black" style={{ color: aeoScore >= 70 ? '#10b981' : aeoScore >= 40 ? '#f59e0b' : '#ef4444' }}>
              {aeoScore}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-400 mb-3">How visible is your site to AI tools like ChatGPT, Perplexity, and Google&apos;s AI Overview?</p>
          <div className="space-y-1.5">
            {aeoSignals.map((s, i) => (
              <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-xs">
                  <span>{s.ok ? '✅' : '❌'}</span>
                  <span className="text-slate-300">{s.label}</span>
                </div>
                {!s.ok && <div className="text-xs text-indigo-300 mt-1 pl-1">💡 {s.tip}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* E-E-A-T Score */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">🏅 E-E-A-T Trust Signals</CardTitle>
            <div className="text-2xl font-black" style={{ color: eeatScore >= 70 ? '#10b981' : eeatScore >= 40 ? '#f59e0b' : '#ef4444' }}>
              {eeatScore}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-400 mb-3">Experience, Expertise, Authoritativeness, Trustworthiness - Google&apos;s quality signals.</p>
          <div className="space-y-1.5">
            {eeatSignals.map((s, i) => (
              <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-xs">
                  <span>{s.ok ? '✅' : '❌'}</span>
                  <span className="text-slate-300">{s.label}</span>
                </div>
                {!s.ok && <div className="text-xs text-indigo-300 mt-1 pl-1">💡 {s.tip}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Structure */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-white text-base">🏗️ Page Structure</CardTitle></CardHeader>
        <CardContent>
          <CheckRow label="Language attribute (lang=)" found={!!pageData?.lang} icon="🌐" detail={pageData?.lang} />
          <CheckRow label="Favicon" found={!!pageData?.favicon} icon="🖼️" />
          <CheckRow label="Canonical URL" found={!!pageData?.canonical} icon="🔗" detail={pageData?.canonical} />
          <CheckRow label="Header region (<header>)" found={!!pageData?.regions?.header} icon="🔝" />
          <CheckRow label="Navigation region (<nav>)" found={!!pageData?.regions?.nav} icon="🗂️" />
          <CheckRow label="Main region (<main>)" found={!!pageData?.regions?.main} icon="📄" />
          <CheckRow label="Footer region (<footer>)" found={!!pageData?.regions?.footer} icon="🔚" />
          <CheckRow label="Schema / Structured Data" found={(pageData?.schema ?? 0) > 0} icon="🏷️"
            detail={(pageData?.schema ?? 0) > 0 ? `${pageData?.schema} type(s) detected` : undefined} />
          <CheckRow label="NoIndex tag" found={!!pageData?.hasNoIndex} icon="🚫" good={false} />
        </CardContent>
      </Card>

      {/* Technical Standards */}
      {techAudits.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle className="text-white text-base">🔐 Technical Standards</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {techAudits.map(a => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-sm mt-0.5" style={{ color: a.score === 1 ? '#10b981' : '#ef4444' }}>
                  {a.score === 1 ? '✓' : '✗'}
                </span>
                <div>
                  <div className="text-sm text-slate-300">{a.title}</div>
                  {a.displayValue && <div className="text-xs text-slate-500 mt-0.5">{a.displayValue}</div>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security Quick Check */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-white text-base">🔐 Security Quick Check</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {securityAudits.map(s => {
              const passed = s.score === 1;
              const unknown = s.score === undefined || s.score === null;
              return (
                <div key={s.id} className="p-3 rounded-xl text-center"
                  style={{
                    background: unknown ? 'rgba(255,255,255,0.03)' : passed ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${unknown ? 'rgba(255,255,255,0.08)' : passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.12)'}`,
                  }}>
                  <div className="text-lg mb-1">{unknown ? '❓' : passed ? '✅' : '❌'}</div>
                  <div className="text-xs font-medium text-slate-300 leading-tight">{s.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.desc}</div>
                  {!unknown && (
                    <div className="mt-1.5 text-xs font-bold" style={{ color: passed ? '#10b981' : '#ef4444' }}>
                      {passed ? 'Pass' : 'Fail'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Robots & Sitemap quick links */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-white text-base">🗂️ Robots.txt &amp; Sitemap</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: 'robots.txt', href: `${rootUrl}/robots.txt`, desc: 'Check if Googlebot can crawl your site' },
            { label: 'sitemap.xml', href: `${rootUrl}/sitemap.xml`, desc: 'Check if your sitemap exists' },
            { label: 'sitemap_index.xml', href: `${rootUrl}/sitemap_index.xml`, desc: 'Alternative sitemap location' },
          ].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-white/5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div className="text-sm font-medium text-indigo-400">{link.label}</div>
                <div className="text-xs text-slate-500">{link.desc}</div>
              </div>
              <span className="text-slate-600">↗</span>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Accessibility Issues */}
      {accessibilityAudits.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle className="text-white text-base">♿ Accessibility Issues</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {accessibilityAudits.map(a => (
              <div key={a.id} className="p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="text-sm font-medium text-white">{a.title}</div>
                {a.description && <div className="text-xs text-slate-400 mt-1 line-clamp-2">{a.description.replace(/\[.*?\]/g, '')}</div>}
                {a11yFixes[a.id] && <div className="text-xs text-indigo-300 mt-1">💡 Fix in Showit: {a11yFixes[a.id]}</div>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Content Stats */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-white text-base">📝 Content Stats</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Word Count', value: pageData?.wordCount ?? 'N/A', icon: '📝', color: wcColor },
            { label: 'Images', value: pageData?.images.length ?? 'N/A', icon: '🖼️', color: '#10b981' },
            { label: 'Links', value: pageData?.links?.length ?? 'N/A', icon: '🔗', color: '#10b981' },
            { label: 'Videos', value: (pageData as any)?.videos ?? (pageData as any)?.videoCount ?? 'N/A', icon: '🎥', color: '#10b981' },
            { label: 'Forms', value: pageData?.forms ?? 0, icon: '📋', color: '#10b981' },
            { label: 'Schema Types', value: pageData?.schema ?? 0, icon: '🏷️', color: (pageData?.schema ?? 0) > 0 ? '#10b981' : '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
