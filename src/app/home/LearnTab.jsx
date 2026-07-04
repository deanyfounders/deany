// Learn tab - status strip, continue card, and the vertical lesson path.
import React, { useMemo } from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import { TOKENS } from '../shared/AppScreen.jsx';
import PathNode from './PathNode.jsx';
import { buildPath } from './pathData.js';

const serif = 'Georgia, serif';

export default function LearnTab({ dailyStreak, level, mainTopics, modules, completedLessons, onSelectLesson, onGoReview }) {
  const { nodes, continueNode, doneCount } = useMemo(
    () => buildPath(mainTopics, modules, completedLessons),
    [mainTopics, modules, completedLessons]
  );

  const openLesson = (n) => n && onSelectLesson?.(n.lesson, n.idx, n.mod);

  return (
    <div>
      {/* Status strip */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'calc(env(safe-area-inset-top) + 16px) 20px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: 'rgba(240,180,41,0.15)', borderRadius: 20 }}>
          <span style={{ display: 'inline-flex', animation: 'deanyFlame 2s ease-in-out infinite' }}><Flame size={16} color={TOKENS.gold} /></span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#B07D08' }}>{dailyStreak}</span>
          <span style={{ fontSize: 12.5, color: '#B07D08' }}>day streak</span>
        </div>
        <button onClick={onGoReview} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(34,163,154,0.12)',
          border: 'none', borderRadius: 20, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TOKENS.tealDeep }}>{doneCount} to review</span>
        </button>
      </div>

      {/* Continue card */}
      {continueNode && (
        <div style={{ padding: '4px 18px 8px' }}>
          <div style={{ background: '#fff', border: `1px solid ${TOKENS.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 18px rgba(15,76,92,0.10)' }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${TOKENS.teal}, ${TOKENS.gold})` }} />
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: TOKENS.teal, fontWeight: 600, marginBottom: 5 }}>
                Continue · {continueNode.moduleTitle}
              </div>
              <div style={{ fontFamily: serif, fontSize: 18, fontWeight: 500, color: TOKENS.tealDeep, lineHeight: 1.3, marginBottom: 12 }}>
                {continueNode.lesson.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(34,163,154,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.round((doneCount / Math.max(nodes.length, 1)) * 100)}%`, height: '100%', background: TOKENS.gold, borderRadius: 3 }} />
                </div>
                <button onClick={() => openLesson(continueNode)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: TOKENS.teal, color: '#fff',
                  border: 'none', borderRadius: 22, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', minHeight: 44,
                  WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', flexShrink: 0,
                }}>
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vertical path */}
      <div style={{ padding: '14px 18px 8px' }}>
        {nodes.map((n, i) => {
          const showHeader = n.firstOfModule;
          const offset = (i % 2 === 0) ? -34 : 34;
          return (
            <div key={n.key}>
              {showHeader && (
                <div style={{
                  textAlign: 'center', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
                  color: 'rgba(27,42,74,0.45)', fontWeight: 700, margin: i === 0 ? '6px 0 2px' : '20px 0 2px',
                }}>{n.moduleTitle}</div>
              )}
              <PathNode
                state={n.state}
                title={n.state === 'current' ? n.lesson.title : ''}
                subtitle={String(n.idx + 1)}
                accent={n.accent}
                offset={n.state === 'current' ? 0 : offset}
                showConnector={i !== 0}
                onClick={() => openLesson(n)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
