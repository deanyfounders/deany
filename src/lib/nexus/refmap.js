// Runtime refmap access (Stage 3 wires this into the reader to paint dots and feed
// the Connections sheet). Fetches the compiled per-surah refmap; failure is silent
// - connections are enhancement, never load-bearing (spec section 11).
const cache = new Map();

export async function loadRefmap(surah) {
  if (cache.has(surah)) return cache.get(surah);
  try {
    const r = await fetch(`/nexus/refmap/${surah}.json`);
    const doc = r.ok ? await r.json() : { surah, entries: [] };
    cache.set(surah, doc);
    return doc;
  } catch (_) {
    return { surah, entries: [] };
  }
}

// The connection entries that include a given ayah key (e.g. "106:1").
export function entriesForAyah(doc, ayahKey) {
  return ((doc && doc.entries) || []).filter((e) => Array.isArray(e.ayat) && e.ayat.includes(ayahKey));
}

// Route progress = lessons completed per route, for connectionState. Best-effort
// from localStorage; defaults to {} (zero progress -> everything AHEAD), which is
// the pilot's correct initial state while content is pending. Overridable in Stage 3
// once the real route/progress store is chosen.
export function getRouteProgress() {
  return {};
}
