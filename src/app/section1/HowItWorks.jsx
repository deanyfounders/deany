// How it works - 3 swipeable panes using the website's Getting Started step
// images and verbatim copy. Step chip, heading, one line. Chunky Continue.
import React, { useRef, useState } from 'react';
import { S1Header, S1Screen } from './ui.jsx';
import { ChunkyButton } from '../../onboarding/kit/buttons.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';
import stepQuiz from '../../assets/step-quiz.jpg';
import stepBites from '../../assets/step-bites.jpg';
import stepHabit from '../../assets/step-habit.jpg';

const STEPS = [
  { img: stepQuiz, chip: 'Step 1', heading: 'Find your level', line: 'A quick quiz places you at the right starting point.' },
  { img: stepBites, chip: 'Step 2', heading: 'Learn in bites', line: 'Small lessons make steady progress easy.' },
  { img: stepHabit, chip: 'Step 3', heading: 'Build a daily habit', line: 'Show up daily and watch your knowledge grow.' },
];

export default function HowItWorks({ onDone, onSkip, onBack }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const last = STEPS.length - 1;

  const onScroll = () => { const el = ref.current; if (!el) return; const i = Math.round(el.scrollLeft / el.clientWidth); if (i !== active) setActive(i); };
  const next = () => { if (active >= last) { onDone(); return; } const el = ref.current; el?.scrollTo({ left: (active + 1) * el.clientWidth, behavior: 'smooth' }); };

  return (
    <S1Screen>
      <S1Header onBack={onBack} dot={0} onSkip={onSkip} />

      <div ref={ref} onScroll={onScroll} className="s1-deck" style={{ flex: 1, minHeight: 0, display: 'flex', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', overscrollBehavior: 'contain' }}>
        {STEPS.map((s, i) => (
          <section key={i} style={{ flex: '0 0 100%', width: '100%', scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
            <div style={{ height: '46%', maxHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <img src={s.img} alt="" style={{ maxHeight: '100%', maxWidth: '80%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: T.tealDeep, background: '#E9F6F4', borderRadius: 999, padding: '4px 12px', marginBottom: 12 }}>{s.chip}</span>
            <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: T.ink, margin: '0 0 8px' }}>{s.heading}</h2>
            <p style={{ fontSize: 13, color: T.inkSecondary, lineHeight: 1.55, maxWidth: 300, margin: 0 }}>{s.line}</p>
          </section>
        ))}
      </div>

      <div style={{ flexShrink: 0, padding: '12px 22px calc(env(safe-area-inset-bottom) + 16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {STEPS.map((_, i) => <span key={i} style={{ width: i === active ? 18 : 7, height: 7, borderRadius: 4, background: i === active ? T.teal : 'rgba(15,76,92,0.18)', transition: 'width .25s ease' }} />)}
        </div>
        <ChunkyButton onClick={next}>{active === last ? 'Continue' : 'Next'}</ChunkyButton>
      </div>
      <style>{`.s1-deck::-webkit-scrollbar{display:none}.s1-deck{scrollbar-width:none}`}</style>
    </S1Screen>
  );
}
