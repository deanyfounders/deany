// Shared Section 1 chrome: a header with a back affordance and the 4-position
// progress dots (How it works, Method, Level, Topics), plus a screen wrapper.
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { T, FONT } from '../../onboarding/kit/tokens.js';

export function S1Header({ onBack, dot, onSkip }) {
  return (
    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(env(safe-area-inset-top) + 12px) 18px 6px' }}>
      {onBack
        ? <button onClick={onBack} aria-label="Back" style={{ width: 44, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: T.inkSecondary, WebkitTapHighlightColor: 'transparent' }}><ChevronLeft size={22} /></button>
        : <span style={{ width: 44 }} />}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 7 }}>
        {[0, 1, 2, 3].map(i => (
          <span key={i} style={{ width: i === dot ? 18 : 7, height: 7, borderRadius: 4, background: i === dot ? T.teal : 'rgba(15,76,92,0.18)', transition: 'width .25s ease, background .25s ease' }} />
        ))}
      </div>
      {onSkip
        ? <button onClick={onSkip} style={{ width: 44, textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer', color: T.inkSecondary, fontSize: 13, fontWeight: 500, WebkitTapHighlightColor: 'transparent' }}>Skip</button>
        : <span style={{ width: 44 }} />}
    </div>
  );
}

export function S1Screen({ children, style }) {
  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: T.canvas, color: T.ink, fontFamily: FONT, display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </div>
  );
}
