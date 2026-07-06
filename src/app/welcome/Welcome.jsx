// Onboarding intro (Phases 2 + 3): hero, a 3-pane value carousel, and one
// "try a question" styled like a real lesson. Completing it sets onboarded,
// which advances the gate to topic select. Composed from the onboarding kit.
import React, { useRef, useState } from 'react';
import { Clock, BookOpen, Flame, RefreshCw, Target, TrendingUp, ShieldCheck, Users, X, ArrowRight, Check } from 'lucide-react';
import { DeanyMark } from '../shared/AppScreen.jsx';
import OnboardingShell from '../../onboarding/kit/OnboardingShell.jsx';
import { PrimaryButton, GhostButton } from '../../onboarding/kit/buttons.jsx';
import OptionCard from '../../onboarding/kit/OptionCard.jsx';
import FeedbackSheet from '../../onboarding/kit/FeedbackSheet.jsx';
import { ProgressBar, ProgressDots } from '../../onboarding/kit/Progress.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';

export default function Welcome({ appState }) {
  const { completeOnboarding, update } = appState;
  const [phase, setPhase] = useState('hero');

  if (phase === 'hero') {
    return <Hero onStart={() => setPhase('carousel')} onHaveAccount={() => update({ onboarded: true, calibrated: true })} />;
  }
  if (phase === 'carousel') {
    return <Carousel onDone={() => setPhase('sample')} />;
  }
  return <Sample onDone={completeOnboarding} />;
}

// ── Hero ───────────────────────────────────────────────────────
function Hero({ onStart, onHaveAccount }) {
  return (
    <OnboardingShell
      cta={
        <>
          <PrimaryButton onClick={onStart}>Get started</PrimaryButton>
          <GhostButton onClick={onHaveAccount}>I already have an account</GhostButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '6vh' }}>
        <DeanyMark size={88} />
        <div style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: '6px', color: T.navy, fontWeight: 500, margin: '18px 0 24px' }}>DEANY</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 500, color: T.ink, margin: '0 0 12px', lineHeight: 1.2 }}>Start where you are.</h1>
        <p style={{ fontSize: 14, color: T.inkSecondary, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
          Ten-minute lessons on the Pillars, the Quran, Islamic finance, and history.
        </p>
      </div>
    </OnboardingShell>
  );
}

// ── Value carousel ─────────────────────────────────────────────
const MiniCards = ({ accent }) => (
  <div style={{ position: 'relative', width: 150, height: 108, margin: '0 auto' }}>
    {[{ r: -8, l: 0, t: 8, o: 1 }, { r: 6, l: 40, t: 22, o: 3 }].map((c, i) => (
      <div key={i} style={{ position: 'absolute', left: c.l, top: c.t, width: 110, padding: '12px 12px', background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, transform: `rotate(${c.r}deg)`, zIndex: c.o, boxShadow: '0 6px 18px rgba(15,76,92,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background: accent, opacity: 0.15 }} />
          <span style={{ width: 44, height: 6, borderRadius: 3, background: 'rgba(27,42,74,0.12)' }} />
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'rgba(27,42,74,0.08)', overflow: 'hidden' }}>
          <div style={{ width: i ? '62%' : '35%', height: '100%', background: accent, borderRadius: 3 }} />
        </div>
      </div>
    ))}
  </div>
);

const PANES = [
  { accent: T.teal, heading: 'Fits your day', rows: [[Clock, 'Five to ten minutes a lesson'], [BookOpen, 'Small, bite-size steps'], [Flame, 'Build a daily streak']] },
  { accent: T.gold, heading: 'Review that never forgets', rows: [[RefreshCw, 'Spaced review, built in'], [Target, 'Right before you would forget'], [TrendingUp, 'Knowledge that sticks']] },
  { accent: T.quran, heading: 'Scholar-reviewed', rows: [[ShieldCheck, 'Checked before it ships'], [BookOpen, 'Cites primary sources'], [Users, 'Open to all']] },
];

