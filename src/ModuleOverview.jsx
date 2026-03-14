import React from 'react';
import { Check, Lock, ChevronLeft, Home, Zap } from 'lucide-react';

const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-5 py-8">

        {/* Nav */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1.5">
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1.5">
            <Home className="w-3.5 h-3.5" /><span>Home</span>
          </button>
        </div>

        {/* Page title */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-deany-muted mb-3">Islamic Finance</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-deany-navy">Your Learning Path</h1>
        </div>

        {/* Modules */}
        <div className="space-y-16">
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

/* ── Module section: header + lesson nodes ── */
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

  // Speed round module
  if (mod.isSpeedRound) {
    return (
      <div>
        <ModuleHeader label={`Module ${moduleIndex + 1}`} title={mod.title} subtitle={mod.subtitle} />
        <button onClick={() => onSelectModule(mod, moduleIndex)}
          className="w-full mt-6 bg-deany-cream rounded-2xl border border-deany-border p-6
            text-center hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]
            transition-all duration-200 focus:outline-none focus-visible:ring-2
            focus-visible:ring-deany-gold focus-visible:ring-offset-2">
          <Zap className="w-6 h-6 text-deany-gold mx-auto mb-2" />
          <p className="text-sm font-medium text-deany-navy mb-1">Rapid-fire challenge</p>
          <p className="text-xs text-deany-muted">{mod.estimatedTime} · {mod.questions?.length || 0} questions</p>
        </button>
      </div>
    );
  }

  // Empty module (coming soon)
  if (!lessons.length) {
    return (
      <div>
        <ModuleHeader label={`Module ${moduleIndex + 1}`} title={mod.title} subtitle={mod.subtitle} />
        <div className="mt-6 bg-deany-cream rounded-2xl border border-deany-border p-8 text-center opacity-60">
          <Lock className="w-6 h-6 text-deany-muted mx-auto mb-2" />
          <p className="text-sm font-medium text-deany-muted">Coming soon</p>
        </div>
      </div>
    );
  }

  // Regular module with lessons
  return (
    <div>
      <ModuleHeader label={`Module ${moduleIndex + 1} · ${mod.difficulty || 'Beginner'}`}
        title={mod.title} subtitle={mod.subtitle} />

      {/* Progress */}
      <div className="flex items-center gap-3 mt-4 mb-8">
        <div className="flex-1 h-1.5 bg-deany-border rounded-full overflow-hidden">
          <div className="h-full bg-deany-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-deany-muted whitespace-nowrap">{completedCount}/{lessons.length}</span>
      </div>

      {/* Winding lesson path */}
      <div className="space-y-3">
        {lessons.map((lesson, i) => {
          const state = getState(i);
          const saved = !!loadProgress?.(lesson.id);
          const isLeft = i % 2 === 0;
          const isLast = i === lessons.length - 1;

          return (
            <React.Fragment key={lesson.id}>
              {/* Connector line */}
              {i > 0 && (
                <div className="flex justify-center -my-1">
                  <div className={`w-0.5 h-8 rounded-full ${
                    isDone(i - 1) && (isDone(i) || i === currentIdx) ? 'bg-deany-gold' : 'bg-deany-border'
                  }`} />
                </div>
              )}

              {/* Node row */}
              <div className={`flex items-center gap-4 ${
                isLast ? 'justify-center' : isLeft ? 'justify-start pl-4' : 'justify-end pr-4'
              }`}>
                <NodeCircle index={i} state={state} saved={saved} lesson={lesson}
                  onClick={() => state !== 'locked' && onSelectLesson(lesson, i)} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ── Module header ── */
const ModuleHeader = ({ label, title, subtitle }) => (
  <div className="text-center">
    <p className="text-xs font-medium uppercase tracking-wide text-deany-muted mb-1">{label}</p>
    <h2 className="text-xl font-semibold text-deany-navy">{title}</h2>
    {subtitle && <p className="text-sm text-deany-steel mt-0.5">{subtitle}</p>}
  </div>
);

/* ── Single circle node with title ── */
const NodeCircle = ({ index, state, saved, lesson, onClick }) => {
  const clickable = state !== 'locked';

  const ring = state === 'completed' ? 'bg-deany-gold shadow-md'
    : state === 'current' ? 'bg-white border-[3px] border-deany-gold shadow-md animate-pulse-gold'
    : 'bg-deany-cream border-2 border-deany-border opacity-50';

  const hoverClass = clickable
    ? 'hover:scale-110 hover:shadow-xl active:scale-90 active:shadow-sm' : 'cursor-not-allowed';

  const inner = state === 'locked'
    ? <Lock className="w-5 h-5 text-deany-muted" />
    : <span className={`text-xl font-bold ${state === 'completed' ? 'text-white' : 'text-deany-gold'}`}>{index + 1}</span>;

  const circle = (
    <div className="relative">
      {clickable ? (
        <button onClick={onClick}
          className={`w-[84px] h-[84px] rounded-full flex items-center justify-center
            transition-all duration-200 ease-out ${ring} ${hoverClass}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2`}
          aria-label={`Lesson ${index + 1}: ${lesson.title}`}>
          {inner}
        </button>
      ) : (
        <div className={`w-[84px] h-[84px] rounded-full flex items-center justify-center
          transition-all duration-200 ${ring} ${hoverClass}`}>
          {inner}
        </div>
      )}
      {state === 'completed' && (
        <div className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-white border-2 border-deany-gold
          flex items-center justify-center shadow-sm">
          <Check className="w-3.5 h-3.5 text-deany-gold" strokeWidth={3} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center" style={{ width: 140 }}>
      {circle}
      <p className={`mt-2.5 text-sm font-medium text-center leading-snug ${
        state === 'locked' ? 'text-deany-muted' : 'text-deany-navy'
      }`}>{lesson.title}</p>
      {saved && state !== 'completed' && (
        <span className="mt-1 text-[11px] font-medium text-deany-gold bg-deany-gold-light
          px-2.5 py-0.5 rounded-full">Continue</span>
      )}
    </div>
  );
};

export default ModuleOverview;
