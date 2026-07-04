// Derives the vertical lesson path, the continue-target, and the review list
// from the existing curriculum data (mainTopics + modules + completedLessons).
// Pure - no side effects. Lesson completion key matches the app convention:
//   `${mod.id}-lesson-${i}`
import { TOKENS } from '../shared/AppScreen.jsx';

const HISTORY_ACCENT = '#E06A45';

export function buildPath(mainTopics = [], modules = {}, completedLessons = {}) {
  const flat = []; // { topic, mod, lesson, idx, key, accent, moduleTitle, firstOfModule }
  for (const topic of mainTopics) {
    const mods = modules[topic.id] || [];
    for (const mod of mods) {
      const lessons = mod.lessons || [];
      if (!lessons.length) continue;
      const accent = topic.id === 'islamic-history' ? HISTORY_ACCENT : TOKENS.teal;
      lessons.forEach((lesson, idx) => {
        flat.push({
          topic, mod, lesson, idx,
          key: `${mod.id}-lesson-${idx}`,
          accent, moduleTitle: mod.title,
          firstOfModule: idx === 0,
        });
      });
    }
  }

  const isDone = (n) => !!completedLessons[n.key];
  const currentIndex = flat.findIndex(n => !isDone(n));

  const nodes = flat.map((n, i) => ({
    ...n,
    state: isDone(n) ? 'done' : i === currentIndex ? 'current' : 'locked',
  }));

  const continueNode = currentIndex >= 0 ? flat[currentIndex] : flat[flat.length - 1] || null;
  const reviewables = flat.filter(isDone);

  return { nodes, continueNode, reviewables, total: flat.length, doneCount: reviewables.length };
}
