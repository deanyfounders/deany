import React, { useCallback } from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock, Play, BookOpen } from 'lucide-react';

const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A24A] focus-visible:ring-offset-2";

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
      { label: 'Amanah', color: 'emerald' },
      { label: 'Riba', color: 'coral' },
      { label: 'Gharar', color: 'coral' },
      { label: 'Maysir', color: 'coral' },
      { label: 'Halal Deal Structure', color: 'gold' },
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
      { label: 'Tawhid', color: 'emerald' },
      { label: 'Shahadah', color: 'gold' },
      { label: 'Ilah', color: 'emerald' },
      { label: 'Rasul', color: 'emerald' },
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
      { label: 'Wudu', color: 'emerald' },
      { label: "Rak'ah", color: 'emerald' },
      { label: 'Al-Fatihah', color: 'gold' },
      { label: 'Sajdah al-Sahw', color: 'gold' },
      { label: 'Tashahhud', color: 'emerald' },
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
      { label: 'Hifz', color: 'emerald' },
      { label: 'Tajweed Basics', color: 'emerald' },
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
      { label: 'Tafsir', color: 'emerald' },
      { label: 'Al-Fatiha', color: 'gold' },
      { label: 'Ibn Kathir', color: 'emerald' },
    ],
    lessonMeta: {
      'tafsir-fatiha': { type: 'Tafsir', desc: 'Verse-by-verse meaning and context.' },
    },
  },
};

const getModuleData = (modId) => MODULE_DATA[modId] || {
  badge: 'Module',
  desc: '',
  mastery: [],
  concepts: [],
  lessonMeta: {},
};

const GeoPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo-elegant" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#0F172A" strokeWidth="0.6"/>
        <circle cx="40" cy="40" r="16" fill="none" stroke="#0F172A" strokeWidth="0.4"/>
        <circle cx="40" cy="40" r="4" fill="none" stroke="#C6A24A" strokeWidth="0.3"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-elegant)"/>
  </svg>
);

const HeroGlow = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl" aria-hidden="true">
    <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.07]"
      style={{ background: 'radial-gradient(circle, #0F766E 0%, transparent 70%)' }} />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-[0.05]"
      style={{ background: 'radial-gradient(circle, #C6A24A 0%, transparent 70%)' }} />
  </div>
);

const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;
  return (
    <div className="min-h-screen relative" style={{ background: '#FBFBF7' }}>
      <style>{`
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseGold{0%,100%{box-shadow:0 0 0 0 rgba(198,162,74,0.3)}50%{box-shadow:0 0 0 8px rgba(198,162,74,0)}}
      `}</style>
      <GeoPattern />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6" style={{ animation: 'slideUp 0.5s ease-out both' }}>
        {/* Nav */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack}
            className={`flex items-center gap-1.5 text-[#64748B] hover:text-[#0F172A] transition-colors text-sm font-medium min-h-[48px] px-1 ${focusRing}`}>
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome}
            className={`flex items-center gap-1.5 bg-[#0F172A] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[#1e293b] transition-all min-h-[48px] ${focusRing}`}>
            <Home className="w-4 h-4" /><span>Home</span>
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

