import React from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock, BookOpen, PlayCircle } from 'lucide-react';

const pageBg = { background: 'linear-gradient(150deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 60%, #fefce8 100%)' };
const glass = "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg";
const glassHover = `${glass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`;

const IslamicPattern = ({ opacity = 0.05, color = "#fff" }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="geo-hdr" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 0L60 30L30 60L0 30Z" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity}/>
        <circle cx="30" cy="30" r="12" fill="none" stroke={color} strokeWidth="0.3" opacity={opacity}/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-hdr)"/>
  </svg>
);

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

const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;
  return (
    <div className="min-h-screen relative" style={pageBg}>
      <PagePattern />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Nav */}
        <div className="flex justify-between items-center mb-5">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome} className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
            <Home className="w-4 h-4" /><span>Home</span>
          </button>
        </div>

        <div className="space-y-8">
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

  if (mod.isSpeedRound) return (
    <button onClick={() => onSelectModule(mod, mi)} className={`w-full ${glassHover} rounded-2xl p-5 text-left`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}><Zap className="w-6 h-6" /></div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-xs text-gray-500">{mod.subtitle}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );

  if (!lessons.length) return (
    <div className={`${glass} rounded-2xl p-5 opacity-60`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-200 flex-shrink-0">
          <Lock className="w-5 h-5 text-gray-400" /></div>
        <div>
          <h3 className="font-bold text-gray-700 text-sm" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-xs text-gray-400">{mod.subtitle}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 mt-1 inline-block">Coming Soon</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero header card */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-xl mb-4"
        style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)' }}>
        <IslamicPattern />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Module {mi + 1}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-semibold">{mod.difficulty || 'Beginner'}</span>
          </div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h2>
          <p className="text-white/60 text-sm mt-0.5">{mod.subtitle}</p>
          <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{lessons.length} Lessons</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{mod.estimatedTime || '70 min'}</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-white/90">{doneCount}/{lessons.length}</span>
          </div>
        </div>
      </div>

      {/* Timeline of lesson cards */}
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-4 bottom-4 w-[3px] rounded-full bg-gray-200" />
        <div className="absolute left-[18px] top-4 w-[3px] rounded-full transition-all duration-500"
          style={{ height: `${pct}%`, background: 'linear-gradient(180deg, #059669, #10b981)' }} />

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const st = getState(i);
            const saved = !!loadProgress?.(lesson.id);
            return (
              <LessonCard key={lesson.id} i={i} lesson={lesson} st={st} saved={saved}
                color={mod.color} onClick={() => st !== 'locked' && onSelectLesson(lesson, i)} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LessonCard = ({ i, lesson, st, saved, color, onClick }) => {
  const clickable = st !== 'locked';
  const isDone = st === 'done';
  const isCur = st === 'current';

  const badgeStyle = isDone
    ? { background: 'linear-gradient(135deg, #059669, #10b981)' }
    : isCur
      ? { background: `linear-gradient(135deg, ${color || '#d97706'}, #f59e0b)` }
      : { background: '#e5e7eb' };

  const cardClass = [
    'flex items-center gap-4 rounded-xl p-4 transition-all duration-200',
    isDone && 'bg-emerald-50/80 border border-emerald-200/60 shadow-sm',
    isCur && 'bg-white border-2 shadow-lg',
    st === 'locked' && 'bg-white/40 border border-gray-200/50',
    clickable && 'cursor-pointer hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] active:shadow-md',
    !clickable && 'cursor-not-allowed opacity-60',
  ].filter(Boolean).join(' ');

  const borderColor = isCur ? (color || '#d97706') : undefined;

  return (
    <div className="relative">
      {/* Badge on the timeline */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center shadow-md z-10"
        style={badgeStyle}>
        {isDone ? <Check className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          : isCur ? <span className="text-sm font-bold text-white">{i + 1}</span>
          : <Lock className="w-3.5 h-3.5 text-gray-400" />}
      </div>

      {/* Card */}
      {clickable ? (
        <button onClick={onClick} className={`w-full text-left ${cardClass}`}
          style={borderColor ? { borderColor } : undefined}>
          <CardContent i={i} lesson={lesson} st={st} saved={saved} color={color} />
        </button>
      ) : (
        <div className={cardClass}>
          <CardContent i={i} lesson={lesson} st={st} saved={saved} color={color} />
        </div>
      )}
    </div>
  );
};

const CardContent = ({ i, lesson, st, saved, color }) => {
  const isDone = st === 'done';
  const isCur = st === 'current';
  return (
    <>
      <div className="flex-1 min-w-0">
        <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${
          isDone ? 'text-emerald-600' : isCur ? 'text-gray-500' : 'text-gray-400'
        }`}>Lesson {i + 1}</p>
        <h3 className={`font-bold text-sm leading-snug ${
          st === 'locked' ? 'text-gray-400' : 'text-gray-900'
        }`} style={{ fontFamily: 'Georgia,serif' }}>{lesson.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[11px] flex items-center gap-0.5 ${
            st === 'locked' ? 'text-gray-300' : 'text-gray-400'
          }`}><Clock className="w-3 h-3" />{lesson.duration}</span>
          {isDone && <span className="text-[10px] font-semibold text-emerald-600">Completed</span>}
          {saved && !isDone && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Continue</span>}
        </div>
      </div>
      {isCur && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md text-white"
          style={{ background: `linear-gradient(135deg, ${color || '#d97706'}, #f59e0b)` }}>
          <PlayCircle className="w-5 h-5" />
        </div>
      )}
      {isDone && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100">
          <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
        </div>
      )}
    </>
  );
};

export default ModuleOverview;
