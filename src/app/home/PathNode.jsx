// A single node on the vertical lesson path. Presentational only.
import React from 'react';
import { Check, Lock } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';

// state: 'done' | 'current' | 'locked'
export default function PathNode({ state, title, subtitle, accent = TOKENS.teal, offset = 0, onClick, showConnector = true }) {
  const locked = state === 'locked';
  const done = state === 'done';
  const current = state === 'current';

  const size = current ? 56 : done ? 46 : 42;
  let bg = 'rgba(27,42,74,0.08)', color = 'rgba(27,42,74,0.35)', ring = 'none';
  if (done) { bg = accent; color = '#fff'; }
  if (current) { bg = '#fff'; color = accent; ring = `0 0 0 4px ${TOKENS.gold}`; }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {showConnector && <div style={{ width: 3, height: 26, background: done ? accent : 'rgba(27,42,74,0.12)', borderRadius: 2 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateX(${offset}px)`, transition: 'transform .2s ease' }}>
        <button
          onClick={locked ? undefined : onClick}
          disabled={locked}
          aria-label={title}
          style={{
            width: size, height: size, borderRadius: '50%', background: bg, color,
            border: current ? `2px solid ${accent}` : 'none', boxShadow: current ? ring : (done ? '0 3px 10px rgba(15,76,92,0.18)' : 'none'),
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: locked ? 'default' : 'pointer',
            WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', flexShrink: 0,
            animation: current ? 'deanyNodePulse 2s ease-in-out infinite' : 'none',
          }}>
          {done ? <Check size={22} strokeWidth={3} /> : locked ? <Lock size={17} /> : <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600 }}>{subtitle}</span>}
        </button>
        {(current || (!locked && title)) && (
          <div style={{ transform: `translateX(${-offset}px)`, textAlign: 'center', marginTop: 8, maxWidth: 200 }}>
            <div style={{ fontSize: 13.5, fontWeight: current ? 600 : 500, color: current ? TOKENS.navy : TOKENS.muted, lineHeight: 1.3 }}>{title}</div>
          </div>
        )}
      </div>
    </div>
  );
}
