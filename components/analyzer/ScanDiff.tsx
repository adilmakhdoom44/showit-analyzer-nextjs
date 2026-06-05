'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detailedDiff } from 'deep-object-diff';
import type { ScoreEntry } from '@/lib/storage';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw } from 'lucide-react';

interface Props {
  history: ScoreEntry[];
}

function DiffRow({ label, before, after }: { label: string; before?: number; after?: number }) {
  if (before === undefined || after === undefined) return null;
  const delta = after - before;
  if (delta === 0) return null;
  const color = delta > 0 ? '#10b981' : '#ef4444';
  const arrow = delta > 0 ? '↑' : '↓';
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg"
      style={{ background: delta > 0 ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${color}20` }}>
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="text-slate-500">{before}</span>
        <span style={{ color }}>{arrow} {after} <span className="text-xs opacity-70">({delta > 0 ? '+' : ''}{delta})</span></span>
      </div>
    </div>
  );
}

export default function ScanDiff({ history }: Props) {
  const [scanA, setScanA] = useState(1); // index into history (0 = latest)
  const [scanB, setScanB] = useState(0);

  if (history.length < 2) return null;

  const entryA = history[scanA];
  const entryB = history[scanB];
  if (!entryA || !entryB || scanA === scanB) return null;

  // Use deep-object-diff to find changed fields
  const diff = detailedDiff(entryA, entryB) as { updated: Partial<ScoreEntry> };
  const hasChanges = Object.keys(diff.updated ?? {}).length > 0;

  const metrics = [
    { label: 'Avg Score', key: 'score' as keyof ScoreEntry },
    { label: 'Performance', key: 'perf' as keyof ScoreEntry },
    { label: 'SEO', key: 'seo' as keyof ScoreEntry },
    { label: 'Accessibility', key: 'a11y' as keyof ScoreEntry },
    { label: 'Best Practices', key: 'bp' as keyof ScoreEntry },
  ];

  const issuesDelta = (entryB.issues ?? 0) - (entryA.issues ?? 0);

  return (
    <Card className="glass border-0">
      <CardHeader>
        <CardTitle className="text-white text-base flex items-center gap-2"><RefreshCw size={16} style={{ color: '#6366f1' }} /> Scan Comparison</CardTitle>
        <p className="text-xs text-slate-500 mt-1">Compare any two scans to see exactly what changed</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scan selectors */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Compare from (older)', val: scanA, set: setScanA },
            { label: 'Compare to (newer)', val: scanB, set: setScanB },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <select
                value={val}
                onChange={e => set(Number(e.target.value))}
                className="w-full rounded-xl text-sm text-slate-300 px-3 py-2 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {history.map((h, i) => (
                  <option key={i} value={i} style={{ background: '#0d1117' }}>
                    {h.date} {h.time} - {h.score}/100 (Grade {h.grade})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Grade change */}
        {entryA.grade !== entryB.grade && (
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span className="text-2xl font-black text-slate-400">{entryA.grade}</span>
            <span className="text-slate-600">→</span>
            <span className="text-2xl font-black text-indigo-400">{entryB.grade}</span>
            <span className="text-sm text-slate-400 ml-1">Grade changed</span>
          </div>
        )}

        {/* Score diffs */}
        <div className="space-y-2">
          {metrics.map(m => (
            <DiffRow key={m.key} label={m.label}
              before={entryA[m.key] as number | undefined}
              after={entryB[m.key] as number | undefined} />
          ))}
        </div>

        {/* Issues delta */}
        {entryA.issues !== undefined && entryB.issues !== undefined && (
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{
              background: issuesDelta < 0 ? 'rgba(16,185,129,0.06)' : issuesDelta > 0 ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${issuesDelta < 0 ? 'rgba(16,185,129,0.2)' : issuesDelta > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <span className="text-sm text-slate-400">Issues Found</span>
            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="text-slate-500">{entryA.issues}</span>
              <span style={{ color: issuesDelta < 0 ? '#10b981' : issuesDelta > 0 ? '#ef4444' : '#64748b' }}>
                → {entryB.issues}
                {issuesDelta !== 0 && (
                  <span className="text-xs ml-1 opacity-70">
                    ({issuesDelta > 0 ? '+' : ''}{issuesDelta} issues)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* No changes */}
        {!hasChanges && (
          <p className="text-xs text-slate-500 text-center py-2">No score changes detected between these scans.</p>
        )}

        {/* Time between scans */}
        <div className="text-center text-xs text-slate-600 pt-1">
          {entryA.date} {entryA.time} → {entryB.date} {entryB.time}
        </div>
      </CardContent>
    </Card>
  );
}
