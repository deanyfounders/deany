// Phase 7 - the pop pass, on a strict budget. CSS transitions + a tiny keyframe
// set only. Everything degrades under prefers-reduced-motion.
import React from 'react';
import { T } from './tokens.js';

export const CSS = `
@keyframes obRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes obFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes obPop { 0% { transform: scale(0); } 60% { transform: scale(1.18); } 100% { transform: scale(1); } }
@keyframes obParticle { to { transform: translate(var(--dx), var(--dy)) scale(0.4); opacity: 0; } }
.ob-rise { animation: obRise .30s ease-out both; }
.ob-pop { animation: obPop .42s cubic-bezier(.2,.8,.3,1.2) both; }
@media (prefers-reduced-motion: reduce) {
  .ob-rise { animation: obFade .30s ease-out both !important; }
  .ob-pop { animation: none !important; }
  .ob-particle { display: none !important; }
}
`;

export function MotionStyles() {
  return <style>{CSS}</style>;
}

// Entrance stagger: className="ob-rise" + this delay style.
export const riseDelay = (i = 0) => ({ animationDelay: `${i * 55}ms` });

// Gold star particle burst - the single particle moment in onboarding.
export function Particles({ show, color = T.gold }) {
  if (!show) return null;
  const parts = [
    { dx: '-26px', dy: '-30px' }, { dx: '24px', dy: '-32px' }, { dx: '-34px', dy: '6px' },
    { dx: '32px', dy: '4px' }, { dx: '-14px', dy: '26px' }, { dx: '16px', dy: '28px' },
  ];
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {parts.map((p, i) => (
        <span key={i} className="ob-particle" style={{
          position: 'absolute', left: '50%', top: '50%', width: 6, height: 6, borderRadius: '50%',
          background: color, '--dx': p.dx, '--dy': p.dy,
          animation: 'obParticle .5s ease-out forwards',
        }} />
      ))}
    </span>
  );
}

// Feature-detected light haptic; silent under reduced-motion.
export function haptic(ms = 10) {
  try {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(ms);
  } catch (_) { /* no-op */ }
}
