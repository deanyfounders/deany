// The Nexus compiler (spec v3.2 sections 3.2, 6, 8). Validates the connection
// graph and regenerates the refmap the reader paints from. It authors nothing and
// touches no Arabic - it only validates candidate refs against the dataset, checks
// story-card schemas + question-pool disjointness, and emits deterministic
// artifacts. Two runs are byte-identical (no Date, no random, sorted throughout).
//
//   node scripts/nexus-compile.mjs          write refmap artifacts
//   node scripts/nexus-compile.mjs --check  verify on-disk artifacts are exactly
//                                           what a fresh deterministic run produces
//                                           (proves determinism + up-to-date); used
//                                           by the accuracy gate, writes nothing.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const CHECK = process.argv.includes('--check');
const errors = [];
const fail = (m) => errors.push(m);
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const rel = (p) => path.relative(ROOT, p);

// --- dataset (for range validation) ---------------------------------------
const index = readJSON(path.join(ROOT, 'src/data/quran-index.json'));
const ayahCount = new Map(index.surahs.map((s) => [s.surah, s.ayah_count]));
const parseKey = (k) => { const m = /^(\d{1,3}):(\d{1,3})$/.exec(String(k || '')); return m ? { s: +m[1], a: +m[2] } : null; };
const validAyah = (s, a) => ayahCount.has(s) && a >= 1 && a <= ayahCount.get(s);

const STATUSES = new Set(['pending_mehdi', 'approved', 'candidate']);
const REL = new Set(['discussed', 'proof_text', 'revealed_in_this_event', 'mentions', 'context']);

// --- gather files ----------------------------------------------------------
const listJSON = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f)) : []);
const refFiles = listJSON(path.join(ROOT, 'content/nexus/refs'));
const cardFiles = listJSON(path.join(ROOT, 'content/story-cards'));

// --- validate refs + expand into refmap entries ----------------------------
// entry: { surah, ayat:[keys], lesson_id, route, position, rel, status, span }
const entries = [];
for (const f of refFiles) {
  let doc; try { doc = readJSON(f); } catch (_) { fail(`${rel(f)}: invalid JSON`); continue; }
  if (!doc.lesson_id) fail(`${rel(f)}: missing lesson_id`);
  if (!doc.route || typeof doc.position !== 'number') fail(`${rel(f)}: missing route/position (route structure the graph needs)`);
  if (!Array.isArray(doc.refs)) { fail(`${rel(f)}: refs must be an array`); continue; }
  doc.refs.forEach((r, i) => {
    const where = `${rel(f)} refs[${i}]`;
    if (r.source !== 'quran') { fail(`${where}: source must be "quran" (got ${JSON.stringify(r.source)})`); return; }
    if (!STATUSES.has(r.status)) { fail(`${where}: status must be pending_mehdi|approved|candidate`); return; }
    if (r.rel != null && !REL.has(r.rel)) fail(`${where}: unknown rel ${JSON.stringify(r.rel)}`);
    const hasKey = typeof r.key === 'string';
    const hasRange = typeof r.from === 'string' && typeof r.to === 'string';
    if (hasKey === hasRange) { fail(`${where}: provide exactly one of key, or from+to`); return; }
    let keys = [];
    if (hasKey) {
      const p = parseKey(r.key);
      if (!p || !validAyah(p.s, p.a)) { fail(`${where}: ${r.key} is not an ayah in the dataset`); return; }
      keys = [`${p.s}:${p.a}`];
    } else {
      const a = parseKey(r.from), b = parseKey(r.to);
      if (!a || !b) { fail(`${where}: from/to must be s:a keys`); return; }
      if (a.s !== b.s) { fail(`${where}: from/to must be in the same surah`); return; }
      if (a.a > b.a) { fail(`${where}: from must not be after to`); return; }
      if (!validAyah(a.s, a.a) || !validAyah(b.s, b.a)) { fail(`${where}: range ${r.from}-${r.to} is outside the dataset`); return; }
      for (let x = a.a; x <= b.a; x++) keys.push(`${a.s}:${x}`);
    }
    const surah = parseKey(keys[0]).s;
    entries.push({ surah, ayat: keys, lesson_id: doc.lesson_id, route: doc.route, position: doc.position, rel: r.rel || null, status: r.status, span: hasKey ? r.key : `${r.from}-${r.to}` });
  });
}

