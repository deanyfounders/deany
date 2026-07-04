// Calibration quiz (Phase 3). Places the user on the lesson path so the app
// opens personalised. All questions are reused verbatim from scholar-reviewed
// lessons (see questions.js) - no new Islamic content is authored here.
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { DeanyMark, PillButton, TOKENS } from '../shared/AppScreen.jsx';
import { CALIBRATION_QUESTIONS as QS, bandFor, BAND_BLURB } from './questions.js';

const serif = 'Georgia, serif';
const GREEN = '#2A9B6E';
const RED = '#C53030';

export default function Calibrate({ appState }) {
  const { setCalibration } = appState;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QS[idx];
  const total = QS.length;
  const isLast = idx === total - 1;
  const locked = selected !== null;

  const choose = (i) => {
    if (locked) return;
    setSelected(i);
    if (i === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (isLast) { setDone(true); return; }
    setIdx(i => i + 1);
    setSelected(null);
  };

  // ── Result screen ──────────────────────────────────────────────
  if (done) {
    const level = bandFor(score);
    return (
      <Shell>
        <DeanyMark size={60} />
        <div style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: TOKENS.teal, fontWeight: 600, margin: '22px 0 6px' }}>
          Your starting point
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 30, fontWeight: 500, color: TOKENS.tealDeep, margin: '0 0 12px' }}>
          You're starting at {level}
        </h1>
        <p style={{ fontSize: 15, color: TOKENS.muted, lineHeight: 1.6, maxWidth: 330, margin: '0 0 8px' }}>
          {BAND_BLURB[level]}
        </p>
        <p style={{ fontSize: 13, color: TOKENS.muted, opacity: 0.8, margin: '0 0 30px' }}>
          You answered {score} of {total} correctly.
        </p>
        <PillButton onClick={() => setCalibration(level)}>Create your account</PillButton>
      </Shell>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────
  const pct = Math.round(((idx + (locked ? 1 : 0)) / total) * 100);
  return (
    <Shell align="stretch">
      {/* Progress header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: TOKENS.muted }}>Question {idx + 1} of {total}</span>
        <button onClick={() => setCalibration('Foundations')} style={{
          background: 'none', border: 'none', color: TOKENS.muted, fontSize: 13, cursor: 'pointer', padding: 6, WebkitTapHighlightColor: 'transparent',
        }}>Skip for now</button>
      </div>
      <div style={{ height: 6, background: 'rgba(15,76,92,0.10)', borderRadius: 3, overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: TOKENS.teal, borderRadius: 3, transition: 'width .3s ease' }} />
      </div>

      {/* Question */}
      <div style={{ fontSize: 11, letterSpacing: '1.2px', textTransform: 'uppercase', color: TOKENS.teal, fontWeight: 600, marginBottom: 8 }}>{q.topic}</div>
      <h2 style={{ fontFamily: serif, fontSize: 20, fontWeight: 500, color: TOKENS.navy, lineHeight: 1.4, margin: '0 0 18px' }}>{q.question}</h2>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isChosen = i === selected;
          let border = TOKENS.border, bg = '#fff', icon = null;
          if (locked && isCorrect) { border = GREEN; bg = 'rgba(42,155,110,0.08)'; icon = <Check size={17} color={GREEN} />; }
          else if (locked && isChosen && !isCorrect) { border = RED; bg = 'rgba(197,48,48,0.06)'; icon = <X size={17} color={RED} />; }
          return (
            <button key={i} onClick={() => choose(i)} disabled={locked}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                padding: '14px 15px', border: `1.5px solid ${border}`, borderRadius: 13, background: bg,
                cursor: locked ? 'default' : 'pointer', minHeight: 52, fontSize: 15, color: TOKENS.navy, lineHeight: 1.4,
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
                transition: 'border-color .15s, background .15s',
              }}>
              <span style={{ flex: 1 }}>{opt}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {/* Feedback + continue */}
      {locked && (
        <>
          <div style={{
            marginTop: 16, padding: '13px 15px', borderRadius: 12,
            background: selected === q.correct ? 'rgba(42,155,110,0.08)' : 'rgba(197,48,48,0.05)',
            border: `1px solid ${selected === q.correct ? 'rgba(42,155,110,0.25)' : 'rgba(197,48,48,0.2)'}`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: selected === q.correct ? GREEN : RED, marginBottom: 4 }}>
              {selected === q.correct ? 'Correct' : 'Not quite'}
            </div>
            <div style={{ fontSize: 13.5, color: TOKENS.navy, lineHeight: 1.5 }}>{q.explanation}</div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <PillButton onClick={next}>{isLast ? 'See your result' : 'Continue'}</PillButton>
          </div>
        </>
      )}
    </Shell>
  );
}

// Scroll-friendly shell (quiz can exceed viewport height).
function Shell({ children, align = 'center' }) {
  return (
    <div style={{ minHeight: '100vh', background: TOKENS.canvas, color: TOKENS.navy, fontFamily: '"Source Sans 3", system-ui, sans-serif' }}>
      <div style={{
        maxWidth: 440, margin: '0 auto', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: align, justifyContent: 'center',
        textAlign: align === 'center' ? 'center' : 'left',
        padding: 'calc(env(safe-area-inset-top) + 28px) 22px calc(env(safe-area-inset-bottom) + 34px)',
      }}>
        {children}
      </div>
    </div>
  );
}
