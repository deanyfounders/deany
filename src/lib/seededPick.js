// Deterministic, seeded selection. The accuracy covenant (Absolute 5) makes
// determinism blocking: a given (seed, pool) must always yield the same questions
// in the same order, so review and grading are reproducible. Any exercise engine
// MUST select through these helpers - never Math.random(), never Date-based seeds.
// Pure functions, no side effects.

// mulberry32: a small, fast, well-distributed 32-bit PRNG. Deterministic per seed.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A stable string -> 32-bit seed, so lesson/exercise ids can drive selection.
export function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < String(str).length; i++) { h ^= String(str).charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// Fisher-Yates using the seeded PRNG. Returns a new array; input is untouched.
export function seededShuffle(arr, seed) {
  const a = arr.slice();
  const rnd = mulberry32(typeof seed === 'number' ? seed : hashSeed(seed));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick `count` items deterministically from a pool.
export function seededPick(arr, count, seed) {
  return seededShuffle(arr, seed).slice(0, Math.max(0, Math.min(count, arr.length)));
}
