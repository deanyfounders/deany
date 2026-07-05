/* ============================================================================
 * SCHOLAR REVIEW - PENDING
 * Every question below is a DRAFT placement question and is tagged
 * `review: 'pending_mehdi'`. None is teaching content; these only place a
 * learner on a tier. Drafts were kept to verifiable factual matters (counts,
 * names, places, definitions) to avoid any hadith-grading or contested rulings.
 * Do not ship to learners as authoritative until Mehdi signs off. Honorific
 * convention: the Prophet's name is followed by the salawat glyph.
 * ==========================================================================*/

const P = 'pending_mehdi';
const q = (id, topic, tier, prompt, options, answerIndex) => ({ id, topic, tier, prompt, options, answerIndex, review: P });

export const BANK = [
  // ── Quran and Arabic (tiers 1-5) ──────────────────────────────
  q('qr-1a', 'quran-arabic', 1, 'How many surahs are in the Quran?', ['104', '114', '120', '99'], 1),
  q('qr-1b', 'quran-arabic', 1, 'What is the first surah of the Quran?', ['Al-Baqarah', 'Al-Fatiha', 'Al-Ikhlas', 'An-Nas'], 1),
  q('qr-2a', 'quran-arabic', 2, 'In which month was the Quran first revealed?', ['Rajab', "Sha'ban", 'Ramadan', 'Shawwal'], 2),
  q('qr-2b', 'quran-arabic', 2, 'Over approximately how many years was the Quran revealed?', ['10', '23', '40', '5'], 1),
  q('qr-3a', 'quran-arabic', 3, 'What is the longest surah in the Quran?', ['Al-Fatiha', 'Al-Baqarah', 'Ya-Sin', 'Al-Kahf'], 1),
  q('qr-3b', 'quran-arabic', 3, 'The night the Quran began to be revealed is called?', ['Laylat al-Miraj', 'Laylat al-Qadr', "Laylat al-Bara'ah", 'Laylat al-Isra'], 1),
  q('qr-4a', 'quran-arabic', 4, 'Which surah does not begin with the Basmalah?', ['Al-Fatiha', 'At-Tawbah', 'Al-Ikhlas', 'An-Nas'], 1),
  q('qr-4b', 'quran-arabic', 4, 'The Makki surahs were revealed before which event?', ['The Hijra', 'The Battle of Badr', 'The Farewell Hajj', 'Fath Makkah'], 0),
  q('qr-5a', 'quran-arabic', 5, 'Which surah is named after a metal mentioned in it?', ['Al-Hadid (Iron)', 'An-Nur', 'Al-Fajr', 'Al-Asr'], 0),
  q('qr-5b', 'quran-arabic', 5, "The two surahs of refuge (al-Mu'awwidhatayn) are An-Nas and?", ['Al-Ikhlas', 'Al-Falaq', 'Al-Kafirun', 'Al-Fil'], 1),

  // ── Islamic history (tiers 1-5) ───────────────────────────────
  q('hi-1a', 'islamic-history', 1, 'In which city was the Prophet Muhammad ﷺ born?', ['Madinah', 'Makkah', "Ta'if", 'Jerusalem'], 1),
  q('hi-1b', 'islamic-history', 1, 'The migration of the Prophet ﷺ from Makkah to Madinah is called?', ['Isra', 'Hijra', 'Miraj', 'Fath'], 1),
  q('hi-2a', 'islamic-history', 2, 'The Islamic calendar counts years from which event?', ["The Prophet's birth ﷺ", 'The Hijra', 'The first revelation', 'Fath Makkah'], 1),
  q('hi-2b', 'islamic-history', 2, 'Who was the first caliph after the Prophet ﷺ?', ['Umar ibn al-Khattab', 'Abu Bakr', 'Uthman ibn Affan', 'Ali ibn Abi Talib'], 1),
  q('hi-3a', 'islamic-history', 3, 'The Battle of Badr took place in which year after the Hijra?', ['Year 2', 'Year 5', 'Year 8', 'Year 10'], 0),
  q('hi-3b', 'islamic-history', 3, "Which companion was known as 'al-Faruq'?", ['Abu Bakr', 'Umar ibn al-Khattab', 'Uthman ibn Affan', 'Ali ibn Abi Talib'], 1),
  q('hi-4a', 'islamic-history', 4, 'The Umayyad Caliphate had its capital in which city?', ['Baghdad', 'Damascus', 'Cordoba', 'Cairo'], 1),
  q('hi-4b', 'islamic-history', 4, 'The Abbasid Caliphate established its capital at?', ['Damascus', 'Baghdad', 'Madinah', 'Kufa'], 1),
  q('hi-5a', 'islamic-history', 5, "The 'House of Wisdom' (Bayt al-Hikma) centre of learning was in?", ['Cordoba', 'Baghdad', 'Cairo', 'Damascus'], 1),
  q('hi-5b', 'islamic-history', 5, 'Which dynasty ruled al-Andalus from Cordoba?', ['Abbasids', 'Umayyads', 'Fatimids', 'Ottomans'], 1),

  // ── Five Pillars (tiers 1-3) ──────────────────────────────────
  q('fp-1a', '5-pillars', 1, 'How many pillars of Islam are there?', ['3', '5', '6', '7'], 1),
  q('fp-1b', '5-pillars', 1, 'The declaration of faith is called?', ['Salah', 'Shahada', 'Zakat', 'Sawm'], 1),
  q('fp-2a', '5-pillars', 2, 'How many obligatory daily prayers are there?', ['3', '5', '7', '1'], 1),
  q('fp-2b', '5-pillars', 2, 'Fasting during Ramadan is which pillar?', ['Zakat', 'Sawm', 'Hajj', 'Salah'], 1),
  q('fp-3a', '5-pillars', 3, 'The pilgrimage to Makkah is called?', ['Umrah', 'Hajj', 'Ziyarah', 'Hijra'], 1),
  q('fp-3b', '5-pillars', 3, 'Zakat is generally calculated at what rate on qualifying savings?', ['1%', '2.5%', '5%', '10%'], 1),

  // ── Islamic finance (tiers 1-3) ───────────────────────────────
  q('if-1a', 'islamic-finance', 1, 'Interest charged on a loan is called?', ['Zakat', 'Riba', 'Sadaqah', 'Khums'], 1),
  q('if-1b', 'islamic-finance', 1, 'Excessive uncertainty in a contract is known as?', ['Riba', 'Gharar', 'Zakat', 'Halal'], 1),
  q('if-2a', 'islamic-finance', 2, 'Gambling, prohibited in Islamic finance, is called?', ['Maysir', 'Murabaha', 'Ijarah', 'Sukuk'], 0),
  q('if-2b', 'islamic-finance', 2, 'A cost-plus sale contract is known as?', ['Mudarabah', 'Murabaha', 'Riba', 'Gharar'], 1),
  q('if-3a', 'islamic-finance', 3, 'Islamic bonds are known as?', ['Sukuk', 'Shares', 'Riba', 'Takaful'], 0),
  q('if-3b', 'islamic-finance', 3, 'Islamic cooperative insurance is called?', ['Takaful', 'Riba', 'Ijarah', 'Sukuk'], 0),
];

export const MAX_TIER = { 'quran-arabic': 5, 'islamic-history': 5, '5-pillars': 3, 'islamic-finance': 3 };

// All draft question ids, for the pending_mehdi report.
export const PENDING_IDS = BANK.map(x => x.id);
