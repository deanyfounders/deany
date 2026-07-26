// The Islamic accuracy gate. This is the executable form of
// ISLAMIC_ACCURACY_COVENANT.md - the single blocking check that every one of the
// five absolutes reduces to. `npm run verify` and the `prebuild` hook run it; a
// red result is a STOP, not a TODO. It authors nothing and touches no Arabic; it
// only re-derives, measures, and refuses.
//
// Run: node scripts/accuracy-gate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const results = []; // { absolute, name, ok, detail }
const record = (absolute, name, ok, detail = '') => results.push({ absolute, name, ok, detail });

// A check throws on failure with a human message; its return string is the pass
// note. Async-capable so checks may dynamically import app modules.
async function check(absolute, name, fn) {
  try { const detail = await fn(); record(absolute, name, true, detail || ''); }
  catch (e) { record(absolute, name, false, e && e.message ? e.message : String(e)); }
}
// Run an existing blocking script; reuse rather than duplicate its logic.
function runScript(absolute, name, file) {
  try { execSync(`node ${file}`, { cwd: ROOT, stdio: 'pipe' }); record(absolute, name, true, `${file} passed`); }
  catch (e) {
    const out = `${(e.stdout || '')}${(e.stderr || '')}`.toString().trim().split('\n').filter(Boolean);
    record(absolute, name, false, out.slice(-2).join(' | ') || `${file} exited non-zero`);
  }
}
const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

// ---------------------------------------------------------------------------
// ABSOLUTE 1 - Never type, generate, edit, or "fix" Qur'anic Arabic.
// The byte-identity re-derivation (verify-quran) and the token round-trip are the
// definition of correct. Checksums on the vendored sources live inside verify.
// ---------------------------------------------------------------------------
runScript(1, 'Arabic byte-identity + source checksums (verify-quran)', 'scripts/verify-quran.mjs');
runScript(1, 'Renderer token round-trip is byte-identical', 'scripts/test-mushaf-roundtrip.mjs');

// ---------------------------------------------------------------------------
// ABSOLUTE 2 - Never author religious content.
// Every content file is a container. `pending_mehdi` files must be EMPTY of
// authored prose (empty renders as "under scholar review", never invented text);
// `approved` files must carry provenance. No free-text may leak into a pending file.
// ---------------------------------------------------------------------------
const STRUCTURAL_KEYS = new Set(['id', 'status', 'type', 'school', 'surah', 'ayah', 'key', 'glyph_ref']);
const isPlaceholder = (v) => v === '' || (typeof v === 'string' && v.includes('|'));
// Walk every string leaf; return [{path, key, value}] of authored-looking strings.
function proseLeaves(node, keyName = '', trail = '$') {
  const out = [];
  if (typeof node === 'string') {
    if (!STRUCTURAL_KEYS.has(keyName) && !isPlaceholder(node)) out.push({ path: trail, key: keyName, value: node });
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => out.push(...proseLeaves(v, keyName, `${trail}[${i}]`)));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) out.push(...proseLeaves(v, k, `${trail}.${k}`));
  }
  return out;
}
function contentFiles() {
  const dir = path.join(ROOT, 'content');
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.json')) out.push(p); } };
  walk(dir);
  return out;
}
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

await check(2, 'Content files are typed and status-gated', () => {
  const files = contentFiles();
  assert(files.length > 0, 'no content/ files found - the gated container store is missing');
  const bad = [];
  for (const f of files) {
    let j; try { j = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { bad.push(`${path.relative(ROOT, f)}: invalid JSON`); continue; }
    if (!['pending_mehdi', 'approved', 'candidate'].includes(j.status)) bad.push(`${path.relative(ROOT, f)}: status must be pending_mehdi|approved|candidate (got ${JSON.stringify(j.status)})`);
  }
  assert(bad.length === 0, bad.join('; '));
  return `${files.length} content files, all typed`;
});

await check(2, 'pending_mehdi files contain no authored text', () => {
  const offenders = [];
  for (const f of contentFiles()) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (j.status !== 'pending_mehdi') continue;
    const leaves = proseLeaves(j).filter((l) => l.value.trim() !== '');
    if (leaves.length) offenders.push(`${path.relative(ROOT, f)} -> ${leaves.map((l) => `${l.path}=${JSON.stringify(l.value.slice(0, 40))}`).join(', ')}`);
  }
  assert(offenders.length === 0, `authored text leaked into pending files: ${offenders.join(' ; ')}`);
  return 'every pending file is an empty container';
});

