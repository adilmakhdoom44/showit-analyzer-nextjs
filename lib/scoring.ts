import type { PSIResult, ScoreClass } from '@/types/analyzer';

export function sClass(score: number | null): ScoreClass {
  if (score === null) return 'poor';
  if (score >= 0.9) return 'good';
  if (score >= 0.5) return 'warn';
  return 'poor';
}

export function sColor(score: number | null): string {
  const c = sClass(score);
  if (c === 'good') return '#10b981';
  if (c === 'warn') return '#f59e0b';
  return '#ef4444';
}

export function sLabel(score: number | null): string {
  const c = sClass(score);
  if (c === 'good') return 'Good';
  if (c === 'warn') return 'Needs Work';
  return 'Poor';
}

export function scorePercent(score: number | null): number {
  return Math.round((score ?? 0) * 100);
}

export function getGrade(categories: PSIResult['categories'], issueCount: number): { grade: string; color: string } {
  const scores = [
    categories.performance?.score ?? 0,
    categories.accessibility?.score ?? 0,
    categories.seo?.score ?? 0,
    categories['best-practices']?.score ?? 0,
  ];
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  // Small penalty per issue: capped at 0.10 max so issues never override real scores
  const penalty = Math.min(issueCount * 0.003, 0.10);
  const adjusted = avg - penalty;

  if (adjusted >= 0.90) return { grade: 'A+', color: '#10b981' };
  if (adjusted >= 0.80) return { grade: 'A',  color: '#10b981' };
  if (adjusted >= 0.70) return { grade: 'B',  color: '#34d399' };
  if (adjusted >= 0.60) return { grade: 'C',  color: '#f59e0b' };
  if (adjusted >= 0.50) return { grade: 'D',  color: '#f97316' };
  return { grade: 'F', color: '#ef4444' };
}

export function vitalsThresholds(id: string, value: number): ScoreClass {
  const thresholds: Record<string, [number, number]> = {
    'first-contentful-paint': [1800, 3000],
    'largest-contentful-paint': [2500, 4000],
    'total-blocking-time': [200, 600],
    'cumulative-layout-shift': [0.1, 0.25],
    'speed-index': [3400, 5800],
    'interactive': [3800, 7300],
  };
  const t = thresholds[id];
  if (!t) return sClass(null);
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'warn';
  return 'poor';
}

export function countIssues(audits: PSIResult['audits']): number {
  return Object.values(audits).filter(a => a.score !== null && a.score < 0.9).length;
}
