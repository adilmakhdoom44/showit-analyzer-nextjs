'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalysisResult } from '@/types/analyzer';

export default function LinksTab({ result }: { result: AnalysisResult }) {
  const links = result.pageData?.links ?? [];
  const url = result.url;
  let domain = '';
  try { domain = new URL(url).hostname; } catch {}

  const internal = links.filter(l => l.href.includes(domain) || l.href.startsWith('/'));
  const external = links.filter(l => l.href.startsWith('http') && !l.href.includes(domain));
  const empty = links.filter(l => l.isEmpty);
  const placeholder = links.filter(l => l.href === '#' || l.href === '/' || l.href === '');

  const mailtoLinks = links.filter(l => l.href.startsWith('mailto:'));
  const telLinks = links.filter(l => l.href.startsWith('tel:'));
  const emailAddress = mailtoLinks[0]?.href.replace('mailto:', '') ?? '';
  const phoneNumber = telLinks[0]?.href.replace('tel:', '') ?? '';
  const iconLinks = links.filter(l => !l.text && !l.isEmpty && (l.href.startsWith('http') || l.href.startsWith('/')));

  const pageData = result.pageData;

  const brokenTotal = empty.length + placeholder.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: `Total Links (${links.length})`, value: links.length, color: '#6366f1' },
          { label: 'Internal', value: internal.length, color: '#10b981' },
          { label: 'External', value: external.length, color: '#06b6d4' },
          { label: 'Empty / Broken', value: brokenTotal, color: brokenTotal > 0 ? '#ef4444' : '#10b981' },
        ].map(s => (
          <Card key={s.label} className="glass border-0">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact info */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-white text-base">📞 Contact Detection</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {[
              { label: 'Email Link', found: pageData?.hasMailto, icon: '📧', fix: 'Add a mailto: link. In Showit, add a button or text with link set to "Email" and enter your email address.' },
              { label: 'Phone Link', found: pageData?.hasTel, icon: '📱', fix: 'Add a tel: link. In Showit, set a button link to "Phone" so mobile visitors can tap to call.' },
              { label: 'Contact Form', found: (pageData?.forms ?? 0) > 0, icon: '📝', fix: 'Add a Showit native form or embed a contact form from Typeform, JotForm, or your CRM.' },
              { label: 'Privacy Link', found: pageData?.privacyLink, icon: '🔒', fix: 'Add a Privacy Policy page and link it in your footer - required for GDPR compliance and trust.' },
            ].map(c => (
              <div key={c.label} className="p-3 rounded-xl"
                style={{ background: c.found ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${c.found ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{c.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-white">{c.label}</div>
                    <div className="text-xs" style={{ color: c.found ? '#10b981' : '#ef4444' }}>{c.found ? 'Found ✓' : 'Missing ✗'}</div>
                  </div>
                </div>
                {c.found && c.label === 'Email Link' && emailAddress && (
                  <div className="mt-1 font-mono text-xs text-green-400 truncate">{emailAddress}</div>
                )}
                {c.found && c.label === 'Phone Link' && phoneNumber && (
                  <div className="mt-1 font-mono text-xs text-green-400">{phoneNumber}</div>
                )}
                {!c.found && (
                  <div className="text-xs text-slate-500 mt-1">{c.fix}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty / placeholder links */}
      {brokenTotal > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              ⚠️ Empty or Placeholder Links <Badge variant="destructive">{brokenTotal}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg text-xs text-amber-300 mb-3"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="font-medium mb-1">What this means & how to fix it:</div>
              <ul className="space-y-1 text-slate-400">
                <li>• <strong className="text-slate-300">href=&quot;#&quot;</strong> - A placeholder link. In Showit, find buttons/links with no destination set and either add a real URL or remove the link.</li>
                <li>• <strong className="text-slate-300">Empty href</strong> - A link with no destination. Google counts these as broken and they confuse screen readers.</li>
                <li>• <strong className="text-slate-300">Icons without text</strong> - Social icons or button icons often have no accessible label. Add aria-label=&quot;Instagram&quot; (or the relevant platform) to icon-only links.</li>
              </ul>
              <div className="mt-2 font-medium text-slate-300">How to fix in Showit:</div>
              <ol className="mt-1 space-y-0.5 list-decimal ml-4 text-slate-400">
                <li>Open the Showit editor and switch to the page with broken links</li>
                <li>Click each button/icon that might have an empty link</li>
                <li>In the right panel, check the &quot;Link&quot; field - if it says &quot;#&quot; or is blank, update it</li>
                <li>For social icons: set the link to your actual social profile URL</li>
                <li>For navigation links: make sure every nav item points to a real page</li>
              </ol>
            </div>
            {empty.length > 0 && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <div className="text-xs text-slate-500 mb-1">Empty link hrefs found:</div>
                {empty.slice(0, 20).map((l, i) => {
                  const pageSearchUrl = `${url.replace(/\/$/, '')}#${encodeURIComponent(l.text || l.href || '')}`;
                  return l.href && l.href !== '#' ? (
                    <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-mono text-indigo-400 hover:text-indigo-300 p-2 rounded"
                      style={{ background: 'rgba(239,68,68,0.06)' }}>
                      <span className="break-all flex-1">{l.href}</span>
                      {l.text && <span className="text-slate-500 flex-shrink-0">&quot;{l.text}&quot;</span>}
                      <span className="flex-shrink-0">↗</span>
                    </a>
                  ) : (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-amber-400 p-2 rounded"
                      style={{ background: 'rgba(239,68,68,0.06)' }}>
                      <span>⚠️</span>
                      <span className="flex-1">{l.href || '(empty href)'}</span>
                      {l.text && <span className="text-slate-500">&quot;{l.text}&quot;</span>}
                      <a href={pageSearchUrl} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 text-indigo-400 hover:text-indigo-300 underline whitespace-nowrap">
                        🔍 View on page ↗
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Icon-only links */}
      {iconLinks.length > 5 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              🔗 Icon-Only Links <Badge style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'none' }}>{iconLinks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 mb-3">
              Links with icons but no text (e.g., social media icons) are invisible to screen readers and unclear to search engines. Each should have an <code className="text-indigo-300">aria-label</code> attribute.
            </p>
            <div className="p-3 rounded-lg text-xs text-slate-400 mb-3"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="font-medium text-indigo-300 mb-1">How to fix icon links:</div>
              <ol className="space-y-0.5 list-decimal ml-4">
                <li>In Showit, click the icon link element</li>
                <li>Look for &quot;Accessibility&quot; or &quot;ARIA Label&quot; in the element settings</li>
                <li>Enter the platform name: &quot;Follow us on Instagram&quot;, &quot;View Facebook page&quot;, etc.</li>
                <li>If Showit doesn&apos;t have this option, add custom code: <code className="text-indigo-300">aria-label=&quot;Instagram&quot;</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* External links */}
      {external.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle className="text-white text-base">🌍 External Links ({external.length})</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 mb-3">
              External links should open in a new tab with <code className="text-indigo-300">target=&quot;_blank&quot;</code> and include <code className="text-indigo-300">rel=&quot;noopener noreferrer&quot;</code> for security.
              Links to reputable sites can actually help your SEO - they signal you&apos;re connected to quality content.
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {external.slice(0, 20).map((l, i) => (
                <a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs p-2 rounded hover:bg-white/5 transition-colors"
                  style={{ background: 'rgba(6,182,212,0.05)' }}>
                  <span className="text-cyan-400 flex-shrink-0 mt-0.5">↗</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-cyan-300 break-all">{l.href}</div>
                    {l.text && <div className="text-slate-600 text-xs mt-0.5">&quot;{l.text}&quot;</div>}
                  </div>
                </a>
              ))}
              {external.length > 20 && (
                <div className="text-xs text-slate-600 text-center pt-1">+ {external.length - 20} more</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Internal link map */}
      {internal.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle className="text-white text-base">🗺️ Internal Link Map</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-slate-400 mb-3">
              Internal links help Google discover and understand your site structure. Link from every page to your key pages (portfolio, pricing, contact) with descriptive anchor text - not just &quot;click here&quot;.
            </p>
            <div className="p-3 rounded-lg text-xs text-slate-400 mb-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <div className="font-medium text-slate-300 mb-1">💡 Internal linking best practices:</div>
              <ul className="space-y-0.5">
                <li>• Use descriptive anchor text: &quot;View wedding portfolio&quot; not &quot;click here&quot;</li>
                <li>• Link to your most important pages from multiple pages</li>
                <li>• Add a clear navigation menu with links to all key sections</li>
                <li>• Add contextual links within your blog posts to related portfolio pages</li>
              </ul>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {internal.slice(0, 40).map((l, i) => {
                const fullHref = l.href.startsWith('http') ? l.href : `${url.replace(/\/$/, '')}${l.href.startsWith('/') ? '' : '/'}${l.href}`;
                return (
                  <a key={i} href={fullHref} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-2 text-xs p-2 rounded hover:bg-white/5 transition-colors"
                    style={{ background: 'rgba(99,102,241,0.05)' }}>
                    <span className="text-indigo-400 flex-shrink-0 mt-0.5">→</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-300 break-all">{l.href}</div>
                      {l.text
                        ? <div className="text-slate-500 text-xs mt-0.5">&quot;{l.text}&quot;</div>
                        : <div className="text-red-400 text-xs mt-0.5">no anchor text</div>
                      }
                    </div>
                  </a>
                );
              })}
              {internal.length > 40 && (
                <div className="text-xs text-slate-600 text-center pt-1">+ {internal.length - 40} more</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
