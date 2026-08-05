// Dashboard design tokens. No shadows. Brand tokens + approved tints only.
// Functional icons are a single lucide outline family at one stroke weight.
import { Scale, Moon, BookOpen, Map } from 'lucide-react';

export const D = {
  teal: '#22A39A', tealDeep: '#0F6E56', gold: '#F0B429', canvas: '#FBFAF6', navy: '#1B2A4A',
  history: '#E06A45', quran: '#155E52',
  card: '#FFFFFF',
  border: '#E8E4D8', trackOnWhite: '#EDEAE0', trackOnCanvas: '#E8E4D8',
  ink: '#1B2A4A', inkSecondary: '#5C6A85', inkHint: '#8A94A8', inkFaint: '#A5AEBF', disabled: '#C9C4B4',
  navyDivider: '#2C3D63', navyMuted: '#8FA0C4',
  goldInk: '#D99A11',
  // tinted stat pills (section 3)
  streakPill: { bg: '#FBF3DF', border: '#F0DFAE', ink: '#B87E0A' },
  coinsPill: { bg: '#E9F6F4', border: '#C9E8E2', ink: '#0F6E56' },
  levelChip: { bg: '#E9F6F4', ink: '#0F6E56' },
};

// Subject identity: icon (lucide) + ink + accent, the generic tile tint, and the
// section 6 topic-card treatment (bg/border/title/hint/chip).
export const SUBJECTS = {
  'quran-arabic': { Icon: BookOpen, ink: '#155E52', accent: '#155E52', tint: '#EDF4EF', name: 'Quran and Arabic', short: 'Quran',
    card: { bg: '#EDF4EF', border: '#CBE0D3', title: '#123F30', hint: '#4A6B5C', chipBg: '#155E52', chipInk: '#FBFAF6' } },
  'islamic-history': { Icon: Map, ink: '#B04A2C', accent: '#E06A45', tint: '#FBEFE9', name: 'Islamic history', short: 'History',
    card: { bg: '#FBEFE9', border: '#F0D2C4', title: '#7A2E13', hint: '#A0522D', chipBg: '#E06A45', chipInk: '#FFFFFF' } },
  'islamic-finance': { Icon: Scale, ink: '#9A6E08', accent: '#F0B429', tint: '#FDF6E4', name: 'Islamic finance', short: 'Finance',
    card: { bg: '#FDF6E4', border: '#F0DFAE', title: '#6E4F05', hint: '#A08037', chipBg: '#F0B429', chipInk: '#1B2A4A' } },
  '5-pillars': { Icon: Moon, ink: '#0F6E56', accent: '#22A39A', tint: '#E9F6F1', name: 'Five Pillars', short: 'Pillars',
    card: { bg: '#E9F6F1', border: '#C6E5DC', title: '#0B4A3A', hint: '#4A7A6C', chipBg: '#22A39A', chipInk: '#FFFFFF' } },
};

export const subjectOf = (id) => SUBJECTS[id] || {
  Icon: BookOpen, ink: '#5C6A85', accent: '#5C6A85', tint: '#EEF1F4', name: id, short: id,
  card: { bg: '#F7F8FA', border: '#E8E4D8', title: '#1B2A4A', hint: '#8A94A8', chipBg: '#8A94A8', chipInk: '#FFFFFF' },
};

export const RADIUS = { card: 16, hero: 20, pill: 999, tile: 10, btnInCard: 12, btn: 16 };

// Carousel accent per topic (dashboard carousel spec, 30 Jul 2026). One accent
// used in EXACTLY four places: topic pill, level label, filled Start button, and
// the active page dot. base=fill, deep=hard shadow/filled segments, tint=pill bg,
// onBase=text on the filled button. Amber needs dark text (fails AA on white).
export const CAROUSEL_ACCENT = {
  'islamic-finance': { base: '#F0B429', deep: '#C08A12', tint: '#FAEEDA', onBase: '#3A2704' },
  'islamic-history': { base: '#D85A30', deep: '#A8411F', tint: '#FAECE7', onBase: '#FFFFFF' },
  'quran-arabic': { base: '#1D9E75', deep: '#14785A', tint: '#E1F5EE', onBase: '#FFFFFF' },
  'add-topic': { base: '#22A39A', deep: '#17827B', tint: '#E1F5EE', onBase: '#FFFFFF' },
};
export const carouselAccent = (id) => CAROUSEL_ACCENT[id] || CAROUSEL_ACCENT['add-topic'];
export const FONT = '"Source Sans 3", system-ui, -apple-system, sans-serif';
export const TYPE = { screenTitle: 18, cardTitle: 17, sectionHeading: 15, body: 13, meta: 12, hint: 11, bigNumber: 20, dueHeadline: 24 };

// Editorial dashboard theme (deany_dashboard_spec.md section 1). Shared constants;
// the ONLY shipped page background is pure white. Exported for later reuse.
export const E = {
  bg: '#FFFFFF', card: '#FFFFFF', inset: '#F6F6F4', line: '#E3E0D8',
  ink: '#1B2A4A', soft: '#6E7385', faint: '#9CA0AE',
  teal: '#22A39A', tealDark: '#0F6E56', tealTint: '#D9F1EB',
  gold: '#F0B429', goldDark: '#8A5E10', goldTint: '#FCEBC9', goldEdge: '#C98F17',
  navy: '#1B2A4A', history: '#E06A45', historyTint: '#FCE7DE', quranTint: '#E2E6F2',
  contGrad: 'linear-gradient(135deg,#27B5A8,#189287)', contBorder: '#178E85', contBottom: '#0F6E56',
  challGrad: 'linear-gradient(135deg,#22335C,#16223F)', challBorder: '#2A3B66', challBottom: '#101A31',
};
export const FONT_LATIN = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
export const FONT_SERIF = "'Lora', Georgia, serif";
export const FONT_AR = "'Scheherazade New', 'Amiri', serif";
