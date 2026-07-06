// Home - one decision for the user. The hero is driven only by
// getContinueTarget; nothing else decides what it shows.
import React, { useState, useEffect } from 'react';
import { D, TYPE, subjectOf } from '../tokens.js';
import { StatPill, GoalBar, HeroContinueCard, ReviewDueCard, TopicMiniCard, ExploreCard, SectionHeading } from '../components.jsx';
import { getContinueTarget, getActiveTopics, topicProgress, getDueReviews } from '../selectors.js';
import { haptic } from '../motion.jsx';
import AyahCard from '../AyahCard.jsx';

// Entrance stagger runs once per app open, not on every tab switch.
let homeEntered = false;

export default function Home({ name, state, deps, coins, streak, onOpenTopic, onGoTab, onSelectLesson }) {
  const [firstOpen] = useState(() => { const v = !homeEntered; homeEntered = true; return v; });
  const now = Date.now();
  const target = getContinueTarget(state, deps, now);
  const due = getDueReviews(state, now);
  const hasEverReviewed = (state.review?.items || []).length > 0;
  const goal = state.goal || { minutesToday: 0, dailyMinutes: 5 };
  const goalMet = (goal.minutesToday || 0) > 0 && (goal.minutesToday || 0) >= (goal.dailyMinutes || 5);
  useEffect(() => { if (firstOpen && goalMet) haptic(); /* eslint-disable-next-line */ }, []);
  const riseD = (i) => (firstOpen ? `${i * 50}ms` : undefined);
  const riseC = firstOpen ? 'dash-rise' : undefined;

  // topics ordered by recent activity then onboarding order, max 4
  const active = getActiveTopics(state)
    .sort((a, b) => new Date(state.topics[b].lastActiveAt || 0) - new Date(state.topics[a].lastActiveAt || 0)
      || (state.topics[a].order || 0) - (state.topics[b].order || 0));
  const gridTopics = active.slice(0, 4);
  const showExplore = active.length <= 3;
  const totalDone = active.reduce((sum, id) => sum + topicProgress(id, deps).done, 0);
  const levelLabel = `Explorer · Lv ${Math.floor(totalDone / 3) + 1}`;
  const minutes = goal.minutesToday || 0;

  // Hero content from target
  let hero;
  if (target.type === 'review') {
    const m = Math.ceil(due.length / 4);
    hero = <HeroContinueCard variant="review" accent={D.gold} eyebrow="Keep it fresh" title="Review first" meta={`${due.length} items · about ${m} min`} progressPct={1} buttonLabel="Review" onPress={() => onGoTab('review')} />;
  } else if (target.type === 'explore') {
    hero = <HeroContinueCard accent={D.teal} eyebrow="Something new" title="Pick something new" meta="Add a topic to keep going" progressPct={1} buttonLabel="Explore" onPress={() => onGoTab('topics')} />;
  } else {
    const s = subjectOf(target.topicId);
    const prog = topicProgress(target.topicId, deps);
    const n = prog.next;
    hero = (
      <HeroContinueCard
        subjectId={target.topicId}
        accent={s.accent}
        eyebrow={`${s.short} · Lesson ${prog.done + 1} of ${prog.total}`}
        title={n ? n.lesson.title : s.name}
        meta={n ? `${n.mod.title} · ${n.lesson.duration || '5 min'}` : undefined}
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
      <div className={riseC} style={{ animationDelay: riseD(0), marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 19, fontWeight: 500, color: D.ink, minWidth: 0 }}>{name ? `Salam, ${name}` : 'Salam'} <span style={{ fontSize: 17 }}>{'\u{1F44B}'}</span></div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <StatPill kind="streak" value={streak} pop={firstOpen && goalMet} />
            <StatPill kind="coins" value={coins} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: D.levelChip.ink, background: D.levelChip.bg, borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>{levelLabel}</span>
          {minutes > 0
            ? <GoalBar value={minutes} max={goal.dailyMinutes} width={90} label={`${minutes} of ${goal.dailyMinutes} min today`} />
            : <span style={{ fontSize: 11, color: D.inkHint }}>First lesson starts your streak</span>}
        </div>
      </div>

      <div className={riseC} style={{ animationDelay: riseD(1) }}>{hero}</div>
      {reviewCard && <div className={riseC} style={{ animationDelay: riseD(2), marginTop: 10 }}>{reviewCard}</div>}
      <div className={riseC} style={{ animationDelay: riseD(3), marginTop: 10 }}><AyahCard /></div>

      <div className={riseC} style={{ animationDelay: riseD(4), marginTop: 16 }}>
        <SectionHeading action={<button onClick={() => onGoTab('topics')} style={{ background: 'none', border: 'none', color: D.tealDeep, fontSize: TYPE.meta, fontWeight: 500, cursor: 'pointer' }}>Add topic</button>}>Your topics</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {gridTopics.map((id, i) => {
            const prog = topicProgress(id, deps);
            return <TopicMiniCard key={id} topicId={id} name={subjectOf(id).name} progressPct={prog.pct} nextTitle={prog.next?.lesson.title} tilt={i % 2 === 0 ? 5 : -5} onPress={() => onOpenTopic(id)} />;
          })}
        </div>
        {showExplore && <div style={{ marginTop: 10 }}><ExploreCard onPress={() => onGoTab('topics')} /></div>}
      </div>
    </div>
  );
}
