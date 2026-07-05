// A single path's lessons, shown as the website's clean lesson timeline
// (spine + node + card) rather than a zigzag road. Done = check, next-up =
// gold play, the rest are numbered and tappable.
import React, { useMemo } from 'react';
import { Check, Play, ChevronLeft, Clock } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';

const serif = 'Georgia, serif';

export default function PathLessons({ topic, modules, completedLessons, accent = TOKENS.teal, level, onSelectLesson, onBack }) {
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

      {/* Timeline */}
      <div style={{ padding: '10px 20px 8px' }}>
        {sections.map((sec, si) => (
          <div key={sec.mod.id}>
            <div style={{ fontSize: 11, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(27,42,74,0.45)', fontWeight: 700, margin: si === 0 ? '4px 0 12px' : '22px 0 12px' }}>{sec.mod.title}</div>
            {sec.lessons.map((row, ri) => {
              const state = row.isDone ? 'done' : row.key === currentKey ? 'current' : 'available';
              const isLast = ri === sec.lessons.length - 1;
              return <Row key={row.key} row={row} index={ri} state={state} accent={accent} isLast={isLast} onClick={() => onSelectLesson?.(row.lesson, row.idx, row.mod)} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ row, index, state, accent, isLast, onClick }) {
  const done = state === 'done';
  const cur = state === 'current';
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
      {/* Spine */}
      <div style={{ width: 34, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2,
          ...(done ? { background: accent, boxShadow: `0 2px 8px ${accent}4D` }
            : cur ? { background: TOKENS.gold, boxShadow: '0 3px 0 #C8901A, 0 2px 10px rgba(240,180,41,0.3)' }
            : { background: '#fff', border: `2px solid ${TOKENS.muted}` }),
        }}>
          {done ? <Check size={16} color="#fff" strokeWidth={3} /> : cur ? <Play size={13} color="#fff" fill="#fff" /> : <span style={{ fontSize: 13, fontWeight: 700, color: TOKENS.muted }}>{index + 1}</span>}
        </div>
        {!isLast && <div style={{ width: 2, flexGrow: 1, minHeight: 14, background: done ? accent : 'rgba(15,76,92,0.10)' }} />}
      </div>

      {/* Card */}
      <button onClick={onClick} style={{
        flex: 1, marginLeft: 14, marginBottom: isLast ? 0 : 12, borderRadius: 14, padding: '15px 16px', textAlign: 'left',
        background: '#fff', border: cur ? 'none' : '1px solid rgba(15,76,92,0.10)', borderLeft: cur ? `4px solid ${accent}` : undefined,
        boxShadow: cur ? `0 4px 18px ${accent}1F` : '0 1px 4px rgba(26,35,50,.04)', cursor: 'pointer', minHeight: 48,
        display: 'flex', alignItems: 'center', gap: 12, transition: 'box-shadow .2s ease, transform .12s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 15.5, fontWeight: 500, color: TOKENS.tealDeep, lineHeight: 1.3 }}>{row.lesson.title}</div>
          {(row.lesson.description || row.lesson.duration) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12, color: TOKENS.muted }}>
              {row.lesson.duration && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><Clock size={12} /> {row.lesson.duration}</span>}
              {cur && <span style={{ color: accent, fontWeight: 600 }}>Up next</span>}
              {done && <span style={{ color: TOKENS.teal, fontWeight: 600 }}>Done</span>}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
