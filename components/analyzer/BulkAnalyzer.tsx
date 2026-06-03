'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';

interface BulkResult {
  url: string;
  status: 'ok' | 'error' | 'pending';
  perf?: number;
  seo?: number;
  a11y?: number;
  bp?: number;
  issues?: number;
  error?: string;
}

function ScoreBadge({ val }: { val?: number }) {
  if (val === undefined) return <span className="text-slate-600 text-xs">N/A</span>;
  const color = val >= 90 ? '#10b981' : val >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ color, background: `${color}18` }}>
      {val}
    </span>
  );
}

export default function BulkAnalyzer() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState<BulkResult[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const urlList = urls.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 3);
  const capped = urlList.slice(0, 20);

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<string[]>(file, {
      complete(res) {
        const flat = res.data.flat().map(v => v.trim()).filter(v => v.includes('.'));
        setUrls(flat.slice(0, 20).join('\n'));
      },
    });
  };

  const run = async () => {
    if (!capped.length) return;
    setRunning(true);
    setDone(false);
    setResults(capped.map(url => ({ url, status: 'pending' })));

    try {
      const res = await fetch('/api/bulk-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: capped }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults(capped.map(url => ({ url, status: 'error', error: 'Request failed' })));
    } finally {
      setRunning(false);
      setDone(true);
    }
  };

  const exportCSV = () => {
    const rows = results.filter(r => r.status === 'ok');
    const csv = Papa.unparse({
      fields: ['url', 'perf', 'seo', 'a11y', 'bp', 'issues'],
      data: rows.map(r => [r.url, r.perf ?? '', r.seo ?? '', r.a11y ?? '', r.bp ?? '', r.issues ?? '']),
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bulk-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <Card className="glass border-0">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-white text-base">⚡ Bulk URL Analyzer</CardTitle>
          <span className="text-xs text-slate-500">Up to 20 URLs at once · Free · No signup</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Paste URLs (one per line) or upload a CSV</span>
            <div className="flex gap-2">
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
              <button onClick={() => fileRef.current?.click()}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
                📂 Import CSV
              </button>
              {urls && (
                <button onClick={() => { setUrls(''); setResults([]); setDone(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={urls}
            onChange={e => { setUrls(e.target.value); setResults([]); setDone(false); }}
            placeholder={'https://yoursite.com\nhttps://client1.com\nhttps://client2.com'}
            rows={5}
            className="w-full rounded-xl text-sm text-slate-300 placeholder:text-slate-600 resize-none outline-none focus:ring-1 focus:ring-indigo-500/50 p-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          {urlList.length > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              {capped.length} URL{capped.length !== 1 ? 's' : ''} queued
              {urlList.length > 20 && <span className="text-amber-400 ml-1"> (first 20 only)</span>}
            </p>
          )}
        </div>

        {/* Run button */}
        <Button
          onClick={run}
          disabled={running || capped.length === 0}
          className="w-full font-semibold text-white"
          style={{ background: running ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
          {running ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing {capped.length} sites… (takes ~{Math.ceil(capped.length * 8)}s)
            </span>
          ) : `🚀 Analyze ${capped.length || ''} Sites`}
        </Button>

        {/* Results table */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{done ? 'Results' : 'Running…'}</span>
                {done && results.some(r => r.status === 'ok') && (
                  <button onClick={exportCSV}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                    📥 Export CSV
                  </button>
                )}
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Table header */}
                <div className="grid text-xs font-medium text-slate-500 px-3 py-2"
                  style={{ gridTemplateColumns: '1fr 52px 52px 52px 52px 52px', background: 'rgba(255,255,255,0.03)' }}>
                  <span>URL</span>
                  <span className="text-center">Perf</span>
                  <span className="text-center">SEO</span>
                  <span className="text-center">A11y</span>
                  <span className="text-center">BP</span>
                  <span className="text-center">Issues</span>
                </div>

                {results.map((r, i) => (
                  <motion.div key={r.url}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="grid items-center px-3 py-2.5 text-xs"
                    style={{
                      gridTemplateColumns: '1fr 52px 52px 52px 52px 52px',
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    }}>
                    <div className="min-w-0 pr-2">
                      <div className="truncate text-slate-300">{r.url.replace(/^https?:\/\//, '')}</div>
                      {r.status === 'error' && <div className="text-red-400 text-xs truncate">{r.error}</div>}
                    </div>
                    {r.status === 'pending' ? (
                      <div className="col-span-5 flex items-center justify-center">
                        <span className="w-3 h-3 border border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />
                      </div>
                    ) : r.status === 'error' ? (
                      <div className="col-span-5 text-center text-red-400">failed</div>
                    ) : (
                      <>
                        <div className="text-center"><ScoreBadge val={r.perf} /></div>
                        <div className="text-center"><ScoreBadge val={r.seo} /></div>
                        <div className="text-center"><ScoreBadge val={r.a11y} /></div>
                        <div className="text-center"><ScoreBadge val={r.bp} /></div>
                        <div className="text-center">
                          <span className="text-xs" style={{ color: (r.issues ?? 0) > 20 ? '#ef4444' : (r.issues ?? 0) > 10 ? '#f59e0b' : '#10b981' }}>
                            {r.issues ?? 0}
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Summary row */}
              {done && results.filter(r => r.status === 'ok').length > 1 && (() => {
                const ok = results.filter(r => r.status === 'ok');
                const avg = (key: keyof BulkResult) =>
                  Math.round(ok.reduce((s, r) => s + ((r[key] as number) ?? 0), 0) / ok.length);
                return (
                  <div className="grid items-center px-3 py-2 text-xs font-bold rounded-b-xl mt-1"
                    style={{ gridTemplateColumns: '1fr 52px 52px 52px 52px 52px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <span className="text-indigo-400">Average ({ok.length} sites)</span>
                    <div className="text-center"><ScoreBadge val={avg('perf')} /></div>
                    <div className="text-center"><ScoreBadge val={avg('seo')} /></div>
                    <div className="text-center"><ScoreBadge val={avg('a11y')} /></div>
                    <div className="text-center"><ScoreBadge val={avg('bp')} /></div>
                    <div className="text-center text-slate-400">{avg('issues')}</div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
