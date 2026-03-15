import React, { useCallback } from 'react';
import { Check, Lock, ChevronLeft, Home, Zap, ArrowRight, Clock, Play } from 'lucide-react';
import { DECO_COMPONENTS } from './JourneyAssets';

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
      <filter id="sf"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-pg)"/>
  </svg>
);

/* ── Click sound ── */
const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
};

/* ── Scene constants ── */
const SW = 320;
const SH = 880;
const NODES = [
  { x: 160, y: 75 },
  { x: 225, y: 250 },
  { x: 95,  y: 425 },
  { x: 230, y: 600 },
  { x: 155, y: 775 },
];
const DECOS = [
  { x: 100, y: 162 },
  { x: 225, y: 338 },
  { x: 100, y: 512 },
  { x: 230, y: 688 },
];

const roadPath = `M${NODES[0].x} ${NODES[0].y} C${NODES[0].x + 55} ${NODES[0].y + 75}, ${NODES[1].x + 15} ${NODES[1].y - 75}, ${NODES[1].x} ${NODES[1].y} C${NODES[1].x - 50} ${NODES[1].y + 75}, ${NODES[2].x - 25} ${NODES[2].y - 75}, ${NODES[2].x} ${NODES[2].y} C${NODES[2].x + 55} ${NODES[2].y + 75}, ${NODES[3].x + 15} ${NODES[3].y - 75}, ${NODES[3].x} ${NODES[3].y} C${NODES[3].x - 40} ${NODES[3].y + 75}, ${NODES[4].x - 15} ${NODES[4].y - 75}, ${NODES[4].x} ${NODES[4].y}`;

const MAT = {
  done:    { top: '#10b981', side: '#047857', glow: 'rgba(16,185,129,0.3)', accent: '#059669' },
  current: { top: '#f59e0b', side: '#b45309', glow: 'rgba(245,158,11,0.4)', accent: '#d97706' },
  open:    { top: '#94a3b8', side: '#64748b', glow: 'rgba(100,116,139,0.12)', accent: '#475569' },
};

/* ── Road SVG ── */
const RoadSVG = () => (
  <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
    <defs>
      <filter id="road-shadow"><feGaussianBlur stdDeviation="3" /></filter>
      <linearGradient id="road-surface" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e2d9c8" />
        <stop offset="100%" stopColor="#d4c5a9" />
      </linearGradient>
    </defs>
    {/* Road drop shadow */}
    <path d={roadPath} stroke="rgba(0,0,0,0.07)" strokeWidth="62" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#road-shadow)" transform="translate(2,4)" />
    {/* Road body */}
    <path d={roadPath} stroke="#c8b894" strokeWidth="56" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Road surface highlight */}
    <path d={roadPath} stroke="url(#road-surface)" strokeWidth="48" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    {/* Left edge subtle line */}
    <path d={roadPath} stroke="#b8a882" strokeWidth="56" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" strokeDasharray="2 0" />
    {/* Center dashed line */}
    <path d={roadPath} stroke="#c4b494" strokeWidth="1.5" fill="none" strokeDasharray="10 14" opacity="0.4" strokeLinecap="round" />
    {/* Small dots at node positions for subtle road markings */}
    {NODES.map((n, i) => (
      <circle key={i} cx={n.x} cy={n.y} r="32" fill="rgba(255,255,255,0.08)" />
    ))}
  </svg>
);

/* ── 3D Pedestal Node ── */
const LessonNode = ({ index, state, onClick }) => {
  const m = MAT[state];
  const pos = NODES[index];
  const isDone = state === 'done';
  const isCur = state === 'current';

  return (
    <div className="absolute" style={{
      left: `${(pos.x / SW) * 100}%`,
      top: `${(pos.y / SH) * 100}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: isCur ? 20 : 10,
    }}>
      {/* Pulse glow ring for current */}
      {isCur && (
        <div className="absolute animate-pulse-gold rounded-full" style={{
          left: -14, top: -14, right: -14, bottom: -14,
          background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)`,
        }} />
      )}
      <button
        onClick={onClick}
        className="relative block transition-all duration-200 hover:-translate-y-2 hover:scale-105 active:translate-y-0.5 active:scale-95 cursor-pointer"
        style={{ width: 72, height: 82 }}
      >
        <svg width="72" height="82" viewBox="0 0 72 82" fill="none">
          {/* Contact shadow */}
          <ellipse cx="36" cy="78" rx="28" ry="4" fill="#000" opacity="0.1" />
          {/* Side extrusion */}
          <path d={`M6,48 L6,58 Q6,64 18,66 L54,66 Q66,64 66,58 L66,48 Q66,42 54,40 L18,40 Q6,42 6,48Z`} fill={m.side} />
          {/* Side highlight (left edge) */}
          <path d="M6,48 L6,56 Q6,62 14,64 L14,44 Q6,44 6,48Z" fill="rgba(255,255,255,0.12)" />
          {/* Top face */}
          <rect x="4" y="28" width="64" height="22" rx="11" fill={m.top} />
          {/* Top face — light overlay */}
          <rect x="6" y="26" width="36" height="14" rx="7" fill="#fff" opacity="0.25" filter="url(#sf)" />
          {/* Top face — shadow overlay */}
          <rect x="30" y="36" width="34" height="16" rx="8" fill="#000" opacity="0.12" filter="url(#sf)" />
          {/* Top edge highlight */}
          <rect x="10" y="28" width="30" height="3" rx="1.5" fill="#fff" opacity="0.3" />
          {/* Content */}
          {isDone ? (
            <g transform="translate(36,39)">
              <path d="M-8,0 L-3,5 L8,-5" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          ) : (
            <text x="36" y="44" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700" fontFamily="Georgia,serif">{index + 1}</text>
          )}
        </svg>
      </button>
    </div>
  );
};

