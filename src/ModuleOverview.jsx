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
   Every part is a volumetric form with visible thickness, curved-surface
   shading (radialGradient for spheres, horizontal linearGradient for
   cylinders), cast shadows, and specular highlights.
   Modelled after Chess.com's 3D rendered piece aesthetic. */
const ScalesIcon3D = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Sphere — radial highlight top-left like a lit ball */}
      <radialGradient id="s-sph" cx="38%" cy="32%" r="60%">
        <stop offset="0%" stopColor="#fef9c3"/><stop offset="35%" stopColor="#fcd34d"/>
        <stop offset="75%" stopColor="#d97706"/><stop offset="100%" stopColor="#92400e"/>
      </radialGradient>
      {/* Cylinder wrap — bright left face, dark right face */}
      <linearGradient id="s-cyl" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fef3c7"/><stop offset="18%" stopColor="#fcd34d"/>
        <stop offset="50%" stopColor="#f59e0b"/><stop offset="78%" stopColor="#d97706"/>
        <stop offset="100%" stopColor="#92400e"/>
      </linearGradient>
      {/* Top-lit surface */}
      <linearGradient id="s-top" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#fef9c3"/><stop offset="100%" stopColor="#fbbf24"/>
      </linearGradient>
      {/* Front face — medium to dark */}
      <linearGradient id="s-fr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#92400e"/>
      </linearGradient>
      {/* Bowl interior — radial for concave surface */}
      <radialGradient id="s-bowl" cx="42%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#fef3c7"/><stop offset="45%" stopColor="#fcd34d"/>
        <stop offset="100%" stopColor="#b45309"/>
      </radialGradient>
      {/* Bowl outer wall */}
      <linearGradient id="s-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d97706"/><stop offset="100%" stopColor="#78350f"/>
      </linearGradient>
    </defs>

    {/* ── Ground shadow ── */}
    <ellipse cx="32" cy="60" rx="22" ry="3" fill="#000" opacity="0.1"/>

    {/* ── BASE PEDESTAL — thick disc with visible side wall ── */}
    <path d="M18,52 L18,55 Q18,59 32,59 Q46,59 46,55 L46,52 Q46,56 32,56 Q18,56 18,52Z" fill="url(#s-fr)"/>
    <ellipse cx="32" cy="52" rx="14" ry="4.5" fill="url(#s-top)"/>
    <ellipse cx="29" cy="51" rx="8" ry="2.2" fill="#fff" opacity="0.2"/>

    {/* ── CENTRAL PILLAR — thick cylinder ── */}
    <rect x="26" y="15" width="12" height="37" rx="5" fill="url(#s-cyl)"/>
    <rect x="27" y="16" width="3.5" height="35" rx="1.5" fill="#fff" opacity="0.15"/>

    {/* ── HORIZONTAL BEAM — top face + front face for depth ── */}
    <rect x="4" y="17" width="56" height="3.5" rx="1.5" fill="url(#s-fr)"/>
    <rect x="4" y="12" width="56" height="6" rx="3" fill="url(#s-cyl)"/>
    <rect x="7" y="12.5" width="32" height="2.5" rx="1.2" fill="#fff" opacity="0.25"/>

    {/* ── LEFT CHAIN — thick rod ── */}
    <rect x="8" y="18" width="5" height="17" rx="2.5" fill="url(#s-cyl)"/>
    <rect x="8.5" y="19" width="1.8" height="15" rx="0.9" fill="#fff" opacity="0.15"/>

    {/* ── RIGHT CHAIN — thick rod ── */}
    <rect x="51" y="18" width="5" height="17" rx="2.5" fill="url(#s-cyl)"/>
    <rect x="51.5" y="19" width="1.8" height="15" rx="0.9" fill="#fff" opacity="0.15"/>

    {/* ── LEFT PAN — 3D bowl with curved wall + interior ── */}
    <ellipse cx="10.5" cy="44" rx="8" ry="1.5" fill="#000" opacity="0.08"/>
    <path d="M0,36 Q0,45 10.5,45 Q21,45 21,36 L19.5,36 Q19,43 10.5,43 Q2,43 1.5,36Z" fill="url(#s-wall)"/>
    <ellipse cx="10.5" cy="36" rx="10.5" ry="3.8" fill="url(#s-bowl)"/>
    <ellipse cx="9" cy="35.2" rx="6" ry="2" fill="#fff" opacity="0.2"/>

    {/* ── RIGHT PAN — 3D bowl ── */}
    <ellipse cx="53.5" cy="44" rx="8" ry="1.5" fill="#000" opacity="0.08"/>
    <path d="M43,36 Q43,45 53.5,45 Q64,45 64,36 L62.5,36 Q62,43 53.5,43 Q45,43 44.5,36Z" fill="url(#s-wall)"/>
    <ellipse cx="53.5" cy="36" rx="10.5" ry="3.8" fill="url(#s-bowl)"/>
    <ellipse cx="52" cy="35.2" rx="6" ry="2" fill="#fff" opacity="0.2"/>

    {/* ── TOP SPHERE (FINIAL) — lit ball ── */}
    <circle cx="32" cy="9" r="6.5" fill="url(#s-sph)"/>
    <circle cx="30" cy="7" r="2.8" fill="#fff" opacity="0.45"/>
  </svg>
);

