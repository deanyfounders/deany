// Sample quiz - the DEANY way taste. Two questions, lesson chrome (X, progress,
// streak flame), kit option cards + feedback sheet, particles on first correct.
// Nobody fails. Ends on a half-sheet interstitial. Questions are pending_mehdi.
import React, { useState } from 'react';
import { X, Flame } from 'lucide-react';
import { S1Screen } from './ui.jsx';
import OptionCard from '../../onboarding/kit/OptionCard.jsx';
import FeedbackSheet from '../../onboarding/kit/FeedbackSheet.jsx';
import { ProgressBar } from '../../onboarding/kit/Progress.jsx';
import { ChunkyButton } from '../../onboarding/kit/buttons.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';

// Reused VERBATIM from the website's "learn the Deany way" quiz
// (src/components/QuizSection.jsx). These are that quiz's own questions - not
// lesson content, not invented.
const QS = [
  {
    prompt: 'How long is a typical Deany lesson?',
    options: ['2 hours', 'About 10 minutes', '45 minutes'],
    answer: 1,
    payoff: 'Bite-sized by design. Short enough for a commute, deep enough to stick.',
  },
  {
    prompt: 'Complete the sentence: Deany is built for...',
    options: ['Only Muslims', 'Scholars', 'Everyone', 'Just curious (non-Muslim)', 'New Muslims only'],
    answer: 2,
    payoff: 'Practising Muslims, curious non-Muslims, new converts, born Muslims who never studied. Deany is built for every starting point.',
  },
];

export default function SampleQuiz({ onDone, onExit }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QS[idx];
  const correct = picked === q.answer;

  const check = () => {
    setChecked(true);
    if (correct && streak === 0) setStreak(1);
  };
  const cont = () => {
    if (idx < QS.length - 1) { setIdx(idx + 1); setPicked(null); setChecked(false); }
    else setFinished(true);
  };

  if (finished) {
    return (
      <S1Screen>
        <div style={{ flex: 1 }} />
        <div style={{ background: T.canvas }}>
          <div style={{ background: '#fff', borderTop: `1px solid ${T.border}`, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: '24px 22px calc(env(safe-area-inset-bottom) + 20px)' }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: T.tealDeep, marginBottom: 6 }}>That is the DEANY way</div>
            <p style={{ fontSize: 14, color: T.inkSecondary, lineHeight: 1.55, margin: '0 0 20px' }}>Short, active, and it sticks. Now let us find where you should start.</p>
            <ChunkyButton onClick={onDone}>Continue</ChunkyButton>
          </div>
        </div>
      </S1Screen>
    );
  }

  return (
    <S1Screen>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(env(safe-area-inset-top) + 12px) 18px 0' }}>
        <button onClick={onExit} aria-label="Exit" style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: T.inkSecondary }}><X size={20} /></button>
        <div style={{ flex: 1 }}><ProgressBar value={((idx + (checked ? 1 : 0)) / QS.length) * 100} color={T.teal} /></div>
        <span className={streak > 0 ? 'ob-pop' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 700, color: streak > 0 ? '#B07D08' : T.inkHint }}>
          <Flame size={16} color={streak > 0 ? T.gold : T.inkHint} /> {streak}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 22px 8px' }}>
        <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.teal, fontWeight: 500, marginBottom: 10 }}>The DEANY way · try one</div>
        <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: T.ink, lineHeight: 1.4, margin: '0 0 18px' }}>{q.prompt}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, i) => {
            let st = 'idle';
            if (checked) st = i === q.answer ? 'correct' : (i === picked ? 'selected' : 'dimmed');
            else if (i === picked) st = 'selected';
            return <OptionCard key={i} label={opt} accent={T.teal} state={st} onClick={checked ? undefined : () => setPicked(i)} />;
          })}
        </div>
      </div>

      {!checked && (
        <div style={{ flexShrink: 0, padding: '10px 22px calc(env(safe-area-inset-bottom) + 14px)' }}>
          <ChunkyButton disabled={picked === null} onClick={check}>Check</ChunkyButton>
        </div>
      )}

      <FeedbackSheet open={checked} correct={correct} title={correct ? 'Correct' : 'Good try'}
        message={correct ? q.payoff : `The answer is "${q.options[q.answer]}". ${q.payoff}`} onContinue={cont} />
    </S1Screen>
  );
}
