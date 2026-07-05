// Homepage sections, reused by the app onboarding so it looks exactly like the
// Deany website. Markup is copied verbatim from LandingPage.jsx (hero, steps,
// paths, sources) with the palette pulled from ./tokens. LandingPage itself is
// left untouched.
import React from 'react';
import { ShieldCheck, BookOpen, Heart, Users, Check } from 'lucide-react';
import { C, S, serif } from './tokens.js';
import heroLeft from '../../assets/hero-left.jpg';
import stepQuiz from '../../assets/step-quiz.jpg';
import stepBites from '../../assets/step-bites.jpg';
import stepHabit from '../../assets/step-habit.jpg';

// ── helpers ────────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: '1.5px', color: C.teal, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>{children}</div>
);

export const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 24 }}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.tealDeep, margin: 0, lineHeight: 1.3 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, maxWidth: 440, margin: '10px auto 0' }}>{sub}</p>}
  </div>
);

const TrustDots = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
    <div style={{ display: 'flex' }}>
      {[C.teal, C.gold, C.coral].map((bg, i) => (
        <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: bg, border: `2px solid ${C.heroWash}`, marginLeft: i ? -6 : 0, position: 'relative', zIndex: 3 - i }} />
      ))}
    </div>
    <span style={{ fontSize: 11, color: C.textFaint }}>Trusted by 1,247 learners across 38 countries</span>
  </div>
);

const HeroVisual = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: 280, height: 300 }}>
    <div style={{ position: 'absolute', top: 10, left: 0, width: 200, padding: '18px 16px', background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 8px 30px rgba(15,76,92,0.08)', transform: 'rotate(-6deg)', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{'\u{1F54C}'}</div>
        <div><div style={{ fontSize: 11, fontWeight: 700, color: C.tealDeep }}>Five Pillars</div><div style={{ fontSize: 9, color: C.textFaint }}>Lesson 1 of 7</div></div>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: C.tealSoft, overflow: 'hidden' }}><div style={{ width: '35%', height: '100%', borderRadius: 3, background: C.teal }} /></div>
    </div>
    <div style={{ position: 'absolute', top: 60, left: 36, width: 220, padding: '20px 18px', background: C.surface, borderRadius: 18, border: `1.5px solid ${C.border}`, boxShadow: '0 12px 40px rgba(15,76,92,0.12)', transform: 'rotate(2deg)', zIndex: 3 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: C.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{'\u{1F4B0}'}</div>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: C.tealDeep }}>Islamic Finance</div><div style={{ fontSize: 10, color: C.textMuted }}>Riba, Gharar, Maysir</div></div>
      </div>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.55, marginBottom: 14 }}>{'“'}Allah has permitted trade and forbidden riba.{'”'}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: C.goldSoft, overflow: 'hidden' }}><div style={{ width: '62%', height: '100%', borderRadius: 3, background: C.gold }} /></div>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.gold }}>62%</span>
      </div>
    </div>
    <div style={{ position: 'absolute', top: 180, left: 14, width: 195, padding: '16px 14px', background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: '0 6px 24px rgba(15,76,92,0.07)', transform: 'rotate(-3deg)', zIndex: 2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: '#E0EDF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{'\u{1F4D6}'}</div>
        <div><div style={{ fontSize: 11, fontWeight: 700, color: C.tealDeep }}>Quran Memorisation</div><div style={{ fontSize: 9, color: C.textFaint }}>Surah Al-Fatiha</div></div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>{[1,1,1,1,0,0,0].map((done, i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: done ? C.teal : C.tealSoft }} />))}</div>
    </div>
    <div style={{ position: 'absolute', top: 35, right: 0, zIndex: 4, background: C.surface, borderRadius: 20, padding: '6px 12px', boxShadow: '0 4px 16px rgba(15,76,92,0.1)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 14 }}>{'\u{1F525}'}</span><span style={{ fontSize: 11, fontWeight: 700, color: C.tealDeep }}>5 day streak</span>
    </div>
    <div style={{ position: 'absolute', bottom: 20, right: 4, zIndex: 4, background: C.tealSoft, borderRadius: 20, padding: '5px 11px', border: `1px solid rgba(34,163,154,0.2)`, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 12 }}>{'✅'}</span><span style={{ fontSize: 10, fontWeight: 700, color: C.tealDk }}>Correct!</span>
    </div>
  </div>
);

const TopicTile = ({ chipBg, emoji, title, level, borderColor }) => (
  <div style={{ background: C.surface, border: `1.5px solid ${borderColor}`, borderRadius: 14, textAlign: 'center', width: '100%', padding: '18px 10px', boxShadow: S.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}>{emoji}</div>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{title}</div>
    <div style={{ fontSize: 11, color: C.textFaint }}>{level}</div>
  </div>
);

// ── sections ───────────────────────────────────────────────────
export const HeroSection = () => (
  <section style={{ background: `linear-gradient(180deg, ${C.heroWash} 0%, ${C.canvas} 100%)`, padding: '46px 22px 34px' }}>
    <style>{`.ob-hero-left{display:flex}@media(max-width:639px){.ob-hero-left{display:none!important}.ob-hero-side{flex-basis:220px!important}}`}</style>
    <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap', justifyContent: 'center' }}>
      <div className="ob-hero-side ob-hero-left" style={{ flex: '0 1 300px', justifyContent: 'center', order: 1 }}>
        <img src={heroLeft} alt="An open book on a stand beside a shield, books, and prayer beads." style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block', mixBlendMode: 'multiply' }} />
      </div>
      <div style={{ flex: '1 1 320px', maxWidth: 400, textAlign: 'center', order: 2 }}>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 500, margin: '0 0 16px', color: C.textDeep, lineHeight: 1.12, letterSpacing: '-0.5px' }}>Start where you are.</h1>
        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, maxWidth: 340, margin: '0 auto 22px' }}>Ten-minute lessons on the Pillars, the Quran, Islamic finance, and history. Reviewed by scholars. No prerequisites.</p>
        <TrustDots />
      </div>
      <div className="ob-hero-side" style={{ flex: '0 1 280px', display: 'flex', justifyContent: 'center', order: 3 }}>
        <HeroVisual />
      </div>
    </div>
  </section>
);

