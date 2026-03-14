import React from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock } from 'lucide-react';

// Shared styles (same as App.jsx)
const pageBg = { background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' };
const glass = "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg";
const glassHover = `${glass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`;

const IslamicPattern = ({ opacity = 0.035, color = "#065f46" }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo-mo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}/>
        <circle cx="30" cy="30" r="12" fill="none" stroke={color} strokeWidth="0.3" opacity={opacity}/>
        <path d="M30 18L42 30L30 42L18 30Z" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity}/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-mo)"/>
  </svg>
);

const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;

  return (
    <div className="min-h-screen relative" style={pageBg}>
      <IslamicPattern />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">

        {/* Nav — matches App.jsx NavHeader */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome}
            className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
            <Home className="w-4 h-4" /><span>Home</span>
          </button>
        </div>

        {/* Page header card */}
        <div className={`${glass} rounded-2xl p-6 mb-8`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md bg-gradient-to-br from-amber-50 to-orange-100">💰</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Islamic Finance</h1>
              <p className="text-gray-500 text-xs">Shariah-compliant economics · {modules.length} modules</p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-10">
          {modules.map((mod, mi) => (
            <ModuleSection key={mod.id} mod={mod} moduleIndex={mi}
              completedLessons={completedLessons} loadProgress={loadProgress}
              onSelectLesson={onSelectLesson} onSelectModule={onSelectModule} />
          ))}
        </div>

      </div>
    </div>
  );
};

/* ── Module section ── */
const ModuleSection = ({ mod, moduleIndex, completedLessons, loadProgress, onSelectLesson, onSelectModule }) => {
  const lessons = mod.lessons || [];
  const isDone = (i) => !!completedLessons[`${mod.id}-lesson-${i}`];
  const completedCount = lessons.filter((_, i) => isDone(i)).length;
  const pct = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;
  const currentIdx = lessons.findIndex((_, i) => !isDone(i));

  const getState = (i) => {
    if (isDone(i)) return 'completed';
    if (i === currentIdx) return 'current';
    if (i > currentIdx && currentIdx !== -1) return 'locked';
    return 'current';
  };

  // Speed round
  if (mod.isSpeedRound) {
    return (
      <div>
        <SectionLabel text={`Module ${moduleIndex + 1} · ${mod.difficulty || 'Challenge'}`} />
        <button onClick={() => onSelectModule(mod, moduleIndex)}
          className={`w-full ${glassHover} rounded-2xl p-6 text-center`}>
          <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: '#7c3aed' }} />
          <h3 className="font-bold text-gray-900 text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{mod.title}</h3>
          <p className="text-xs text-gray-500 mb-3">{mod.subtitle}</p>
          <span className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-semibold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            Start Challenge <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>
    );
  }

  // Empty module
  if (!lessons.length) {
    return (
      <div>
        <SectionLabel text={`Module ${moduleIndex + 1} · ${mod.difficulty || 'Beginner'}`} />
        <div className={`${glass} rounded-2xl p-8 text-center opacity-70`}>
          <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{mod.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{mod.subtitle}</p>
          <span className="text-[11px] px-3 py-1 rounded-full font-medium bg-amber-100 text-amber-700">Coming Soon</span>
        </div>
      </div>
    );
  }

  // Regular module with lessons
  return (
    <div>
      <SectionLabel text={`Module ${moduleIndex + 1} · ${mod.difficulty || 'Beginner'}`} />

      {/* Module title card */}
      <div className={`${glass} rounded-2xl p-5 mb-6`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm"
            style={{ background: (mod.color || '#d97706') + '15' }}>{mod.icon}</div>
          <div>
            <h2 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Georgia, serif' }}>{mod.title}</h2>
            <p className="text-xs text-gray-500">{mod.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #059669, #10b981)' }} />
          </div>
          <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">{completedCount}/{lessons.length}</span>
        </div>
      </div>

      {/* Winding lesson path */}
      <div className="space-y-2">
        {lessons.map((lesson, i) => {
          const state = getState(i);
          const saved = !!loadProgress?.(lesson.id);
          const isLeft = i % 2 === 0;
          const isLast = i === lessons.length - 1;

          return (
            <React.Fragment key={lesson.id}>
              {/* Connector */}
              {i > 0 && (
                <div className="flex justify-center">
                  <div className={`w-0.5 h-6 rounded-full ${
                    isDone(i - 1) && (isDone(i) || i === currentIdx) ? 'bg-emerald-400' : 'bg-gray-200'
                  }`} />
                </div>
              )}
              {/* Node */}
              <div className={`flex items-center gap-4 ${
                isLast ? 'justify-center' : isLeft ? 'justify-start pl-6' : 'justify-end pr-6'
              }`}>
                <LessonNode index={i} lesson={lesson} state={state} saved={saved}
                  color={mod.color || '#d97706'}
                  onClick={() => state !== 'locked' && onSelectLesson(lesson, i)} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const SectionLabel = ({ text }) => (
  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 text-center mb-3">{text}</p>
);

/* ── Circle node ── */
const LessonNode = ({ index, lesson, state, saved, color, onClick }) => {
  const clickable = state !== 'locked';

  const circleStyle = state === 'completed'
    ? { background: `linear-gradient(135deg, #059669, #10b981)` }
    : state === 'current'
      ? { background: 'white', borderColor: color }
      : { background: 'rgba(255,255,255,0.5)', borderColor: '#e5e7eb' };

  const circleClass = [
    'w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-md',
    'transition-all duration-200 ease-out',
    state === 'current' && 'border-[3px] animate-pulse-gold',
    state === 'locked' && 'border-2 opacity-50',
    clickable && 'hover:scale-110 hover:shadow-xl active:scale-90 active:shadow-sm',
    !clickable && 'cursor-not-allowed',
  ].filter(Boolean).join(' ');

  const inner = state === 'locked'
    ? <Lock className="w-4 h-4 text-gray-400" />
    : state === 'completed'
      ? <Check className="w-6 h-6 text-white" strokeWidth={2.5} />
      : <span className="text-lg font-bold" style={{ color }}>{index + 1}</span>;

  return (
    <div className="flex flex-col items-center" style={{ width: 130 }}>
      {clickable ? (
        <button onClick={onClick} className={circleClass} style={circleStyle}
          aria-label={`Lesson ${index + 1}: ${lesson.title}`}>
          {inner}
        </button>
      ) : (
        <div className={circleClass} style={circleStyle}>{inner}</div>
      )}
      <h3 className={`mt-2 text-xs font-bold text-center leading-snug ${
        state === 'locked' ? 'text-gray-400' : 'text-gray-900'
      }`}>{lesson.title}</h3>
      <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
        <Clock className="w-2.5 h-2.5" />{lesson.duration}
      </p>
      {saved && state !== 'completed' && (
        <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Continue</span>
      )}
    </div>
  );
};

export default ModuleOverview;
