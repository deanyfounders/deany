// How it works - the definitive three-steps screen, on the shared intro system.
// Single screen (no carousel): three stacked cards, each holding the website's
// Getting Started image at 54px with a corner number chip (gold 1 / teal 2 /
// green 3). Copy is byte-identical to the website; cards stagger in.
//
// The images carry a baked-white backdrop, so - exactly like the website - they
// sit flush via mixBlendMode multiply directly on the white card with NO tinted
// tile behind them. Images are app-only 200px exports (~3.7x the 54px display),
// separate from the 272px files the website uses.
import React from 'react';
import { S1Header, S1Screen } from './ui.jsx';
import { ChunkyButton } from '../../onboarding/kit/buttons.jsx';
import { IX, SERIF, CARD_SHADOW, eyebrowStyle } from './theme.js';
import stepQuiz from '../../assets/step-quiz-tile.jpg';
import stepBites from '../../assets/step-bites-tile.jpg';
import stepHabit from '../../assets/step-habit-tile.jpg';

const STEPS = [
  { img: stepQuiz, n: '1', chip: IX.gold, heading: 'Find your level', line: 'A quick quiz places you at the right starting point.' },
  { img: stepBites, n: '2', chip: IX.teal, heading: 'Learn in bites', line: 'Small lessons make steady progress easy.' },
  { img: stepHabit, n: '3', chip: IX.green, heading: 'Build a daily habit', line: 'Show up daily and watch your knowledge grow.' },
];

export default function HowItWorks({ onDone, onSkip, onBack }) {
  return (
    <S1Screen>
      <S1Header onBack={onBack} dot={0} onSkip={onSkip} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 24px' }}>
        <div className="s3-head" style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ ...eyebrowStyle(), marginBottom: 6 }}>Getting started</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: IX.tealDeep, margin: 0 }}>Three steps to begin</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360, margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <div key={i} className="s3-card" style={{ animationDelay: `${[0.15, 0.55, 0.95][i]}s`,
              display: 'flex', alignItems: 'center', gap: 14, background: IX.surface,
              border: `1px solid ${IX.borderSoft}`, borderRadius: 18, padding: 14, boxShadow: CARD_SHADOW }}>
              <div style={{ position: 'relative', flexShrink: 0, width: 66, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={s.img} alt="" loading="eager" decoding="async"
                  style={{ width: 54, height: 54, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                <span style={{ position: 'absolute', top: -7, right: -7, width: 22, height: 22, borderRadius: '50%',
                  background: s.chip, color: '#fff', fontFamily: SERIF, fontSize: 12, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(15,76,92,0.18)' }}>{s.n}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 500, color: IX.tealDeep, margin: '0 0 3px' }}>{s.heading}</h2>
                <p style={{ fontSize: 12.5, color: IX.muted, lineHeight: 1.5, margin: 0 }}>{s.line}</p>
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
