'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AnalysisResult } from '@/types/analyzer';
import { saveUrlHistory, saveScoreHistory } from '@/lib/storage';
import { getGrade, countIssues } from '@/lib/scoring';

interface AnalyzerState {
  result: AnalysisResult | null;
  loading: boolean;
  loadingStep: number;
  error: string | null;
  analyze: (url: string) => Promise<void>;
  reset: () => void;
}

const AnalyzerContext = createContext<AnalyzerState | null>(null);

export function AnalyzerProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(1);

    const stepTimer = setInterval(() => {
      setLoadingStep(s => Math.min(s + 1, 5));
    }, 7000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed');
      saveUrlHistory(data.url);

      // Save score history
      const audits = data.mobile?.lighthouseResult?.audits ?? data.mobile?.audits ?? {};
      const categories = data.mobile?.lighthouseResult?.categories ?? data.mobile?.categories;
      const issueCount = countIssues(audits);
      const { grade } = getGrade(categories, issueCount);
      const avgScore = Math.round(
        ((categories?.performance?.score ?? 0) +
         (categories?.seo?.score ?? 0) +
         (categories?.accessibility?.score ?? 0) +
         (categories?.['best-practices']?.score ?? 0)) / 4 * 100
      );
      saveScoreHistory(data.url, avgScore, grade, {
        perf: Math.round((categories?.performance?.score ?? 0) * 100),
        seo: Math.round((categories?.seo?.score ?? 0) * 100),
        a11y: Math.round((categories?.accessibility?.score ?? 0) * 100),
        bp: Math.round((categories?.['best-practices']?.score ?? 0) * 100),
        issues: issueCount,
      });

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
      setLoadingStep(0);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
    setLoadingStep(0);
  }, []);

  return (
    <AnalyzerContext.Provider value={{ result, loading, loadingStep, error, analyze, reset }}>
      {children}
    </AnalyzerContext.Provider>
  );
}

export function useAnalyzer() {
  const ctx = useContext(AnalyzerContext);
  if (!ctx) throw new Error('useAnalyzer must be used inside AnalyzerProvider');
  return ctx;
}
