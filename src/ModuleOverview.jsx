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

/* ── Sculpted 3D Balance Scales ──
   Chunky volumetric forms: radialGradient sphere, cylinder-wrap pillar,
   deep bowls with curved walls, visible beam thickness. Designed to
   render large (90px) and tower above its tile. */
const ScalesIcon3D = ({ size = 90 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 64 74" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="s-sph" cx="36%" cy="30%" r="58%">
        <stop offset="0%" stopColor="#fffbeb"/><stop offset="30%" stopColor="#fcd34d"/>
        <stop offset="70%" stopColor="#d97706"/><stop offset="100%" stopColor="#7c2d12"/>
      </radialGradient>
      <linearGradient id="s-cyl" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fef3c7"/><stop offset="15%" stopColor="#fcd34d"/>
        <stop offset="45%" stopColor="#f59e0b"/><stop offset="75%" stopColor="#b45309"/>
        <stop offset="100%" stopColor="#7c2d12"/>
      </linearGradient>
      <linearGradient id="s-top" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="#fef9c3"/><stop offset="100%" stopColor="#eab308"/>
      </linearGradient>
      <linearGradient id="s-fr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d97706"/><stop offset="100%" stopColor="#7c2d12"/>
      </linearGradient>
      <radialGradient id="s-bowl" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fef3c7"/><stop offset="40%" stopColor="#fbbf24"/>
        <stop offset="100%" stopColor="#92400e"/>
      </radialGradient>
      <linearGradient id="s-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b45309"/><stop offset="100%" stopColor="#6d2810"/>
      </linearGradient>
    </defs>

    {/* ── GROUND SHADOW ── */}
    <ellipse cx="32" cy="71" rx="24" ry="3" fill="#000" opacity="0.12"/>

    {/* ── BASE PEDESTAL ── */}
    <path d="M16,62 L16,66 Q16,70 32,70 Q48,70 48,66 L48,62 Q48,66 32,66 Q16,66 16,62Z" fill="url(#s-fr)"/>
    <ellipse cx="32" cy="62" rx="16" ry="5" fill="url(#s-top)"/>
    <ellipse cx="29" cy="61" rx="9" ry="2.5" fill="#fff" opacity="0.22"/>

    {/* ── CENTRAL PILLAR ── */}
    <rect x="25" y="18" width="14" height="44" rx="6" fill="url(#s-cyl)"/>
    <rect x="26" y="20" width="4" height="40" rx="2" fill="#fff" opacity="0.12"/>

    {/* ── BEAM — top face + front face ── */}
    <rect x="3" y="20" width="58" height="4" rx="2" fill="url(#s-fr)"/>
    <rect x="3" y="14" width="58" height="7" rx="3.5" fill="url(#s-cyl)"/>
    <rect x="6" y="14.5" width="34" height="3" rx="1.5" fill="#fff" opacity="0.2"/>

    {/* ── LEFT CHAIN ── */}
    <rect x="7" y="21" width="6" height="20" rx="3" fill="url(#s-cyl)"/>
    <rect x="8" y="23" width="2.2" height="16" rx="1" fill="#fff" opacity="0.15"/>

    {/* ── RIGHT CHAIN ── */}
    <rect x="51" y="21" width="6" height="20" rx="3" fill="url(#s-cyl)"/>
    <rect x="52" y="23" width="2.2" height="16" rx="1" fill="#fff" opacity="0.15"/>

    {/* ── LEFT PAN ── */}
    <ellipse cx="10" cy="51" rx="9" ry="2" fill="#000" opacity="0.08"/>
    <path d="M-1,42 Q-1,52 10,52 Q21,52 21,42 L19,42 Q18.5,49 10,49 Q1.5,49 1,42Z" fill="url(#s-wall)"/>
    <ellipse cx="10" cy="42" rx="11" ry="4.2" fill="url(#s-bowl)"/>
    <ellipse cx="8.5" cy="41" rx="6.5" ry="2.2" fill="#fff" opacity="0.18"/>

    {/* ── RIGHT PAN ── */}
    <ellipse cx="54" cy="51" rx="9" ry="2" fill="#000" opacity="0.08"/>
    <path d="M43,42 Q43,52 54,52 Q65,52 65,42 L63,42 Q62.5,49 54,49 Q45.5,49 45,42Z" fill="url(#s-wall)"/>
    <ellipse cx="54" cy="42" rx="11" ry="4.2" fill="url(#s-bowl)"/>
    <ellipse cx="52.5" cy="41" rx="6.5" ry="2.2" fill="#fff" opacity="0.18"/>

    {/* ── TOP SPHERE ── */}
    <circle cx="32" cy="10" r="7.5" fill="url(#s-sph)"/>
    <circle cx="29.5" cy="7.5" r="3" fill="#fff" opacity="0.4"/>
  </svg>
);

const LESSON_ICONS = [ScalesIcon3D, '🤲', '🛡️', '🔍', '💰'];
const TILE_OFFSETS = [0, 50, -35, 55, -15];

const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
};

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
    playClickSound();
    onSelectLesson(lesson, i);
  }, [onSelectLesson]);

  if (mod.isSpeedRound) return (
    <button onClick={() => onSelectModule(mod, mi)} className={`w-full ${glassHover} rounded-2xl p-6 text-left`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}><Zap className="w-7 h-7" /></div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-sm text-gray-500">{mod.subtitle}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );

  if (!lessons.length) return (
    <div className={`${glass} rounded-2xl p-6 opacity-60`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-200 flex-shrink-0">
          <Lock className="w-6 h-6 text-gray-400" /></div>
        <div>
          <h3 className="font-bold text-gray-700" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h3>
          <p className="text-sm text-gray-400">{mod.subtitle}</p>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 mt-1.5 inline-block">Coming Soon</span>
        </div>
      </div>
    </div>
  );

  const nextLesson = curIdx >= 0 ? lessons[curIdx] : null;

  return (
    <div>
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600/60">Module {mi + 1}</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-1" style={{ fontFamily: 'Georgia,serif' }}>{mod.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{mod.subtitle}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #059669, #10b981)' }} />
          </div>
          <span className="text-sm font-semibold text-gray-500">{doneCount}/{lessons.length}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-14">
        {lessons.map((lesson, i) => {
          const st = getState(i);
          const saved = !!loadProgress?.(lesson.id);
          const offset = TILE_OFFSETS[i % TILE_OFFSETS.length];
          return (
            <div key={lesson.id} className="flex items-end gap-5 w-full" style={{ paddingLeft: `${Math.max(0, offset + 20)}px`, paddingRight: `${Math.max(0, -offset + 20)}px` }}>
              <DiamondTile i={i} st={st} onClick={() => handleLessonClick(lesson, i)} />
              <div className="flex-1 min-w-0 pb-3">
                <p className={`text-xs font-bold uppercase tracking-wide ${st === 'done' ? 'text-emerald-600' : st === 'current' ? 'text-amber-600' : 'text-gray-500'}`}>Lesson {i + 1}</p>
                <h3 className="font-bold text-base leading-snug text-gray-900 mt-0.5" style={{ fontFamily: 'Georgia,serif' }}>{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs flex items-center gap-1 text-gray-400"><Clock className="w-3.5 h-3.5" />{lesson.duration}</span>
                  {st === 'done' && <span className="text-xs font-semibold text-emerald-600">Completed</span>}
                  {saved && st !== 'done' && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">Continue</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {nextLesson && (
        <button onClick={() => { playClickSound(); onSelectLesson(nextLesson, curIdx); }}
          className="w-full mt-8 py-4 rounded-2xl text-white font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
          <Play className="w-5 h-5" fill="white" />
          {doneCount > 0 ? 'Continue Learning' : 'Start Learning'}
        </button>
      )}
    </div>
  );
};

const DiamondTile = ({ i, st, onClick }) => {
  const isDone = st === 'done';
  const isCur = st === 'current';
  const icon = LESSON_ICONS[i % LESSON_ICONS.length];
  const isComponent = typeof icon === 'function';

  const bg = isDone
    ? 'linear-gradient(145deg, #059669 0%, #10b981 60%, #34d399 100%)'
    : isCur
      ? 'linear-gradient(145deg, #d97706 0%, #f59e0b 60%, #fbbf24 100%)'
      : 'linear-gradient(145deg, #6366f1 0%, #818cf8 60%, #a5b4fc 100%)';

  const shadow = isDone
    ? '0 8px 0 #047857, 0 12px 24px rgba(5,150,105,0.35), inset 0 2px 4px rgba(255,255,255,0.3)'
    : isCur
      ? '0 8px 0 #b45309, 0 12px 24px rgba(217,119,6,0.35), inset 0 2px 4px rgba(255,255,255,0.3)'
      : '0 6px 0 #4338ca, 0 10px 18px rgba(99,102,241,0.25), inset 0 2px 4px rgba(255,255,255,0.2)';

  const glowShadow = isCur
    ? '0 8px 0 #b45309, 0 0 35px rgba(245,158,11,0.5), 0 0 70px rgba(245,158,11,0.2), inset 0 2px 4px rgba(255,255,255,0.3)'
    : shadow;

  return (
    <div className="relative flex-shrink-0" style={{ width: 88, height: 140 }}>
      {/* Glow aura for current tile */}
      {isCur && (
        <div className="absolute rounded-3xl animate-pulse-gold" style={{
          left: -10, right: -10, bottom: -10, height: 108,
          background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
        }} />
      )}

      {/* Diamond tile — anchored at bottom of container */}
      <button onClick={onClick}
        className="absolute bottom-0 left-1/2 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-3 hover:scale-110 active:translate-y-1 active:scale-95"
        style={{
          width: 80, height: 80,
          marginLeft: -40,
          background: bg,
          boxShadow: isCur ? glowShadow : shadow,
          transform: 'rotate(45deg)',
        }}>
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div style={{
            position: 'absolute', top: 0, left: '-20%', width: '60%', height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)',
          }} />
        </div>
      </button>

      {/* Contact shadow ON the tile surface */}
      {!isDone && (
        <div className="absolute pointer-events-none" style={{
          bottom: 42, left: '50%', transform: 'translateX(-50%)',
          width: 48, height: 14,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      )}

      {/* 3D icon STANDING on tile — base at tile surface, extends above */}
      <div className="absolute pointer-events-none" style={{
        left: '50%', bottom: 36,
        transform: 'translateX(-50%)',
        filter: 'drop-shadow(0 6px 3px rgba(0,0,0,0.4)) drop-shadow(0 12px 8px rgba(0,0,0,0.18))',
      }}>
        {isDone ? (
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        ) : isComponent ? (
          React.createElement(icon, { size: 80 })
        ) : (
          <span style={{ fontSize: 72, lineHeight: 1, display: 'block' }}>{icon}</span>
        )}
      </div>
    </div>
  );
};

export default ModuleOverview;
