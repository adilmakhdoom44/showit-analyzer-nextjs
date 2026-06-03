'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalysisResult } from '@/types/analyzer';

function SignalRow({ label, ok, tip }: { label: string; ok: boolean; tip?: string }) {
  return (
    <div className="py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-base">{ok ? '✅' : '❌'}</span>
        <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{label}</span>
        <span className="text-xs font-medium" style={{ color: ok ? '#10b981' : '#ef4444' }}>{ok ? 'Pass' : 'Fail'}</span>
      </div>
      {!ok && tip && (
        <div className="mt-1 ml-6 text-xs text-indigo-300">💡 {tip}</div>
      )}
    </div>
  );
}

export default function AIVisibilityTab({ result }: { result: AnalysisResult }) {
  const { pageData, mobile, url } = result;
  const audits = mobile.lighthouseResult?.audits ?? mobile.audits ?? {};

  // Schema analysis
  const hasSchema = (pageData?.schema ?? 0) > 0;
  const schemaTypes: string[] = pageData?.schemaRaw?.map((s: Record<string, unknown>) => String(s['@type'] ?? '')).filter(Boolean) ?? [];

  // AEO signals with tips
  const aeoSignals = [
    { label: 'Clear page title (for AI context)', ok: (pageData?.title?.length ?? 0) > 5, tip: 'In Showit: Site Settings → SEO → Page Title. Be descriptive, 50–60 chars.' },
    { label: 'Meta description (AI summary source)', ok: (pageData?.metaDesc?.length ?? 0) > 50, tip: 'In Showit: Site Settings → SEO → Meta Description. Write 140–160 chars as a clear sentence.' },
    { label: 'H1 heading (primary topic signal)', ok: pageData?.headings?.some(h => h.tag === 'H1') ?? false, tip: 'In Showit: Select text → Format → Heading 1. Should describe what your page is about.' },
    { label: 'H2 headings (subtopic structure)', ok: pageData?.headings?.some(h => h.tag === 'H2') ?? false, tip: "Use H2s to organize sections - AI reads these as your page's outline." },
    { label: 'Schema / structured data', ok: hasSchema, tip: 'Add LocalBusiness or Person schema via Site Settings → SEO → Custom Code (Head).' },
    { label: 'HTTPS secure connection', ok: audits['is-on-https']?.score === 1, tip: 'Enable SSL in Showit Dashboard → Site Settings → SSL Certificate.' },
    { label: '300+ words of content', ok: (pageData?.wordCount ?? 0) >= 300, tip: 'AI needs content to understand your site. Add text blocks describing your services.' },
    { label: 'Language declared (lang attr)', ok: !!pageData?.lang, tip: "Showit sets this automatically. Verify in your published page source." },
    { label: 'Open Graph title (social sharing)', ok: !!(pageData?.og?.title || pageData?.title), tip: 'Showit uses your SEO title for OG tags by default. Customize in Site Settings → SEO.' },
    { label: 'Open Graph description', ok: !!(pageData?.og?.description || pageData?.metaDesc), tip: 'Add a compelling social description via Site Settings → SEO → Social Preview.' },
  ];

  // Citation readiness - factors that make AI cite your site
  const citationSignals = [
    { label: 'Specific niche/service mentioned', ok: /photographer|photography|videograph|wedding|portrait|family|newborn|boudoir|commercial|editorial/i.test(pageData?.bodyText ?? ''), tip: 'Explicitly state your specialty in body text - "Atlanta wedding photographer"' },
    { label: 'Location clearly stated', ok: /[A-Z][a-z]+,?\s+[A-Z]{2}\b/.test(pageData?.bodyText ?? '') || /\b(atlanta|chicago|dallas|houston|austin|seattle|denver|miami|orlando|nashville|los angeles|new york|san francisco|portland|phoenix|boston|charlotte|raleigh|minneapolis|detroit|indianapolis|columbus|memphis|louisville|baltimore|milwaukee|albuquerque|tucson|fresno|sacramento|mesa|kansas|omaha|colorado|virginia|carolina|jersey|england|york|angeles|francisco|diego|jose|antonio|jacksonville)\b/i.test(pageData?.bodyText ?? ''), tip: 'Include your city and state in page copy so AI tools can surface you for local queries.' },
    { label: 'Contact info on page', ok: !!(pageData?.hasMailto || pageData?.hasTel), tip: 'Add your email or phone number - signals legitimacy to AI crawlers.' },
    { label: 'About/author information', ok: /about|our story|meet|photographer|videographer/i.test(pageData?.bodyText ?? ''), tip: "AI tools rank sites higher when there's clear author information." },
    { label: 'Testimonials/social proof', ok: /testimonial|review|what.*say|five star|5 star|loved working/i.test(pageData?.bodyText ?? ''), tip: "Add a testimonials section - social proof increases trustworthiness in AI rankings." },
    { label: 'FAQ-style content', ok: /\?/.test(pageData?.bodyText ?? '') && (pageData?.bodyText ?? '').split('?').length > 3, tip: 'Add a FAQ section. AI tools (especially Perplexity) extract Q&A directly from pages.' },
    { label: 'Internal links (site structure)', ok: (pageData?.links?.filter(l => !l.href.startsWith('http'))?.length ?? 0) >= 3, tip: "Link between your pages to help AI understand your site's topic hierarchy." },
  ];

  // Perplexity/ChatGPT readiness
  const aiReadinessSignals = [
    { label: 'robots.txt accessible (not blocked)', ok: true, tip: 'Check your robots.txt at ' + url.replace(/\/$/, '') + '/robots.txt - ensure AI crawlers are not blocked.' },
    { label: 'No noindex directive', ok: !pageData?.hasNoIndex, tip: 'Remove noindex tags from pages you want AI to index.' },
    { label: 'Page loads under 3s (AI crawls faster pages)', ok: (audits['interactive']?.numericValue ?? 999999) < 3000, tip: 'Optimize images and reduce scripts to improve load time.' },
    { label: 'Canonical URL set', ok: !!pageData?.canonical, tip: 'In Showit: Site Settings → SEO → Canonical URL.' },
  ];

  const aeoScore = Math.round((aeoSignals.filter(s => s.ok).length / aeoSignals.length) * 100);
  const citationScore = Math.round((citationSignals.filter(s => s.ok).length / citationSignals.length) * 100);
  const aiScore = Math.round((aiReadinessSignals.filter(s => s.ok).length / aiReadinessSignals.length) * 100);
  const overallAI = Math.round((aeoScore + citationScore + aiScore) / 3);

  const scoreColor = (s: number) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6">

      {/* AI Visibility Score */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🤖 AI Visibility Score</CardTitle>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>How likely AI tools (ChatGPT, Perplexity, Google AI Overview) are to cite or reference your site</p>
            </div>
            <div className="text-4xl font-black" style={{ color: scoreColor(overallAI) }}>{overallAI}%</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-3 rounded-full overflow-hidden mb-5" style={{ background: 'var(--bg-card)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallAI}%`, background: `linear-gradient(90deg, #6366f1, ${scoreColor(overallAI)})` }} />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'AEO Score', value: aeoScore },
              { label: 'Citation Ready', value: citationScore },
              { label: 'AI Crawlability', value: aiScore },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
                <div className="text-2xl font-black" style={{ color: scoreColor(s.value) }}>{s.value}%</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schema / Structured Data */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🏷️ Schema / Structured Data</CardTitle>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
              background: hasSchema ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: hasSchema ? '#10b981' : '#ef4444',
            }}>{hasSchema ? `${pageData?.schema} type(s) found` : 'None detected'}</span>
          </div>
        </CardHeader>
        <CardContent>
          {hasSchema && schemaTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {schemaTypes.map((t: string) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.3)' }}>
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {!hasSchema && (
            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No schema markup detected</p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Schema markup helps AI tools understand who you are, what you do, and where you&apos;re located. Without it, AI is guessing.</p>
              <p className="text-xs text-indigo-300">💡 Add this to Showit → Site Settings → SEO → Custom Code (Head):</p>
            </div>
          )}
          <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
            <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Recommended schema for photographers/creatives:</div>
            <div className="space-y-1.5">
              {[
                { type: 'LocalBusiness', why: 'Tells Google/AI your name, address, phone, service area', priority: 'High' },
                { type: 'Person', why: 'Establishes your personal brand identity for Knowledge Panel', priority: 'High' },
                { type: 'Service', why: 'Describes each service you offer', priority: 'Medium' },
                { type: 'Review / AggregateRating', why: 'Unlocks star ratings in search results', priority: 'High' },
                { type: 'FAQPage', why: 'Enables FAQ rich snippets + AI Q&A extraction', priority: 'Medium' },
                { type: 'BreadcrumbList', why: 'Helps AI navigate your site hierarchy', priority: 'Low' },
              ].map(s => (
                <div key={s.type} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
                  <span className="font-mono text-indigo-300 text-xs flex-shrink-0 w-44">{s.type}</span>
                  <span className="text-xs flex-1" style={{ color: 'var(--text-muted)' }}>{s.why}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: s.priority === 'High' ? '#10b981' : s.priority === 'Medium' ? '#f59e0b' : 'var(--text-muted)' }}>{s.priority}</span>
                </div>
              ))}
            </div>
          </div>
          <a href="https://schema.org/LocalBusiness" target="_blank" rel="noopener noreferrer"
            className="mt-3 block text-center text-xs text-indigo-400 hover:text-indigo-300 underline">
            Generate schema at schema.org →
          </a>
        </CardContent>
      </Card>

      {/* AEO Signals */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📡 Answer Engine Optimization (AEO)</CardTitle>
            <div className="text-2xl font-black" style={{ color: scoreColor(aeoScore) }}>{aeoScore}%</div>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Signals that help Google AI Overview, ChatGPT, and Perplexity understand and use your content</p>
        </CardHeader>
        <CardContent>
          {aeoSignals.map((s, i) => <SignalRow key={i} {...s} />)}
        </CardContent>
      </Card>

      {/* Citation Readiness */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📣 Citation Readiness</CardTitle>
            <div className="text-2xl font-black" style={{ color: scoreColor(citationScore) }}>{citationScore}%</div>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Factors that make AI tools cite and recommend your site when users ask about your specialty or location</p>
        </CardHeader>
        <CardContent>
          {citationSignals.map((s, i) => <SignalRow key={i} {...s} />)}
        </CardContent>
      </Card>

      {/* AI Crawlability */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🕷️ AI Crawlability</CardTitle>
            <div className="text-2xl font-black" style={{ color: scoreColor(aiScore) }}>{aiScore}%</div>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Technical factors that determine whether AI crawlers can access and index your content</p>
        </CardHeader>
        <CardContent>
          {aiReadinessSignals.map((s, i) => <SignalRow key={i} {...s} />)}
          <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="text-indigo-300 font-medium mb-2">AI crawlers to allow in robots.txt:</div>
            <div className="grid grid-cols-2 gap-1 font-mono" style={{ color: 'var(--text-secondary)' }}>
              {['GPTBot (ChatGPT)', 'ClaudeBot (Claude)', 'PerplexityBot', 'GoogleBot (Gemini)', 'BingBot (Copilot)', 'YouBot (You.com)'].map(b => (
                <div key={b} className="text-xs">✓ {b}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Snippet Optimization */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">✨ Featured Snippet &amp; AI Overview Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: 'Write direct answers to questions',
              desc: 'Start paragraphs with a direct answer to a question your clients ask. Example: "Wedding photography in Austin starts at $2,500 for 8 hours coverage."',
              icon: '💬',
            },
            {
              title: 'Use numbered lists for processes',
              desc: 'When explaining your process, use numbered steps. Both Google and AI tools prefer structured lists for featured snippets.',
              icon: '📋',
            },
            {
              title: 'Add a FAQ section',
              desc: 'A FAQ section with questions like "How much does a wedding photographer cost?" directly increases AI Q&A sourcing from your site.',
              icon: '❓',
            },
            {
              title: 'Include your specialty + location together',
              desc: 'Repeat "[specialty] in [city]" naturally in headings and body text. AI builds associations between services and locations.',
              icon: '📍',
            },
            {
              title: 'Keep paragraphs short (2–3 sentences)',
              desc: 'AI tools extract short, dense paragraphs as answers. Long walls of text are skipped.',
              icon: '✂️',
            },
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
              <span className="text-xl flex-shrink-0">{tip.icon}</span>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{tip.title}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{tip.desc}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
