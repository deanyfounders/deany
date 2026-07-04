// Review tab. There is no spaced-repetition engine yet, so this surfaces the
// lessons you have completed as things you can revisit, with an honest empty
// state. Wire into a real SRS engine here when one exists.
import React, { useMemo } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';
import { buildPath } from './pathData.js';

const serif = 'Georgia, serif';

export default function ReviewTab({ mainTopics, modules, completedLessons, onSelectLesson }) {
  const { reviewables } = useMemo(
    () => buildPath(mainTopics, modules, completedLessons),
    [mainTopics, modules, completedLessons]
  );

  const open = (r) => onSelectLesson?.(r.lesson, r.idx, r.mod);

  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 20px) 20px 8px' }}>
      <h1 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: TOKENS.tealDeep, margin: '0 0 4px' }}>Review</h1>

      {reviewables.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '64px 20px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(34,163,154,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <CheckCircle2 size={30} color={TOKENS.teal} />
          </div>
          <div style={{ fontFamily: serif, fontSize: 19, color: TOKENS.tealDeep, fontWeight: 500, marginBottom: 6 }}>All caught up</div>
          <p style={{ fontSize: 14, color: TOKENS.muted, maxWidth: 260, lineHeight: 1.5 }}>
            Complete a lesson and it will appear here to revisit.
          </p>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, color: TOKENS.muted, margin: '0 0 18px' }}>
            {reviewables.length} lesson{reviewables.length === 1 ? '' : 's'} ready to revisit.
          </p>
          <button onClick={() => open(reviewables[0])} style={{
            width: '100%', minHeight: 50, padding: '13px', background: TOKENS.teal, color: '#fff', border: 'none', borderRadius: 24,
            fontSize: 15.5, fontWeight: 600, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}>
            <RotateCcw size={17} /> Start review
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reviewables.map((r) => (
              <button key={r.key} onClick={() => open(r)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', textAlign: 'left',
                padding: '13px 15px', background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 13, cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500, color: TOKENS.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.lesson.title}</div>
                  <div style={{ fontSize: 12, color: TOKENS.muted, marginTop: 2 }}>{r.moduleTitle}</div>
                </div>
                <RotateCcw size={16} color={TOKENS.teal} style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
