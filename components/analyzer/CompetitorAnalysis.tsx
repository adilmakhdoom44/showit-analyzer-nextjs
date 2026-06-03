'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/types/analyzer';
import { getGrade, countIssues } from '@/lib/scoring';

/* ── helpers ─────────────────────────────────── */
function sc(v: number | undefined) { return Math.round((v ?? 0) * 100); }

function ScorePill({ value }: { value: number }) {
  const { bg, text } = value >= 90
    ? { bg: 'rgba(16,185,129,0.15)', text: '#10b981' }
    : value >= 50
    ? { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' }
    : { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' };
  return (
    <span style={{ background: bg, color: text, borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 13 }}>
      {value}
    </span>
  );
}

type Winner = 'left' | 'right' | 'tie';
function winnerOf(a: number, b: number, lowerIsBetter = false): Winner {
  if (a === b) return 'tie';
  const leftWins = lowerIsBetter ? a < b : a > b;
  return leftWins ? 'left' : 'right';
}

function WinBadge({ side, winner }: { side: 'left' | 'right'; winner: Winner }) {
  if (winner === 'tie') return <span style={{ fontSize: 10, color: '#64748b', marginLeft: 4 }}>TIE</span>;
  const wins = winner === side;
  return wins
    ? <span style={{ fontSize: 10, color: '#10b981', marginLeft: 4, fontWeight: 700 }}>▲ Better</span>
    : <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 4 }}>▼ Behind</span>;
}

/* ── Row component ───────────────────────────── */
function CompareRow({
  label, left, right, winner, leftRaw, rightRaw,
}: {
  label: string;
  left: React.ReactNode;
  right: React.ReactNode;
  winner?: Winner;
  leftRaw?: number;
  rightRaw?: number;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '1px solid var(--divider)' }}>
      {/* label */}
      <div style={{ gridColumn: '1/-1', padding: '6px 12px 2px', fontSize: 11, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--bg-sidebar)' }}>
        {label}
      </div>
      <div style={{ padding: '8px 12px', borderRight: '1px solid var(--divider)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {left}
        {winner !== undefined && leftRaw !== undefined && rightRaw !== undefined && (
          <WinBadge side="left" winner={winner} />
        )}
      </div>
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {right}
        {winner !== undefined && leftRaw !== undefined && rightRaw !== undefined && (
          <WinBadge side="right" winner={winner} />
        )}
      </div>
    </div>
  );
}

function BoolRow({ label, left, right }: { label: string; left: boolean | undefined; right: boolean | undefined }) {
  const badge = (v: boolean | undefined) =>
    v ? <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>✓ Yes</span>
      : <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>✗ No</span>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: '1px solid var(--divider)' }}>
      <div style={{ gridColumn: '1/-1', padding: '6px 12px 2px', fontSize: 11, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--bg-sidebar)' }}>
        {label}
      </div>
      <div style={{ padding: '8px 12px', borderRight: '1px solid var(--divider)' }}>{badge(left)}</div>
      <div style={{ padding: '8px 12px' }}>{badge(right)}</div>
    </div>
  );
}

/* ── main tabs ───────────────────────────────── */
const TABS = ['Overview', 'SEO', 'Speed', 'Links', 'Technical'] as const;
type Tab = typeof TABS[number];

