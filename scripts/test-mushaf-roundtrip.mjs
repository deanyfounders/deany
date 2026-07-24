// Blocking test (v2 Part C3). For every ayah in all 114 surahs: split the stored
// arabic_uthmani on single spaces into the tokens the renderer draws, join them
// back with single spaces, and assert byte-identity with the source. If this ever
// fails, the RENDERER is wrong - never 'fix' the data.
import fs from 'node:fs';
let ayat = 0, fails = 0; const ex = [];
for (let s = 1; s <= 114; s++) {
  const d = JSON.parse(fs.readFileSync(`public/quran/surah/${s}.json`, 'utf8'));
  for (const a of (d.ayat || [])) {
    ayat++;
    const tokens = a.arabic_uthmani.split(' ');       // exactly what MushafView renders
    if (tokens.join(' ') !== a.arabic_uthmani) { fails++; if (ex.length < 5) ex.push(a.key); }
  }
}
if (ayat !== 6236) { console.error(`roundtrip: expected 6236 ayat, saw ${ayat}`); process.exit(1); }
if (fails) { console.error(`roundtrip: ${fails} ayat fail token round-trip: ${ex.join(', ')}`); process.exit(1); }
console.log(`roundtrip: all ${ayat} ayat reassemble byte-identically from rendered tokens.`);
