'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';
import type { AnalysisResult } from '@/types/analyzer';
import OverviewTab from './tabs/OverviewTab';
import SEOTab from './tabs/SEOTab';
import SpeedTab from './tabs/SpeedTab';
import LinksTab from './tabs/LinksTab';
import TechnicalTab from './tabs/TechnicalTab';
import ToolsTab from './tabs/ToolsTab';
import AIVisibilityTab from './tabs/AIVisibilityTab';
import { getGrade, countIssues } from '@/lib/scoring';

const TABS = [
  { id: 'overview', label: '📋 Overview' },
  { id: 'seo', label: '🔍 SEO' },
  { id: 'speed', label: '⚡ Speed' },
  { id: 'links', label: '🔗 Links' },
  { id: 'technical', label: '🛠️ Technical' },
  { id: 'ai', label: '🤖 AI Visibility' },
  { id: 'tools', label: '🔧 Tools' },
];

export default function ResultsDashboard({ result }: { result: AnalysisResult }) {
  const audits = result.mobile.lighthouseResult?.audits ?? result.mobile.audits ?? {};
  const categories = result.mobile.lighthouseResult?.categories ?? result.mobile.categories;
  const issueCount = countIssues(audits);
  const { grade, color } = getGrade(categories, issueCount);

  let domain = result.url;
  try { domain = new URL(result.url).hostname; } catch {}

  return (
    <motion.section className="max-w-6xl mx-auto px-4 pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* Report header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-6 glass rounded-2xl">
        <div className="flex items-center gap-4">
          {result.pageData?.favicon && (
            <img src={result.pageData.favicon} alt="" className="w-10 h-10 rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{domain}</h2>
            <a href={result.url} target="_blank" rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:underline truncate block max-w-xs">{result.url}</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-3xl font-black" style={{ color }}>{grade}</div>
            <div className="text-xs text-slate-500">Grade</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="text-3xl font-black text-amber-400">{issueCount}</div>
            <div className="text-xs text-slate-500">Issues</div>
          </div>
        </div>
      </div>

      {/* Vertical tab layout */}
      <Tabs defaultValue="overview">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left sidebar */}
          <div className="nav-sidebar flex-shrink-0 md:w-48 md:self-start md:sticky md:top-16">
            <TabsList
              className="flex md:flex-col w-full gap-1 p-2 rounded-2xl"
              style={{ background: '#0d1630', border: '1px solid rgba(99,102,241,0.2)', height: 'auto' }}>
              {TABS.map(t => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="flex-1 md:w-full md:justify-start rounded-xl text-xs md:text-sm font-medium transition-all px-3 py-2.5 text-left data-[state=active]:text-white data-[state=active]:shadow-none"
                  style={{ color: '#64748b' }}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {['overview','seo','speed','links','technical','ai','tools'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
                  {tab === 'overview' && <OverviewTab result={result} />}
                  {tab === 'seo' && <SEOTab result={result} />}
                  {tab === 'speed' && <SpeedTab result={result} />}
                  {tab === 'links' && <LinksTab result={result} />}
                  {tab === 'technical' && <TechnicalTab result={result} />}
                  {tab === 'ai' && <AIVisibilityTab result={result} />}
                  {tab === 'tools' && <ToolsTab result={result} />}
                </motion.div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </motion.section>
  );
}
