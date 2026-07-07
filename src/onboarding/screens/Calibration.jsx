// Phase 5 - Calibration flow. Per selected topic: level-intent, then an
// adaptive staircase of placement questions, then a "plan is ready" result.
// Placement only - default no per-question feedback. Nobody fails onboarding.
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import OnboardingShell from '../kit/OnboardingShell.jsx';
import { ChunkyButton, GhostButton } from '../kit/buttons.jsx';
import OptionCard from '../kit/OptionCard.jsx';
import { ProgressBar } from '../kit/Progress.jsx';
import { riseDelay, Particles, haptic } from '../kit/motion.jsx';
import { T, SUBJECT, SERIF } from '../kit/tokens.js';
import {
  seedTier, nextTier, pickNextQuestion, shouldStop, finalTierFrom, levelForTier, maxTierFor,
} from '../calibration/engine.js';

const MAX_Q = 7;
const INTENTS = [
  { id: 'start', label: "I'm just starting", sub: 'New to this topic' },
  { id: 'basics', label: 'I know some basics', sub: 'A little background' },
  { id: 'comfortable', label: "I'm comfortable", sub: 'A solid understanding' },
];

export default function Calibration({ appState }) {
  const { state, saveTopicResult, finishCalibration } = appState;
  const topics = state.topics || [];

  const [ti, setTi] = useState(0);
  const [phase, setPhase] = useState('intent'); // intent | questions | result
  const [intent, setIntent] = useState(null);
  const [results, setResults] = useState({});

  // staircase state
  const [tier, setTier] = useState(1);
  const [asked, setAsked] = useState(() => new Set());
  const [history, setHistory] = useState([]);
  const [unsure, setUnsure] = useState(0);
  const [current, setCurrent] = useState(null);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [topicCorrect, setTopicCorrect] = useState(0);

  const topic = topics[ti];
  const subj = SUBJECT[topic] || { label: 'this topic', short: 'Topic', accent: T.teal, tint: 'rgba(34,163,154,0.1)' };
  const topicMax = maxTierFor(topic);

  useEffect(() => { if (phase === 'result') haptic(); }, [phase]);

  const startQuestions = () => {
    const seed = seedTier(intent);
    const set = new Set();
    setTier(seed); setAsked(set); setHistory([]); setUnsure(0);
    setPicked(null); setLocked(false); setChecked(false); setTopicCorrect(0); setCurrent(pickNextQuestion(topic, seed, set));
    setPhase('questions');
  };

  const finalizeTopic = (hist, uns, correctCount, nextResults) => {
    const ft = finalTierFrom(hist, topicMax);
    const result = { level: levelForTier(ft, topicMax), tier: ft, answered: hist.length, correct: correctCount, unsureCount: uns, completedAt: Date.now() };
    const merged = { ...nextResults, [topic]: result };
    setResults(merged);
    saveTopicResult(topic, result);
    if (ti + 1 < topics.length) { setTi(ti + 1); setIntent(null); setPhase('intent'); }
    else { setPhase('settingup'); }
  };

  // Select an option, then show the explanation. Advance is a separate step.
  const select = (optIndex) => {
    if (locked) return;
    setPicked(optIndex);
    setLocked(true);
    setChecked(true);
  };

  const advance = () => {
    const outcome = picked === 'unsure' ? 'unsure' : (picked === current.answerIndex ? 'correct' : 'wrong');
    const newHist = [...history, current.tier];
    const newAsked = new Set(asked); newAsked.add(current.id);
    const newUnsure = unsure + (outcome === 'unsure' ? 1 : 0);
    const newCorrect = topicCorrect + (outcome === 'correct' ? 1 : 0);
    const nt = nextTier(tier, outcome, topicMax);
    setTier(nt); setHistory(newHist); setAsked(newAsked); setUnsure(newUnsure); setTopicCorrect(newCorrect);
    if (shouldStop(newHist, newAsked, topic)) { finalizeTopic(newHist, newUnsure, newCorrect, results); return; }
    const next = pickNextQuestion(topic, nt, newAsked);
    if (!next) { finalizeTopic(newHist, newUnsure, newCorrect, results); return; }
    setCurrent(next); setPicked(null); setLocked(false); setChecked(false);
  };

  // Setting up screen (dried-out assembly), then the plan.
  useEffect(() => { if (phase === 'settingup') { const t = setTimeout(() => setPhase('result'), 1800); return () => clearTimeout(t); } }, [phase]);

  const skipAll = () => {
    const res = {};
    topics.forEach(tp => {
      const mx = maxTierFor(tp);
      res[tp] = { level: levelForTier(1, mx), tier: 1, answered: 0, unsureCount: 0, completedAt: Date.now() };
      saveTopicResult(tp, res[tp]);
    });
    finishCalibration(res[topics[0]]?.level || 'Foundations');
  };

  // If the user chose "Skip for now" at Find your level, seed tier 1 and move on.
  useEffect(() => { if (state.calibrationSkip) skipAll(); /* eslint-disable-next-line */ }, []);

  // Welcome-picker feed-forward: for the seeded topic only, pre-select the
  // level intent that matches the picked tier (Foundations/Intermediate/
  // Advanced -> starting/basics/comfortable). The user can still change it.
  const seed = state.pickerSeed;
  const SEED_INTENT = { foundations: 'start', intermediate: 'basics', advanced: 'comfortable' };
  useEffect(() => {
    if (phase === 'intent' && intent === null && seed?.touched && seed.seed === topic && SEED_INTENT[seed.tier]) {
      setIntent(SEED_INTENT[seed.tier]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ti]);

  // ── Setting up (dried-out assembly, ~1.8s) ─────────────────────
  if (phase === 'settingup') {
    const topicList = topics.map(tp => SUBJECT[tp]?.short || tp).join(', ');
    const items = [`Topics: ${topicList}`, 'Starting levels set', 'Review schedule ready', 'First lesson ready'];
    return (
      <OnboardingShell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '68vh', textAlign: 'center' }}>
          <div className="cal-spin" style={{ width: 46, height: 46, borderRadius: '50%', border: `3px solid ${T.border}`, borderTopColor: T.teal, marginBottom: 24 }} />
          <h1 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: T.ink, margin: '0 0 20px' }}>Setting up</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
            {items.map((it, i) => (
              <div key={i} className="ob-rise" style={{ ...riseDelay(i * 3), display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: T.correct, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="#fff" strokeWidth={3} /></span>
                <span style={{ fontSize: 13, color: T.inkSecondary, textAlign: 'left' }}>{it}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes calSpin { to { transform: rotate(360deg); } } .cal-spin { animation: calSpin .9s linear infinite; } @media (prefers-reduced-motion: reduce){ .cal-spin { animation: none; } }`}</style>
      </OnboardingShell>
    );
  }

  // ── Plan ready (factual) ───────────────────────────────────────
  if (phase === 'result') {
    const primary = topics.filter(tp => (results[tp]?.answered || 0) > 0).sort((a, b) => results[b].answered - results[a].answered)[0];
    const because = primary ? `${SUBJECT[primary]?.short || primary} starts at ${results[primary].level} - you got ${results[primary].correct} of ${results[primary].answered}.` : null;
    return (
      <OnboardingShell cta={<ChunkyButton onClick={() => finishCalibration(results[topics[0]]?.level || 'Foundations')}>Continue</ChunkyButton>}>
        <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: '6px 0 16px' }}>Your plan</h1>
        <div style={{ background: T.navy, borderRadius: 16, padding: 20, color: '#fff' }}>
          {topics.map(tp => {
            const s = SUBJECT[tp] || {};
            const r = results[tp] || {};
            return (
              <div key={tp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, background: s.tint || 'rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{s.emoji}</span>
                  <span style={{ fontSize: 14 }}>{s.short || tp}</span>
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: s.accent || T.gold }}>{r.level || 'Foundations'}</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            <span>First lesson</span><span style={{ fontWeight: 500 }}>Ready</span>
          </div>
        </div>
        {because && <p style={{ fontSize: 12.5, color: T.inkSecondary, lineHeight: 1.5, margin: '14px 2px 0' }}>{because}</p>}
      </OnboardingShell>
    );
  }

  // ── Level intent ──────────────────────────────────────────────
  if (phase === 'intent') {
    return (
      <OnboardingShell
        header={<ChromeBar subj={subj} value={(ti / Math.max(topics.length, 1)) * 100} labelLeft={`Topic ${ti + 1} of ${topics.length}`} />}
        cta={
          <>
            <ChunkyButton disabled={!intent} onClick={startQuestions}>Continue</ChunkyButton>
            <GhostButton onClick={skipAll} style={{ color: T.inkHint }}>Skip for now</GhostButton>
          </>
        }
      >
        <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: '10px 0 6px', lineHeight: 1.25 }}>
          How much do you already know about {subj.label}?
        </h1>
        <p style={{ fontSize: 13, color: T.inkSecondary, margin: '0 0 20px' }}>This just sets a starting point. The questions adapt as you go.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INTENTS.map((it, i) => (
            <OptionCard key={it.id} label={it.label} sublabel={it.sub} accent={subj.accent}
              className="ob-rise" style={riseDelay(i)}
              state={intent === it.id ? 'selected' : 'idle'} onClick={() => setIntent(it.id)} />
          ))}
        </div>
      </OnboardingShell>
    );
  }

  // ── Questions (adaptive) ──────────────────────────────────────
  const n = history.length + 1;
  return (
    <OnboardingShell
      header={<ChromeBar subj={subj} value={(history.length / MAX_Q) * 100} labelLeft={`Finding your level · ${subj.short}`} labelRight={`Question ${n}`} gold />}
      cta={checked
        ? <ChunkyButton onClick={advance}>Continue</ChunkyButton>
        : <GhostButton onClick={skipAll} style={{ color: T.inkHint }}>Skip for now</GhostButton>}
    >
      {current && (() => {
        const correct = picked === current.answerIndex;
        return (
          <>
            <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: T.ink, lineHeight: 1.4, margin: '12px 0 18px' }}>{current.prompt}</h2>
            <div key={current.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {current.options.map((opt, i) => {
                let st = 'idle';
                if (checked) st = i === current.answerIndex ? 'correct' : (i === picked ? 'selected' : 'dimmed');
                else if (picked === i) st = 'selected';
                return <OptionCard key={i} label={opt} accent={subj.accent} className="ob-rise" style={riseDelay(i)}
                  state={st} onClick={checked ? undefined : () => select(i)} />;
              })}
              <OptionCard label="I'm not sure yet" accent={subj.accent}
                className="ob-rise" style={riseDelay(current.options.length)}
                state={picked === 'unsure' ? 'selected' : (checked ? 'dimmed' : 'unsure')}
                onClick={checked ? undefined : () => select('unsure')} />
            </div>

            {checked ? (
              <div style={{ marginTop: 16, padding: '13px 15px', borderRadius: 12,
                background: correct ? 'rgba(42,155,110,0.08)' : picked === 'unsure' ? 'rgba(15,42,52,0.04)' : 'rgba(197,48,48,0.05)',
                border: `1px solid ${correct ? 'rgba(42,155,110,0.25)' : picked === 'unsure' ? T.border : 'rgba(197,48,48,0.2)'}` }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: correct ? '#2A9B6E' : picked === 'unsure' ? T.ink : '#C53030' }}>
                  {correct ? 'Correct' : picked === 'unsure' ? `The answer is ${current.options[current.answerIndex]}` : 'Not quite'}
                </div>
                <div style={{ fontSize: 13, color: T.inkSecondary, lineHeight: 1.5 }}>{current.why}</div>
              </div>
            ) : (
              <p style={{ fontSize: 12, color: T.inkHint, textAlign: 'center', margin: '16px 0 0', lineHeight: 1.5 }}>
                No penalties here - your answers shape the questions that follow.
              </p>
            )}
          </>
        );
      })()}
    </OnboardingShell>
  );
}

function ChromeBar({ subj, value, labelLeft, labelRight, gold }) {
  return (
    <div style={{ paddingBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: subj.accent }}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: subj.tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{subj.emoji}</span>
          {labelLeft}
        </span>
        {labelRight && <span style={{ fontSize: 12, color: T.inkHint }}>{labelRight}</span>}
      </div>
      <ProgressBar value={value} color={gold ? T.gold : subj.accent} />
    </div>
  );
}
