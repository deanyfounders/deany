// Verification gate (Part B4). Runs in CI and before every ship. Fails loudly.
// It re-derives each Arabic string from the source and asserts byte-identity, so
// any accidental transformation in the build is caught here.
//
// Run: node scripts/verify-quran.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'scripts/source';
const NEED = ['quran-uthmani.txt', 'quran-simple-clean.txt', 'quran-data.xml', 'pickthall.json'];
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
for (const su of (index.surahs || [])) {
  const p = `public/quran/surah/${su.surah}.json`;
  if (!fs.existsSync(p)) { fail(`surah file missing: ${p}`); continue; }
  const ayat = (JSON.parse(fs.readFileSync(p, 'utf8')).ayat) || [];
  if (ayat.length !== metaCounts[su.surah]) fail(`surah ${su.surah} count ${ayat.length} != metadata ${metaCounts[su.surah]}`);
  for (const a of ayat) {
    total++; if (keys.has(a.key)) fail(`duplicate key ${a.key}`); keys.add(a.key);
    if (!a.english) emptyEnglish++;
    if (a.sajdah) genSajda.add(a.key);
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

if (failures) { console.error(`\nverify-quran: ${failures} check(s) failed.`); process.exit(1); }
console.log('\nverify-quran: all checks passed.');
