// Topic catalog. The four active-able subjects map to the real curriculum.
//
// Selection principle: catalog topics are educational and devotional
// fundamentals with broad consensus. No sectarian comparisons, no contemporary
// politics, no polemics, no contested legal or theological debates. Any topic
// touching interpretive difference ships under the zanni/qat'i guardrail and
// Mehdi's scope definition before it leaves coming_soon. Every coming-soon name
// and scope below is a working title, tagged pending_mehdi for approval.
export const CATALOG = [
  { id: '5-pillars',       name: 'Five Pillars',      desc: 'The foundations every Muslim builds on', status: 'available' },
  { id: 'islamic-finance', name: 'Islamic finance',   desc: 'Money, trade, and wealth the halal way', status: 'available' },
  { id: 'quran-arabic',    name: 'Quran and Arabic',  desc: 'Read, understand, and reflect on the words', status: 'available' },
  { id: 'islamic-history', name: 'Islamic history',   desc: 'The story from revelation to the empires', status: 'available' },

  // Coming soon - working titles, all pending_mehdi.
  { id: 'seerah',          name: 'Seerah',                     desc: 'The life of the Prophet, peace be upon him', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'prophets',        name: 'Stories of the Prophets',    desc: 'Lessons from the messengers before', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'fiqh-essentials', name: 'Fiqh essentials',            desc: 'Practical worship basics', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'hadith',          name: 'Hadith',                     desc: 'How sahih hadith reach us', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'names-of-allah',  name: 'Names of Allah',             desc: 'Al-Asma ul-Husna', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'duas-dhikr',      name: 'Duas and daily remembrance', desc: 'Supplication through the day', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'art-architecture',name: 'Islamic art and architecture', desc: 'Beauty across the Muslim world', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'golden-age',      name: 'The Islamic Golden Age',     desc: 'Science and civilization', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'arabic-quran',    name: 'Arabic for the Quran',       desc: 'Reading fundamentals', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'tafsir',          name: 'Tafsir foundations',         desc: 'How the Quran is understood', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'akhlaq',          name: 'Akhlaq',                     desc: 'Character and manners', status: 'coming_soon', review: 'pending_mehdi' },
  { id: 'ramadan',         name: 'Ramadan and the calendar',   desc: 'The Islamic year and its seasons', status: 'coming_soon', review: 'pending_mehdi' },
];

export const catalogById = (id) => CATALOG.find(c => c.id === id);
