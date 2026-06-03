'use client';

import { useState } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

const CALENDLY_URL = 'https://calendly.com/adil-makhdoom44/30min';

const TYPES = [
  { value: 'bug',      label: '🐛 Bug Report' },
  { value: 'feature',  label: '💡 Feature Request' },
  { value: 'general',  label: '❓ General Question' },
  { value: 'strategy', label: '📞 Strategy Call' },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', type: 'general', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError]   = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.type === 'strategy') { window.open(CALENDLY_URL, '_blank'); return; }
    setStatus('sending'); setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setStatus('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '46px', padding: '0 14px',
    borderRadius: '10px', border: '1.5px solid var(--input-border)',
    background: 'var(--input-bg)', color: 'var(--text-primary)',
    fontSize: '14px', fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: 700,
    color: 'var(--text-faint)', textTransform: 'uppercase',
    letterSpacing: '0.07em', marginBottom: '6px',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>Get in touch</p>
            <h1 className="font-serif-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              We are here to help
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Have a question about your analysis results? Need hands-on help fixing your Showit site? Want to report a bug or suggest a feature? Reach out and we will get back to you.
            </p>
          </div>
        </section>

        {/* Contact options */}
        <section className="py-14 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Calendly - primary */}
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="no-underline block">
                <div className="h-full p-6 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', cursor: 'pointer' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="3" width="14" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
                        <path d="M1 7h14" stroke="white" strokeWidth="1.5"/>
                        <path d="M5 1v3M11 1v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="5.5" cy="10.5" r="1" fill="white"/>
                        <circle cx="8" cy="10.5" r="1" fill="white"/>
                        <circle cx="10.5" cy="10.5" r="1" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Book a Strategy Call</h2>
                      <p className="text-xs" style={{ color: '#6366f1' }}>Free 30-minute session</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Need expert help fixing issues on your Showit site? Book a free 1-on-1 strategy call. We help photographers, coaches, and creative entrepreneurs improve their SEO and site speed.
                  </p>
                  <div className="mt-4 text-sm font-semibold" style={{ color: '#6366f1' }}>Book your free call →</div>
                </div>
              </a>

              {/* Bug report */}
              <div
                className="h-full p-6 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                onClick={() => { set('type', 'bug'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                <div className="text-2xl mb-3">🐛</div>
                <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Report a Bug</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Found something broken? Tell us what URL you were analyzing and what went wrong. We fix bugs quickly.
                </p>
                <div className="mt-4 text-sm font-semibold text-indigo-500">Send bug report →</div>
              </div>

              {/* Feature request */}
              <div
                className="h-full p-6 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                onClick={() => { set('type', 'feature'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                <div className="text-2xl mb-3">💡</div>
                <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Feature Request</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Have an idea to make this tool better for Showit creators? We read every suggestion and build the most-requested features first.
                </p>
                <div className="mt-4 text-sm font-semibold text-indigo-500">Submit your idea →</div>
              </div>

              {/* General question */}
              <div
                className="h-full p-6 rounded-xl cursor-pointer"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                onClick={() => { set('type', 'general'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                <div className="text-2xl mb-3">❓</div>
                <h2 className="font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>General Question</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Something unclear about your results or how to fix an issue in Showit? Send us a message and we will explain it in plain English.
                </p>
                <div className="mt-4 text-sm font-semibold text-indigo-500">Ask a question →</div>
              </div>

            </div>
          </div>
        </section>

        {/* What we help with */}
        <section className="py-14 px-4" style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif-display text-2xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
              What our Showit experts help with
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: '🔍', text: 'Understanding your SEO score and which issues to fix first' },
                { icon: '⚡', text: 'Improving page speed and Core Web Vitals on Showit' },
                { icon: '📸', text: 'Optimizing portfolio images for faster loading and Google Images' },
                { icon: '🗺️', text: 'Setting up schema markup (LocalBusiness, FAQ) in Showit' },
                { icon: '🤖', text: 'Getting your site ready for AI Overviews and AI search citations' },
                { icon: '📝', text: 'Writing and structuring blog posts on the Showit + WordPress platform' },
                { icon: '🔗', text: 'Fixing broken links and improving internal linking structure' },
                { icon: '📊', text: 'Setting up Google Analytics 4 and Search Console on Showit' },
              ].map(item => (
                <div key={item.text} className="flex gap-3 items-start">
                  <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Form ── */}
        <section id="contact-form" className="py-16 px-4" style={{ borderBottom: '1px solid var(--divider)' }}>
          <div className="max-w-2xl mx-auto">

            <div className="text-center mb-10">
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: '10px' }}>Send a message</p>
              <h2 style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: '10px' }}>
                Get in touch directly
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                Fill in the form below and we'll reply to your email within 24 hours.
              </p>
            </div>

            {status === 'success' ? (
              <div style={{
                background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.25)',
                borderRadius: '16px', padding: '48px 32px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Message sent!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                  We've received your message and will reply within 24 hours.
                </p>
                <button
                  onClick={() => { setForm({ name: '', email: '', phone: '', type: 'general', message: '' }); setStatus('idle'); }}
                  style={{
                    background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)',
                    border: '1px solid var(--btn-primary-border)', borderRadius: '10px',
                    padding: '10px 24px', fontSize: '13px', fontWeight: 700,
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-card)',
                borderRadius: '20px', padding: '32px',
              }}>

                {/* Topic */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Topic <span style={{ color: '#ef4444' }}>*</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {TYPES.map(t => (
                      <button key={t.value} type="button" onClick={() => set('type', t.value)}
                        style={{
                          padding: '10px 14px', borderRadius: '10px', textAlign: 'left',
                          fontFamily: 'inherit', fontSize: '13px', fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.12s',
                          border: form.type === t.value ? '2px solid #6366f1' : '1.5px solid var(--border-card)',
                          background: form.type === t.value ? 'rgba(99,102,241,0.08)' : 'var(--input-bg)',
                          color: form.type === t.value ? '#6366f1' : 'var(--text-primary)',
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                    <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@yoursite.com" style={inputStyle} />
                  </div>
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Phone <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" style={inputStyle} />
                </div>

                {/* Message */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Message <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea
                    required value={form.message} onChange={e => set('message', e.target.value)}
                    rows={5}
                    placeholder={
                      form.type === 'bug'     ? 'What URL were you analyzing? What happened vs. what you expected?' :
                      form.type === 'feature' ? 'Describe your idea and why it would help Showit creators...' :
                      form.type === 'strategy'? 'Tell us a bit about your Showit site and what you want to improve...' :
                      'Type your message here...'
                    }
                    style={{ ...inputStyle, height: 'auto', padding: '12px 14px', resize: 'vertical', lineHeight: '1.6' }}
                  />
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626', marginBottom: '16px' }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={status === 'sending'} style={{
                  width: '100%', height: '50px', borderRadius: '12px',
                  background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)',
                  border: '1px solid var(--btn-primary-border)',
                  fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  transition: 'all 0.15s', letterSpacing: '0.01em',
                }}>
                  {status === 'sending' ? 'Sending…' : form.type === 'strategy' ? 'Open Calendly →' : 'Send message →'}
                </button>

                <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-faint)', textAlign: 'center' }}>
                  We reply within 24 hours · Your info is never shared
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Start with a free analysis
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Run the free analyzer first to see exactly what needs fixing on your Showit site. Then reach out if you need hands-on help.
            </p>
            <a href="/" className="inline-block px-7 py-3 rounded-lg text-sm font-semibold no-underline transition-opacity hover:opacity-80"
              style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: '1px solid var(--btn-primary-border)' }}>
              Run a free analysis first →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
