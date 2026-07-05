// OptionCard - the single source of the selected-state grammar used across
// the try-a-question and level-intent screens.
//   idle     white card, hairline border
//   selected 2px accent border + accent tint fill + filled check badge
//   correct  same grammar in green
//   dimmed   faded (a non-answer once one is chosen)
//   unsure   dashed hairline border (the "I'm not sure yet" option)
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { T, RADIUS, FONT } from './tokens.js';

export default function OptionCard({ label, sublabel, icon, accent = T.teal, state = 'idle', onClick, style, className }) {
  const [pressed, setPressed] = useState(false);
  const c = state === 'correct' ? T.correct : accent;
  const active = state === 'selected' || state === 'correct';

  let border = `1px solid ${T.border}`;
  let background = T.card;
  let opacity = 1;
  if (active) { border = `2px solid ${c}`; background = state === 'correct' ? T.correctTint : tintOf(accent); }
  if (state === 'unsure') border = `1.5px dashed ${T.inkHint}`;
  if (state === 'dimmed') opacity = 0.45;

  return (
    <button
      onClick={onClick}
      disabled={state === 'dimmed'}
      className={className}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: 'relative', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
        padding: active ? '15px 15px' : '16px 16px', border, background, borderRadius: RADIUS.card,
        cursor: onClick ? 'pointer' : 'default', opacity, fontFamily: FONT,
        transform: pressed && onClick ? 'scale(0.98)' : 'scale(1)',
        transition: 'border-color .15s ease, background .15s ease, transform .12s ease, opacity .2s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', ...style,
      }}>
      {icon != null && (
        <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, background: tintOf(accent), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          {icon}
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15, fontWeight: active ? 500 : 400, color: T.ink, lineHeight: 1.35 }}>{label}</span>
        {sublabel && <span style={{ display: 'block', fontSize: 13, color: T.inkSecondary, marginTop: 2, lineHeight: 1.4 }}>{sublabel}</span>}
      </span>
      {active && (
        <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: '50%', background: c, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={14} color="#fff" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function tintOf(hex) {
  // 10% tint of a #rrggbb accent
  const h = hex.replace('#', '');
  if (h.length !== 6) return 'rgba(34,163,154,0.10)';
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.10)`;
}
