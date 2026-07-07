// How it works - the definitive three-steps screen. Single screen (no carousel):
// three stacked cards, each a 66px illustration tile holding the website's
// Getting Started image (54px, object-fit contain) with a corner number chip
// (gold 1 / teal 2 / green 3). Copy is byte-identical to the website. Cards
// stagger in (0.15 / 0.55 / 0.95s). Chunky Continue.
//
// The images carry a baked-white backdrop, so - exactly like the website - they
// sit flush via mixBlendMode multiply directly on the card with NO tinted tile
// behind them (a tinted tile would show as a coloured square). Images are
// app-only 200px exports (~3.7x the 54px display), separate from the 272px
// files the website uses.
import React from 'react';
import { S1Header, S1Screen } from './ui.jsx';
import { ChunkyButton } from '../../onboarding/kit/buttons.jsx';
import { T, SERIF } from '../../onboarding/kit/tokens.js';
import stepQuiz from '../../assets/step-quiz-tile.jpg';
import stepBites from '../../assets/step-bites-tile.jpg';
import stepHabit from '../../assets/step-habit-tile.jpg';

const STEPS = [
  { img: stepQuiz, n: '1', chip: T.gold, heading: 'Find your level', line: 'A quick quiz places you at the right starting point.' },
  { img: stepBites, n: '2', chip: T.teal, heading: 'Learn in bites', line: 'Small lessons make steady progress easy.' },
  { img: stepHabit, n: '3', chip: '#22D86A', heading: 'Build a daily habit', line: 'Show up daily and watch your knowledge grow.' },
];

export default function HowItWorks({ onDone, onSkip, onBack }) {
  return (
    <S1Screen style={{ background: '#FFFFFF' }}>
      <S1Header onBack={onBack} dot={0} onSkip={onSkip} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 24px' }}>
        <div className="s3-head" style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: T.teal, fontWeight: 600, marginBottom: 6 }}>Getting started</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: T.ink, margin: 0 }}>Three steps to begin</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <div key={i} className="s3-card" style={{ animationDelay: `${[0.15, 0.55, 0.95][i]}s`,
              display: 'flex', alignItems: 'center', gap: 14, background: '#FFFFFF',
              border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, boxShadow: '0 1px 3px rgba(15,76,92,0.05)' }}>
              <div style={{ position: 'relative', flexShrink: 0, width: 66, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={s.img} alt="" loading="eager" decoding="async"
                  style={{ width: 54, height: 54, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                <span style={{ position: 'absolute', top: -7, right: -7, width: 22, height: 22, borderRadius: '50%',
                  background: s.chip, color: '#fff', fontFamily: SERIF, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(15,76,92,0.18)' }}>{s.n}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: T.ink, margin: '0 0 3px' }}>{s.heading}</h2>
                <p style={{ fontSize: 12.5, color: T.inkSecondary, lineHeight: 1.5, margin: 0 }}>{s.line}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: '12px 22px calc(env(safe-area-inset-bottom) + 16px)' }}>
        <ChunkyButton onClick={onDone}>Continue</ChunkyButton>
      </div>

      <style>{`
        @keyframes s3Rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes s3Fade { from { opacity: 0; } to { opacity: 1; } }
        .s3-card { animation: s3Rise .5s cubic-bezier(.2,.7,.3,1) both; }
        .s3-head { animation: s3Fade .35s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .s3-card { animation: s3Fade .35s ease-out both; } }
      `}</style>
    </S1Screen>
  );
}
