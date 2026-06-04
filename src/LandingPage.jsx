import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck, BookOpen, Heart, Users, Clock, ArrowRight,
  Check, Plus, Minus, Menu, X
} from 'lucide-react';
import DeanyButton from './components/DeanyButton.jsx';
import QuizSection from './components/QuizSection.jsx';
import { playClick } from './utils/clickSound.js';
import stepQuiz from './assets/step-quiz.jpg';
import stepBites from './assets/step-bites.jpg';
import stepHabit from './assets/step-habit.jpg';

// ── Palette constants ──────────────────────────────────────────
const C = {
  canvas: '#FBFAF6', surface: '#FFFFFF', heroWash: '#EAF7F5',
  gold: '#F0B429', goldDk: '#C8901A', goldSoft: '#FCEFCF', goldText: '#5A3E00',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  tealSoft: '#DCF3EF', tealPale: '#7FD8CE',
  coral: '#E8523A', coralSoft: '#FCDDD5',
  emerald: '#2A9B6E', emeraldSoft: '#D6F0E4',
  blue: '#4968A6', blueSoft: '#DDE4F4',
  text: '#173A4A', textDeep: '#0F4C5C', textMuted: '#5E7480', textFaint: '#94A3AA',
  border: 'rgba(15,76,92,0.15)',
};
const S = {
  card: '0 1px 2px rgba(26,35,50,.05), 0 8px 24px rgba(26,35,50,.08)',
  cardRaised: '0 4px 8px rgba(26,35,50,.08), 0 18px 44px rgba(26,35,50,.14)',
};
const serif = 'Georgia, serif';
const arabic = "'Amiri', 'Noto Naskh Arabic', serif";

// ── Hero visual - floating lesson cards ─────────────────────────────────
const HeroVisual = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: 280, height: 300 }}>
    {/* Card 1 - back, tilted left */}
    <div style={{
      position: 'absolute', top: 10, left: 0, width: 200, padding: '18px 16px',
      background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
      boxShadow: '0 8px 30px rgba(15,76,92,0.08)',
      transform: 'rotate(-6deg)', zIndex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: C.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{'\u{1F54C}'}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.tealDeep }}>Five Pillars</div>
          <div style={{ fontSize: 9, color: C.textFaint }}>Lesson 1 of 7</div>
        </div>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: C.tealSoft, overflow: 'hidden' }}>
        <div style={{ width: '35%', height: '100%', borderRadius: 3, background: C.teal }} />
      </div>
    </div>

    {/* Card 2 - middle, prominent */}
    <div style={{
      position: 'absolute', top: 60, left: 36, width: 220, padding: '20px 18px',
      background: C.surface, borderRadius: 18, border: `1.5px solid ${C.border}`,
      boxShadow: '0 12px 40px rgba(15,76,92,0.12)',
      transform: 'rotate(2deg)', zIndex: 3,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: C.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{'\u{1F4B0}'}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.tealDeep }}>Islamic Finance</div>
          <div style={{ fontSize: 10, color: C.textMuted }}>Riba, Gharar, Maysir</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: C.text, lineHeight: 1.55, marginBottom: 14 }}>
        {'\u201C'}Allah has permitted trade and forbidden riba.{'\u201D'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: C.goldSoft, overflow: 'hidden' }}>
          <div style={{ width: '62%', height: '100%', borderRadius: 3, background: C.gold }} />
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.gold }}>62%</span>
      </div>
    </div>

    {/* Card 3 - front bottom, tilted right */}
    <div style={{
      position: 'absolute', top: 180, left: 14, width: 195, padding: '16px 14px',
      background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
      boxShadow: '0 6px 24px rgba(15,76,92,0.07)',
      transform: 'rotate(-3deg)', zIndex: 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: '#E0EDF7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{'\u{1F4D6}'}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.tealDeep }}>Quran Memorisation</div>
          <div style={{ fontSize: 9, color: C.textFaint }}>Surah Al-Fatiha</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1,1,1,1,0,0,0].map((done, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: done ? C.teal : C.tealSoft }} />
        ))}
      </div>
    </div>

    {/* Floating badge - streak */}
    <div style={{
      position: 'absolute', top: 35, right: 0, zIndex: 4,
      background: C.surface, borderRadius: 20, padding: '6px 12px',
      boxShadow: '0 4px 16px rgba(15,76,92,0.1)', border: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ fontSize: 14 }}>{'\u{1F525}'}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.tealDeep }}>5 day streak</span>
    </div>

    {/* Floating badge - correct */}
    <div style={{
      position: 'absolute', bottom: 20, right: 4, zIndex: 4,
      background: C.tealSoft, borderRadius: 20, padding: '5px 11px',
      border: `1px solid rgba(34,163,154,0.2)`,
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ fontSize: 12 }}>{'\u2705'}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.tealDk }}>Correct!</span>
    </div>
  </div>
);

