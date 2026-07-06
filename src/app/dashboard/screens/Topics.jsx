// Topics - active topics plus the full catalog. Adding never forces
// calibration; pausing keeps all progress.
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { D, TYPE, subjectOf } from '../tokens.js';
import { IconTile } from '../components.jsx';
import { CATALOG } from '../catalog.js';
import { getActiveTopics, topicProgress } from '../selectors.js';

export default function Topics({ state, deps, onOpenTopic, addTopic, pauseTopic, resumeTopic }) {
  const active = getActiveTopics(state);
  const activeSet = new Set(active);

  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 20px 24px' }}>
      <div style={{ fontSize: TYPE.screenTitle, fontWeight: 500, color: D.ink }}>Topics</div>
      <p style={{ fontSize: TYPE.body, color: D.inkSecondary, margin: '4px 0 18px' }}>Your active topics and everything else on DEANY</p>

      {active.length > 0 && (
        <>
          <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, margin: '0 2px 4px' }}>Active</div>
          <div style={{ marginBottom: 22 }}>
            {active.map(id => {
              const s = subjectOf(id);
              const prog = topicProgress(id, deps);
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${D.border}` }}>
                  <button onClick={() => onOpenTopic(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', padding: '14px 2px', cursor: 'pointer', textAlign: 'left', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>
                    <IconTile emoji={s.emoji} tint={s.tint} size={40} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{s.name}</span>
                      <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1 }}>{prog.done} of {prog.total} lessons · {s.short} · {state.topics[id].level}</span>
                    </span>
                    <span style={{ fontSize: TYPE.body, fontWeight: 500, color: s.ink, flexShrink: 0 }}>{prog.pct}%</span>
                  </button>
                  <button onClick={() => pauseTopic(id)} aria-label="Pause topic" style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.inkFaint, padding: 8, minHeight: 44, WebkitTapHighlightColor: 'transparent' }}><MoreVertical size={18} /></button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, margin: '0 2px 4px' }}>All topics</div>
      <div>
        {CATALOG.filter(c => !activeSet.has(c.id)).map(c => {
          const s = subjectOf(c.id);
          const paused = state.topics[c.id] && !state.topics[c.id].active;
          const soon = c.status === 'coming_soon';
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 2px', borderBottom: `1px solid ${D.border}`, opacity: soon ? 0.6 : 1 }}>
              <IconTile emoji={s.emoji} tint={s.tint} size={40} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{c.name}</span>
                <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.desc}</span>
              </span>
              {soon ? (
                <span style={{ fontSize: TYPE.meta, color: D.inkFaint, flexShrink: 0 }}>Soon</span>
              ) : paused ? (
                <button onClick={() => resumeTopic(c.id)} style={ghostBtn}>Resume</button>
              ) : (
                <button onClick={() => addTopic(c.id)} style={ghostBtn}>Add</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ghostBtn = { flexShrink: 0, background: 'none', border: `1px solid ${D.border}`, borderRadius: 12, padding: '8px 16px', color: D.tealDeep, fontSize: TYPE.meta, fontWeight: 500, cursor: 'pointer', minHeight: 40, WebkitTapHighlightColor: 'transparent' };
