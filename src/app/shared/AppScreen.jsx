// Shared scaffold for app-mode screens: full-height canvas surface, centred
// column, safe-area padding, and the DEANY mark. Used by the Session 1
// placeholder screens; real screens (Phases 2-5) can reuse or replace it.
import React from 'react';

export const TOKENS = {
  teal: '#22A39A',
  tealDeep: '#0F6E56',
  gold: '#F0B429',
  canvas: '#FBFAF6',
  navy: '#1B2A4A',
  history: '#E06A45',
  border: 'rgba(15,76,92,0.12)',
  muted: '#5E7480',
};

const serif = 'Georgia, serif';

export function DeanyMark({ size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: `linear-gradient(145deg, ${TOKENS.teal}, ${TOKENS.tealDeep})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: serif, fontSize: size * 0.5,
    }}>د</div>
  );
}

export default function AppScreen({ children, style }) {
  return (
    <div style={{
      minHeight: '100vh', background: TOKENS.canvas, color: TOKENS.navy,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', fontFamily: '"Source Sans 3", system-ui, sans-serif',
      padding: 'calc(env(safe-area-inset-top) + 28px) 24px calc(env(safe-area-inset-bottom) + 28px)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function PillButton({ children, onClick, color = TOKENS.teal }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', maxWidth: 340, minHeight: 52, padding: '14px 22px',
      background: color, color: '#fff', border: 'none', borderRadius: 26,
      fontSize: 16, fontWeight: 600, cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(34,163,154,0.28)',
      WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>{children}</button>
  );
}

export function TextLink({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: TOKENS.muted, fontSize: 14,
      cursor: 'pointer', padding: 8, WebkitTapHighlightColor: 'transparent',
    }}>{children}</button>
  );
}
