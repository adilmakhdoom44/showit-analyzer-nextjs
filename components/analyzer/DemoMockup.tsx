'use client';

import { useState, useEffect, useRef } from 'react';

const STEPS = [
  {
    n: 1,
    label: 'Paste Your Showit URL',
    desc: 'Drop in your website URL — no account or login needed.',
    duration: 3800,
  },
  {
    n: 2,
    label: 'We Run 40+ Checks in Parallel',
    desc: 'SEO, speed, technical, and AI visibility — all analysed simultaneously in seconds.',
    duration: 4200,
  },
  {
    n: 3,
    label: 'Get Your Full Report',
    desc: 'Prioritised fixes with exact step-by-step instructions built for Showit.',
    duration: 4000,
  },
];

const CHECKS = [
  { label: 'Meta titles & descriptions', cat: 'SEO' },
  { label: 'Core Web Vitals (LCP, CLS, FID)', cat: 'Speed' },
  { label: 'Schema markup', cat: 'AI' },
  { label: 'Image optimisation', cat: 'Speed' },
  { label: 'H1 / heading structure', cat: 'SEO' },
  { label: 'AI Overview eligibility', cat: 'AI' },
  { label: 'Mobile responsiveness', cat: 'Technical' },
  { label: 'Sitemap & robots.txt', cat: 'Technical' },
];

const catColor: Record<string, string> = {
  SEO: '#16a34a',
  Speed: '#f59e0b',
  AI: '#6366f1',
  Technical: '#0ea5e9',
};

