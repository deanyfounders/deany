// Section 1 orchestrator: Welcome -> How it works -> Method chooser ->
// [boring detour] -> Sample quiz -> Find your level -> completeOnboarding
// (which hands off to the existing topic select + calibration).
import React, { useState } from 'react';
import { Target, Zap, RefreshCw, HelpCircle, Clock, X, Flame } from 'lucide-react';
import { DeanyMark } from '../shared/AppScreen.jsx';
import { S1Screen, S1Header } from './ui.jsx';
import { ChunkyButton, GhostButton } from '../../onboarding/kit/buttons.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';
import HowItWorks from './HowItWorks.jsx';
import MethodChooser from './MethodChooser.jsx';
import BoringWay from './BoringWay.jsx';
import QuizSection from '../../components/QuizSection.jsx';

const S1_CSS = `@keyframes s1Cross { from { opacity: 0; } to { opacity: 1; } } .s1-cross { animation: s1Cross .28s ease-out both; } @media (prefers-reduced-motion: reduce){ .s1-cross { animation: none; } }`;

export default function Section1({ appState }) {
  const { completeOnboarding, update } = appState;
  const [phase, setPhase] = useState('welcome');

  const haveAccount = () => update({ onboarded: true, calibrated: true });
  const takeTest = () => completeOnboarding();
  const skipTest = () => { update({ calibrationSkip: true }); completeOnboarding(); };

  let screen;
  if (phase === 'how') screen = <HowItWorks onBack={() => setPhase('welcome')} onSkip={() => setPhase('method')} onDone={() => setPhase('method')} />;
  else if (phase === 'method') screen = <MethodChooser onBack={() => setPhase('how')} onDeanyWay={() => setPhase('sample')} onBoringWay={() => setPhase('boring')} />;
  else if (phase === 'boring') screen = <BoringWay onBack={() => setPhase('method')} onDeanyWay={() => setPhase('sample')} />;
  else if (phase === 'sample') screen = <Sample onExit={() => setPhase('method')} onDone={() => setPhase('level')} />;
  else if (phase === 'level') screen = <FindLevel onBack={() => setPhase('sample')} onTakeTest={takeTest} onSkip={skipTest} />;
  else screen = <Welcome onStart={() => setPhase('how')} onHaveAccount={haveAccount} />;

  return (<><style>{S1_CSS}</style><div key={phase} className="s1-cross" style={{ height: '100%' }}>{screen}</div></>);
}

// The DEANY-way taste is the real website quiz, started at the questions.
function Sample({ onExit, onDone }) {
  return (
    <S1Screen>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 'calc(env(safe-area-inset-top) + 12px) 16px 0' }}>
        <button onClick={onExit} aria-label="Exit" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: T.inkSecondary, WebkitTapHighlightColor: 'transparent' }}><X size={20} /></button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <QuizSection autoStart onDone={onDone} />
      </div>
    </S1Screen>
  );
}

// ── Welcome (calm) ─────────────────────────────────────────────
function Welcome({ onStart, onHaveAccount }) {
  return (
    <S1Screen>
      <Corners />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 28px' }}>
        <DeanyMark size={72} />
        <div style={{ fontFamily: SERIF, fontSize: 19, letterSpacing: '6px', color: T.navy, fontWeight: 500, margin: '16px 0 18px' }}>DEANY</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 500, color: T.ink, margin: '0 0 12px', lineHeight: 1.2 }}>Start where you are.</h1>
        <p style={{ fontSize: 14, color: T.inkSecondary, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>Bite-size lessons in Quran, history, and Islamic finance - reviewed by scholars.</p>
        <div style={{ marginTop: 30 }}><HeroCards /></div>
      </div>
      <div style={{ flexShrink: 0, padding: '10px 22px calc(env(safe-area-inset-bottom) + 16px)' }}>
        <ChunkyButton onClick={onStart}>Get started</ChunkyButton>
        <div style={{ marginTop: 6 }}><GhostButton onClick={onHaveAccount}>I already have an account</GhostButton></div>
      </div>
    </S1Screen>
  );
}

