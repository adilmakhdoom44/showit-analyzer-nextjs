'use client';

import { useState } from 'react';
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
import { LayoutDashboard, Search, Zap, Link2, Wrench, Bot, Settings2 } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'speed', label: 'Speed', icon: Zap },
  { id: 'links', label: 'Links', icon: Link2 },
  { id: 'technical', label: 'Technical', icon: Wrench },
  { id: 'ai', label: 'AI Visibility', icon: Bot },
  { id: 'tools', label: 'Tools', icon: Settings2 },
];

export default function ResultsDashboard({ result }: { result: AnalysisResult }) {
  const [activeTab, setActiveTab] = useState('overview');
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tab nav — horizontal scroll on mobile, vertical sidebar on desktop */}
          <div className="nav-sidebar flex-shrink-0 md:w-48 md:self-start md:sticky md:top-16">
            {/* Mobile: wrapped grid — all tabs visible, nothing hidden */}
            <div className="md:hidden w-full p-1.5 rounded-2xl"
              style={{ background: '#0d1630', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="grid grid-cols-4 gap-1">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl font-medium transition-all"
                    style={{
                      background: activeTab === t.id ? 'rgba(99,102,241,0.25)' : 'transparent',
                      color: activeTab === t.id ? '#a5b4fc' : '#94a3b8',
                      border: 'none', cursor: 'pointer', fontSize: 10, lineHeight: 1.2,
                    }}>
                    <t.icon size={15} />
                    <span>{t.label === 'AI Visibility' ? 'AI' : t.label === 'Technical' ? 'Tech' : t.label === 'Overview' ? 'Overview' : t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop: vertical sidebar */}
            <TabsList
              className="hidden md:flex md:flex-col w-full gap-1 p-2 rounded-2xl"
              style={{ background: '#0d1630', border: '1px solid rgba(99,102,241,0.2)', height: 'auto' }}>
              {TABS.map(t => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="md:w-full md:justify-start rounded-xl text-sm font-medium transition-all px-3 py-2.5 data-[state=active]:text-white data-[state=active]:shadow-none flex items-center gap-2"
                  style={{ color: '#64748b' }}>
                  <t.icon size={14} />
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
                  {tab === 'overview' && <OverviewTab result={result} onNavigateToTab={setActiveTab} />}
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
