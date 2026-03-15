import React from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock, BookOpen } from 'lucide-react';

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
      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        {/* Nav */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome} className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
            <Home className="w-4 h-4" /><span>Home</span>
          </button>
        </div>

        {/* Modules */}
        <div className="space-y-14">
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
  const pct = lessons.length > 0 ? (doneCount / lessons.length) * 100 : 0;
  const curIdx = lessons.findIndex((_, i) => !isDone(i));
  const getState = (i) => {
    if (isDone(i)) return 'done';
    if (i === curIdx) return 'current';
    if (i > curIdx && curIdx !== -1) return 'locked';
    return 'current';
  };

  // Speed round card
  if (mod.isSpeedRound) return (
    <div>
      <button onClick={() => onSelectModule(mod, mi)} className={`w-full ${glassHover} rounded-2xl p-6 text-center`}>
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
          <Zap className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: 'Georgia, serif' }}>{mod.title}</h3>
        <p className="text-xs text-gray-500 mb-3">{mod.subtitle}</p>
        <span className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-semibold text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
          Start Challenge <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </button>
    </div>
  );

  // Empty / coming soon
  if (!lessons.length) return (
    <div className={`${glass} rounded-2xl p-8 text-center opacity-60`}>
      <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
      <h3 className="font-bold text-gray-900 text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{mod.title}</h3>
      <p className="text-xs text-gray-500 mb-2">{mod.subtitle}</p>
      <span className="text-[11px] px-3 py-1 rounded-full font-medium bg-amber-100 text-amber-700">Coming Soon</span>
    </div>
  );

  // Course info card + path
  return (
    <div>
      {/* Info card — Brilliant-style */}
      <div className={`${glass} rounded-2xl p-5 mb-2`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            style={{ background: `linear-gradient(135deg, ${mod.color || '#d97706'}22, ${mod.color || '#d97706'}44)` }}>
            {mod.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Georgia, serif' }}>{mod.title}</h2>
            <p className="text-xs text-gray-500">{mod.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{lessons.length} Lessons</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.estimatedTime || '70 min'}</span>
          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            mod.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
          }`}>{mod.difficulty || 'Beginner'}</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200/80 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #059669, #34d399)' }} />
          </div>
          <span className="text-xs font-bold text-gray-700">{doneCount}/{lessons.length}</span>
        </div>
      </div>

      {/* Winding path */}
      <div className="py-6">
        {lessons.map((lesson, i) => {
          const st = getState(i);
          const saved = !!loadProgress?.(lesson.id);
          const isLeft = i % 2 === 0;
          const isLast = i === lessons.length - 1;

          return (
            <React.Fragment key={lesson.id}>
              {i > 0 && (
                <div className={`flex ${isLeft ? 'justify-start pl-20' : 'justify-end pr-20'}`}>
                  <div className={`w-0.5 h-10 rounded-full ${
                    isDone(i - 1) && (isDone(i) || i === curIdx) ? 'bg-emerald-300' : 'bg-gray-200'
                  }`} />
                </div>
              )}
              <div className={`flex items-center gap-4 ${
                isLast ? 'justify-center' : isLeft ? 'justify-start pl-4' : 'justify-end pr-4'
              }`}>
                <PathNode i={i} lesson={lesson} st={st} saved={saved} color={mod.color}
                  onClick={() => st !== 'locked' && onSelectLesson(lesson, i)} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ── The actual node — this is where visual weight lives ── */
const PathNode = ({ i, lesson, st, saved, color, onClick }) => {
  const clickable = st !== 'locked';
  const isCurrent = st === 'current';
  const size = isCurrent ? 'w-[90px] h-[90px]' : 'w-[76px] h-[76px]';

  // Visual style per state
  const style = st === 'done'
    ? { background: 'linear-gradient(145deg, #059669, #10b981)', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }
    : isCurrent
      ? { background: 'white', boxShadow: `0 8px 30px ${color || '#d97706'}40`, border: `3px solid ${color || '#d97706'}` }
      : { background: 'linear-gradient(145deg, #e5e7eb, #f3f4f6)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };

  const cls = [
    `${size} rounded-full flex items-center justify-center transition-all duration-200 ease-out`,
    isCurrent && 'animate-pulse-gold',
    clickable && 'hover:scale-110 hover:brightness-105 active:scale-90',
    !clickable && 'cursor-not-allowed',
  ].filter(Boolean).join(' ');

  const inner = st === 'done'
    ? <Check className="w-7 h-7 text-white drop-shadow-sm" strokeWidth={2.5} />
    : isCurrent
      ? <span className="text-2xl font-bold drop-shadow-sm" style={{ color: color || '#d97706' }}>{i + 1}</span>
      : <Lock className="w-5 h-5 text-gray-400" />;

  const circle = clickable
    ? <button onClick={onClick} className={cls} style={style} aria-label={`Lesson ${i + 1}: ${lesson.title}`}>{inner}</button>
    : <div className={cls} style={style}>{inner}</div>;

  return (
    <div className="flex flex-col items-center" style={{ width: 140 }}>
      {circle}
      <p className={`mt-2.5 text-xs font-bold text-center leading-snug ${
        st === 'locked' ? 'text-gray-400' : 'text-gray-800'
      }`}>{lesson.title}</p>
      <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
        <Clock className="w-2.5 h-2.5" />{lesson.duration}
      </p>
      {saved && st !== 'done' && (
        <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Continue</span>
      )}
    </div>
  );
};

export default ModuleOverview;
