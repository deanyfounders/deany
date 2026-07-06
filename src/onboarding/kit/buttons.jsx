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

// ChunkyButton - the Section 1 primary. Teal fill, 4px bottom edge, depresses
// on press (translateY 2px, edge shrinks to 2px).
export function ChunkyButton({ children, onClick, disabled, style }) {
  const [pressed, setPressed] = useState(false);
  const down = pressed && !disabled;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: '100%', minHeight: 52, background: disabled ? '#CBD2DE' : T.teal, color: '#fff', border: 'none',
        borderBottom: `${down ? 2 : 4}px solid ${disabled ? '#B7BECC' : '#147067'}`, borderRadius: 16,
        padding: down ? '15px 22px 5px' : '13px 22px 7px', fontFamily: FONT, fontSize: 15, fontWeight: 500,
        cursor: disabled ? 'default' : 'pointer', transform: down ? 'translateY(2px)' : 'translateY(0)',
        transition: 'transform .1s ease, border-bottom-width .1s ease, padding .1s ease, background .15s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...style,
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
