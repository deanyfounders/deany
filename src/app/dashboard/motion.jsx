// Dashboard motion - strict budget. CSS transitions + a tiny keyframe set.
// Everything degrades to a plain fade under prefers-reduced-motion; no haptics.
import React from 'react';

export const DASH_CSS = `
@keyframes dashRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes dashFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes dashDot  { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes dashPop  { 0% { transform: scale(1); } 42% { transform: scale(1.16); } 100% { transform: scale(1); } }
.dash-rise { animation: dashRise 200ms ease-out both; }
.dash-dot  { animation: dashDot 220ms cubic-bezier(.2,.8,.3,1.5) both; }
.dash-pop  { animation: dashPop 420ms cubic-bezier(.2,.8,.3,1.2) both; }
.dash-press:active { transform: scale(0.97); }
@media (prefers-reduced-motion: reduce) {
  .dash-rise { animation: dashFade 200ms ease-out both !important; }
  .dash-dot, .dash-pop { animation: none !important; }
}
`;

export function DashMotion() { return <style>{DASH_CSS}</style>; }

// Entrance stagger props; only active on the first app open (not per tab switch).
export const enter = (active, i) => active ? { className: 'dash-rise', style: { animationDelay: `${i * 50}ms` } } : {};

export function haptic(ms = 10) {
  try {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(ms);
  } catch (_) { /* no-op */ }
}