/* ── Lesson label ── */
const LessonLabel = ({ lesson, index, state, saved }) => {
  const pos = NODES[index];
  const isRight = pos.x > SW / 2;
  const labelX = isRight ? pos.x - 105 : pos.x + 50;
  const stColor = state === 'done' ? 'text-emerald-600' : state === 'current' ? 'text-amber-600' : 'text-gray-400';

  return (
    <div className="absolute pointer-events-none" style={{
      left: `${(labelX / SW) * 100}%`,
      top: `${(pos.y / SH) * 100}%`,
      transform: 'translateY(-50%)',
      width: 110,
      textAlign: isRight ? 'right' : 'left',
    }}>
      <p className={`text-[10px] font-bold uppercase tracking-wide ${stColor}`}>Lesson {index + 1}</p>
      <h3 className="font-bold text-xs leading-tight text-gray-800 mt-0.5" style={{ fontFamily: 'Georgia,serif' }}>{lesson.title}</h3>
      <div className={`flex items-center gap-1 mt-0.5 ${isRight ? 'justify-end' : ''}`}>
        <Clock className="w-3 h-3 text-gray-400" />
        <span className="text-[10px] text-gray-400">{lesson.duration}</span>
      </div>
      {state === 'done' && <span className="text-[10px] font-semibold text-emerald-600">Completed</span>}
      {saved && state !== 'done' && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 mt-0.5 inline-block">Continue</span>
      )}
    </div>
  );
};

/* ── Decorative asset ── */
const DecorativeAsset = ({ index }) => {
  const pos = DECOS[index];
  const Comp = DECO_COMPONENTS[index % DECO_COMPONENTS.length];
  return (
    <div className="absolute pointer-events-none" style={{
      left: `${(pos.x / SW) * 100}%`,
      top: `${(pos.y / SH) * 100}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: 5,
      opacity: 0.85,
    }}>
      <Comp size={36} />
    </div>
  );
};

/* ── Journey Scene ── */
const JourneyScene = ({ lessons, getState, handleClick, loadProgress }) => (
  <div className="relative mx-auto" style={{ width: '100%', maxWidth: SW, perspective: 800 }}>
    <div style={{ transform: 'rotateX(3deg)', transformOrigin: 'center top' }}>
      {/* Road layer */}
      <RoadSVG />
      {/* Overlay: nodes, labels, decorative objects */}
      <div className="absolute inset-0">
        {/* Decorative objects (behind nodes in z-order) */}
        {DECOS.map((_, i) => <DecorativeAsset key={`d-${i}`} index={i} />)}
        {/* Lesson nodes + labels */}
        {lessons.map((lesson, i) => {
          const st = getState(i);
          const saved = !!loadProgress?.(lesson.id);
          return (
            <React.Fragment key={lesson.id}>
              <LessonNode index={i} state={st} onClick={() => handleClick(lesson, i)} />
              <LessonLabel lesson={lesson} index={i} state={st} saved={saved} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
);

/* ── Main component ── */
const ModuleOverview = ({
  modules, completedLessons, loadProgress, onSelectLesson, onSelectModule, onBack, onHome,
}) => {
  if (!modules?.length) return null;
  return (
    <div className="min-h-screen relative" style={pageBg}>
      <PagePattern />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-5">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-emerald-700 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /><span>Topics</span>
          </button>
          <button onClick={onHome} className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
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

/* ── Module block ── */
const ModuleBlock = ({ mod, mi, completedLessons, loadProgress, onSelectLesson, onSelectModule }) => {
  const lessons = mod.lessons || [];
  const isDone = (i) => !!completedLessons[`${mod.id}-lesson-${i}`];
  const doneCount = lessons.filter((_, i) => isDone(i)).length;
  const pct = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
  const curIdx = lessons.findIndex((_, i) => !isDone(i));
  const getState = (i) => { if (isDone(i)) return 'done'; if (i === curIdx) return 'current'; return 'open'; };
  const handleClick = useCallback((l, i) => { playClickSound(); onSelectLesson(l, i); }, [onSelectLesson]);

  if (mod.isSpeedRound) return (
    <button onClick={() => onSelectModule(mod, mi)} className={`w-full ${glassHover} rounded-2xl p-6 text-left`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}><Zap className="w-7 h-7" /></div>
        <div className="flex-1"><h3 className="font-bold text-gray-900" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3><p className="text-sm text-gray-500">{mod.subtitle}</p></div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
  if (!lessons.length) return (
    <div className={`${glass} rounded-2xl p-6 opacity-60`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-200 flex-shrink-0"><Lock className="w-6 h-6 text-gray-400" /></div>
        <div><h3 className="font-bold text-gray-700" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3><p className="text-sm text-gray-400">{mod.subtitle}</p>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 mt-1.5 inline-block">Coming Soon</span></div>
      </div>
    </div>
  );

  const next = curIdx >= 0 ? lessons[curIdx] : null;
  return (
    <div>
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600/60">Module {mi + 1}</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{mod.subtitle}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #059669, #10b981)' }} /></div>
          <span className="text-sm font-semibold text-gray-500">{doneCount}/{lessons.length}</span>
        </div>
      </div>

      <JourneyScene lessons={lessons} getState={getState} handleClick={handleClick} loadProgress={loadProgress} />

      {next && (
        <button onClick={() => { playClickSound(); onSelectLesson(next, curIdx); }}
          className="w-full mt-8 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
          <Play className="w-5 h-5" fill="white" />{doneCount > 0 ? 'Continue Learning' : 'Start Learning'}
        </button>)}
    </div>
  );
};

export default ModuleOverview;
