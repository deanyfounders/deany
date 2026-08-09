// The ONE juz/hizb/rub derivation layer (deany_juz_implementation_spec.md section 4).
// Everything reads the single ingested mapping in quran-index.json (built from Tanzil
// quran-data.xml, validated in verify-quran.mjs). No boundary arithmetic, no switch
// over surah numbers, no duplicated boundary lists. A juz is a length-based cut over
// the 6,236 ayat; surahs and juz are two overlapping coordinate systems.
import indexData from '../../data/quran-index.json';

const SURAHS = indexData.surahs || [];
const JUZ = (indexData.juz || []).slice().sort((a, b) => a.juz - b.juz);
const PAGES = (indexData.pages || []).slice().sort((a, b) => a.page - b.page);
export const TOTAL_AYAT = 6236;

// Page navigation: the Madani-layout page start refs (604 of them).
export function pageStart(n) { const p = PAGES.find((x) => x.page === n); return p ? [p.surah, p.ayah] : null; }

// 0-based global index of each surah's first ayah, and helpers off it.
const surahStart = {};
{ let g = 0; for (const s of SURAHS) { surahStart[s.surah] = g; g += s.ayah_count; } }
const gIndex = (surah, ayah) => (surahStart[surah] ?? 0) + (ayah - 1);
const surahMeta = (n) => SURAHS.find((x) => x.surah === n) || null;
const surahName = (n) => { const s = surahMeta(n); return s ? s.name_tr : `Surah ${n}`; };
const ayahCount = (n) => { const s = surahMeta(n); return s ? s.ayah_count : 0; };

// juzOfAyah = lookup against the materialised juz starts, never arithmetic.
export function juzOfAyah(surah, ayah) {
  const g = gIndex(surah, ayah);
  let j = 1;
  for (const z of JUZ) { if (z.ordinal <= g) j = z.juz; else break; }
  return j;
}

export function rangeOfJuz(n) {
  const z = JUZ.find((x) => x.juz === n);
  if (!z) return null;
  return { juz: n, name: z.name, start: [z.surah, z.ayah], end: [z.endSurah, z.endAyah], ordinal: z.ordinal, ayat: z.ayat, page: z.page };
}

// Distinct juz values across a surah's ayat (Al-Baqarah -> [1,2,3]).
export function juzSpanOfSurah(surah) {
  const a = juzOfAyah(surah, 1), b = juzOfAyah(surah, ayahCount(surah));
  const out = []; for (let j = a; j <= b; j++) out.push(j); return out;
}

// The juz's ayat grouped by surah, each marked complete or partial.
export function surahCompositionOfJuz(n) {
  const z = JUZ.find((x) => x.juz === n);
  if (!z) return [];
  const startG = z.ordinal, endG = startG + z.ayat - 1, out = [];
  for (const s of SURAHS) {
    const sStart = surahStart[s.surah], sEnd = sStart + s.ayah_count - 1;
    const lo = Math.max(sStart, startG), hi = Math.min(sEnd, endG);
    if (lo > hi) continue;
    const first = lo - sStart + 1, last = hi - sStart + 1;
    out.push({ surah: s.surah, name: s.name_tr, first, last, complete: first === 1 && last === s.ayah_count });
  }
  return out;
}

// Progress over a juz's range from a Set of memorised/read "surah:ayah" keys.
export function progressOfJuz(n, doneSet) {
  const z = JUZ.find((x) => x.juz === n);
  if (!z) return { done: 0, total: 0, pct: 0 };
  let done = 0;
  if (doneSet && doneSet.size) for (const c of surahCompositionOfJuz(n)) for (let a = c.first; a <= c.last; a++) if (doneSet.has(`${c.surah}:${a}`)) done++;
  return { done, total: z.ayat, pct: z.ayat ? Math.round((done / z.ayat) * 100) : 0 };
}

// Plain-words range for a juz row. Whole-surah spans drop ayah numbers.
function rangeText(z) {
  const a = surahName(z.surah), b = surahName(z.endSurah);
  const allComplete = z.ayah === 1 && z.endAyah === ayahCount(z.endSurah);
  if (allComplete) return z.surah === z.endSurah ? a : `${a} to ${b}`;
  if (z.surah === z.endSurah) return `${a} ${z.ayah} to ${z.endAyah}`;
  return `${a} ${z.ayah} to ${b} ${z.endAyah}`;
}

// The 30-row model for the Juz browse tab.
export const JUZ_LIST = JUZ.map((z) => ({
  juz: z.juz, name: z.name, start: [z.surah, z.ayah], end: [z.endSurah, z.endAyah],
  ayat: z.ayat, page: z.page, rangeText: rangeText(z),
}));
