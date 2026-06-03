'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnalyzer } from '@/lib/analyzer-context';
import { getScoreHistory } from '@/lib/storage';
import { estimateSERPPosition } from '@/lib/analysis-helpers';
import type { AnalysisResult } from '@/types/analyzer';
import BulkAnalyzer from '@/components/analyzer/BulkAnalyzer';
import ScanDiff from '@/components/analyzer/ScanDiff';
import { exportToExcel } from '@/lib/excel-export';
import { Rocket, Target, MapPin, History, BarChart2, Share2, ExternalLink, TrendingUp, Download, Compass, RefreshCw } from 'lucide-react';
import CompetitorAnalysis from '@/components/analyzer/CompetitorAnalysis';

export default function ToolsTab({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);
  const { analyze } = useAnalyzer();
  const [history, setHistory] = useState<ReturnType<typeof getScoreHistory>>([]);

  useEffect(() => { setHistory(getScoreHistory(result.url)); }, [result.url]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?url=${encodeURIComponent(result.url)}`
    : '';

  const copyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.open('/report', '_blank');

  const mobCats = result.mobile.lighthouseResult?.categories ?? result.mobile.categories;
  const perf = Math.round((mobCats?.performance?.score ?? 0) * 100);
  const seo = Math.round((mobCats?.seo?.score ?? 0) * 100);
  const a11y = Math.round((mobCats?.accessibility?.score ?? 0) * 100);
  const bp = Math.round((mobCats?.['best-practices']?.score ?? 0) * 100);

  const { totalScore, position, positionColor, factors } = estimateSERPPosition(result.pageData, result.mobile);

  let domain = result.url;
  try { domain = new URL(result.url).hostname; } catch {}

  const businessName = result.pageData?.title?.split(/[-|–]/)[0]?.trim() || domain;

  // Quick Wins
  const quickWins: { label: string; time: string; impact: 'High' | 'Medium'; link?: string }[] = [];
  if (!result.pageData?.metaDesc) quickWins.push({ label: 'Add a meta description', time: '5 min', impact: 'High', link: 'https://help.showit.com/hc/en-us/search?utf8=✓&query=meta+description' });
  if (!result.pageData?.analytics?.ga4 && !result.pageData?.analytics?.gtm) quickWins.push({ label: 'Connect Google Analytics 4', time: '10 min', impact: 'High' });
  if ((result.pageData?.schema ?? 0) === 0) quickWins.push({ label: 'Add LocalBusiness schema markup', time: '15 min', impact: 'High' });
  if (!result.pageData?.headings?.some(h => h.tag === 'H1')) quickWins.push({ label: 'Set an H1 heading on your homepage', time: '2 min', impact: 'High' });
  if (perf < 50) quickWins.push({ label: 'Compress & optimize hero images', time: '20 min', impact: 'High' });

  const freeTools = [
    { name: 'Google Search Console', desc: 'Monitor search performance & crawl errors', href: 'https://search.google.com/search-console', icon: '🔍' },
    { name: 'Google PageSpeed', desc: 'Test any URL for speed scores', href: `https://pagespeed.web.dev/?url=${encodeURIComponent(result.url)}`, icon: '⚡' },
    { name: 'Bing Webmaster', desc: 'Submit to Bing & check index status', href: 'https://www.bing.com/webmasters', icon: '🌐' },
    { name: 'Schema Markup Validator', desc: 'Test your structured data', href: `https://validator.schema.org/#url=${encodeURIComponent(result.url)}`, icon: '🏷️' },
    { name: 'Google Rich Results Test', desc: 'Check rich snippet eligibility', href: `https://search.google.com/test/rich-results?url=${encodeURIComponent(result.url)}`, icon: '✨' },
    { name: 'GTmetrix', desc: 'Detailed waterfall speed analysis', href: `https://gtmetrix.com/?url=${encodeURIComponent(result.url)}`, icon: '📊' },
  ];

  return (
    <div className="space-y-6">

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><Rocket size={16} className="inline mr-1.5" /> Quick Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Highest-impact actions ranked by effort - do these first.</p>
            <ol className="space-y-2">
              {quickWins.map((w, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                  <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>{i + 1}</span>
                  <div className="flex-1">
                    {w.link ? (
                      <a href={w.link} target="_blank" rel="noopener noreferrer"
                        className="text-sm transition-colors"
                        style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                        {w.label} ↗
                      </a>
                    ) : (
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{w.label}</span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#d97706', border: '1px solid rgba(245,158,11,0.25)' }}>
                    ⏱ {w.time}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>
                    {w.impact}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* SERP Position Estimator */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><Target size={16} className="inline mr-1.5" /> SERP Position Estimator</CardTitle>
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: positionColor }}>{totalScore}/100</div>
              <div className="text-xs " style={{ color: 'var(--text-secondary)' }}>{position}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Score bar */}
          <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-6">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${totalScore}%`, background: `linear-gradient(90deg, #6366f1, ${positionColor})` }} />
          </div>
          <div className="space-y-2">
            {factors.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl text-sm"
                style={{
                  background: f.passed ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${f.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)'}`,
                }}>
                <span className="flex-shrink-0 mt-0.5">{f.passed ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <span className={f.passed ? 'text-slate-300' : 'text-slate-400'}>{f.label}</span>
                  {!f.passed && <div className="text-xs  mt-0.5" style={{ color: 'var(--text-secondary)' }}>💡 {f.tip}</div>}
                </div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: f.passed ? '#10b981' : '#64748b' }}>
                  +{f.pts} pts
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Google Business Profile Checker */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><MapPin size={16} className="inline mr-1.5" /> Google Business Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Check GBP listing', icon: '🔍', href: `https://www.google.com/search?q=${encodeURIComponent(businessName)}` },
              { label: 'Manage your profile', icon: '⚙️', href: 'https://business.google.com' },
              { label: 'Find on Google Maps', icon: '🗺️', href: `https://maps.google.com/search?q=${encodeURIComponent(businessName)}` },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-2xl">{link.icon}</span>
                <span className="text-xs " style={{ color: 'var(--text-primary)' }}>{link.label}</span>
              </a>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { step: '1', label: 'Claim your free listing at business.google.com', done: false },
              { step: '2', label: 'Complete 100% of your profile (name, address, phone, hours)', done: false },
              { step: '3', label: 'Add 10+ high-quality photos', done: false },
              { step: '4', label: 'Collect Google reviews from clients', done: false },
              { step: '5', label: 'Post updates weekly to stay active', done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-sm  p-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{s.step}</span>
                {s.label}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(99,102,241,0.08)' }}>
              <div className="text-indigo-400 font-bold text-lg">+42%</div>
              <div className="" style={{ color: 'var(--text-secondary)' }}>more direction requests with photos</div>
            </div>
            <div className="p-3 rounded-lg text-center" style={{ background: 'rgba(99,102,241,0.08)' }}>
              <div className="text-indigo-400 font-bold text-lg">#1</div>
              <div className="" style={{ color: 'var(--text-secondary)' }}>local ranking factor: Google reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score History */}
      {history.length > 0 && (
        <Card className="glass border-0">
          <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><History size={16} className="inline mr-1.5" /> Score History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1">
                    <div className="text-xs " style={{ color: 'var(--text-secondary)' }}>{h.date} at {h.time}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {h.perf !== undefined && (
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                          P:{h.perf}
                        </span>
                      )}
                      {h.seo !== undefined && (
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                          S:{h.seo}
                        </span>
                      )}
                      {h.a11y !== undefined && (
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                          A:{h.a11y}
                        </span>
                      )}
                      {h.bp !== undefined && (
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.15)' }}>
                          B:{h.bp}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge style={{
                    background: h.score >= 70 ? 'rgba(16,185,129,0.15)' : h.score >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                    color: h.score >= 70 ? '#10b981' : h.score >= 50 ? '#f59e0b' : '#ef4444',
                    border: 'none',
                  }}>
                    Grade {h.grade} - {h.score}/100
                  </Badge>
                  {i === 0 && <span className="text-xs " style={{ color: 'var(--text-muted)' }}>latest</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Score Summary */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><BarChart2 size={16} className="inline mr-1.5" /> Current Score Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
            {[
              { label: 'Performance', value: perf, icon: '⚡' },
              { label: 'SEO', value: seo, icon: '🔍' },
              { label: 'Accessibility', value: a11y, icon: '♿' },
              { label: 'Best Practices', value: bp, icon: '✅' },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-3xl font-black" style={{ color: s.value >= 90 ? '#10b981' : s.value >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {s.value}
                </div>
                <div className="text-xs  mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl text-xs text-center"
            style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            {result.url}
          </div>
        </CardContent>
      </Card>

      {/* Share Report */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><Share2 size={16} className="inline mr-1.5" /> Share This Report</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm  mb-4" style={{ color: 'var(--text-secondary)' }}>Share your analysis with your designer or client.</p>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }} />
            <Button onClick={copyShare} variant="outline" className="flex-shrink-0"
              style={{ borderColor: 'rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handlePrint} variant="outline" className="flex-1 text-sm"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              🖨️ Print / Save as PDF
            </Button>
            <a href={`mailto:?subject=SEO Report for ${domain}&body=Here is the full SEO report for ${result.url}%0A%0AOverall Grade: ${(() => { try { const c = result.mobile.lighthouseResult?.categories ?? result.mobile.categories; const avg = Math.round(((c?.performance?.score??0)+(c?.seo?.score??0)+(c?.accessibility?.score??0)+(c?.['best-practices']?.score??0))/4*100); return avg>=90?'A':avg>=80?'B':avg>=70?'C':avg>=60?'D':'F'; } catch { return '—'; } })()}%0APerformance: ${Math.round((result.mobile.lighthouseResult?.categories?.performance?.score??result.mobile.categories?.performance?.score??0)*100)}%2F100%0ASEO: ${Math.round((result.mobile.lighthouseResult?.categories?.seo?.score??result.mobile.categories?.seo?.score??0)*100)}%2F100%0AAccessibility: ${Math.round((result.mobile.lighthouseResult?.categories?.accessibility?.score??result.mobile.categories?.accessibility?.score??0)*100)}%2F100%0A%0AView full report: ${shareUrl}%0A%0AGenerated by Showit Site Analyzer — showitanalyzer.com`}
              className="flex-1">
              <Button variant="outline" className="w-full text-sm"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                ✉️ Email Report
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Backlink Tools */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><ExternalLink size={16} className="inline mr-1.5" /> Backlink Research Tools</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm  mb-4" style={{ color: 'var(--text-secondary)' }}>Check your backlink profile using these free tools:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { name: 'Ahrefs Free', desc: 'Free backlink checker', href: `https://ahrefs.com/backlink-checker?input=${encodeURIComponent(result.url)}`, icon: '📊' },
              { name: 'Moz Link Explorer', desc: 'Domain authority + links', href: `https://moz.com/link-explorer/overview?site=${encodeURIComponent(result.url)}`, icon: '🔍' },
              { name: 'SEMrush', desc: 'Full backlink analytics', href: `https://www.semrush.com/analytics/backlinks/?target=${encodeURIComponent(result.url)}`, icon: '📈' },
            ].map(tool => (
              <a key={tool.name} href={tool.href} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-xs font-medium text-white">{tool.name}</span>
                <span className="text-xs " style={{ color: 'var(--text-secondary)' }}>{tool.desc}</span>
              </a>
            ))}
          </div>
          <div className="p-3 rounded-lg text-xs"
            style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="font-medium  mb-2" style={{ color: 'var(--text-primary)' }}>💡 Quick backlink wins for photographers &amp; creatives:</div>
            <ul className="space-y-1 " style={{ color: 'var(--text-secondary)' }}>
              <li>• Get listed in local business directories (Yelp, Google, Bing)</li>
              <li>• Ask past clients to link from their website to yours</li>
              <li>• Submit to photography community sites and vendor lists</li>
              <li>• Write guest posts for local wedding blogs or industry publications</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><TrendingUp size={16} className="inline mr-1.5" /> Competitor Analysis</CardTitle></CardHeader>
        <CardContent>
          <CompetitorAnalysis result={result} />
        </CardContent>
      </Card>

      {/* Bulk Analyzer */}
      <BulkAnalyzer />

      {/* Scan Diff */}
      <ScanDiff history={history} />

      {/* Excel Export */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><Download size={16} className="inline mr-1.5" /> Export Report</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm " style={{ color: 'var(--text-secondary)' }}>Download a full professional report with 5 sheets - Summary, SEO, Speed, Issues, and Score History.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={async () => {
                try { await exportToExcel(result, history); }
                catch (e) { console.error(e); }
              }}
              className="w-full font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
              📥 Download Excel (.xlsx)
            </Button>
            <Button onClick={handlePrint} variant="outline" className="w-full"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              🖨️ Print / Save as PDF
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            {['Summary sheet', 'SEO Details', 'Speed & CWV', 'All Issues', 'Score History', 'Color-coded cells'].map(f => (
              <div key={f} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                ✓ {f}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Free SEO Tools Directory */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><Compass size={16} className="inline mr-1.5" /> Free SEO Tools Directory</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {freeTools.map(tool => (
              <a key={tool.name} href={tool.href} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xl flex-shrink-0">{tool.icon}</span>
                <div>
                  <div className="text-xs font-medium" style={{ color: '#a5b4fc' }}>{tool.name} ↗</div>
                  <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{tool.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Re-analyze */}
      <Card className="glass border-0">
        <CardHeader><CardTitle className="text-base" style={{ color: 'var(--text-primary)' }}><RefreshCw size={16} className="inline mr-1.5" /> Re-Analyze</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm  mb-4" style={{ color: 'var(--text-secondary)' }}>Run a fresh scan after making changes to see your improvement.</p>
          <Button onClick={() => analyze(result.url)} className="w-full"
            style={{ background: 'linear-gradient(135deg,#6366f1,#06b6d4)', color: 'white' }}>
            Re-Analyze {domain}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