function OverviewComparison({ a, b }: { a: AnalysisResult; b: AnalysisResult }) {
  const auA = a.mobile.lighthouseResult?.audits ?? a.mobile.audits ?? {};
  const auB = b.mobile.lighthouseResult?.audits ?? b.mobile.audits ?? {};
  const catA = a.mobile.lighthouseResult?.categories ?? a.mobile.categories;
  const catB = b.mobile.lighthouseResult?.categories ?? b.mobile.categories;
  const { grade: gA, color: cA } = getGrade(catA, countIssues(auA));
  const { grade: gB, color: cB } = getGrade(catB, countIssues(auB));

  const scores = [
    { label: 'Performance', la: sc(catA?.performance?.score), lb: sc(catB?.performance?.score) },
    { label: 'SEO', la: sc(catA?.seo?.score), lb: sc(catB?.seo?.score) },
    { label: 'Accessibility', la: sc(catA?.accessibility?.score), lb: sc(catB?.accessibility?.score) },
    { label: 'Best Practices', la: sc(catA?.['best-practices']?.score), lb: sc(catB?.['best-practices']?.score) },
  ];

  const issA = countIssues(auA);
  const issB = countIssues(auB);

  return (
    <div>
      {/* Grade row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 0', marginBottom: 4 }}>
        <div style={{ textAlign: 'center', padding: 16, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: cA, lineHeight: 1 }}>{gA}</div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Overall Grade</div>
        </div>
        <div style={{ textAlign: 'center', padding: 16, borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: cB, lineHeight: 1 }}>{gB}</div>
          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Overall Grade</div>
        </div>
      </div>

      {/* Score rows */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-card)' }}>
        {scores.map(s => {
          const w = winnerOf(s.la, s.lb);
          return (
            <CompareRow key={s.label} label={s.label}
              left={<ScorePill value={s.la} />} right={<ScorePill value={s.lb} />}
              winner={w} leftRaw={s.la} rightRaw={s.lb} />
          );
        })}
        <CompareRow label="Total Issues"
          left={<span style={{ fontWeight: 700, color: issA > 0 ? '#ef4444' : '#10b981', fontSize: 13 }}>{issA}</span>}
          right={<span style={{ fontWeight: 700, color: issB > 0 ? '#ef4444' : '#10b981', fontSize: 13 }}>{issB}</span>}
          winner={winnerOf(issA, issB, true)} leftRaw={issA} rightRaw={issB} />
      </div>
    </div>
  );
}

function SEOComparison({ a, b }: { a: AnalysisResult; b: AnalysisResult }) {
  const pA = a.pageData; const pB = b.pageData;
  const catA = a.mobile.lighthouseResult?.categories ?? a.mobile.categories;
  const catB = b.mobile.lighthouseResult?.categories ?? b.mobile.categories;
  const seoA = sc(catA?.seo?.score);
  const seoB = sc(catB?.seo?.score);

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-card)' }}>
      <CompareRow label="SEO Score"
        left={<ScorePill value={seoA} />} right={<ScorePill value={seoB} />}
        winner={winnerOf(seoA, seoB)} leftRaw={seoA} rightRaw={seoB} />
      <BoolRow label="Meta Description" left={!!pA?.metaDesc} right={!!pB?.metaDesc} />
      <CompareRow label="Title Length"
        left={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{pA?.title?.length ?? 0} chars</span>}
        right={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{pB?.title?.length ?? 0} chars</span>} />
      <CompareRow label="H1 Headings"
        left={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{(pA?.headings ?? []).filter(h => h.tag === 'H1').length}</span>}
        right={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{(pB?.headings ?? []).filter(h => h.tag === 'H1').length}</span>} />
      <CompareRow label="Total Headings"
        left={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{(pA?.headings ?? []).length}</span>}
        right={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{(pB?.headings ?? []).length}</span>}
        winner={winnerOf((pA?.headings ?? []).length, (pB?.headings ?? []).length)}
        leftRaw={(pA?.headings ?? []).length} rightRaw={(pB?.headings ?? []).length} />
      <CompareRow label="Schema Markup"
        left={<span style={{ fontSize: 13, color: (pA?.schema ?? 0) > 0 ? '#10b981' : '#ef4444' }}>{pA?.schema ?? 0} types</span>}
        right={<span style={{ fontSize: 13, color: (pB?.schema ?? 0) > 0 ? '#10b981' : '#ef4444' }}>{pB?.schema ?? 0} types</span>}
        winner={winnerOf(pA?.schema ?? 0, pB?.schema ?? 0)}
        leftRaw={pA?.schema ?? 0} rightRaw={pB?.schema ?? 0} />
      <CompareRow label="Word Count"
        left={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{pA?.wordCount ?? 0}</span>}
        right={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{pB?.wordCount ?? 0}</span>}
        winner={winnerOf(pA?.wordCount ?? 0, pB?.wordCount ?? 0)}
        leftRaw={pA?.wordCount ?? 0} rightRaw={pB?.wordCount ?? 0} />
      <BoolRow label="OG Image" left={!!pA?.og?.image} right={!!pB?.og?.image} />
      <BoolRow label="Canonical URL" left={!!pA?.canonical} right={!!pB?.canonical} />
    </div>
  );
}

