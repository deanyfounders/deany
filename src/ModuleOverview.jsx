import React from 'react';
import { CheckCircle, Lock, Clock, ChevronLeft, Home, ArrowRight } from 'lucide-react';

const ModuleOverview = ({
  module: mod,
  completedLessons,
  loadProgress,
  onSelectLesson,
  onBack,
  onHome,
  className = '',
}) => {
  if (!mod) return null;

  const lessons = mod.lessons || [];
  const completedCount = lessons.filter((_, i) => completedLessons[`${mod.id}-lesson-${i}`]).length;
  const progressPercent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  // Find the first incomplete lesson index (the "current" one)
  const currentIndex = lessons.findIndex((_, i) => !completedLessons[`${mod.id}-lesson-${i}`]);

  const getLessonState = (index) => {
    const done = completedLessons[`${mod.id}-lesson-${index}`];
    if (done) return 'completed';
    if (index === currentIndex) return 'current';
    // For now isLessonLocked always returns false, but respect it for future use
    if (index > currentIndex && currentIndex !== -1) return 'locked';
    return 'current';
  };

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="max-w-md mx-auto px-5 py-8">

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Modules</span>
          </button>
          <button
            onClick={onHome}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wide text-deany-muted mb-2">
            Module 1 · {mod.difficulty || 'Beginner'}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-deany-navy mb-2">
            {mod.title}
          </h1>
          <p className="text-lg text-deany-steel mb-1">
            {mod.subtitle}
          </p>
          {mod.mascotMessage && (
            <p className="text-sm leading-relaxed text-deany-muted max-w-xs mx-auto">
              {mod.mascotMessage}
            </p>
          )}
        </div>

        {/* Progress Summary */}
        <div className="bg-deany-cream rounded-2xl border border-deany-border p-5 mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-deany-navy">
              {completedCount} of {lessons.length} lessons complete
            </span>
            <span className="text-sm font-medium text-deany-gold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-deany-border rounded-full">
            <div
              className="h-full bg-deany-gold rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-deany-muted mt-2">
            {mod.estimatedTime || '70 min'} total · {lessons.length} lessons
          </p>
        </div>

        {/* Vertical Learning Path */}
        <div className="relative">
          {/* Connecting line (background) */}
          <div
            className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-deany-border"
            aria-hidden="true"
          />
          {/* Connecting line (gold fill based on progress) */}
          <div
            className="absolute left-[23px] top-6 w-[2px] bg-deany-gold transition-all duration-500 ease-out"
            style={{
              height: completedCount > 0
                ? `${((Math.min(completedCount, lessons.length - 1)) / (lessons.length - 1)) * 100}%`
                : '0%',
            }}
            aria-hidden="true"
          />

          <div className="relative space-y-6">
            {lessons.map((lesson, i) => {
              const state = getLessonState(i);
              const hasSaved = loadProgress?.(lesson.id);
              const isClickable = state !== 'locked';

              return (
                <LessonNode
                  key={lesson.id}
                  index={i}
                  lesson={lesson}
                  state={state}
                  hasSaved={!!hasSaved}
                  isClickable={isClickable}
                  onClick={() => isClickable && onSelectLesson(lesson, i)}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

const LessonNode = ({ index, lesson, state, hasSaved, isClickable, onClick }) => {
  const isCompleted = state === 'completed';
  const isCurrent = state === 'current';
  const isLocked = state === 'locked';

  // Node circle styles
  const circleBase = 'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200';
  const circleStyles = {
    completed: `${circleBase} bg-deany-gold-light border-2 border-deany-gold`,
    current: `${circleBase} bg-white border-2 border-deany-gold shadow-sm`,
    locked: `${circleBase} bg-deany-cream border-2 border-deany-border`,
  };

  // Card styles
  const cardBase = 'flex-1 min-w-0 rounded-2xl p-5 border transition-all';
  const cardStyles = {
    completed: `${cardBase} bg-deany-cream border-deany-border shadow-sm`,
    current: `${cardBase} bg-white border-deany-gold shadow-sm`,
    locked: `${cardBase} bg-deany-cream/50 border-deany-border`,
  };

  const Wrapper = isClickable ? 'button' : 'div';
  const wrapperProps = isClickable
    ? {
        onClick,
        className: `w-full flex items-start gap-4 text-left group
          ${isClickable ? 'cursor-pointer' : ''}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold
          focus-visible:ring-offset-2 rounded-2xl`,
      }
    : {
        className: 'flex items-start gap-4 opacity-60',
      };

  return (
    <Wrapper {...wrapperProps}>
      {/* Circle node */}
      <div className={circleStyles[state]}>
        {isCompleted && <CheckCircle className="w-5 h-5 text-deany-gold" />}
        {isCurrent && (
          <span className="text-sm font-semibold text-deany-gold">{index + 1}</span>
        )}
        {isLocked && <Lock className="w-4 h-4 text-deany-muted" />}
      </div>

      {/* Card */}
      <div
        className={`${cardStyles[state]} ${
          isClickable
            ? 'group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-[0.98] duration-200'
            : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
              isLocked ? 'text-deany-muted' : 'text-deany-muted'
            }`}>
              Lesson {index + 1}
            </p>
            <h3 className={`text-base font-medium mb-1.5 ${
              isLocked ? 'text-deany-muted' : 'text-deany-navy'
            }`}>
              {lesson.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className={`text-xs flex items-center gap-1 ${
                isLocked ? 'text-deany-muted' : 'text-deany-steel'
              }`}>
                <Clock className="w-3 h-3" />
                {lesson.duration}
              </span>
              {hasSaved && !isCompleted && (
                <span className="text-xs font-medium text-deany-gold bg-deany-gold-light px-2 py-0.5 rounded-full">
                  Continue
                </span>
              )}
              {isCompleted && (
                <span className="text-xs font-medium text-deany-sage">
                  Completed
                </span>
              )}
            </div>
          </div>

          {isClickable && !isCompleted && (
            <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-all duration-200 ${
              isCurrent
                ? 'text-deany-gold group-hover:translate-x-0.5'
                : 'text-deany-muted group-hover:text-deany-steel group-hover:translate-x-0.5'
            }`} />
          )}
          {isLocked && (
            <Lock className="w-4 h-4 flex-shrink-0 mt-1 text-deany-muted" />
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default ModuleOverview;
