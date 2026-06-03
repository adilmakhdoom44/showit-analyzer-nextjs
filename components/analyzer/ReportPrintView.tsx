'use client';

import { useEffect, useState } from 'react';
import type { AnalysisResult } from '@/types/analyzer';
import { getGrade, countIssues } from '@/lib/scoring';
import { getRelevantFixes } from '@/lib/fixes';

const RESULT_KEY = 'sac_last_result';

function score(n: number | undefined) { return Math.round((n ?? 0) * 100); }
function pill(v: number) {
  if (v >= 90) return { bg: '#d1fae5', color: '#065f46', label: 'Good' };
  if (v >= 50) return { bg: '#fef3c7', color: '#92400e', label: 'Needs Work' };
  return { bg: '#fee2e2', color: '#991b1b', label: 'Poor' };
}

export default function ReportPrintView() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RESULT_KEY);
      if (saved) setResult(JSON.parse(saved));
    } catch {}
  }, []);

  // Auto-print once data loads
  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => window.print(), 800);
    return () => clearTimeout(t);
  }, [result]);

  if (!result) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <p style={{ fontSize: 18, fontWeight: 600 }}>No report found</p>
        <p style={{ fontSize: 14, marginTop: 8 }}>Run an analysis first, then come back to print.</p>
        <a href="/" style={{ display: 'inline-block', marginTop: 20, padding: '10px 24px', background: '#6366f1', color: 'white', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
          ← Go analyze a site
        </a>
      </div>
    </div>
  );

  const audits = result.mobile.lighthouseResult?.audits ?? result.mobile.audits ?? {};
  const cats = result.mobile.lighthouseResult?.categories ?? result.mobile.categories;
  const { grade, color: gradeColor } = getGrade(cats, countIssues(audits));
  const pd = result.pageData;

  const perf  = score(cats?.performance?.score);
  const seo   = score(cats?.seo?.score);
  const a11y  = score(cats?.accessibility?.score);
  const bp    = score(cats?.['best-practices']?.score);

  // Core Web Vitals
  const lcp  = audits['largest-contentful-paint']?.displayValue ?? '—';
  const cls  = audits['cumulative-layout-shift']?.displayValue ?? '—';
  const tbt  = audits['total-blocking-time']?.displayValue ?? '—';
  const fcp  = audits['first-contentful-paint']?.displayValue ?? '—';
  const si   = audits['speed-index']?.displayValue ?? '—';
  const tti  = audits['interactive']?.displayValue ?? '—';

  // Failing audits
  const failing = Object.values(audits).filter(a =>
    a.score !== null && a.score !== undefined && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable'
  ).sort((a, b) => (a.score ?? 1) - (b.score ?? 1)).slice(0, 20);

  // Links
  const brokenLinks = (pd?.links ?? []).filter(l => !l.href || l.href === '#' || l.href === '' || l.isEmpty);
  const allLinks    = pd?.links ?? [];

  // Fixes
  const failedAuditIds = Object.entries(audits)
    .filter(([, a]) => a.score !== null && a.score !== undefined && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable')
    .map(([id]) => id);
  const fixes = getRelevantFixes(failedAuditIds);

  // Analytics
  const an = pd?.analytics;

  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: white; font-size: 13px; line-height: 1.5; }
        .page { max-width: 860px; margin: 0 auto; padding: 40px 40px 60px; }
        .section { margin-top: 36px; padding-top: 24px; border-top: 2px solid #e5e7eb; }
        .section-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 14px; display: flex; align-items: center; gap-8px; letter-spacing: -0.01em; }
        .section-title span { font-size: 11px; font-weight: 500; color: #6b7280; margin-left: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; }
        .card-score { text-align: center; padding: 16px 12px; }
        .big-number { font-size: 32px; font-weight: 800; line-height: 1; }
        .label-sm { font-size: 11px; color: #6b7280; margin-top: 4px; }
        .row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
        .row:last-child { border-bottom: none; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 600; }
        .pass { background: #d1fae5; color: #065f46; }
        .warn { background: #fef3c7; color: #92400e; }
        .fail { background: #fee2e2; color: #991b1b; }
        .tag  { background: #ede9fe; color: #5b21b6; }
        .fix-item { padding: 10px 14px; border-radius: 8px; background: #f9fafb; border: 1px solid #e5e7eb; margin-bottom: 8px; }
        .fix-title { font-weight: 600; font-size: 13px; color: #111; margin-bottom: 4px; }
        .fix-steps { padding-left: 16px; margin-top: 6px; }
        .fix-steps li { font-size: 12px; color: #374151; margin-bottom: 3px; }
        .no-print { }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .section { page-break-inside: avoid; }
          .fix-item { page-break-inside: avoid; }
        }
        @page { margin: 0.6in; size: A4; }
      `}</style>

      {/* Print Button — hidden on print */}
      <div className="no-print" style={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 8, zIndex: 100 }}>
        <button onClick={() => window.print()}
          style={{ padding: '8px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          🖨️ Print / Save PDF
        </button>
        <button onClick={() => window.close()}
          style={{ padding: '8px 16px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          ✕ Close
        </button>
      </div>

      <div className="page">

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 24, borderBottom: '3px solid #6366f1' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              Showit Site Analyzer — Full Report
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {(() => { try { return new URL(result.url).hostname; } catch { return result.url; } })()}
            </div>
            <a href={result.url} style={{ fontSize: 12, color: '#6366f1' }}>{result.url}</a>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>Generated {now} · showitanalyzer.com</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 24px', borderRadius: 12, border: '2px solid #e5e7eb', minWidth: 90 }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: gradeColor, lineHeight: 1 }}>{grade}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, fontWeight: 600 }}>Overall Grade</div>
          </div>
        </div>

        {/* ── SCORE SUMMARY ── */}
        <div className="grid-4">
          {[
            { label: 'Performance', value: perf },
            { label: 'SEO', value: seo },
            { label: 'Accessibility', value: a11y },
            { label: 'Best Practices', value: bp },
          ].map(s => {
            const p = pill(s.value);
            return (
              <div key={s.label} className="card card-score">
                <div className="big-number" style={{ color: p.color }}>{s.value}</div>
                <div className="label-sm">{s.label}</div>
                <div style={{ marginTop: 6 }}>
                  <span className="badge" style={{ background: p.bg, color: p.color }}>{p.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SEO ── */}
        <div className="section">
          <div className="section-title">SEO Analysis <span>on-page signals</span></div>
          <div className="grid-2">
            <div className="card">
              <div className="row"><span style={{ color: '#6b7280' }}>Page Title</span>
                <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right', fontSize: 11 }}>{pd?.title || <span className="badge fail">Missing</span>}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Title Length</span>
                <span>{pd?.title ? `${pd.title.length} chars ${pd.title.length >= 50 && pd.title.length <= 60 ? '✓' : '⚠'}` : '—'}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Meta Description</span>
                <span>{pd?.metaDesc ? <span className="badge pass">Present</span> : <span className="badge fail">Missing</span>}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Meta Desc Length</span>
                <span>{pd?.metaDesc ? `${pd.metaDesc.length} chars` : '—'}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Canonical URL</span>
                <span>{pd?.canonical ? <span className="badge pass">Set</span> : <span className="badge warn">Missing</span>}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Language</span>
                <span>{pd?.lang || <span className="badge warn">Not set</span>}</span>
              </div>
            </div>
            <div className="card">
              <div className="row"><span style={{ color: '#6b7280' }}>H1 Headings</span>
                <span>{(pd?.headings ?? []).filter(h => h.tag === 'H1').length} found</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Total Headings</span>
                <span>{(pd?.headings ?? []).length}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>OG Title</span>
                <span>{pd?.og?.title ? <span className="badge pass">Set</span> : <span className="badge warn">Missing</span>}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>OG Image</span>
                <span>{pd?.og?.image ? <span className="badge pass">Set</span> : <span className="badge warn">Missing</span>}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Schema Markup</span>
                <span>{(pd?.schema ?? 0) > 0 ? <span className="badge pass">{pd?.schema} found</span> : <span className="badge fail">None</span>}</span>
              </div>
              <div className="row"><span style={{ color: '#6b7280' }}>Word Count</span>
                <span>{pd?.wordCount ?? 0} words</span>
              </div>
            </div>
          </div>
          {(pd?.headings ?? []).length > 0 && (
            <div className="card" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8, color: '#374151' }}>Heading Structure</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {pd?.headings.slice(0, 12).map((h, i) => (
                  <span key={i} style={{ fontSize: 11, background: h.tag === 'H1' ? '#ede9fe' : '#f3f4f6', color: h.tag === 'H1' ? '#5b21b6' : '#374151', border: `1px solid ${h.tag === 'H1' ? '#c4b5fd' : '#e5e7eb'}`, borderRadius: 6, padding: '2px 8px' }}>
                    {h.tag}: {h.text.slice(0, 40)}{h.text.length > 40 ? '…' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SPEED ── */}
        <div className="section">
          <div className="section-title">Core Web Vitals & Speed <span>mobile scores</span></div>
          <div className="grid-3">
            {[
              { label: 'Largest Contentful Paint', value: lcp, id: 'largest-contentful-paint' },
              { label: 'Total Blocking Time', value: tbt, id: 'total-blocking-time' },
              { label: 'Cumulative Layout Shift', value: cls, id: 'cumulative-layout-shift' },
              { label: 'First Contentful Paint', value: fcp, id: 'first-contentful-paint' },
              { label: 'Speed Index', value: si, id: 'speed-index' },
              { label: 'Time to Interactive', value: tti, id: 'interactive' },
            ].map(m => {
              const s = audits[m.id]?.score ?? null;
              const p = s === null ? { bg: '#f3f4f6', color: '#374151' } : pill(Math.round(s * 100));
              return (
                <div key={m.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: p.color }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ISSUES ── */}
        {failing.length > 0 && (
          <div className="section">
            <div className="section-title">Failed Audits <span>{failing.length} issues found</span></div>
            <div className="grid-2">
              {failing.map((a, i) => {
                const s = a.score !== null ? Math.round((a.score ?? 0) * 100) : null;
                return (
                  <div key={i} className="row" style={{ padding: '8px 10px', background: i % 2 === 0 ? '#fafafa' : 'white', borderRadius: 6, border: 'none', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#374151', fontSize: 12 }}>{a.title}</span>
                    {s !== null && (
                      <span className="badge" style={s < 50 ? { background: '#fee2e2', color: '#991b1b' } : { background: '#fef3c7', color: '#92400e' }}>
                        {s}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LINKS ── */}
        <div className="section">
          <div className="section-title">Link Health <span>link audit</span></div>
          <div className="grid-3">
            <div className="card card-score">
              <div className="big-number" style={{ color: '#374151' }}>{allLinks.length}</div>
              <div className="label-sm">Total Links</div>
            </div>
            <div className="card card-score">
              <div className="big-number" style={{ color: brokenLinks.length > 0 ? '#991b1b' : '#065f46' }}>{brokenLinks.length}</div>
              <div className="label-sm">Broken / Empty</div>
            </div>
            <div className="card card-score">
              <div className="big-number" style={{ color: '#374151' }}>{allLinks.filter(l => l.href?.startsWith('http') && !l.href.includes((() => { try { return new URL(result.url).hostname; } catch { return ''; } })())).length}</div>
              <div className="label-sm">External Links</div>
            </div>
          </div>
          {brokenLinks.length > 0 && (
            <div className="card" style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8, color: '#991b1b' }}>Broken / Empty Links</div>
              {brokenLinks.slice(0, 10).map((l, i) => (
                <div key={i} className="row">
                  <span style={{ color: '#374151', fontSize: 11, maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.text || '(no text)'}</span>
                  <span style={{ color: '#9ca3af', fontSize: 11 }}>{l.href || 'empty href'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TECHNICAL ── */}
        <div className="section">
          <div className="section-title">Technical Audit <span>infrastructure checks</span></div>
          <div className="grid-2">
            <div className="card">
              {[
                { label: 'Google Analytics 4', ok: an?.ga4 },
                { label: 'Google Tag Manager', ok: an?.gtm },
                { label: 'Meta Pixel', ok: an?.metaPixel },
                { label: 'Hotjar', ok: an?.hotjar },
              ].map(r => (
                <div key={r.label} className="row">
                  <span style={{ color: '#6b7280' }}>{r.label}</span>
                  <span className={`badge ${r.ok ? 'pass' : 'fail'}`}>{r.ok ? 'Detected' : 'Not found'}</span>
                </div>
              ))}
            </div>
            <div className="card">
              {[
                { label: 'noindex Tag', ok: !pd?.hasNoIndex, reverse: true },
                { label: 'nofollow Tag', ok: !pd?.hasNoFollow, reverse: true },
                { label: 'Privacy Policy Link', ok: pd?.privacyLink },
                { label: 'Terms of Service Link', ok: pd?.termsLink },
              ].map(r => (
                <div key={r.label} className="row">
                  <span style={{ color: '#6b7280' }}>{r.label}</span>
                  <span className={`badge ${r.ok ? 'pass' : 'warn'}`}>{r.ok ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRIORITY FIXES ── */}
        {fixes.length > 0 && (
          <div className="section">
            <div className="section-title">Priority Fixes <span>ranked by impact</span></div>
            {fixes.slice(0, 8).map((fix, i) => (
              <div key={i} className="fix-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="fix-title">{fix.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge tag">{fix.difficulty}</span>
                    <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>⏱ {fix.time}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{fix.impact}</div>
                <ol className="fix-steps">
                  {fix.steps.slice(0, 3).map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
          <span>Generated by Showit Site Analyzer · showitanalyzer.com</span>
          <span>{result.url}</span>
        </div>

      </div>
    </>
  );
}
