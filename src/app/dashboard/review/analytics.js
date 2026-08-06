// Review-screen analytics, derived from real SRS state + a lightweight per-review
// log (schema prereq 1). Everything degrades honestly: cards that need data the app
// does not have yet return null/zero so the screen hides or shows a rest state
// rather than inventing numbers. No vocabulary is ever surfaced as a word count.
import { readVocab, VOCAB_WORDS, AYAH_WORDS, missedWords } from '../vocab.js';
import { getDueReviews } from '../selectors.js';
import { INTERVALS } from '../srs.js';

const DAY = 86400000;
const LOG_KEY = 'deany.reviewlog.v1';
const CAP_KEY = 'deany.caps.v1'; // { [capId]: firstEarnedTs }

/* ---------- per-review log (item id, type, result, timestamp) ---------- */
export function readLog() { if (typeof window === 'undefined') return []; try { return JSON.parse(window.localStorage.getItem(LOG_KEY) || '[]'); } catch (_) { return []; } }
export function logReview(id, type, passed) {
  if (typeof window === 'undefined') return;
  try { const l = readLog(); l.push({ id, type, result: passed ? 'pass' : 'fail', ts: Date.now() }); window.localStorage.setItem(LOG_KEY, JSON.stringify(l.slice(-3000))); } catch (_) {}
}

/* ---------- vocab SRS helpers (root words) ---------- */
const vocabDueCount = (v, now) => VOCAB_WORDS.filter((w) => { const e = v[w.id]; return e && e.stage > 0 && e.stage < 9 && (e.dueAt || 0) <= now; }).length;
const vocabMasteredIds = (v) => new Set(VOCAB_WORDS.filter((w) => (v[w.id]?.stage || 0) >= 9).map((w) => w.id));
const familiarIdSet = (v) => new Set(VOCAB_WORDS.filter((w) => (v[w.id]?.stage || 0) >= 5).map((w) => w.id)); // familiar or above

/* ---------- 2. due split ---------- */
// memorisation (hifz) has no SRS yet -> always 0 (still rendered per the spec).
export function dueSplit(state, deps, now) {
  const v = readVocab();
  const rootWords = vocabDueCount(v, now);
  const lessonPractice = getDueReviews(state, now).length; // concept reviews
  const memorisation = 0;
  const total = memorisation + rootWords + lessonPractice;
  return { memorisation, rootWords, lessonPractice, total, minutes: Math.max(1, Math.round(total * 0.5)) };
}

/* ---------- 5. coming up: 7-day forecast from next-due timestamps ---------- */
export function forecast(state, now) {
  const v = readVocab();
  const dueTs = [];
  (state.review?.items || []).forEach((i) => dueTs.push(new Date(i.dueAt).getTime()));
  VOCAB_WORDS.forEach((w) => { const e = v[w.id]; if (e && e.stage > 0 && e.stage < 9 && Number.isFinite(e.dueAt)) dueTs.push(e.dueAt); });
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const days = [];
  for (let k = 0; k < 7; k++) {
    const d0 = start.getTime() + k * DAY, d1 = d0 + DAY;
    const count = dueTs.filter((t) => t >= d0 && t < d1).length;
    days.push({ label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(d0)), count, isToday: k === 0 });
  }
  const counts = days.map((d) => d.count);
  const max = Math.max(1, ...counts);
  const mean = counts.reduce((a, b) => a + b, 0) / 7;
  const heavy = days[counts.indexOf(Math.max(...counts))];
  return { days, max, mean, heavy };
}

/* ---------- 3. week stats + 4. time of day (from the review log) ---------- */
export function weekStats(state, now) {
  const log = readLog().filter((e) => e.ts >= now - 7 * DAY);
  const reviews = log.length;
  const passes = log.filter((e) => e.result === 'pass').length;
  const accuracy = reviews ? Math.round((passes / reviews) * 100) : 0;
  const masteredNow = new Set([...vocabMasteredIds(readVocab()), ...((state.review?.items || []).filter((i) => i.intervalIndex >= INTERVALS.length - 1).map((i) => i.id))]);
  const mastered = new Set(log.map((e) => e.id).filter((id) => masteredNow.has(id))).size;
  return { reviews, accuracy, mastered };
}

