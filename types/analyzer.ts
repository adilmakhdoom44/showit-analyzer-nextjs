export interface PageData {
  title: string;
  metaDesc: string;
  headings: { tag: string; text: string }[];
  images: { src: string; alt: string; hasAlt: boolean; loading: string; width: number; height: number }[];
  links: { href: string; text: string; isEmpty: boolean }[];
  og: { title: string; description: string; image: string };
  twitter: { card: string; title: string; description: string; image: string };
  schema: number;
  schemaRaw: Record<string, unknown>[];
  wordCount: number;
  regions: { header: boolean; nav: boolean; main: boolean; footer: boolean };
  lang: string;
  favicon: string;
  touchIcon: string;
  forms: number;
  emailInputs: number;
  hasMailto: boolean;
  hasTel: boolean;
  bodyText: string;
  canonical: string;
  metaRobots: string;
  hasNoIndex: boolean;
  hasNoFollow: boolean;
  privacyLink: boolean;
  termsLink: boolean;
  analytics: { ga4: boolean; gtm: boolean; ua: boolean; metaPixel: boolean; hotjar: boolean };
}

export interface PSIResult {
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    seo: { score: number };
    'best-practices': { score: number };
  };
  audits: Record<string, PSIAudit>;
  lighthouseResult?: {
    audits: Record<string, PSIAudit>;
    categories: PSIResult['categories'];
  };
}

export interface PSIAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  details?: {
    type: string;
    items?: Record<string, unknown>[];
    overallSavingsMs?: number;
    data?: string;
  };
  numericValue?: number;
}

export interface AnalysisResult {
  url: string;
  mobile: PSIResult;
  desktop: PSIResult;
  pageData: PageData;
}

export interface FixItem {
  id: string;
  icon: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
  impact: string;
  steps: string[];
  tip?: string;
}

export type ScoreClass = 'good' | 'warn' | 'poor';
