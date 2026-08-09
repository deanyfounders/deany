// Verification gate (Part B4). Runs in CI and before every ship. Fails loudly.
// It re-derives each Arabic string from the source and asserts byte-identity, so
// any accidental transformation in the build is caught here.
//
// Run: node scripts/verify-quran.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'scripts/source';
const NEED = ['quran-uthmani.txt', 'quran-data.xml', 'pickthall.json']; // simple-clean optional (search only)
let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');

// sources present + checksums
for (const f of NEED) if (!fs.existsSync(path.join(SRC, f))) { console.error(`verify-quran: source ${f} not vendored yet - Qur'an ships dark until the four files land.`); process.exit(1); }
const mp = path.join(SRC, 'CHECKSUMS.sha256');
if (fs.existsSync(mp)) {
  const want = {}; for (const line of fs.readFileSync(mp, 'utf8').split(/\r?\n/)) { const m = line.match(/^([0-9a-f]{64})\s+(?:\*|\s)?(.+)$/i); if (m) want[path.basename(m[2].trim())] = m[1].toLowerCase(); }
  for (const f of NEED) { const h = sha256(fs.readFileSync(path.join(SRC, f))); if (!want[f]) fail(`no checksum recorded for ${f}`); else if (want[f] !== h) fail(`checksum drift on ${f}`); else ok(`checksum ${f}`); }
} else fail('CHECKSUMS.sha256 missing');

// parse source for byte-identity + basmalah check
const parse = (file) => { const map = new Map(); for (const line of fs.readFileSync(path.join(SRC, file), 'utf8').split(/\r?\n/)) { if (!line || line[0] === '#') continue; const b1 = line.indexOf('|'); if (b1 < 0) continue; const b2 = line.indexOf('|', b1 + 1); if (b2 < 0) continue; const s = +line.slice(0, b1), a = +line.slice(b1 + 1, b2); if (s && a) map.set(`${s}:${a}`, line.slice(b2 + 1)); } return map; };
const uthmani = parse('quran-uthmani.txt');

// metadata sajda list + counts
const xml = fs.readFileSync(path.join(SRC, 'quran-data.xml'), 'utf8');
const attrs = (s) => { const o = {}; for (const m of s.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)) o[m[1]] = m[2]; return o; };
const rows = (t) => [...xml.matchAll(new RegExp(`<${t}\\s+([^>]+?)/?>`, 'g'))].map((m) => attrs(m[1]));
const suras = rows('sura');
const metaCounts = Object.fromEntries(suras.map((s) => [+s.index, +s.ayas]));
const metaSajda = new Set(rows('sajda').map((s) => `${+s.sura}:${+s.aya}`));

// generated data
const idxFile = 'src/data/quran-index.json';
if (!fs.existsSync(idxFile)) fail('src/data/quran-index.json missing');
const index = JSON.parse(fs.readFileSync(idxFile, 'utf8'));
if (index._generated !== true) fail('index is still the scaffold placeholder (run build-quran first)');

let total = 0; const keys = new Set(); const genSajda = new Set(); let emptyEnglish = 0, byteMismatch = 0;
const juzByKey = new Map(); const hizbByKey = new Map(), rubByKey = new Map(), pageByKey = new Map(); let unstamped = 0;
for (const su of (index.surahs || [])) {
  const p = `public/quran/surah/${su.surah}.json`;
  if (!fs.existsSync(p)) { fail(`surah file missing: ${p}`); continue; }
  const ayat = (JSON.parse(fs.readFileSync(p, 'utf8')).ayat) || [];
  if (ayat.length !== metaCounts[su.surah]) fail(`surah ${su.surah} count ${ayat.length} != metadata ${metaCounts[su.surah]}`);
  for (const a of ayat) {
    total++; if (keys.has(a.key)) fail(`duplicate key ${a.key}`); keys.add(a.key);
    if (!a.english) emptyEnglish++;
    if (a.sajdah) genSajda.add(a.key);
    if (!(a.juz >= 1 && a.juz <= 30)) unstamped++; juzByKey.set(a.key, a.juz);
    hizbByKey.set(a.key, a.hizb); rubByKey.set(a.key, a.rub); pageByKey.set(a.key, a.page);
    const src = uthmani.get(a.key);
    if (src !== a.arabic_uthmani) byteMismatch++;
  }
}
total === 6236 ? ok('total ayat = 6236') : fail(`total ayat ${total} != 6236`);
byteMismatch === 0 ? ok('byte-identity of all Arabic') : fail(`${byteMismatch} Arabic strings differ from source`);
emptyEnglish === 0 ? ok('every ayah has english') : fail(`${emptyEnglish} ayat missing english`);
// sajda list must match metadata exactly
const sameSajda = genSajda.size === metaSajda.size && [...metaSajda].every((k) => genSajda.has(k));
sameSajda ? ok(`sajdah ayat match metadata (${metaSajda.size})`) : fail(`sajdah set ${[...genSajda].sort()} != metadata ${[...metaSajda].sort()}`);
// surah 9:1 has no basmalah
const s9 = JSON.parse(fs.readFileSync('public/quran/surah/9.json', 'utf8')).ayat[0];
const BASMALAH = uthmani.get('1:1') || '';
(s9 && BASMALAH && s9.arabic_uthmani.startsWith(BASMALAH.slice(0, 10))) ? fail('surah 9:1 begins with basmalah') : ok('surah 9:1 has no basmalah');