function Corners() {
  return (
    <svg viewBox="0 0 340 200" aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 200, opacity: 0.06, pointerEvents: 'none' }}>
      {[[30, 40, 22], [305, 30, 18], [70, 90, 14], [280, 120, 20]].map(([x, y, s], i) => (
        <rect key={i} x={x - s / 2} y={y - s / 2} width={s} height={s} fill="none" stroke={T.gold} strokeWidth={1.5} transform={`rotate(45 ${x} ${y})`} />
      ))}
    </svg>
  );
}

// Floating lesson cards - the hero visual.
function HeroCards() {
  const cards = [
    { r: -7, l: 0, t: 8, z: 1, accent: T.teal, title: 'Five Pillars', sub: 'Lesson 1 of 7', fill: '35%' },
    { r: 5, l: 60, t: 24, z: 3, accent: T.gold, title: 'Islamic finance', sub: 'Riba and gharar', fill: '62%' },
  ];
  return (
    <div style={{ position: 'relative', width: 220, height: 132, margin: '0 auto' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: c.l, top: c.t, width: 140, padding: '13px 13px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 13, transform: `rotate(${c.r}deg)`, zIndex: c.z, boxShadow: '0 10px 28px rgba(15,76,92,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, background: c.accent, opacity: 0.16 }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: T.tealDeep }}>{c.title}</span>
          </div>
          <div style={{ fontSize: 9.5, color: T.inkHint, marginBottom: 8 }}>{c.sub}</div>
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(15,76,92,0.08)', overflow: 'hidden' }}>
            <div style={{ width: c.fill, height: '100%', background: c.accent, borderRadius: 3 }} />
          </div>
        </div>
      ))}
      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 4, background: '#fff', borderRadius: 20, padding: '5px 11px', boxShadow: '0 4px 14px rgba(15,76,92,0.12)', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Flame size={13} color={T.gold} /><span style={{ fontSize: 10, fontWeight: 700, color: T.tealDeep }}>5 day streak</span>
      </div>
    </div>
  );
}

// ── Find your level interstitial ──────────────────────────────
function FindLevel({ onBack, onTakeTest, onSkip }) {
  const rows = [
    [RefreshCw, 'Questions adapt as you answer'],
    [HelpCircle, "‘I’m not sure yet’ is always an option"],
    [Clock, 'About 2 minutes per topic'],
  ];
  return (
    <S1Screen>
      <S1Header onBack={onBack} dot={2} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 26px 8px', justifyContent: 'center' }}>
        <LevelArt />
        <h1 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 500, color: T.ink, margin: '20px 0 8px' }}>Find your level</h1>
        <p style={{ fontSize: 13, color: T.inkSecondary, lineHeight: 1.55, maxWidth: 320, margin: '0 0 22px' }}>A few questions per topic set where you start. About 2 minutes each, no penalties.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          {rows.map(([Icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={17} color={T.teal} />
              <span style={{ fontSize: 12.5, color: T.inkSecondary, textAlign: 'left' }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.inkHint, marginTop: 18 }}>Lessons run about 5 minutes.</p>
      </div>
      <div style={{ flexShrink: 0, padding: '10px 22px calc(env(safe-area-inset-bottom) + 16px)' }}>
        <ChunkyButton onClick={onTakeTest}>Take the calibration test</ChunkyButton>
        <div style={{ marginTop: 6 }}><GhostButton onClick={onSkip} style={{ color: T.inkHint }}>Skip for now</GhostButton></div>
      </div>
    </S1Screen>
  );
}

function LevelArt() {
  const r = 44, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 116, height: 116 }}>
      <svg width="116" height="116" viewBox="0 0 116 116">
        <circle cx="58" cy="58" r={r} fill="none" stroke="rgba(34,163,154,0.15)" strokeWidth="6" />
        <circle cx="58" cy="58" r={r} fill="none" stroke={T.teal} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * 0.4} transform="rotate(-90 58 58)" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#E9F6F4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Target size={26} color={T.tealDeep} /></span>
      </span>
      <span style={{ position: 'absolute', top: 6, right: 6, width: 30, height: 30, borderRadius: 9, background: T.gold, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(10deg)' }}><Zap size={16} color={T.navy} fill={T.navy} /></span>
    </div>
  );
}
