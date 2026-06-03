'use client';

import { useState, useEffect, useRef } from 'react';
import { useAnalyzer } from '@/lib/analyzer-context';
import { getUrlHistory } from '@/lib/storage';

interface Vec2 { x: number; y: number; }

function useFleeCard(threshold = 160, strength = 90) {
  const ref = useRef<HTMLDivElement>(null);
  const [flee, setFlee] = useState<Vec2>({ x: 0, y: 0 });
  const fleeing = useRef(false);

  const onMouseMove = (mx: number, my: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < threshold) {
      fleeing.current = true;
      const force = Math.pow((threshold - dist) / threshold, 1.5);
      setFlee({
        x: -(dx / dist) * strength * force,
        y: -(dy / dist) * strength * force,
      });
    } else if (fleeing.current) {
      fleeing.current = false;
      setFlee({ x: 0, y: 0 });
    }
  };

  return { ref, flee, onMouseMove };
}

export default function HeroSection() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { analyze } = useAnalyzer();
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const cardA = useFleeCard(160, 90);
  const cardB = useFleeCard(160, 90);
  const cardC = useFleeCard(160, 90);
  const cardD = useFleeCard(160, 90);

  useEffect(() => { setHistory(getUrlHistory()); }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    cardA.onMouseMove(e.clientX, e.clientY);
    cardB.onMouseMove(e.clientX, e.clientY);
    cardC.onMouseMove(e.clientX, e.clientY);
    cardD.onMouseMove(e.clientX, e.clientY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) analyze(url.trim());
  };

  const filtered = history.filter(u => u.toLowerCase().includes(url.toLowerCase()));

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-center justify-center px-4 text-center"
      style={{ paddingTop: '80px', paddingBottom: '72px', background: 'var(--bg-body)' }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA {
          0%   { transform: translateY(0px) rotate(-2deg) scale(1); }
          30%  { transform: translateY(-14px) rotate(-3.5deg) scale(1.03); }
          60%  { transform: translateY(-6px) rotate(-1deg) scale(1.01); }
          100% { transform: translateY(0px) rotate(-2deg) scale(1); }
        }
        @keyframes floatB {
          0%   { transform: translateY(0px) rotate(2deg) scale(1); }
          40%  { transform: translateY(-18px) rotate(3deg) scale(1.04); }
          70%  { transform: translateY(-8px) rotate(1.5deg) scale(1.01); }
          100% { transform: translateY(0px) rotate(2deg) scale(1); }
        }
        @keyframes floatC {
          0%   { transform: translateY(0px) rotate(-1deg) scale(1); }
          35%  { transform: translateY(-12px) rotate(-2.5deg) scale(1.03); }
          65%  { transform: translateY(-4px) rotate(0deg) scale(1.01); }
          100% { transform: translateY(0px) rotate(-1deg) scale(1); }
        }
        @keyframes scorePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.75; transform: scale(1.08); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cardEntryA {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardEntryB {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardEntryC {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .h-fade-1 { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .h-fade-2 { animation: fadeUp 0.6s 0.12s ease forwards; opacity: 0; }
        .h-fade-3 { animation: fadeUp 0.6s 0.24s ease forwards; opacity: 0; }
        .h-fade-4 { animation: fadeUp 0.6s 0.36s ease forwards; opacity: 0; }
        .h-fade-5 { animation: fadeUp 0.6s 0.5s ease forwards; opacity: 0; }
        .h-fade-6 { animation: fadeUp 0.6s 0.64s ease forwards; opacity: 0; }
        @keyframes floatD {
          0%   { transform: translateY(0px) rotate(1.5deg) scale(1); }
          40%  { transform: translateY(-11px) rotate(2.5deg) scale(1.03); }
          70%  { transform: translateY(-5px) rotate(0.5deg) scale(1.01); }
          100% { transform: translateY(0px) rotate(1.5deg) scale(1); }
        }
        @keyframes cardEntryD {
          from { opacity: 0; transform: translateX(-40px) rotate(1.5deg); }
          to   { opacity: 1; transform: translateX(0) rotate(1.5deg); }
        }
        .card-inner-a { animation: floatA 5s 1s ease-in-out infinite; }
        .card-inner-b { animation: floatB 6.5s 1.2s ease-in-out infinite; }
        .card-inner-c { animation: floatC 4.5s 1.4s ease-in-out infinite; }
        .card-inner-d { animation: floatD 5.8s 1.6s ease-in-out infinite; }
        .card-wrap-a  { animation: cardEntryA 0.7s 0.3s ease forwards; opacity: 0; }
        .card-wrap-b  { animation: cardEntryB 0.7s 0.5s ease forwards; opacity: 0; }
        .card-wrap-c  { animation: cardEntryC 0.7s 0.7s ease forwards; opacity: 0; }
        .card-wrap-d  { animation: cardEntryD 0.7s 0.9s ease forwards; opacity: 0; }
        .score-num { animation: scorePulse 3s ease-in-out infinite; display: inline-block; }
        .score-label {
          background: linear-gradient(90deg, var(--text-faint) 0%, rgba(99,102,241,0.7) 50%, var(--text-faint) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .analyze-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,0,0,0.30) !important; }
        .analyze-btn { transition: all 0.15s ease; }
        .hero-input:focus {
          border-color: #a5b4fc !important;
          box-shadow: 0 0 0 3px rgba(165,180,252,0.2) !important;
        }
      `}</style>

      {/* Subtle top highlight */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(165,180,252,0.12) 0%, transparent 100%)',
        pointerEvents: 'none', overflow: 'hidden',
      }} />

      {/* Floating score cards — pointer-events ON so mouse proximity works */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>

        {/* SEO card — flee wrapper → float inner */}
        <div
          className="card-wrap-a"
          style={{ position: 'absolute', top: '18%', left: '5%' }}
        >
          <div
            ref={cardA.ref}
            style={{
              transform: `translate(${cardA.flee.x}px, ${cardA.flee.y}px)`,
              transition: cardA.flee.x === 0 && cardA.flee.y === 0
                ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'
                : 'transform 0.12s ease-out',
            }}
          >
            <div className="card-inner-a" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: '16px', padding: '14px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)', minWidth: '140px',
            }}>
              <div className="score-label" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>SEO Score</div>
              <div className="score-num" style={{ fontSize: '32px', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>84</div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: 4 }}>Good · 3 issues</div>
            </div>
          </div>
        </div>

        {/* Speed card */}
        <div
          className="card-wrap-b"
          style={{ position: 'absolute', top: '12%', right: '6%' }}
        >
          <div
            ref={cardB.ref}
            style={{
              transform: `translate(${cardB.flee.x}px, ${cardB.flee.y}px)`,
              transition: cardB.flee.x === 0 && cardB.flee.y === 0
                ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'
                : 'transform 0.12s ease-out',
            }}
          >
            <div className="card-inner-b" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: '16px', padding: '14px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)', minWidth: '140px',
            }}>
              <div className="score-label" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Page Speed</div>
              <div className="score-num" style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', lineHeight: 1, animationDelay: '1s' }}>61</div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: 4 }}>Needs work · LCP</div>
            </div>
          </div>
        </div>

        {/* Technical Score card — bottom-left */}
        <div
          className="card-wrap-d"
          style={{ position: 'absolute', bottom: '22%', left: '5%' }}
        >
          <div
            ref={cardD.ref}
            style={{
              transform: `translate(${cardD.flee.x}px, ${cardD.flee.y}px)`,
              transition: cardD.flee.x === 0 && cardD.flee.y === 0
                ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'
                : 'transform 0.12s ease-out',
            }}
          >
            <div className="card-inner-d" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: '16px', padding: '14px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)', minWidth: '140px',
            }}>
              <div className="score-label" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Technical</div>
              <div className="score-num" style={{ fontSize: '32px', fontWeight: 900, color: '#0ea5e9', lineHeight: 1, animationDelay: '1.5s' }}>85</div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: 4 }}>Great · 1 issue</div>
            </div>
          </div>
        </div>

        {/* AI Visibility card */}
        <div
          className="card-wrap-c"
          style={{ position: 'absolute', bottom: '22%', right: '4%' }}
        >
          <div
            ref={cardC.ref}
            style={{
              transform: `translate(${cardC.flee.x}px, ${cardC.flee.y}px)`,
              transition: cardC.flee.x === 0 && cardC.flee.y === 0
                ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'
                : 'transform 0.12s ease-out',
            }}
          >
            <div className="card-inner-c" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-card)',
              borderRadius: '16px', padding: '14px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)', minWidth: '140px',
            }}>
              <div className="score-label" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>AI Visibility</div>
              <div className="score-num" style={{ fontSize: '32px', fontWeight: 900, color: '#6366f1', lineHeight: 1, animationDelay: '2s' }}>72</div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: 4 }}>Schema missing</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10" style={{ maxWidth: '680px', width: '100%' }}>

        {/* Pill badge */}
        <div className="h-fade-1" style={{ marginBottom: 32 }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(99,102,241,0.08)',
            color: '#6366f1',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '5px 14px',
            textTransform: 'uppercase',
          }}>Free · No signup required</span>
        </div>

        {/* Headline */}
        <h1
          className="h-fade-2"
          aria-label="Free Showit SEO Analyzer — Your Showit site, honestly evaluated."
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 5.6rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
            marginBottom: 28,
          }}
        >
          Your Showit site,<br />
          honestly{' '}
          <span style={{
            backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>evaluated.</span>
        </h1>

        {/* Subtext */}
        <p
          className="h-fade-3"
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            lineHeight: '1.7',
            maxWidth: '500px',
            margin: '0 auto 40px',
          }}
        >
          Paste your URL and get a Showit-specific breakdown of every SEO, speed, and AI visibility issue — with exact fixes, in 30 seconds.
        </p>

        {/* Category pills */}
        <div className="h-fade-4" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          {[
            { label: '🔍 SEO Analysis', bg: 'rgba(22,163,74,0.08)',   color: '#16a34a', border: 'rgba(22,163,74,0.2)' },
            { label: '⚡ Page Speed',   bg: 'rgba(245,158,11,0.08)',  color: '#d97706', border: 'rgba(245,158,11,0.2)' },
            { label: '🤖 AI Visibility',bg: 'rgba(99,102,241,0.08)', color: '#6366f1', border: 'rgba(99,102,241,0.2)' },
          ].map(p => (
            <span key={p.label} style={{
              background: p.bg, color: p.color, border: `1px solid ${p.border}`,
              borderRadius: '999px', fontSize: '12px', fontWeight: 600,
              padding: '6px 14px',
            }}>{p.label}</span>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="h-fade-5" style={{ display: 'flex', gap: 10, maxWidth: '540px', margin: '0 auto', position: 'relative', zIndex: 50 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              className="hero-input"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              placeholder="https://yoursite.com"
              style={{
                width: '100%', height: '54px', padding: '0 20px',
                borderRadius: '14px', border: '1.5px solid var(--input-border)',
                background: 'var(--input-bg)', color: 'var(--text-primary)',
                fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />
            {showHistory && filtered.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: 'var(--bg-card)', border: '1px solid var(--border-card)',
                borderRadius: 12, overflow: 'hidden', zIndex: 50,
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}>
                {filtered.map(u => (
                  <button key={u} type="button"
                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '13px', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sidebar)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onMouseDown={() => { setUrl(u); setShowHistory(false); }}>
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="analyze-btn"
            style={{
              height: '54px', padding: '0 28px', borderRadius: '14px',
              background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)',
              border: '1px solid var(--btn-primary-border)',
              fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
              letterSpacing: '0.01em', cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            }}
          >
            Analyze my site →
          </button>
        </form>

        {/* Trust note */}
        <p className="h-fade-6" style={{ marginTop: 24, fontSize: '12px', color: 'var(--text-faint)', position: 'relative', zIndex: 1 }}>
          Made for Showit creators by someone who builds on Showit.
        </p>
      </div>
    </section>
  );
}
