// Splash - cold start only. Now part of the light intro system: warm canvas, a
// soft teal glow and faint concentric gold rings behind the production mark, a
// gold ring drawing clockwise, wordmark, then tagline. Flows straight into the
// welcome with no dark-to-light whiplash. Tap after 800ms skips; reduced motion
// shows a static composed splash.
import React, { useEffect, useRef, useState } from 'react';
import { DeanyMark } from '../shared/AppScreen.jsx';
import { IX, SERIF, SANS } from './theme.js';

const CIRC = 302; // 2 * pi * 48

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CSS = `
@keyframes splGlow { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
@keyframes splLogo { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
@keyframes splRing { from { stroke-dashoffset: ${CIRC}; } to { stroke-dashoffset: 0; } }
@keyframes splWord { from { opacity: 0; letter-spacing: 14px; } to { opacity: 1; letter-spacing: 7px; } }
@keyframes splTag { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.spl-glow { animation: splGlow .8s ease-out both; }
.spl-logo { animation: splLogo .4s ease-out both; }
.spl-ring { animation: splRing .85s ease-out .25s both; }
.spl-word { animation: splWord .65s ease-out .7s both; }
.spl-tag  { animation: splTag .45s ease-out 1.2s both; }
@media (prefers-reduced-motion: reduce) {
  .spl-glow { animation: none !important; opacity: 1 !important; transform: none !important; }
  .spl-logo, .spl-word, .spl-tag { animation: none !important; opacity: 1 !important; transform: none !important; letter-spacing: 7px !important; }
  .spl-ring { animation: none !important; stroke-dashoffset: 0 !important; }
}`;

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const startRef = useRef(Date.now());

  const finish = () => { if (doneRef.current) return; doneRef.current = true; setLeaving(true); setTimeout(onDone, 300); };

  useEffect(() => {
    const total = reduced() ? 900 : 2100;
    const t = setTimeout(finish, total);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTap = () => { if (Date.now() - startRef.current >= 800) finish(); };

  return (
    <div onClick={onTap} style={{
      position: 'fixed', inset: 0, background: IX.canvas, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: SERIF, opacity: leaving ? 0 : 1, transition: 'opacity .3s ease', overflow: 'hidden',
    }}>
      <style>{CSS}</style>

      {/* soft teal glow + faint concentric gold rings, centred behind the mark */}
      <div className="spl-glow" aria-hidden="true" style={{
        position: 'absolute', width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,163,154,0.10) 0%, rgba(34,163,154,0.04) 40%, rgba(251,250,246,0) 70%)',
      }} />
      <svg className="spl-glow" viewBox="0 0 340 340" aria-hidden="true" style={{ position: 'absolute', width: 340, height: 340, opacity: 0.5, pointerEvents: 'none' }}>
        {[168, 130, 92].map((r, i) => (
          <circle key={i} cx="170" cy="170" r={r} fill="none" stroke={IX.gold} strokeWidth={1} strokeOpacity={0.12} />
        ))}
      </svg>

      <div style={{ position: 'relative', width: 108, height: 108, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="108" height="108" viewBox="0 0 108 108" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <circle className="spl-ring" cx="54" cy="54" r="48" fill="none" stroke={IX.gold} strokeWidth="2" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC} transform="rotate(-90 54 54)" />
        </svg>
        <span className="spl-logo"><DeanyMark size={76} /></span>
      </div>

      <div className="spl-word" style={{ fontSize: 22, letterSpacing: '7px', color: IX.tealDeep, fontWeight: 500, marginTop: 24 }}>DEANY</div>
      <div className="spl-tag" style={{ fontFamily: SANS, fontSize: 12, color: IX.muted, marginTop: 10 }}>Learn Islam, beautifully</div>
    </div>
  );
}
