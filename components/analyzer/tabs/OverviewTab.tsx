'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ScoreGauge from '../ScoreGauge';
import { getGrade, sClass, countIssues } from '@/lib/scoring';
import { getRelevantFixes, getFallbackFix } from '@/lib/fixes';
import { toggleFixProgress, getFixProgress, getScoreHistory, deleteScoreHistoryEntry } from '@/lib/storage';
import { getPassingChecks } from '@/lib/analysis-helpers';
import type { AnalysisResult, FixItem } from '@/types/analyzer';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Zap, MonitorSmartphone, AlertTriangle, Wrench } from 'lucide-react';

interface ContrastItem {
  nodeLabel?: string;
  snippet?: string;
  subItems?: { items?: Array<{ type: string; value?: string }> };
  node?: { nodeLabel?: string; snippet?: string };
  contrastRatio?: number;
  textColor?: string;
  backgroundColor?: string;
}

function ContrastSamples({ items }: { items: ContrastItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Failing elements on your page:</p>
      {items.slice(0, 6).map((item, i) => {
        const label = item.node?.nodeLabel ?? item.nodeLabel ?? '';
        const snippet = item.node?.snippet ?? item.snippet ?? '';
        const fg = item.textColor ?? '';
        const bg = item.backgroundColor ?? '';
        const ratio = item.contrastRatio;
        return (
          <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            {/* Color swatch preview */}
            {fg && bg && (
              <div className="flex items-stretch">
                <div className="w-2 flex-shrink-0" style={{ background: bg }} />
                <div className="flex-1 px-3 py-2 flex items-center justify-between gap-2"
                  style={{ background: bg }}>
                  <span className="text-sm font-medium truncate" style={{ color: fg }}>
                    {label || 'Text element'}
                  </span>
                  {ratio && (
                    <span className="text-xs flex-shrink-0 px-1.5 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(0,0,0,0.4)', color: '#ef4444' }}>
                      {ratio.toFixed(1)}:1
                    </span>
                  )}
                </div>
              </div>
            )}
            {/* Fallback: just label */}
            {(!fg || !bg) && (
              <div className="px-3 py-2 flex items-center gap-2">
                <span className="text-red-400 text-xs">⚠</span>
                <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{label || snippet || 'Unknown element'}</span>
              </div>
            )}
            {/* Color values */}
            {(fg || bg) && (
              <div className="px-3 py-1.5 flex gap-3 text-xs"
                style={{ background: 'rgba(239,68,68,0.06)', borderTop: '1px solid rgba(239,68,68,0.1)' }}>
                {fg && <span style={{ color: 'var(--text-muted)' }}>Text: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{fg}</span></span>}
                {bg && <span style={{ color: 'var(--text-muted)' }}>BG: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{bg}</span></span>}
              </div>
            )}
          </div>
        );
      })}
      <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1">
        🔗 Open WebAIM Contrast Checker →
      </a>
    </div>
  );
}

