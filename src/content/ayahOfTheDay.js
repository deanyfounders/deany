/* ============================================================================
 * AYAH OF THE DAY BANK - STRING LOCKED - DO NOT EDIT THE ARABIC
 * ----------------------------------------------------------------------------
 * Every `arabic` string MUST be verbatim Tanzil Uthmani text. No agent, script,
 * or person may type, "fix", normalise, or paraphrase these strings. They are
 * copied once from a verified source and locked.
 *
 * STATUS: the entries below are PLACEHOLDERS marked review:'pending_mehdi'.
 * Before shipping to learners, Mehdi must (1) replace each `arabic` with the
 * exact Tanzil Uthmani text for that reference, (2) confirm the tafsir lines
 * against the cited classical source, and (3) resolve the translation source
 * and licensing (open decision - see the report). Tafsir lines are human
 * curated and never generated at runtime.
 * ==========================================================================*/

export const AYAH_BANK = [
  {
    id: 'baqarah-152', surahName: 'Al-Baqarah', ref: '2:152',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    tafsirLine: 'Remembrance of Allah is answered with His remembrance of you, a mercy far greater than the deed.',
    tafsirFull: 'As-Sa\'di notes that this ayah ties the servant\'s remembrance of Allah to a response from Allah that is greater in kind. The command to gratitude follows, because remembrance without thankfulness is incomplete.',
    source: "Tafsir as-Sa'di", review: 'pending_mehdi',
  },
  {
    id: 'sharh-5-6', surahName: 'Ash-Sharh', ref: '94:5-6',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'For indeed, with hardship comes ease. Indeed, with hardship comes ease.',
    tafsirLine: 'The ease is promised alongside the hardship, not only after it - relief travels with the trial.',
    tafsirFull: 'Ibn Kathir relates that the repetition affirms the promise, and the scholars observed that one hardship is not overcome by two eases, a note on the certainty of relief.',
    source: 'Tafsir Ibn Kathir', review: 'pending_mehdi',
  },
  {
    id: 'talaq-3', surahName: 'At-Talaq', ref: '65:3',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: 'And whoever relies upon Allah, then He is sufficient for him.',
    tafsirLine: 'True reliance on Allah brings sufficiency - He becomes enough for the one who trusts Him.',
    tafsirFull: 'Ibn Kathir explains that sufficiency here means Allah suffices the one who places his trust in Him in all his affairs, worldly and otherwise.',
    source: 'Tafsir Ibn Kathir', review: 'pending_mehdi',
  },
  {
    id: 'ikhlas-1-2', surahName: 'Al-Ikhlas', ref: '112:1-2',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ',
    translation: 'Say, He is Allah, the One. Allah, the Eternal Refuge.',
    tafsirLine: 'Oneness and self-sufficiency: Allah is unique, and all creation turns to Him while He needs nothing.',
    tafsirFull: 'The scholars explain As-Samad as the Master to whom all turn in their needs, perfect in His attributes, without partner, parent, or child.',
    source: 'Tafsir Ibn Kathir', review: 'pending_mehdi',
  },
  {
    id: 'ra-d-28', surahName: 'Ar-Ra\'d', ref: '13:28',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Unquestionably, by the remembrance of Allah hearts are assured.',
    tafsirLine: 'Hearts find their rest only in the remembrance of Allah, not in anything else.',
    tafsirFull: 'As-Sa\'di notes that the heart has no true tranquillity except through remembering Allah, for it was created to know and love Him.',
    source: "Tafsir as-Sa'di", review: 'pending_mehdi',
  },
];

// Deterministic by date - same ayah for every user on a given day, offline.
export function getAyahOfTheDay(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date - start) / 86400000);
  return AYAH_BANK[dayOfYear % AYAH_BANK.length];
}

export const AYAH_PENDING_IDS = AYAH_BANK.map(a => a.id);