const STEPS = [
  { n: '1', t: 'Find your level', d: 'A quick quiz places you at the right starting point.', img: stepQuiz, imgScale: 0.62 },
  { n: '2', t: 'Learn in bites', d: 'Small lessons make steady progress easy.', img: stepBites, imgShiftY: 52 },
  { n: '3', t: 'Build a daily habit', d: 'Show up daily and watch your knowledge grow.', img: stepHabit, imgScale: 0.88 },
];

export const StepsSection = () => (
  <section style={{ background: C.surface, padding: '40px 22px' }}>
    <style>{`.ob-steps3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}@media(max-width:639px){.ob-steps3{grid-template-columns:1fr;gap:24px}}`}</style>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <SectionHead eyebrow="Getting started" title="Three steps to begin" />
      <div className="ob-steps3">
        {STEPS.map(s => (
          <div key={s.n} style={{ textAlign: 'center', padding: '0 8px' }}>
            <div style={{ height: 272, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <img src={s.img} alt="" style={{ width: 272 * (s.imgScale || 1), height: 272 * (s.imgScale || 1), maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'multiply', marginTop: s.imgShiftY || 0 }} />
            </div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 8px', background: s.n === '2' ? C.tealPale : s.n === '3' ? '#22D86A' : C.gold, color: '#fff', fontFamily: serif, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</div>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, color: C.tealDeep, marginBottom: 5 }}>{s.t}</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.55, maxWidth: 200, margin: '0 auto' }}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PATHS = [
  { chipBg: C.emeraldSoft, emoji: '\u{1F54C}', title: '5 Pillars', level: 'Foundation', borderColor: 'rgba(42,155,110,0.6)' },
  { chipBg: C.goldSoft, emoji: '⚖️', title: 'Islamic Finance', level: 'Practical', borderColor: 'rgba(240,180,41,0.6)' },
  { chipBg: C.blueSoft, emoji: '\u{1F4D6}', title: 'Quran & Arabic', level: 'Language', borderColor: 'rgba(73,104,166,0.6)' },
  { chipBg: C.coralSoft, emoji: '\u{1F3DB}\u{FE0F}', title: 'Islamic History', level: 'Context', borderColor: 'rgba(232,82,58,0.6)' },
];

export const PathsSection = () => (
  <section style={{ padding: '40px 22px', background: C.surface }}>
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <SectionHead eyebrow="What you'll learn" title="Four paths to explore" sub="Start with one. Add more whenever you like." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {PATHS.map(p => <TopicTile key={p.title} {...p} />)}
      </div>
    </div>
  </section>
);

export const SourcesSection = () => (
  <section style={{ padding: '40px 22px', background: C.canvas }}>
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <SectionHead eyebrow="SOURCES & SCHOLARS" title="Built on trusted ground" sub="Every lesson is reviewed by qualified scholars before publication and cites primary sources you can verify." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', boxShadow: S.card }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 500, marginBottom: 10, letterSpacing: '0.5px' }}>PRIMARY SOURCES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: C.text, lineHeight: 1.4 }}>
            {['Quran with Saheeh International translation', 'Sahih al-Bukhari and Sahih Muslim', 'Tafsir Ibn Kathir and al-Tabari', 'AAOIFI standards for finance'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}><Check size={12} color={C.teal} style={{ marginTop: 2, flexShrink: 0 }} />{s}</div>
            ))}
          </div>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', boxShadow: S.card }}>
          <div style={{ fontSize: 11, color: C.teal, fontWeight: 500, marginBottom: 10, letterSpacing: '0.5px' }}>REVIEW PROCESS</div>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: '0 0 8px' }}>Every lesson passes three checks before it goes live:</p>
          <ul style={{ margin: '0 0 10px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {['Scholar review for doctrine', 'Teacher review for clarity', 'Citation audit for sources'].map(item => (
              <li key={item} style={{ fontSize: 12, color: C.text, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 7 }}><span style={{ color: C.teal, flexShrink: 0, lineHeight: 1.5 }}>{'•'}</span>{item}</li>
            ))}
          </ul>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: 0 }}>Where schools of thought differ, we flag it. We never flatten it.</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 16px', marginTop: 20, fontSize: 11, color: C.textMuted }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={14} color={C.tealDeep} /> Scholar reviewed</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} color={C.gold} /> Cited sources</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} color={C.coral} /> Free core</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} color={C.teal} /> Open to all faiths</div>
      </div>
    </div>
  </section>
);
