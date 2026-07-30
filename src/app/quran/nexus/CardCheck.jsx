// End-of-card check (spec 3.1). 2-3 tap-to-answer questions: attempt first,
// explanation after, one visible Skip. No-fail (the DEANY way). Completing - not
// skipping - calls onComplete(correctCount); the caller awards micro-activity XP
// once. Tests the story just read, never the lesson's skills. Mirrors the
// intro-page check interaction, in the reader's design system.
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { D, FONT, TYPE, RADIUS } from '../../dashboard/tokens.js';
import { NEXUS_COPY } from '../../../lib/nexus/copy.js';

const primaryBtn = { flex: 1, minHeight: 46, border: 'none', borderRadius: RADIUS.btnInCard, cursor: 'pointer', fontFamily: FONT, fontSize: TYPE.body, fontWeight: 700, background: D.tealDeep, color: '#fff' };
const ghostBtn = { minHeight: 46, padding: '0 18px', borderRadius: RADIUS.btnInCard, cursor: 'pointer', fontFamily: FONT, fontSize: TYPE.body, fontWeight: 600, background: 'none', border: `1px solid ${D.border}`, color: D.inkSecondary };

export default function CardCheck({ questions, onComplete, onSkip }) {
  const qs = (questions || []).filter((q) => q && q.q && q.q.trim()); // authored only
  const [started, setStarted] = useState(false);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);

  if (!qs.length) return null;

  if (!started) {
    return (
      <div style={{ marginTop: 18, borderTop: `1px solid ${D.border}`, paddingTop: 16 }}>
        <p style={{ margin: '0 0 12px', fontSize: TYPE.body, color: D.inkSecondary }}>{NEXUS_COPY.cardCheckIntro}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setStarted(true)} className="dash-press" style={primaryBtn}>Start</button>
          <button onClick={onSkip} className="dash-press" style={ghostBtn}>{NEXUS_COPY.skipAction}</button>
        </div>
      </div>
    );
  }

  const q = qs[i];
  const isCorrect = picked === q.answer_i;
  const last = i === qs.length - 1;

  const check = () => { if (picked == null) return; setChecked(true); if (isCorrect) setCorrect((c) => c + 1); };
  const next = () => {
    if (!last) { setI(i + 1); setPicked(null); setChecked(false); }
    else onComplete && onComplete(correct);
  };

  return (
    <div style={{ marginTop: 18, borderTop: `1px solid ${D.border}`, paddingTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: TYPE.hint, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: D.inkHint }}>Question {i + 1} of {qs.length}</span>
        <span style={{ flex: 1 }} />
        {!checked && <button onClick={onSkip} className="dash-press" style={{ border: 'none', background: 'none', color: D.inkHint, fontSize: TYPE.meta, fontWeight: 600, cursor: 'pointer' }}>{NEXUS_COPY.skipAction}</button>}
      </div>
      <p style={{ margin: '0 0 14px', fontSize: TYPE.cardTitle, fontWeight: 600, color: D.ink, lineHeight: 1.35 }}>{q.q}</p>

      <div style={{ display: 'grid', gap: 8 }}>
        {q.options.map((opt, oi) => {
          const isPicked = picked === oi;
          const showCorrect = checked && oi === q.answer_i;
          const showWrong = checked && isPicked && oi !== q.answer_i;
          const bg = showCorrect ? '#E9F6F1' : showWrong ? '#FBEFE9' : isPicked ? '#EEF4F2' : D.card;
          const border = showCorrect ? '#22A39A' : showWrong ? D.history : isPicked ? D.tealDeep : D.border;
          return (
            <button key={oi} onClick={() => !checked && setPicked(oi)} disabled={checked} className={checked ? '' : 'dash-press'}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, padding: '10px 14px', borderRadius: RADIUS.btnInCard, background: bg, border: `1.5px solid ${border}`, cursor: checked ? 'default' : 'pointer', fontFamily: FONT, fontSize: TYPE.body, color: D.ink }}>
              <span style={{ flex: 1 }}>{opt}</span>
              {showCorrect && <Check size={16} color="#0F6E56" />}
            </button>
          );
        })}
      </div>

      {checked && (
        <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: RADIUS.btnInCard, background: isCorrect ? '#E9F6F1' : '#FDF6E4', border: `1px solid ${isCorrect ? '#C6E5DC' : '#F0DFAE'}` }}>
          <p style={{ margin: 0, fontSize: TYPE.body, lineHeight: 1.55, color: D.inkSecondary }}>{q.explain}</p>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        {!checked
          ? <button onClick={check} disabled={picked == null} className={picked == null ? '' : 'dash-press'} style={{ ...primaryBtn, width: '100%', opacity: picked == null ? 0.5 : 1, cursor: picked == null ? 'default' : 'pointer' }}>Check</button>
          : <button onClick={next} className="dash-press" style={{ ...primaryBtn, width: '100%' }}>{last ? 'Done' : 'Next'}</button>}
      </div>
    </div>
  );
}
