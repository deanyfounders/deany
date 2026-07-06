// Phase 5 - Calibration flow. Per selected topic: level-intent, then an
// adaptive staircase of placement questions, then a "plan is ready" result.
// Placement only - default no per-question feedback. Nobody fails onboarding.
import React, { useState, useEffect } from 'react';
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

  const topic = topics[ti];
  const subj = SUBJECT[topic] || { label: 'this topic', short: 'Topic', accent: T.teal, tint: 'rgba(34,163,154,0.1)' };
  const topicMax = maxTierFor(topic);

  useEffect(() => { if (phase === 'result') haptic(); }, [phase]);

  const startQuestions = () => {
    const seed = seedTier(intent);
    const set = new Set();
    setTier(seed); setAsked(set); setHistory([]); setUnsure(0);
    setPicked(null); setLocked(false); setCurrent(pickNextQuestion(topic, seed, set));
    setPhase('questions');
  };

  const finalizeTopic = (hist, uns, nextResults) => {
    const ft = finalTierFrom(hist, topicMax);
    const result = { level: levelForTier(ft, topicMax), tier: ft, answered: hist.length, unsureCount: uns, completedAt: Date.now() };
    const merged = { ...nextResults, [topic]: result };
    setResults(merged);
    saveTopicResult(topic, result);
    if (ti + 1 < topics.length) { setTi(ti + 1); setIntent(null); setPhase('intent'); }
    else { setPhase('result'); }
  };

  const answer = (outcome, optIndex) => {
    if (locked) return;
    setPicked(optIndex);
    setLocked(true);
    const newHist = [...history, current.tier];
    const newAsked = new Set(asked); newAsked.add(current.id);
    const newUnsure = unsure + (outcome === 'unsure' ? 1 : 0);
    const nt = nextTier(tier, outcome, topicMax);
    setTimeout(() => {
      setTier(nt); setHistory(newHist); setAsked(newAsked); setUnsure(newUnsure);
      if (shouldStop(newHist, newAsked, topic)) { finalizeTopic(newHist, newUnsure, results); return; }
      const next = pickNextQuestion(topic, nt, newAsked);
      if (!next) { finalizeTopic(newHist, newUnsure, results); return; }
      setCurrent(next); setPicked(null); setLocked(false);
    }, 300);
  };

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

  // ── Result ─────────────────────────────────────────────────────
  if (phase === 'result') {
    return (
      <OnboardingShell cta={<ChunkyButton onClick={() => finishCalibration(results[topics[0]]?.level || 'Foundations')}>Continue</ChunkyButton>}>
        <div style={{ textAlign: 'center', margin: '6px 0 18px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: T.teal, fontWeight: 500, marginBottom: 8 }}>Your plan is ready</div>
            <Particles show color={T.gold} />
          </div>
          <h1 className="ob-rise" style={{ fontFamily: SERIF, fontSize: 25, fontWeight: 500, color: T.ink, margin: 0 }}>Here is where you start</h1>
        </div>
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
            <span>Daily goal</span><span style={{ color: T.gold, fontWeight: 500 }}>5 min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            <span>First lesson</span><span style={{ fontWeight: 500 }}>Ready</span>
          </div>
        </div>
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
      cta={<GhostButton onClick={skipAll} style={{ color: T.inkHint }}>Skip for now</GhostButton>}
    >
      {current && (
        <>
          <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: T.ink, lineHeight: 1.4, margin: '12px 0 18px' }}>{current.prompt}</h2>
          <div key={current.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.options.map((opt, i) => (
              <OptionCard key={i} label={opt} accent={subj.accent}
                className="ob-rise" style={riseDelay(i)}
                state={picked === i ? 'selected' : (locked ? 'dimmed' : 'idle')}
                onClick={() => answer(i === current.answerIndex ? 'correct' : 'wrong', i)} />
            ))}
            <OptionCard label="I'm not sure yet" accent={subj.accent}
              className="ob-rise" style={riseDelay(current.options.length)}
              state={picked === 'unsure' ? 'selected' : (locked ? 'dimmed' : 'unsure')}
              onClick={() => answer('unsure', 'unsure')} />
          </div>
          <p style={{ fontSize: 12, color: T.inkHint, textAlign: 'center', margin: '16px 0 0', lineHeight: 1.5 }}>
            No penalties here - your answers shape the questions that follow.
          </p>
        </>
      )}
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
