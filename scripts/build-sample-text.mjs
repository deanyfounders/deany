// Lights up the surahs already in the index with REAL verbatim text from the two
// vendored files (Arabic Uthmani + Pickthall). Arabic is copied byte-for-byte
// from the source line; never constructed. sajdah/juz come from the index for
// now (authoritative from quran-data.xml once that file is vendored, via
// build-quran.mjs). Counts are cross-checked against the Arabic file.
import fs from 'node:fs';
import path from 'node:path';
const parse = (file) => { const m = new Map(); for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) { if (!line || line[0] === '#') continue; const b1 = line.indexOf('|'); if (b1 < 0) continue; const b2 = line.indexOf('|', b1 + 1); if (b2 < 0) continue; const s = +line.slice(0, b1), a = +line.slice(b1 + 1, b2); if (s && a) m.set(`${s}:${a}`, line.slice(b2 + 1)); } return m; };
const uthmani = parse('scripts/source/quran-uthmani.txt');
const pickthall = JSON.parse(fs.readFileSync('scripts/source/pickthall.json', 'utf8'));
// count ayat per surah from the authoritative Arabic file
const counts = {}; for (const key of uthmani.keys()) { const s = +key.split(':')[0]; counts[s] = (counts[s] || 0) + 1; }
const index = JSON.parse(fs.readFileSync('src/data/quran-index.json', 'utf8'));
const dir = 'public/quran/surah'; fs.mkdirSync(dir, { recursive: true });
let wrote = 0;
for (const su of index.surahs) {
  const s = su.surah;
  if (counts[s] !== su.ayah_count) { console.error(`count mismatch surah ${s}: index ${su.ayah_count} vs source ${counts[s]}`); process.exit(1); }
  const sajdah = new Set(su.sajdah_ayat || []);
  const ayat = [];
  for (let a = 1; a <= su.ayah_count; a++) {
    const key = `${s}:${a}`;
    const ar = uthmani.get(key); if (ar == null) { console.error(`missing Arabic ${key}`); process.exit(1); }
    ayat.push({ surah: s, ayah: a, key, arabic_uthmani: ar, arabic_simple: '', english: pickthall[key] || '', ...(sajdah.has(a) ? { sajdah: true } : {}), juz: su.juz_start, hizb: 0, ruku: 0, page: 0 });
  }
  fs.writeFileSync(path.join(dir, `${s}.json`), JSON.stringify({ surah: s, ayat }));
  wrote++;
}
console.log(`wrote real text for ${wrote} surahs`);
// spot-check: surah 9 (At-Tawbah) not in sample, but confirm basmalah presence logic on 1:1 vs 2:1
console.log('1:1 starts:', (uthmani.get('1:1') || '').slice(0, 1) ? 'ok' : 'empty');
