import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All crawlers — default allow everything
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // Google — main + AI Overview (Gemini training)
      { userAgent: 'Googlebot',       allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Googlebot-Image', allow: '/' },
      // OpenAI — ChatGPT web browsing + GPT training
      { userAgent: 'GPTBot',          allow: '/' },
      { userAgent: 'ChatGPT-User',    allow: '/' },
      { userAgent: 'OAI-SearchBot',   allow: '/' },
      // Anthropic — Claude
      { userAgent: 'ClaudeBot',       allow: '/' },
      { userAgent: 'anthropic-ai',    allow: '/' },
      { userAgent: 'Claude-Web',      allow: '/' },
      // Perplexity
      { userAgent: 'PerplexityBot',   allow: '/' },
      // Microsoft — Bing + Copilot
      { userAgent: 'Bingbot',         allow: '/' },
      { userAgent: 'msnbot',          allow: '/' },
      // Apple
      { userAgent: 'Applebot',        allow: '/' },
      // Common Crawl (used by many AI training datasets)
      { userAgent: 'CCBot',           allow: '/' },
      // Meta — AI research
      { userAgent: 'FacebookBot',     allow: '/' },
      // Cohere
      { userAgent: 'cohere-ai',       allow: '/' },
      // You.com
      { userAgent: 'YouBot',          allow: '/' },
    ],
    sitemap: 'https://showitanalyzer.com/sitemap.xml',
    host: 'https://showitanalyzer.com',
  };
}
