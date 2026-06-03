'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  calcLocalSEOScore, calcGlobalSEOScore, analyzeCTAs,
  detectBookingTool, detectContactForm, getFilteredKeywords
} from '@/lib/analysis-helpers';
import type { AnalysisResult } from '@/types/analyzer';

export default function SEOTab({ result }: { result: AnalysisResult }) {
  const { pageData, url, mobile } = result;
  const audits = mobile.lighthouseResult?.audits ?? mobile.audits ?? {};
  const title = pageData?.title ?? '';
  const metaDesc = pageData?.metaDesc ?? '';
  const headings = pageData?.headings ?? [];
  const images = pageData?.images ?? [];
  const missingAlt = images.filter(i => !i.hasAlt);
  const og = pageData?.og;
  const twitter = pageData?.twitter;

  let domain = url;
  try { domain = new URL(url).hostname; } catch {}

  // Local + Global SEO
  const { score: localScore, signals: localSignals } = calcLocalSEOScore(pageData ?? null);
  const { score: globalScore, signals: globalSignals } = calcGlobalSEOScore(pageData ?? null, mobile);
  const localColor = localScore >= 70 ? '#10b981' : localScore >= 40 ? '#f59e0b' : '#ef4444';
  const globalColor = globalScore >= 70 ? '#10b981' : globalScore >= 40 ? '#f59e0b' : '#ef4444';

  // CTA analysis
  const ctas = analyzeCTAs(pageData ?? null);
  const bookingTool = detectBookingTool(pageData?.bodyText ?? '');
  const contactForm = detectContactForm(pageData?.bodyText ?? '', pageData?.forms ?? 0);

  // Filtered keywords
  const topKeywords = getFilteredKeywords(pageData?.bodyText ?? '');
  const totalWords = (pageData?.bodyText ?? '').split(/\s+/).filter(w => w.length > 0).length;

  // Heading order validation
  const headingNums = headings.map(h => parseInt(h.tag[1]));
  let headingOrderOk = true;
  for (let i = 1; i < headingNums.length; i++) {
    if (headingNums[i] > headingNums[i - 1] + 1) { headingOrderOk = false; break; }
  }
  const h1Count = headings.filter(h => h.tag === 'H1').length;

  // Featured snippet opportunities (headings 40-80 chars)
  const snippetOpportunities = headings.filter(h => h.text.length >= 40 && h.text.length <= 80 && (h.tag === 'H2' || h.tag === 'H3'));

  const [expandedSignal, setExpandedSignal] = useState<number|null>(null);

  // Meta description suggestion logic
  const descStatus = metaDesc.length === 0 ? 'missing' : metaDesc.length < 150 ? 'short' : metaDesc.length > 160 ? 'long' : 'good';
  const titleStatus = title.length === 0 ? 'missing' : title.length < 50 ? 'short' : title.length > 60 ? 'long' : 'good';

  return (
    <div className="space-y-6">

      {/* Google Search Preview */}
      <Card className="glass border-0">
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🔍 Google Search Preview</CardTitle></CardHeader>
        <CardContent>
          {/* What Google currently shows */}
          <div className="text-xs mb-2 font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>What Google is currently showing:</div>
          <div className="p-4 rounded-xl mb-4" style={{ background: '#fff', maxWidth: 600 }}>
            <div className="text-xs text-green-700 mb-0.5 truncate">{url}</div>
            <div className="text-lg text-blue-700 font-medium leading-snug hover:underline cursor-pointer truncate">
              {title || <span className="italic text-slate-400">No title found</span>}
            </div>
            <div className="text-sm text-slate-600 mt-1 line-clamp-2">
              {metaDesc || <span className="italic text-slate-400">No meta description - Google will auto-generate one from your page content, which may not represent your business well.</span>}
            </div>
          </div>

          {/* Meta description improvement tip */}
          {descStatus !== 'good' && (
            <div className="p-3 rounded-xl mb-4 text-xs"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="text-indigo-300 font-semibold mb-1">
                💡 {descStatus === 'missing' ? 'No meta description found - here\'s what yours should look like:' :
                  descStatus === 'short' ? `Your description is only ${metaDesc.length} chars - aim for 150–160. Example format:` :
                  `Your description is ${metaDesc.length} chars - Google truncates at ~160. Trim to:`}
              </div>
              <div style={{ color: 'var(--text-primary)' }} className="italic">
                {descStatus === 'missing'
                  ? `"[What you do] in [Your City]. [Unique value prop]. [CTA like: Book your session today.]" - aim for 150–160 characters.`
                  : descStatus === 'short'
                  ? `Expand your description to include your specialty, location, and a call-to-action. Example: "${metaDesc} [Add your city + CTA here to reach 150 chars]"`
                  : `"${metaDesc.slice(0, 157)}..." - cut to 157 characters to prevent truncation.`
                }
              </div>
            </div>
          )}

          {/* Title improvement tip */}
          {titleStatus !== 'good' && titleStatus !== 'missing' && (
            <div className="p-3 rounded-xl mb-4 text-xs"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div className="text-amber-300 font-semibold mb-1">
                ⚠️ Page title is {titleStatus === 'short' ? `only ${title.length} chars (aim for 50–60)` : `${title.length} chars - Google truncates at 60`}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {titleStatus === 'short'
                  ? `Add your main keyword + city to the title. Format: "[Service] in [City] | [Brand Name]"`
                  : `Shorten to: "${title.slice(0, 55)}..." - keep the most important keyword near the start.`}
              </div>
            </div>
          )}

          {/* Char bars */}
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>Title ({title.length} chars)</span>
                <span className={titleStatus === 'good' ? 'text-green-400' : 'text-amber-400'}>
                  {title.length === 0 ? '✗ Missing' : title.length < 50 ? 'Too short' : title.length <= 60 ? '✓ Good' : 'Too long'}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (title.length / 70) * 100)}%`, background: titleStatus === 'good' ? '#10b981' : '#f59e0b' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                <span>Description ({metaDesc.length} chars)</span>
                <span className={descStatus === 'good' ? 'text-green-400' : 'text-amber-400'}>
                  {metaDesc.length === 0 ? '✗ Missing' : metaDesc.length < 150 ? 'Too short' : metaDesc.length <= 160 ? '✓ Good' : 'Too long'}
                </span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (metaDesc.length / 180) * 100)}%`, background: descStatus === 'good' ? '#10b981' : '#f59e0b' }} />
              </div>
            </div>
          </div>

          {/* Meta extras */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg flex justify-between" style={{ background: 'var(--bg-sidebar)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Canonical URL</span>
              <span className={pageData?.canonical ? 'text-green-400' : 'text-red-400'}>{pageData?.canonical ? '✓ Set' : '✗ Missing'}</span>
            </div>
            <div className="p-2 rounded-lg flex justify-between" style={{ background: 'var(--bg-sidebar)' }}>
              <span style={{ color: 'var(--text-muted)' }}>NoIndex</span>
              <span className={pageData?.hasNoIndex ? 'text-red-400' : 'text-green-400'}>{pageData?.hasNoIndex ? '⚠️ Blocked' : '✓ Indexable'}</span>
            </div>
            <div className="p-2 rounded-lg flex justify-between" style={{ background: 'var(--bg-sidebar)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Meta Robots</span>
              <span style={{ color: 'var(--text-secondary)' }} className="truncate ml-2">{pageData?.metaRobots || 'Not set'}</span>
            </div>
            <div className="p-2 rounded-lg flex justify-between" style={{ background: 'var(--bg-sidebar)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Word Count</span>
              <span className={(pageData?.wordCount ?? 0) >= 300 ? 'text-green-400' : 'text-amber-400'}>
                {pageData?.wordCount ?? 0} {(pageData?.wordCount ?? 0) >= 300 ? '✓' : '(aim for 300+)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global + Local SEO Scores side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Global SEO */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🌍 Global / Technical SEO</CardTitle>
              <div className="text-2xl font-black" style={{ color: globalColor }}>{globalScore}/100</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Technical signals that affect your ranking worldwide, not just locally.</p>
            <div className="space-y-1.5">
              {globalSignals.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-white/5 last:border-0">
                  <span>{s.found ? '✅' : '❌'}</span>
                  <span className="flex-1" style={{ color: s.found ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
                  <span className="font-bold flex-shrink-0" style={{ color: s.found ? '#10b981' : 'var(--text-muted)' }}>+{s.pts}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Local SEO */}
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📍 Local SEO Score</CardTitle>
              <div className="text-2xl font-black" style={{ color: localColor }}>{localScore}/100</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Signals that help you rank in local city/area searches.</p>
            <div className="space-y-1.5">
              {localSignals.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-white/5 last:border-0">
                  <span>{s.found ? '✅' : '❌'}</span>
                  <span className="flex-1" style={{ color: s.found ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.label}</span>
                  <span className="font-bold flex-shrink-0" style={{ color: s.found ? '#10b981' : 'var(--text-muted)' }}>+{s.pts}</span>
                </div>
              ))}
            </div>
            {localScore < 40 && (
              <div className="mt-3 p-2 rounded-lg text-xs text-amber-300"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                💡 Add your city name to your title, H1, and meta description.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CTA Analysis */}
      <Card className="glass border-0">
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📣 Conversion Elements (CTA Check)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {ctas.map((c, i) => {
              // Enrich booking and contact labels with detected tool
              let displayLabel = c.label;
              let detail = '';
              if (c.label.includes('Booking')) {
                detail = bookingTool.found ? `Tool detected: ${bookingTool.name}` : 'No booking tool detected';
              }
              if (c.label.includes('Contact form')) {
                detail = contactForm.found ? `Form type: ${contactForm.name}` : 'No contact form found';
              }
              return (
                <div key={i} className="p-3 rounded-xl"
                  style={{
                    background: c.found ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${c.found ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.12)'}`,
                  }}>
                  <div className="flex items-center gap-2">
                    <span>{c.icon}</span>
                    <span className="flex-1 text-xs" style={{ color: 'var(--text-primary)' }}>{displayLabel}</span>
                    <span className="text-xs font-bold" style={{ color: c.found ? '#10b981' : '#ef4444' }}>
                      {c.found ? '✓' : '✗'}
                    </span>
                  </div>
                  {detail && (
                    <div className="mt-1 ml-6 text-xs" style={{ color: c.found ? '#6ee7b7' : '#f87171' }}>
                      {detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            {ctas.filter(c => c.found).length}/{ctas.length} conversion elements found
          </div>
          {ctas.filter(c => !c.found).length > 0 && (
            <div className="p-3 rounded-lg text-xs"
              style={{ background: 'var(--bg-sidebar)', border: '1px dashed var(--border-card)' }}>
              <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>💡 Missing elements to add:</div>
              <ul className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                {!bookingTool.found && <li>• <strong>Booking tool:</strong> Embed Sprout Studio, HoneyBook, Calendly, or Dubsado for direct bookings</li>}
                {!contactForm.found && <li>• <strong>Contact form:</strong> Add a native Showit form or embed Typeform/JotForm</li>}
                {!ctas.find(c => c.label.includes('Phone'))?.found && <li>• <strong>Phone:</strong> Add a <code>tel:</code> link so mobile visitors can call in one tap</li>}
                {!ctas.find(c => c.label.includes('Pricing'))?.found && <li>• <strong>Pricing page:</strong> Visitors who can&apos;t find pricing often leave - even a starting-from price builds trust</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Preview */}
      {(og?.title || og?.image || og?.description) && (
        <Card className="glass border-0">
          <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📱 Social Share Preview</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Facebook / Open Graph</div>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #dde1e7' }}>
                {og?.image && <img src={og.image} alt="OG" className="w-full h-36 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
                <div className="p-3 bg-[#f0f2f5]">
                  <div className="text-xs uppercase text-slate-500">{domain}</div>
                  <div className="font-semibold text-slate-900 text-sm truncate">{og?.title || title}</div>
                  <div className="text-xs text-slate-600 line-clamp-2">{og?.description || metaDesc}</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                <div className={`p-1.5 rounded text-center ${og?.title ? 'text-green-400' : 'text-red-400'}`} style={{ background: 'var(--bg-card)' }}>
                  og:title {og?.title ? '✓' : '✗'}
                </div>
                <div className={`p-1.5 rounded text-center ${og?.description ? 'text-green-400' : 'text-red-400'}`} style={{ background: 'var(--bg-card)' }}>
                  og:desc {og?.description ? '✓' : '✗'}
                </div>
                <div className={`p-1.5 rounded text-center ${og?.image ? 'text-green-400' : 'text-red-400'}`} style={{ background: 'var(--bg-card)' }}>
                  og:image {og?.image ? '✓' : '✗'}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Twitter / X Card</div>
              <div className="rounded-xl overflow-hidden border border-white/10">
                {(twitter?.image || og?.image) && <img src={twitter?.image || og?.image} alt="Twitter" className="w-full h-36 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />}
                <div className="p-3" style={{ background: '#15202b' }}>
                  <div className="font-semibold text-white text-sm truncate">{twitter?.title || og?.title || title}</div>
                  <div className="text-xs text-slate-400 line-clamp-2">{twitter?.description || og?.description || metaDesc}</div>
                  <div className="text-xs text-slate-600 mt-1">{domain}</div>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                <div className={`p-1.5 rounded text-center ${twitter?.card ? 'text-green-400' : 'text-amber-400'}`} style={{ background: 'var(--bg-card)' }}>
                  tw:card {twitter?.card ? '✓' : '~'}
                </div>
                <div className={`p-1.5 rounded text-center ${twitter?.title ? 'text-green-400' : 'text-amber-400'}`} style={{ background: 'var(--bg-card)' }}>
                  tw:title {twitter?.title ? '✓' : '~'}
                </div>
                <div className={`p-1.5 rounded text-center ${twitter?.image ? 'text-green-400' : 'text-amber-400'}`} style={{ background: 'var(--bg-card)' }}>
                  tw:image {twitter?.image ? '✓' : '~'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heading Structure */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📋 Heading Structure</CardTitle>
            <div className="flex gap-2 text-xs">
              <span className={h1Count === 1 ? 'text-green-400' : 'text-red-400'}>
                {h1Count === 1 ? '✓ 1 H1' : h1Count === 0 ? '✗ No H1' : `⚠️ ${h1Count} H1s (only 1 allowed)`}
              </span>
              <span className={headingOrderOk ? 'text-green-400' : 'text-amber-400'}>
                {headingOrderOk ? '✓ Good order' : '⚠️ Order issue'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {headings.length === 0 ? (
            <div className="p-3 rounded-lg text-xs text-red-400"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
              ❌ No headings found on this page. Add an H1 with your main keyword and H2s for each section.
            </div>
          ) : (
            <>
              <div className="space-y-1.5 max-h-72 overflow-y-auto mb-3">
                {headings.map((h, i) => (
                  <div key={i} className="flex items-start gap-2"
                    style={{ paddingLeft: `${(parseInt(h.tag[1]) - 1) * 12}px` }}>
                    <Badge variant="outline" className="text-xs flex-shrink-0 font-mono"
                      style={{ color: h.tag === 'H1' ? '#6366f1' : h.tag === 'H2' ? '#06b6d4' : 'var(--text-secondary)' }}>
                      {h.tag}
                    </Badge>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{h.text || '(empty heading)'}</span>
                  </div>
                ))}
              </div>
              {h1Count !== 1 && (
                <div className="p-3 rounded-lg text-xs text-amber-300"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  💡 {h1Count === 0
                    ? 'Add exactly one H1 heading - it\'s the most important on-page SEO signal. Include your main keyword and city.'
                    : `You have ${h1Count} H1 headings - Google expects only one per page. Demote the extras to H2.`}
                </div>
              )}
              {!headingOrderOk && (
                <div className="mt-2 p-3 rounded-lg text-xs text-amber-300"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  💡 Heading order jumps (e.g., H2 → H4). Keep a logical hierarchy: H1 → H2 → H3 to help Google understand your content structure.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Featured Snippet Opportunities */}
      {snippetOpportunities.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🏆 Featured Snippet Opportunities</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
              Google shows featured snippets (answer boxes) for question-based searches. These headings on your page are good candidates.
            </p>
            <div className="space-y-3 mb-4">
              {snippetOpportunities.slice(0, 5).map((h, i) => {
                const text = h.text.toLowerCase();
                const type = /how|step|process|guide|tutorial|way/.test(text) ? 'List snippet'
                  : /what|why|when|where|who|is|are|does|can/.test(text) ? 'Paragraph snippet'
                  : /best|top|compare|vs|difference/.test(text) ? 'Table/List snippet'
                  : 'Paragraph snippet';
                const typeColor = type.includes('List') ? '#10b981' : type.includes('Table') ? '#06b6d4' : '#6366f1';
                return (
                  <div key={i} className="p-3 rounded-xl"
                    style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <div className="flex items-start gap-2 mb-2">
                      <Badge variant="outline" className="text-xs font-mono flex-shrink-0"
                        style={{ color: '#4f46e5' }}>{h.tag}</Badge>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{h.text}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${typeColor}18`, color: typeColor }}>
                        {type}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      💡 Add a {type.includes('List') ? 'numbered or bulleted list' : '40–60 word direct answer paragraph'} immediately below this heading to compete for this snippet.
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 rounded-lg text-xs"
              style={{ background: 'var(--bg-sidebar)', border: '1px dashed var(--border-card)' }}>
              <div className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>📝 How to optimize for snippets in Showit:</div>
              <ol className="space-y-1 list-decimal ml-4" style={{ color: 'var(--text-secondary)' }}>
                <li>In Showit, add a Text element immediately below the heading widget</li>
                <li>Write a 2–3 sentence plain-text answer (40–60 words) - avoid fancy styling</li>
                <li>For list snippets: use a simple bulleted or numbered list in your text element</li>
                <li>Start your answer with the question rephrased: &quot;Wedding photography pricing in Austin typically...&quot;</li>
                <li>Google picks snippets that directly answer search queries - be concise and factual</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schema viewer */}
      {(pageData?.schema ?? 0) > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              🏷️ Structured Data (Schema)
              <Badge style={{ background: 'rgba(99,102,241,0.2)', color: '#4f46e5' }}>{pageData?.schema} type{(pageData?.schema ?? 0) > 1 ? 's' : ''}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Schema markup helps Google understand your business and can unlock rich results (star ratings, FAQs, etc.) in search.</p>
            <div className="p-3 rounded-lg text-xs"
              style={{ background: 'var(--bg-sidebar)', border: '1px dashed var(--border-card)' }}>
              <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>💡 Recommended schema types to add:</div>
              <ul className="space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                <li>• <strong>LocalBusiness</strong> or <strong>ProfessionalService</strong> - name, address, phone, hours</li>
                <li>• <strong>FAQPage</strong> - answer common questions (unlocks FAQ rich results)</li>
                <li>• <strong>Review / AggregateRating</strong> - show star ratings in search results</li>
                <li>• <strong>BreadcrumbList</strong> - show page hierarchy in search results</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images missing alt */}
      {missingAlt.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              🖼️ Images Missing Alt Text <Badge variant="destructive">{missingAlt.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg text-xs text-amber-300 mb-3"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="font-medium mb-1">How to fix in Showit:</div>
              <ol className="space-y-0.5 list-decimal ml-4">
                <li>Click on the image in the Showit editor</li>
                <li>Look for the &quot;Alt Text&quot; field in the right panel</li>
                <li>Describe the image naturally, include your keyword where relevant</li>
                <li>Example: &quot;Wedding photographer capturing first dance at Vineyard Estate&quot;</li>
              </ol>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {missingAlt.slice(0, 20).map((img, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                  <div className="flex-shrink-0 w-14 h-14 rounded overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                    {img.src ? (
                      <img src={img.src} alt="" className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>?</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono break-all leading-relaxed" style={{ color: 'var(--text-primary)' }}>{img.src || '(no src)'}</div>
                    {img.src && (
                      <a href={img.src} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 inline-flex items-center gap-1">
                        Open image ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keyword Density */}
      {topKeywords.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🔑 Top Keywords on This Page</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Words your page is being indexed for. Ensure your target keywords (service + city) appear in the top 10.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="uppercase text-xs" style={{ color: 'var(--text-muted)' }}>
                    <th className="text-left pb-2">Keyword</th>
                    <th className="text-center pb-2">Count</th>
                    <th className="text-center pb-2">Density</th>
                    <th className="text-left pb-2">Bar</th>
                  </tr>
                </thead>
                <tbody>
                  {topKeywords.map(([word, count]) => {
                    const density = totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : '0.00';
                    const pct = Math.min(100, (count / (topKeywords[0][1] || 1)) * 100);
                    const tooHigh = parseFloat(density) > 3;
                    return (
                      <tr key={word} className="border-t border-white/5">
                        <td className="py-1.5 font-medium" style={{ color: 'var(--text-primary)' }}>{word}</td>
                        <td className="py-1.5 text-center" style={{ color: 'var(--text-secondary)' }}>{count}</td>
                        <td className="py-1.5 text-center" style={{ color: tooHigh ? '#f59e0b' : 'var(--text-secondary)' }}>{density}%</td>
                        <td className="py-1.5 w-24">
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tooHigh ? '#f59e0b' : '#6366f1' }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 p-2 rounded text-xs" style={{ color: 'var(--text-muted)', background: 'var(--bg-sidebar)' }}>
              💡 Ideal keyword density is 1–3%. If your main service keyword is missing from this list, add it to your page content, H1, and meta description.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional SEO Tools / Checks */}
      <Card className="glass border-0">
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🛠️ More SEO Signals</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {(() => {
            const seoSignals = [
              {
                label: 'Viewport meta tag',
                found: !!(audits['viewport']?.score === 1 || (audits['viewport']?.score ?? 0) > 0.5),
                what: 'Tells browsers to scale the page correctly on mobile devices.',
                why: 'Google uses mobile-first indexing - without it your site may display incorrectly on phones.',
                fix: ['Showit adds this automatically. If missing, go to Site Settings → Custom Code → Head', 'Add: <meta name="viewport" content="width=device-width, initial-scale=1">', 'Save and republish your site'],
              },
              {
                label: 'HTTPS secure connection',
                found: audits['is-on-https']?.score === 1,
                what: 'Encrypts data between your visitor\'s browser and your server.',
                why: 'Google marks HTTP sites as "Not Secure" - a major trust killer and minor ranking factor.',
                fix: ['In Showit, go to Site Settings → Domain → enable SSL', 'If using a custom host, contact them to enable Let\'s Encrypt (free SSL)', 'After enabling, set up a 301 redirect from http:// to https://'],
              },
              {
                label: 'No redirect chains',
                found: !(audits['redirects']?.score !== null && (audits['redirects']?.score ?? 1) < 0.9),
                what: 'Multiple redirects in a chain (A→B→C) slow page load.',
                why: 'Each redirect adds 100–300ms delay and dilutes link equity passed between pages.',
                fix: ['Check if yourdomain.com redirects directly to www.yourdomain.com (or vice versa) in one step', 'In Showit Site Settings → Domain, ensure only one redirect is active', 'Use Redirect Checker tool at httpstatus.io to test your redirect chain'],
              },
              {
                label: 'HTTP/2 enabled',
                found: audits['uses-http2']?.score === 1,
                what: 'A protocol that loads multiple files simultaneously instead of one at a time.',
                why: 'Speeds up page load by 30–50% for sites with many images and scripts.',
                fix: ['Showit\'s managed hosting supports HTTP/2 automatically', 'If using Cloudflare (free): HTTP/2 is enabled by default in all plans', 'If on custom hosting: contact your host and ask them to enable HTTP/2'],
              },
              {
                label: 'robots.txt accessible',
                found: !!(audits['robots-txt']?.score === 1 || (audits['robots-txt']?.score ?? 0) >= 0.9),
                what: 'A file that tells search engine crawlers which pages they can and cannot access.',
                why: 'Without it, crawlers may waste budget on irrelevant pages or miss important ones.',
                fix: ['Showit auto-generates a robots.txt - check it at yourdomain.com/robots.txt', 'To customize: Site Settings → SEO → Advanced → Custom robots.txt', 'At minimum, ensure: "User-agent: * Allow: /" is present'],
              },
              {
                label: 'Images have descriptive alt text',
                found: missingAlt.length === 0,
                what: 'Text descriptions of images that help screen readers and search engines understand them.',
                why: 'Google can\'t see images - alt text is how it indexes them for Google Image Search.',
                fix: ['Click any image in the Showit editor → right panel → "Alt Text" field', 'Write a natural description: "Wedding couple at sunset ceremony, Austin Texas"', 'Include your target keyword where it fits naturally - don\'t stuff keywords', 'Every image on every page needs alt text, including gallery images'],
              },
              {
                label: 'Open Graph tags present',
                found: !!og?.title,
                what: 'Meta tags that control how your page looks when shared on Facebook, LinkedIn, etc.',
                why: 'Pages with OG tags get 3x more social shares and look professional when linked.',
                fix: ['In Showit: Site Settings → SEO → Social Sharing', 'Set OG Title (same as your page title)', 'Set OG Description (same as meta description)', 'Upload a 1200×630px image for the social share image'],
              },
              {
                label: 'Structured data present',
                found: (pageData?.schema ?? 0) > 0,
                what: 'JSON-LD code that tells Google your business type, location, and services.',
                why: 'Can unlock rich results (star ratings, FAQs, hours) directly in Google search results.',
                fix: ['Go to Site Settings → Custom Code → Head in Showit', 'Use Google\'s Structured Data Markup Helper (free) to generate your JSON-LD', 'Paste the generated code between <script type="application/ld+json"> tags', 'Test with Google\'s Rich Results Test at search.google.com/test/rich-results'],
              },
            ];
            return seoSignals.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{
                  background: item.found ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${item.found ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)'}`,
                }}>
                <button
                  className="w-full flex items-center gap-2 p-3 text-left"
                  onClick={() => !item.found && setExpandedSignal(expandedSignal === i ? null : i)}>
                  <span>{item.found ? '✅' : '❌'}</span>
                  <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  {!item.found && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{expandedSignal === i ? '▲' : '▼'}</span>}
                </button>
                {!item.found && expandedSignal === i && (
                  <div className="px-4 pb-4 border-t border-white/5">
                    <div className="mt-3 space-y-3">
                      <div>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>What it is: </span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.what}</span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-amber-400">Why it matters: </span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.why}</span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-indigo-400 mb-1">How to fix in Showit:</div>
                        <ol className="space-y-1">
                          {item.fix.map((step, si) => (
                            <div key={si} className="flex gap-2 text-xs">
                              <span className="flex-shrink-0 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                                style={{ background: 'rgba(99,102,241,0.2)', color: '#4f46e5' }}>{si + 1}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{step}</span>
                            </div>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ));
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
