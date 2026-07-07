// Welcome-hero picker catalog: 8 topics x 3 tiers x 2 lessons = 48 entries.
//
// DEVIATION NOTES (open approvals - report these):
//   - The app's real onboarding topic system has 4 subjects. Each picker topic
//     carries a `seed` field mapping it to one of those four so the feed-forward
//     into topic-select + calibration works. This mapping is provisional.
//   - Provisional subject inks for Pillars / Duas / Arabic / Akhlaq live here,
//     NOT in the brand-locked tokens.js, until Saleh approves them as subject
//     identities: Pillars #147067, Duas #7A3B69, Arabic #3B5BA5, Akhlaq #4A6B5C.
//   - Every one of the 48 lesson labels below is pending_mehdi (see list).
//
// pending_mehdi - all 48 lesson titles:
//   Seerah:   Makkah before Islam / The early years | The Hijra to Madinah /
//             Battle of Badr | The Treaty of Hudaybiyyah / The farewell sermon
//   Finance:  What money is for / Halal and haram basics | Riba and why it harms /
//             Gharar and uncertainty | Murabaha explained / Sukuk and equity
//   Quran:    The opening surah / How the Quran came | Makki and Madani surahs /
//             Themes of the Quran | Sciences of the Quran / Abrogation basics
//   Pillars:  The five pillars / Shahada explained | How zakat works /
//             The pillars in practice | Zakat on wealth types / Hajj rites in order
//   History:  The Rightly Guided / House of Wisdom | The Umayyad era /
//             Trade along the routes | The Abbasid golden age / Al-Andalus
//   Duas:     Morning and evening / Before you sleep | Duas from the Quran /
//             Duas of the Prophet [salawat] | Duas in hardship / Names of Allah in dua
//   Arabic:   The Arabic letters / Reading your first word | Roots and patterns /
//             Common Quran words | Verb forms I to X / Reading classical texts
//   Akhlaq:   Honesty every day / Good manners at home | Patience under trial /
//             Guarding the tongue | Sincerity of intention / Justice and balance
//
// Content rules encoded: labels <= 28 chars; broad-consensus, non-interpretive
// titles only; the honorific in "Duas of the Prophet" renders via md() and must
// survive ellipsis truncation at 360px.
import { T, md } from '../kit/tokens.js';

export const TIERS = ['foundations', 'intermediate', 'advanced'];

export const TIER_META = {
  foundations: { label: 'Foundations', color: T.teal },
  intermediate: { label: 'Intermediate', color: '#D99A11' },
  advanced: { label: 'Advanced', color: T.navy },
};

// id, display label, ink color, and the real onboarding topic it seeds.
export const TOPICS = [
  { id: 'seerah', label: 'Seerah', ink: T.history, seed: 'islamic-history' },
  { id: 'finance', label: 'Finance', ink: T.gold, seed: 'islamic-finance' },
  { id: 'quran', label: 'Quran', ink: T.quran, seed: 'quran-arabic' },
  { id: 'pillars', label: 'Five Pillars', ink: '#147067', seed: '5-pillars' },
  { id: 'history', label: 'History', ink: T.history, seed: 'islamic-history' },
  { id: 'duas', label: 'Duas', ink: '#7A3B69', seed: '5-pillars' },
  { id: 'arabic', label: 'Arabic', ink: '#3B5BA5', seed: 'quran-arabic' },
  { id: 'akhlaq', label: 'Akhlaq', ink: '#4A6B5C', seed: '5-pillars' },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map(t => [t.id, t]));

// Two lessons per topic per tier. pending_mehdi.
const TITLES = {
  seerah: {
    foundations: ['Makkah before Islam', 'The early years'],
    intermediate: ['The Hijra to Madinah', 'Battle of Badr'],
    advanced: ['The Treaty of Hudaybiyyah', 'The farewell sermon'],
  },
  finance: {
    foundations: ['What money is for', 'Halal and haram basics'],
    intermediate: ['Riba and why it harms', 'Gharar and uncertainty'],
    advanced: ['Murabaha explained', 'Sukuk and equity'],
  },
  quran: {
    foundations: ['The opening surah', 'How the Quran came'],
    intermediate: ['Makki and Madani surahs', 'Themes of the Quran'],
    advanced: ['Sciences of the Quran', 'Abrogation basics'],
  },
  pillars: {
    foundations: ['The five pillars', 'Shahada explained'],
    intermediate: ['How zakat works', 'The pillars in practice'],
    advanced: ['Zakat on wealth types', 'Hajj rites in order'],
  },
  history: {
    foundations: ['The Rightly Guided', 'House of Wisdom'],
    intermediate: ['The Umayyad era', 'Trade along the routes'],
    advanced: ['The Abbasid golden age', 'Al-Andalus'],
  },
  duas: {
    foundations: ['Morning and evening', 'Before you sleep'],
    intermediate: ['Duas from the Quran', md('Duas of the Prophet')],
    advanced: ['Duas in hardship', 'Names of Allah in dua'],
  },
  arabic: {
    foundations: ['The Arabic letters', 'Reading your first word'],
    intermediate: ['Roots and patterns', 'Common Quran words'],
    advanced: ['Verb forms I to X', 'Reading classical texts'],
  },
  akhlaq: {
    foundations: ['Honesty every day', 'Good manners at home'],
    intermediate: ['Patience under trial', 'Guarding the tongue'],
    advanced: ['Sincerity of intention', 'Justice and balance'],
  },
};

// Deterministic, checked order (NOT a runtime shuffle). Two passes over all 8
// topics with different orderings so no two same-topic lessons are ever
// adjacent - verified including the wrap boundary. Pass A uses lesson[0] of each
// topic, pass B uses lesson[1]. Same topic order for all tiers; only titles vary.
const PASS_A = ['seerah', 'finance', 'quran', 'pillars', 'history', 'duas', 'arabic', 'akhlaq'];
const PASS_B = ['quran', 'akhlaq', 'finance', 'arabic', 'pillars', 'seerah', 'duas', 'history'];

function buildTier(tier) {
  const rows = [];
  PASS_A.forEach(t => rows.push({ t, label: TITLES[t][tier][0] }));
  PASS_B.forEach(t => rows.push({ t, label: TITLES[t][tier][1] }));
  return rows;
}

export const LESSONS = {
  foundations: buildTier('foundations'),
  intermediate: buildTier('intermediate'),
  advanced: buildTier('advanced'),
};
