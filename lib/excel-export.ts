'use client';

import type { AnalysisResult } from '@/types/analyzer';
import type { ScoreEntry } from '@/lib/storage';

function scoreColor(score: number): string {
  if (score >= 90) return 'FF10b981';
  if (score >= 50) return 'FFf59e0b';
  return 'FFef4444';
}

function scoreFill(score: number) {
  if (score >= 90) return { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF0d2e1f' } };
  if (score >= 50) return { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF2e1f00' } };
  return { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF2e0d0d' } };
}

export async function exportToExcel(result: AnalysisResult, history: ScoreEntry[]) {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Showit Site Analyzer';
  wb.created = new Date();

  const cats = result.mobile.lighthouseResult?.categories ?? result.mobile.categories ?? {};
  const audits = result.mobile.lighthouseResult?.audits ?? result.mobile.audits ?? {};
  const deskCats = result.desktop.lighthouseResult?.categories ?? result.desktop.categories ?? {};

  const perf = Math.round((cats.performance?.score ?? 0) * 100);
  const seo = Math.round((cats.seo?.score ?? 0) * 100);
  const a11y = Math.round((cats.accessibility?.score ?? 0) * 100);
  const bp = Math.round((cats['best-practices']?.score ?? 0) * 100);
  const avg = Math.round((perf + seo + a11y + bp) / 4);

  const headerStyle = {
    font: { bold: true, color: { argb: 'FFffffff' }, size: 11 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF1a1f2e' } },
    alignment: { vertical: 'middle' as const, horizontal: 'center' as const },
    border: {
      bottom: { style: 'thin' as const, color: { argb: 'FF6366f1' } },
    },
  };

  // ── Sheet 1: Summary ─────────────────────────────────────────────
  const summary = wb.addWorksheet('Summary');
  summary.columns = [
    { header: 'Metric', key: 'metric', width: 28 },
    { header: 'Value', key: 'value', width: 20 },
    { header: 'Status', key: 'status', width: 14 },
  ];
  summary.getRow(1).eachCell(c => Object.assign(c, headerStyle));

  const summaryData = [
    { metric: 'Analyzed URL', value: result.url, status: '' },
    { metric: 'Analysis Date', value: new Date().toLocaleDateString(), status: '' },
    { metric: 'Overall Avg Score', value: avg, status: avg >= 70 ? '✅ Good' : avg >= 50 ? '⚠️ Fair' : '❌ Poor' },
    { metric: 'Performance (Mobile)', value: perf, status: perf >= 90 ? '✅' : perf >= 50 ? '⚠️' : '❌' },
    { metric: 'SEO', value: seo, status: seo >= 90 ? '✅' : seo >= 50 ? '⚠️' : '❌' },
    { metric: 'Accessibility', value: a11y, status: a11y >= 90 ? '✅' : a11y >= 50 ? '⚠️' : '❌' },
    { metric: 'Best Practices', value: bp, status: bp >= 90 ? '✅' : bp >= 50 ? '⚠️' : '❌' },
    { metric: 'Page Title', value: result.pageData?.title || 'Missing', status: result.pageData?.title ? '✅' : '❌' },
    { metric: 'Meta Description', value: result.pageData?.metaDesc || 'Missing', status: result.pageData?.metaDesc ? '✅' : '❌' },
    { metric: 'HTTPS', value: audits['is-on-https']?.score === 1 ? 'Yes' : 'No', status: audits['is-on-https']?.score === 1 ? '✅' : '❌' },
    { metric: 'Total Images', value: result.pageData?.images?.length ?? 0, status: '' },
    { metric: 'Images Missing Alt', value: result.pageData?.images?.filter(i => !i.hasAlt).length ?? 0, status: '' },
    { metric: 'Word Count', value: result.pageData?.wordCount ?? 0, status: '' },
  ];

  summaryData.forEach((row, i) => {
    const r = summary.addRow(row);
    if (typeof row.value === 'number' && row.metric.includes('Score') || ['Performance (Mobile)', 'SEO', 'Accessibility', 'Best Practices'].includes(row.metric)) {
      const cell = r.getCell('value');
      cell.font = { bold: true, color: { argb: scoreColor(row.value as number) } };
      cell.fill = scoreFill(row.value as number);
    }
    r.getCell('metric').font = { color: { argb: 'FF94a3b8' } };
    if (i % 2 === 0) {
      r.eachCell(c => {
        if (!c.fill || (c.fill as { pattern?: string }).pattern !== 'solid') {
          c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0d1117' } };
        }
      });
    }
  });

  // ── Sheet 2: SEO Details ─────────────────────────────────────────
  const seoSheet = wb.addWorksheet('SEO Details');
  seoSheet.columns = [
    { header: 'Check', key: 'check', width: 30 },
    { header: 'Value', key: 'value', width: 50 },
    { header: 'Status', key: 'status', width: 12 },
  ];
  seoSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));

  const pd = result.pageData;
  const seoRows = [
    { check: 'Title Tag', value: pd?.title || 'Missing', status: pd?.title ? '✅' : '❌' },
    { check: 'Title Length', value: `${pd?.title?.length ?? 0} chars (ideal: 50-60)`, status: (pd?.title?.length ?? 0) >= 50 && (pd?.title?.length ?? 0) <= 60 ? '✅' : '⚠️' },
    { check: 'Meta Description', value: pd?.metaDesc || 'Missing', status: pd?.metaDesc ? '✅' : '❌' },
    { check: 'Meta Desc Length', value: `${pd?.metaDesc?.length ?? 0} chars (ideal: 150-160)`, status: (pd?.metaDesc?.length ?? 0) >= 150 && (pd?.metaDesc?.length ?? 0) <= 160 ? '✅' : '⚠️' },
    { check: 'H1 Tags', value: `${pd?.headings?.filter(h => h.tag === 'H1').length ?? 0} found`, status: (pd?.headings?.filter(h => h.tag === 'H1').length ?? 0) === 1 ? '✅' : '⚠️' },
    { check: 'Canonical URL', value: pd?.canonical || 'Not set', status: pd?.canonical ? '✅' : '⚠️' },
    { check: 'Language', value: pd?.lang || 'Not set', status: pd?.lang ? '✅' : '❌' },
    { check: 'Robots Meta', value: pd?.metaRobots || 'Not set', status: pd?.hasNoIndex ? '❌' : '✅' },
    { check: 'OG Title', value: pd?.og?.title || 'Missing', status: pd?.og?.title ? '✅' : '⚠️' },
    { check: 'OG Description', value: pd?.og?.description || 'Missing', status: pd?.og?.description ? '✅' : '⚠️' },
    { check: 'OG Image', value: pd?.og?.image || 'Missing', status: pd?.og?.image ? '✅' : '⚠️' },
    { check: 'Schema Markup', value: `${pd?.schema ?? 0} types detected`, status: (pd?.schema ?? 0) > 0 ? '✅' : '⚠️' },
    { check: 'Word Count', value: pd?.wordCount ?? 0, status: (pd?.wordCount ?? 0) >= 300 ? '✅' : '⚠️' },
    { check: 'PSI SEO Score', value: seo, status: seo >= 90 ? '✅' : seo >= 50 ? '⚠️' : '❌' },
    { check: 'PSI SEO Score (Desktop)', value: Math.round((deskCats.seo?.score ?? 0) * 100), status: '' },
  ];
  seoRows.forEach((row, i) => {
    const r = seoSheet.addRow(row);
    if (i % 2 === 0) r.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0d1117' } }; });
  });

  // ── Sheet 3: Speed & Core Web Vitals ──────────────────────────────
  const speedSheet = wb.addWorksheet('Speed');
  speedSheet.columns = [
    { header: 'Metric', key: 'metric', width: 32 },
    { header: 'Mobile', key: 'mobile', width: 16 },
    { header: 'Desktop', key: 'desktop', width: 16 },
    { header: 'Rating', key: 'rating', width: 14 },
  ];
  speedSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));

  const deskAudits = result.desktop.lighthouseResult?.audits ?? result.desktop.audits ?? {};
  const vitals = [
    { metric: 'Performance Score', mobile: perf, desktop: Math.round((deskCats.performance?.score ?? 0) * 100), isScore: true },
    { metric: 'First Contentful Paint', mobile: audits['first-contentful-paint']?.displayValue ?? 'N/A', desktop: deskAudits['first-contentful-paint']?.displayValue ?? 'N/A', isScore: false },
    { metric: 'Largest Contentful Paint', mobile: audits['largest-contentful-paint']?.displayValue ?? 'N/A', desktop: deskAudits['largest-contentful-paint']?.displayValue ?? 'N/A', isScore: false },
    { metric: 'Total Blocking Time', mobile: audits['total-blocking-time']?.displayValue ?? 'N/A', desktop: deskAudits['total-blocking-time']?.displayValue ?? 'N/A', isScore: false },
    { metric: 'Cumulative Layout Shift', mobile: audits['cumulative-layout-shift']?.displayValue ?? 'N/A', desktop: deskAudits['cumulative-layout-shift']?.displayValue ?? 'N/A', isScore: false },
    { metric: 'Speed Index', mobile: audits['speed-index']?.displayValue ?? 'N/A', desktop: deskAudits['speed-index']?.displayValue ?? 'N/A', isScore: false },
    { metric: 'Time to Interactive', mobile: audits['interactive']?.displayValue ?? 'N/A', desktop: deskAudits['interactive']?.displayValue ?? 'N/A', isScore: false },
  ];

  vitals.forEach((v, i) => {
    const mScore = v.isScore ? (v.mobile as number) : (audits[Object.keys(audits).find(k => audits[k]?.title === v.metric) ?? '']?.score ?? 1) * 100;
    const rating = v.isScore ? ((v.mobile as number) >= 90 ? 'Good' : (v.mobile as number) >= 50 ? 'Needs Work' : 'Poor') : '';
    const r = speedSheet.addRow({ ...v, rating });
    if (v.isScore) {
      const c = r.getCell('mobile');
      c.font = { bold: true, color: { argb: scoreColor(v.mobile as number) } };
      c.fill = scoreFill(v.mobile as number);
    }
    if (i % 2 === 0) r.getCell('metric').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0d1117' } };
  });

  // ── Sheet 4: Issues ───────────────────────────────────────────────
  const issuesSheet = wb.addWorksheet('Issues Found');
  issuesSheet.columns = [
    { header: '#', key: 'num', width: 5 },
    { header: 'Audit', key: 'audit', width: 36 },
    { header: 'Score', key: 'score', width: 10 },
    { header: 'Category', key: 'category', width: 18 },
    { header: 'Details', key: 'details', width: 50 },
  ];
  issuesSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));

  const failedAudits = Object.values(audits as Record<string, { id: string; title: string; score: number | null; displayValue?: string; description?: string }>)
    .filter(a => a.score !== null && a.score < 0.9)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  failedAudits.forEach((a, i) => {
    const r = issuesSheet.addRow({
      num: i + 1,
      audit: a.title ?? a.id,
      score: Math.round((a.score ?? 0) * 100),
      category: a.id?.includes('seo') ? 'SEO' : a.id?.includes('perf') || a.id?.includes('speed') ? 'Performance' : a.id?.includes('a11y') || a.id?.includes('aria') ? 'Accessibility' : 'General',
      details: a.displayValue ?? '',
    });
    const scoreCell = r.getCell('score');
    const s = Math.round((a.score ?? 0) * 100);
    scoreCell.font = { bold: true, color: { argb: scoreColor(s) } };
    scoreCell.fill = scoreFill(s);
    if (i % 2 === 0) r.getCell('audit').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0d1117' } };
  });

  // ── Sheet 5: Score History ─────────────────────────────────────────
  if (history.length > 0) {
    const histSheet = wb.addWorksheet('Score History');
    histSheet.columns = [
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Avg Score', key: 'score', width: 12 },
      { header: 'Grade', key: 'grade', width: 10 },
      { header: 'Performance', key: 'perf', width: 14 },
      { header: 'SEO', key: 'seo', width: 10 },
      { header: 'Accessibility', key: 'a11y', width: 14 },
      { header: 'Best Practices', key: 'bp', width: 16 },
      { header: 'Issues', key: 'issues', width: 10 },
    ];
    histSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));

    history.forEach((h, i) => {
      const r = histSheet.addRow(h);
      ['score', 'perf', 'seo', 'a11y', 'bp'].forEach(key => {
        const val = h[key as keyof typeof h] as number | undefined;
        if (val !== undefined) {
          const c = r.getCell(key);
          c.font = { bold: true, color: { argb: scoreColor(val) } };
          c.fill = scoreFill(val);
        }
      });
      if (i % 2 === 0) r.getCell('date').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0d1117' } };
    });
  }

  // Generate and download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  let domain = result.url;
  try { domain = new URL(result.url).hostname; } catch {}
  link.download = `seo-report-${domain}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.click();
  URL.revokeObjectURL(link.href);
}
