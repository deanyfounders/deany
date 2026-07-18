// Section 1 orchestrator: Welcome -> How it works -> Learn the Deany way (the
// real website quiz, teaser and all) -> Find your level -> completeOnboarding
// (which hands off to the existing topic select + calibration).
// Reskinned against ./theme.js so every intro screen reads as one system.
import React, { useRef, useState } from 'react';
import { Target, Zap, RefreshCw, HelpCircle, Clock, X } from 'lucide-react';
import { DeanyMark } from '../shared/AppScreen.jsx';
import { S1Screen, S1Header } from './ui.jsx';
import { ChunkyButton, GhostButton } from '../../onboarding/kit/buttons.jsx';
import { IX, SERIF } from './theme.js';
import HowItWorks from './HowItWorks.jsx';
import QuizSection from '../../components/QuizSection.jsx';
import LinkedPicker from '../../onboarding/components/LinkedPicker.jsx';

const S1_CSS = `@keyframes s1Cross { from { opacity: 0; } to { opacity: 1; } } .s1-cross { animation: s1Cross .28s ease-out both; } @media (prefers-reduced-motion: reduce){ .s1-cross { animation: none; } }`;

export default function Section1({ appState }) {
  const { completeOnboarding, update } = appState;
  const [phase, setPhase] = useState('welcome');

  const haveAccount = () => update({ onboarded: true, calibrated: true });
  const takeTest = () => completeOnboarding();
  const skipTest = () => { update({ calibrationSkip: true }); completeOnboarding(); };
  const seedPicker = (sel) => { if (sel) update({ pickerSeed: sel }); };

  let screen;
  if (phase === 'how') screen = <HowItWorks onBack={() => setPhase('welcome')} onSkip={() => setPhase('deany')} onDone={() => setPhase('deany')} />;
  else if (phase === 'deany') screen = <Sample onExit={() => setPhase('how')} onDone={() => setPhase('level')} />;
  else if (phase === 'level') screen = <FindLevel onBack={() => setPhase('deany')} onTakeTest={takeTest} onSkip={skipTest} />;
  else screen = <Welcome onStart={() => setPhase('how')} onHaveAccount={haveAccount} onSeed={seedPicker} />;

  return (<><style>{S1_CSS}</style><div key={phase} className="s1-cross" style={{ height: '100%' }}>{screen}</div></>);
}

// "Learn the Deany way" is the real website quiz, teaser and all. It already
// lives on the same warm canvas, so the wrapper stays a bare canvas frame with
// just a back affordance - the quiz sits natively inside the intro system.
function Sample({ onExit, onDone }) {
  return (
    <S1Screen>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 'calc(env(safe-area-inset-top) + 12px) 16px 0' }}>
        <button onClick={onExit} aria-label="Back" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: IX.muted, WebkitTapHighlightColor: 'transparent' }}><X size={20} /></button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <QuizSection onDone={onDone} />
      </div>
    </S1Screen>
  );
}

// ── Welcome - the picker hero ──────────────────────────────────
const WELCOME_CSS = `
@keyframes s1Word { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.s1-word { display: inline-block; opacity: 0; animation: s1Word .5s ease-out forwards; }
@keyframes s1Draw { to { stroke-dashoffset: 0; } }
.s1-underline { stroke-dasharray: 150; stroke-dashoffset: 150; animation: s1Draw .6s ease-out .75s forwards; }
@media (prefers-reduced-motion: reduce){
  .s1-word { opacity: 1; animation: none; }
  .s1-underline { stroke-dashoffset: 0; animation: none; }
}`;

function Welcome({ onStart, onHaveAccount, onSeed }) {
  const sel = useRef(null);
  const start = () => { onSeed && onSeed(sel.current); onStart(); };
  const words = ['Start', 'where', 'you are.'];
  return (
    <S1Screen>
      <style>{WELCOME_CSS}</style>
      <div style={{ flexShrink: 0, textAlign: 'center', padding: 'calc(env(safe-area-inset-top) + 22px) 28px 0' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          <DeanyMark size={54} />
          <div style={{ fontFamily: SERIF, fontSize: 13, letterSpacing: '6px', color: IX.tealDeep, fontWeight: 500, margin: '11px 0 16px' }}>DEANY</div>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 500, color: IX.tealDeep, margin: '0 0 10px', lineHeight: 1.2, wordSpacing: '-0.26em' }}>
          {words.map((w, i) => (
            <span key={i} className="s1-word" style={{ animationDelay: `${[0.05, 0.18, 0.31][i]}s` }}>
              {w}{i < words.length - 1 ? ' ' : (
                <svg viewBox="0 0 150 8" width="118" height="7" style={{ display: 'block', margin: '3px auto 0' }} aria-hidden="true">
                  <path className="s1-underline" d="M2 5 C 40 1, 110 1, 148 5" fill="none" stroke={IX.gold} strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
            </span>
          ))}
        </h1>
        <p style={{ fontSize: 13.5, color: IX.muted, lineHeight: 1.55, maxWidth: 330, margin: '0 auto' }}>
          Bite-size lessons in history, finance, Quran, and much more - reviewed by scholars.
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 20px' }}>
        <LinkedPicker onChange={(s) => { sel.current = s; }} />
      </div>

      <div style={{ flexShrink: 0, padding: '6px 22px calc(env(safe-area-inset-bottom) + 16px)' }}>
        <ChunkyButton onClick={start}>Get started</ChunkyButton>
        <div style={{ marginTop: 6 }}><GhostButton onClick={onHaveAccount}>I already have an account</GhostButton></div>
      </div>
    </S1Screen>
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
        <h1 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 500, color: IX.tealDeep, margin: '20px 0 8px' }}>Find your level</h1>
        <p style={{ fontSize: 13, color: IX.muted, lineHeight: 1.55, maxWidth: 320, margin: '0 0 22px' }}>A few questions per topic set where you start. About 2 minutes each, no penalties.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          {rows.map(([Icon, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={17} color={IX.teal} />
              <span style={{ fontSize: 12.5, color: IX.muted, textAlign: 'left' }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: IX.faint, marginTop: 18 }}>Lessons run about 5 minutes.</p>
      </div>
      <div style={{ flexShrink: 0, padding: '10px 22px calc(env(safe-area-inset-bottom) + 16px)' }}>
        <ChunkyButton onClick={onTakeTest}>Take the calibration test</ChunkyButton>
        <div style={{ marginTop: 6 }}><GhostButton onClick={onSkip} style={{ color: IX.faint }}>Skip for now</GhostButton></div>
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
        <circle cx="58" cy="58" r={r} fill="none" stroke={IX.teal} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * 0.4} transform="rotate(-90 58 58)" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: 56, height: 56, borderRadius: '50%', background: IX.tealSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Target size={26} color={IX.tealDeep} /></span>
      </span>
      <span style={{ position: 'absolute', top: 6, right: 6, width: 30, height: 30, borderRadius: 9, background: IX.gold, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(10deg)' }}><Zap size={16} color={IX.tealDeep} fill={IX.tealDeep} /></span>
    </div>
  );
}