function PhoneStep1({ progress }: { progress: number }) {
  const typed = 'yoursite.com'.slice(0, Math.floor(progress * 12));
  return (
    <div style={{ padding: '12px 10px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {/* Mini brand */}
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'Georgia, serif', marginBottom: 4 }}>Showit Analyzer</div>
      {/* Mini headline */}
      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif' }}>
        Your Showit site,<br />
        <span style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>honestly evaluated.</span>
      </div>
      {/* Input */}
      <div style={{ width: '100%', display: 'flex', gap: 4, marginTop: 4 }}>
        <div style={{
          flex: 1, height: 26, borderRadius: 6,
          border: progress > 0.2 ? '1.5px solid #a5b4fc' : '1.5px solid var(--input-border)',
          background: 'var(--input-bg)', display: 'flex', alignItems: 'center', padding: '0 8px',
          boxShadow: progress > 0.2 ? '0 0 0 2px rgba(165,180,252,0.2)' : 'none',
          transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: 8, color: typed ? 'var(--text-primary)' : 'var(--text-faint)' }}>
            {typed || 'https://yoursite.com'}
            {typed && progress < 0.95 && <span style={{ borderRight: '1px solid var(--text-primary)', marginLeft: 1, animation: 'blink 0.8s step-end infinite' }} />}
          </span>
        </div>
        <div style={{
          height: 26, padding: '0 8px', borderRadius: 6,
          background: progress > 0.85 ? 'var(--btn-primary-bg)' : 'rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center',
          transition: 'all 0.4s',
          transform: progress > 0.9 ? 'scale(0.96)' : 'scale(1)',
        }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: progress > 0.85 ? 'var(--btn-primary-text)' : '#6366f1' }}>Analyze →</span>
        </div>
      </div>
      {/* Floating mini score cards */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4, opacity: Math.min(1, progress * 3) }}>
        {[{l:'SEO',v:'84',c:'#16a34a'},{l:'Speed',v:'61',c:'#f59e0b'},{l:'AI',v:'72',c:'#6366f1'}].map(s => (
          <div key={s.l} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneStep2({ progress }: { progress: number }) {
  const visibleChecks = Math.floor(progress * CHECKS.length);
  return (
    <div style={{ padding: '10px 10px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, textAlign: 'center' }}>
        Analysing your site...
      </div>
      {/* Spinning ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '3px solid var(--border-card)',
          borderTop: '3px solid #6366f1',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
      {/* Progress label */}
      <div style={{ fontSize: 7, color: '#6366f1', fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>
        {Math.round(progress * 40)}/40+ checks complete
      </div>
      {/* Check list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, overflow: 'hidden' }}>
        {CHECKS.slice(0, visibleChecks + 1).map((c, i) => (
          <div key={c.label} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            opacity: i < visibleChecks ? 1 : 0.5,
            animation: i === visibleChecks ? 'fadeUp 0.3s ease' : 'none',
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: i < visibleChecks ? '#16a34a' : 'var(--border-card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 7, color: '#fff',
              transition: 'all 0.3s',
            }}>
              {i < visibleChecks ? '✓' : ''}
            </div>
            <span style={{ fontSize: 7, color: i < visibleChecks ? 'var(--text-primary)' : 'var(--text-faint)' }}>{c.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: 6, fontWeight: 700, color: catColor[c.cat], flexShrink: 0 }}>{c.cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneStep3({ progress }: { progress: number }) {
  const scores = [
    { label: 'SEO Score', value: 78, color: '#16a34a', grade: 'Good' },
    { label: 'Page Speed', value: 61, color: '#f59e0b', grade: 'Needs work' },
    { label: 'AI Visibility', value: 72, color: '#6366f1', grade: 'Average' },
    { label: 'Technical', value: 85, color: '#0ea5e9', grade: 'Great' },
  ];
  const tabs = ['Overview', 'SEO', 'Speed', 'AI', 'Technical'];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Mini tab bar */}
      <div style={{ display: 'flex', gap: 1, padding: '6px 6px 0', borderBottom: '1px solid var(--border-card)' }}>
        {tabs.map((t, i) => (
          <div key={t} style={{
            fontSize: 6, padding: '2px 4px', borderRadius: '4px 4px 0 0', fontWeight: i === 0 ? 700 : 400,
            background: i === 0 ? 'var(--bg-card)' : 'transparent',
            color: i === 0 ? '#6366f1' : 'var(--text-faint)',
            borderBottom: i === 0 ? '2px solid #6366f1' : 'none',
          }}>{t}</div>
        ))}
      </div>
      {/* Score grid */}
      <div style={{ padding: '8px 6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {scores.map((s, i) => {
          const p = Math.max(0, Math.min(1, (progress * 4) - i));
          return (
            <div key={s.label} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: 6, padding: '6px',
              transform: `translateY(${(1 - p) * 8}px)`,
              opacity: p,
              transition: 'all 0.4s ease',
            }}>
              <div style={{ fontSize: 6, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              {/* Score bar */}
              <div style={{ height: 3, background: 'var(--border-card)', borderRadius: 99, marginTop: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${s.value * p}%`, background: s.color, borderRadius: 99, transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ fontSize: 6, color: 'var(--text-faint)', marginTop: 2 }}>{s.grade}</div>
            </div>
          );
        })}
      </div>
      {/* Issues count */}
      <div style={{ padding: '0 6px', opacity: progress > 0.7 ? 1 : 0, transition: 'opacity 0.5s', marginTop: 'auto', paddingBottom: 8 }}>
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '5px 7px' }}>
          <div style={{ fontSize: 7, fontWeight: 700, color: '#6366f1' }}>12 issues found · 3 critical</div>
          <div style={{ fontSize: 6, color: 'var(--text-faint)', marginTop: 1 }}>Exact fixes included for each →</div>
        </div>
      </div>
    </div>
  );
}

export default function DemoMockup() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const duration = STEPS[step].duration;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          startRef.current = 0;
          setProgress(0);
          setStep(s => (s + 1) % STEPS.length);
        }, 400);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [step, playing]);

  const goTo = (i: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = 0;
    setStep(i);
    setProgress(0);
    setPlaying(true);
  };

  return (
    <section style={{ padding: '72px 16px', background: 'var(--bg-body)', borderTop: '1px solid var(--divider)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes phoneEntrance { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .demo-step-btn:hover { opacity: 0.8; }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(99,102,241,0.08)', color: '#6366f1',
            border: '1px solid rgba(99,102,241,0.2)', borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            padding: '5px 14px', textTransform: 'uppercase', marginBottom: 16,
          }}>See it in action</span>
          <h2 style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.1,
          }}>
            Simple. Progress. Results in 3 Steps.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 440, margin: '0 auto' }}>
            From URL to full audit in under 30 seconds — no login, no waiting.
          </p>
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* Phone mockup */}
          <div style={{ flexShrink: 0, animation: 'phoneEntrance 0.7s ease forwards' }}>
            {/* Outer phone shell */}
            <div style={{
              width: 200,
              background: 'var(--text-primary)',
              borderRadius: 28,
              padding: 4,
              boxShadow: '0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)',
              position: 'relative',
            }}>
              {/* Side button */}
              <div style={{ position: 'absolute', right: -3, top: 60, width: 3, height: 24, background: 'var(--text-primary)', borderRadius: '0 2px 2px 0' }} />
              <div style={{ position: 'absolute', left: -3, top: 50, width: 3, height: 18, background: 'var(--text-primary)', borderRadius: '2px 0 0 2px' }} />
              <div style={{ position: 'absolute', left: -3, top: 74, width: 3, height: 18, background: 'var(--text-primary)', borderRadius: '2px 0 0 2px' }} />

              {/* Screen */}
              <div style={{
                borderRadius: 24,
                background: 'var(--bg-body)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Notch */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 60, height: 16,
                  background: 'var(--text-primary)',
                  borderRadius: '0 0 12px 12px',
                  zIndex: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                  <div style={{ width: 24, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }} />
                </div>

                {/* Screen content */}
                <div style={{ paddingTop: 20, height: 360 }}>
                  <div style={{
                    height: '100%',
                    transition: 'opacity 0.3s ease',
                  }}>
                    {step === 0 && <PhoneStep1 progress={progress} />}
                    {step === 1 && <PhoneStep2 progress={progress} />}
                    {step === 2 && <PhoneStep3 progress={progress} />}
                  </div>
                </div>

                {/* Home indicator */}
                <div style={{ height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 50, height: 4, borderRadius: 99, background: 'var(--border-card)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Step descriptions */}
          <div style={{ flex: 1, minWidth: 260, maxWidth: 380 }}>
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                className="demo-step-btn"
                onClick={() => goTo(i)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none',
                  border: 'none', cursor: 'pointer', padding: '16px 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid var(--divider)' : 'none',
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                  transition: 'opacity 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {/* Step number + progress ring */}
                <div style={{ flexShrink: 0, position: 'relative', width: 40, height: 40 }}>
                  <svg width="40" height="40" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                    <circle cx="20" cy="20" r="17" fill="none" stroke="var(--border-card)" strokeWidth="2" />
                    {i === step && (
                      <circle
                        cx="20" cy="20" r="17" fill="none"
                        stroke="#6366f1" strokeWidth="2.5"
                        strokeDasharray={`${2 * Math.PI * 17}`}
                        strokeDashoffset={`${2 * Math.PI * 17 * (1 - progress)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                      />
                    )}
                    {i < step && (
                      <circle cx="20" cy="20" r="17" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeDasharray={`${2 * Math.PI * 17}`} strokeDashoffset="0" />
                    )}
                  </svg>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: i < step ? 14 : 13,
                    fontWeight: 800,
                    color: i === step ? '#6366f1' : i < step ? '#16a34a' : 'var(--text-faint)',
                  }}>
                    {i < step ? '✓' : s.n}
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 700,
                    color: i === step ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginBottom: 4, transition: 'color 0.2s',
                  }}>{s.label}</div>
                  <div style={{
                    fontSize: '0.82rem', color: 'var(--text-faint)',
                    lineHeight: 1.5, maxWidth: 280,
                    opacity: i === step ? 1 : 0.7,
                  }}>{s.desc}</div>

                  {/* Progress bar under active step */}
                  {i === step && (
                    <div style={{ marginTop: 8, height: 3, background: 'var(--border-card)', borderRadius: 99, width: '100%', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                        borderRadius: 99,
                        width: `${progress * 100}%`,
                        transition: 'width 0.1s linear',
                      }} />
                    </div>
                  )}
                </div>
              </button>
            ))}

            {/* Play/pause */}
            <button
              onClick={() => setPlaying(p => !p)}
              style={{
                marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: '1.5px solid var(--border-card)',
                borderRadius: 999, padding: '7px 16px', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 14 }}>{playing ? '⏸' : '▶️'}</span>
              {playing ? 'Pause demo' : 'Play demo'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
