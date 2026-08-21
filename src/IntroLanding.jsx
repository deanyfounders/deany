import React, { useState, useEffect } from 'react';
import QuizSection from './components/QuizSection.jsx';

// Website front door: a bright, colourful single-screen hero. Bold headline that
// colour-codes "at any level" into Beginner / Intermediate / Advanced, a gold
// Install CTA, and the real "Deany way" quiz as the interactive card on the
// right. Sits IN FRONT of the full website; "continue on the web" hands off.
// Website-only; the installed PWA never sees it.
const C = {
  canvas: '#FBFAF6', surface: '#FFFFFF',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  tealSoft: '#DCF3EF', goldTint: '#F7ECC9',
  gold: '#F0B429', goldDk: '#C8901A', goldInk: '#5A3E00',
  coral: '#E8523A', coralSoft: '#FCDDD5',
  text: '#173A4A', textMuted: '#5E7480', textFaint: '#94A3AA',
  border: 'rgba(15,76,92,0.12)',
};
const serif = 'Georgia, serif';
const sans = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
const HEAD = 'clamp(38px, 6.2vw, 60px)';

const LEVELS = [
  { text: 'at', label: 'Beginner', color: C.teal },
  { text: 'any', label: 'Intermediate', color: C.goldDk },
  { text: 'level.', label: 'Advanced', color: C.coral },
];

const PLATFORMS = [
  { title: 'iPhone & iPad', sub: 'in Safari', color: C.teal, tint: C.tealSoft,
    steps: ['Tap the three dots (•••) at the bottom right', 'Tap Share, then "Add to Home Screen"', 'Tap Add, Deany joins your apps'] },
  { title: 'Android', sub: 'in Chrome', color: C.coral, tint: C.coralSoft,
    steps: ['Open Deany in Chrome', 'Tap the ⋮ menu (top right)', 'Choose "Install app" or "Add to Home Screen"'] },
];

const isStandalone = () => typeof window !== 'undefined'
  && Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone);

