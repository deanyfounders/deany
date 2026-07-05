// PrimaryButton (full-width teal pill) and GhostButton (teal text link).
// One primary CTA per screen.
import React, { useState } from 'react';
import { T, RADIUS, FONT } from './tokens.js';

export function PrimaryButton({ children, onClick, disabled, style }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: '100%', minHeight: 52, padding: '15px 22px',
        background: disabled ? '#CBD2DE' : T.teal, color: '#fff',
        border: 'none', borderRadius: RADIUS.pill, fontFamily: FONT, fontSize: 15, fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer',
        transform: pressed && !disabled ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform .12s ease, background .15s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        ...style,
      }}>
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', minHeight: 44, padding: '10px', background: 'none', border: 'none',
      color: T.teal, fontFamily: FONT, fontSize: 14, fontWeight: 500, cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', ...style,
    }}>
      {children}
    </button>
  );
}
