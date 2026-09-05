// Single source of truth for which lessons are currently open. Every lesson
// list (dashboard PathLessons, ModuleOverview) and every launch path must gate
// on this, or a "locked" lesson stays reachable from one of the UIs.
//
// MVP stage: all lessons are locked. Deany does not yet meet the regulatory
// requirements to publish Islamic educational content, so every lesson renders
// locked and a tap shows the note below (see LockedLessonNote.jsx). To reopen a
// lesson later, add its id back to this set.
export const UNLOCKED_LESSON_IDS = new Set([]);

export const isLessonUnlocked = (idOrLesson) =>
  UNLOCKED_LESSON_IDS.has(typeof idOrLesson === 'string' ? idOrLesson : idOrLesson?.id);

// Fired when a learner taps a locked lesson. A single global listener
// (LockedLessonNote) renders the explanatory note, so no UI needs to thread a
// handler down through props.
export const LOCKED_LESSON_EVENT = 'deany:locked-lesson';

export function notifyLockedLesson() {
  try { window.dispatchEvent(new CustomEvent(LOCKED_LESSON_EVENT)); } catch (_) { /* SSR / no window */ }
}
