import { NextRequest, NextResponse } from 'next/server';
import Bottleneck from 'bottleneck';

const API_KEY = process.env.PAGESPEED_API_KEY!;
const PSI_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

// Rate limiter: PSI free tier = 25,000 queries/day, 25/sec burst
// We do 2 calls per analysis (mobile + desktop) → safe up to 12,500 sites/day
const limiter = new Bottleneck({
  maxConcurrent: 4,
  minTime: 100, // 10 requests/sec max, well under 25/sec limit
  reservoir: 24000, // daily quota buffer (leaving 1000 headroom)
  reservoirRefreshAmount: 24000,
  reservoirRefreshInterval: 24 * 60 * 60 * 1000,
});

const FALLBACK_PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

const fetchPSI = limiter.wrap(async (url: string, strategy: 'mobile' | 'desktop') => {
  const params = new URLSearchParams({
    url,
    strategy,
    key: API_KEY,
    category: 'PERFORMANCE',
  });
  ['ACCESSIBILITY', 'SEO', 'BEST_PRACTICES'].forEach(c => params.append('category', c));
  const res = await fetch(`${PSI_URL}?${params}`);
  if (!res.ok) throw new Error(`PSI ${strategy} failed: ${res.status}`);
  return res.json();
});

async function fetchPageHTML(url: string): Promise<string | null> {
  // Direct server-side fetch first — no CORS restriction on server
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShowitAnalyzer/1.0; +https://showitanalyzer.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (res.ok) {
      const text = await res.text();
      if (text.length > 500) return text;
    }
  } catch {
    // fall through to proxies
  }

  // Fallback: CORS proxies
  for (const proxy of FALLBACK_PROXIES) {
    try {
      const res = await fetch(proxy(url), { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const text = await res.text();
        if (text.length > 500) return text;
      }
    } catch {
      // try next proxy
    }
  }
  return null;
}

function extractPageData(html: string, url: string) {
  // Parse key data from raw HTML using regex (no DOM available server-side)
  const get = (pattern: RegExp) => (html.match(pattern)?.[1] ?? '').trim();

  const title = get(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc = get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);

  const ogTitle = get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
  const ogDesc = get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
  const ogImage = get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i);
  const twCard = get(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i);
  const twTitle = get(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']*)["']/i);
  const twDesc = get(/<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']*)["']/i);
  const twImage = get(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']*)["']/i);
  const canonical = get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const metaRobots = get(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const lang = get(/<html[^>]+lang=["']([^"']*)["']/i);
  const favicon = get(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']*)["']/i);

  // Headings
  const headings: { tag: string; text: string }[] = [];
  const headingRe = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = headingRe.exec(html)) !== null) {
    headings.push({ tag: m[1].toUpperCase(), text: m[2].replace(/<[^>]+>/g, '').trim() });
    if (headings.length >= 50) break;
  }

  // Images
  const images: { src: string; alt: string; hasAlt: boolean; loading: string; width: number; height: number }[] = [];
  const imgRe = /<img([^>]*)>/gi;
  while ((m = imgRe.exec(html)) !== null) {
    const attrs = m[1];
    const src = (attrs.match(/src=["']([^"']*)["']/i)?.[1] ?? '');
    const alt = (attrs.match(/alt=["']([^"']*)["']/i)?.[1] ?? '');
    const loading = (attrs.match(/loading=["']([^"']*)["']/i)?.[1] ?? '');
    images.push({ src, alt, hasAlt: alt.length > 0, loading, width: 0, height: 0 });
    if (images.length >= 100) break;
  }

  // Links
  const links: { href: string; text: string; isEmpty: boolean }[] = [];
  const linkRe = /<a([^>]*)>([\s\S]*?)<\/a>/gi;
  while ((m = linkRe.exec(html)) !== null) {
    const href = (m[1].match(/href=["']([^"']*)["']/i)?.[1] ?? '');
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    links.push({ href, text, isEmpty: text.length === 0 });
    if (links.length >= 200) break;
  }

  // Analytics detection
  const hasGA4 = /gtag\s*\(\s*['"]config['"]|G-[A-Z0-9]+/.test(html);
  const hasGTM = /GTM-[A-Z0-9]+|googletagmanager\.com/.test(html);
  const hasUA = /UA-\d+-\d+/.test(html);
  const hasMetaPixel = /fbq\s*\(|connect\.facebook\.net/.test(html);
  const hasHotjar = /hotjar\.com|hjid/.test(html);

  // Schema
  const schemaMatches = html.match(/"@type"\s*:/g) ?? [];

  // Word count from body text - strip scripts, styles, and Showit JSON blobs first
  const cleanHtml = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')   // remove all JS
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')      // remove all CSS (font-face, keyframes etc.)
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')               // remove HTML comments
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')          // remove SVG
    .replace(/data-[\w-]+=["'][^"']*["']/gi, ' ')   // remove data-* attributes
    .replace(/\bdata:\S+/gi, ' ')                   // remove base64 data URIs
    .replace(/https?:\/\/\S+/gi, ' ');              // remove raw URLs
  const bodyText = cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 30000);
  const wordCount = bodyText.split(/\s+/).filter(w => w.length > 2).length;

  // Regions
  const regions = {
    header: /<header[\s>]/i.test(html),
    nav: /<nav[\s>]/i.test(html),
    main: /<main[\s>]/i.test(html),
    footer: /<footer[\s>]/i.test(html),
  };

  const domain = new URL(url).hostname;
  const faviconUrl = favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return {
    title, metaDesc,
    headings, images, links,
    og: { title: ogTitle, description: ogDesc, image: ogImage },
    twitter: { card: twCard, title: twTitle, description: twDesc, image: twImage },
    schema: schemaMatches.length,
    schemaRaw: [],
    wordCount, regions,
    lang, favicon: faviconUrl, touchIcon: '',
    forms: (html.match(/<form[\s>]/gi) ?? []).length,
    emailInputs: (html.match(/type=["']email["']/gi) ?? []).length,
    hasMailto: /href=["']mailto:/i.test(html),
    hasTel: /href=["']tel:/i.test(html),
    bodyText: bodyText.slice(0, 5000),
    canonical, metaRobots,
    hasNoIndex: /noindex/i.test(metaRobots),
    hasNoFollow: /nofollow/i.test(metaRobots),
    privacyLink: /privacy/i.test(html),
    termsLink: /terms/i.test(html),
    analytics: { ga4: hasGA4, gtm: hasGTM, ua: hasUA, metaPixel: hasMetaPixel, hotjar: hasHotjar },
  };
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const normalized = url.startsWith('http') ? url : `https://${url}`;

  try {
    const [mobile, desktop, html] = await Promise.all([
      fetchPSI(normalized, 'mobile'),
      fetchPSI(normalized, 'desktop'),
      fetchPageHTML(normalized),
    ]);

    const pageData = html ? extractPageData(html, normalized) : null;

    return NextResponse.json({ url: normalized, mobile, desktop, pageData });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
