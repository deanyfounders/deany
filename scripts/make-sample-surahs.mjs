// Scaffold-only: writes placeholder surah files (EMPTY Arabic/English) so the
// reader UI renders while real data is pending. build-quran.mjs overwrites these
// with verbatim Tanzil text once the sources are vendored. No Arabic is authored.
import fs from 'node:fs';
import path from 'node:path';
const idx = JSON.parse(fs.readFileSync('src/data/quran-index.json', 'utf8')).surahs;
const outDir = 'public/quran/surah';
fs.mkdirSync(outDir, { recursive: true });
for (const s of idx) {
  const sajdah = new Set(s.sajdah_ayat || []);
  const ayat = [];
  for (let a = 1; a <= s.ayah_count; a++) {
    ayat.push({
      surah: s.surah, ayah: a, key: `${s.surah}:${a}`,
      arabic_uthmani: "", arabic_simple: "", english: "",
      ...(sajdah.has(a) ? { sajdah: true } : {}),
      juz: s.juz_start, hizb: 0, ruku: 0, page: 0, _pending: true,
    });
  }
  fs.writeFileSync(path.join(outDir, `${s.surah}.json`), JSON.stringify({ surah: s.surah, _pending: true, ayat }));
}
console.log(`wrote ${idx.length} placeholder surah files`);
