// Onboarding design tokens - the "clean recipe" encoded once.
// Brand tokens only. No em-dashes anywhere.
export const T = {
  // surfaces
  canvas: '#FBFAF6',
  card: '#FFFFFF',
  border: '#E8E4D8',
  // brand
  teal: '#22A39A',
  tealDeep: '#0F6E56',
  gold: '#F0B429',
  navy: '#1B2A4A',
  history: '#E06A45',
  quran: '#1F6E5C', // mushaf green (working value)
  // ink hierarchy
  ink: '#1B2A4A', // headlines
  inkSecondary: '#5C6A85', // secondary text
  inkHint: '#A5AEBF', // hints
  // feedback
  correct: '#2A9B6E',
  correctTint: 'rgba(42,155,110,0.10)',
};

// Subject identity colors. Finance identity is "gold-on-navy"; the accent color
// used for its selected-state grammar is gold.
export const SUBJECT = {
  'quran-arabic': { accent: T.quran, tint: 'rgba(31,110,92,0.10)', label: 'Quran and Arabic', short: 'Quran', emoji: '\u{1F4D6}' },
  'islamic-history': { accent: T.history, tint: 'rgba(224,106,69,0.10)', label: 'Islamic history', short: 'History', emoji: '\u{1F3DB}\u{FE0F}' },
  '5-pillars': { accent: T.teal, tint: 'rgba(34,163,154,0.10)', label: 'Five Pillars', short: 'Pillars', emoji: '\u{1F54C}' },
  'islamic-finance': { accent: T.gold, tint: 'rgba(240,180,41,0.12)', label: 'Islamic finance', short: 'Finance', emoji: '⚖️' },
};

export const RADIUS = { card: 15, pill: 16, tile: 13 };
export const FONT = '"Source Sans 3", system-ui, -apple-system, sans-serif';
export const SERIF = 'Georgia, serif';

// Honorific convention: md() renders the salawat after the Prophet's name.
export const md = (name = 'the Prophet') => `${name} ﷺ`;
