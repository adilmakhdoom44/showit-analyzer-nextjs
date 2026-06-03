import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.PAGESPEED_API_KEY!;
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const MAX_URLS = 20;

async function fetchPSIMobile(url: string) {
  const params = new URLSearchParams({ url, strategy: 'mobile', key: API_KEY, category: 'PERFORMANCE' });
  ['ACCESSIBILITY', 'SEO', 'BEST_PRACTICES'].forEach(c => params.append('category', c));
  const res = await fetch(`${PSI_URL}?${params}`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`PSI failed: ${res.status}`);
  return res.json();
}

export async function POST(req: NextRequest) {
  const { urls } = await req.json() as { urls: string[] };
  if (!urls?.length) return NextResponse.json({ error: 'No URLs provided' }, { status: 400 });

  const limited = urls.slice(0, MAX_URLS).map(u => u.startsWith('http') ? u : `https://${u}`);

  // Process with concurrency limit of 3 (safe for free PSI quota)
  const results: { url: string; status: 'ok' | 'error'; perf?: number; seo?: number; a11y?: number; bp?: number; issues?: number; error?: string }[] = [];

  const chunks: string[][] = [];
  for (let i = 0; i < limited.length; i += 3) chunks.push(limited.slice(i, i + 3));

  for (const chunk of chunks) {
    const settled = await Promise.allSettled(chunk.map(async (url) => {
      const data = await fetchPSIMobile(url);
      const cats = data.lighthouseResult?.categories ?? data.categories ?? {};
      const audits = data.lighthouseResult?.audits ?? data.audits ?? {};
      const issues = Object.values(audits as Record<string, { score: number | null }>)
        .filter(a => a.score !== null && a.score < 0.9).length;
      return {
        url,
        status: 'ok' as const,
        perf: Math.round((cats.performance?.score ?? 0) * 100),
        seo: Math.round((cats.seo?.score ?? 0) * 100),
        a11y: Math.round((cats.accessibility?.score ?? 0) * 100),
        bp: Math.round((cats['best-practices']?.score ?? 0) * 100),
        issues,
      };
    }));

    settled.forEach((r, i) => {
      if (r.status === 'fulfilled') results.push(r.value);
      else results.push({ url: chunk[i], status: 'error', error: String(r.reason) });
    });

    // Small delay between chunks to respect rate limits
    if (chunks.indexOf(chunk) < chunks.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return NextResponse.json({ results });
}
