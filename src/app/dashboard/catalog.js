// Static topic catalog for the Topics tab. The four active-able subjects map to
// the real curriculum; the rest are coming_soon placeholders. No religious
// content here - only subject names and one-line descriptions.
export const CATALOG = [
  { id: '5-pillars',       name: 'Five Pillars',      desc: 'The foundations every Muslim builds on', status: 'available' },
  { id: 'islamic-finance', name: 'Islamic finance',   desc: 'Money, trade, and wealth the halal way', status: 'available' },
  { id: 'quran-arabic',    name: 'Quran and Arabic',  desc: 'Read, understand, and reflect on the words', status: 'available' },
  { id: 'islamic-history', name: 'Islamic history',   desc: 'The story from revelation to the empires', status: 'available' },
  // Coming soon - not yet in the content layer.
  { id: 'seerah',          name: 'The Seerah',        desc: 'The life of the Prophet, peace be upon him', status: 'coming_soon' },
  { id: 'duas-dhikr',      name: 'Duas and dhikr',    desc: 'Daily remembrance and supplication', status: 'coming_soon' },
  { id: 'aqeedah',         name: 'Beliefs',           desc: 'The core of what Muslims believe', status: 'coming_soon' },
];

export const catalogById = (id) => CATALOG.find(c => c.id === id);