// ---------------------------------------------------------------------------
// ABSOLUTE 3 - Never state what scholars are unsure about as fact.
// No feature may require picking a contested side (the reason there is no
// tajwid-correction feature). Any madhhab `rulings` must come from an approved,
// sourced file - never bare in code.
// ---------------------------------------------------------------------------
await check(3, 'No contested-position feature (e.g. tajwid correction)', () => {
  const banned = /tajwid[-_ ]?correct|correct[-_ ]?(recitation|pronunciation)|recitation[-_ ]?grade/i;
  const hits = [];
  const scan = (dir) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) { if (!/node_modules|dist|\.git|\.cctmp/.test(p)) scan(p); } else if (/\.(jsx?|tsx?|mjs)$/.test(e.name)) { if (banned.test(fs.readFileSync(p, 'utf8'))) hits.push(path.relative(ROOT, p)); } } };
  scan(path.join(ROOT, 'src'));
  assert(hits.length === 0, `found a recitation/tajwid-judgement feature in: ${hits.join(', ')}`);
  return 'no feature asserts a contested recitation/fiqh position';
});

await check(3, 'Madhhab rulings only ship from approved, sourced files', () => {
  const offenders = [];
  for (const f of contentFiles()) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const hasRulings = Array.isArray(j.rulings) && j.rulings.some((r) => (r.position || '').trim() !== '');
    if (!hasRulings) continue;
    const sourced = Array.isArray(j.sources) && j.sources.some((s) => (s.ref || '').trim() !== '');
    if (j.status !== 'approved' || !sourced) offenders.push(path.relative(ROOT, f));
  }
  assert(offenders.length === 0, `rulings present without approval+source: ${offenders.join(', ')}`);
  return 'contested positions carry approval + provenance or are empty';
});

// ---------------------------------------------------------------------------
// ABSOLUTE 4 - Never let unverified content reach production.
// nexus_pilot is hard-off in production; approved files carry attribution; a
// reading surface always renders provenance.
// ---------------------------------------------------------------------------
await check(4, 'nexus_pilot flag is off in a production context', async () => {
  const flags = await import(pathToFileURL(path.join(ROOT, 'src/lib/flags.js')).href);
  assert(typeof flags.nexusPilotEnabled === 'function', 'src/lib/flags.js must export nexusPilotEnabled()');
  assert(flags.nexusPilotEnabled() === false, 'nexusPilotEnabled() must be false when not in an opted-in dev context');
  assert(flags.NEXUS_PILOT_PROD_DEFAULT === false, 'NEXUS_PILOT_PROD_DEFAULT must be false');
  return 'candidate/pilot content stays behind an off-by-default flag';
});

await check(4, 'approved content carries provenance', () => {
  const offenders = [];
  for (const f of contentFiles()) {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (j.status !== 'approved') continue;
    const sourced = Array.isArray(j.sources) && j.sources.some((s) => (s.ref || '').trim() !== '');
    if (!sourced) offenders.push(path.relative(ROOT, f));
  }
  assert(offenders.length === 0, `approved files missing a source ref: ${offenders.join(', ')}`);
  return 'every approved file cites a source';
});

await check(4, 'Reading surface renders attribution (Tanzil + translator)', () => {
  const q = path.join(ROOT, 'src/app/quran');
  assert(fs.existsSync(path.join(q, 'Attribution.jsx')), 'Attribution component is missing');
  const importsAttribution = fs.readdirSync(q).some((f) => f !== 'Attribution.jsx' && /\.jsx$/.test(f) && /import\s+Attribution/.test(fs.readFileSync(path.join(q, f), 'utf8')));
  assert(importsAttribution, 'no reading surface imports Attribution');
  return 'attribution is wired into the reader';
});

// ---------------------------------------------------------------------------
// ABSOLUTE 5 - Never bypass the tests to ship.
// Verse math, basmalah rules, juz tiling, question-pool disjointness, determinism.
// (Verse math + juz tiling also run inside verify-quran; asserted here for the
// covenant report, straight off the generated data.)
// ---------------------------------------------------------------------------
const index = readJSON('src/data/quran-index.json');
const surah = (n) => readJSON(`public/quran/surah/${n}.json`).ayat;

await check(5, 'Verse math: 6236 ayat, 114 surahs, 15 sajdah', () => {
  assert(Array.isArray(index.surahs) && index.surahs.length === 114, `expected 114 surahs, got ${index.surahs && index.surahs.length}`);
  let total = 0, sajdah = 0;
  for (const s of index.surahs) { const a = surah(s.surah); total += a.length; sajdah += a.filter((x) => x.sajdah).length; }
  assert(total === 6236, `expected 6236 ayat, got ${total}`);
  assert(sajdah === 15, `expected 15 sajdah ayat, got ${sajdah}`);
  return '114 / 6236 / 15';
});

