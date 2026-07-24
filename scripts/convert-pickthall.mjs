import fs from 'node:fs';
const src = fs.readFileSync('/Users/mehdicheddad/Downloads/en.pickthall.txt', 'utf8');
const out = {};
let n = 0;
for (const line of src.split(/\r?\n/)) {
  if (!line || line[0] === '#') continue;
  const b1 = line.indexOf('|'); if (b1 < 0) continue;
  const b2 = line.indexOf('|', b1 + 1); if (b2 < 0) continue;
  const s = Number(line.slice(0, b1)), a = Number(line.slice(b1 + 1, b2));
  if (!s || !a) continue;
  out[`${s}:${a}`] = line.slice(b2 + 1); // verbatim
  n++;
}
fs.writeFileSync('scripts/source/pickthall.json', JSON.stringify(out));
console.log('pickthall.json:', n, 'verses');
