import React, { useCallback } from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock, Play, BookOpen } from 'lucide-react';
import DeanyButton from './components/DeanyButton.jsx';

/* ── Bright palette (mirrors Dashboard C) ─────────────────────────── */
const C = {
  canvas: '#FBFAF6', surface: '#FFFFFF',
  gold: '#F0B429', goldDk: '#C8901A', goldSoft: '#FCEFCF', goldText: '#5A3E00',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C', tealSoft: '#DCF3EF',
  coral: '#EF6F53', coralSoft: '#FBE5DE',
  blue: '#2E6E8E', blueSoft: '#E0EDF7',
  text: '#173A4A', textDeep: '#0F4C5C', textMuted: '#5E7480', textFaint: '#94A3AA',
  track: '#EDE6D6',
};
const S = {
  card: '0 1px 2px rgba(26,35,50,.05), 0 8px 24px rgba(26,35,50,.08)',
  cardRaised: '0 4px 8px rgba(26,35,50,.08), 0 18px 44px rgba(26,35,50,.14)',
};
const serif = 'Georgia, serif';
const focusRing = { outline: 'none' };
const focusVisibleRing = '0 0 0 2px #FBFAF6, 0 0 0 4px #22A39A';

/* ── Module enrichment data ────────────────────────────────────────── */
const MODULE_DATA = {
  'module-1': {
    badge: 'Foundation Module',
    desc: 'Learn the core filters behind halal finance: amanah, riba, gharar, maysir, and deal structure.',
    mastery: [
      'Explain wealth as amanah',
      'Identify riba, gharar, and maysir',
      'Judge whether a deal structure is halal',
      'Apply the custodian mindset to real scenarios',
    ],
    concepts: [
      { label: 'Amanah', color: 'blue' },
      { label: 'Riba', color: 'coral' },
      { label: 'Gharar', color: 'teal' },
      { label: 'Maysir', color: 'gold' },
      { label: 'Halal Deal Structure', color: 'blue' },
    ],
    lessonMeta: {
      'lesson-1-1': { type: 'Concept', desc: 'Why Islam is pro-trade and how the Prophet was a merchant.' },
      'lesson-1-2': { type: 'Concept', desc: 'The custodian mindset that changes how you think about wealth.' },
      'lesson-1-3': { type: 'Interactive Cases', desc: 'Spot the three prohibited structures in real finance scenarios.' },
      'lesson-1-4': { type: 'Scenario', desc: 'Learn to judge a deal by what it does, not what it is called.' },
      'lesson-1-5': { type: 'Practice', desc: 'Apply the toolkit to your own financial situation.' },
    },
  },
  shahada: {
    badge: 'Beginner Module',
    desc: 'Understand the declaration that opens the door to Islam: its words, its meaning, and what it asks of you.',
    mastery: [
      'Recite and understand the Shahadah',
      'Explain what la ilaha illa Allah negates and affirms',
      'Understand why the second testimony matters',
      'Know what it means to live by the Shahadah',
    ],
    concepts: [
      { label: 'Tawhid', color: 'blue' },
      { label: 'Shahadah', color: 'gold' },
      { label: 'Ilah', color: 'teal' },
      { label: 'Rasul', color: 'coral' },
    ],
    lessonMeta: {
      'b1-l1': { type: 'Concept', desc: 'The testimony that opens the door to Islam.' },
      'b1-l2': { type: 'Concept', desc: 'Why the Shahadah does not stop at illa Allah.' },
      'b1-l3': { type: 'Reflection', desc: 'What it means to live on the other side of the doorway.' },
    },
  },
  salah: {
    badge: 'Beginner Module',
    desc: 'Learn to pray with understanding: the times, the movements, the words, and how to handle mistakes.',
    mastery: [
      'Know the five prayer times and their purposes',
      'Perform wudu and understand its conditions',
      'Pray a complete salah from start to salam',
      'Handle mistakes calmly with sajdah al-sahw',
      'Join a congregation and pray with others',
    ],
    concepts: [
      { label: 'Wudu', color: 'blue' },
      { label: "Rak'ah", color: 'teal' },
      { label: 'Al-Fatihah', color: 'gold' },
      { label: 'Sajdah al-Sahw', color: 'coral' },
      { label: 'Tashahhud', color: 'blue' },
    ],
    lessonMeta: {
      's2-l1': { type: 'Concept', desc: 'Why salah is five appointments, not five obligations.' },
      's2-l2': { type: 'Practice', desc: 'Wudu, direction, and the conditions before prayer.' },
      's2-l3': { type: 'Interactive', desc: 'The structure of standing, bowing, and prostrating.' },
      's2-l4': { type: 'Interactive', desc: 'The words attached to each movement of prayer.' },
      's2-l5': { type: 'Scenario', desc: 'What to do when something goes wrong in salah.' },
      's2-l6': { type: 'Practice', desc: 'A complete walk-through of Fajr from start to salam.' },
      's2-l7': { type: 'Scenario', desc: 'Following the imam, joining late, and leading at home.' },
    },
  },
  'quran-memorisation': {
    badge: 'Quran Module',
    desc: 'Memorise Surah Al-Fatiha passage by passage with audio, repetition, and self-testing.',
    mastery: [
      'Recite Al-Fatiha from memory',
      'Recognise each passage by sound and text',
      'Self-correct using structured review',
    ],
    concepts: [
      { label: 'Al-Fatiha', color: 'gold' },
      { label: 'Hifz', color: 'teal' },
      { label: 'Tajweed Basics', color: 'blue' },
    ],
    lessonMeta: {
      'hifz-fatiha': { type: 'Memorisation', desc: 'The Opening - 7 verses, passage by passage.' },
    },
  },
  'quran-tafsir': {
    badge: 'Quran Module',
    desc: 'Understand what you recite: the meaning, context, and lessons of Surah Al-Fatiha.',
    mastery: [
      'Explain the meaning of each ayah in Al-Fatiha',
      'Understand the structure and flow of the surah',
      'Connect the words of prayer to their purpose',
    ],
    concepts: [
      { label: 'Tafsir', color: 'teal' },
      { label: 'Al-Fatiha', color: 'gold' },
      { label: 'Ibn Kathir', color: 'blue' },
    ],
    lessonMeta: {
      'tafsir-fatiha': { type: 'Tafsir', desc: 'Verse-by-verse meaning and context.' },
    },
  },
  'epoch-1': {
    badge: 'History · Epoch 1',
    desc: 'From the creation of the world to the eve of revelation: the story of humanity, pre-Islamic Arabia, and the man who would change everything.',
    mastery: [
      "Understand Islam's view of creation and human purpose",
      'Describe pre-Islamic Arabian society and trade',
      'Explain the Jahiliyyah period and its customs',
      'Know who the Quraysh were and why they mattered',
      "Trace the Prophet's life before revelation",
    ],
    concepts: [
      { label: 'Creation', color: 'blue' },
      { label: 'Jahiliyyah', color: 'coral' },
      { label: 'Quraysh', color: 'gold' },
      { label: 'Pre-Islamic Arabia', color: 'teal' },
    ],
    lessonMeta: {
      'creation': { type: 'Concept', desc: 'Creation, purpose & the prophetic chain.' },
      'arabia-before-islam': { type: 'Concept', desc: 'Geography, trade routes & tribal society.' },
      'jahiliyyah': { type: 'Concept', desc: 'Pre-Islamic customs & beliefs.' },
      'quraysh': { type: 'Concept', desc: "Makkah's guardians & power brokers." },
      'muhammad-before-message': { type: 'Concept', desc: 'Character, trade & the path to revelation.' },
    },
  },
};