const DeanyMark = ({ size = 34 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, flexShrink: 0,
    background: 'linear-gradient(145deg,#22A39A,#0F6E56)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: serif, fontSize: size * 0.48, boxShadow: '0 4px 12px rgba(15,76,92,0.18)' }}>{'د'}</div>
);

const ArrowDown = ({ color }) => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden>
    <path d="M8 1 V12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M3 8 l5 5 5-5" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Blob = ({ color, size, style }) => (
  <div aria-hidden style={{ position: 'absolute', width: size, height: size, borderRadius: '50%',
    background: color, filter: 'blur(70px)', opacity: 0.55, pointerEvents: 'none', ...style }} />
);

export default function IntroLanding() {
  const [deferred, setDeferred] = useState(null);
  const [showHow, setShowHow] = useState(true);
  const [installed] = useState(isStandalone);

  useEffect(() => {
    const onBIP = (e) => { e.preventDefault(); setDeferred(e); };
    window.addEventListener('beforeinstallprompt', onBIP);
    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  // Launch the app-mode PWA in the browser (same experience as the installed
  // app; the manifest's start_url is also /?app=1).
  const openApp = () => { try { window.location.assign('/?app=1'); } catch (_) {} };

  const install = async () => {
    if (installed) { openApp(); return; }
    if (deferred) {
      deferred.prompt();
      try { await deferred.userChoice; } catch (_) {}
      setDeferred(null);
      return;
    }
    setShowHow(true); // no native prompt (iOS, etc.): show the how-to
  };

  const ctaLabel = installed ? 'Open Deany' : 'Install';

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', background: C.canvas, color: C.text, fontFamily: sans, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Blob color={C.tealSoft} size={420} style={{ top: -120, left: -100 }} />
      <Blob color={C.goldTint} size={460} style={{ top: -80, right: -140 }} />
      <Blob color={C.coralSoft} size={380} style={{ bottom: -140, right: 120 }} />
      <Blob color={C.tealSoft} size={300} style={{ bottom: -120, left: -60 }} />

      <style>{`
        @keyframes introUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .iu { animation: introUp .55s cubic-bezier(.2,.7,.3,1) both; }
        .il-grid { display: grid; grid-template-columns: 1fr; gap: 26px; align-items: center; }
        @media (min-width: 940px) { .il-grid { grid-template-columns: 1.02fr 0.98fr; gap: 52px; } }
        .il-how { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 560px) { .il-how { grid-template-columns: 1fr 1fr; } }
        .il-pill { transition: transform .15s ease, filter .15s ease, box-shadow .15s ease; }
        .il-pill:hover { transform: translateY(-2px); filter: brightness(1.04); }
        .il-pill:active { transform: translateY(0); }
        .il-pill:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 3px; }
        .il-link { transition: color .15s ease; }
        .il-link:hover { color: ${C.tealDeep}; }
        @media (prefers-reduced-motion: reduce) { .iu, .il-pill { animation: none; transition: none; } }
      `}</style>

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 1, flexShrink: 0, width: '100%', maxWidth: 1160, margin: '0 auto',
        padding: 'calc(env(safe-area-inset-top) + 20px) 24px 0', display: 'flex', alignItems: 'center', gap: 11 }}>
        <DeanyMark />
        <div style={{ fontFamily: serif, fontSize: 19, fontWeight: 600, color: C.tealDeep, letterSpacing: '.5px' }}>Deany</div>
        <button className="il-pill" onClick={install} style={{ marginLeft: 'auto', minHeight: 40, padding: '0 20px', borderRadius: 999,
          background: 'linear-gradient(135deg,#22A39A,#0F6E56)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, fontFamily: sans,
          boxShadow: '0 6px 18px rgba(34,163,154,.32)', WebkitTapHighlightColor: 'transparent' }}>
          {ctaLabel}
        </button>
      </header>

      {/* Hero */}
      <main style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', width: '100%', maxWidth: 1160, margin: '0 auto', padding: '18px 24px 28px' }}>
        <div className="il-grid" style={{ width: '100%' }}>

          {/* Left */}
          <div className="iu" style={{ textAlign: 'left' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.tealSoft, color: C.tealDeep, fontSize: 11.5, fontWeight: 700,
              letterSpacing: '1.3px', textTransform: 'uppercase', padding: '7px 14px', borderRadius: 999 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.coral }} />
              Learn Islam, beautifully
            </span>

            {/* Colour-coded, level-labelled headline */}
            <h1 aria-label="Start at any level" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', columnGap: 15, rowGap: 8, margin: '30px 0 0' }}>
              <span style={{ fontFamily: sans, fontWeight: 800, color: C.tealDeep, letterSpacing: '-0.02em', fontSize: HEAD, lineHeight: 1 }}>Start</span>
              {LEVELS.map((l) => (
                <span key={l.label} aria-hidden style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.7px', textTransform: 'uppercase', color: l.color }}>{l.label}</span>
                    <ArrowDown color={l.color} />
                  </span>
                  <span style={{ fontFamily: sans, fontWeight: 800, letterSpacing: '-0.02em', fontSize: HEAD, lineHeight: 1, color: l.color }}>{l.text}</span>
                </span>
              ))}
            </h1>

            <p style={{ fontSize: 'clamp(15px, 1.6vw, 18px)', color: C.textMuted, lineHeight: 1.6, margin: '28px 0 0', maxWidth: 440 }}>
              Interactive lessons that meet you where you are. Try one right now. No sign-up, nothing to download.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', margin: '30px 0 0' }}>
              <button className="il-pill" onClick={install} style={{ minHeight: 54, padding: '0 30px', borderRadius: 14,
                background: 'linear-gradient(135deg,#F5C542,#F0B429)', color: C.goldInk, border: 'none', cursor: 'pointer', fontFamily: sans, fontSize: 16, fontWeight: 800,
                boxShadow: '0 3px 0 ' + C.goldDk + ', 0 14px 30px rgba(240,180,41,.42)', WebkitTapHighlightColor: 'transparent' }}>
                {ctaLabel}
              </button>
              <span style={{ fontSize: 13.5, color: C.textMuted, fontWeight: 600 }}>Free &middot; no sign-up</span>
            </div>

            {!installed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '16px 0 0', flexWrap: 'wrap' }}>
                <button className="il-link" onClick={() => setShowHow((v) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.tealDeep, fontSize: 13.5, fontWeight: 700, fontFamily: sans, padding: 0 }}>
                  {showHow ? 'Hide install steps' : 'How do I install?'}
                </button>
                <button className="il-link" onClick={openApp} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 13.5, fontWeight: 500, fontFamily: sans, padding: 0 }}>
                  or use it on the web &rarr;
                </button>
              </div>
            )}

            {showHow && !installed && (
              <div className="il-how iu" style={{ margin: '18px 0 0', maxWidth: 520 }}>
                {PLATFORMS.map((p) => (
                  <div key={p.title} style={{ background: C.surface, borderRadius: 14, padding: '14px 15px', border: '1px solid ' + C.border, boxShadow: '0 8px 24px rgba(15,76,92,.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 10 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: p.color }}>{p.title}</span>
                      <span style={{ fontSize: 11.5, color: C.textFaint }}>{p.sub}</span>
                    </div>
                    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {p.steps.map((s, i) => (
                        <li key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                          <span style={{ flexShrink: 0, width: 19, height: 19, borderRadius: '50%', background: p.tint, color: p.color, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                          <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.4 }}>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: the real Deany-way quiz */}
          <div className="iu" style={{ animationDelay: '.1s' }}>
            <QuizSection embedded />
          </div>
        </div>
      </main>
    </div>
  );
}
