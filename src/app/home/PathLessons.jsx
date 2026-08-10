// A single path's lessons, shown as the website's clean lesson timeline
// (spine + node + card) rather than a zigzag road. Done = check, next-up =
// gold play, the rest are numbered and tappable.
import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Play, ChevronLeft, Clock, ArrowRight, Lock } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';
import RootWordsModule from '../quran/corewords/RootWordsModule.jsx';
import { isLessonUnlocked } from '../../lessonLock.js';

const serif = 'Georgia, serif';

export default function PathLessons({ topic, modules, completedLessons, accent = TOKENS.teal, level, onSelectLesson, onBack }) {
  const [coreWords, setCoreWords] = useState(false);
  const showCoreWords = topic.id === 'quran-arabic';
  const { sections, currentKey, done, total } = useMemo(() => {
    const mods = (modules[topic.id] || []).filter(m => (m.lessons || []).length);
    const flat = [];
    const sections = mods.map(mod => ({
      mod,
      lessons: (mod.lessons || []).map((lesson, idx) => {
        const key = `${mod.id}-lesson-${idx}`;
        flat.push(key);
        return { lesson, idx, mod, key, isDone: !!completedLessons[key] };
      }),
    }));
    const firstIncomplete = flat.find(k => !completedLessons[k]);
    const done = flat.filter(k => completedLessons[k]).length;
    return { sections, currentKey: firstIncomplete, done, total: flat.length };
  }, [topic, modules, completedLessons]);

  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <style>{`
        @keyframes plEntice { 0%,100% { filter: drop-shadow(0 0 3px rgba(240,180,41,.55)); transform: scale(1); } 50% { filter: drop-shadow(0 0 9px rgba(240,180,41,.95)); transform: scale(1.06); } }
        @keyframes plEnticeCard { 0%,100% { box-shadow: 0 4px 18px rgba(240,180,41,.16); } 50% { box-shadow: 0 6px 24px rgba(240,180,41,.32); } }
        @media (prefers-reduced-motion: no-preference) {
          .pl-entice-node { animation: plEntice 2.2s ease-in-out infinite; }
          .pl-entice-card { animation: plEnticeCard 2.4s ease-in-out infinite; }
        }
      `}</style>
      {/* Header */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 20px 8px' }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: TOKENS.muted, fontSize: 14, cursor: 'pointer', padding: '4px 0', marginBottom: 8, WebkitTapHighlightColor: 'transparent' }}>
          <ChevronLeft size={17} /> Paths
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <h1 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: TOKENS.tealDeep, margin: 0, flex: 1, lineHeight: 1.2 }}>{topic.title}</h1>
          {level && <span style={{ fontSize: 12, fontWeight: 600, color: accent, background: `${accent}1A`, borderRadius: 20, padding: '4px 12px', flexShrink: 0 }}>{level}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 6, background: 'rgba(15,76,92,0.10)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 3, transition: 'width .5s ease' }} />
          </div>
          <span style={{ fontSize: 12, color: TOKENS.muted, flexShrink: 0 }}>{done} of {total}</span>
        </div>
      </div>

      {/* Quranic Core Words - separate study tool at the top of the Quran path */}
      {showCoreWords && (
        <div style={{ padding: '4px 20px 2px' }}>
          <button onClick={() => setCoreWords(true)} className="dash-press"
            style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: '#EDEAFA', border: '1px solid #D9D3F2', borderRadius: 14, padding: '13px 15px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: '#2A2264', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Scheherazade New','Amiri',serif", fontSize: 20, color: '#fff', lineHeight: 1 }}>{'ق'}</span>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase', color: '#5B4FA0' }}>Memorisation and tafsir</span>
              <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#2A2264', marginTop: 1 }}>Quranic Core Words</span>
            </span>
            <ArrowRight size={18} color="#5B4FA0" />
          </button>
        </div>
      )}

      {/* Timeline */}
      <div style={{ padding: '10px 20px 8px' }}>
        {sections.map((sec, si) => (
          <div key={sec.mod.id}>
            <div style={{ fontSize: 11, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(27,42,74,0.45)', fontWeight: 700, margin: si === 0 ? '4px 0 12px' : '22px 0 12px' }}>{sec.mod.title}</div>
            {sec.lessons.map((row, ri) => {
              const unlocked = isLessonUnlocked(row.lesson);
              const state = !unlocked ? 'locked' : row.isDone ? 'done' : 'current';
              const isLast = ri === sec.lessons.length - 1;
              return <Row key={row.key} row={row} index={ri} state={state} accent={accent} isLast={isLast}
                onClick={unlocked ? () => onSelectLesson?.(row.lesson, row.idx, row.mod) : undefined} />;
            })}
          </div>
        ))}
      </div>

      {/* Full-screen takeover, portaled to body so it covers the app nav pill */}
      {coreWords && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#F4F2FA' }}>
          <RootWordsModule onExit={() => setCoreWords(false)} />
        </div>,
        document.body
      )}
    </div>
  );
}

function Row({ row, index, state, accent, isLast, onClick }) {
  const done = state === 'done';
  const cur = state === 'current';
  const locked = state === 'locked';
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
      {/* Spine */}
      <div style={{ width: 34, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={cur ? 'pl-entice-node' : undefined} style={{
          width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2,
          ...(done ? { background: accent, boxShadow: `0 2px 8px ${accent}4D` }
            : cur ? { background: TOKENS.gold, boxShadow: '0 3px 0 #C8901A, 0 2px 10px rgba(240,180,41,0.3)' }
            : { background: '#F3F1EA', border: `2px solid rgba(27,42,74,0.14)` }),
        }}>
          {done ? <Check size={16} color="#fff" strokeWidth={3} /> : cur ? <Play size={13} color="#fff" fill="#fff" /> : <Lock size={13} color={TOKENS.muted} />}
        </div>
        {!isLast && <div style={{ width: 2, flexGrow: 1, minHeight: 14, background: done ? accent : 'rgba(15,76,92,0.10)' }} />}
      </div>

      {/* Card */}
      <button onClick={onClick} disabled={locked} className={cur ? 'pl-entice-card' : undefined} style={{
        flex: 1, marginLeft: 14, marginBottom: isLast ? 0 : 12, borderRadius: 14, padding: '15px 16px', textAlign: 'left',
        background: '#fff', border: cur ? 'none' : '1px solid rgba(15,76,92,0.10)', borderLeft: cur ? `4px solid ${accent}` : undefined,
        boxShadow: cur ? `0 4px 18px ${accent}1F` : '0 1px 4px rgba(26,35,50,.04)',
        cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.72 : 1, minHeight: 48,
        display: 'flex', alignItems: 'center', gap: 12, transition: 'box-shadow .2s ease, transform .12s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 15.5, fontWeight: 500, color: locked ? TOKENS.muted : TOKENS.tealDeep, lineHeight: 1.3 }}>{row.lesson.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12, color: TOKENS.muted }}>
            {row.lesson.duration && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{locked ? <Lock size={12} /> : <Clock size={12} />} {row.lesson.duration}</span>}
            {cur && <span style={{ color: accent, fontWeight: 700 }}>Start now</span>}
            {done && <span style={{ color: TOKENS.teal, fontWeight: 600 }}>Done</span>}
            {locked && !row.lesson.duration && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Lock size={12} /> Locked</span>}
          </div>
        </div>
        {cur && <ArrowRight size={18} color={accent} style={{ flexShrink: 0 }} />}
      </button>
    </div>
  );
}
