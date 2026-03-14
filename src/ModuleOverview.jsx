import React from 'react';
import { Check, Lock, ChevronLeft, Home } from 'lucide-react';

// Zigzag positions: left, right, left, right, centre
const POSITIONS = [30, 70, 30, 70, 50];
const VERTICAL_GAP = 140;
const PATH_START = 60;

const ModuleOverview = ({
  module: mod, completedLessons, loadProgress, onSelectLesson, onBack, onHome, className = '',
}) => {
  if (!mod) return null;
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

  // Node centre Y positions
  const nodeY = (i) => PATH_START + i * VERTICAL_GAP + 44;
  const totalHeight = PATH_START + (lessons.length - 1) * VERTICAL_GAP + 88 + 80;

  // Build SVG curve through node centres
  const buildCurve = () => {
    if (lessons.length < 2) return '';
    const pts = lessons.map((_, i) => ({ x: POSITIONS[i] ?? 50, y: nodeY(i) }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let j = 0; j < pts.length - 1; j++) {
      const a = pts[j], b = pts[j + 1], mid = (a.y + b.y) / 2;
      d += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
    }
    return d;
  };

  const curve = buildCurve();
  const fillRatio = lessons.length > 1
    ? Math.min(completedCount, lessons.length - 1) / (lessons.length - 1) : 0;

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="max-w-md mx-auto px-5 py-8">

        {/* Navigation */}
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1.5">
            <ChevronLeft className="w-4 h-4" /><span>Modules</span>
          </button>
          <button onClick={onHome}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1.5">
            <Home className="w-3.5 h-3.5" /><span>Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs font-medium uppercase tracking-widest text-deany-muted mb-3">
            Module 1
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-deany-navy mb-1.5">
            {mod.title}
          </h1>
          <p className="text-base text-deany-steel">{mod.subtitle}</p>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-center mb-12">
          <p className="text-sm text-deany-muted mb-2.5">
            {completedCount} of {lessons.length} complete
          </p>
          <div className="w-40 h-1.5 bg-deany-border rounded-full overflow-hidden">
            <div className="h-full bg-deany-gold rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Learning Path */}
        <div className="relative" style={{ height: totalHeight }}>
          {/* SVG trail */}
          <svg className="absolute inset-0 w-full pointer-events-none" style={{ height: totalHeight }}
            viewBox={`0 0 100 ${totalHeight}`} preserveAspectRatio="none" fill="none" aria-hidden="true">
            <g className="text-deany-border">
              <path d={curve} stroke="currentColor" strokeWidth="2"
                strokeDasharray="8 6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            </g>
            {fillRatio > 0 && (
              <g className="text-deany-gold">
                <path d={curve} stroke="currentColor" strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke" strokeLinecap="round"
                  strokeDasharray="2000" strokeDashoffset={2000 - 2000 * fillRatio} />
              </g>
            )}
          </svg>

          {/* Nodes */}
          {lessons.map((lesson, i) => {
            const s = getState(i);
            const saved = !!loadProgress?.(lesson.id);
            return (
              <LilyPad key={lesson.id} index={i} lesson={lesson} state={s}
                hasSaved={saved} xPct={POSITIONS[i] ?? 50} topPx={PATH_START + i * VERTICAL_GAP}
                onClick={() => s !== 'locked' && onSelectLesson(lesson, i)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── Single lily-pad node ── */
const LilyPad = ({ index, lesson, state, hasSaved, xPct, topPx, onClick }) => {
  const clickable = state !== 'locked';

  const circleClass = [
    'w-[88px] h-[88px] rounded-full flex items-center justify-center',
    'transition-all duration-200 ease-out select-none',
    state === 'completed' && 'bg-deany-gold shadow-md',
    state === 'current' && 'bg-white border-[3px] border-deany-gold shadow-md animate-pulse-gold',
    state === 'locked' && 'bg-deany-cream border-2 border-deany-border opacity-60',
    clickable && 'hover:scale-110 hover:shadow-xl active:scale-90 active:shadow-sm',
    !clickable && 'cursor-not-allowed',
  ].filter(Boolean).join(' ');

  return (
    <div className="absolute flex flex-col items-center"
      style={{ left: `${xPct}%`, top: topPx, transform: 'translateX(-50%)', width: 130 }}>

      {/* Circle wrapper for badge positioning */}
      <div className="relative">
        {clickable ? (
          <button onClick={onClick}
            className={`${circleClass} focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2`}
            aria-label={`Lesson ${index + 1}: ${lesson.title}`}>
            {state === 'completed'
              ? <span className="text-xl font-bold text-white">{index + 1}</span>
              : <span className="text-xl font-bold text-deany-gold">{index + 1}</span>}
          </button>
        ) : (
          <div className={circleClass}>
            <Lock className="w-5 h-5 text-deany-muted" />
          </div>
        )}

        {/* Checkmark badge */}
        {state === 'completed' && (
          <div className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-white
            flex items-center justify-center shadow border-2 border-deany-gold">
            <Check className="w-4 h-4 text-deany-gold" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Title */}
      <p className={`mt-3 text-sm font-medium leading-snug text-center ${
        state === 'locked' ? 'text-deany-muted' : 'text-deany-navy'
      }`}>
        {lesson.title}
      </p>

      {/* Continue badge */}
      {hasSaved && state !== 'completed' && (
        <span className="mt-1.5 text-[11px] font-medium text-deany-gold bg-deany-gold-light
          px-2.5 py-0.5 rounded-full">Continue</span>
      )}
    </div>
  );
};

export default ModuleOverview;