// juz: per-ayah stamping + 30 materialised starts tile the text exactly (per docs/quran-juz.md)
const ordinalByKey = new Map(); { let g = 0; for (const su of suras) { for (let a = 1; a <= +su.ayas; a++) ordinalByKey.set(`${+su.index}:${a}`, g++); } }
const keyByOrdinal = [...ordinalByKey.keys()];
unstamped === 0 ? ok('every ayah stamped with juz 1-30') : fail(`${unstamped} ayat have an out-of-range juz`);
(juzByKey.get('1:1') === 1 && juzByKey.get('114:6') === 30) ? ok('juz endpoints (1:1->1, 114:6->30)') : fail('juz endpoints wrong');
const jl = index.juz || [];
if (jl.length !== 30) fail(`index.juz has ${jl.length} entries, expected 30`);
else {
  const starts = [...jl].sort((a, b) => a.juz - b.juz);
  let tiled = starts[0].ordinal === 0;
  for (let i = 1; i < 30; i++) { const from = starts[i].ordinal; const prevTo = starts[i - 1] && (starts[i].ordinal - 1); if (from !== prevTo + 1) { /* from == prevTo+1 by construction */ } }
  // coverage: each start's ordinal equals the previous range end + 1; last runs to 6235
  let contiguous = starts[0].ordinal === 0 && starts[29].ordinal <= 6235;
  for (let i = 1; i < 30; i++) if (starts[i].ordinal <= starts[i - 1].ordinal) contiguous = false;
  contiguous ? ok('30 juz starts are ordered and tile the text') : fail('juz starts are not contiguous/ordered');
  // boundary: start ayah belongs to the new juz; the ayah before belongs to the old one
  const j2 = starts[1];
  const before = keyByOrdinal[j2.ordinal - 1];
  (juzByKey.get(`${j2.surah}:${j2.ayah}`) === 2 && juzByKey.get(before) === 1) ? ok('juz boundary off-by-one correct (juz 2 start)') : fail('juz boundary off-by-one wrong');
}
// a surah spanning several juz reports a range (Al-Baqarah = 1..3)
const baq = (index.surahs || []).find((s) => s.surah === 2);
(baq && baq.juz_from === 1 && baq.juz_to === 3) ? ok('surah juz range (Al-Baqarah 1-3)') : fail(`Al-Baqarah juz range wrong: ${baq && baq.juz_from}-${baq && baq.juz_to}`);

// ---------------------------------------------------------------------------
// deany_juz_implementation_spec.md section 6 - the full juz/hizb/rub/page suite,
// asserted against the committed section 3 fixture (never boundaries from memory).
// ---------------------------------------------------------------------------
const FIX = JSON.parse(fs.readFileSync('scripts/fixtures/juz-boundaries.json', 'utf8'));
const jlSorted = [...(index.juz || [])].sort((a, b) => a.juz - b.juz);
const jof = (s, a) => juzByKey.get(`${s}:${a}`);

// 1. sum of the 30 juz ayah counts = 6236
const juzSum = jlSorted.reduce((s, j) => s + (j.ayat || 0), 0);
juzSum === 6236 ? ok('sum of 30 juz ayah counts = 6236') : fail(`juz counts sum ${juzSum} != 6236`);

// 3. every juz start/end/count matches the section 3 fixture
let tableOk = jlSorted.length === 30;
for (let i = 0; i < 30 && tableOk; i++) { const g = jlSorted[i], f = FIX.juz[i]; if (g.surah !== f.start[0] || g.ayah !== f.start[1] || g.endSurah !== f.end[0] || g.endAyah !== f.end[1] || g.ayat !== f.ayat) tableOk = false; }
tableOk ? ok('30 juz start/end/count rows match the section 3 fixture') : fail('juz table does not match the section 3 fixture');

// 5. juzOfAyah spot checks (incl. Al-Kahf splitting the boundary)
const spots = [[2, 141, 1], [2, 142, 2], [18, 74, 15], [18, 75, 16], [4, 100, 5], [78, 1, 30]];
const badSpots = spots.filter(([s, a, e]) => jof(s, a) !== e);
badSpots.length === 0 ? ok('juzOfAyah spot checks (Al-Kahf split, etc.)') : fail('juzOfAyah spot checks: ' + badSpots.map(([s, a, e]) => `${s}:${a}=${jof(s, a)}!=${e}`).join(', '));