function FixCard({ fix, done, onToggle, auditItems }: { fix: FixItem; done: boolean; onToggle: () => void; auditItems?: ContrastItem[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`rounded-xl transition-all overflow-hidden ${done ? 'opacity-50' : ''}`}
      style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
      <div className="flex gap-4 p-4 cursor-pointer select-none" onClick={() => setExpanded(v => !v)}>
        <div className="text-2xl flex-shrink-0">{fix.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-sm" style={{ color: done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: done ? 'line-through' : 'none' }}>{fix.name}</span>
            <Badge variant="secondary" className="text-xs capitalize">{fix.difficulty}</Badge>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⏱ {fix.time}</span>
          </div>
          <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{fix.impact}</p>
        </div>
        <div className="flex items-start gap-2 flex-shrink-0 mt-0.5">
          <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{expanded ? '▲' : '▼'}</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all
              ${done ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 hover:border-indigo-400'}`}
            onClick={e => { e.stopPropagation(); onToggle(); }}>
            {done && <span className="text-white text-xs font-bold">✓</span>}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          <div className="mt-3 space-y-2">
            {fix.steps.map((step, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mt-0.5"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{i + 1}</span>
                <span style={{ color: 'var(--text-primary)' }}>{step}</span>
              </div>
            ))}
            {fix.tip && (
              <div className="mt-3 flex gap-2 p-3 rounded-lg text-xs"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                <span style={{ color: '#0891b2' }}>💡</span>
                <span style={{ color: '#0891b2' }}>{fix.tip}</span>
              </div>
            )}
            {/* Color contrast failing elements */}
            {fix.id === 'color-contrast' && auditItems && auditItems.length > 0 && (
              <ContrastSamples items={auditItems} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value, ok }: { label: string; value: string | number; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg text-xs"
      style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className={ok === undefined ? '' : ok ? 'text-green-400' : 'text-amber-400'} style={{ fontWeight: 600, color: ok === undefined ? 'var(--text-primary)' : undefined }}>{value}</span>
    </div>
  );
}

const AUDIT_TAB_MAP: Record<string, string> = {
  // Speed
  'speed-index': 'speed', 'interactive': 'speed', 'total-blocking-time': 'speed',
  'first-contentful-paint': 'speed', 'largest-contentful-paint': 'speed',
  'cumulative-layout-shift': 'speed', 'render-blocking-resources': 'speed',
  'unused-javascript': 'speed', 'unused-css-rules': 'speed',
  'uses-optimized-images': 'speed', 'uses-webp-images': 'speed',
  'uses-long-cache-ttl': 'speed', 'server-response-time': 'speed',
  'mainthread-work-breakdown': 'speed', 'bootup-time': 'speed',
  'font-display': 'speed', 'critical-request-chains': 'speed',
  'network-requests': 'speed', 'network-rtt': 'speed',
  'network-server-latency': 'speed', 'uses-rel-preload': 'speed',
  'uses-rel-preconnect': 'speed', 'efficient-animated-content': 'speed',
  'uses-text-compression': 'speed', 'uses-responsive-images': 'speed',
  'offscreen-images': 'speed', 'lcp-lazy-loaded': 'speed',
  // SEO
  'meta-description': 'seo', 'document-title': 'seo', 'viewport': 'seo',
  'canonical': 'seo', 'robots-txt': 'seo', 'hreflang': 'seo',
  'link-text': 'seo', 'is-crawlable': 'seo', 'structured-data': 'seo',
  'plugins': 'seo', 'image-alt': 'seo', 'crawlable-anchors': 'seo',
  // Technical / Accessibility
  'color-contrast': 'technical', 'tap-targets': 'technical',
  'heading-order': 'technical', 'duplicate-id-active': 'technical',
  'label': 'technical', 'bypass': 'technical', 'tabindex': 'technical',
  'accesskeys': 'technical', 'valid-lang': 'technical',
  'html-has-lang': 'technical', 'html-lang-valid': 'technical',
  'frame-title': 'technical',
  // Links
  'links-crawlable': 'links',
};

function auditTab(id: string): string {
  return AUDIT_TAB_MAP[id] ?? 'technical';
}

export default function OverviewTab({ result, onNavigateToTab }: { result: AnalysisResult; onNavigateToTab?: (tab: string) => void }) {
  const { mobile, desktop, url, pageData } = result;
  const audits = mobile.lighthouseResult?.audits ?? mobile.audits ?? {};
  const categories = mobile.lighthouseResult?.categories ?? mobile.categories;
  const issueCount = countIssues(audits);
  const { grade, color } = getGrade(categories, issueCount);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState(() => getScoreHistory(url));
  const [fixListRef] = useAutoAnimate<HTMLDivElement>();
  const [expandedIssues, setExpandedIssues] = useState<number | null>(null);

  const handleDeleteHistory = (index: number) => {
    deleteScoreHistoryEntry(url, index);
    setHistory(getScoreHistory(url));
    setExpandedIssues(null);
  };

  useEffect(() => { setProgress(getFixProgress(url)); }, [url]);

  const failedAudits = Object.values(audits).filter(a => a.score !== null && a.score < 0.9);
  const failedAuditIds = failedAudits.map(a => a.id);
  const libraryFixes = getRelevantFixes(failedAuditIds);
  const libraryIds = new Set(libraryFixes.map(f => f.id));
  const fallbackFixes = failedAudits
    .filter(a => !libraryIds.has(a.id) && a.title)
    .map(a => getFallbackFix(a.id, a.title!, a.description));
  const fixes = [...libraryFixes, ...fallbackFixes].slice(0, 12);
  const completedCount = fixes.filter(f => progress[f.id]).length;

  // Extract color-contrast failing elements from PSI audit details
  const contrastAudit = audits['color-contrast'];
  const contrastItems: ContrastItem[] = (contrastAudit?.details?.items ?? []).map((item: Record<string, unknown>) => ({
    nodeLabel: (item.node as Record<string, unknown>)?.nodeLabel as string ?? item.nodeLabel as string ?? '',
    snippet: (item.node as Record<string, unknown>)?.snippet as string ?? item.snippet as string ?? '',
    node: item.node as ContrastItem['node'],
    contrastRatio: item.contrastRatio as number,
    textColor: item.textColor as string,
    backgroundColor: item.backgroundColor as string,
  }));
  const desktopCats = desktop.lighthouseResult?.categories ?? desktop.categories;
  const passing = getPassingChecks(result.pageData, mobile);

  const scores = [
    { label: 'Performance', mob: categories?.performance?.score ?? null, dsk: desktopCats?.performance?.score ?? null },
    { label: 'SEO', mob: categories?.seo?.score ?? null, dsk: desktopCats?.seo?.score ?? null },
    { label: 'Accessibility', mob: categories?.accessibility?.score ?? null, dsk: desktopCats?.accessibility?.score ?? null },
    { label: 'Best Practices', mob: categories?.['best-practices']?.score ?? null, dsk: desktopCats?.['best-practices']?.score ?? null },
  ];

  const avgScore = Math.round(scores.reduce((a, s) => a + (s.mob ?? 0), 0) / scores.length * 100);

  // Page details
  let domain = url;
  try { domain = new URL(url).hostname; } catch {}

  const titleLen = pageData?.title?.length ?? 0;
  const descLen = pageData?.metaDesc?.length ?? 0;
  const h1Count = pageData?.headings?.filter(h => h.tag === 'H1').length ?? 0;
  const imageCount = pageData?.images?.length ?? 0;
  const missingAltCount = pageData?.images?.filter(i => !i.hasAlt).length ?? 0;
  const mobPerf = Math.round((categories?.performance?.score ?? 0) * 100);
  const dskPerf = Math.round((desktopCats?.performance?.score ?? 0) * 100);
  const lcpMs = (audits['largest-contentful-paint']?.numericValue ?? 0);
  const lcpSec = lcpMs > 0 ? (lcpMs / 1000).toFixed(1) + 's' : 'N/A';

  // Platform detection
  const bodyText = pageData?.bodyText ?? '';
  let platform = 'Unknown';
  if (/showit/i.test(bodyText)) platform = 'Showit';
  else if (/wp-content|wordpress/i.test(bodyText)) platform = 'WordPress';
  else if (/squarespace/i.test(bodyText)) platform = 'Squarespace';
  else if (/wixsite|wix\.com/i.test(bodyText)) platform = 'Wix';
  else if (/shopify/i.test(bodyText)) platform = 'Shopify';
  else if (/webflow/i.test(bodyText)) platform = 'Webflow';

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {/* Grade card */}
      <Card className="glass border-0">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
            <motion.div className="text-8xl font-black" style={{ color }} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}>{grade}</motion.div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Overall Grade</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Avg score: {avgScore}/100</div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Site Health Overview</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Based on {issueCount} issues across performance, SEO, and accessibility.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {scores.map(s => (
                <div key={s.label} className="text-center">
                  <ScoreGauge score={s.mob} label={s.label} size={72} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Details Snapshot */}
      <Card className="glass border-0">
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">🌐 Page Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <StatPill label="Domain" value={domain} />
            <StatPill label="Platform" value={platform} />
            <StatPill label="Language" value={pageData?.lang || 'Not set'} ok={!!pageData?.lang} />
            <StatPill label="HTTPS" value={audits['is-on-https']?.score === 1 ? 'Secure ✓' : 'Not secure ✗'} ok={audits['is-on-https']?.score === 1} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <StatPill label="Page Title" value={titleLen > 0 ? `${titleLen} chars ${titleLen >= 50 && titleLen <= 60 ? '✓' : '⚠️'}` : 'Missing ✗'} ok={titleLen >= 50 && titleLen <= 60} />
            <StatPill label="Meta Description" value={descLen > 0 ? `${descLen} chars ${descLen >= 150 && descLen <= 160 ? '✓' : '⚠️'}` : 'Missing ✗'} ok={descLen >= 150 && descLen <= 160} />
            <StatPill label="H1 Heading" value={h1Count === 1 ? '1 ✓ Good' : h1Count === 0 ? 'Missing ✗' : `${h1Count} (only 1 needed) ⚠️`} ok={h1Count === 1} />
            <StatPill label="Word Count" value={`${pageData?.wordCount ?? 0} words ${(pageData?.wordCount ?? 0) >= 300 ? '✓' : '(aim 300+)'}`} ok={(pageData?.wordCount ?? 0) >= 300} />
            <StatPill label="Images" value={`${imageCount} total, ${missingAltCount} missing alt`} ok={missingAltCount === 0} />
            <StatPill label="Schema Markup" value={(pageData?.schema ?? 0) > 0 ? `${pageData?.schema} type(s) ✓` : 'None found ✗'} ok={(pageData?.schema ?? 0) > 0} />
            <StatPill label="Canonical URL" value={pageData?.canonical ? 'Set ✓' : 'Missing ✗'} ok={!!pageData?.canonical} />
            <StatPill label="Indexable" value={pageData?.hasNoIndex ? 'Blocked ✗' : 'Yes ✓'} ok={!pageData?.hasNoIndex} />
          </div>
        </CardContent>
      </Card>

      {/* Performance Snapshot */}
      <Card className="glass border-0">
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base"><Zap size={16} className="inline mr-1.5" /> Performance Snapshot</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { label: 'Mobile Speed', value: mobPerf, unit: '/100', color: mobPerf >= 90 ? '#10b981' : mobPerf >= 50 ? '#f59e0b' : '#ef4444' },
              { label: 'Desktop Speed', value: dskPerf, unit: '/100', color: dskPerf >= 90 ? '#10b981' : dskPerf >= 50 ? '#f59e0b' : '#ef4444' },
              { label: 'LCP (Mobile)', value: lcpSec, unit: '', color: lcpMs <= 2500 ? '#10b981' : lcpMs <= 4000 ? '#f59e0b' : '#ef4444' },
              { label: 'Issues Found', value: issueCount, unit: '', color: issueCount === 0 ? '#10b981' : issueCount < 10 ? '#f59e0b' : '#ef4444' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
                <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}{s.unit}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score History */}
      {history.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">📈 Score History</CardTitle>
              {history.length > 1 && (
                <span className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    background: history[0].score > (history[1]?.score ?? 0)
                      ? 'rgba(16,185,129,0.15)' : history[0].score < (history[1]?.score ?? 0)
                      ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                    color: history[0].score > (history[1]?.score ?? 0)
                      ? '#10b981' : history[0].score < (history[1]?.score ?? 0)
                      ? '#ef4444' : '#a5b4fc',
                  }}>
                  {history[0].score > (history[1]?.score ?? 0)
                    ? `📈 +${history[0].score - history[1].score} pts since last scan`
                    : history[0].score < (history[1]?.score ?? 0)
                    ? `📉 ${history[0].score - history[1].score} pts since last scan`
                    : '➡️ No change since last scan'}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Recharts area chart */}
            {history.length > 1 && (() => {
              const chartData = history.slice(0, 10).reverse().map(h => ({
                label: h.date.split('/').slice(0, 2).join('/'),
                score: h.score,
                perf: h.perf,
                seo: h.seo,
              }));
              return (
                <div className="mb-4">
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: '#0d1117', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: '#94a3b8' }}
                        itemStyle={{ color: '#a5b4fc' }}
                      />
                      <Area type="monotone" dataKey="score" name="Avg Score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGrad)" dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    <span>Oldest</span>
                    <span>{history.length} scan{history.length > 1 ? 's' : ''} recorded</span>
                    <span>Latest</span>
                  </div>
                </div>
              );
            })()}

            {/* Scan log */}
            <div className="space-y-2">
              {history.slice(0, 5).map((h, i) => {
                const prev = history[i + 1];
                const delta = prev ? h.score - prev.score : null;
                const gradeColor = h.grade === 'A' || h.grade === 'A+' ? '#10b981'
                  : h.grade === 'B' ? '#34d399'
                  : h.grade === 'C' ? '#f59e0b'
                  : '#ef4444';
                return (
                  <div key={i} className="p-3 rounded-xl"
                    style={{
                      background: i === 0 ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    }}>
                    <div className="flex items-center gap-3">
                      {/* Grade badge */}
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0"
                        style={{ background: `${gradeColor}20`, color: gradeColor, border: `1px solid ${gradeColor}40` }}>
                        {h.grade}
                      </div>

                      {/* Date + time */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{h.date}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{h.time} {i === 0 && <span className="text-indigo-400 ml-1">• latest</span>}</div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteHistory(i)}
                        title="Remove this scan"
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-500/20"
                        style={{ color: 'var(--text-muted)', border: '1px solid var(--border-card)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                      >
                        ×
                      </button>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-black" style={{ color: gradeColor }}>{h.score}<span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/100</span></div>
                        {delta !== null && (
                          <div className="text-xs font-medium" style={{ color: delta > 0 ? '#10b981' : delta < 0 ? '#ef4444' : '#64748b' }}>
                            {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : '→ 0'}
                          </div>
                        )}
                        {/* Issues delta - clickable */}
                        {h.issues !== undefined && prev?.issues !== undefined && h.issues !== prev.issues && (
                          <button
                            onClick={() => setExpandedIssues(expandedIssues === i ? null : i)}
                            className="text-xs font-bold px-1.5 py-0.5 rounded mt-0.5 cursor-pointer transition-colors"
                            style={{
                              background: h.issues > prev.issues ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                              color: h.issues > prev.issues ? '#ef4444' : '#10b981',
                              border: `1px solid ${h.issues > prev.issues ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                            }}>
                            {h.issues > prev.issues ? `+${h.issues - prev.issues} issues ▾` : `${h.issues - prev.issues} issues ▾`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sub-scores */}
                    {(h.perf !== undefined || h.seo !== undefined) && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { label: 'Perf', val: h.perf },
                            { label: 'SEO', val: h.seo },
                            { label: 'A11y', val: h.a11y },
                            { label: 'BP', val: h.bp },
                          ].map(s => (
                            <div key={s.label} className="text-center rounded-lg py-2" style={{ background: 'var(--bg-card)' }}>
                              <div className="text-xl font-black" style={{ color: s.val === undefined ? 'var(--text-muted)' : (s.val >= 90 ? '#10b981' : s.val >= 50 ? '#f59e0b' : '#ef4444') }}>
                                {s.val ?? 'N/A'}
                              </div>
                              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                        {h.issues !== undefined && (
                          <div className="mt-2">
                            <button
                              onClick={() => setExpandedIssues(expandedIssues === i ? null : i)}
                              className="w-full text-center text-xs rounded-lg px-2 py-1.5 transition-colors"
                              style={{
                                background: expandedIssues === i ? 'rgba(99,102,241,0.12)' : 'var(--bg-sidebar)',
                                color: expandedIssues === i ? '#a5b4fc' : 'var(--text-muted)',
                                border: `1px solid ${expandedIssues === i ? 'rgba(99,102,241,0.25)' : 'var(--border-card)'}`,
                              }}>
                              {h.issues} issues found {expandedIssues === i ? '▴ hide' : '▾ tap to see'}
                            </button>
                            {/* Expanded: show current failing audits for latest scan, or delta info */}
                            {expandedIssues === i && (
                              <div className="mt-2 space-y-1">
                                {i === 0 ? (
                                  // Latest scan - show actual current failing audits
                                  <>
                                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Current failing audits:</p>
                                    {failedAuditIds.slice(0, 10).map(id => {
                                      const a = audits[id];
                                      return (
                                        <div key={id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                                          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                                          <span className="text-red-400 flex-shrink-0">✗</span>
                                          <span className="flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{a?.title ?? id}</span>
                                          {a?.score !== null && a?.score !== undefined && (
                                            <span className="text-red-400 font-bold flex-shrink-0">{Math.round(a.score * 100)}</span>
                                          )}
                                        </div>
                                      );
                                    })}
                                    {failedAuditIds.length > 10 && (
                                      <p className="text-xs text-center pt-1" style={{ color: 'var(--text-muted)' }}>+ {failedAuditIds.length - 10} more - check other tabs</p>
                                    )}
                                  </>
                                ) : (
                                  // Older scan - show the count + delta vs next scan
                                  <div className="px-2 py-2 rounded-lg text-xs"
                                    style={{ color: 'var(--text-secondary)', background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
                                    {h.issues} issues were found on this scan.
                                    {prev?.issues !== undefined && (
                                      <span className="ml-1" style={{ color: h.issues > prev.issues ? '#ef4444' : '#10b981' }}>
                                        ({h.issues > prev.issues ? `+${h.issues - prev.issues} more` : `${h.issues - prev.issues} fewer`} vs previous scan)
                                      </span>
                                    )}
                                    <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Re-analyze to see the full breakdown for today.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {history.length > 5 && (
                <div className="text-xs text-center pt-1" style={{ color: 'var(--text-muted)' }}>+ {history.length - 5} older scans stored</div>
              )}
            </div>

            {history.length === 1 && (
              <div className="mt-3 p-3 rounded-lg text-xs text-center"
                style={{ color: 'var(--text-muted)', background: 'var(--bg-sidebar)', border: '1px dashed var(--border-card)' }}>
                💡 Re-analyze this site after making improvements to track your progress over time.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile vs Desktop comparison */}
      <Card className="glass border-0">
        <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base"><MonitorSmartphone size={16} className="inline mr-1.5" /> Mobile vs Desktop</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left pb-3">Category</th>
                  <th className="text-center pb-3">📱 Mobile</th>
                  <th className="text-center pb-3">🖥️ Desktop</th>
                  <th className="text-center pb-3">Gap</th>
                </tr>
              </thead>
              <tbody>
                {scores.map(s => {
                  const mob = Math.round((s.mob ?? 0) * 100);
                  const dsk = Math.round((s.dsk ?? 0) * 100);
                  const gap = dsk - mob;
                  return (
                    <tr key={s.label} className="border-t border-white/5">
                      <td className="py-3" style={{ color: 'var(--text-primary)' }}>{s.label}</td>
                      <td className="py-3 text-center">
                        <span className={`font-bold score-${sClass(s.mob)}`}>{mob}</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`font-bold score-${sClass(s.dsk)}`}>{dsk}</span>
                        <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>/ 100</span>
                      </td>
                      <td className="py-3 text-center text-xs">
                        <span style={{ color: gap > 10 ? '#f59e0b' : gap > 0 ? '#94a3b8' : '#10b981' }}>
                          {gap > 0 ? `+${gap}` : gap === 0 ? 'N/A' : gap} desktop
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(desktopCats?.performance?.score ?? 0) - (categories?.performance?.score ?? 0) > 0.2 && (
            <div className="mt-3 p-3 rounded-lg text-xs text-amber-300"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚠️ Your mobile performance is significantly lower than desktop. Most Google searches are on mobile - prioritize mobile speed improvements.
            </div>
          )}
        </CardContent>
      </Card>

      {/* What's Working */}
      {passing.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle style={{ color: 'var(--text-primary)' }} className="text-base">✅ What&apos;s Working</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {passing.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg"
                  style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <span>{p.icon}</span>
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                  <span className="ml-auto text-green-400 text-xs font-bold">✓</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* What's Not Working */}
      {failedAuditIds.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <AlertTriangle size={16} className="inline mr-1.5 text-amber-500" /> What&apos;s Not Working
              <Badge variant="destructive">{failedAuditIds.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {failedAuditIds.slice(0, 12).map((id, i) => {
                const audit = audits[id];
                const tab = auditTab(id);
                const clickable = !!onNavigateToTab;
                return (
                  <div key={i}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs transition-all"
                    style={{
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.08)',
                      cursor: clickable ? 'pointer' : 'default',
                    }}
                    onClick={() => onNavigateToTab?.(tab)}
                    onMouseEnter={e => { if (clickable) { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.14)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'; }}}
                    onMouseLeave={e => { if (clickable) { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.08)'; }}}
                    title={clickable ? `View in ${tab} tab →` : undefined}
                  >
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{audit?.title ?? id}</span>
                    {audit?.score !== null && audit?.score !== undefined && (
                      <span className="text-red-400 font-bold ml-auto flex-shrink-0">{Math.round((audit.score) * 100)}</span>
                    )}
                    {clickable && <span className="flex-shrink-0 ml-1" style={{ color: 'var(--text-muted)' }}>→</span>}
                  </div>
                );
              })}
            </div>
            {failedAuditIds.length > 12 && (
              <div className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>+ {failedAuditIds.length - 12} more issues - see tabs for details</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Priority Fixes */}
      {fixes.length > 0 ? (
        <Card className="glass border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base"><Wrench size={16} className="inline mr-1.5" /> Priority Fixes</CardTitle>
              {completedCount > 0 && (
                <span className="text-xs text-indigo-400 font-medium">{completedCount} / {fixes.length} done ✓</span>
              )}
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Click a card to see step-by-step instructions. Check the box when done.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div ref={fixListRef} className="space-y-3">
            {fixes.map(fix => (
              <FixCard key={fix.id} fix={fix} done={!!progress[fix.id]}
                auditItems={fix.id === 'color-contrast' ? contrastItems : undefined}
                onToggle={() => { toggleFixProgress(url, fix.id); setProgress(getFixProgress(url)); }} />
            ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass border-0">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No Major Issues Found</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>This site is performing well across all key metrics!</div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