await check(5, 'Basmalah rules (surah 1 keeps 1:1; 2-114 detach except 9)', () => {
  const REF = surah(1)[0].arabic_uthmani.split(' ');
  assert(REF.length === 4, `surah 1:1 is the 4-word basmalah, got ${REF.length} tokens`);
  // Tokens 1-3 (Allah / Ar-Rahman / Ar-Rahim) are byte-invariant across the whole
  // mushaf. Token 0 (bi-smi) legitimately carries a wasl shadda in surahs 95 & 97
  // (بِّسْمِ). We compare that ONE token with the shadda removed - read-only, for
  // membership only; the stored Arabic is never touched or rewritten.
  const stripShadda = (s) => s.replace(/ّ/g, '');
  const opensWithBasmalah = (first) => {
    const t = first.split(' ');
    return t.length >= 4 && t[1] === REF[1] && t[2] === REF[2] && t[3] === REF[3]
      && stripShadda(t[0]) === stripShadda(REF[0]);
  };
  const problems = [];
  for (let n = 2; n <= 114; n++) {
    const opens = opensWithBasmalah(surah(n)[0].arabic_uthmani);
    if (n === 9) { if (opens) problems.push('surah 9 must NOT begin with the basmalah'); }
    else if (!opens) problems.push(`surah ${n}:1 must begin with the detachable basmalah`);
  }
  assert(problems.length === 0, problems.join('; '));
  return 'surah 1 keeps it as ayah 1; 2-114 detach it (incl. the 95/97 wasl form); 9 has none';
});

await check(5, 'Juz tiling: 30 starts tile 6236 ayat, boundaries stamped', () => {
  const juz = index.juz || [];
  assert(juz.length === 30, `expected 30 juz starts, got ${juz.length}`);
  const starts = [...juz].sort((a, b) => a.juz - b.juz);
  assert(starts[0].ordinal === 0, 'juz 1 must start at ordinal 0');
  for (let i = 1; i < 30; i++) assert(starts[i].ordinal > starts[i - 1].ordinal, `juz ${i + 1} start is not after juz ${i}`);
  // spot-check the off-by-one at a boundary, from the stamped data
  const j2 = starts[1];
  const at = (s, a) => surah(s).find((x) => x.ayah === a);
  assert(at(1, 1).juz === 1 && at(114, 6).juz === 30, 'endpoints must be juz 1 and juz 30');
  assert(at(j2.surah, j2.ayah).juz === 2, 'juz 2 start ayah must be stamped juz 2');
  return '30 juz tile the text; per-ayah stamps agree';
});

await check(5, 'Question pools: disjoint, no inline scripture, deterministic', () => {
  const dir = path.join(ROOT, 'content/quran-lessons');
  const lessons = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  let exercises = 0;
  for (const f of lessons) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const ex of (j.exercises || [])) {
      exercises++;
      const opts = ex.options || ex.choices || [];
      // disjointness: options must be unique (a wrong answer can never equal another)
      assert(new Set(opts.map((o) => JSON.stringify(o))).size === opts.length, `${f}: exercise ${ex.id || ''} has duplicate options`);
      // no raw Arabic assembled into an option (scripture only ever comes by key from the pipeline)
      for (const o of opts) assert(!(typeof o === 'string' && ARABIC.test(o)), `${f}: exercise ${ex.id || ''} embeds inline Arabic - reference ayat by key, never inline`);
      if (typeof ex.correctIndex === 'number') assert(ex.correctIndex >= 0 && ex.correctIndex < opts.length, `${f}: correctIndex out of range`);
    }
  }
  return `${lessons.length} lessons, ${exercises} exercises validated`;
});

await check(5, 'Seeded selection is deterministic', async () => {
  const { seededShuffle } = await import(pathToFileURL(path.join(ROOT, 'src/lib/seededPick.js')).href);
  const a = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 12345);
  const b = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 12345);
  assert(JSON.stringify(a) === JSON.stringify(b), 'same seed produced different orders');
  assert(a.length === 10 && new Set(a).size === 10, 'shuffle dropped or duplicated items');
  return 'same seed -> same order';
});

// The seeded check is async; give the microtask a tick before we report.
await Promise.resolve();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const ABSOLUTES = {
  1: 'Never type, generate, edit, or "fix" Qur’anic Arabic',
  2: 'Never author religious content',
  3: 'Never state what scholars are unsure about as fact',
  4: 'Never let unverified content reach production',
  5: 'Never bypass the tests to ship',
};
let failed = 0;
console.log('\n  ISLAMIC ACCURACY GATE\n  ' + '─'.repeat(52));
for (const n of [1, 2, 3, 4, 5]) {
  console.log(`\n  Absolute ${n} — ${ABSOLUTES[n]}`);
  for (const r of results.filter((x) => x.absolute === n)) {
    if (!r.ok) failed++;
    console.log(`    ${r.ok ? 'ok  ' : 'FAIL'}  ${r.name}${r.detail ? `  — ${r.detail}` : ''}`);
  }
}
console.log('\n  ' + '─'.repeat(52));
if (failed) { console.error(`  ACCURACY GATE FAILED: ${failed} check(s) red. This is a stop, not a TODO.\n`); process.exit(1); }
console.log(`  Accuracy gate green: all ${results.length} checks passed. The covenant holds.\n`);
