// Review - the SRS engine surfaced as a destination.
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { D, TYPE, subjectOf } from '../tokens.js';
import { Card, StatBlock, IconTile } from '../components.jsx';
import { getDueReviews, getReviewStats, getActiveTopics } from '../selectors.js';

function rel(iso, now) {
  const t = new Date(iso).getTime(); const diff = t - now; const abs = Math.abs(diff);
  const h = Math.round(abs / 3600000); const d = Math.round(abs / 86400000);
  const unit = abs < 86400000 ? (h <= 1 ? '1 hour' : `${h} hours`) : (d <= 1 ? '1 day' : `${d} days`);
  return diff <= 0 ? `${unit} ago` : `in ${unit}`;
}

export default function Review({ state, onGoTab, onSelectLesson, resolveLesson }) {
  const now = Date.now();
  const due = getDueReviews(state, now);
  const stats = getReviewStats(state, now);
  const items = state.review?.items || [];
  const active = getActiveTopics(state);
  const nDue = due.length;

  // Empty state - no items ever
  if (items.length === 0) {
    return (
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 20px 24px' }}>
        <div style={{ fontSize: TYPE.screenTitle, fontWeight: 500, color: D.ink, marginBottom: 40 }}>Review</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 20px' }}>
          <RefreshCw size={28} color={D.disabled} />
          <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, margin: '14px 0 6px' }}>Nothing to review yet</div>
          <p style={{ fontSize: TYPE.body, color: D.inkSecondary, maxWidth: 260, lineHeight: 1.5, margin: '0 0 20px' }}>Finish your first lesson and it shows up here tomorrow.</p>
          <button onClick={() => onGoTab('home')} style={{ background: 'none', border: `1px solid ${D.border}`, borderRadius: 16, padding: '11px 20px', color: D.tealDeep, fontSize: TYPE.body, fontWeight: 500, cursor: 'pointer', minHeight: 44 }}>Go to Home</button>
        </div>
      </div>
    );
  }

  const nextDue = [...items].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt)).find(i => new Date(i.dueAt).getTime() > now);
  const start = () => { if (due[0]) { const l = resolveLesson?.(due[0]); if (l) onSelectLesson?.(l.lesson, l.idx, l.mod); } };

  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 20px 24px' }}>
      <div style={{ fontSize: TYPE.screenTitle, fontWeight: 500, color: D.ink, marginBottom: 14 }}>Review</div>

      <div style={{ fontSize: TYPE.dueHeadline, fontWeight: 500, color: D.ink }}>{nDue > 0 ? `${nDue} due now` : 'All caught up'}</div>
      <div style={{ fontSize: TYPE.meta, color: D.inkHint, marginTop: 3, marginBottom: 16 }}>
        {nDue > 0 ? `Oldest item: ${rel(due[0].dueAt, now)}` : nextDue ? `Next batch: ${rel(nextDue.dueAt, now)}` : 'You are all set'}
      </div>

      <button onClick={start} style={{
        width: '100%', minHeight: 48, padding: 14, borderRadius: 16, border: 'none', fontSize: TYPE.body, fontWeight: 500, marginBottom: 20,
        background: nDue > 0 ? D.teal : D.border, color: nDue > 0 ? '#fff' : D.inkFaint, cursor: 'pointer', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
      }}>Start mixed session</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        <Card style={{ padding: '14px 12px' }}><StatBlock label="Mastered" value={stats.mastered} /></Card>
        <Card style={{ padding: '14px 12px' }}><StatBlock label="Due tomorrow" value={stats.dueTomorrow} /></Card>
        <Card style={{ padding: '14px 12px' }}><StatBlock label="Longest held" value={stats.longestHeldDays ? `${stats.longestHeldDays}d` : '0'} /></Card>
      </div>

      <div style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink, margin: '0 2px 6px' }}>By topic</div>
      <div>
        {active.map(id => {
          const n = due.filter(i => i.topicId === id).length;
          const s = subjectOf(id);
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 2px', borderBottom: `1px solid ${D.border}` }}>
              <IconTile emoji={s.emoji} tint={s.tint} size={36} />
              <span style={{ flex: 1, fontSize: TYPE.body, color: D.ink }}>{s.name}</span>
              <span style={{ fontSize: TYPE.body, fontWeight: 500, color: n > 0 ? s.ink : D.inkFaint }}>{n > 0 ? `${n} due` : '0'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
