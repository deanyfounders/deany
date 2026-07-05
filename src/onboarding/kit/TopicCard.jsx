// TopicCard - grid variant with a tinted icon tile, title, one-line sub, and a
// check badge when selected. Uses each subject's identity color.
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { T, RADIUS, FONT } from './tokens.js';

export default function TopicCard({ emoji, title, sub, accent = T.teal, tint, selected, onClick, className, style }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      className={className}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        position: 'relative', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8,
        padding: 16, border: selected ? `2px solid ${accent}` : `1px solid ${T.border}`,
        background: selected ? (tint || 'rgba(34,163,154,0.10)') : T.card, borderRadius: RADIUS.card,
        cursor: 'pointer', fontFamily: FONT, minHeight: 118,
        transition: 'border-color .15s ease, background .15s ease, transform .12s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', ...style,
      }}>
      <span style={{ width: 44, height: 44, borderRadius: 12, background: tint || 'rgba(34,163,154,0.10)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
        {emoji}
      </span>
      <span style={{ fontSize: 15, fontWeight: 500, color: T.ink, lineHeight: 1.25 }}>{title}</span>
      {sub && <span style={{ fontSize: 12, color: T.inkSecondary, lineHeight: 1.35 }}>{sub}</span>}
      {selected && (
        <span style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', background: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={14} color="#fff" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