const getModuleData = (modId) => MODULE_DATA[modId] || {
  badge: 'Module', desc: '', mastery: [], concepts: [], lessonMeta: {},
};

/* ── Pill color cycle (blue → teal → gold → coral, repeating) ──── */
const PILL_COLORS = [
  { bg: C.blueSoft, text: C.blue },
  { bg: C.tealSoft, text: C.tealDk },
  { bg: C.goldSoft, text: C.goldText },
  { bg: C.coralSoft, text: C.coral },
];
const pillColor = (i) => PILL_COLORS[i % PILL_COLORS.length];

/* ── Type badge colors ─────────────────────────────────────────── */
const typeBadgeColor = (type) => {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes('concept') || t.includes('interactive') || t.includes('memoris') || t.includes('tafsir'))
    return { bg: C.tealSoft, text: C.tealDk };
  if (t.includes('reflect'))
    return { bg: C.coralSoft, text: C.coral };
  if (t.includes('practice') || t.includes('scenario'))
    return { bg: C.goldSoft, text: C.goldText };
  return { bg: C.blueSoft, text: C.blue };
};

/* ── Path accent colors per topic ──────────────────────────────── */
const PATH_ACCENTS = {
  '5-pillars':       { soft: C.tealSoft, icon: C.tealDk, accent: C.teal },
  'islamic-finance': { soft: C.goldSoft, icon: C.goldText, accent: C.gold },
  'quran-arabic':    { soft: C.blueSoft, icon: C.blue, accent: C.blue },
  'islamic-history': { soft: C.coralSoft, icon: C.coral, accent: C.coral },
};

