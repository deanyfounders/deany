// Qur'an reader local state (SSR-safe). Semantic prefs only; never touches text.
const KEYS = {
  showTranslation: 'deany.quran.showTranslation',
  textSize: 'deany.quran.textSize',
  lastRead: 'deany.quran.lastRead',
  saved: 'deany.quran.saved',
  layout: 'deany.quran.layout',   // 'mushaf' (recommended) | 'cards'
  mode: 'deany.quran.mode',       // 'read' | 'learn' | 'assist'
};

const canLS = () => typeof window !== 'undefined' && !!window.localStorage;
const get = (k, fb) => { if (!canLS()) return fb; try { const v = window.localStorage.getItem(k); return v == null ? fb : v; } catch (_) { return fb; } };
const set = (k, v) => { if (!canLS()) return; try { window.localStorage.setItem(k, v); } catch (_) {} };

export const getShowTranslation = () => get(KEYS.showTranslation, '1') !== '0';
export const setShowTranslation = (on) => set(KEYS.showTranslation, on ? '1' : '0');

// text size step: 0..4, default 2
export const getTextSize = () => { const n = parseInt(get(KEYS.textSize, '2'), 10); return Number.isFinite(n) ? Math.max(0, Math.min(4, n)) : 2; };
export const setTextSize = (n) => set(KEYS.textSize, String(Math.max(0, Math.min(4, n))));

export const getLastRead = () => { try { return JSON.parse(get(KEYS.lastRead, 'null')); } catch (_) { return null; } };
export const setLastRead = (obj) => set(KEYS.lastRead, JSON.stringify(obj));

// Mushaf layout: 'mushaf' (continuous, recommended) or 'cards' (per-ayah).
export const getLayout = () => (get(KEYS.layout, 'mushaf') === 'cards' ? 'cards' : 'mushaf');
export const setLayout = (v) => set(KEYS.layout, v === 'cards' ? 'cards' : 'mushaf');

// Reading mode: read | learn | assist. Default read.
export const getMode = () => { const m = get(KEYS.mode, 'read'); return ['read', 'learn', 'assist'].includes(m) ? m : 'read'; };
export const setMode = (m) => set(KEYS.mode, ['read', 'learn', 'assist'].includes(m) ? m : 'read');

export const getSaved = () => { try { const a = JSON.parse(get(KEYS.saved, '[]')); return Array.isArray(a) ? a : []; } catch (_) { return []; } };
export const toggleSaved = (surah) => {
  const cur = getSaved();
  const next = cur.includes(surah) ? cur.filter((s) => s !== surah) : [...cur, surah];
  set(KEYS.saved, JSON.stringify(next));
  return next;
};
export const isSaved = (surah) => getSaved().includes(surah);
