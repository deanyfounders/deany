// SRS scheduler v1 - minimal fixed-interval spaced repetition.
// Items never leave the queue (matching the retention promise): passing caps
// at the last interval, failing resets to the first and counts a lapse.
export const INTERVALS = [1, 3, 7, 14, 30, 90]; // days
const DAY = 86400000;
const iso = (ms) => new Date(ms).toISOString();

export function reviewId(topicId, lessonId) { return `${topicId}::${lessonId}`; }

// Enqueue a lesson's review at interval index 0 (due tomorrow). No duplicates.
export function enqueue(items, topicId, lessonId, now) {
  const id = reviewId(topicId, lessonId);
  if (items.some(i => i.id === id)) return items;
  return [...items, { id, topicId, lessonId, dueAt: iso(now + INTERVALS[0] * DAY), intervalIndex: 0, lapses: 0 }];
}

export function passItem(item, now) {
  const idx = Math.min(item.intervalIndex + 1, INTERVALS.length - 1);
  return { ...item, intervalIndex: idx, dueAt: iso(now + INTERVALS[idx] * DAY) };
}

export function failItem(item, now) {
  return { ...item, intervalIndex: 0, lapses: item.lapses + 1, dueAt: iso(now + INTERVALS[0] * DAY) };
}
