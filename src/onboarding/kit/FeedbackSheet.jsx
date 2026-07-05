// FeedbackSheet - bottom sheet for correct/incorrect states. Green ramp for
// correct; neutral coaching tone for incorrect. Nobody fails onboarding.
import React, { useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { T, RADIUS, FONT, SERIF } from './tokens.js';
import { PrimaryButton } from './buttons.jsx';
import { Particles, haptic } from './motion.jsx';

export default function FeedbackSheet({ open, correct, title, message, onContinue }) {
  const accent = correct ? T.correct : T.navy;
  useEffect(() => { if (open && correct) haptic(); }, [open, correct]);
  return (
    <>
      {/* dim */}
      <div onClick={onContinue} style={{
        position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(15,42,52,0.28)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity .2s ease',
      }} />
      {/* sheet */}
      <div role="dialog" aria-label={title} style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 61,
        background: correct ? T.correctTint : T.card, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        borderTop: `1px solid ${correct ? 'rgba(42,155,110,0.3)' : T.border}`,
        transform: open ? 'translateY(0)' : 'translateY(110%)', transition: 'transform .32s cubic-bezier(.2,.8,.2,1)',
        padding: '22px 22px calc(env(safe-area-inset-bottom) + 20px)', fontFamily: FONT,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ position: 'relative', width: 30, height: 30, flexShrink: 0 }}>
            <span className={open && correct ? 'ob-pop' : undefined} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={17} color="#fff" strokeWidth={3} />
            </span>
            <Particles show={open && correct} />
          </span>
          <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500, color: accent }}>{title}</span>
        </div>
        <p style={{ fontSize: 14, color: T.inkSecondary, lineHeight: 1.55, margin: '0 0 18px', paddingLeft: 40 }}>{message}</p>
        <PrimaryButton onClick={onContinue} style={{ background: accent }}>
          Continue <ArrowRight size={17} />
        </PrimaryButton>
      </div>
    </>
  );
}