// --- validate story cards + pool disjointness (spec 3.2) -------------------
const REQUIRED_CARD_KEYS = ['id', 'lesson_id', 'status', 'title', 'sections', 'connection_note', 'card_check', 'srs_pool'];
const norm = (q) => String(q || '').trim().replace(/\s+/g, ' ').toLowerCase();
for (const f of cardFiles) {
  let doc; try { doc = readJSON(f); } catch (_) { fail(`${rel(f)}: invalid JSON`); continue; }
  for (const k of REQUIRED_CARD_KEYS) if (!(k in doc)) fail(`${rel(f)}: missing "${k}"`);
  if (!STATUSES.has(doc.status)) fail(`${rel(f)}: bad status`);
  if (!Array.isArray(doc.sections)) fail(`${rel(f)}: sections must be an array`);
  const pool = (arr) => (Array.isArray(arr) ? arr : []).map((x) => x && x.q);
  const cc = pool(doc.card_check), sp = pool(doc.srs_pool);
  // question shape (answer_i must index options) - only enforced once authored
  const shape = (arr, name) => (Array.isArray(arr) ? arr : []).forEach((x, i) => {
    if (norm(x && x.q) === '') return; // empty = pending, skip
    if (!Array.isArray(x.options) || x.options.length < 2) fail(`${rel(f)} ${name}[${i}]: needs >= 2 options`);
    else if (typeof x.answer_i !== 'number' || x.answer_i < 0 || x.answer_i >= x.options.length) fail(`${rel(f)} ${name}[${i}]: answer_i out of range`);
  });
  shape(doc.card_check, 'card_check'); shape(doc.srs_pool, 'srs_pool');
  // approved cards must actually carry content, never render empty (spec sections 3, 8)
  if (doc.status === 'approved') {
    if (norm(doc.title) === '' || !doc.sections.some((s) => norm(s.body) !== '')) fail(`${rel(f)}: approved but title/sections are empty`);
    if (cc.filter((q) => norm(q) !== '').length < 2) fail(`${rel(f)}: approved but fewer than 2 card_check questions`);
  }
  // disjointness across card_check / srs_pool / lesson's own bank (empty ones ignored)
  const bankFile = path.join(ROOT, 'content/quran-lessons', `${doc.lesson_id}.json`);
  const bank = fs.existsSync(bankFile) ? ((readJSON(bankFile).exercises || []).map((e) => e.q || e.question)) : [];
  const seen = new Map();
  for (const [label, list] of [['card_check', cc], ['srs_pool', sp], ['lesson_bank', bank]]) {
    for (const q of list) { const n = norm(q); if (n === '') continue; if (seen.has(n)) fail(`${rel(f)}: question duplicated across ${seen.get(n)} and ${label}: ${JSON.stringify(q)}`); else seen.set(n, label); }
  }
}

// --- connectionState boundary tests ---------------------------------------
try { execSync('node src/lib/nexus/connectionState.test.mjs', { cwd: ROOT, stdio: 'pipe' }); }
catch (e) { fail(`connectionState boundary tests failed: ${`${e.stdout || ''}${e.stderr || ''}`.toString().trim().split('\n').slice(-1)[0]}`); }

if (errors.length) { console.error('nexus-compile: FAILED\n' + errors.map((e) => '  - ' + e).join('\n')); process.exit(1); }

// --- deterministic refmap artifacts ---------------------------------------
// Group by surah; sort surahs and entries stably; expand ayat in order. The
// reader gates painting by flag + status; the compiler emits every ref with its
// status so dev can show pending (marked) and prod only approved.
const bySurah = new Map();
for (const e of entries) { if (!bySurah.has(e.surah)) bySurah.set(e.surah, []); bySurah.get(e.surah).push(e); }
const artifacts = new Map(); // relpath -> content string
const surahList = [...bySurah.keys()].sort((a, b) => a - b);
for (const s of surahList) {
  const list = bySurah.get(s).slice().sort((a, b) => a.lesson_id.localeCompare(b.lesson_id) || a.ayat[0].localeCompare(b.ayat[0]));
  const doc = {
    surah: s,
    entries: list.map((e) => ({ lesson_id: e.lesson_id, route: e.route, position: e.position, rel: e.rel, status: e.status, span: e.span, ayat: e.ayat })),
  };
  artifacts.set(`public/nexus/refmap/${s}.json`, JSON.stringify(doc, null, 2) + '\n');
}
const indexDoc = {
  generated_by: 'scripts/nexus-compile.mjs',
  surahs: surahList,
  lessons: [...new Set(entries.map((e) => e.lesson_id))].sort(),
  hash: crypto.createHash('sha256').update([...artifacts.entries()].sort().map(([k, v]) => k + v).join('')).digest('hex').slice(0, 16),
};
artifacts.set('public/nexus/refmap/index.json', JSON.stringify(indexDoc, null, 2) + '\n');

// --- write or check --------------------------------------------------------
const dir = path.join(ROOT, 'public/nexus/refmap');
if (CHECK) {
  const drift = [];
  const onDisk = fs.existsSync(dir) ? new Set(fs.readdirSync(dir).map((f) => `public/nexus/refmap/${f}`)) : new Set();
  for (const [p, content] of artifacts) {
    const abs = path.join(ROOT, p);
    if (!fs.existsSync(abs)) drift.push(`missing ${p}`);
    else if (fs.readFileSync(abs, 'utf8') !== content) drift.push(`stale ${p}`);
    onDisk.delete(p);
  }
  for (const extra of onDisk) drift.push(`orphan ${extra}`);
  if (drift.length) { console.error('nexus-compile --check: refmap out of date (run `npm run nexus:compile`):\n' + drift.map((d) => '  - ' + d).join('\n')); process.exit(1); }
  console.log(`nexus-compile: OK (check). ${entries.length} refs across ${surahList.length} surah(s); refmap byte-identical, hash ${indexDoc.hash}.`);
} else {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f)); // no orphans
  for (const [p, content] of artifacts) fs.writeFileSync(path.join(ROOT, p), content);
  console.log(`nexus-compile: wrote ${artifacts.size} refmap file(s) for ${surahList.length} surah(s), ${entries.length} refs. hash ${indexDoc.hash}.`);
}
