// Splash - cold start only. Navy surface, gold diamond pattern, the production
// DeanyMark scaling in, a gold ring drawing clockwise, wordmark, then tagline.
// Tap after 800ms skips. Reduced motion shows a static composed splash.
import React, { useEffect, useRef, useState } from 'react';
import { DeanyMark } from '../shared/AppScreen.jsx';

const NAVY = '#1B2A4A';
const GOLD = '#F0B429';
const CIRC = 302; // 2 * pi * 48

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CSS = `
@keyframes splLogo { 0% { opacity: 0; transform: scale(0.7); } 60% { opacity: 1; transform: scale(1.06); } 100% { opacity: 1; transform: scale(1); } }
@keyframes splRing { from { stroke-dashoffset: ${CIRC}; } to { stroke-dashoffset: 0; } }
@keyframes splWord { from { opacity: 0; letter-spacing: 14px; } to { opacity: 1; letter-spacing: 7px; } }
@keyframes splTag { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.spl-logo { animation: splLogo .4s ease-out both; }
.spl-ring { animation: splRing .85s ease-out .25s both; }
.spl-word { animation: splWord .65s ease-out .7s both; }
.spl-tag  { animation: splTag .45s ease-out 1.2s both; }
@media (prefers-reduced-motion: reduce) {
  .spl-logo, .spl-word, .spl-tag { animation: none !important; opacity: 1 !important; transform: none !important; letter-spacing: 7px !important; }
  .spl-ring { animation: none !important; stroke-dashoffset: 0 !important; }
}
`;

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const startRef = useRef(Date.now());

  const finish = () => { if (doneRef.current) return; doneRef.current = true; setLeaving(true); setTimeout(onDone, 300); };

  useEffect(() => {
    const total = reduced() ? 1000 : 2400;
    const t = setTimeout(finish, total);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTap = () => { if (Date.now() - startRef.current >= 800) finish(); };

  const diamonds = [[46, 60, 20], [270, 120, 16], [300, 260, 22], [40, 320, 18], [180, 500, 24]];

  return (
    <div onClick={onTap} style={{
      position: 'fixed', inset: 0, background: NAVY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia, serif', opacity: leaving ? 0 : 1, transition: 'opacity .3s ease', overflow: 'hidden',
    }}>
      <style>{CSS}</style>
      <svg viewBox="0 0 340 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}>
        {diamonds.map(([x, y, s], i) => (
          <rect key={i} x={x - s / 2} y={y - s / 2} width={s} height={s} fill="none" stroke={GOLD} strokeWidth={1.5} transform={`rotate(45 ${x} ${y})`} />
        ))}
      </svg>

      <div style={{ position: 'relative', width: 108, height: 108, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="108" height="108" viewBox="0 0 108 108" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <circle className="spl-ring" cx="54" cy="54" r="48" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC} transform="rotate(-90 54 54)" />
        </svg>
        <span className="spl-logo"><DeanyMark size={76} /></span>
      </div>

      <div className="spl-word" style={{ fontSize: 22, letterSpacing: '7px', color: '#FBFAF6', fontWeight: 500, marginTop: 24 }}>DEANY</div>
      <div className="spl-tag" style={{ fontFamily: '"Source Sans 3", system-ui, sans-serif', fontSize: 12, color: '#8FA0C4', marginTop: 10 }}>Learn Islam, beautifully</div>
    </div>
  );
}
