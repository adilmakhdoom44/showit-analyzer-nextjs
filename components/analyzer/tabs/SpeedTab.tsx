'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { sClass, sColor, vitalsThresholds } from '@/lib/scoring';
import { detectFonts, detectThirdPartyScripts } from '@/lib/analysis-helpers';
import type { AnalysisResult } from '@/types/analyzer';
import {
  Zap, Smartphone, Monitor, BarChart2, Target, AlertTriangle, Image, Type, Package,
  ClipboardList, Info, BarChart2 as BarChart2Alt
} from 'lucide-react';

const VITALS = [
  { id: 'first-contentful-paint', label: 'First Contentful Paint', abbr: 'FCP', unit: 's', div: 1000, goodMs: 1800, poorMs: 3000 },
  { id: 'largest-contentful-paint', label: 'Largest Contentful Paint', abbr: 'LCP', unit: 's', div: 1000, goodMs: 2500, poorMs: 4000 },
  { id: 'total-blocking-time', label: 'Total Blocking Time', abbr: 'TBT', unit: 'ms', div: 1, goodMs: 200, poorMs: 600 },
  { id: 'cumulative-layout-shift', label: 'Cumulative Layout Shift', abbr: 'CLS', unit: '', div: 1, goodMs: 0.1, poorMs: 0.25 },
  { id: 'speed-index', label: 'Speed Index', abbr: 'SI', unit: 's', div: 1000, goodMs: 3400, poorMs: 5800 },
  { id: 'interactive', label: 'Time to Interactive', abbr: 'TTI', unit: 's', div: 1000, goodMs: 3800, poorMs: 7300 },
];

const VITALS_FIX: Record<string, string[]> = {
  'first-contentful-paint': [
    'Eliminate render-blocking CSS and JavaScript (move to async/defer)',
    'Use a CDN (Cloudflare, Fastly) to serve files closer to your visitors',
    'Minify CSS and remove unused stylesheets',
    'Preconnect to critical third-party origins (Google Fonts, analytics)',
    'Use system fonts instead of loading external font files',
  ],
  'largest-contentful-paint': [
    'Compress and resize your hero/above-the-fold images (aim for under 200KB)',
    'Convert images to WebP format (50% smaller than JPEG)',
    'Add loading="eager" and fetchpriority="high" to your hero image',
    'Use a CDN to serve your images from a server close to the visitor',
    'Preload your LCP image with <link rel="preload" as="image">',
    'Avoid lazy-loading the largest above-the-fold image',
  ],
  'total-blocking-time': [
    'Remove or defer unused JavaScript - every unused script blocks the browser',
    'Split large JavaScript bundles into smaller chunks (code splitting)',
    'Move non-critical scripts to load after the page is interactive',
    'Remove heavy third-party scripts (chat widgets, video embeds) or lazy-load them',
    'Check for long-running JavaScript tasks in Chrome DevTools > Performance tab',
  ],
  'cumulative-layout-shift': [
    'Set explicit width and height on all images and video elements',
    'Reserve space for ads, embeds, or iframes with CSS aspect-ratio',
    'Avoid inserting content above existing content after page load',
    'Use font-display: swap or optional to prevent invisible text + layout shift',
    'Preload web fonts to prevent FOUT (Flash of Unstyled Text)',
  ],
  'speed-index': [
    'Optimize your above-the-fold content to load first',
    'Inline critical CSS directly in the <head> to avoid a render-blocking stylesheet',
    'Reduce the number of resources needed to display the first screen',
    'Remove animations that run immediately on page load',
  ],
  'interactive': [
    'Reduce JavaScript execution time - profile with Chrome DevTools',
    'Remove unused JavaScript libraries and polyfills',
    'Use web workers for heavy data processing off the main thread',
    'Enable code splitting so only the JS needed for the current page loads',
  ],
};

function formatVal(v: number, div: number, unit: string) {
  const val = v / div;
  if (div === 1) {
    return unit ? `${Math.round(val)}${unit}` : val.toFixed(3);
  }
  return `${val.toFixed(1)}${unit}`;
}

