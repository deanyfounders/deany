// Topics - active topics plus the full catalog. Adding never forces
// calibration; pausing keeps all progress.
import React, { useState } from 'react';
import { MoreVertical, Pause, Trash2 } from 'lucide-react';
import { D, TYPE, subjectOf } from '../tokens.js';
import { IconTile } from '../components.jsx';
import { CATALOG } from '../catalog.js';
import { getActiveTopics, topicProgress } from '../selectors.js';

export default function Topics({ state, deps, onOpenTopic, addTopic, pauseTopic, resumeTopic, removeTopic }) {
  const [menuId, setMenuId] = useState(null);
  const active = getActiveTopics(state);
  const activeSet = new Set(active);
  const nonActive = CATALOG.filter(c => !activeSet.has(c.id));
  const available = nonActive.filter(c => c.status !== 'coming_soon');
  const soon = nonActive.filter(c => c.status === 'coming_soon');

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
                <div key={id} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${D.border}` }}>
                  <button onClick={() => onOpenTopic(id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', padding: '14px 2px', cursor: 'pointer', textAlign: 'left', minHeight: 44, WebkitTapHighlightColor: 'transparent' }}>
                    <IconTile subjectId={id} size={40} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{s.name}</span>
                      <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1 }}>{prog.done} of {prog.total} lessons · {state.topics[id].level}</span>
                    </span>
                    <span style={{ fontSize: TYPE.body, fontWeight: 500, color: s.ink, flexShrink: 0 }}>{prog.pct}%</span>
                  </button>
                  <button onClick={() => setMenuId(menuId === id ? null : id)} aria-label="Topic options" style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.inkFaint, padding: 8, minHeight: 44, WebkitTapHighlightColor: 'transparent' }}><MoreVertical size={18} /></button>
                  {menuId === id && (
                    <>
                      <div onClick={() => setMenuId(null)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
                      <div style={{ position: 'absolute', top: 46, right: 2, zIndex: 31, background: D.card, border: `1px solid ${D.border}`, borderRadius: 12, overflow: 'hidden', minWidth: 168, boxShadow: '0 8px 24px rgba(15,42,52,0.14)' }}>
                        <button onClick={() => { pauseTopic(id); setMenuId(null); }} style={menuItem}><Pause size={16} color={D.inkSecondary} /> Pause topic</button>
                        <button onClick={() => { removeTopic(id); setMenuId(null); }} style={{ ...menuItem, color: '#B04A2C', borderTop: `1px solid ${D.border}` }}><Trash2 size={16} color="#B04A2C" /> Remove topic</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, margin: '0 2px 4px' }}>All topics</div>
      <div>
        {available.map(c => {
          const paused = state.topics[c.id] && !state.topics[c.id].active;
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 2px', borderBottom: `1px solid ${D.border}` }}>
              <IconTile subjectId={c.id} size={40} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{c.name}</span>
                <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.desc}</span>
              </span>
              {paused
                ? <button onClick={() => resumeTopic(c.id)} style={ghostBtn}>Resume</button>
                : <button onClick={() => addTopic(c.id)} style={ghostBtn}>Add</button>}
            </div>
          );
        })}
      </div>

      {soon.length > 0 && (
        <>
          <div style={{ fontSize: TYPE.meta, fontWeight: 500, color: D.inkHint, margin: '20px 2px 4px', letterSpacing: '0.3px' }}>Coming soon</div>
          <div>
            {soon.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 2px', borderBottom: `1px solid ${D.border}`, opacity: 0.6 }}>
                <IconTile subjectId={c.id} size={38} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{c.name}</span>
                  <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.desc}</span>
                </span>
                <span style={{ fontSize: TYPE.meta, color: D.inkFaint, flexShrink: 0 }}>Soon</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const ghostBtn = { flexShrink: 0, background: 'none', border: `1px solid ${D.border}`, borderRadius: 12, padding: '8px 16px', color: D.tealDeep, fontSize: TYPE.meta, fontWeight: 500, cursor: 'pointer', minHeight: 40, WebkitTapHighlightColor: 'transparent' };
const menuItem = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '13px 14px', fontSize: TYPE.body, color: D.ink, cursor: 'pointer', minHeight: 44, WebkitTapHighlightColor: 'transparent' };
