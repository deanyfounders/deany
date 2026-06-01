/**
 * Concept graph data model for the DEANY knowledge map.
 * Concepts map to lessons; state computed from completedLessons.
 * TODO: author concepts for islamic-history track
 */

export const concepts = [
  // 5 Pillars - Shahada
  { id: 'shahada-testimony', label: 'The Shahada', track: '5-pillars', lessonIds: ['shahada-lesson-0'] },
  { id: 'shahada-second', label: 'Second Testimony', track: '5-pillars', lessonIds: ['shahada-lesson-1'] },
  { id: 'shahada-living', label: 'Living the Shahada', track: '5-pillars', lessonIds: ['shahada-lesson-2'] },
  // 5 Pillars - Salah
  { id: 'salah-appointments', label: 'Daily Appointments', track: '5-pillars', lessonIds: ['salah-lesson-0'] },
  { id: 'salah-wudu', label: 'Wudu', track: '5-pillars', lessonIds: ['salah-lesson-1'] },
  { id: 'salah-rakah', label: "The Rak'ah", track: '5-pillars', lessonIds: ['salah-lesson-2'] },
  { id: 'salah-words', label: 'Words of Prayer', track: '5-pillars', lessonIds: ['salah-lesson-3'] },
  { id: 'salah-mistakes', label: 'Handling Mistakes', track: '5-pillars', lessonIds: ['salah-lesson-4'] },
  { id: 'salah-first', label: 'First Real Salah', track: '5-pillars', lessonIds: ['salah-lesson-5'] },
  { id: 'salah-together', label: 'Praying Together', track: '5-pillars', lessonIds: ['salah-lesson-6'] },
  // Quran & Arabic
  { id: 'hifz-fatiha', label: 'Memorise Al-Fatiha', track: 'quran-arabic', lessonIds: ['quran-memorisation-lesson-0'] },
  { id: 'tafsir-fatiha', label: 'Understand Al-Fatiha', track: 'quran-arabic', lessonIds: ['quran-tafsir-lesson-0'] },
  // Islamic Finance
  { id: 'finance-wealth', label: 'Islam and Wealth', track: 'islamic-finance', lessonIds: ['module-1-lesson-0'] },
  { id: 'finance-amanah', label: 'Money as Amanah', track: 'islamic-finance', lessonIds: ['module-1-lesson-1'] },
  { id: 'finance-riba', label: 'Riba, Gharar, Maysir', track: 'islamic-finance', lessonIds: ['module-1-lesson-2'] },
  { id: 'finance-halal', label: 'Halal Transactions', track: 'islamic-finance', lessonIds: ['module-1-lesson-3'] },
  { id: 'finance-audit', label: 'Audit Your Finances', track: 'islamic-finance', lessonIds: ['module-1-lesson-4'] },
];

export const edges = [
  ['shahada-testimony', 'shahada-second'],
  ['shahada-second', 'shahada-living'],
  ['shahada-living', 'salah-appointments'],
  ['salah-appointments', 'salah-wudu'],
  ['salah-wudu', 'salah-rakah'],
  ['salah-rakah', 'salah-words'],
  ['salah-words', 'salah-mistakes'],
  ['salah-mistakes', 'salah-first'],
  ['salah-first', 'salah-together'],
  ['hifz-fatiha', 'tafsir-fatiha'],
  ['finance-wealth', 'finance-amanah'],
  ['finance-amanah', 'finance-riba'],
  ['finance-riba', 'finance-halal'],
  ['finance-halal', 'finance-audit'],
];

// Galaxy layout (normalized 0–1)
export const positions = {
  'shahada-testimony': { x: 0.14, y: 0.16 },
  'shahada-second': { x: 0.24, y: 0.10 },
  'shahada-living': { x: 0.34, y: 0.18 },
  'salah-appointments': { x: 0.20, y: 0.32 },
  'salah-wudu': { x: 0.12, y: 0.43 },
  'salah-rakah': { x: 0.22, y: 0.53 },
  'salah-words': { x: 0.14, y: 0.63 },
  'salah-mistakes': { x: 0.24, y: 0.72 },
  'salah-first': { x: 0.16, y: 0.82 },
  'salah-together': { x: 0.28, y: 0.90 },
  'hifz-fatiha': { x: 0.62, y: 0.14 },
  'tafsir-fatiha': { x: 0.74, y: 0.24 },
  'finance-wealth': { x: 0.64, y: 0.42 },
  'finance-amanah': { x: 0.76, y: 0.50 },
  'finance-riba': { x: 0.68, y: 0.60 },
  'finance-halal': { x: 0.80, y: 0.70 },
  'finance-audit': { x: 0.72, y: 0.80 },
};

export const trackAccents = {
  '5-pillars': '#22A39A',
  'quran-arabic': '#235C7A',
  'islamic-finance': '#F0B429',
  'islamic-history': '#EF6F53',
};

export function computeStates(completedLessons = {}) {
  const prereqMap = {};
  edges.forEach(([from, to]) => {
    if (!prereqMap[to]) prereqMap[to] = [];
    prereqMap[to].push(from);
  });
  const states = {};
  concepts.forEach(c => {
    states[c.id] = c.lessonIds.some(lid => completedLessons[lid]) ? 'unlocked' : 'locked';
  });
  concepts.forEach(c => {
    if (states[c.id] === 'unlocked') return;
    const reqs = prereqMap[c.id] || [];
    if (reqs.length === 0 || reqs.every(r => states[r] === 'unlocked')) {
      states[c.id] = 'available';
    }
  });
  return states;
}
