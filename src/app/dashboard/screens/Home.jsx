// Home - one decision for the user. The hero is driven only by
// getContinueTarget; nothing else decides what it shows.
import React from 'react';
import { D, TYPE, subjectOf } from '../tokens.js';
import { StatPill, GoalBar, HeroContinueCard, ReviewDueCard, TopicMiniCard, ExploreCard, SectionHeading } from '../components.jsx';
import { getContinueTarget, getActiveTopics, topicProgress, getDueReviews } from '../selectors.js';

export default function Home({ name, state, deps, coins, streak, onOpenTopic, onGoTab, onSelectLesson }) {
  const now = Date.now();
  const target = getContinueTarget(state, deps, now);
  const due = getDueReviews(state, now);
  const hasEverReviewed = (state.review?.items || []).length > 0;
  const goal = state.goal || { minutesToday: 0, dailyMinutes: 5 };

  // topics ordered by recent activity then onboarding order, max 4
  const active = getActiveTopics(state)
    .sort((a, b) => new Date(state.topics[b].lastActiveAt || 0) - new Date(state.topics[a].lastActiveAt || 0)
      || (state.topics[a].order || 0) - (state.topics[b].order || 0));
  const gridTopics = active.slice(0, 4);
  const showExplore = active.length <= 3;

  // Hero content from target
  let hero;
  if (target.type === 'review') {
    const m = Math.ceil(due.length / 4);
    hero = <HeroContinueCard variant="review" accent={D.gold} eyebrow="Keep it fresh" title="Review first" meta={`${due.length} items · about ${m} min`} buttonLabel="Review" onPress={() => onGoTab('review')} />;
  } else if (target.type === 'explore') {
    hero = <HeroContinueCard eyebrow="Something new" title="Pick something new" buttonLabel="Explore" onPress={() => onGoTab('topics')} />;
  } else {
    const s = subjectOf(target.topicId);
    const prog = topicProgress(target.topicId, deps);
    const n = prog.next;
    hero = (
      <HeroContinueCard
        accent={s.accent}
        eyebrow={s.short}
        title={n ? n.lesson.title : s.name}
        meta={n ? n.mod.title : undefined}
        progressPct={prog.pct}
        buttonLabel={prog.done > 0 ? 'Continue' : 'Start'}
        onPress={() => n && onSelectLesson?.(n.lesson, n.idx, n.mod)}
      />
    );
  }

  // Review card visibility
  let reviewCard = null;
  if (target.type !== 'review' && hasEverReviewed) {
    reviewCard = due.length === 0
      ? <ReviewDueCard caughtUp dueTomorrow={(state.review.items || []).filter(i => { const t = new Date(i.dueAt).getTime(); return t > now && t <= now + 86400000; }).length} onPress={() => onGoTab('review')} />
      : <ReviewDueCard count={due.length} minutes={Math.ceil(due.length / 4)} onPress={() => onGoTab('review')} />;
  }

  return (
    <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 20px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: TYPE.screenTitle, fontWeight: 500, color: D.ink, marginBottom: 8 }}>{name ? `Salam, ${name}` : 'Salam'}</div>
          <GoalBar value={goal.minutesToday} max={goal.dailyMinutes} width={90} label={`${goal.minutesToday} of ${goal.dailyMinutes} min today`} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <StatPill kind="streak" value={streak} />
          <StatPill kind="coins" value={coins} />
        </div>
      </div>

      {hero}
      {reviewCard && <div style={{ marginTop: 10 }}>{reviewCard}</div>}

      <div style={{ marginTop: 16 }}>
        <SectionHeading action={<button onClick={() => onGoTab('topics')} style={{ background: 'none', border: 'none', color: D.tealDeep, fontSize: TYPE.meta, fontWeight: 500, cursor: 'pointer' }}>Add topic</button>}>Your topics</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {gridTopics.map(id => {
            const prog = topicProgress(id, deps);
            return <TopicMiniCard key={id} topicId={id} name={subjectOf(id).name} progressPct={prog.pct} nextTitle={prog.next?.lesson.title} onPress={() => onOpenTopic(id)} />;
          })}
          {showExplore && <ExploreCard onPress={() => onGoTab('topics')} />}
        </div>
      </div>
    </div>
  );
}