function Carousel({ onDone }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const last = PANES.length - 1;

  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };
  const next = () => {
    if (active >= last) { onDone(); return; }
    const el = ref.current; el?.scrollTo({ left: (active + 1) * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: T.canvas, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexShrink: 0, paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingRight: 18, display: 'flex', justifyContent: 'flex-end' }}>
        <GhostButton onClick={onDone} style={{ width: 'auto', color: T.inkHint, fontSize: 13 }}>Skip</GhostButton>
      </div>

      <div ref={ref} onScroll={onScroll} className="ob-deck" style={{ flex: 1, minHeight: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', overscrollBehavior: 'contain' }}>
        {PANES.map((p, i) => (
          <div key={i} style={{ flex: '0 0 100%', width: '100%', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
            <div style={{ marginBottom: 28 }}><MiniCards accent={p.accent} /></div>
            <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: '0 0 20px' }}>{p.heading}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 }}>
              {p.rows.map(([Icon, label], r) => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: p.accent, opacity: 0.12, flexShrink: 0 }} />
                  <span style={{ marginLeft: -34, width: 34, display: 'inline-flex', justifyContent: 'center', flexShrink: 0 }}><Icon size={17} color={p.accent} /></span>
                  <span style={{ fontSize: 14, color: T.inkSecondary, textAlign: 'left' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flexShrink: 0, padding: '14px 22px calc(env(safe-area-inset-bottom) + 16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <ProgressDots count={PANES.length} active={active} />
        <PrimaryButton onClick={next}>{active === last ? 'Try a question' : 'Continue'} <ArrowRight size={17} /></PrimaryButton>
      </div>
      <style>{`.ob-deck::-webkit-scrollbar{display:none}.ob-deck{scrollbar-width:none}`}</style>
    </div>
  );
}

// ── Try a question (styled like a lesson) ──────────────────────
// review: pending_mehdi
const SAMPLE = {
  prompt: "The word 'Islam' comes from an Arabic root that means?",
  options: ['Submission and peace', 'Knowledge', 'A place of prayer', 'The final month'],
  answerIndex: 0,
  payoff: "Islam shares its root with 'salam', peace. Submission to God is where that peace begins.",
};

function Sample({ onDone }) {
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const correct = picked === SAMPLE.answerIndex;

  return (
    <div style={{ minHeight: '100vh', height: '100dvh', maxHeight: '100dvh', overflow: 'hidden', background: T.canvas, display: 'flex', flexDirection: 'column', fontFamily: '"Source Sans 3", system-ui, sans-serif' }}>
      {/* lesson-style header */}
      <div style={{ flexShrink: 0, paddingTop: 'calc(env(safe-area-inset-top) + 12px)', padding: 'calc(env(safe-area-inset-top) + 12px) 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={onDone} aria-label="Exit" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: T.inkSecondary }}><X size={20} /></button>
          <div style={{ flex: 1 }}><ProgressBar value={40} color={T.teal} /></div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 700, color: '#B07D08' }}><Flame size={16} color={T.gold} /> 1</span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 22px 8px' }}>
        <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal, fontWeight: 500, marginBottom: 10 }}>The Deany way · try one</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: T.ink, lineHeight: 1.4, margin: '0 0 18px' }}>{SAMPLE.prompt}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLE.options.map((opt, i) => {
            let st = 'idle';
            if (checked) st = i === SAMPLE.answerIndex ? 'correct' : (i === picked ? 'selected' : 'dimmed');
            else if (i === picked) st = 'selected';
            return <OptionCard key={i} label={opt} accent={T.teal} state={st} onClick={checked ? undefined : () => setPicked(i)} />;
          })}
        </div>
      </div>

      {/* Check CTA (pre-feedback) */}
      {!checked && (
        <div style={{ flexShrink: 0, padding: '10px 22px calc(env(safe-area-inset-bottom) + 14px)' }}>
          <PrimaryButton disabled={picked === null} onClick={() => setChecked(true)}>Check</PrimaryButton>
        </div>
      )}

      <FeedbackSheet
        open={checked}
        correct={correct}
        title={correct ? 'Correct' : 'Good try'}
        message={correct ? SAMPLE.payoff : `The answer is "${SAMPLE.options[SAMPLE.answerIndex]}". ${SAMPLE.payoff}`}
        onContinue={onDone}
      />
    </div>
  );
}
