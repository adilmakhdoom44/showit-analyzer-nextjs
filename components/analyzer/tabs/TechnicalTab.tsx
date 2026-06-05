'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { checkBusinessEssentials } from '@/lib/analysis-helpers';
import type { AnalysisResult } from '@/types/analyzer';
import {
  BarChart2, TrendingUp, Tag, TrendingDown, Users, Flame, Building2, Bot, Award,
  LayoutTemplate, Globe, Link2, ArrowUp, FolderOpen, FileText, ArrowDown, Ban,
  Lock, Accessibility, FileEdit, Image, ClipboardList, Video, CheckCircle2, XCircle,
  Info, AlertTriangle, HelpCircle, Type, Package
} from 'lucide-react';

function CheckRow({ label, found, Icon, iconColor, good = true, detail }: {
  label: string; found: boolean; Icon: React.ElementType; iconColor: string; good?: boolean; detail?: string;
}) {
  const ok = good ? found : !found;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
      <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
      <div className="flex-1">
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
        {detail && <div className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>{detail}</div>}
      </div>
      <span className="text-xs font-medium flex items-center gap-1" style={{ color: ok ? '#10b981' : '#ef4444' }}>
        {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
        {ok ? 'Found' : 'Missing'}
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

  // Content stats data
  const contentStats = [
    { label: 'Word Count', value: pageData?.wordCount ?? 'N/A', Icon: FileEdit, color: wcColor },
    { label: 'Images', value: pageData?.images.length ?? 'N/A', Icon: Image, color: '#10b981' },
    { label: 'Links', value: pageData?.links?.length ?? 'N/A', Icon: Link2, color: '#10b981' },
    { label: 'Videos', value: (pageData as any)?.videos ?? (pageData as any)?.videoCount ?? 'N/A', Icon: Video, color: '#10b981' },
    { label: 'Forms', value: pageData?.forms ?? 0, Icon: ClipboardList, color: '#10b981' },
    { label: 'Schema Types', value: pageData?.schema ?? 0, Icon: Tag, color: (pageData?.schema ?? 0) > 0 ? '#10b981' : '#f59e0b' },
  ];

  return (
    <div className="space-y-6">

      {/* Analytics */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <BarChart2 size={16} style={{ color: '#6366f1' }} /> Analytics &amp; Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckRow label="Google Analytics 4 (GA4)" found={!!analytics?.ga4} Icon={TrendingUp} iconColor="#10b981" />
          <CheckRow label="Google Tag Manager (GTM)" found={!!analytics?.gtm} Icon={Tag} iconColor="#6366f1" />
          <CheckRow label="Universal Analytics (UA - legacy)" found={!!analytics?.ua} Icon={TrendingDown} iconColor="#ef4444" />
          <CheckRow label="Meta Pixel (Facebook)" found={!!analytics?.metaPixel} Icon={Users} iconColor="#6366f1" />
          <CheckRow label="Hotjar" found={!!analytics?.hotjar} Icon={Flame} iconColor="#f97316" />
          {(!analytics?.ga4 && !analytics?.gtm) && (
            <div className="mt-3 p-3 rounded-lg text-xs text-indigo-300" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="inline-flex items-center gap-1"><Info size={12} color="#818cf8" /> Add GA4 or GTM in Showit:</span> <strong style={{ color: 'var(--text-primary)' }}>Site Settings → Integrations → Google Analytics</strong> or paste the GTM snippet in <strong style={{ color: 'var(--text-primary)' }}>Site Settings → SEO → Custom Code (Head)</strong>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Page Essentials */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Building2 size={16} style={{ color: '#6366f1' }} /> Business Page Essentials
            </CardTitle>
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
                <span className="flex-1 text-xs" style={{ color: 'var(--text-primary)' }}>{c.label}</span>
                <span className="text-xs font-bold flex items-center" style={{ color: c.found ? '#10b981' : '#ef4444' }}>
                  {c.found ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                </span>
              </div>
            ))}
          </div>
          {passedBusiness < 5 && (
            <div className="mt-3 p-3 rounded-lg text-xs text-amber-300"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span className="inline-flex items-center gap-1"><Info size={12} color="#818cf8" /></span> Showit creators with more page types (portfolio, pricing, testimonials) convert significantly more visitors into inquiries.
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI / AEO Score */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Bot size={16} style={{ color: '#8b5cf6' }} /> AI &amp; Answer Engine Optimization (AEO)
            </CardTitle>
            <div className="text-2xl font-black" style={{ color: aeoScore >= 70 ? '#10b981' : aeoScore >= 40 ? '#f59e0b' : '#ef4444' }}>
              {aeoScore}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>How visible is your site to AI tools like ChatGPT, Perplexity, and Google&apos;s AI Overview?</p>
          <div className="space-y-1.5">
            {aeoSignals.map((s, i) => (
              <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-xs">
                  {s.ok ? <CheckCircle2 size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                  <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                </div>
                {!s.ok && (
                  <div className="text-xs text-indigo-300 mt-1 pl-1 flex items-start gap-1">
                    <Info size={12} color="#818cf8" className="flex-shrink-0 mt-0.5" /> {s.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* E-E-A-T Score */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Award size={16} style={{ color: '#f59e0b' }} /> E-E-A-T Trust Signals
            </CardTitle>
            <div className="text-2xl font-black" style={{ color: eeatScore >= 70 ? '#10b981' : eeatScore >= 40 ? '#f59e0b' : '#ef4444' }}>
              {eeatScore}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Experience, Expertise, Authoritativeness, Trustworthiness - Google&apos;s quality signals.</p>
          <div className="space-y-1.5">
            {eeatSignals.map((s, i) => (
              <div key={i} className="py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2 text-xs">
                  {s.ok ? <CheckCircle2 size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                  <span style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                </div>
                {!s.ok && (
                  <div className="text-xs text-indigo-300 mt-1 pl-1 flex items-start gap-1">
                    <Info size={12} color="#818cf8" className="flex-shrink-0 mt-0.5" /> {s.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Page Structure */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <LayoutTemplate size={16} style={{ color: '#6366f1' }} /> Page Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CheckRow label="Language attribute (lang=)" found={!!pageData?.lang} Icon={Globe} iconColor="#6366f1" detail={pageData?.lang} />
          <CheckRow label="Favicon" found={!!pageData?.favicon} Icon={Image} iconColor="#6366f1" />
          <CheckRow label="Canonical URL" found={!!pageData?.canonical} Icon={Link2} iconColor="#6366f1" detail={pageData?.canonical} />
          <CheckRow label="Header region (<header>)" found={!!pageData?.regions?.header} Icon={ArrowUp} iconColor="#6366f1" />
          <CheckRow label="Navigation region (<nav>)" found={!!pageData?.regions?.nav} Icon={FolderOpen} iconColor="#6366f1" />
          <CheckRow label="Main region (<main>)" found={!!pageData?.regions?.main} Icon={FileText} iconColor="#6366f1" />
          <CheckRow label="Footer region (<footer>)" found={!!pageData?.regions?.footer} Icon={ArrowDown} iconColor="#6366f1" />
          <CheckRow label="Schema / Structured Data" found={(pageData?.schema ?? 0) > 0} Icon={Tag} iconColor="#6366f1"
            detail={(pageData?.schema ?? 0) > 0 ? `${pageData?.schema} type(s) detected` : undefined} />
          <CheckRow label="NoIndex tag" found={!!pageData?.hasNoIndex} Icon={Ban} iconColor="#ef4444" good={false} />
        </CardContent>
      </Card>

      {/* Technical Standards */}
      {techAudits.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Lock size={16} style={{ color: '#6366f1' }} /> Technical Standards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {techAudits.map(a => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="mt-0.5">
                  {a.score === 1 ? <CheckCircle2 size={14} color="#10b981" /> : <XCircle size={14} color="#ef4444" />}
                </span>
                <div>
                  <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                  {a.displayValue && <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{a.displayValue}</div>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security Quick Check */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <Lock size={16} style={{ color: '#6366f1' }} /> Security Quick Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {securityAudits.map(s => {
              const passed = s.score === 1;
              const unknown = s.score === undefined || s.score === null;
              return (
                <div key={s.id} className="p-3 rounded-xl text-center"
                  style={{
                    background: unknown ? 'var(--bg-sidebar)' : passed ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${unknown ? 'var(--border-card)' : passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.12)'}`,
                  }}>
                  <div className="flex justify-center mb-1">
                    {unknown
                      ? <HelpCircle size={20} color="#6366f1" />
                      : passed
                      ? <CheckCircle2 size={20} color="#10b981" />
                      : <XCircle size={20} color="#ef4444" />}
                  </div>
                  <div className="text-xs font-medium leading-tight" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                  <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
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
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <FolderOpen size={16} style={{ color: '#6366f1' }} /> Robots.txt &amp; Sitemap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: 'robots.txt', href: `${rootUrl}/robots.txt`, desc: 'Check if Googlebot can crawl your site' },
            { label: 'sitemap.xml', href: `${rootUrl}/sitemap.xml`, desc: 'Check if your sitemap exists' },
            { label: 'sitemap_index.xml', href: `${rootUrl}/sitemap_index.xml`, desc: 'Alternative sitemap location' },
          ].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-white/5"
              style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
              <div>
                <div className="text-sm font-medium text-indigo-400">{link.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{link.desc}</div>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>↗</span>
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Accessibility Issues */}
      {accessibilityAudits.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Accessibility size={16} style={{ color: '#6366f1' }} /> Accessibility Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {accessibilityAudits.map(a => (
              <div key={a.id} className="p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                {a.description && <div className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{a.description.replace(/\[.*?\]/g, '')}</div>}
                {a11yFixes[a.id] && (
                  <div className="text-xs text-indigo-300 mt-1 flex items-start gap-1">
                    <Info size={12} color="#818cf8" className="flex-shrink-0 mt-0.5" /> Fix in Showit: {a11yFixes[a.id]}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Content Stats */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <FileEdit size={16} style={{ color: '#6366f1' }} /> Content Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {contentStats.map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
              <div className="flex justify-center mb-1">
                <s.Icon size={22} style={{ color: s.color }} />
              </div>
              <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
