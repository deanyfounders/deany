// Section 1 orchestrator: Welcome -> How it works -> Method chooser ->
// [boring detour] -> Sample quiz -> Find your level -> completeOnboarding
// (which hands off to the existing topic select + calibration).
import React, { useState } from 'react';
import { Target, Zap, RefreshCw, HelpCircle, Clock } from 'lucide-react';
import { DeanyMark } from '../shared/AppScreen.jsx';
import { S1Screen, S1Header } from './ui.jsx';
import { ChunkyButton, GhostButton } from '../../onboarding/kit/buttons.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';
import HowItWorks from './HowItWorks.jsx';
import MethodChooser from './MethodChooser.jsx';
import BoringWay from './BoringWay.jsx';
import SampleQuiz from './SampleQuiz.jsx';

export default function Section1({ appState }) {
  const { completeOnboarding, update } = appState;
  const [phase, setPhase] = useState('welcome');

  const haveAccount = () => update({ onboarded: true, calibrated: true });
  const takeTest = () => completeOnboarding();
  const skipTest = () => { update({ calibrationSkip: true }); completeOnboarding(); };

  if (phase === 'how') return <HowItWorks onBack={() => setPhase('welcome')} onSkip={() => setPhase('method')} onDone={() => setPhase('method')} />;
  if (phase === 'method') return <MethodChooser onBack={() => setPhase('how')} onDeanyWay={() => setPhase('sample')} onBoringWay={() => setPhase('boring')} />;
  if (phase === 'boring') return <BoringWay onBack={() => setPhase('method')} onDeanyWay={() => setPhase('sample')} />;
  if (phase === 'sample') return <SampleQuiz onExit={() => setPhase('method')} onDone={() => setPhase('level')} />;
  if (phase === 'level') return <FindLevel onBack={() => setPhase('sample')} onTakeTest={takeTest} onSkip={skipTest} />;

  return <Welcome onStart={() => setPhase('how')} onHaveAccount={haveAccount} />;
}

// ── Welcome (calm) ─────────────────────────────────────────────
function Welcome({ onStart, onHaveAccount }) {
  return (
    <S1Screen>
      <Corners />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 28px' }}>
        <DeanyMark size={80} />
        <div style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: '6px', color: T.navy, fontWeight: 500, margin: '18px 0 22px' }}>DEANY</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 500, color: T.ink, margin: '0 0 12px', lineHeight: 1.2 }}>Start where you are.</h1>
        <p style={{ fontSize: 14, color: T.inkSecondary, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>Ten-minute lessons on the Pillars, the Quran, Islamic finance, and history.</p>
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
        <p style={{ fontSize: 13, color: T.inkSecondary, lineHeight: 1.55, maxWidth: 320, margin: '0 0 22px' }}>A few quick questions per topic set your starting point. No penalties, no grades.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          {rows.map(([Icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={17} color={T.teal} />
              <span style={{ fontSize: 12.5, color: T.inkSecondary, textAlign: 'left' }}>{label}</span>
            </div>
          ))}
        </div>
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
