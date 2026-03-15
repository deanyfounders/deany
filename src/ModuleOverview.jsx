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

/* ── 3D Isometric Balance Scales ──
   Drawn from a 3/4 view — every element has separate front, top, and
   side-face polygons with distinct flat fills. The 3D comes from the
   GEOMETRY (visible face planes), not from gradients on flat shapes.
   Light source: top-left. */
const ScalesIcon3D = ({ size = 80 }) => (
  <svg width={size} height={size * 1.12} viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sc-sphere" cx="38%" cy="32%" r="55%">
        <stop offset="0%" stopColor="#fffbeb"/><stop offset="30%" stopColor="#fcd34d"/>
        <stop offset="70%" stopColor="#b45309"/><stop offset="100%" stopColor="#7c2d12"/>
      </radialGradient>
      <radialGradient id="sc-concave" cx="42%" cy="36%" r="55%">
        <stop offset="0%" stopColor="#fef3c7"/><stop offset="40%" stopColor="#eab308"/>
        <stop offset="100%" stopColor="#92400e"/>
      </radialGradient>
    </defs>

    {/* ── GROUND SHADOW ── */}
    <ellipse cx="40" cy="87" rx="30" ry="3.5" fill="#000" opacity="0.12"/>

    {/* ── BASE PEDESTAL ── */}
    <path d="M18,74 Q18,82 40,82 Q62,82 62,74 Q62,79 40,79 Q18,79 18,74Z" fill="#92400e"/>
    <path d="M52,74 Q58,75.5 62,74 L62,79 Q58,80.5 52,79Z" fill="#7c2d12"/>
    <ellipse cx="40" cy="74" rx="22" ry="6.5" fill="#eab308"/>
    <ellipse cx="36" cy="73" rx="13" ry="3.5" fill="#fde68a" opacity="0.5"/>
    <ellipse cx="33" cy="72.5" rx="7" ry="2" fill="#fff" opacity="0.22"/>

    {/* ── PILLAR — front + right side + top face ── */}
    <polygon points="46,26 50,23 50,72 46,74" fill="#7c2d12"/>
    <rect x="34" y="26" width="12" height="48" fill="#d97706"/>
    <rect x="34" y="26" width="2.5" height="48" fill="#fcd34d" opacity="0.45"/>
    <rect x="42" y="26" width="4" height="48" fill="#92400e" opacity="0.12"/>
    <polygon points="34,26 38,23 50,23 46,26" fill="#fde68a"/>
    <polygon points="34,26 38,23 50,23 46,26" fill="#fff" opacity="0.15"/>

    {/* ── BEAM — front + top + right end cap ── */}
    <polygon points="72,22 76,18 76,24 72,28" fill="#7c2d12"/>
    <polygon points="8,22 72,22 72,28 8,28" fill="#ca8a04"/>
    <polygon points="8,22 12,18 76,18 72,22" fill="#fde68a"/>
    <polygon points="10,19.5 44,19.5 42,21 8,21" fill="#fff" opacity="0.22"/>
    <line x1="8" y1="28" x2="72" y2="28" stroke="#7c2d12" strokeWidth="0.8" opacity="0.3"/>

    {/* ── LEFT CHAIN — rod with side face ── */}
    <polygon points="14,29 17,27 17,46 14,48" fill="#7c2d12"/>
    <rect x="8" y="29" width="6" height="19" fill="#d97706"/>
    <polygon points="8,29 11,27 17,27 14,29" fill="#fde68a"/>
    <rect x="8.5" y="30" width="2" height="17" fill="#fcd34d" opacity="0.4"/>

    {/* ── RIGHT CHAIN — rod with side face ── */}
    <polygon points="72,29 75,27 75,46 72,48" fill="#7c2d12"/>
    <rect x="66" y="29" width="6" height="19" fill="#d97706"/>
    <polygon points="66,29 69,27 75,27 72,29" fill="#fde68a"/>
    <rect x="66.5" y="30" width="2" height="17" fill="#fcd34d" opacity="0.4"/>

    {/* ── LEFT PAN — bowl with wall + interior ── */}
    <ellipse cx="11" cy="58" rx="11" ry="2.5" fill="#000" opacity="0.1"/>
    <path d="M-2,49 Q-2,59 11,59 Q24,59 24,49 L22,49 Q21,56 11,56 Q1,56 0,49Z" fill="#92400e"/>
    <path d="M18,49 Q22,50.5 24,49 L24,59 Q21,57 18,56Z" fill="#7c2d12" opacity="0.5"/>
    <ellipse cx="11" cy="49" rx="13" ry="5" fill="url(#sc-concave)"/>
    <ellipse cx="11" cy="50.5" rx="9" ry="3" fill="#92400e" opacity="0.1"/>
    <ellipse cx="11" cy="48.5" rx="11.5" ry="4.2" fill="none" stroke="#fde68a" strokeWidth="1.2"/>
    <ellipse cx="8" cy="48" rx="5.5" ry="2" fill="#fff" opacity="0.18"/>

    {/* ── RIGHT PAN — bowl with wall + interior ── */}
    <ellipse cx="69" cy="58" rx="11" ry="2.5" fill="#000" opacity="0.1"/>
    <path d="M56,49 Q56,59 69,59 Q82,59 82,49 L80,49 Q79,56 69,56 Q59,56 58,49Z" fill="#92400e"/>
    <path d="M76,49 Q80,50.5 82,49 L82,59 Q79,57 76,56Z" fill="#7c2d12" opacity="0.5"/>
    <ellipse cx="69" cy="49" rx="13" ry="5" fill="url(#sc-concave)"/>
    <ellipse cx="69" cy="50.5" rx="9" ry="3" fill="#92400e" opacity="0.1"/>
    <ellipse cx="69" cy="48.5" rx="11.5" ry="4.2" fill="none" stroke="#fde68a" strokeWidth="1.2"/>
    <ellipse cx="66" cy="48" rx="5.5" ry="2" fill="#fff" opacity="0.18"/>

    {/* ── TOP SPHERE ── */}
    <circle cx="40" cy="13" r="8" fill="url(#sc-sphere)"/>
    <circle cx="37" cy="10" r="3" fill="#fff" opacity="0.45"/>

    {/* ── AMBIENT OCCLUSION ── */}
    <ellipse cx="40" cy="74" rx="8" ry="2" fill="#000" opacity="0.06"/>
    <rect x="36" y="25" width="8" height="3" fill="#000" opacity="0.04" rx="1"/>
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
        filter: 'drop-shadow(0 4px 2px rgba(0,0,0,0.2))',
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
