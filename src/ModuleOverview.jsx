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
/*  ModuleOverview — root                                           */
/* ================================================================ */
const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
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

        {modules.map((mod, mi) => (
          <ModuleBlock key={mod.id} mod={mod} mi={mi} completedLessons={completedLessons}
            loadProgress={loadProgress} onSelectLesson={onSelectLesson} onSelectModule={onSelectModule} />
        ))}
      </div>
    </div>
  );
};

/* ================================================================ */
/*  ModuleBlock — the two-column layout per module                  */
/* ================================================================ */
const ModuleBlock = ({ mod, mi, completedLessons, loadProgress, onSelectLesson, onSelectModule }) => {
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

  /* Speed round — keep existing card */
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
  const accent = PATH_ACCENTS['5-pillars']; // default teal for 5 Pillars

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
              color: C.teal, lineHeight: 1 }}>
              Module {mi + 1} · {mod.difficulty || 'Beginner'}
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
            <div style={{ height: '100%', borderRadius: 3, background: C.teal, width: `${pct}%`,
              transition: 'width .5s ease-out' }} />
          </div>
        </div>

        {/* 4. What you'll master */}
        {data.mastery.length > 0 && (
          <div style={{ background: C.canvas, borderRadius: 12, padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '1.4px', textTransform: 'uppercase',
              color: C.teal, marginBottom: 12 }}>
              What you'll master
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.mastery.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: C.tealDk, fontWeight: 700, fontSize: 13, lineHeight: '18px', flexShrink: 0 }}>
                    &#10003;
                  </span>
                  <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Key concepts — multicolor pills */}
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
          color: C.teal, marginBottom: 20 }}>
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
                onClick={() => handleLessonClick(lesson, i)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================================================================ */
/*  LessonTimelineRow — node + connector + card                     */
/* ================================================================ */
const LessonTimelineRow = ({ lesson, index, state, saved, isLast, meta, isCurrent, onClick }) => {
  const isDone = state === 'done';
  const isCur = state === 'current';
  const isLocked = state === 'locked';

  /* Connector color: solid teal above completed nodes, faint otherwise */
  const connectorColor = isDone ? C.teal : C.track;
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
            background: C.teal,
            boxShadow: '0 2px 8px rgba(34,163,154,0.3)',
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
            background: isDone ? C.teal : C.track }} />
        )}
      </div>

      {/* ── Lesson card ──────────────────────────────────────── */}
      <button onClick={onClick} className="mo-focus"
        style={{
          flex: 1, marginLeft: 14, marginBottom: isLast ? 0 : 12,
          borderRadius: 14, padding: '18px 20px', textAlign: 'left',
          background: C.surface,
          border: isCur ? 'none' : `1px solid rgba(15,76,92,0.10)`,
          borderLeft: isCur ? `4px solid ${C.teal}` : undefined,
          boxShadow: isCur
            ? `0 4px 20px rgba(34,163,154,0.12), ${S.card}`
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
            ? `0 4px 20px rgba(34,163,154,0.12), ${S.card}`
            : isDone ? S.card : '0 1px 4px rgba(26,35,50,.03)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>

        {/* Top meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase',
              color: (isDone || isCur) ? C.teal : C.textFaint }}>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: C.teal }}>
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