// ── Trust dots ──────────────────────────────────────────────────
const TrustDots = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{ display: 'flex' }}>
      {[C.teal, C.gold, C.coral].map((bg, i) => (
        <div key={i} style={{ width: 22, height: 22, borderRadius: '50%', background: bg,
          border: `2px solid ${C.heroWash}`, marginLeft: i ? -6 : 0, position: 'relative', zIndex: 3 - i }} />
      ))}
    </div>
    <span style={{ fontSize: 11, color: C.textFaint }}>Trusted by 1,247 learners across 38 countries</span>
  </div>
);

// ── Eyebrow ────────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <div style={{ fontSize: 10, letterSpacing: '1.5px', color: C.teal, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>
    {children}
  </div>
);

// ── Section heading ────────────────────────────────────────────
const SectionHead = ({ eyebrow, title, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 24 }}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.tealDeep, margin: 0, lineHeight: 1.3 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, maxWidth: 440, margin: '10px auto 0' }}>{sub}</p>}
  </div>
);

// ── Avatar stack ───────────────────────────────────────────────
const AvatarStack = ({ size = 20 }) => (
  <div style={{ display: 'flex' }}>
    {[{ bg: C.teal, l: 'S' }, { bg: C.gold, l: 'F' }, { bg: C.tealDeep, l: 'M' }, { bg: C.coral, l: 'A' }].map((a, i) => (
      <div key={i} style={{ width: size, height: size, borderRadius: '50%', background: a.bg, color: '#fff', fontSize: size * 0.45,
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${C.canvas}`, marginLeft: i ? -6 : 0 }}>{a.l}</div>
    ))}
  </div>
);

// ── Topic tile (emoji chip + colored border) ────────────────────
const TopicTile = ({ chipBg, emoji, title, level, borderColor, borderHover, onClick }) => (
  <button onClick={() => { playClick(); onClick?.(); }} style={{ background: C.surface, border: `1.5px solid ${borderColor}`, borderRadius: 14,
    textAlign: 'center', cursor: 'pointer', width: '100%', padding: '18px 10px', boxShadow: S.card,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    transition: 'box-shadow .28s cubic-bezier(.2,.7,.3,1), transform .28s cubic-bezier(.2,.7,.3,1), border-color .28s ease' }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = S.cardRaised; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = borderHover; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = S.card; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = borderColor; }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: chipBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' }}>
      {emoji}
    </div>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{title}</div>
    <div style={{ fontSize: 11, color: C.textFaint }}>{level}</div>
  </button>
);

// ── FAQ item ───────────────────────────────────────────────────
const FAQItem = ({ q, a, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(defaultOpen ? 'auto' : 0);

  useEffect(() => {
    if (open && bodyRef.current) {
      setHeight(bodyRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', boxShadow: S.card,
      transition: 'box-shadow .2s ease' }}>
      <button onClick={() => { playClick(); setOpen(!open); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: 28 }}>
        <span style={{ fontSize: 13, color: C.tealDeep, fontWeight: 500, textAlign: 'left' }}>{q}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .25s ease', flexShrink: 0, marginLeft: 8 }}>
          {open ? <Minus size={14} color={C.teal} /> : <Plus size={14} color={C.teal} />}
        </span>
      </button>
      <div style={{ maxHeight: height === 'auto' ? 500 : height, overflow: 'hidden', transition: 'max-height .25s ease-out, opacity .2s ease',
        opacity: open ? 1 : 0 }}>
        <div ref={bodyRef} style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, paddingTop: 8 }}>{a}</div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
const LandingPage = ({ onGetStarted, onPreviewLesson, onCalibration, onSelectPath }) => {
  const [mobileNav, setMobileNav] = useState(false);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileNav(false); };

  const paths = [
    { chipBg: C.emeraldSoft, emoji: '\u{1F54C}', title: '5 Pillars', level: 'Foundation', borderColor: 'rgba(42,155,110,0.6)', borderHover: 'rgba(42,155,110,0.9)', topicId: '5-pillars' },
    { chipBg: C.goldSoft, emoji: '⚖️', title: 'Islamic Finance', level: 'Practical', borderColor: 'rgba(240,180,41,0.6)', borderHover: 'rgba(240,180,41,0.9)', topicId: 'islamic-finance' },
    { chipBg: C.blueSoft, emoji: '\u{1F4D6}', title: 'Quran & Arabic', level: 'Language', borderColor: 'rgba(73,104,166,0.6)', borderHover: 'rgba(73,104,166,0.9)', topicId: 'quran-arabic' },
    { chipBg: C.coralSoft, emoji: '\u{1F3DB}️', title: 'Islamic History', level: 'Context', borderColor: 'rgba(232,82,58,0.6)', borderHover: 'rgba(232,82,58,0.9)', topicId: 'islamic-history' },
  ];

  return (
    <div style={{ background: C.canvas, color: C.text, minHeight: '100vh' }}>
      <style>{`
        .steps3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .steps3-line { display: none; }
        @media (min-width: 640px) {
          .steps3-line { display: block; position: absolute; top: 23px; left: 16.66%; right: 16.66%;
            height: 0; border-top: 2px dotted rgba(15,76,92,0.20); z-index: 0; }
        }
        @media (max-width: 639px) {
          .topic-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps3 { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>

      {/* ── A1. NAV ─────────────────────────────────────────── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px',
        borderBottom: `1px solid rgba(15,76,92,0.1)`, background: 'rgba(251,250,246,0.85)', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 14, fontWeight: 500 }}>د</div>
          <span style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, color: C.tealDeep }}>Deany</span>
        </div>
        {/* Center links - desktop */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 18 }}>
          {['How it works', 'Paths', 'Sources', 'FAQ'].map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}
              style={{ fontSize: 12, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', transition: 'color .15s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = C.tealDeep}
              onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>{l}</button>
          ))}
        </div>
        {/* Right: quiet sign-in only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onGetStarted} className="hidden sm:inline"
            style={{ fontSize: 12, color: C.tealDeep, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Sign in</button>
          {/* Mobile hamburger */}
          <button className="sm:hidden" onClick={() => setMobileNav(!mobileNav)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {mobileNav ? <X size={20} color={C.tealDeep} /> : <Menu size={20} color={C.tealDeep} />}
          </button>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {mobileNav && (
        <div className="sm:hidden" style={{ background: C.canvas, borderBottom: `1px solid ${C.border}`, padding: '12px 22px', display: 'flex', flexDirection: 'column', gap: 12,
          animation: 'fadeSlideIn 0.2s ease-out' }}>
          {['How it works', 'Paths', 'Sources', 'FAQ'].map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g, '-'))}
              style={{ fontSize: 13, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>{l}</button>
          ))}
          <button onClick={() => { setMobileNav(false); onGetStarted?.(); }}
            style={{ fontSize: 13, color: C.tealDeep, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: 600 }}>Sign in</button>
        </div>
      )}

      {/* ── A2. HERO ────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(180deg, ${C.heroWash} 0%, ${C.canvas} 100%)`,
        padding: '54px 22px 40px', animation: 'slideUp 0.6s ease-out both' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left column */}
          <div style={{ flex: '1 1 360px', maxWidth: 520 }}>
            <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 500, margin: '0 0 16px', color: C.textDeep,
              lineHeight: 1.12, letterSpacing: '-0.5px' }}>
              Start where you are.
            </h1>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65, maxWidth: 340, margin: '0 0 26px' }}>
              Ten-minute lessons on the Pillars, the Quran, Islamic finance, and history. Reviewed by scholars. No prerequisites.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
              <DeanyButton variant="primary" onClick={onCalibration || onGetStarted}>
                Find your level
              </DeanyButton>
              <button onClick={onGetStarted}
                style={{ fontSize: 12.5, color: C.textMuted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color .15s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = C.tealDeep}
                onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
                I already have an account
              </button>
            </div>
            <TrustDots />
          </div>
          {/* Right column - geometric pattern */}
          <div style={{ flex: '0 1 280px', display: 'flex', justifyContent: 'center' }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── A3. TRUST STRIP ─────────────────────────────────── */}
      <section style={{ background: C.surface, borderTop: `1px solid rgba(15,76,92,0.1)`, borderBottom: `1px solid rgba(15,76,92,0.1)`,
        padding: '14px 22px', animation: 'slideUp 0.6s ease-out 0.1s both' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          flexWrap: 'wrap', gap: '8px 16px', fontSize: 11, color: C.textMuted, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShieldCheck size={14} color={C.tealDeep} /> Scholar reviewed</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><BookOpen size={14} color={C.gold} /> Cited sources</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Heart size={14} color={C.coral} /> Free forever core</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} color={C.teal} /> Open to all faiths</div>
        </div>
      </section>

      {/* ── A3b. GETTING STARTED (three steps) ──────────────── */}
      <section style={{ padding: '44px 22px 8px', background: C.canvas }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <SectionHead eyebrow="Getting started" title="Three steps to begin" />
          <div className="steps3">
            {[
              { n: '1', t: 'Find your level', d: 'A quick quiz places you at the right starting point.', img: stepQuiz, imgScale: 0.72, badgeBg: C.gold, badgeFg: '#FFFFFF' },
              { n: '2', t: 'Learn in bites', d: 'Small lessons make steady progress easy.', img: stepBites, imgShiftY: 16, badgeBg: '#7FD8CE', badgeFg: '#FFFFFF' },
              { n: '3', t: 'Build a daily habit', d: 'Show up daily and watch your knowledge grow.', img: stepHabit, badgeBg: '#22D86A', badgeFg: '#FFFFFF' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ height: 168, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {s.img ? (
                    <img src={s.img} alt="" style={{ width: 168 * (s.imgScale || 1), height: 168 * (s.imgScale || 1), objectFit: 'contain', mixBlendMode: 'multiply', marginTop: s.imgShiftY || 0,
                      transition: 'transform 0.3s cubic-bezier(.2,.7,.3,1)', willChange: 'transform', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-7px) scale(1.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }} />
                  ) : (
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: C.tealSoft,
                      color: C.tealDeep, border: `1.5px solid ${C.tealPale}`, fontFamily: serif, fontSize: 18, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</div>
                  )}
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 8px', background: s.badgeBg,
                  color: s.badgeFg, fontFamily: serif, fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</div>
                <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 500, color: C.tealDeep, marginBottom: 5 }}>{s.t}</div>
                <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.55, maxWidth: 200, margin: '0 auto' }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── A4. HOW IT WORKS (interactive quiz) ─────────────── */}
      <QuizSection />

      {/* ── A5. FOUR PATHS (topic tiles) ────────────────────── */}
      <section id="paths" style={{ padding: '40px 22px', background: C.surface }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <SectionHead eyebrow="Your turn" title="Pick a topic to start"
            sub="Start with one. Add more whenever you like." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
            className="topic-grid">
            {paths.map(p => <TopicTile key={p.title} {...p} onClick={() => onSelectPath ? onSelectPath(p.topicId) : onGetStarted()} />)}
          </div>
        </div>
      </section>

      {/* ── A7. SOURCES & SCHOLARS ──────────────────────────── */}
      <section id="sources" style={{ padding: '40px 22px', maxWidth: 700, margin: '0 auto' }}>
        <SectionHead eyebrow="SOURCES & SCHOLARS" title="Built on trusted ground"
          sub="Every lesson is reviewed by qualified scholars before publication and cites primary sources you can verify." />
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
            <p style={{ fontSize: 12, color: C.text, lineHeight: 1.6, margin: 0 }}>
              Each lesson passes three checks before it goes live: a scholar review for doctrine, a teacher review for clarity,
              and a citation audit. Disagreements between schools are flagged, not flattened.
            </p>
          </div>
        </div>
      </section>

      {/* ── A8. TESTIMONIALS ────────────────────────────────── */}
      <section style={{ padding: '32px 22px 40px', background: C.tealSoft }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SectionHead eyebrow="FROM OUR LEARNERS" title="Built for every starting point" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {/* Featured testimonial */}
            <div style={{ background: C.tealDeep, borderRadius: 14, padding: '24px 22px', boxShadow: S.cardRaised }}>
              <p style={{ fontSize: 16, color: C.canvas, lineHeight: 1.6, fontFamily: serif, fontStyle: 'italic', marginBottom: 12, marginTop: 0 }}>
                "I converted last year. Deany helped me actually understand the Pillars, not just memorize them."
              </p>
              <div style={{ fontSize: 12, color: 'rgba(251,250,246,0.7)' }}>Sarah, new Muslim · Manchester</div>
            </div>
            {/* Smaller testimonials */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {[
                { q: 'Not Muslim, just curious. The Finance path opened my eyes to a different way of thinking about money.', n: 'Marcus, finance grad', c: 'Toronto' },
                { q: 'Born Muslim, never studied properly. Deany makes it feel approachable, not intimidating.', n: 'Ahmed, learner', c: 'Dubai' },
              ].map((t, i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', boxShadow: S.card }}>
                  <p style={{ fontSize: 12, color: C.text, lineHeight: 1.55, fontFamily: serif, fontStyle: 'italic', marginBottom: 10, marginTop: 0 }}>
                    "{t.q}"
                  </p>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{t.n} · {t.c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── A9. FAQ ─────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '40px 22px', maxWidth: 600, margin: '0 auto' }}>
        <SectionHead eyebrow="QUESTIONS" title="Things people ask first" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 520, margin: '0 auto' }}>
          <FAQItem q="Is Deany free?" a="Yes. All core content is free and always will be. No credit card, no trial limits. We may offer optional premium features later, but the learning paths remain open." />
          <FAQItem q="Do I need to be Muslim to use it?" defaultOpen
            a="No. Deany is built for anyone who wants to learn, whether you are Muslim, curious, returning to faith, or studying for context. Lessons explain assumptions instead of assuming them." />
          <FAQItem q="Who reviews the content?" a="Every lesson passes a scholar review for doctrine, a teacher review for clarity, and a citation audit. All hadith are graded. Disagreements between schools are flagged, not flattened." />
          <FAQItem q="How long does a lesson take?" a="Most lessons take 5 to 15 minutes. You can pause and resume anytime. Your progress is saved automatically." />
          <FAQItem q="Can I use it offline?" a="Not yet, but offline mode is on the roadmap. For now, lessons load quickly on any connection." />
        </div>
      </section>

      {/* ── A10. FINAL CTA ──────────────────────────────────── */}
      <section style={{ padding: '48px 22px', background: C.tealDeep, textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontFamily: arabic, fontSize: 14, color: C.gold, marginBottom: 14, direction: 'rtl' }}>
            ابدأ من حيث أنت
          </div>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(24px, 4vw, 30px)', fontWeight: 500, color: C.canvas, lineHeight: 1.2, margin: '0 0 10px' }}>
            Your first lesson is two minutes away
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(251,250,246,0.7)', marginBottom: 22, lineHeight: 1.6 }}>
            Find your level, pick a path, and start today.
          </p>
          <DeanyButton variant="primary" onClick={onCalibration || onGetStarted}>
            Find your level
          </DeanyButton>
          <div style={{ fontSize: 11, color: 'rgba(251,250,246,0.5)', marginTop: 14 }}>Free core content · No card required</div>
        </div>
      </section>

      {/* ── A11. FOOTER ─────────────────────────────────────── */}
      <footer style={{ padding: '18px 22px', background: C.tealDeep, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontFamily: serif, fontSize: 11 }}>د</div>
          <span style={{ fontFamily: serif, fontSize: 13, color: C.canvas }}>Deany</span>
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'rgba(251,250,246,0.6)' }}>
          <span>About</span><span>Sources</span><span>Privacy</span><span>Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
