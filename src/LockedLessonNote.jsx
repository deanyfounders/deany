import React, { useState, useEffect } from 'react';
import { LOCKED_LESSON_EVENT } from './lessonLock.js';

// Global, self-contained note shown when a learner taps a locked lesson. Mounted
// once at the app root; listens for the LOCKED_LESSON_EVENT dispatched by
// notifyLockedLesson(). No props, no wiring through the tree.
const C = {
  scrim: 'rgba(15,35,50,0.42)', surface: '#FFFFFF', canvas: '#FBFAF6',
  teal: '#22A39A', tealDeep: '#0F4C5C', tealSoft: '#DCF3EF',
  gold: '#F0B429', goldDk: '#C8901A', goldInk: '#5A3E00',
  text: '#173A4A', textMuted: '#5E7480', border: 'rgba(15,76,92,0.12)',
};
const serif = 'Georgia, serif';
const sans = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

const LockGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export default function LockedLessonNote() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(LOCKED_LESSON_EVENT, show);
    return () => window.removeEventListener(LOCKED_LESSON_EVENT, show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Lessons are locked"
      onClick={() => setOpen(false)}
      style={{ position: 'fixed', inset: 0, zIndex: 4000, background: C.scrim, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'center', padding: 'env(safe-area-inset-top) 0 0', fontFamily: sans }}>
      <style>{`
        @keyframes lnUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lnFade { from { opacity: 0; } to { opacity: 1; } }
        .ln-scrim { animation: lnFade .2s ease-out both; }
        .ln-sheet { animation: lnUp .32s cubic-bezier(.2,.8,.3,1) both; }
        @media (min-width: 560px) { .ln-wrap { align-items: center !important; } }
        @media (prefers-reduced-motion: reduce) { .ln-scrim, .ln-sheet { animation: none; } }
      `}</style>
      <div className="ln-sheet" onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 460, background: C.surface, color: C.text,
          borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
          padding: '26px 24px calc(env(safe-area-inset-bottom) + 24px)', boxShadow: '0 -12px 44px rgba(15,76,92,0.22)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: C.border, margin: '0 auto 20px' }} />

        <div style={{ width: 54, height: 54, borderRadius: 16, background: C.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <LockGlyph />
        </div>

        <h2 style={{ fontFamily: serif, fontSize: 21, fontWeight: 600, color: C.tealDeep, margin: 0, lineHeight: 1.3 }}>
          Lessons are locked for now
        </h2>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.textMuted, margin: '12px 0 0' }}>
          Deany is in its early MVP stage. We don&rsquo;t yet meet the regulatory
          requirements to publish Islamic educational content, so all lessons are
          locked while we complete that process.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: C.textMuted, margin: '10px 0 0' }}>
          Thank you for your patience. We&rsquo;ll open them up as soon as we&rsquo;re cleared to.
        </p>

        <button onClick={() => setOpen(false)} style={{ marginTop: 22, width: '100%', minHeight: 52, borderRadius: 14,
          border: 'none', cursor: 'pointer', background: C.gold, color: C.goldInk, fontFamily: sans, fontSize: 15.5, fontWeight: 800,
          boxShadow: '0 3px 0 ' + C.goldDk + ', 0 12px 26px rgba(240,180,41,.32)', WebkitTapHighlightColor: 'transparent' }}>
          Got it
        </button>
      </div>
    </div>
  );
}
