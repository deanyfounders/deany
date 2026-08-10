// Single source of truth for which lessons are currently open. Every lesson
// list (dashboard PathLessons, ModuleOverview) and every launch path must gate
// on this, or a "locked" lesson stays reachable from one of the UIs.
export const UNLOCKED_LESSON_IDS = new Set([
  'arabia-before-islam', // Islamic history, lesson 2
  'lesson-1-3',          // Islamic finance, lesson 3 (Riba, Gharar, Maysir)
  'hifz-fatiha',         // Quran memorisation - Surah Al-Fatiha
  's2-l2',               // Salah, lesson 2 (Before You Pray)
]);

export const isLessonUnlocked = (idOrLesson) =>
  UNLOCKED_LESSON_IDS.has(typeof idOrLesson === 'string' ? idOrLesson : idOrLesson?.id);
