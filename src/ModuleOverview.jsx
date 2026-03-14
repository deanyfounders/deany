import React from 'react';
import { Check, Lock, ChevronLeft, Home } from 'lucide-react';

// Winding S-curve: left → right → left → right → centre
const NODES = [{ x: 25 }, { x: 75 }, { x: 25 }, { x: 75 }, { x: 50 }];
const GAP = 120;
const TOP = 40;

const ModuleOverview = ({
  module: mod, completedLessons, loadProgress, onSelectLesson, onBack, onHome, className = '',
}) => {
  if (!mod) return null;
  const lessons = mod.lessons || [];
  const done = (i) => !!completedLessons[`${mod.id}-lesson-${i}`];
  const completedCount = lessons.filter((_, i) => done(i)).length;
  const pct = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;
  const currentIdx = lessons.findIndex((_, i) => !done(i));

  const state = (i) => {
    if (done(i)) return 'completed';
    if (i === currentIdx) return 'current';
    if (i > currentIdx && currentIdx !== -1) return 'locked';
    return 'current';
  };

  const totalH = TOP + (lessons.length - 1) * GAP + 80 + 60;
  const cy = (i) => TOP + i * GAP + 40; // centre Y of node i

  // SVG cubic Bezier path through all node centres
  const pathD = (() => {
    if (lessons.length < 2) return '';
    const pts = lessons.map((_, i) => ({ x: NODES[i]?.x ?? 50, y: cy(i) }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    return d;
  })();

  const ratio = lessons.length > 1
    ? Math.min(completedCount, lessons.length - 1) / (lessons.length - 1) : 0;

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="max-w-md mx-auto px-5 py-8">
        {/* Nav */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1">
            <ChevronLeft className="w-4 h-4" /><span>Modules</span>
          </button>
          <button onClick={onHome}
            className="flex items-center gap-1.5 text-sm text-deany-steel hover:text-deany-navy
              transition-colors duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2 py-1">
            <Home className="w-3.5 h-3.5" /><span>Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-medium uppercase tracking-wide text-deany-muted mb-2">
            Module 1 · {mod.difficulty || 'Beginner'}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-deany-navy mb-1">{mod.title}</h1>
          <p className="text-base text-deany-steel">{mod.subtitle}</p>
        </div>

        {/* Progress */}
        <div className="text-center mb-10">
          <p className="text-sm text-deany-steel mb-2">
            {completedCount} of {lessons.length} lessons complete
          </p>
          <div className="w-48 h-1.5 bg-deany-border rounded-full mx-auto">
            <div className="h-full bg-deany-gold rounded-full transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Winding Path */}
        <div className="relative" style={{ height: totalH }}>
          <svg className="absolute inset-0 w-full" style={{ height: totalH }}
            viewBox={`0 0 100 ${totalH}`} preserveAspectRatio="none" fill="none" aria-hidden="true">
            <g className="text-deany-border">
              <path d={pathD} stroke="currentColor" strokeWidth="2"
                strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
            </g>
            {ratio > 0 && (
              <g className="text-deany-gold transition-all duration-500 ease-out">
                <path d={pathD} stroke="currentColor" strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="1000" strokeDashoffset={1000 - 1000 * ratio} />
              </g>
            )}
          </svg>

          {lessons.map((lesson, i) => (
            <Node key={lesson.id} index={i} lesson={lesson} state={state(i)}
              hasSaved={!!loadProgress?.(lesson.id)} x={NODES[i]?.x ?? 50} top={TOP + i * GAP}
              onClick={() => state(i) !== 'locked' && onSelectLesson(lesson, i)} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Circular Lesson Node ─── */
const Node = ({ index, lesson, state, hasSaved, x, top, onClick }) => {
  const ok = state !== 'locked';
  const circle = [
    'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ease-out',
    state === 'completed' && 'bg-deany-gold shadow-sm',
    state === 'current' && 'bg-white border-2 border-deany-gold shadow-sm animate-pulse-gold',
    state === 'locked' && 'bg-deany-cream border border-deany-border',
    ok && 'hover:scale-105 hover:shadow-lg active:scale-90',
    !ok && 'cursor-not-allowed',
  ].filter(Boolean).join(' ');

  const inner = state === 'completed'
    ? <span className="text-lg font-bold text-white">{index + 1}</span>
    : state === 'current'
      ? <span className="text-lg font-bold text-deany-gold">{index + 1}</span>
      : <Lock className="w-5 h-5 text-deany-muted" />;

  return (
    <div className="absolute flex flex-col items-center"
      style={{ left: `${x}%`, top, transform: 'translateX(-50%)', width: 120 }}>
      {/* Circle with badge wrapper */}
      <div className="relative">
        {ok ? (
          <button onClick={onClick} className={`${circle} focus:outline-none focus-visible:ring-2
            focus-visible:ring-deany-gold focus-visible:ring-offset-2`}
            aria-label={`Lesson ${index + 1}: ${lesson.title}`}>
            {inner}
          </button>
        ) : (
          <div className={circle}>{inner}</div>
        )}
        {state === 'completed' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-deany-gold
            flex items-center justify-center shadow-sm border-2 border-white">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      {/* Label */}
      <p className={`mt-2 text-xs font-medium leading-tight text-center ${
        state === 'locked' ? 'text-deany-muted' : 'text-deany-navy'
      }`}>{lesson.title}</p>
      {hasSaved && state !== 'completed' && (
        <span className="mt-1 text-[10px] font-medium text-deany-gold bg-deany-gold-light
          px-2 py-0.5 rounded-full">Continue</span>
      )}
    </div>
  );
};

export default ModuleOverview;
