// Pure, unit-testable selectors over dashboard state. Lesson-derived facts
// (progress, next lesson) come from the content layer passed in as `deps`:
//   deps = { modules: { [topicId]: Module[] }, completedLessons: {} }
import { INTERVALS } from './srs.js';

const DAY = 86400000;

// Merge a topic's dashboard meta with live curriculum progress.
export function topicProgress(topicId, deps) {
  const mods = (deps?.modules?.[topicId] || []).filter(m => (m.lessons || []).length);
  let total = 0, done = 0, next = null;
  for (const mod of mods) {
    (mod.lessons || []).forEach((lesson, i) => {
      total++;
      const key = `${mod.id}-lesson-${i}`;
      if (deps?.completedLessons?.[key]) done++;
      else if (!next) next = { lesson, idx: i, mod, key };
    });
  }
  return { total, done, remaining: total - done, pct: total ? Math.round((done / total) * 100) : 0, next };
}

export function getActiveTopics(state) {
  const topics = state.topics || {};
  return Object.keys(topics).filter(id => topics[id].active)
    .sort((a, b) => (topics[a].order || 0) - (topics[b].order || 0));
}

export function getDueReviews(state, now) {
  return (state.review?.items || [])
    .filter(i => new Date(i.dueAt).getTime() <= now)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function getReviewStats(state, now) {
  const items = state.review?.items || [];
  const mastered = items.filter(i => i.intervalIndex >= 4).length;
  const dueTomorrow = items.filter(i => { const t = new Date(i.dueAt).getTime(); return t > now && t <= now + DAY; }).length;
  const maxIdx = items.reduce((m, i) => Math.max(m, i.intervalIndex), -1);
  return { mastered, dueTomorrow, longestHeldDays: maxIdx >= 0 ? INTERVALS[maxIdx] : 0 };
}

export function getHomeBadges(state, now) {
  return { reviewDot: getDueReviews(state, now).length > 0 };
}

// Deterministic - the only place that decides what the hero shows.
export function getContinueTarget(state, deps, now) {
  if (getDueReviews(state, now).length >= 5) return { type: 'review' };

  const active = getActiveTopics(state);
  const withNext = active
    .map(id => ({ id, meta: state.topics[id], prog: topicProgress(id, deps) }))
    .filter(t => t.prog.next);

  // 2. most recently active topic that still has a next lesson
  const recent = withNext.filter(t => t.meta.lastActiveAt)
    .sort((a, b) => new Date(b.meta.lastActiveAt).getTime() - new Date(a.meta.lastActiveAt).getTime());
  if (recent.length) return { type: 'lesson', topicId: recent[0].id };

  // 3. highest calibrated tier with lessons remaining; tie-break onboarding order
  if (withNext.length) {
    const byTier = [...withNext].sort((a, b) => (b.meta.tier || 0) - (a.meta.tier || 0) || (a.meta.order || 0) - (b.meta.order || 0));
    return { type: 'lesson', topicId: byTier[0].id };
  }

  // 4. every active topic complete
  return { type: 'explore' };
}