function SpeedComparison({ a, b }: { a: AnalysisResult; b: AnalysisResult }) {
  const auA = a.mobile.lighthouseResult?.audits ?? a.mobile.audits ?? {};
  const auB = b.mobile.lighthouseResult?.audits ?? b.mobile.audits ?? {};
  const catA = a.mobile.lighthouseResult?.categories ?? a.mobile.categories;
  const catB = b.mobile.lighthouseResult?.categories ?? b.mobile.categories;
  const perfA = sc(catA?.performance?.score);
  const perfB = sc(catB?.performance?.score);

  const metrics = [
    { key: 'largest-contentful-paint', label: 'LCP', lowerBetter: true },
    { key: 'total-blocking-time', label: 'Total Blocking Time', lowerBetter: true },
    { key: 'cumulative-layout-shift', label: 'CLS', lowerBetter: true },
    { key: 'first-contentful-paint', label: 'First Contentful Paint', lowerBetter: true },
    { key: 'speed-index', label: 'Speed Index', lowerBetter: true },
    { key: 'interactive', label: 'Time to Interactive', lowerBetter: true },
  ];

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-card)' }}>
      <CompareRow label="Performance Score"
        left={<ScorePill value={perfA} />} right={<ScorePill value={perfB} />}
        winner={winnerOf(perfA, perfB)} leftRaw={perfA} rightRaw={perfB} />
      {metrics.map(m => {
        const vA = auA[m.key]; const vB = auB[m.key];
        const nA = vA?.numericValue ?? 0; const nB = vB?.numericValue ?? 0;
        const sA = vA?.score ?? null; const sB = vB?.score ?? null;
        const color = (s: number | null) => s === null ? 'var(--text-primary)' : s >= 0.9 ? '#10b981' : s >= 0.5 ? '#f59e0b' : '#ef4444';
        return (
          <CompareRow key={m.key} label={m.label}
            left={<span style={{ fontSize: 13, fontWeight: 600, color: color(sA) }}>{vA?.displayValue ?? '—'}</span>}
            right={<span style={{ fontSize: 13, fontWeight: 600, color: color(sB) }}>{vB?.displayValue ?? '—'}</span>}
            winner={nA && nB ? winnerOf(nA, nB, m.lowerBetter) : undefined}
            leftRaw={nA} rightRaw={nB} />
        );
      })}
    </div>
  );
}

