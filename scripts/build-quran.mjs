// The ONLY writer of generated Qur'an data. Reads the vendored, checksummed
// Tanzil + Pickthall sources and emits src/data/quran-index.json and
// public/quran/surah/N.json. It never constructs or edits an Arabic string: every
// arabic_* value is a verbatim substring of the source line. No network here.
//
// Run: node scripts/build-quran.mjs   (after vendoring the four source files)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'scripts/source';
const NEED = ['quran-uthmani.txt', 'quran-simple-clean.txt', 'quran-data.xml', 'pickthall.json'];

function die(msg) { console.error('build-quran: ' + msg); process.exit(1); }
function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }

// 1. sources must exist; verify checksums if a manifest is present.
for (const f of NEED) if (!fs.existsSync(path.join(SRC, f))) die(`missing source ${f}. Vendor the four Tanzil/Pickthall files first (see scripts/source/README.md).`);
const manifestPath = path.join(SRC, 'CHECKSUMS.sha256');
if (fs.existsSync(manifestPath)) {
  const want = {};
  for (const line of fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([0-9a-f]{64})\s+(?:\*|\s)?(.+)$/i); if (m) want[path.basename(m[2].trim())] = m[1].toLowerCase();
  }
  for (const f of NEED) { const h = sha256(fs.readFileSync(path.join(SRC, f))); if (want[f] && want[f] !== h) die(`checksum mismatch for ${f}. Source drifted.`); }
} else {
  console.warn('build-quran: no CHECKSUMS.sha256 yet - proceeding, but commit one so CI can lock the sources.');
}

// 2. parse Tanzil pipe text: lines "sura|aya|text". Text kept verbatim.
function parseTanzil(file) {
  const map = new Map();
  for (const line of fs.readFileSync(path.join(SRC, file), 'utf8').split(/\r?\n/)) {
    if (!line || line[0] === '#') continue;
    const bar1 = line.indexOf('|'); if (bar1 < 0) continue;
    const bar2 = line.indexOf('|', bar1 + 1); if (bar2 < 0) continue;
    const s = Number(line.slice(0, bar1)), a = Number(line.slice(bar1 + 1, bar2));
    if (!s || !a) continue;
    map.set(`${s}:${a}`, line.slice(bar2 + 1)); // verbatim, no trim
  }
  return map;
}
const uthmani = parseTanzil('quran-uthmani.txt');
const simple = parseTanzil('quran-simple-clean.txt');
const pickthall = JSON.parse(fs.readFileSync(path.join(SRC, 'pickthall.json'), 'utf8')); // { "1:1": "..." } or [{key,text}]
const english = pickthall['1:1'] ? pickthall : Object.fromEntries((pickthall.verses || pickthall).map((v) => [v.key || `${v.surah}:${v.ayah}`, v.text || v.english]));

// 3. metadata (regex over well-formed XML; no dep). Element/attr names per Tanzil quran-data.xml.
const xml = fs.readFileSync(path.join(SRC, 'quran-data.xml'), 'utf8');
const attrs = (s) => { const o = {}; for (const m of s.matchAll(/([\w-]+)\s*=\s*"([^"]*)"/g)) o[m[1]] = m[2]; return o; };
const rows = (tag) => [...xml.matchAll(new RegExp(`<${tag}\\s+([^>]+?)/?>`, 'g'))].map((m) => attrs(m[1]));
const suras = rows('sura');       // index, ayas, name, tname, ename, type, order
const sajdas = rows('sajda');     // index, sura, aya, type
const juzs = rows('juz');         // index, sura, aya
const hizbQ = rows('quarter');    // index, sura, aya  (4 per hizb)
const rukus = rows('ruku');       // index, sura, aya
const pages = rows('page');       // index, sura, aya
if (suras.length !== 114) die(`expected 114 suras in metadata, got ${suras.length}`);

// global ordering to resolve which boundary an ayah falls in
const order = []; const gindex = new Map();
for (const su of suras) { const s = +su.index; for (let a = 1; a <= +su.ayas; a++) { gindex.set(`${s}:${a}`, order.length); order.push(`${s}:${a}`); } }
const boundaryResolver = (list) => {
  const marks = list.map((b) => ({ n: +b.index, g: gindex.get(`${+b.sura}:${+b.aya}`) })).filter((x) => x.g != null).sort((x, y) => x.g - y.g);
  return (g) => { let v = marks.length ? marks[0].n : 0; for (const m of marks) { if (m.g <= g) v = m.n; else break; } return v; };
};
const juzAt = boundaryResolver(juzs);
const hizbAt = (() => { const r = boundaryResolver(hizbQ); return (g) => Math.ceil(r(g) / 4) || 0; })(); // quarter -> hizb
const rukuAt = boundaryResolver(rukus);
const pageAt = boundaryResolver(pages);
const sajdaKeys = new Set(sajdas.map((s) => `${+s.sura}:${+s.aya}`));

// 4. emit
const outSurahDir = 'public/quran/surah';
fs.mkdirSync(outSurahDir, { recursive: true });
fs.mkdirSync('src/data', { recursive: true });
const index = { _generated: true, surahs: [] };
let total = 0;
for (const su of suras) {
  const s = +su.index, count = +su.ayas;
  const ayat = [], sajdahAyat = [];
  for (let a = 1; a <= count; a++) {
    const key = `${s}:${a}`, g = gindex.get(key);
    const ar = uthmani.get(key); if (ar == null) die(`missing Uthmani text for ${key}`);
    const sm = simple.get(key); const en = english[key];
    if (!en) die(`missing English for ${key}`);
    const isSajdah = sajdaKeys.has(key); if (isSajdah) sajdahAyat.push(a);
    ayat.push({ surah: s, ayah: a, key, arabic_uthmani: ar, arabic_simple: sm ?? '', english: en, ...(isSajdah ? { sajdah: true } : {}), juz: juzAt(g), hizb: hizbAt(g), ruku: rukuAt(g), page: pageAt(g) });
    total++;
  }
  fs.writeFileSync(path.join(outSurahDir, `${s}.json`), JSON.stringify({ surah: s, ayat }));
  index.surahs.push({ surah: s, name_ar: su.name, name_tr: su.tname, name_en: su.ename, ayah_count: count, revelation: su.type, juz_start: juzAt(gindex.get(`${s}:1`)), sajdah_ayat: sajdahAyat });
}
fs.writeFileSync('src/data/quran-index.json', JSON.stringify(index, null, 2));
console.log(`build-quran: wrote 114 surah files and index. total ayat = ${total}. sajdah ayat = ${sajdaKeys.size}.`);
if (total !== 6236) die(`verse math failed: total ayat ${total} != 6236`);