const SLOTS = [ { key: 'Fajr', lo: 3, hi: 9 }, { key: 'Midday', lo: 9, hi: 15 }, { key: 'Evening', lo: 15, hi: 20 }, { key: 'Night', lo: 20, hi: 27 } ];
const slotOf = (h) => { const hh = h < 3 ? h + 24 : h; return SLOTS.find((s) => hh >= s.lo && hh < s.hi) || SLOTS[3]; };
// Returns { bars:[{key,pct}], strongest, weakest } or null if below the noise floor.
export function timeOfDay(now) {
  const log = readLog().filter((e) => e.ts >= now - 30 * DAY);
  if (log.length < 60) return null;
  const agg = {}; SLOTS.forEach((s) => (agg[s.key] = { pass: 0, total: 0 }));
  log.forEach((e) => { const k = slotOf(new Date(e.ts).getHours()).key; agg[k].total++; if (e.result === 'pass') agg[k].pass++; });
  const active = SLOTS.filter((s) => agg[s.key].total > 0);
  if (active.length < 2) return null;
  const bars = SLOTS.map((s) => ({ key: s.key, pct: agg[s.key].total ? Math.round((agg[s.key].pass / agg[s.key].total) * 100) : 0 }));
  const withData = bars.filter((b) => agg[b.key].total > 0);
  const strongest = withData.reduce((a, b) => (b.pct > a.pct ? b : a));
  const weakest = withData.reduce((a, b) => (b.pct < a.pct ? b : a));
  return { bars, strongest, weakest };
}

/* ---------- 6. capabilities ----------
   Understanding: an ayah whose every word is familiar+ -> "Understand {passage} as
   you read it". Hifz needs a passage->ayat map that does not exist yet (omitted).
   Lesson-concept sentences are pending_mehdi copy (omitted until approved). */
function surahName(surah) { return ({ 1: 'Al-Fatihah', 2: 'Al-Baqarah' })[surah] || `Surah ${surah}`; }
function capsEarned() { if (typeof window === 'undefined') return {}; try { return JSON.parse(window.localStorage.getItem(CAP_KEY) || '{}'); } catch (_) { return {}; } }
function markCap(id) { if (typeof window === 'undefined') return; try { const c = capsEarned(); if (!c[id]) { c[id] = Date.now(); window.localStorage.setItem(CAP_KEY, JSON.stringify(c)); } } catch (_) {} }

export function capabilities(now) {
  const v = readVocab();
  const fam = familiarIdSet(v);
  const rows = [];
  Object.keys(AYAH_WORDS).forEach((ref) => {
    const ids = AYAH_WORDS[ref];
    if (ids.length && ids.every((id) => fam.has(id))) {
      const [s, a] = ref.split(':').map(Number);
      const capId = `understand:${ref}`;
      markCap(capId);
      rows.push({ id: capId, area: 'quran-arabic', text: `Understand ${surahName(s)} ${s}:${a} as you read it`, source: 'Qur\'an and Arabic', ts: capsEarned()[capId] || now });
    }
  });
  // most recently earned first, cap 5, one per area for coverage (only quran-arabic here)
  rows.sort((x, y) => (y.ts || 0) - (x.ts || 0));
  const earned = capsEarned();
  const growth = Object.values(earned).filter((ts) => ts >= now - 7 * DAY).length;
  return { rows: rows.slice(0, 5), growth };
}

/* ---------- 7. needs attention (most missed across item types) ---------- */
const AREA_TAG = {
  'root-words': { label: 'Root words', tint: '#E2E6F2', tone: '#1B2A4A' },
  'islamic-finance': { label: 'Finance', tint: '#FCEBC9', tone: '#8A5E10' },
  'islamic-history': { label: 'History', tint: '#FCE7DE', tone: '#E06A45' },
  'quran-arabic': { label: 'Qur\'an', tint: '#D9F1EB', tone: '#0F6E56' },
  '5-pillars': { label: '5 Pillars', tint: '#D9F1EB', tone: '#0F6E56' },
};
const missNote = (n) => (n === 2 ? 'stumbled twice' : `${n} misses`);
export function needsAttention(state, deps, now) {
  const out = [];
  // vocab misses (root words) - Arabic word, never a word count
  missedWords(readVocab(), 3).forEach((w) => out.push({ key: `v:${w.id}`, ar: w.ar, area: 'root-words', misses: w.miss }));
  // concept lapses (lessons) - resolve the lesson name + its topic area
  (state.review?.items || []).filter((i) => (i.lapses || 0) > 0).forEach((i) => {
    let name = null;
    for (const mod of (deps?.modules?.[i.topicId] || [])) { (mod.lessons || []).forEach((l, k) => { if (`${mod.id}-lesson-${k}` === i.lessonId) name = l.title; }); }
    if (name) out.push({ key: `c:${i.id}`, name, area: i.topicId, misses: i.lapses, item: i });
  });
  // one per area, most-missed first, max 3
  out.sort((a, b) => b.misses - a.misses);
  const seen = new Set(); const rows = [];
  for (const r of out) { if (seen.has(r.area)) continue; seen.add(r.area); rows.push(r); if (rows.length >= 3) break; }
  return rows.map((r) => ({ ...r, tag: AREA_TAG[r.area] || AREA_TAG['root-words'], note: missNote(r.misses) }));
}
