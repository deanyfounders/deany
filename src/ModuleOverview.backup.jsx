import React, { useCallback } from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock, Play } from 'lucide-react';

const pageBg = { background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' };
const glass = "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg";
const glassHover = `${glass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`;

const PagePattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo-pg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke="#065f46" strokeWidth="0.5" opacity="0.035"/>
        <circle cx="30" cy="30" r="12" fill="none" stroke="#065f46" strokeWidth="0.3" opacity="0.035"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-pg)"/>
  </svg>
);

const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2";

const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;
  return (
    <div className="min-h-screen relative" style={pageBg}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <PagePattern />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-6" style={{ animation: 'slideUp 0.6s ease-out both' }}>
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack}
            className={`flex items-center gap-1.5 text-deany-steel hover:text-deany-navy transition-colors text-sm font-medium min-h-[48px] px-1 ${focusRing}`}>
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome}
            className={`flex items-center gap-1.5 bg-deany-navy text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:brightness-110 transition-all min-h-[48px] ${focusRing}`}>
            <Home className="w-4 h-4" /><span>Home</span>
          </button>
        </div>
        <div className="space-y-10">
          {modules.map((mod, mi) => (
            <ModuleBlock key={mod.id} mod={mod} mi={mi} completedLessons={completedLessons}
              loadProgress={loadProgress} onSelectLesson={onSelectLesson} onSelectModule={onSelectModule} />
          ))}
        </div>
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
      className={`w-full ${glassHover} rounded-2xl p-6 text-left ${focusRing}`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}><Zap className="w-7 h-7" /></div>
        <div className="flex-1">
          <h3 className="font-bold text-deany-navy" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-sm text-deany-muted">{mod.subtitle}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-deany-muted" />
      </div>
    </button>
  );

  if (!lessons.length) return (
    <div className={`${glass} rounded-2xl p-6 opacity-60`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-deany-border flex-shrink-0">
          <Lock className="w-6 h-6 text-deany-muted" /></div>
        <div>
          <h3 className="font-bold text-deany-steel" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-sm text-deany-muted">{mod.subtitle}</p>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-deany-gold-light text-deany-gold mt-1.5 inline-block">Coming Soon</span>
        </div>
      </div>
    </div>
  );

  const nextLesson = curIdx >= 0 ? lessons[curIdx] : null;

  return (
    <div>
      {/* Module header card */}
      <div className={`${glass} rounded-2xl p-6 mb-8`}>
        <p className="text-xs font-bold uppercase tracking-widest text-deany-gold">Module {mi + 1}</p>
        <h2 className="text-2xl font-bold text-deany-navy mt-1.5" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h2>
        {mod.subtitle && <p className="text-sm text-deany-steel mt-1">{mod.subtitle}</p>}

        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 h-2 bg-deany-border rounded-full overflow-hidden">
            <div className="h-full bg-deany-gold rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-semibold text-deany-muted whitespace-nowrap">{doneCount}/{lessons.length} lessons</span>
        </div>

        {nextLesson && (
          <button onClick={() => onSelectLesson(nextLesson, curIdx)}
            className={`w-full mt-5 bg-deany-gold text-white px-6 py-3.5 rounded-xl font-medium
              hover:brightness-105 active:brightness-95 transition-all duration-200
              flex items-center justify-center gap-2 min-h-[48px] ${focusRing}`}>
            <Play className="w-4 h-4" fill="white" />
            {doneCount > 0 ? 'Continue Learning' : 'Start Learning'}
          </button>
        )}
      </div>

      {/* Connected lesson path */}
      <div className="relative">
        {/* Vertical track line */}
        <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-deany-border" aria-hidden="true" />

        <div className="flex flex-col">
          {lessons.map((lesson, i) => {
            const st = getState(i);
            const saved = !!loadProgress?.(lesson.id);
            return (
              <LessonRow key={lesson.id} lesson={lesson} i={i} st={st} saved={saved}
                onClick={() => handleLessonClick(lesson, i)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LessonRow = ({ lesson, i, st, saved, onClick }) => {
  const isDone = st === 'done';
  const isCur = st === 'current';

  return (
    <div className="relative flex items-center py-4">
      {/* Node */}
      <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center z-10" aria-hidden="true">
        {isCur && (
          <span className="absolute inset-0 rounded-full animate-pulse-gold" />
        )}
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-sm
          ${isDone ? 'bg-deany-sage' : isCur ? 'bg-deany-gold' : 'bg-deany-border'}`}>
          {isDone ? (
            <Check className="w-5 h-5 text-white" strokeWidth={3} />
          ) : isCur ? (
            <Play className="w-4 h-4 text-white" fill="white" />
          ) : (
            <span className="text-sm font-bold text-deany-muted">{i + 1}</span>
          )}
        </div>
      </div>

      {/* Lesson card */}
      <button onClick={onClick}
        className={`flex-1 ml-5 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/40
          shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left min-h-[48px]
          ${focusRing} ${st === 'open' ? 'opacity-75' : ''}`}>
        <p className="text-xs font-bold uppercase tracking-wide text-deany-gold">Lesson {i + 1}</p>
        <h3 className="font-bold text-base text-deany-navy mt-0.5 leading-snug" style={{ fontFamily: 'Georgia,serif' }}>
          {lesson.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <span className="text-xs flex items-center gap-1 text-deany-muted">
            <Clock className="w-3.5 h-3.5" />{lesson.duration}
          </span>
          {isDone && (
            <span className="text-xs font-semibold text-deany-sage flex items-center gap-1">
              <Check className="w-3 h-3" />Completed
            </span>
          )}
          {saved && !isDone && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-deany-gold-light text-deany-gold">
              In Progress
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default ModuleOverview;