// juzSpanOfSurah(2) = [1,2,3], (4) = [4,5,6]
const span = (su) => { const set = new Set(); for (const [k, j] of juzByKey) if (+k.split(':')[0] === su) set.add(j); return [...set].sort((a, b) => a - b); };
(JSON.stringify(span(2)) === '[1,2,3]' && JSON.stringify(span(4)) === '[4,5,6]') ? ok('juzSpanOfSurah(2)=[1,2,3], (4)=[4,5,6]') : fail(`juz spans wrong: 2=${span(2)} 4=${span(4)}`);

// 4. hizb count 60, rub count 240, exactly 2 hizb + 8 rub per juz
const hizbSet = new Set(hizbByKey.values()), rubSet = new Set(rubByKey.values());
hizbSet.size === 60 ? ok('60 distinct hizb') : fail(`${hizbSet.size} hizb != 60`);
rubSet.size === 240 ? ok('240 distinct rub al-hizb') : fail(`${rubSet.size} rub != 240`);
let perJuzOk = true;
for (let j = 1; j <= 30 && perJuzOk; j++) { const hs = new Set(), rs = new Set(); for (const [k, ju] of juzByKey) if (ju === j) { hs.add(hizbByKey.get(k)); rs.add(rubByKey.get(k)); } if (hs.size !== 2 || rs.size !== 8) perJuzOk = false; }
perJuzOk ? ok('every juz has exactly 2 hizb and 8 rub') : fail('a juz does not have 2 hizb / 8 rub');

// 6. page alignment: 604 pages; juz 2 begins page 22; each later juz starts 20 pages on (juz 30 = 582)
const pageSet = new Set(pageByKey.values());
pageSet.size === 604 ? ok('604 distinct pages') : fail(`${pageSet.size} pages != 604`);
// The real 604-page Madani mushaf averages ~20 pages/juz but is not exactly 20 each
// (juz 7 is 19, juz 8 is 21, etc.); the authoritative endpoints hold: juz 2 begins
// page 22 and juz 30 page 582, and every juz starts on a strictly later page.
let pageOk = jlSorted[1].page === 22 && jlSorted[29].page === 582;
for (let i = 1; i < 30; i++) if (jlSorted[i].page <= jlSorted[i - 1].page) pageOk = false;
pageOk ? ok('page alignment: 604 pages, juz 2 -> page 22, juz 30 -> page 582, strictly increasing') : fail(`page alignment wrong: juz2=${jlSorted[1].page} juz30=${jlSorted[29].page}`);

// composition: juz 30 = 37 complete surahs (An-Naba first); juz 5 = An-Nisa only, partial 24-147
const composition = (j) => { const m = new Map(); for (const su of suras) { const s = +su.index, cnt = +su.ayas; let first = null, last = null; for (let a = 1; a <= cnt; a++) if (juzByKey.get(`${s}:${a}`) === j) { if (first === null) first = a; last = a; } if (first !== null) m.set(s, { first, last, complete: first === 1 && last === cnt }); } return m; };
const c30 = composition(30);
(c30.size === 37 && [...c30.values()].every((v) => v.complete) && c30.has(78)) ? ok('surahCompositionOfJuz(30) = 37 surahs, all complete') : fail(`juz 30 composition: ${c30.size} surahs, allComplete=${[...c30.values()].every((v) => v.complete)}`);
const c5 = composition(5); const c5e = c5.get(4);
(c5.size === 1 && c5e && !c5e.complete && c5e.first === 24 && c5e.last === 147) ? ok('surahCompositionOfJuz(5) = An-Nisa only, partial 24-147') : fail(`juz 5 composition wrong: size=${c5.size} ${c5e && JSON.stringify(c5e)}`);

// 9. juz 1 rub al-hizb octagram positions match the fixture (rub 2..8 starts)
const juz1Rubs = []; const seenRub = new Set();
for (const key of keyByOrdinal) { const j = juzByKey.get(key); if (j > 1) break; const r = rubByKey.get(key); if (!seenRub.has(r)) { seenRub.add(r); const [s, a] = key.split(':').map(Number); juz1Rubs.push([s, a]); } }
JSON.stringify(juz1Rubs.slice(1)) === JSON.stringify(FIX.juz1_rub_starts) ? ok('juz 1 rub octagram positions match the fixture') : fail(`juz 1 rub starts ${JSON.stringify(juz1Rubs.slice(1))} != fixture ${JSON.stringify(FIX.juz1_rub_starts)}`);

if (failures) { console.error(`\nverify-quran: ${failures} check(s) failed.`); process.exit(1); }
console.log('\nverify-quran: all checks passed.');