/* ================================================================ */
/*  ModuleOverview - root                                           */
/* ================================================================ */
const ModuleOverview = ({
  modules, topicId, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;

  return (
    <div style={{ background: C.canvas, minHeight: '100vh' }}>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        .mo-focus:focus { outline: none; }
        .mo-focus:focus-visible { box-shadow: ${focusVisibleRing}; }
        .mo-grid { grid-template-columns: 1fr; }
        @media (min-width: 768px) { .mo-grid { grid-template-columns: 45fr 55fr; align-items: start; } }
        @keyframes hizbPulse {
          0%,100% { box-shadow: 0 0 18px rgba(29,158,117,.45), 0 0 36px rgba(29,158,117,.25), 0 2px 8px rgba(15,110,86,.2); }
          50%     { box-shadow: 0 0 26px rgba(29,158,117,.70), 0 0 52px rgba(29,158,117,.40), 0 2px 8px rgba(15,110,86,.2); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .hizb-disc { animation: hizbPulse 3s ease-in-out infinite; }
        }
        .mo-milestone-wrap { flex-wrap: nowrap; }
        @media (max-width: 600px) { .mo-milestone-wrap { flex-wrap: wrap; } }
        @keyframes hizbGlow {
          0%,100% { filter: drop-shadow(0 0 5px rgba(29,158,117,.5)); }
          50%     { filter: drop-shadow(0 0 9px rgba(29,158,117,.8)); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .hizb-glow { animation: hizbGlow 3s ease-in-out infinite; }
        }
        .quran-sep-bands { display: flex; }
        .quran-sep-label-mobile { display: none; }
        @media (max-width: 520px) {
          .quran-sep-bands { display: none !important; }
          .quran-sep-label-mobile { display: flex !important; }
          .quran-sep-label-desktop { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 20px 48px' }}>
        {/* Nav bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button onClick={onBack} className="mo-focus"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: C.textMuted, fontSize: 13, fontWeight: 500, minHeight: 48, padding: '0 4px',
              transition: 'color .15s', ...focusRing }}
            onMouseEnter={e => e.currentTarget.style.color = C.textDeep}
            onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
            <ChevronLeft size={16} /><span>Back</span>
          </button>
          <button onClick={onHome} className="mo-focus"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
              cursor: 'pointer', color: C.textMuted, fontSize: 13, fontWeight: 500, minHeight: 48, padding: '0 4px',
              transition: 'color .15s', ...focusRing }}
            onMouseEnter={e => e.currentTarget.style.color = C.textDeep}
            onMouseLeave={e => e.currentTarget.style.color = C.textMuted}>
            <Home size={16} /><span>Home</span>
          </button>
        </div>

        {modules.map((mod, mi) => {
          const isLast = mi === modules.length - 1;
          const nextMod = isLast ? null : modules[mi + 1];
          const SepComponent = topicId === 'quran-arabic' ? QuranModuleSeparator : ModuleMilestone;
          return (
            <React.Fragment key={mod.id}>
              <ModuleBlock mod={mod} mi={mi} topicId={topicId} completedLessons={completedLessons}
                loadProgress={loadProgress} onSelectLesson={onSelectLesson} onSelectModule={onSelectModule} />
              {!isLast && nextMod && (
                <SepComponent
                  prevMod={mod} prevIndex={mi} nextMod={nextMod} nextIndex={mi + 1}
                  modules={modules} completedLessons={completedLessons} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ================================================================ */
/*  ModuleMilestone - separator bar between modules                 */
/* ================================================================ */
const ModuleMilestone = ({ prevMod, prevIndex, nextMod, nextIndex, modules, completedLessons }) => {
  const isModComplete = (mod) => {
    const lessons = mod.lessons || [];
    if (!lessons.length) return false;
    return lessons.every((_, i) => !!completedLessons[`${mod.id}-lesson-${i}`]);
  };

  const prevComplete = isModComplete(prevMod);
  const completedCount = modules.filter(m => isModComplete(m)).length;
  const totalCount = modules.length;

  const getModDotState = (mod, idx) => {
    if (isModComplete(mod)) return 'done';
    const lessons = mod.lessons || [];
    if (lessons.length && lessons.some((_, i) => !!completedLessons[`${mod.id}-lesson-${i}`])) return 'current';
    // first module with lessons that isn't complete
    const firstIncomplete = modules.findIndex(m => (m.lessons?.length || 0) > 0 && !isModComplete(m));
    if (idx === firstIncomplete) return 'current';
    return 'upcoming';
  };

  const dotColors = { done: '#0F8A5F', current: '#22A39A', upcoming: '#a9d4cb' };
  const data = getModuleData(nextMod.id);

  return (
    <div style={{
      background: '#EAF7F5', border: '1px solid rgba(34,163,154,.2)', borderRadius: 16,
      padding: '15px 18px', margin: '24px 0',
      display: 'flex', alignItems: 'center', gap: 15,
    }} className="mo-milestone-wrap">

      {/* Left - glowing hizb disc */}
      <div className="hizb-disc" aria-hidden="true" style={{
        width: 54, height: 54, borderRadius: '50%', background: '#fff', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 22px rgba(29,158,117,.55), 0 0 44px rgba(29,158,117,.3), 0 2px 8px rgba(15,110,86,.2)',
      }}>
        <span style={{ fontSize: 28, color: '#0F8A5F', filter: 'drop-shadow(0 0 6px rgba(29,158,117,.6))', lineHeight: 1 }}>
          &#1758;
        </span>
      </div>

      {/* Center - text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#1A8C82' }}>
          {prevComplete ? `Module ${prevIndex + 1} complete \u00B7 next up` : 'Up next'}
        </div>
        <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, color: '#0F4C5C', marginTop: 3, lineHeight: 1.3 }}>
          Module {nextIndex + 1} - {nextMod.title}
        </div>
      </div>

      {/* Right - journey progress */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontSize: 8.5, color: '#5fa595', marginBottom: 3 }}>your journey</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#0F6E56', marginBottom: 5 }}>
          {completedCount} of {totalCount} modules
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          {modules.map((m, i) => (
            <div key={m.id} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: dotColors[getModDotState(m, i)],
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================================================================ */
/*  QuranModuleSeparator - manuscript-style divider for Quran track */
/* ================================================================ */
const QuatrefoilBand = ({ fadeDir }) => {
  const maskImage = fadeDir === 'left'
    ? 'linear-gradient(to right, transparent 0%, black 100%)'
    : 'linear-gradient(to left, transparent 0%, black 100%)';
  return (
    <svg style={{ flex: 1, height: 22, WebkitMaskImage: maskImage, maskImage }}
      preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`qf-${fadeDir}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M11 1 C7.5 4, 7.5 8, 11 11 C14.5 8, 14.5 4, 11 1" fill="none" stroke="#235C7A" strokeWidth="1" opacity="0.75" />
          <path d="M11 21 C7.5 18, 7.5 14, 11 11 C14.5 14, 14.5 18, 11 21" fill="none" stroke="#235C7A" strokeWidth="1" opacity="0.75" />
          <path d="M1 11 C4 7.5, 8 7.5, 11 11 C8 14.5, 4 14.5, 1 11" fill="none" stroke="#235C7A" strokeWidth="1" opacity="0.75" />
          <path d="M21 11 C18 7.5, 14 7.5, 11 11 C14 14.5, 18 14.5, 21 11" fill="none" stroke="#235C7A" strokeWidth="1" opacity="0.75" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#qf-${fadeDir})`} />
    </svg>
  );
};

const HizbGlyph = () => (
  <span className="hizb-glow" aria-hidden="true" style={{
    fontSize: 23, color: '#0F8A5F', lineHeight: 1, flexShrink: 0,
    filter: 'drop-shadow(0 0 6px rgba(29,158,117,.6))',
  }}>&#1758;</span>
);

const QuranModuleSeparator = ({ prevMod, prevIndex, nextMod, nextIndex, modules, completedLessons }) => {
  const isModComplete = (mod) => {
    const lessons = mod.lessons || [];
    if (!lessons.length) return false;
    return lessons.every((_, i) => !!completedLessons[`${mod.id}-lesson-${i}`]);
  };
  const prevComplete = isModComplete(prevMod);

  const labelBlock = (
    <div style={{ flexShrink: 0, textAlign: 'center', padding: '0 14px' }}>
      <div style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#235C7A' }}>
        {prevComplete ? `${prevMod.title} complete \u00B7 next` : 'Up next'}
      </div>
      <div style={{ fontFamily: serif, fontSize: 15.5, fontWeight: 600, color: '#0F4C5C', marginTop: 2, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
        {nextMod.title}
      </div>
    </div>
  );

  return (
    <div style={{ margin: '26px 0' }}>
      {/* Desktop: full symmetric layout */}
      <div className="quran-sep-bands" style={{ alignItems: 'center', gap: 10 }}>
        <HizbGlyph />
        <QuatrefoilBand fadeDir="left" />
        {labelBlock}
        <QuatrefoilBand fadeDir="right" />
        <HizbGlyph />
      </div>

      {/* Mobile: stacked hizb + label */}
      <div className="quran-sep-label-mobile" style={{
        flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <HizbGlyph />
        {labelBlock}
      </div>
    </div>
  );
};

/* ================================================================ */
/*  ModuleBlock - the two-column layout per module                  */
/* ================================================================ */
const ModuleBlock = ({ mod, mi, topicId, completedLessons, loadProgress, onSelectLesson, onSelectModule }) => {
  const lessons = mod.lessons || [];
  const isDone = (i) => !!completedLessons[`${mod.id}-lesson-${i}`];
  const doneCount = lessons.filter((_, i) => isDone(i)).length;
  const pct = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
  const curIdx = lessons.findIndex((_, i) => !isDone(i));
  const totalMin = lessons.reduce((sum, l) => sum + (parseInt(l.duration) || 0), 0);
  const getState = (i) => {
    if (isDone(i)) return 'done';
    if (i === curIdx) return 'current';
    return 'locked';
  };

  const handleLessonClick = useCallback((lesson, i) => {
    onSelectLesson(lesson, i);
  }, [onSelectLesson]);

  /* Speed round - keep existing card */
  if (mod.isSpeedRound) return (
    <button onClick={() => onSelectModule(mod, mi)} className="mo-focus"
      style={{ width: '100%', borderRadius: 16, padding: 24, textAlign: 'left', background: C.surface,
        border: `1px solid rgba(15,76,92,0.12)`, boxShadow: S.card, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24,
        transition: 'box-shadow .2s, transform .2s', ...focusRing }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = S.cardRaised; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = S.card; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', flexShrink: 0 }}>
        <Zap size={28} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: serif, fontWeight: 600, color: C.textDeep, margin: 0, fontSize: 17 }}>{mod.title}</h3>
        <p style={{ color: C.textMuted, margin: '4px 0 0', fontSize: 13 }}>{mod.subtitle}</p>
      </div>
      <ArrowRight size={20} color={C.textFaint} />
    </button>
  );

  /* Empty / coming soon */
  if (!lessons.length) return (
    <div style={{ borderRadius: 16, padding: 24, background: C.surface, border: '1px solid rgba(15,76,92,0.12)',
      boxShadow: '0 1px 4px rgba(26,35,50,.03)', marginBottom: 24, opacity: 0.6,
      display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15,76,92,0.05)', flexShrink: 0 }}>
        <Lock size={24} color={C.textFaint} />
      </div>
      <div>
        <h3 style={{ fontFamily: serif, fontWeight: 600, color: C.textMuted, margin: 0, fontSize: 17 }}>{mod.title}</h3>
        <p style={{ color: C.textFaint, margin: '4px 0 0', fontSize: 13 }}>{mod.subtitle}</p>
        <span style={{ display: 'inline-block', marginTop: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20,
          background: C.goldSoft, color: C.goldText }}>Coming Soon</span>
      </div>
    </div>
  );

  const data = getModuleData(mod.id);
  const accent = PATH_ACCENTS[topicId] || PATH_ACCENTS['5-pillars'];

  return (
    <div style={{ display: 'grid', gap: 32, marginBottom: 48 }} className="mo-grid">

      {/* ── LEFT: Module summary panel ─────────────────────────── */}
      <div style={{ background: C.surface, borderRadius: 16, padding: 28, boxShadow: S.card,
        border: '1px solid rgba(15,76,92,0.08)' }}>

        {/* 1. Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: accent.soft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={18} color={accent.icon} />
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: accent.accent, lineHeight: 1 }}>
              {data.badge || `Module ${mi + 1}`} · {mod.difficulty || 'Beginner'}
            </div>
            <h2 style={{ fontFamily: serif, fontSize: 21, fontWeight: 600, color: C.textDeep,
              margin: '4px 0 0', lineHeight: 1.25 }}>
              {mod.title}
            </h2>
          </div>
        </div>

        {/* 2. Description */}
        {data.desc && (
          <p style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.55, margin: '0 0 20px' }}>
            {data.desc}
          </p>
        )}

        {/* 3. Progress row + bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.textMuted }}>{pct}% complete</span>
            <span style={{ fontSize: 10, color: C.textFaint }}>{lessons.length} lessons · {totalMin} min</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.track, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: accent.accent, width: `${pct}%`,
              transition: 'width .5s ease-out' }} />
          </div>
        </div>

        {/* 4. What you'll master */}
        {data.mastery.length > 0 && (
          <div style={{ background: C.canvas, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: accent.accent, marginBottom: 12 }}>
              What you'll master
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.mastery.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: accent.icon, fontWeight: 700, fontSize: 13, lineHeight: '18px', flexShrink: 0 }}>
                    &#10003;
                  </span>
                  <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Key concepts - multicolor pills */}
        {data.concepts.length > 0 && (
          <div style={{ background: C.canvas, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: C.goldText, marginBottom: 12 }}>
              Key concepts
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {data.concepts.map((c, ci) => {
                const pc = pillColor(ci);
                return (
                  <span key={c.label} style={{ fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
                    background: pc.bg, color: pc.text }}>
                    {c.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        {curIdx >= 0 && (
          <div style={{ marginTop: 20 }}>
            <DeanyButton variant="primary" onClick={() => onSelectLesson(lessons[curIdx], curIdx)}
              style={{ width: '100%', gap: 8 }}>
              <Play size={15} fill={C.goldText} color={C.goldText} />
              {doneCount > 0 ? 'Continue Learning' : 'Start Learning'}
            </DeanyButton>
          </div>
        )}
      </div>

      {/* ── RIGHT: Lesson timeline ─────────────────────────────── */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase',
          color: accent.accent, marginBottom: 20 }}>
          Learning path
        </div>

        <div style={{ position: 'relative' }}>
          {lessons.map((lesson, i) => {
            const st = getState(i);
            const saved = !!loadProgress?.(lesson.id);
            const isLast = i === lessons.length - 1;
            const meta = data.lessonMeta[lesson.id] || {};
            return (
              <LessonTimelineRow key={lesson.id} lesson={lesson} index={i} state={st}
                saved={saved} isLast={isLast} meta={meta} isCurrent={i === curIdx}
                accent={accent} onClick={() => handleLessonClick(lesson, i)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================================================================ */
/*  LessonTimelineRow - node + connector + card                     */
/* ================================================================ */
const LessonTimelineRow = ({ lesson, index, state, saved, isLast, meta, isCurrent, accent, onClick }) => {
  const isDone = state === 'done';
  const isCur = state === 'current';
  const isLocked = state === 'locked';

  /* Connector color: solid accent above completed nodes, faint otherwise */
  const ac = accent || PATH_ACCENTS['5-pillars'];
  const connectorColor = isDone ? ac.accent : C.track;
  const nextConnectorColor = C.track; // below current/locked = faint

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>

      {/* ── Spine column (36px wide) ─────────────────────────── */}
      <div style={{ width: 36, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative' }}>

        {/* Top connector segment */}
        {index > 0 && (
          <div style={{ width: 2, flexGrow: 0, height: 12, background: connectorColor }} />
        )}

        {/* Node */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative', zIndex: 2,
          ...(isDone ? {
            background: ac.accent,
            boxShadow: `0 2px 8px ${ac.accent}4D`,
          } : isCur ? {
            background: C.gold,
            boxShadow: `0 3px 0 ${C.goldDk}, 0 2px 10px rgba(240,180,41,0.3)`,
            cursor: 'pointer',
          } : {
            background: C.surface,
            border: `2px solid ${C.textFaint}`,
          }),
        }}>
          {isDone ? (
            <Check size={16} color="#fff" strokeWidth={3} />
          ) : isCur ? (
            <Play size={14} color="#fff" fill="#fff" />
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: C.textFaint }}>{index + 1}</span>
          )}
        </div>

        {/* Bottom connector segment */}
        {!isLast && (
          <div style={{ width: 2, flexGrow: 1, minHeight: 12,
            background: isDone ? ac.accent : C.track }} />
        )}
      </div>

      {/* ── Lesson card ──────────────────────────────────────── */}
      <button onClick={onClick} className="mo-focus"
        style={{
          flex: 1, marginLeft: 14, marginBottom: isLast ? 0 : 12,
          borderRadius: 14, padding: '18px 20px', textAlign: 'left',
          background: C.surface,
          border: isCur ? 'none' : `1px solid rgba(15,76,92,0.10)`,
          borderLeft: isCur ? `4px solid ${ac.accent}` : undefined,
          boxShadow: isCur
            ? `0 4px 20px ${ac.accent}1F, ${S.card}`
            : isDone ? S.card : '0 1px 4px rgba(26,35,50,.03)',
          opacity: isLocked ? 0.88 : 1,
          cursor: isLocked ? 'default' : 'pointer',
          transition: 'box-shadow .2s ease, transform .2s ease',
          minHeight: 48,
          ...focusRing,
        }}
        onMouseEnter={e => {
          if (!isLocked) {
            e.currentTarget.style.boxShadow = S.cardRaised;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = isCur
            ? `0 4px 20px ${ac.accent}1F, ${S.card}`
            : isDone ? S.card : '0 1px 4px rgba(26,35,50,.03)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>

        {/* Top meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase',
              color: (isDone || isCur) ? ac.accent : C.textFaint }}>
              Lesson {index + 1}
            </span>
            {meta.type && (() => {
              const tc = typeBadgeColor(meta.type);
              return (
                <span style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                  background: tc.bg, color: tc.text }}>
                  {meta.type}
                </span>
              );
            })()}
          </div>

          {/* START / RESUME badge for active lesson */}
          {isCur && (
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
              padding: '3px 12px', borderRadius: 20, background: C.goldSoft, color: C.goldText }}>
              {saved ? 'Resume' : 'Start'}
            </span>
          )}

          {/* Completed check */}
          {isDone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: ac.accent }}>
              <Check size={12} strokeWidth={3} />Done
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: serif, fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.35,
          color: isLocked ? C.textMuted : C.textDeep }}>
          {lesson.title}
        </h3>

        {/* Description */}
        {(meta.desc || lesson.description) && (
          <p style={{ fontSize: 12, lineHeight: 1.5, margin: '6px 0 0',
            color: isLocked ? C.textFaint : C.textMuted }}>
            {meta.desc || lesson.description}
          </p>
        )}

        {/* Duration row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10 }}>
          {isLocked ? (
            <Lock size={12} color={C.textFaint} />
          ) : (
            <Clock size={12} color={C.textFaint} />
          )}
          <span style={{ fontSize: 11, color: C.textFaint }}>{lesson.duration}</span>
          {saved && !isDone && (
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
              background: C.goldSoft, color: C.goldText }}>
              In Progress
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default ModuleOverview;
