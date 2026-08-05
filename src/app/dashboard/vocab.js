// Read-only view over the Quranic Core Words vocab SRS (the RootWordsModule's own
// localStorage store) so the dashboard can surface real vocab state: new-word
// batches, most-missed words, and ayat whose every word the learner now knows.
// Never writes the store (only markAyahShown, a separate dashboard-owned key).
import moduleData from '../quran/corewords/module1-data.json';

const VOCAB_KEY = 'deany_rootwords_module1_progress_v1';
const SHOWN_KEY = 'deany_dashboard_understood_ayat_v1';
const BATCH = 5;

export function readVocab() {
  if (typeof window === 'undefined') return {};
  try { const raw = window.localStorage.getItem(VOCAB_KEY); return raw ? JSON.parse(raw) : {}; }
  catch (_) { return {}; }
}

// Flat words with ids, mirroring the module's buildRootsWithIds/flattenWords exactly.
export const VOCAB_WORDS = (() => {
  const flat = [];
  (moduleData.roots || []).forEach((r) => {
    (r.words || []).forEach((w, i) => flat.push({ ...w, id: `${r.id}-${i}`, rootId: r.id }));
  });
  return flat;
})();

// Ayah ref (e.g. "2:3") -> the module word ids that belong to it. Only numeric
// surah:ayah refs (the isti'adhah words carry no ayah and are skipped).
export const AYAH_WORDS = (() => {
  const m = {};
  VOCAB_WORDS.forEach((w) => {
    if (!/^\d+:\d+$/.test(w.ref || '')) return;
    (m[w.ref] = m[w.ref] || []).push(w.id);
  });
  return m;
})();

function learnedIdSet(progress) {
  const s = new Set();
  VOCAB_WORDS.forEach((w) => { const e = progress[w.id]; if (e && e.stage > 0) s.add(w.id); });
  return s;
}

// New-word batch available to learn next (words never started).
export function vocabStats(progress) {
  const total = VOCAB_WORDS.length;
  const started = VOCAB_WORDS.filter((w) => progress[w.id] && progress[w.id].stage > 0).length;
  const newCount = total - started;
  return { total, started, newCount, nextBatch: Math.min(BATCH, newCount) };
}

// The learner's most-missed words (miss counter recorded by the review tab), top n.
export function missedWords(progress, n = 3) {
  return VOCAB_WORDS
    .map((w) => ({ ...w, miss: (progress[w.id] && progress[w.id].miss) || 0 }))
    .filter((w) => w.miss > 0)
    .sort((a, b) => b.miss - a.miss || a.id.localeCompare(b.id))
    .slice(0, n);
}

// Ayat whose EVERY module word the learner has learned (stage > 0).
export function coveredAyat(progress) {
  const learned = learnedIdSet(progress);
  return Object.keys(AYAH_WORDS).filter((ref) => {
    const ids = AYAH_WORDS[ref];
    return ids.length > 0 && ids.every((id) => learned.has(id));
  });
}

function readShownAyat() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(SHOWN_KEY) || '[]'); } catch (_) { return []; }
}

export function markAyahShown(ref) {
  if (typeof window === 'undefined') return;
  try {
    const cur = readShownAyat();
    if (!cur.includes(ref)) window.localStorage.setItem(SHOWN_KEY, JSON.stringify([...cur, ref]));
  } catch (_) { /* storage unavailable */ }
}

// The first fully-covered ayah the learner has NOT been shown before, or null.
// Verse text itself is fetched by the card from the verified /quran source; here we
// only decide which ayah qualifies, from word coverage.
export function nextUnderstoodAyah(progress) {
  const shown = new Set(readShownAyat());
  const ref = coveredAyat(progress).find((r) => !shown.has(r));
  if (!ref) return null;
  const [surah, ayah] = ref.split(':').map(Number);
  return { ref, surah, ayah, wordCount: AYAH_WORDS[ref].length };
}