function LinksComparison({ a, b }: { a: AnalysisResult; b: AnalysisResult }) {
  const linksA = a.pageData?.links ?? [];
  const linksB = b.pageData?.links ?? [];
  const brokenA = linksA.filter(l => !l.href || l.href === '#' || l.href === '' || l.isEmpty).length;
  const brokenB = linksB.filter(l => !l.href || l.href === '#' || l.href === '' || l.isEmpty).length;

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-card)' }}>
      <CompareRow label="Total Links"
        left={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{linksA.length}</span>}
        right={<span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{linksB.length}</span>}
        winner={winnerOf(linksA.length, linksB.length)} leftRaw={linksA.length} rightRaw={linksB.length} />
      <CompareRow label="Broken / Empty Links"
        left={<span style={{ fontSize: 13, color: brokenA > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>{brokenA}</span>}
        right={<span style={{ fontSize: 13, color: brokenB > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>{brokenB}</span>}
        winner={winnerOf(brokenA, brokenB, true)} leftRaw={brokenA} rightRaw={brokenB} />
      <BoolRow label="Has mailto link" left={a.pageData?.hasMailto} right={b.pageData?.hasMailto} />
      <BoolRow label="Has phone (tel:) link" left={a.pageData?.hasTel} right={b.pageData?.hasTel} />
    </div>
  );
}

function TechnicalComparison({ a, b }: { a: AnalysisResult; b: AnalysisResult }) {
  const anA = a.pageData?.analytics; const anB = b.pageData?.analytics;
  const catA = a.mobile.lighthouseResult?.categories ?? a.mobile.categories;
  const catB = b.mobile.lighthouseResult?.categories ?? b.mobile.categories;
  const a11yA = sc(catA?.accessibility?.score);
  const a11yB = sc(catB?.accessibility?.score);
  const bpA = sc(catA?.['best-practices']?.score);
  const bpB = sc(catB?.['best-practices']?.score);

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-card)' }}>
      <CompareRow label="Accessibility Score"
        left={<ScorePill value={a11yA} />} right={<ScorePill value={a11yB} />}
        winner={winnerOf(a11yA, a11yB)} leftRaw={a11yA} rightRaw={a11yB} />
      <CompareRow label="Best Practices Score"
        left={<ScorePill value={bpA} />} right={<ScorePill value={bpB} />}
        winner={winnerOf(bpA, bpB)} leftRaw={bpA} rightRaw={bpB} />
      <BoolRow label="Google Analytics 4" left={anA?.ga4} right={anB?.ga4} />
      <BoolRow label="Google Tag Manager" left={anA?.gtm} right={anB?.gtm} />
      <BoolRow label="Meta Pixel" left={anA?.metaPixel} right={anB?.metaPixel} />
      <BoolRow label="Schema Markup"
        left={(a.pageData?.schema ?? 0) > 0} right={(b.pageData?.schema ?? 0) > 0} />
      <BoolRow label="Privacy Policy Link" left={a.pageData?.privacyLink} right={b.pageData?.privacyLink} />
      <BoolRow label="Terms of Service Link" left={a.pageData?.termsLink} right={b.pageData?.termsLink} />
      <BoolRow label="Not noindex'd" left={!a.pageData?.hasNoIndex} right={!b.pageData?.hasNoIndex} />
    </div>
  );
}

/* ── main component ──────────────────────────── */
export default function CompetitorAnalysis({ result }: { result: AnalysisResult }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [competitor, setCompetitor] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const myDomain = (() => { try { return new URL(result.url).hostname; } catch { return result.url; } })();
  const coDomain = competitor ? (() => { try { return new URL(competitor.url).hostname; } catch { return competitor.url; } })() : '';

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setCompetitor(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed');
      setCompetitor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Input */}
      <form onSubmit={analyze} style={{ display: 'flex', gap: 8 }}>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://competitor.com"
          disabled={loading}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: 13,
            background: 'var(--bg-card)', border: '1px solid var(--border-card)',
            color: 'var(--text-primary)', outline: 'none',
          }}
        />
        <button type="submit" disabled={loading || !url.trim()}
          style={{
            padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: 'white', border: 'none', whiteSpace: 'nowrap',
          }}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
          Analyzing competitor site… this takes about 30 seconds
        </div>
      )}

      {/* Comparison view */}
      {competitor && !loading && (
        <div>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', marginBottom: 2 }}>YOUR SITE</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{myDomain}</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 2 }}>COMPETITOR</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{coDomain}</div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{
            display: 'flex', gap: 4, padding: '6px', borderRadius: 14,
            background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)',
            marginBottom: 16, overflowX: 'auto', flexShrink: 0,
          }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, minWidth: 'max-content', padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: activeTab === tab ? 'var(--btn-primary-bg)' : 'transparent',
                  color: activeTab === tab ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'Overview'   && <OverviewComparison a={result} b={competitor} />}
          {activeTab === 'SEO'        && <SEOComparison a={result} b={competitor} />}
          {activeTab === 'Speed'      && <SpeedComparison a={result} b={competitor} />}
          {activeTab === 'Links'      && <LinksComparison a={result} b={competitor} />}
          {activeTab === 'Technical'  && <TechnicalComparison a={result} b={competitor} />}

          {/* Reset */}
          <button onClick={() => { setCompetitor(null); setUrl(''); }}
            style={{ marginTop: 16, width: '100%', padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}>
            Clear comparison
          </button>
        </div>
      )}
    </div>
  );
}
