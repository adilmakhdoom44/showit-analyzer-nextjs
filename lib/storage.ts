'use client';

const HISTORY_KEY = 'sac_url_history';
const CHECKLIST_KEY = 'showit_fix_progress';
const SCORE_HISTORY_KEY = 'sac_score_history';

export function saveUrlHistory(url: string): void {
  if (typeof window === 'undefined') return;
  const existing: string[] = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  const filtered = existing.filter(u => u !== url);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([url, ...filtered].slice(0, 15)));
}

export function getUrlHistory(): string[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
}

export function getFixProgress(url: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  const all: Record<string, Record<string, boolean>> = JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? '{}');
  return all[url] ?? {};
}

export function toggleFixProgress(url: string, fixId: string): void {
  if (typeof window === 'undefined') return;
  const all: Record<string, Record<string, boolean>> = JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? '{}');
  if (!all[url]) all[url] = {};
  all[url][fixId] = !all[url][fixId];
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(all));
}

export interface ScoreEntry {
  date: string;
  time: string;
  score: number;
  grade: string;
  perf?: number;
  seo?: number;
  a11y?: number;
  bp?: number;
  issues?: number;
}

export function saveScoreHistory(url: string, score: number, grade: string, extra?: { perf?: number; seo?: number; a11y?: number; bp?: number; issues?: number }): void {
  if (typeof window === 'undefined') return;
  const key = `${SCORE_HISTORY_KEY}_${btoa(url).substring(0, 20)}`;
  const existing: ScoreEntry[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  const now = new Date();
  const entry: ScoreEntry = {
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score,
    grade,
    ...extra,
  };
  localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 20)));
}

export function getScoreHistory(url: string): ScoreEntry[] {
  if (typeof window === 'undefined') return [];
  const key = `${SCORE_HISTORY_KEY}_${btoa(url).substring(0, 20)}`;
  return JSON.parse(localStorage.getItem(key) ?? '[]');
}

export function deleteScoreHistoryEntry(url: string, index: number): void {
  if (typeof window === 'undefined') return;
  const key = `${SCORE_HISTORY_KEY}_${btoa(url).substring(0, 20)}`;
  const existing: ScoreEntry[] = JSON.parse(localStorage.getItem(key) ?? '[]');
  existing.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(existing));
}