const ModuleBlock = ({ mod, mi, completedLessons, loadProgress, onSelectLesson, onSelectModule }) => {
  const lessons = mod.lessons || [];
  const isDone = (i) => !!completedLessons[`${mod.id}-lesson-${i}`];
  const doneCount = lessons.filter((_, i) => isDone(i)).length;
  const pct = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
  const curIdx = lessons.findIndex((_, i) => !isDone(i));
  const totalMin = lessons.reduce((sum, l) => {
    const m = parseInt(l.duration) || 0;
    return sum + m;
  }, 0);
  const getState = (i) => {
    if (isDone(i)) return 'done';
    if (i === curIdx) return 'current';
    return 'open';
  };

  const handleLessonClick = useCallback((lesson, i) => {
    onSelectLesson(lesson, i);
  }, [onSelectLesson]);

  if (mod.isSpeedRound) return (
    <button onClick={() => onSelectModule(mod, mi)}
      className={`w-full rounded-3xl p-6 text-left bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 mb-6 ${focusRing}`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}><Zap className="w-7 h-7" /></div>
        <div className="flex-1">
          <h3 className="font-bold text-[#0F172A]" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-sm text-[#64748B]">{mod.subtitle}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-[#64748B]" />
      </div>
    </button>
  );

  if (!lessons.length) return (
    <div className="rounded-3xl p-6 opacity-60 bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(15,23,42,0.04)] mb-6">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#F1F5F9] flex-shrink-0">
          <Lock className="w-6 h-6 text-[#94a3b8]" /></div>
        <div>
          <h3 className="font-bold text-[#64748B]" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-sm text-[#94a3b8]">{mod.subtitle}</p>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#FFF7E6] text-[#A77F22] mt-1.5 inline-block">Coming Soon</span>
        </div>
      </div>
    </div>
  );

  const nextLesson = curIdx >= 0 ? lessons[curIdx] : null;
  const data = getModuleData(mod.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      {/* Left column */}
      <div className="space-y-5">
        {/* Hero card */}
        <div className="relative rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(15,23,42,0.06)] p-7 overflow-hidden">
          <HeroGlow />
          <div className="relative">
            {/* Emblem + badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg, #C6A24A, #A77F22)' }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C6A24A]">{data.badge}</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-[#0F172A] leading-tight" style={{ fontFamily: 'Georgia,serif' }}>
              {mod.title}
            </h2>
            {mod.subtitle && <p className="text-[#64748B] mt-1.5 text-sm">{mod.subtitle}</p>}

            {data.desc && (
              <p className="text-sm text-[#64748B] mt-4 leading-relaxed">
                {data.desc}
              </p>
            )}

            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#64748B]">
                  {pct}% complete
                </span>
                <span className="text-xs text-[#94a3b8]">
                  {lessons.length} lessons · {totalMin} min total
                </span>
              </div>
              <div className="h-2 bg-[#E7DED2] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0F766E, #10b981)' }} />
              </div>
            </div>

            {/* CTA */}
            {nextLesson && (
              <button onClick={() => onSelectLesson(nextLesson, curIdx)}
                className={`w-full mt-6 px-6 py-3.5 rounded-2xl font-semibold text-white
                  flex items-center justify-center gap-2 min-h-[48px]
                  shadow-[0_2px_8px_rgba(198,162,74,0.3)] hover:shadow-[0_4px_16px_rgba(198,162,74,0.4)]
                  hover:brightness-105 active:brightness-95 transition-all duration-200 ${focusRing}`}
                style={{ background: 'linear-gradient(135deg, #C6A24A, #B89340)' }}>
                <Play className="w-4 h-4" fill="white" />
                {doneCount > 0 ? 'Continue Learning' : 'Start Learning'}
              </button>
            )}
          </div>
        </div>

        {/* What you'll master */}
        {data.mastery.length > 0 && (
        <div className="rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#0F172A] mb-4">What you'll master</h3>
          <div className="space-y-3">
            {data.mastery.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#ECFDF5] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#0F766E]" strokeWidth={3} />
                </div>
                <p className="text-sm text-[#334155] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Key concepts */}
        {data.concepts.length > 0 && (
        <div className="rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_2px_12px_rgba(15,23,42,0.04)] p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#0F172A] mb-4">Key concepts</h3>
          <div className="flex flex-wrap gap-2">
            {data.concepts.map((c) => (
              <span key={c.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                c.color === 'emerald' ? 'bg-[#ECFDF5] text-[#0F766E]' :
                c.color === 'coral' ? 'bg-[#FFF1ED] text-[#B85C44]' :
                'bg-[#FFF7E6] text-[#A77F22]'
              }`}>{c.label}</span>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Right column: Lesson journey */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#64748B] mb-5 lg:mt-1">Learning path</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5" style={{ background: '#E7DED2' }} aria-hidden="true" />

          <div className="flex flex-col">
            {lessons.map((lesson, i) => {
              const st = getState(i);
              const saved = !!loadProgress?.(lesson.id);
              return (
                <LessonRow key={lesson.id} lesson={lesson} i={i} st={st} saved={saved}
                  onClick={() => handleLessonClick(lesson, i)} isCurrent={i === curIdx} meta={data.lessonMeta[lesson.id] || {}} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonRow = ({ lesson, i, st, saved, onClick, isCurrent, meta = {} }) => {
  const isDone = st === 'done';
  const isCur = st === 'current';
  const isOpen = st === 'open';

  return (
    <div className="relative flex items-start py-3">
      {/* Node */}
      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center z-10" aria-hidden="true">
        {isCur && (
          <span className="absolute inset-0 rounded-full" style={{ animation: 'pulseGold 2s ease-in-out infinite' }} />
        )}
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center
          ${isDone ? 'bg-[#0F766E] shadow-[0_2px_8px_rgba(15,118,110,0.25)]' :
            isCur ? 'shadow-[0_2px_8px_rgba(198,162,74,0.35)]' :
            'bg-[#F1F5F9] shadow-sm'}`}
          style={isCur ? { background: 'linear-gradient(135deg, #C6A24A, #A77F22)' } : undefined}>
          {isDone ? (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          ) : isCur ? (
            <Play className="w-4 h-4 text-white" fill="white" />
          ) : (
            <span className="text-sm font-bold text-[#94a3b8]">{i + 1}</span>
          )}
        </div>
      </div>

      {/* Lesson card */}
      <button onClick={onClick}
        className={`flex-1 ml-4 rounded-2xl p-5 text-left transition-all duration-200 min-h-[48px] ${focusRing}
          ${isCur
            ? 'bg-white border-l-[3px] border-[#C6A24A] border-t border-r border-b border-t-[#E5E7EB] border-r-[#E5E7EB] border-b-[#E5E7EB] shadow-[0_4px_20px_rgba(15,23,42,0.07)] hover:shadow-[0_8px_28px_rgba(15,23,42,0.1)]'
            : isDone
            ? 'bg-white border border-[#E5E7EB] shadow-[0_1px_6px_rgba(15,23,42,0.03)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:-translate-y-0.5'
            : 'bg-white/80 border border-[#E5E7EB]/70 shadow-[0_1px_4px_rgba(15,23,42,0.02)] opacity-70 hover:opacity-90 hover:shadow-[0_2px_10px_rgba(15,23,42,0.05)]'
          }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C6A24A]">Lesson {i + 1}</p>
              {meta.type && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                  {meta.type}
                </span>
              )}
            </div>
            <h3 className="font-bold text-[#0F172A] mt-1 leading-snug" style={{ fontFamily: 'Georgia,serif' }}>
              {lesson.title}
            </h3>
            {meta.desc && (
              <p className={`text-xs leading-relaxed mt-1.5 ${isOpen ? 'text-[#94a3b8]' : 'text-[#64748B]'}`}>
                {meta.desc}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <span className="text-xs flex items-center gap-1 text-[#94a3b8]">
                <Clock className="w-3.5 h-3.5" />{lesson.duration}
              </span>
              {isDone && (
                <span className="text-xs font-semibold text-[#0F766E] flex items-center gap-1">
                  <Check className="w-3 h-3" />Completed
                </span>
              )}
              {saved && !isDone && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#FFF7E6] text-[#A77F22]">
                  In Progress
                </span>
              )}
            </div>
          </div>

          {isCur && (
            <div className="flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-[#FFF7E6] text-[#A77F22]">
                Start
              </span>
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default ModuleOverview;
