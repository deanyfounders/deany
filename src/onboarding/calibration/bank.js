// Calibration question bank - REUSED from the website "find your level" quiz
// (the DeanyCompass QBANK). No questions are authored here; we import the
// compass bank and reshape it to the app engine's format. This is the single
// source of truth for both the website and the app calibration.
//
// QBANK shape: { [cat]: { [tier 1..3]: [ [id, prompt, [opts], correctIndex, why], ... ] } }
// Compass tiers are 1-3. Compass has five subjects; the app uses four, so
// quran_memorisation and tafseer both fold into 'quran-arabic'.
import { QBANK } from '../../DEANY-COMPASS.jsx';

const TOPIC_MAP = {
  '5_pillars': '5-pillars',
  'islamic_finance': 'islamic-finance',
  'islamic_history': 'islamic-history',
  'quran_memorisation': 'quran-arabic',
  'tafseer': 'quran-arabic',
};

function buildBank() {
  const out = [];
  for (const cat of Object.keys(QBANK)) {
    const topic = TOPIC_MAP[cat] || cat;
    for (const tier of [1, 2, 3]) {
      for (const row of (QBANK[cat]?.[tier] || [])) {
        const [id, prompt, options, answerIndex] = row;
        out.push({ id, topic, tier, prompt, options, answerIndex, review: 'from_compass', source: cat });
      }
    }
  }
  return out;
}

export const BANK = buildBank();

// Every app topic tops out at tier 3 (matching the compass).
export const MAX_TIER = { 'quran-arabic': 3, 'islamic-history': 3, '5-pillars': 3, 'islamic-finance': 3 };

// No authored drafts remain; everything is reused from the compass bank.
export const PENDING_IDS = [];
export const FROM_COMPASS_IDS = BANK.map(q => q.id);
