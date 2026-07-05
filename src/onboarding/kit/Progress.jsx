// ProgressBar (animated width) and ProgressDots.
import React from 'react';
import { T } from './tokens.js';

export function ProgressBar({ value = 0, color = T.teal, track = 'rgba(27,42,74,0.10)', height = 6 }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ width: '100%', height, background: track, borderRadius: height, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: height, transition: 'width .45s cubic-bezier(.34,1.4,.5,1)' }} />
    </div>
  );
}

export function ProgressDots({ count, active, color = T.teal }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          width: i === active ? 22 : 8, height: 8, borderRadius: 4,
          background: i === active ? color : 'rgba(27,42,74,0.2)',
          transition: 'width .25s ease, background .25s ease',
        }} />
      ))}
    </div>
  );
}
