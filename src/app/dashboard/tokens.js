// Dashboard design tokens - exact values from the build spec. No shadows
// anywhere on the dashboard. Brand tokens + the approved tints only.
export const D = {
  // brand
  teal: '#22A39A', tealDeep: '#0F6E56', gold: '#F0B429', canvas: '#FBFAF6', navy: '#1B2A4A',
  history: '#E06A45', quran: '#2F6B52',
  card: '#FFFFFF',
  // hairlines / tracks
  border: '#E8E4D8', trackOnWhite: '#EDEAE0', trackOnCanvas: '#E8E4D8',
  // ink hierarchy
  ink: '#1B2A4A', inkSecondary: '#5C6A85', inkHint: '#8A94A8', inkFaint: '#A5AEBF', disabled: '#C9C4B4',
  // navy card internals
  navyDivider: '#2C3D63', navyMuted: '#8FA0C4',
  // gold as ink (streak, finance progress) - gold #F0B429 is too light on white
  goldInk: '#D99A11',
};

// Subject identity: tile tint + icon/ink color + progress accent.
export const SUBJECTS = {
  'quran-arabic':    { tint: '#F0F6F2', ink: '#2F6B52', accent: '#2F6B52', name: 'Quran and Arabic', short: 'Quran', emoji: '\u{1F4D6}' },
  'islamic-history': { tint: '#FBEFE9', ink: '#B04A2C', accent: '#E06A45', name: 'Islamic history', short: 'History', emoji: '\u{1F3DB}\u{FE0F}' },
  'islamic-finance': { tint: '#FBF3DF', ink: '#9A6E08', accent: '#F0B429', name: 'Islamic finance', short: 'Finance', emoji: '⚖️' },
  '5-pillars':       { tint: '#E9F6F4', ink: '#0F6E56', accent: '#22A39A', name: 'Five Pillars', short: 'Pillars', emoji: '\u{1F54C}' },
};

export const subjectOf = (id) => SUBJECTS[id] || { tint: '#E9F6F4', ink: '#0F6E56', accent: '#22A39A', name: id, short: id, emoji: '\u{1F4D8}' };

export const RADIUS = { card: 16, hero: 20, pill: 999, tile: 11, btnInCard: 12, btn: 16 };
export const FONT = '"Source Sans 3", system-ui, -apple-system, sans-serif';

// Type scale (px): titles are navy, weights 400/500 only.
export const TYPE = {
  screenTitle: 18, cardTitle: 17, sectionHeading: 15, body: 13, meta: 12, hint: 11, bigNumber: 20, dueHeadline: 24,
};
