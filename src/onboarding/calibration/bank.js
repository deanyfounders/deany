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
// qL: questions reused VERBATIM from a shipped, human-written lesson. Already
// approved content, so review:'from_lesson' (not pending_mehdi). `source` cites
// the lesson.
const qL = (id, topic, tier, prompt, options, answerIndex, source) => ({ id, topic, tier, prompt, options, answerIndex, review: 'from_lesson', source });

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

  // ── Reused verbatim from shipped lessons (approved, review:'from_lesson') ──
  // Islamic finance - Lesson 3 (Riba, Gharar, Maysir)
  qL('fin-l3-riba', 'islamic-finance', 2, 'Which BEST describes why ribā is prohibited?',
    ['Because making profit is wrong in Islam.', 'Because the lender profits with zero risk while the borrower bears everything.', 'Because lending money to people is not allowed.', 'Because interest rates are too high.'], 1, 'DEANY_M1L3 q2'),
  // Islamic history - Lesson 2
  qL('his-l2-makkah', 'islamic-history', 2, 'Why was Makkah particularly important to ancient trade routes?',
    ['It was the largest and most populous city on the Arabian Peninsula', 'It sat at the crossroads of north-south and east-west trade arteries', 'It had the most fertile land and freshwater sources in Arabia', 'It was the closest Arab settlement to the Persian Empire'], 1, 'DEANY-HB1L2 q2'),
  qL('his-l2-isolation', 'islamic-history', 3, 'A historian argues: "Pre-Islamic Arabs were fully isolated from the civilised world." Based on what you have learned, what is the most accurate response?',
    ['This is correct  -  the vast desert formed a complete barrier between Arabia and other civilisations', 'This is partially correct  -  Arabs were geographically isolated but had some limited trade contact', 'This is incorrect  -  Arabia sat between the Byzantine and Sasanian Empires and was central to ancient trade routes', 'This is incorrect  -  Arabia was in fact fully part of the Byzantine Empire'], 2, 'DEANY-HB1L2 q4'),
  // Quran and Arabic - Al-Fatiha tafsir
  qL('qur-tafsir-journey', 'quran-arabic', 3, 'What journey has the surah taken so far?',
    ['The surah begins with Allah’s name and mercy, moves into praise and Lordship, then brings the servant before the reality of Judgement.', 'The surah begins by asking for guidance, then later explains who Allah is and why He should be praised.', 'The opening section is mainly about Judgement, while mercy and praise are secondary background details.', 'The opening section begins with the servant’s worship, then later introduces Allah’s names and attributes.'], 0, 'DEANY-TAFSIR-FATIHA CheckpointOne'),
  // Five Pillars - Shahada Lesson 2 (the second testimony)
  qL('sha-l2-rasul', '5-pillars', 1, 'In the second testimony, Muhammad ﷺ is named as rasul of Allah. Which best captures what rasul means?',
    ['A teacher or wise man who arrives at religious truth through reflection.', 'Anyone who speaks about Allah in a general spiritual sense.', 'One who is sent with a message and a mission by an authority.', 'The most virtuous person in a generation, regardless of revelation.'], 2, 'DEANY-B1L2 q1'),
  qL('sha-l2-relationship', '5-pillars', 2, 'Which answer best captures the relationship between the two testimonies?',
    ['They are independent. One can be accepted without the other.', 'The second testimony is a recommendation, while the first is the obligation.', 'They form one structural whole: the first names the object of worship, and the second establishes the method by which that worship is taught and known.', 'The second testimony is necessary because Muhammad ﷺ is divine.'], 2, 'DEANY-B1L2 q5'),
  qL('sha-l2-tariq', '5-pillars', 3, "Tariq believes in Allah, prays five times a day, and accepts the Qur'an as Allah's revealed word. He argues that only the Qur'an is binding and that the Sunnah is not necessary. He says he loves Allah and that following only the Qur'an is enough. What is the issue with his position, structurally?",
    ["There is no issue. Following only the Qur'an is complete and coherent.", 'His prayer does not count because he has misunderstood the Sunnah.', "It contradicts itself: the Qur'an he accepts directly instructs the believer to follow the Messenger ﷺ.", "He is correct about Qur'an-only practice but should make exceptions for widely accepted hadith."], 2, 'DEANY-B1L2 q4'),
];

export const MAX_TIER = { 'quran-arabic': 5, 'islamic-history': 5, '5-pillars': 3, 'islamic-finance': 3 };

// Draft ids still needing scholar review, and the approved lesson-sourced ids.
export const PENDING_IDS = BANK.filter(x => x.review === 'pending_mehdi').map(x => x.id);
export const FROM_LESSON_IDS = BANK.filter(x => x.review === 'from_lesson').map(x => x.id);