const LESSON_ICONS = [ScalesIcon3D, '🤲', '🛡️', '🔍', '💰'];
const TILE_OFFSETS = [0, 50, -35, 55, -15];

/* Satisfying click sound via Web Audio API */
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
  } catch (_) { /* silent fallback */ }
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
  /* All lessons unlocked — no locked state */
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
      {/* Module header */}
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

      {/* Diamond tiles path */}
      <div className="flex flex-col items-center gap-7">
        {lessons.map((lesson, i) => {
          const st = getState(i);
          const saved = !!loadProgress?.(lesson.id);
          const offset = TILE_OFFSETS[i % TILE_OFFSETS.length];
          return (
            <div key={lesson.id} className="flex items-center gap-6 w-full" style={{ paddingLeft: `${Math.max(0, offset + 30)}px`, paddingRight: `${Math.max(0, -offset + 30)}px` }}>
              <DiamondTile i={i} st={st} onClick={() => handleLessonClick(lesson, i)} />
              <div className="flex-1 min-w-0">
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

      {/* Next Lesson CTA */}
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
    <div className="relative flex-shrink-0" style={{ width: 92, height: 92 }}>
      {/* Glow aura behind current tile */}
      {isCur && (
        <div className="absolute inset-[-14px] rounded-3xl animate-pulse-gold" style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)',
        }} />
      )}

      {/* Diamond base tile */}
      <button onClick={onClick}
        className="w-full h-full rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:-translate-y-2 hover:scale-110 active:translate-y-1 active:scale-95"
        style={{ background: bg, boxShadow: isCur ? glowShadow : shadow, transform: 'rotate(45deg)' }}>
        {/* Specular shine strip across tile */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div style={{
            position: 'absolute', top: 0, left: '-20%', width: '60%', height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)',
          }} />
        </div>
      </button>

      {/* 3D icon floating ABOVE the tile — like Chess.com pieces */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateY(-10px)' }}>
        {isDone ? (
          <div style={{
            filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.35)) drop-shadow(0 8px 6px rgba(0,0,0,0.15))',
          }}>
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        ) : typeof icon === 'function' ? (
          <div style={{
            filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.4)) drop-shadow(0 8px 5px rgba(0,0,0,0.2)) drop-shadow(0 12px 10px rgba(0,0,0,0.1))',
          }}>
            {React.createElement(icon, { size: 44 })}
          </div>
        ) : (
          <span style={{
            fontSize: 44,
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.4)) drop-shadow(0 8px 5px rgba(0,0,0,0.2)) drop-shadow(0 12px 10px rgba(0,0,0,0.1))',
          }}>{icon}</span>
        )}
      </div>
    </div>
  );
};

export default ModuleOverview;
