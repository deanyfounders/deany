// Phase 4 - Topic select. 2x2 grid, multi-select (min 1), dynamic CTA.
// Persists selection into app state; selected topics drive calibration.
import React, { useState } from 'react';
import OnboardingShell from '../kit/OnboardingShell.jsx';
import { PrimaryButton } from '../kit/buttons.jsx';
import TopicCard from '../kit/TopicCard.jsx';
import { T, SUBJECT, SERIF } from '../kit/tokens.js';

const ORDER = ['quran-arabic', 'islamic-history', '5-pillars', 'islamic-finance'];
const SUBS = {
  'quran-arabic': 'Read and understand',
  'islamic-history': 'Journey through time',
  '5-pillars': 'Foundations of faith',
  'islamic-finance': 'Money the halal way',
};

export default function TopicSelect({ appState }) {
  const { setTopics } = appState;
  const [sel, setSel] = useState([]);
  const toggle = (id) => setSel(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  const n = sel.length;

  return (
    <OnboardingShell
      cta={
        <PrimaryButton disabled={n === 0} onClick={() => setTopics(sel)}>
          {n === 0 ? 'Pick at least one topic' : `Continue with ${n} topic${n > 1 ? 's' : ''}`}
        </PrimaryButton>
      }
    >
      <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: '4px 0 8px', lineHeight: 1.25 }}>
        What do you want to learn?
      </h1>
      <p style={{ fontSize: 13, color: T.inkSecondary, lineHeight: 1.55, margin: '0 0 22px' }}>
        Pick as many as you like. You can change this later.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {ORDER.map(id => {
          const s = SUBJECT[id];
          return (
            <TopicCard
              key={id}
              emoji={s.emoji}
              title={s.label}
              sub={SUBS[id]}
              accent={s.accent}
              tint={s.tint}
              selected={sel.includes(id)}
              onClick={() => toggle(id)}
            />
          );
        })}
      </div>
    </OnboardingShell>
  );
}
