// OnboardingShell - canvas background, safe-area header slot, scrollable
// content, and a pinned bottom CTA slot with safe-area padding. Every
// onboarding screen composes from this so structure is consistent.
import React from 'react';
import { T, FONT } from './tokens.js';
import { MotionStyles } from './motion.jsx';

export default function OnboardingShell({ header, children, cta, contentStyle }) {
  return (
    <div style={{
      minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden',
      background: T.canvas, color: T.ink,
      fontFamily: FONT, display: 'flex', flexDirection: 'column',
    }}>
      <MotionStyles />
      {header != null && (
        <div style={{ flexShrink: 0, paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingLeft: 22, paddingRight: 22 }}>
          {header}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        <div style={{ padding: '20px 22px 8px', ...contentStyle }}>
          {children}
        </div>
      </div>

      {cta != null && (
        <div style={{
          flexShrink: 0, padding: '10px 22px calc(env(safe-area-inset-bottom) + 14px)',
          background: 'linear-gradient(180deg, rgba(251,250,246,0) 0%, rgba(251,250,246,0.96) 30%)',
        }}>
          {cta}
        </div>
      )}
    </div>
  );
}
