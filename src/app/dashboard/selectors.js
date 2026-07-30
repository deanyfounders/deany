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

// Parse "5 min" / "15 min" -> 5. Falls back to 5.
const minutesOf = (d) => { const n = parseInt(String(d || '').replace(/[^0-9]/g, ''), 10); return Number.isFinite(n) && n > 0 ? n : 5; };

// Build the carousel slide model for one topic from real curriculum + progress.
// A "level" is a module. The four states (spec section 5) are derived, not stored.
export function buildTopicSlide(topicId, state, deps) {
  const mods = (deps?.modules?.[topicId] || []).filter((m) => (m.lessons || []).length);
  const done = (mod, i) => !!deps?.completedLessons?.[`${mod.id}-lesson-${i}`];
  const levels = mods.map((mod, mi) => {
    const lessons = (mod.lessons || []).map((l, i) => ({ id: `${mod.id}-lesson-${i}`, title: l.title, index: i + 1, minutes: minutesOf(l.duration), coins: l.coins ?? 15, lesson: l, idx: i, mod, done: done(mod, i) }));
    return { mod, mi, title: mod.title, lessons, total: lessons.length, complete: lessons.filter((x) => x.done).length };
  });
  const totalDone = levels.reduce((s, l) => s + l.complete, 0);
  const total = levels.reduce((s, l) => s + l.total, 0);

  // current level = first module with an incomplete lesson (else the last one)
  let cur = levels.find((l) => l.complete < l.total) || levels[levels.length - 1] || null;
  let slideState = 'untouched', current = null, next = null, rows = [];
  if (!cur || total === 0) {
    slideState = total === 0 ? 'untouched' : 'complete';
  } else if (totalDone >= total) {
    slideState = 'complete';
  } else {
    const firstInc = cur.lessons.find((x) => !x.done) || cur.lessons[0];
    const after = cur.lessons[firstInc.idx + 1] || null;
    current = firstInc; next = after;
    if (totalDone === 0) slideState = 'untouched';
    else if (cur.complete === 0) slideState = 'level_complete'; // finished prior level(s), new one starts
    else slideState = 'in_progress';
    rows = [firstInc, after].filter(Boolean);
  }
  if (slideState === 'untouched') rows = (cur ? cur.lessons.slice(0, 2) : []);

  const levelObj = cur || levels[0] || { mi: 0, title: '', lessons: [], total: 0, complete: 0 };
  return {
    id: topicId,
    level: levelObj.mi + 1,
    moduleTitle: levelObj.title,
    lessonCount: levelObj.total,
    lessonsComplete: levelObj.complete,
    totalDone, total,
    slideState, current, next, rows,
  };
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
