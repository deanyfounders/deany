// Generates the DEANY PWA icon set from an inline SVG of the brand mark.
// Dev-only tooling. The generated icons are committed under public/, so this
// only needs to run when the mark changes. `sharp` is NOT a project dependency
// (it is not needed at build time); install it on demand first:
//   npm i -D sharp && node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public');
mkdirSync(outDir, { recursive: true });

const TEAL = '#22A39A';
const TEAL_DEEP = '#0F6E56';

// glyph = Arabic letter dal (د), the DEANY mark. font-size/dy tuned to centre it.
const mark = (fontSize, dy) => `
  <text x="256" y="256" dy="${dy}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', 'Amiri', serif"
        font-size="${fontSize}" font-weight="600" fill="#FFFFFF">د</text>`;

const grad = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${TEAL}"/>
      <stop offset="1" stop-color="${TEAL_DEEP}"/>
    </linearGradient>
  </defs>`;

// Rounded-square (browser/site) icon
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${grad}<rect x="0" y="0" width="512" height="512" rx="112" ry="112" fill="url(#g)"/>${mark(300, 105)}
</svg>`;

// Maskable: full-bleed, glyph inside the ~60% safe zone
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${grad}<rect x="0" y="0" width="512" height="512" fill="url(#g)"/>${mark(230, 82)}
</svg>`;

// Apple touch: full-bleed opaque (iOS applies its own rounding)
const apple = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${grad}<rect x="0" y="0" width="512" height="512" fill="url(#g)"/>${mark(280, 98)}
</svg>`;

const jobs = [
  { svg: rounded,  size: 192, file: 'pwa-192x192.png' },
  { svg: rounded,  size: 512, file: 'pwa-512x512.png' },
  { svg: maskable, size: 512, file: 'pwa-maskable-512x512.png' },
  { svg: apple,    size: 180, file: 'apple-touch-icon.png' },
  { svg: rounded,  size: 64,  file: 'favicon-64.png' },
];

for (const j of jobs) {
  await sharp(Buffer.from(j.svg)).resize(j.size, j.size).png().toFile(join(outDir, j.file));
  console.log('wrote', j.file, `(${j.size}px)`);
}
console.log('done');