const IMPACT_COLOR: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const IMPACT_BG: Record<string, string> = { low: 'rgba(16,185,129,0.1)', medium: 'rgba(245,158,11,0.1)', high: 'rgba(239,68,68,0.1)' };

export default function SpeedTab({ result }: { result: AnalysisResult }) {
  const mobAudits = result.mobile.lighthouseResult?.audits ?? result.mobile.audits ?? {};
  const dskAudits = result.desktop.lighthouseResult?.audits ?? result.desktop.audits ?? {};
  const mobCats = result.mobile.lighthouseResult?.categories ?? result.mobile.categories;
  const dskCats = result.desktop.lighthouseResult?.categories ?? result.desktop.categories;
  const mobPerf = Math.round((mobCats?.performance?.score ?? 0) * 100);
  const dskPerf = Math.round((dskCats?.performance?.score ?? 0) * 100);

  const bodyText = result.pageData?.bodyText ?? '';
  const fonts = detectFonts(bodyText);
  const scripts = detectThirdPartyScripts(bodyText);

  const imageAudits = Object.values(mobAudits).filter(a =>
    ['uses-optimized-images', 'uses-webp-images', 'uses-responsive-images', 'offscreen-images',
      'efficient-animated-content', 'uses-long-cache-ttl'].includes(a.id)
    && a.score !== null && a.score < 0.9
  );

  const renderBlockingAudits = Object.values(mobAudits).filter(a =>
    ['render-blocking-resources', 'unused-css-rules', 'unused-javascript'].includes(a.id)
    && a.score !== null && a.score < 0.9
  );

  // LCP element
  const lcpAudit = mobAudits['largest-contentful-paint-element'];
  const lcpElement = lcpAudit?.details?.items?.[0];

  const highImpact = scripts.filter(s => s.impact === 'high').length;

  const [speedChecked, setSpeedChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try { setSpeedChecked(JSON.parse(localStorage.getItem(`speed_checklist_${result.url}`) ?? '{}')); } catch {}
  }, [result.url]);
  const toggleSpeedCheck = (key: string) => {
    const next = { ...speedChecked, [key]: !speedChecked[key] };
    setSpeedChecked(next);
    try { localStorage.setItem(`speed_checklist_${result.url}`, JSON.stringify(next)); } catch {}
  };

  // Poor vitals
  const poorVitals = VITALS.filter(v => {
    const val = mobAudits[v.id]?.numericValue;
    return val !== undefined && vitalsThresholds(v.id, val) === 'poor';
  });
  const warnVitals = VITALS.filter(v => {
    const val = mobAudits[v.id]?.numericValue;
    return val !== undefined && vitalsThresholds(v.id, val) === 'warn';
  });

  const IMAGE_FIXES: Record<string, string[]> = {
    'uses-webp-images': [
      'Convert all JPEG/PNG images to WebP format (saves 25–50%)',
      'In Showit: re-export images from Lightroom/Photoshop as WebP before uploading',
      'Use Squoosh.app or TinyPNG to bulk convert images to WebP for free',
      'Check that your server sends correct Content-Type: image/webp headers',
    ],
    'uses-optimized-images': [
      'Compress images before uploading - aim for under 200KB per image',
      'Use TinyPNG, Squoosh, or ImageOptim to compress without visible quality loss',
      'In Showit, upload images at the exact display size - avoid uploading 4000px images for a 600px slot',
      'Remove image metadata (EXIF) to reduce file size',
    ],
    'uses-responsive-images': [
      'Add srcset attributes so browsers load correctly sized images on each device',
      'In Showit: upload separate mobile-optimized images for sections that are visible on mobile',
      'Use the <picture> element to serve different sizes to different screens',
    ],
    'offscreen-images': [
      'Add loading="lazy" to all images below the fold (not visible on first screen)',
      'In Showit, enable lazy loading in the image settings panel if available',
      'Lazy loading defers off-screen images until the visitor scrolls to them',
    ],
    'uses-long-cache-ttl': [
      'Set Cache-Control headers to at least 1 year for static assets (images, CSS, JS)',
      'In Showit/Cloudflare: enable browser caching in your CDN settings',
      'Use content-hashed filenames so browsers re-download only changed files',
    ],
    'efficient-animated-content': [
      'Replace animated GIFs with looping WebM or MP4 videos (90% smaller)',
      'Use the <video autoplay muted loop playsinline> element instead of <img src="...gif">',
    ],
  };

  // Recommended tools data with icons
  const recommendedTools = [
    { name: 'Google Analytics 4', Icon: BarChart2Alt, desc: 'Track visitors, traffic sources, and conversions. The most important free analytics tool.', link: 'https://analytics.google.com', detected: scripts.some(s => s.name?.toLowerCase().includes('analytics') || s.name?.toLowerCase().includes('ga4') || s.name?.toLowerCase().includes('gtag')) },
    { name: 'Google Tag Manager', Icon: Package, desc: 'Manage all tracking scripts in one place without editing code. Works with Showit via custom code.', link: 'https://tagmanager.google.com', detected: scripts.some(s => s.name?.toLowerCase().includes('tag manager') || s.name?.toLowerCase().includes('gtm')) },
    { name: 'Meta Pixel (Facebook)', Icon: Smartphone, desc: 'Track conversions and create retargeting audiences for Facebook and Instagram ads.', link: 'https://business.facebook.com/events_manager', detected: scripts.some(s => s.name?.toLowerCase().includes('meta') || s.name?.toLowerCase().includes('facebook') || s.name?.toLowerCase().includes('pixel')) },
    { name: 'Hotjar', Icon: Target, desc: 'Free heatmaps and session recordings - see exactly how visitors use your site.', link: 'https://hotjar.com', detected: scripts.some(s => s.name?.toLowerCase().includes('hotjar')) },
    { name: 'Pinterest Tag', Icon: Image, desc: 'Essential if you market on Pinterest. Tracks conversions from Pinterest traffic.', link: 'https://analytics.pinterest.com', detected: scripts.some(s => s.name?.toLowerCase().includes('pinterest')) },
    { name: 'TikTok Pixel', Icon: Zap, desc: 'Track conversions and build retargeting audiences from TikTok ads.', link: 'https://ads.tiktok.com', detected: scripts.some(s => s.name?.toLowerCase().includes('tiktok')) },
  ];

  return (
    <div className="space-y-6">

      {/* Performance score */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <Zap size={16} style={{ color: '#f59e0b' }} /> Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 mb-4">
            {[
              { label: 'Mobile', Icon: Smartphone, score: mobPerf },
              { label: 'Desktop', Icon: Monitor, score: dskPerf },
            ].map(({ label, Icon, score }) => (
              <div key={label} className="text-center">
                <div className="text-5xl font-black mb-2" style={{ color: sColor(score / 100) }}>{score}</div>
                <div className="text-sm flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={14} style={{ color: '#6366f1' }} /> {label}
                </div>
                <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: sColor(score / 100) }} />
                </div>
              </div>
            ))}
          </div>
          {/* Score interpretation */}
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            {[
              { range: '90–100', label: 'Fast', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
              { range: '50–89', label: 'Needs Work', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
              { range: '0–49', label: 'Slow', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
            ].map(s => (
              <div key={s.label} className="p-2 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.color}22` }}>
                <div className="font-bold" style={{ color: s.color }}>{s.range}</div>
                <div style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <BarChart2 size={16} style={{ color: '#6366f1' }} /> Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left pb-3">Metric</th>
                  <th className="text-center pb-3 flex items-center justify-center gap-1"><Smartphone size={12} style={{ color: '#6366f1' }} /> Mobile</th>
                  <th className="text-center pb-3">Desktop</th>
                  <th className="text-center pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {VITALS.map(v => {
                  const mobVal = mobAudits[v.id]?.numericValue;
                  const dskVal = dskAudits[v.id]?.numericValue;
                  const cls = mobVal !== undefined ? vitalsThresholds(v.id, mobVal) : 'poor';
                  const clsColor = cls === 'good' ? '#10b981' : cls === 'warn' ? '#f59e0b' : '#ef4444';
                  return (
                    <tr key={v.id} className="border-t border-white/5">
                      <td className="py-3">
                        <span className="font-mono text-xs font-bold text-indigo-400">{v.abbr}</span>
                        <span className="ml-2 text-xs hidden md:inline" style={{ color: 'var(--text-secondary)' }}>{v.label}</span>
                      </td>
                      <td className="py-3 text-center font-mono text-sm" style={{ color: mobVal !== undefined ? clsColor : 'var(--text-muted)' }}>
                        {mobVal !== undefined ? formatVal(mobVal, v.div, v.unit) : 'N/A'}
                      </td>
                      <td className="py-3 text-center font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {dskVal !== undefined ? formatVal(dskVal, v.div, v.unit) : 'N/A'}
                      </td>
                      <td className="py-3 text-center">
                        <Badge className="text-xs" style={{
                          background: cls === 'good' ? 'rgba(16,185,129,0.15)' : cls === 'warn' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: clsColor, border: 'none',
                        }}>
                          {cls === 'good' ? 'Good' : cls === 'warn' ? 'Improve' : 'Poor'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Fix guides for poor/warn vitals */}
          {(poorVitals.length > 0 || warnVitals.length > 0) && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>How to improve your scores:</div>
              {[...poorVitals, ...warnVitals].map(v => {
                const steps = VITALS_FIX[v.id];
                if (!steps) return null;
                const val = mobAudits[v.id]?.numericValue;
                const cls = val !== undefined ? vitalsThresholds(v.id, val) : 'poor';
                return (
                  <div key={v.id} className="p-3 rounded-xl"
                    style={{
                      background: cls === 'poor' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                      border: `1px solid ${cls === 'poor' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
                    }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-indigo-400">{v.abbr}</span>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{v.label}</span>
                      <span className="text-xs ml-auto" style={{ color: cls === 'poor' ? '#ef4444' : '#f59e0b' }}>
                        {val !== undefined ? formatVal(val, v.div, v.unit) : 'N/A'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {steps.map((step, i) => (
                        <div key={i} className="flex gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex-shrink-0 text-indigo-400 font-bold">{i + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* LCP Element */}
      {lcpElement && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Target size={16} style={{ color: '#6366f1' }} /> LCP Element (Largest Contentful Paint)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>This element triggers your LCP - it must load fast as it&apos;s what Google measures for perceived speed.</p>
            <div className="p-3 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto mb-3"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              {JSON.stringify(lcpElement).slice(0, 200)}
            </div>
            <div className="p-3 rounded-lg text-xs"
              style={{ background: 'var(--bg-sidebar)', border: '1px dashed var(--border-card)' }}>
              <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>To speed up this element:</div>
              <ol className="space-y-0.5 list-decimal ml-4" style={{ color: 'var(--text-secondary)' }}>
                <li>If it&apos;s an image: compress it to under 200KB and convert to WebP</li>
                <li>Ensure it&apos;s not lazy-loaded (remove loading=&quot;lazy&quot; from the LCP image)</li>
                <li>Add &lt;link rel=&quot;preload&quot; as=&quot;image&quot; href=&quot;...&quot;&gt; in your &lt;head&gt; for this image</li>
                <li>If it&apos;s text: ensure the font is preloaded or use a system font for the hero</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render-blocking resources */}
      {renderBlockingAudits.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: '#f97316' }} /> Render-Blocking Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderBlockingAudits.map(a => (
              <div key={a.id} className="p-3 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="flex items-start gap-3 mb-2">
                  <AlertTriangle size={16} color="#f97316" className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                    {a.displayValue && <div className="text-xs text-red-400 mt-0.5">{a.displayValue}</div>}
                  </div>
                </div>
                <div className="ml-6 space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {a.id === 'render-blocking-resources' && <>
                    <div>1. Add <code className="text-indigo-300">defer</code> attribute to non-critical scripts: <code className="text-indigo-300">&lt;script defer src=&quot;...&quot;&gt;</code></div>
                    <div>2. Load non-critical CSS asynchronously using <code className="text-indigo-300">media=&quot;print&quot; onload</code> technique</div>
                    <div>3. Inline critical above-the-fold CSS directly into &lt;head&gt;</div>
                    <div>4. Preconnect to external origins: <code className="text-indigo-300">&lt;link rel=&quot;preconnect&quot;&gt;</code></div>
                  </>}
                  {a.id === 'unused-css-rules' && <>
                    <div>1. Use Chrome DevTools &gt; Coverage tab to identify unused CSS</div>
                    <div>2. Remove CSS for components/pages that are not on this page</div>
                    <div>3. Consider using PurgeCSS to automatically remove unused styles</div>
                    <div>4. Split your CSS into critical (inlined) and non-critical (deferred)</div>
                  </>}
                  {a.id === 'unused-javascript' && <>
                    <div>1. Audit third-party scripts - remove any you no longer use</div>
                    <div>2. Use code splitting so only the JS for the current page loads</div>
                    <div>3. Defer non-critical scripts until after page load</div>
                    <div>4. Replace heavy libraries with lighter alternatives (e.g., day.js instead of moment.js)</div>
                  </>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Image optimization */}
      {imageAudits.length > 0 && (
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Image size={16} style={{ color: '#6366f1' }} /> Image Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {imageAudits.map(a => (
              <div key={a.id} className="p-3 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <div className="flex items-start gap-3 mb-2">
                  <AlertTriangle size={16} color="#f59e0b" className="mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.title}</div>
                    {a.displayValue && <div className="text-xs text-amber-400 mt-0.5">Potential saving: {a.displayValue}</div>}
                  </div>
                </div>
                {IMAGE_FIXES[a.id] && (
                  <div className="ml-6 space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {IMAGE_FIXES[a.id].map((step, i) => (
                      <div key={i}>{i + 1}. {step}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Font Detector */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <Type size={16} style={{ color: '#6366f1' }} /> Font Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {fonts.map((f, i) => (
            <div key={i} className="p-3 rounded-xl"
              style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
              <div className="flex items-center gap-3 mb-1">
                <Type size={18} style={{ color: '#6366f1' }} />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.name}</span>
                  <Badge variant="outline" className="text-xs">{f.type}</Badge>
                </div>
              </div>
              {f.warning && (
                <div className="ml-9 text-xs text-amber-400 flex items-start gap-1">
                  <AlertTriangle size={11} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div>{f.warning}</div>
                    {f.name === 'Google Fonts' && (
                      <div className="mt-1" style={{ color: 'var(--text-muted)' }}>
                        Fix: Add <code className="text-indigo-300">&amp;display=swap</code> to your Google Fonts URL, or self-host the font files for best performance.
                      </div>
                    )}
                    {f.name === 'Font Awesome' && (
                      <div className="mt-1" style={{ color: 'var(--text-muted)' }}>
                        Fix: Replace Font Awesome with inline SVG icons or a subset icon font that only loads the icons you use.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {fonts.some(f => f.type === 'CDN') && (
            <div className="p-3 rounded-lg text-xs"
              style={{ background: 'var(--bg-sidebar)', border: '1px dashed var(--border-card)' }}>
              <div className="font-medium mb-1 flex items-start gap-1" style={{ color: 'var(--text-primary)' }}>
                <Info size={12} color="#818cf8" className="flex-shrink-0 mt-0.5" /> How to self-host fonts for best speed:
              </div>
              <ol className="space-y-0.5 list-decimal ml-4" style={{ color: 'var(--text-secondary)' }}>
                <li>Use google-webfonts-helper.herokuapp.com to download font files</li>
                <li>Upload the .woff2 files to your Showit site&apos;s assets</li>
                <li>Add @font-face rules with font-display: swap in your custom CSS</li>
                <li>Remove the Google Fonts <code>&lt;link&gt;</code> tag from your &lt;head&gt;</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Third-party script audit */}
      <Card className="glass border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
              <Package size={16} style={{ color: '#6366f1' }} /> Third-Party Script Audit
            </CardTitle>
            {highImpact > 0 && (
              <Badge style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                {highImpact} high impact
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {scripts.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No third-party scripts detected.</p>
          ) : (
            <div className="space-y-2 mb-3">
              {scripts.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: IMPACT_BG[s.impact], border: `1px solid ${IMPACT_COLOR[s.impact]}22` }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                      <Badge variant="outline" className="text-xs">{s.category}</Badge>
                    </div>
                  </div>
                  <Badge className="text-xs capitalize" style={{
                    background: IMPACT_BG[s.impact],
                    color: IMPACT_COLOR[s.impact],
                    border: `1px solid ${IMPACT_COLOR[s.impact]}44`,
                  }}>
                    {s.impact} impact
                  </Badge>
                </div>
              ))}
            </div>
          )}
          {highImpact > 0 && (
            <div className="p-3 rounded-lg text-xs"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="font-medium text-amber-300 mb-1 flex items-start gap-1">
                <Info size={12} color="#818cf8" className="flex-shrink-0 mt-0.5" /> How to fix high-impact scripts:
              </div>
              <ol className="space-y-0.5 list-decimal ml-4" style={{ color: 'var(--text-secondary)' }}>
                <li>Audit which scripts you actually use - remove anything inactive</li>
                <li>Lazy-load chat widgets: only load them after the visitor interacts with the page</li>
                <li>For video embeds (YouTube/Vimeo): use a facade/placeholder image that loads the iframe only on click</li>
                <li>Load analytics scripts with <code className="text-indigo-300">async</code> or <code className="text-indigo-300">defer</code></li>
                <li>Use Google Tag Manager to consolidate and manage all scripts in one place</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended tools not detected */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <Info size={16} style={{ color: '#818cf8' }} /> Recommended Tracking Tools Not Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>These free tools are not currently detected on your site. Adding them can improve your marketing, analytics, and conversion tracking.</p>
          <div className="space-y-2">
            {recommendedTools.filter(t => !t.detected).map((tool, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-card)' }}>
                <tool.Icon size={20} style={{ color: '#6366f1', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tool.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{tool.desc}</div>
                </div>
                <a href={tool.link} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#4f46e5', border: '1px solid rgba(99,102,241,0.25)' }}>
                  Add →
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General speed improvement checklist */}
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }} className="text-base flex items-center gap-2">
            <ClipboardList size={16} style={{ color: '#6366f1' }} /> Complete Speed Improvement Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[
            { category: 'Images', items: [
              'Compress all images to under 200KB (use TinyPNG or Squoosh)',
              'Convert images to WebP format',
              'Set explicit width and height on all img elements',
              'Add loading="lazy" to below-the-fold images',
              'Preload the hero/LCP image with <link rel="preload">',
            ]},
            { category: 'JavaScript', items: [
              'Remove unused or duplicate JavaScript libraries',
              'Add defer or async to non-critical scripts',
              'Lazy-load chat widgets and video embeds',
              'Avoid synchronous third-party scripts in the <head>',
            ]},
            { category: 'CSS & Fonts', items: [
              'Inline critical CSS (above-the-fold styles) in the <head>',
              'Add font-display: swap to prevent invisible text flash',
              'Self-host fonts instead of loading from Google CDN',
              'Remove unused CSS rules',
            ]},
            { category: 'Server & Caching', items: [
              'Enable a CDN (Cloudflare free tier works great)',
              'Set long cache headers (1 year) for static assets',
              'Enable HTTP/2 or HTTP/3 on your hosting',
              'Enable Gzip or Brotli compression',
            ]},
          ].map(group => (
            <div key={group.category} className="mb-4">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-2">{group.category}</div>
              <div className="space-y-1">
                {group.items.map((item, i) => {
                  const key = `${group.category}_${i}`;
                  const done = !!speedChecked[key];
                  return (
                    <button key={i} onClick={() => toggleSpeedCheck(key)}
                      className="flex gap-2 text-xs py-1.5 border-b border-white/5 last:border-0 w-full text-left items-center">
                      <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${done ? 'bg-indigo-500 border-indigo-500' : 'border-white/20 hover:border-indigo-400'}`}>
                        {done && <span className="text-white text-xs leading-none">✓</span>}
                      </span>
                      <span style={{ color: done ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
